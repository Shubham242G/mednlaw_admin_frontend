import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function NewsTable({ onEdit, onDelete, refreshTrigger }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const newsPerPage = 10;

  useEffect(() => {
    fetchNews();
  }, [currentPage, refreshTrigger]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/news?page=${currentPage}&limit=${newsPerPage}`,
        {
          headers: { 'x-auth-token': token }
        }
      );

      const { 
        news = [], 
        currentPage: page = 1, 
        totalPages = 1, 
        totalNews = 0 
      } = response.data || {};

      setNews(Array.isArray(news) ? news : []);
      setCurrentPage(page);
      setTotalPages(totalPages);
      setTotalNews(totalNews);
      setLoading(false);
    } catch (error) {
      console.error('Fetch news error:', error);
      setError(error.message);
      setNews([]);
      setLoading(false);
    }
  };

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(prev => prev - 1);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);
      if (currentPage <= 3) endPage = Math.min(maxPagesToShow, totalPages);
      if (currentPage > totalPages - 3) startPage = Math.max(1, totalPages - maxPagesToShow + 1);
      for (let i = startPage; i <= endPage; i++) pages.push(i);
    }
    return pages;
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Loading news...</div>;
  if (error) return (
    <div className="p-6 text-center">
      <div className="text-red-600">Error: {error}</div>
      <button onClick={fetchNews} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Retry</button>
    </div>
  );

  return (
    <div className="p-6">
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Author</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Featured</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.length === 0 ? (
              <tr><td colSpan="6" className="p-6 text-center text-gray-500">No news found</td></tr>
            ) : (
              news.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 max-w-xs truncate">{item.title}</td>
                  <td className="p-3">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3">{item.author}</td>
                  <td className="p-3">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="p-3">
                    {item.featured ? (
                      <span className="text-yellow-500">⭐ Featured</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => onEdit(item)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                      <button onClick={() => onDelete(item._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
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
                <button onClick={goToPrevPage} disabled={currentPage === 1}
                  className={`px-3 h-8 border rounded-s-lg ${currentPage === 1 ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}`}>
                  Previous
                </button>
              </li>
              {getPageNumbers().map(pageNum => (
                <li key={pageNum}>
                  <button onClick={() => goToPage(pageNum)}
                    className={`px-3 h-8 border ${currentPage === pageNum ? 'bg-blue-50 text-blue-600' : 'bg-white hover:bg-gray-100'}`}>
                    {pageNum}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={goToNextPage} disabled={currentPage === totalPages}
                  className={`px-3 h-8 border rounded-e-lg ${currentPage === totalPages ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}`}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
          <div className="mt-4 text-center text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({totalNews} total)
          </div>
        </div>
      )}
    </div>
  );
}
