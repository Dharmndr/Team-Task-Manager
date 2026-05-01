import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../store/usersApiSlice';
import { logout } from '../store/authSlice';
import { apiSlice } from '../store/apiSlice';
import { LayoutDashboard, LogOut, User, CheckSquare } from 'lucide-react';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="bg-slate-900 text-white shadow-lg">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight">
          <CheckSquare className="w-8 h-8 text-blue-500" />
          <span>TeamTask</span>
        </Link>

        <div className="flex items-center space-x-6">
          {userInfo ? (
            <>
              <Link to="/dashboard" className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
              <div className="flex items-center space-x-4 border-l border-slate-700 pl-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                    {userInfo.name.charAt(0)}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{userInfo.name}</p>
                    <p className="text-xs text-slate-400">{userInfo.role}</p>
                  </div>
                </div>
                <button
                  onClick={logoutHandler}
                  className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-400 transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400 font-medium">Login</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
