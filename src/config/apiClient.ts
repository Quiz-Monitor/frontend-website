import { refreshToken as refreshAuthToken } from '../services/authService';

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

function getAuthHeaders(initHeaders?: HeadersInit): HeadersInit {
  const token = localStorage.getItem('authToken');
  const headers = new Headers(initHeaders);
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  return headers;
}

export async function fetchWithAuth(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const customInit: RequestInit = {
    ...init,
    headers: getAuthHeaders(init?.headers),
  };

  const response = await fetch(input, customInit);

  if (response.status === 401) {
    const originalRequest = { input, init: customInit };
    
    if (isRefreshing) {
      // If a refresh is already in progress, wait for it to complete
      return new Promise<Response>((resolve, reject) => {
        failedQueue.push({
          resolve: () => {
            // Once refreshed, retry the request with the newly set token in localStorage
            originalRequest.init.headers = getAuthHeaders(init?.headers);
            fetch(originalRequest.input, originalRequest.init).then(resolve).catch(reject);
          },
          reject: (err) => {
            reject(err);
          },
        });
      });
    }

    isRefreshing = true;

    try {
      // Try to get a new token
      await refreshAuthToken();
      processQueue(null);
      
      // Retry the original request
      originalRequest.init.headers = getAuthHeaders(init?.headers);
      const retryResponse = await fetch(originalRequest.input, originalRequest.init);
      return retryResponse;
    } catch (error) {
      // Refresh failed (e.g., refresh token expired)
      processQueue(error as Error);
      
      // Clear auth data and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('authRefreshToken');
      localStorage.removeItem('authExpiresAt');
      localStorage.removeItem('authUser');
      localStorage.removeItem('userRole');
      
      window.location.href = '/login';
      throw error;
    } finally {
      isRefreshing = false;
    }
  }

  return response;
}
