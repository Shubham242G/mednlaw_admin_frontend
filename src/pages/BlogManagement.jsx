import { useState } from 'react';
import axios from 'axios';
import BlogTable from '../components/BlogTable';
import BlogForm from '../components/BlogForm';

const API_URL = process.env.REACT_APP_API_URL;

export default function BlogManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/blogs/${blogId}`, {
        headers: { 'x-auth-token': token }
      });
      setRefreshTrigger(prev => prev + 1);
      alert('Blog deleted successfully');
    } catch (error) {
      alert('Error deleting blog: ' + error.message);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (editingBlog) {
        await axios.put(`${API_URL}/blogs/${editingBlog._id}`, formData, {
          headers: { 'x-auth-token': token }
        });
        alert('Blog updated successfully');
      } else {
        await axios.post(`${API_URL}/blogs`, formData, {
          headers: { 'x-auth-token': token }
        });
        alert('Blog created successfully');
      }
      
      setShowForm(false);
      setEditingBlog(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      alert('Error saving blog: ' + error.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Add New Blog
          </button>
        )}
      </div>

      {showForm ? (
        <BlogForm
          blog={editingBlog}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <BlogTable
          onEdit={handleEdit}
          onDelete={handleDelete}
          refreshTrigger={refreshTrigger}
        />
      )}
    </div>
  );
}
