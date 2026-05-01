import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../store/usersApiSlice';
import { setCredentials } from '../store/authSlice';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, UserPlus, Shield, CheckSquare, ArrowRight } from 'lucide-react';
import loginBg from '../assets/login_bg.png';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Member');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await register({ name, email, password, role }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Registration successful');
        navigate('/dashboard');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-950 overflow-y-auto">
        <div className="w-full max-w-xl space-y-8 my-8">
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold tracking-tight text-white mb-8">
              <div className="bg-blue-600 p-2 rounded-lg">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <span>TeamTask</span>
            </Link>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Create Account</h1>
            <p className="text-slate-400 mt-3 text-lg">Join thousands of teams managing work effectively</p>
          </div>

          <form onSubmit={submitHandler} className="mt-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 text-white transition-all placeholder:text-slate-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 text-white transition-all placeholder:text-slate-600"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 text-white transition-all placeholder:text-slate-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 text-white transition-all placeholder:text-slate-600"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300 ml-1">I want to join as</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('Member')}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-center space-x-3 transition-all ${
                    role === 'Member'
                      ? 'bg-blue-600/10 border-blue-600 text-blue-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <User size={20} />
                  <span className="font-bold">Member</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Admin')}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-center space-x-3 transition-all ${
                    role === 'Admin'
                      ? 'bg-blue-600/10 border-blue-600 text-blue-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <Shield size={20} />
                  <span className="font-bold">Admin</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500 ml-1 italic">
                {role === 'Admin' ? 'Admins can create projects and manage all tasks.' : 'Members can join projects and manage their assigned tasks.'}
              </p>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-900/20 transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-400 underline decoration-2 underline-offset-4 font-bold transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Right side: Branding */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img 
          src={loginBg} 
          alt="Abstract background" 
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/40 to-transparent" />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full p-16 text-center space-y-8">
          <div className="inline-block p-4 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-500/50 mb-4 animate-bounce">
            <UserPlus size={48} className="text-white" />
          </div>
          <h2 className="text-6xl font-black text-white leading-tight">
            Start Your <br /> 
            <span className="text-blue-500">Journey Today.</span>
          </h2>
          <p className="text-2xl text-slate-300 max-w-lg mx-auto">
            Experience the next generation of team collaboration and project management.
          </p>
          
          <div className="grid grid-cols-3 gap-6 pt-12">
            {[
              { label: 'Fast', icon: Shield },
              { label: 'Secure', icon: Shield },
              { label: 'Scalable', icon: Shield },
            ].map((item, i) => (
              <div key={i} className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
                <p className="text-white font-bold">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
