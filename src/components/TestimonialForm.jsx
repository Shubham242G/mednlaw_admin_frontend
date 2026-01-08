import { useState, useEffect } from 'react';

export default function TestimonialForm({ testimonial, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    rating: 5
  });

  useEffect(() => {
    if (testimonial) {
      setFormData({
        ...testimonial,
        date: testimonial.date ? new Date(testimonial.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
  }, [testimonial]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          maxLength="1000"
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Rating *</label>
        <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Date *</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Image URL</label>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {testimonial ? 'Update Testimonial' : 'Create Testimonial'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
