import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App.jsx';
import './index.css';

// Pages
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProjectDetailsPage from './pages/ProjectDetailsPage.jsx';
import CreateProjectPage from './pages/CreateProjectPage.jsx';

// Components
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected Routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="" element={<AdminRoute />}>
        <Route path="/projects/new" element={<CreateProjectPage />} />
      </Route>

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
