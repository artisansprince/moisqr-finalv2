'use client'
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const EditObjectPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    category_id: '',
    description: '',
    images: [],
  });
  const [categories, setCategories] = useState([]);
  const descriptionRef = useRef(null);
  const router = useRouter();
  const { id } = router.query; // Get object ID from URL
  const baseURL = 'http://localhost:9977';

  useEffect(() => {
    const fetchObject = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/objects/get-by-id/${id}`);
        const object = response.data;
        setFormData({
          name: object.name,
          location: object.location,
          category_id: object.category_id,
          description: object.description,
          images: [], // Not fetching images, keeping empty
        });
      } catch (error) {
        console.error('Error fetching object:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/categories/get-all`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchObject();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    const updatedImages = [...formData.images];
    updatedImages[index] = file;
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('location', formData.location);
    form.append('category_id', formData.category_id);
    form.append('description', formData.description);

    formData.images.forEach((image) => {
      if (image) form.append('images', image);
    });

    try {
      await axios.put(`${baseURL}/api/objects/update/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Object updated successfully!');
      window.location.href = '/admin/objects';
    } catch (error) {
      console.error('Error updating object:', error);
    }
  };

  const handleTextAreaChange = () => {
    if (descriptionRef.current) {
      setFormData({ ...formData, description: descriptionRef.current.innerHTML });
    }
  };

  return (
    <div className="m-5">
      <h1 className="text-2xl font-bold mb-4">Edit Object</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Selection */}
        <div>
          <label className="block font-medium">Category</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <div
            contentEditable
            ref={descriptionRef}
            className="p-2 w-full border rounded min-h-[100px]"
            onInput={handleTextAreaChange}
          ></div>
        </div>

        {/* Images */}
        <div>
          <label className="block font-medium">Images</label>
          <div className="flex space-x-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="w-20 h-20 border-dashed border-2 border-gray-400 rounded-md">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, index)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditObjectPage;
