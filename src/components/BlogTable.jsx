import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function BlogTable({ onEdit, onDelete, refreshTrigger }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  const blogsPerPage = 10;

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, refreshTrigger]);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/blogs?page=${currentPage}&limit=${blogsPerPage}`,
        { headers: { 'x-auth-token': token } }
      );

      console.log('BLOG API RESPONSE:', response.data);

      /**
       * ✅ NORMALIZE RESPONSE
       * Supports:
       * 1. { data: { blogs, currentPage, totalPages, totalBlogs } }
       * 2. { blogs, currentPage, totalPages, totalBlogs }
       * 3. [ blogs ]
       */
      const rawData = response.data?.data || response.data || {};

      const blogsData = Array.isArray(rawData.blogs)
        ? rawData.blogs
        : Array.isArray(rawData)
        ? rawData
        : [];

      setBlogs(blogsData);
      setCurrentPage(rawData.currentPage || 1);
      setTotalPages(rawData.totalPages || 1);
      setTotalBlogs(rawData.totalBlogs || blogsData.length);
    } catch (err) {
      console.error('Fetch blogs error:', err);
      setError(err.message || 'Failed to fetch blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page) => setCurrentPage(page);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(p => p + 1);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(p => p - 1);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading blogs...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Error: {error}
        <div>
          <button
            onClick={fetchBlogs}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Summary</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No blogs found
                </td>
              </tr>
            ) : (
              blogs.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.title}</td>

                  <td className="p-3 max-w-md truncate">
                    {item.summary || item.content?.replace(/<[^>]+>/g, '').slice(0, 80) || '—'}
                  </td>

                  <td className="p-3">
  {item.date
    ? new Date(item.date).toLocaleDateString()
    : item.createdAt
    ? new Date(item.createdAt).toLocaleDateString()
    : '—'}
</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(item._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(item._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="px-3 py-1 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
