import { useState, useEffect } from 'react';

export default function NewsForm({ news, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'General',
    author: '',
    date: new Date().toISOString().split('T')[0],
    tags: '',
    featured: false,
    images: [],
    seoFocusKeyword: '',
    seoTitle: '',
    seoMetaDescription: ''
  });

  useEffect(() => {
    if (news) {
      setFormData({
        ...news,
        date: news.date ? new Date(news.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        tags: news.tags ? news.tags.join(', ') : ''
      });
    }
  }, [news]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert tags string to array
    const submitData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
    };
    
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{news ? 'Edit News' : 'Add New News'}</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-gray-700 mb-2">Excerpt *</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            rows="2"
            maxLength="300"
            className="w-full border border-gray-300 p-2 rounded"
          />
          <span className="text-xs text-gray-500">{formData.excerpt.length}/300 characters</span>
        </div>

        <div className="col-span-2">
          <label className="block text-gray-700 mb-2">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="8"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="Medical">Medical</option>
            <option value="Legal">Legal</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Law Updates">Law Updates</option>
            <option value="Research">Research</option>
            <option value="General">General</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Author *</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
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

        <div>
          <label className="block text-gray-700 mb-2">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="health, law, research"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div className="col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-gray-700">Featured Article</span>
          </label>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">SEO Focus Keyword</label>
          <input
            type="text"
            name="seoFocusKeyword"
            value={formData.seoFocusKeyword}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">SEO Title</label>
          <input
            type="text"
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-gray-700 mb-2">SEO Meta Description</label>
          <textarea
            name="seoMetaDescription"
            value={formData.seoMetaDescription}
            onChange={handleChange}
            rows="2"
            maxLength="160"
            className="w-full border border-gray-300 p-2 rounded"
          />
          <span className="text-xs text-gray-500">{formData.seoMetaDescription.length}/160 characters</span>
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {news ? 'Update News' : 'Create News'}
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
