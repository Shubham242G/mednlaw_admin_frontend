import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import BlogManagement from './pages/BlogManagement';
import TestimonialManagement from './pages/TestimonialManagement';
import NewsManagement from './pages/NewsManagement';  // ADD THIS

function AdminLayout({ children }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">MednLaw Admin Panel</h1>
          <div className="flex gap-6 items-center">
            <span className="text-sm ">Welcome, {user?.name || 'User'}</span>
            <Link to="/admin/blogs" className="hover:underline">Blogs</Link>
            <Link to="/admin/news" className="hover:underline">News</Link>  {/* ADD THIS */}
            <Link to="/admin/testimonials" className="hover:underline">Testimonials</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto py-6">{children}</main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/admin/blogs"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <BlogManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          
          {/* ADD NEWS ROUTE */}
          <Route
            path="/admin/news"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <NewsManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/testimonials"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <TestimonialManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
