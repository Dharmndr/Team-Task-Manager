import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../store/usersApiSlice';
import { setCredentials } from '../store/authSlice';
import { toast } from 'react-hot-toast';
import { Mail, Lock, LogIn, CheckSquare } from 'lucide-react';
import loginBg from '../assets/login_bg.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold tracking-tight text-white mb-8">
              <div className="bg-blue-600 p-2 rounded-lg">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <span>TeamTask</span>
            </Link>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 mt-3 text-lg">Enter your details to access your workspace</p>
          </div>

          <form onSubmit={submitHandler} className="mt-10 space-y-6">
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

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Password</label>
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

            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-900/20 transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-400 underline decoration-2 underline-offset-4 font-bold transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Right side: Image/Branding */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img 
          src={loginBg} 
          alt="Abstract background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-16 space-y-6 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-blue-600/20 backdrop-blur-md px-4 py-2 rounded-full border border-blue-500/20 text-blue-400 text-sm font-bold">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span>Built for modern teams</span>
          </div>
          <h2 className="text-5xl font-bold text-white leading-tight">
            Manage tasks with <br /> 
            <span className="text-blue-500">unmatched efficiency.</span>
          </h2>
          <p className="text-xl text-slate-300 leading-relaxed">
            The all-in-one platform to track projects, collaborate with your team, and hit your deadlines every single time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
