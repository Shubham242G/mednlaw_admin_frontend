import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import BlogManagement from './pages/BlogManagement';
import TestimonialManagement from './pages/TestimonialManagement';
import NewsManagement from './pages/NewsManagement';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">MednLaw Admin Panel</h1>

          <div className="flex gap-6 items-center">
            <span className="text-sm">
              Welcome, {user?.name || 'User'}
            </span>

            <Link to="/admin/blogs">Blogs</Link>
            <Link to="/admin/news">News</Link>
            <Link to="/admin/testimonials">Testimonials</Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-6">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="blogs" replace />} />
              <Route path="blogs/*" element={<BlogManagement />} />
              <Route path="news" element={<NewsManagement />} />
              <Route path="testimonials" element={<TestimonialManagement />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
