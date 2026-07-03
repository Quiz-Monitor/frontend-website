import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
  isExpanded: boolean;
  toggleSidebar: () => void;
  sidebarWidth: number;
}

const SidebarContext = createContext<SidebarContextType>({
  isExpanded: false,
  toggleSidebar: () => {},
  sidebarWidth: 70,
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    const stored = localStorage.getItem('sidebarExpanded');
    return stored === 'true';
  });

  const sidebarWidth = isExpanded ? 220 : 70;

  const toggleSidebar = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      localStorage.setItem('sidebarExpanded', String(next));
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
  }, [sidebarWidth]);

  return (
    <SidebarContext.Provider value={{ isExpanded, toggleSidebar, sidebarWidth }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
