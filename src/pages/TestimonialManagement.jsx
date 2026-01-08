import { useState } from 'react';
import axios from 'axios';
import TestimonialTable from '../components/TestimonialTable';
import TestimonialForm from '../components/TestimonialForm';

const API_URL = process.env.REACT_APP_API_URL;

export default function TestimonialManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setShowForm(true);
  };

  const handleDelete = async (testimonialId) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/testimonials/${testimonialId}`, {
        headers: { 'x-auth-token': token }
      });
      setRefreshTrigger(prev => prev + 1);
      alert('Testimonial deleted successfully');
    } catch (error) {
      alert('Error deleting testimonial: ' + error.message);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (editingTestimonial) {
        await axios.put(`${API_URL}/testimonials/${editingTestimonial._id}`, formData, {
          headers: { 'x-auth-token': token }
        });
        alert('Testimonial updated successfully');
      } else {
        await axios.post(`${API_URL}/testimonials`, formData, {
          headers: { 'x-auth-token': token }
        });
        alert('Testimonial created successfully');
      }
      
      setShowForm(false);
      setEditingTestimonial(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      alert('Error saving testimonial: ' + error.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTestimonial(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Testimonial Management</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Add New Testimonial
          </button>
        )}
      </div>

      {showForm ? (
        <TestimonialForm
          testimonial={editingTestimonial}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <TestimonialTable
          onEdit={handleEdit}
          onDelete={handleDelete}
          refreshTrigger={refreshTrigger}
        />
      )}
    </div>
  );
}
