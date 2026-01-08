import { useState } from 'react';
import axios from 'axios';
import NewsTable from '../components/NewsTable';
import NewsForm from '../components/NewsForm';

const API_URL = 'http://localhost:5000/api';

export default function NewsManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (news) => {
    setEditingNews(news);
    setShowForm(true);
  };

  const handleDelete = async (newsId) => {
    if (!window.confirm('Are you sure you want to delete this news article?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/news/${newsId}`, {
        headers: { 'x-auth-token': token }
      });
      setRefreshTrigger(prev => prev + 1);
      alert('News deleted successfully');
    } catch (error) {
      alert('Error deleting news: ' + error.message);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (editingNews) {
        await axios.put(`${API_URL}/news/${editingNews._id}`, formData, {
          headers: { 'x-auth-token': token }
        });
        alert('News updated successfully');
      } else {
        await axios.post(`${API_URL}/news`, formData, {
          headers: { 'x-auth-token': token }
        });
        alert('News created successfully');
      }
      
      setShowForm(false);
      setEditingNews(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      alert('Error saving news: ' + error.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingNews(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">News & Magazine Management</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Add New Article
          </button>
        )}
      </div>

      {showForm ? (
        <NewsForm
          news={editingNews}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <NewsTable
          onEdit={handleEdit}
          onDelete={handleDelete}
          refreshTrigger={refreshTrigger}
        />
      )}
    </div>
  );
}
