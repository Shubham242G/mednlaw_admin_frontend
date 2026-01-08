import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function TestimonialTable({ onEdit, onDelete, refreshTrigger }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTestimonials, setTotalTestimonials] = useState(0);
  const testimonialsPerPage = 10;

  useEffect(() => {
    fetchTestimonials();
  }, [currentPage, refreshTrigger]);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/testimonials?page=${currentPage}&limit=${testimonialsPerPage}`,
        {
          headers: { 'x-auth-token': token }
        }
      );

      const { 
        testimonials = [], 
        currentPage: page = 1, 
        totalPages = 1, 
        totalTestimonials = 0 
      } = response.data || {};

      setTestimonials(Array.isArray(testimonials) ? testimonials : []);
      setCurrentPage(page);
      setTotalPages(totalPages);
      setTotalTestimonials(totalTestimonials);
      setLoading(false);
    } catch (error) {
      console.error('Fetch testimonials error:', error);
      setError(error.message);
      setTestimonials([]);
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

  if (loading) return <div className="p-6 text-center text-gray-600">Loading...</div>;
  if (error) return (
    <div className="p-6 text-center">
      <div className="text-red-600">Error: {error}</div>
      <button onClick={fetchTestimonials} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Retry</button>
    </div>
  );

  return (
    <div className="p-6">
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Rating</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.length === 0 ? (
              <tr><td colSpan="5" className="p-6 text-center text-gray-500">No testimonials found</td></tr>
            ) : (
              testimonials.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3 max-w-md truncate">{item.description}</td>
                  <td className="p-3">{'⭐'.repeat(item.rating || 5)}</td>
                  <td className="p-3">{new Date(item.date).toLocaleDateString()}</td>
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
            Page {currentPage} of {totalPages} ({totalTestimonials} total)
          </div>
        </div>
      )}
    </div>
  );
}
