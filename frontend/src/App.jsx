import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import { Toaster } from 'react-hot-toast';

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      {!isAuthPage && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
          },
        }}
      />
    </div>
  );
}

export default App;
