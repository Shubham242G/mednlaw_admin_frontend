import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

/* ================= QUILL TOOLBAR ================= */
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

export default function BlogForm({ onSubmit, onClose, initialData }) {
  const submittingRef = useRef(false);
  console.log("BlogForm render — initialData:", initialData);

  const [form, setForm] = useState({
    title: "",
    summary: "",
    date: "",
    seoFocusKeyword: "",
    seoTitle: "",
    seoMetaDescription: "",
  });

  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= POPULATE ON EDIT ================= */
  useEffect(() => {
    if (!initialData) return;

    console.log("EDIT DATA RECEIVED:", initialData);

    setForm({
      title: initialData.title ?? "",
      summary: initialData.summary ?? "",
      date: initialData.date
        ? new Date(initialData.date).toISOString().split("T")[0]
        : "",
      seoFocusKeyword: initialData.seoFocusKeyword ?? "",
      seoTitle: initialData.seoTitle ?? "",
      seoMetaDescription: initialData.seoMetaDescription ?? "",
    });

    setContent(initialData.content ?? "");
    setFiles(initialData.images ?? []);
  }, [initialData]);

  /* ================= TEXT INPUT ================= */
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  /* ================= BASE64 ================= */
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  async function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files);
    setLoading(true);

    try {
      const base64Images = await Promise.all(
        selectedFiles.map(convertToBase64)
      );
      setFiles(base64Images);
    } catch (err) {
      console.error("Image conversion failed:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ================= SUBMIT ================= */
  async function handleSubmit(e) {
    e.preventDefault();

    if (submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);

    try {
      const payload = {
        ...form,
        content,
        images: files,
        date: new Date(form.date),
      };

      await onSubmit(payload);
    } catch (err) {
      console.error("Blog submit error:", err);
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  }

  /* ================= UI ================= */
  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-[650px] max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-8 border-b pb-4">
        {initialData ? "Edit Blog" : "Add Blog"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TITLE */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Blog title"
          required
          className="w-full p-4 border rounded-xl"
        />

        {/* SUMMARY */}
        <textarea
          name="summary"
          value={form.summary}
          onChange={handleChange}
          placeholder="Summary"
          required
          className="w-full p-4 border rounded-xl h-28"
        />

        {/* CONTENT */}
        <div className="border rounded-xl overflow-hidden">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            style={{ height: "300px" }}
          />
        </div>

        {/* DATE */}
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full p-4 border rounded-xl"
        />

        {/* SEO */}
        <input
          name="seoFocusKeyword"
          value={form.seoFocusKeyword}
          onChange={handleChange}
          placeholder="SEO Focus Keyword"
          className="w-full p-4 border rounded-xl"
        />

        <input
          name="seoTitle"
          value={form.seoTitle}
          onChange={handleChange}
          placeholder="SEO Title"
          className="w-full p-4 border rounded-xl"
        />

        <textarea
          name="seoMetaDescription"
          value={form.seoMetaDescription}
          onChange={handleChange}
          placeholder="SEO Meta Description"
          className="w-full p-4 border rounded-xl h-28"
        />

        {/* IMAGES */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="w-full p-4 border-2 border-dashed rounded-xl"
        />

        {files.length > 0 && (
          <p className="text-green-600 text-sm">
            ✅ {files.length} image(s) ready
          </p>
        )}

        {/* ACTIONS */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#c48e53] text-white py-4 rounded-xl disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : initialData
              ? "Update Blog"
              : "Create Blog"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-500 text-white py-4 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
