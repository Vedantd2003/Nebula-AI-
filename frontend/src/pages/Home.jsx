import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiZap, FiCpu, FiLayers, FiTrendingUp, FiArrowRight, FiStar } from 'react-icons/fi';
import { useAuthStore } from '../store';

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    // Hero animation
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
      });

      gsap.from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power4.out',
      });

      gsap.from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: 'power4.out',
      });

      // Floating animation for background elements
      gsap.to('.floating-orb', {
        y: -30,
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.5,
      });

      // Features scroll animation
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen mesh-bg text-white overflow-hidden" ref={heroRef}>
      {/* Floating orbs background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb absolute top-20 left-20 w-96 h-96 bg-nebula-600/20 rounded-full blur-3xl" />
        <div className="floating-orb absolute bottom-20 right-20 w-96 h-96 bg-cosmic-600/20 rounded-full blur-3xl" />
        <div className="floating-orb absolute top-1/2 left-1/2 w-96 h-96 bg-nebula-400/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FiZap className="w-8 h-8 text-nebula-400" />
            <span className="text-2xl font-display font-bold gradient-text">
              NEBULA AI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 glass rounded-lg hover:bg-white/10 transition-all"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 glass rounded-lg hover:bg-white/10 transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="btn-neon"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="hero-title text-7xl md:text-8xl font-display font-black mb-6">
            <span className="gradient-text">AI-Powered</span>
            <br />
            Content Creation
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-dark-600 max-w-3xl mx-auto mb-12">
            Transform your ideas into reality with cutting-edge AI technology.
            Generate, analyze, and optimize content in seconds.
          </p>
          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGetStarted}
              className="btn-neon flex items-center gap-2 group"
            >
              Start Creating
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 glass rounded-xl hover:bg-white/10 transition-all font-semibold">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { number: '10M+', label: 'AI Generations' },
              { number: '50K+', label: 'Active Users' },
              { number: '99.9%', label: 'Uptime' },
            ].map((stat, index) => (
              <div key={index} className="glass p-6 rounded-2xl">
                <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-dark-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section relative z-10 py-20 px-6" ref={featuresRef}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-display font-bold text-center mb-4 gradient-text">
            Powerful Features
          </h2>
          <p className="text-xl text-dark-600 text-center mb-16 max-w-2xl mx-auto">
            Everything you need to create, analyze, and optimize your content
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FiCpu className="w-8 h-8" />,
                title: 'AI Text Generation',
                description: 'Create high-quality content with advanced AI models',
              },
              {
                icon: <FiLayers className="w-8 h-8" />,
                title: 'Document Analysis',
                description: 'Extract insights and analyze documents instantly',
              },
              {
                icon: <FiTrendingUp className="w-8 h-8" />,
                title: 'Smart Summarization',
                description: 'Condense long texts into concise summaries',
              },
              {
                icon: <FiStar className="w-8 h-8" />,
                title: 'Creative Tools',
                description: 'Generate articles, blogs, and creative content',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="feature-card group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-nebula-600 to-cosmic-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-dark-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass p-12 rounded-3xl">
            <h2 className="text-4xl font-display font-bold mb-6">
              Ready to Transform Your Content?
            </h2>
            <p className="text-xl text-dark-600 mb-8">
              Join thousands of creators using Nebula AI Studio
            </p>
            <button onClick={handleGetStarted} className="btn-neon">
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-dark-500">
          <p>&copy; 2024 Nebula AI Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
