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
  }, [currentPage, refreshTrigger]);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/blogs?page=${currentPage}&limit=${blogsPerPage}`,
        {
          headers: { 'x-auth-token': token }
        }
      );

      const { 
        blogs = [], 
        currentPage: page = 1, 
        totalPages = 1, 
        totalBlogs = 0 
      } = response.data || {};

      setBlogs(Array.isArray(blogs) ? blogs : []);
      setCurrentPage(page);
      setTotalPages(totalPages);
      setTotalBlogs(totalBlogs);
      setLoading(false);
    } catch (error) {
      console.error('Fetch blogs error:', error);
      setError(error.message);
      setBlogs([]);
      setLoading(false);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = Math.min(maxPagesToShow, totalPages);
      }

      if (currentPage > totalPages - 3) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-600">Loading blogs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600">Error loading blogs: {error}</div>
        <button
          onClick={fetchBlogs}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
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
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!blogs || blogs.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No blogs found
                </td>
              </tr>
            ) : (
              blogs.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3 max-w-md truncate">{item.summary}</td>
                  <td className="p-3">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(item)}
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
        <div className="mt-6">
          <nav className="flex justify-center items-center">
            <ul className="inline-flex -space-x-px text-sm">
              <li>
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center justify-center px-3 h-8 leading-tight border border-e-0 border-gray-300 rounded-s-lg ${
                    currentPage === 1
                      ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                      : 'text-gray-500 bg-white hover:bg-gray-100'
                  }`}
                >
                  Previous
                </button>
              </li>

              {currentPage > 3 && totalPages > 5 && (
                <>
                  <li>
                    <button
                      onClick={() => goToPage(1)}
                      className="flex items-center justify-center px-3 h-8 border border-gray-300 bg-white hover:bg-gray-100"
                    >
                      1
                    </button>
                  </li>
                  {currentPage > 4 && (
                    <li>
                      <span className="flex items-center justify-center px-3 h-8 border border-gray-300 bg-white">
                        ...
                      </span>
                    </li>
                  )}
                </>
              )}

              {getPageNumbers().map(pageNum => (
                <li key={pageNum}>
                  <button
                    onClick={() => goToPage(pageNum)}
                    className={`flex items-center justify-center px-3 h-8 border border-gray-300 ${
                      currentPage === pageNum
                        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                        : 'text-gray-500 bg-white hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                </li>
              ))}

              {currentPage < totalPages - 2 && totalPages > 5 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <li>
                      <span className="flex items-center justify-center px-3 h-8 border border-gray-300 bg-white">
                        ...
                      </span>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => goToPage(totalPages)}
                      className="flex items-center justify-center px-3 h-8 border border-gray-300 bg-white hover:bg-gray-100"
                    >
                      {totalPages}
                    </button>
                  </li>
                </>
              )}

              <li>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center justify-center px-3 h-8 border border-gray-300 rounded-e-lg ${
                    currentPage === totalPages
                      ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                      : 'text-gray-500 bg-white hover:bg-gray-100'
                  }`}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>

          <div className="mt-4 text-center text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({totalBlogs} total)
          </div>
        </div>
      )}
    </div>
  );
}
