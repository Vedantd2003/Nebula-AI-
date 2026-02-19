import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { FiZap, FiTrendingUp, FiClock, FiActivity, FiArrowRight } from 'react-icons/fi';
import { usageAPI } from '../services/api';
import { useAuthStore } from '../store';

function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const statsRef = useRef(null);
  const navigate = useNavigate();

  const { data: statsData, isSuccess } = useQuery({
    queryKey: ['stats'],
    queryFn: () => usageAPI.getStats(),
  });

  const stats = statsData?.data?.data;

  useEffect(() => {
    if (statsRef.current && isSuccess) {
      gsap.from('.stat-card', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)',
      });
    }
  }, [isSuccess]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold gradient-text mb-2">
          Welcome back, {user?.name || 'Explorer'}!
        </h1>
        <p className="text-dark-600">Insights and quick access to your AI workspace</p>
      </div>

      {/* Stats Grid */}
      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card glass p-6 rounded-2xl border-l-4 border-nebula-500">
          <div className="flex items-center justify-between mb-4">
            <FiZap className="w-6 h-6 text-nebula-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-dark-500">Credits</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats?.credits?.remaining ?? '—'}
          </div>
          <div className="w-full h-1.5 bg-dark-200 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-nebula-500 transition-all duration-1000" 
              style={{ width: `${((stats?.credits?.remaining || 0) / (stats?.credits?.total || 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="stat-card glass p-6 rounded-2xl border-l-4 border-cosmic-500">
          <div className="flex items-center justify-between mb-4">
            <FiTrendingUp className="w-6 h-6 text-cosmic-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-dark-500">Activity</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats?.totalGenerations || 0}
          </div>
          <p className="text-sm text-dark-500">Total Generations</p>
        </div>

        <div className="stat-card glass p-6 rounded-2xl border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <FiActivity className="w-6 h-6 text-green-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-dark-500">Plan</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1 capitalize">
            {user?.subscription?.tier || 'Free Tier'}
          </div>
          <p className="text-sm text-dark-500">Active Account</p>
        </div>

        <div className="stat-card glass p-6 rounded-2xl border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <FiClock className="w-6 h-6 text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-dark-500">Latest</span>
          </div>
          <div className="text-xl font-bold text-white mb-1">
            {stats?.usage?.lastRequestAt ? new Date(stats.usage.lastRequestAt).toLocaleDateString() : 'No activity'}
          </div>
          <p className="text-sm text-dark-500">Last used on</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="glass p-8 rounded-3xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-6">Launch Studio</h2>
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/generate')}
                className="group w-full p-4 flex items-center justify-between bg-white/5 hover:bg-nebula-600/20 rounded-2xl transition-all border border-white/5"
              >
                <div>
                  <div className="font-bold text-white">Text Generation</div>
                  <div className="text-sm text-dark-500">Draft emails, blogs, or code</div>
                </div>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => navigate('/analyze')}
                className="group w-full p-4 flex items-center justify-between bg-white/5 hover:bg-cosmic-600/20 rounded-2xl transition-all border border-white/5"
              >
                <div>
                  <div className="font-bold text-white">Document Analysis</div>
                  <div className="text-sm text-dark-500">Upload PDFs for AI insights</div>
                </div>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => navigate('/history')}
                className="group w-full p-4 flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5"
              >
                <div>
                  <div className="font-bold text-white">History & Logs</div>
                  <div className="text-sm text-dark-500">View your previous results</div>
                </div>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Usage Chart Placeholder */}
        <div className="glass p-8 rounded-3xl">
          <h2 className="text-2xl font-bold text-white mb-6">Usage Distribution</h2>
          <div className="space-y-6">
            {stats?.byType?.length > 0 ? (
              stats.byType.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2 text-sm uppercase font-bold tracking-widest text-dark-500">
                    <span>{item._id}</span>
                    <span className="text-white">{item.count}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-nebula-500 to-cosmic-500 rounded-full"
                      style={{ width: `${(item.count / (stats.totalGenerations || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-dark-600 italic">No usage data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;