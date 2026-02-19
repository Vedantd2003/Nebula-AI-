import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiZap } from 'react-icons/fi';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store';

function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (response) => {
      setAuth(response.data.data);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FiZap className="w-10 h-10 text-nebula-400" />
            <span className="text-3xl font-display font-bold gradient-text">NEBULA AI</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-dark-600">Start your AI journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-2">Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-nebula pl-12"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-2">Email</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-nebula pl-12"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-2">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
              <input
                type="password"
                required
                minLength="8"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-nebula pl-12"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full btn-neon"
          >
            {registerMutation.isPending ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p className="text-center text-dark-600">
            Already have an account?{' '}
            <Link to="/login" className="text-nebula-400 hover:text-nebula-300">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
