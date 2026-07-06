import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Shield, Eye, Smartphone, FileText, ArrowRight, Play, 
  CheckCircle, BarChart3, Zap, Lock, Users, Twitter, Linkedin, 
  Github, Mail, Star, TrendingUp, Award, Sparkles, Camera, Monitor,
  LineChart, Globe, Rocket, ChevronRight, Check, X, ArrowUpRight,
  Layers, Code, Database, Cloud, Server, Cpu, Activity, Target,
  Briefcase, GraduationCap, Building2
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function SaaSLandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const refreshToken = localStorage.getItem('authRefreshToken');
    const expiresAt = localStorage.getItem('authExpiresAt');

    if (!token || !refreshToken) return;

    if (expiresAt) {
      const expiryDate = new Date(expiresAt);
      if (Number.isFinite(expiryDate.getTime()) && expiryDate <= new Date()) {
        return;
      }
    }

    let role = localStorage.getItem('userRole');

    if (!role) {
      const userRaw = localStorage.getItem('authUser');
      if (userRaw) {
        try {
          const user = JSON.parse(userRaw) as { role?: string };
          if (user.role) {
            role = user.role.toLowerCase();
          }
        } catch {
          // ignore parse errors
        }
      }
    }

    const normalizedRole = role?.toLowerCase();

    if (normalizedRole === 'instructor' || normalizedRole === 'educator') {
      navigate('/instructor', { replace: true });
    } else if (normalizedRole === 'student') {
      navigate('/student', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const stats = [
    { value: '10K+', label: 'Active Educators', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { value: '500K+', label: 'Exams Conducted', icon: FileText, color: 'from-purple-500 to-pink-500' },
    { value: '99.9%', label: 'Uptime Guaranteed', icon: Award, color: 'from-green-500 to-emerald-500' },
    { value: '150+', label: 'Countries', icon: Globe, color: 'from-orange-500 to-red-500' }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Proctoring',
      description: 'Advanced machine learning algorithms detect suspicious behavior in real-time with 99.8% accuracy.',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      image: 'https://images.unsplash.com/photo-1686061594225-3e92c0cd51b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwZGFzaGJvYXJkJTIwYW5hbHl0aWNzfGVufDF8fHx8MTc2NDQ4NzA1N3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      icon: Shield,
      title: 'Military-Grade Security',
      description: 'End-to-end encryption ensures complete data privacy and compliance with GDPR, FERPA, and SOC 2.',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      image: 'https://images.unsplash.com/photo-1569154708059-3581bd7b57e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN1cml0eSUyMHNoaWVsZCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY0NTYwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep insights into exam performance, integrity scores, and behavioral patterns with predictive AI.',
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      image: 'https://images.unsplash.com/photo-1705909770198-7e83c24e1616?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjBtaW5pbWFsfGVufDF8fHx8MTc2NDUxMzg2N3ww&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  const capabilities = [
    { icon: Eye, label: 'Facial Recognition', color: 'blue' },
    { icon: Monitor, label: 'Screen Monitoring', color: 'purple' },
    { icon: Camera, label: 'Live Webcam', color: 'pink' },
    { icon: Lock, label: 'Browser Lockdown', color: 'green' },
    { icon: Activity, label: 'Behavior Analysis', color: 'orange' },
    { icon: Target, label: 'Focus Detection', color: 'red' }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: { monthly: 49, yearly: 490 },
      description: 'Perfect for individual educators',
      icon: GraduationCap,
      features: [
        { text: 'Up to 50 students', included: true },
        { text: '100 exams per month', included: true },
        { text: 'Basic AI monitoring', included: true },
        { text: 'Email support', included: true },
        { text: 'Advanced analytics', included: false },
        { text: 'Custom branding', included: false },
        { text: 'API access', included: false },
        { text: 'Dedicated support', included: false }
      ],
      popular: false,
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      name: 'Professional',
      price: { monthly: 149, yearly: 1490 },
      description: 'For growing institutions',
      icon: Briefcase,
      features: [
        { text: 'Up to 500 students', included: true },
        { text: 'Unlimited exams', included: true },
        { text: 'Advanced AI monitoring', included: true },
        { text: 'Priority support', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Custom branding', included: true },
        { text: 'API access', included: false },
        { text: 'Dedicated support', included: false }
      ],
      popular: true,
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      name: 'Enterprise',
      price: { monthly: 499, yearly: 4990 },
      description: 'For large organizations',
      icon: Building2,
      features: [
        { text: 'Unlimited students', included: true },
        { text: 'Unlimited exams', included: true },
        { text: 'Enterprise AI suite', included: true },
        { text: '24/7 phone support', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Custom branding', included: true },
        { text: 'Full API access', included: true },
        { text: 'Dedicated account manager', included: true }
      ],
      popular: false,
      gradient: 'from-orange-600 to-red-600'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Dean of Engineering, MIT',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      quote: 'ExamGuard AI has completely transformed how we conduct online assessments. The AI detection is incredibly accurate and our students appreciate the privacy-first approach.',
      rating: 5
    },
    {
      name: 'Prof. Michael Chen',
      role: 'Computer Science, Stanford',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      quote: 'Implementation was seamless and the analytics help us identify struggling students early. A complete game-changer for remote education.',
      rating: 5
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Medical School Director, Harvard',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      quote: 'The security features exceed our compliance requirements. Finally, a proctoring solution we can trust with sensitive medical examinations.',
      rating: 5
    }
  ];

  const trustedBy = [
    'Stanford', 'MIT', 'Harvard', 'Yale', 'Princeton', 'Oxford', 
    'Cambridge', 'Berkeley', 'Columbia', 'Cornell'
  ];

  return (
    <div className="min-h-screen text-white overflow-hidden relative" style={{ backgroundColor: '#000000' }}>
      {/* Ultra Premium Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
        
        {/* Animated gradient orbs */}
        <div 
          className="absolute w-[1000px] h-[1000px] rounded-full opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
            top: '10%',
            left: '10%',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
            bottom: '10%',
            right: '10%',
            animation: 'float 25s ease-in-out infinite',
            animationDelay: '2s'
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'float 30s ease-in-out infinite',
            animationDelay: '4s'
          }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }} />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black" />
      </div>

      {/* Cursor glow effect */}
      <div 
        className="fixed w-96 h-96 rounded-full pointer-events-none z-0 transition-opacity duration-300 opacity-0 hover:opacity-100 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Ultra Premium Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'backdrop-blur-2xl border-b shadow-2xl' : 'bg-transparent'
      }`} style={{ 
        backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
        borderColor: scrolled ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
      }}>
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <img src="/logo.svg" className="w-7 h-7" alt="Logo" />
                </div>
              </div>
              <div>
                <div className="text-[1.75rem] leading-none bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent font-orbitron tracking-wider" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                  RAQEEB
                </div>
                <div className="text-xs text-gray-500 tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  AI PROCTORING
                </div>
              </div>
            </button>

            {/* Center Navigation */}
            <div className="hidden lg:flex items-center gap-1 px-2 py-1.5 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-xl">
              {['Features', 'Solutions', 'Pricing', 'Resources'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all duration-300"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.9375rem' }}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 text-gray-300 hover:text-white transition-colors duration-300"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/register')}
                className="group relative px-6 py-2.5 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-100 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                <span className="relative text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  Get Started
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Ultra Premium Hero Section */}
      <section ref={heroRef} className="relative pt-40 pb-32 px-8 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          {/* Hero Content */}
          <div className="text-center mb-20">
            {/* Floating badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 mb-10 rounded-full border backdrop-blur-2xl group hover:scale-105 transition-all duration-500 cursor-pointer" style={{ 
              background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(168,85,247,0.1) 100%)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)'
            }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  Trusted by 10,000+ educators
                </span>
              </div>
              <div className="flex items-center gap-1 text-blue-400">
                <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  See our impact
                </span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Main Heading - Ultra Premium */}
            <h1 className="mb-8 leading-[1.1]" style={{ 
              fontSize: '5.5rem', 
              fontFamily: 'Inter, sans-serif', 
              fontWeight: 900,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 30%, #ddd6fe 60%, #fae8ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              The Future of<br />
              <span style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Exam Integrity
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
              AI-powered proctoring that ensures academic integrity while{' '}
              <span className="text-white" style={{ fontWeight: 600 }}>respecting privacy</span>.
              Trusted by the world's leading institutions.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4 mb-20">
              <button
                onClick={() => navigate('/register')}
                className="group relative px-10 py-5 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105"
                style={{ boxShadow: '0 20px 60px rgba(59, 130, 246, 0.3)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center gap-3">
                  <span className="text-white text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    Start Free Trial
                  </span>
                  <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                className="group flex items-center gap-3 px-10 py-5 rounded-2xl border backdrop-blur-xl hover:bg-white/[0.05] transition-all duration-500"
                style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center group-hover:bg-white/[0.1] transition-colors">
                  <Play className="w-5 h-5 text-white" fill="white" />
                </div>
                <div className="text-left">
                  <div className="text-white text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Watch Demo
                  </div>
                  <div className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                    2 min overview
                  </div>
                </div>
              </button>
            </div>

            {/* Hero Dashboard Mockup */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-[3rem] blur-3xl" />
              
              {/* Main mockup container */}
              <div className="relative rounded-3xl overflow-hidden border backdrop-blur-xl" style={{ 
                borderColor: 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 40px 100px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05)'
              }}>
                {/* Top bar */}
                <div className="flex items-center gap-2 px-6 py-4 border-b" style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderColor: 'rgba(255, 255, 255, 0.05)'
                }}>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1.5 rounded-lg text-xs text-gray-400" style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      examguard.ai/dashboard
                    </div>
                  </div>
                </div>

                {/* Dashboard image */}
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1762690717744-5fcbd4afc95a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdGVjaG5vbG9neSUyMGJsdWV8ZW58MXx8fHwxNzY0NTE2OTY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="ExamGuard AI Dashboard"
                  className="w-full h-auto"
                />

                {/* Floating stats cards */}
                <div className="absolute top-8 right-8 p-4 rounded-2xl backdrop-blur-2xl border animate-float" style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  animation: 'float 6s ease-in-out infinite'
                }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        99.8%
                      </div>
                      <div className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Detection Rate
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 p-4 rounded-2xl backdrop-blur-2xl border animate-float" style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  animation: 'float 6s ease-in-out infinite',
                  animationDelay: '2s'
                }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-lg text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        256-bit Encryption
                      </div>
                      <div className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Military Grade
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trusted By Section */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-8 uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              Trusted by leading institutions worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-40">
              {trustedBy.slice(0, 6).map((name) => (
                <div key={name} className="text-xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Grid */}
      <section id="features" className="relative py-32 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 mb-6 rounded-full border backdrop-blur-2xl" style={{ 
              background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(168,85,247,0.1) 100%)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <span className="text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                ✨ POWERFUL FEATURES
              </span>
            </div>
            <h2 className="text-6xl mb-6" style={{ 
              fontFamily: 'Inter, sans-serif', 
              fontWeight: 900,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #ddd6fe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Everything you need
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Cutting-edge technology designed for academic excellence
            </p>
          </div>

          {/* Feature Cards - Premium Layout */}
          <div className="space-y-32">
            {features.map((feature, index) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <feature.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-4xl text-white mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, letterSpacing: '-0.02em' }}>
                    {feature.title}
                  </h3>
                  <p className="text-xl text-gray-400 mb-8 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {feature.description}
                  </p>
                  <button className="group flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    <span>Learn more</span>
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>

                {/* Visual */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="relative group">
                    <div className={`absolute -inset-4 bg-gradient-to-r ${feature.gradient} opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-500`} />
                    <div className="relative rounded-3xl overflow-hidden border backdrop-blur-xl" style={{ 
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)'
                    }}>
                      <ImageWithFallback
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Capabilities Grid */}
          <div className="mt-32">
            <h3 className="text-center text-3xl text-white mb-12" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              Complete monitoring suite
            </h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              {capabilities.map((cap, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl border backdrop-blur-xl text-center group hover:scale-105 transition-all duration-300"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderColor: 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-${cap.color}-500/10 flex items-center justify-center group-hover:bg-${cap.color}-500/20 transition-colors`}>
                    <cap.icon className={`w-6 h-6 text-${cap.color}-400`} />
                  </div>
                  <div className="text-sm text-gray-300" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                    {cap.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Premium Pricing Section */}
      <section id="pricing" className="relative py-32 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 mb-6 rounded-full border backdrop-blur-2xl" style={{ 
              background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(16,185,129,0.1) 100%)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <span className="text-sm bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                💎 FLEXIBLE PRICING
              </span>
            </div>
            <h2 className="text-6xl mb-6" style={{ 
              fontFamily: 'Inter, sans-serif', 
              fontWeight: 900,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #ddd6fe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Plans for every scale
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Start free, scale as you grow. No hidden fees, cancel anytime.
            </p>

            {/* Premium Billing Toggle */}
            <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl border backdrop-blur-2xl" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <button
                onClick={() => setActiveTab('monthly')}
                className={`relative px-8 py-3 rounded-xl transition-all duration-500 ${
                  activeTab === 'monthly' ? '' : 'text-gray-500'
                }`}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
              >
                {activeTab === 'monthly' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl" />
                )}
                <span className="relative text-white">Monthly</span>
              </button>
              <button
                onClick={() => setActiveTab('yearly')}
                className={`relative px-8 py-3 rounded-xl transition-all duration-500 ${
                  activeTab === 'yearly' ? '' : 'text-gray-500'
                }`}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
              >
                {activeTab === 'yearly' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl" />
                )}
                <span className="relative text-white">Yearly</span>
                {activeTab === 'yearly' && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    -15%
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Premium Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-3xl border backdrop-blur-2xl transition-all duration-500 ${
                  plan.popular 
                    ? 'lg:scale-105 lg:-mt-4 lg:mb-4' 
                    : 'hover:scale-105'
                }`}
                style={{ 
                  backgroundColor: plan.popular ? 'rgba(59, 130, 246, 0.03)' : 'rgba(255, 255, 255, 0.02)',
                  borderColor: plan.popular ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  boxShadow: plan.popular ? '0 25px 60px rgba(59, 130, 246, 0.15)' : 'none'
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full" style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
                  }}>
                    <span className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                      ⭐ MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} mb-6`}>
                    <plan.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-3xl text-white mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    {plan.name}
                  </h3>
                  <p className="text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900 }}>
                      ${activeTab === 'monthly' ? plan.price.monthly : plan.price.yearly}
                    </span>
                    <span className="text-gray-500">/{activeTab === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/register')}
                  className={`w-full py-4 rounded-xl mb-8 transition-all duration-500 hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                      : 'border border-white/10 text-white hover:bg-white/5'
                  }`}
                  style={{ 
                    fontFamily: 'Inter, sans-serif', 
                    fontWeight: 600,
                    boxShadow: plan.popular ? '0 10px 30px rgba(59, 130, 246, 0.3)' : 'none'
                  }}
                >
                  Get Started
                </button>

                <div className="space-y-4">
                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        feature.included ? 'bg-green-500/20' : 'bg-gray-800'
                      }`}>
                        {feature.included ? (
                          <Check className="w-3 h-3 text-green-400" strokeWidth={3} />
                        ) : (
                          <X className="w-3 h-3 text-gray-600" strokeWidth={3} />
                        )}
                      </div>
                      <span className={`${feature.included ? 'text-gray-300' : 'text-gray-600'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Testimonials */}
      <section className="relative py-32 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 mb-6 rounded-full border backdrop-blur-2xl" style={{ 
              background: 'linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(245,158,11,0.1) 100%)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <span className="text-sm bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                ⭐ WALL OF LOVE
              </span>
            </div>
            <h2 className="text-6xl mb-6" style={{ 
              fontFamily: 'Inter, sans-serif', 
              fontWeight: 900,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #ddd6fe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Loved by educators
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands who trust ExamGuard AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 rounded-3xl border backdrop-blur-2xl group hover:scale-105 transition-all duration-500"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderColor: 'rgba(255, 255, 255, 0.05)'
                }}
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-lg text-gray-300 mb-8 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-md opacity-50" />
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="relative w-14 h-14 rounded-full object-cover border-2 border-white/10"
                    />
                  </div>
                  <div>
                    <div className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra Premium CTA */}
      <section className="relative py-32 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-[3rem] overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30" />
            
            <div className="relative px-16 py-24 text-center">
              <h2 className="text-6xl text-white mb-6" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, letterSpacing: '-0.02em' }}>
                Ready to get started?
              </h2>
              <p className="text-2xl text-white/80 mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                Join 10,000+ educators transforming online assessments with AI
              </p>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="group px-12 py-5 bg-white text-gray-900 rounded-2xl hover:scale-105 transition-all duration-500"
                  style={{ 
                    fontFamily: 'Inter, sans-serif', 
                    fontWeight: 700,
                    fontSize: '1.125rem',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span>Start Free Trial</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button
                  className="group px-12 py-5 border-2 border-white/30 text-white rounded-2xl hover:bg-white/10 backdrop-blur-xl transition-all duration-500"
                  style={{ 
                    fontFamily: 'Inter, sans-serif', 
                    fontWeight: 600,
                    fontSize: '1.125rem'
                  }}
                >
                  Book a Demo
                </button>
              </div>

              <p className="text-white/60 mt-8 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                No credit card required • Free 14-day trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="relative py-16 px-8 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Brain className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                    ExamGuard
                  </div>
                  <div className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                    AI PROCTORING
                  </div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                The world's most trusted AI-powered exam proctoring platform. Ensuring academic integrity while respecting student privacy.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Twitter className="w-5 h-5 text-gray-400" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Linkedin className="w-5 h-5 text-gray-400" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Github className="w-5 h-5 text-gray-400" />
                </a>
              </div>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Integrations', 'API'] },
              { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'GDPR', 'Compliance', 'Cookies'] }
            ].map((column, index) => (
              <div key={index}>
                <h4 className="text-white mb-6" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  {column.title}
                </h4>
                <div className="space-y-3">
                  {column.links.map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="block text-gray-400 hover:text-white transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
            <p className="text-gray-500 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              © 2024 ExamGuard AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Status</a>
              <a href="#" className="hover:text-white transition-colors">Changelog</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Animations CSS */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-25px) translateX(5px);
          }
        }
      `}</style>
    </div>
  );
}
