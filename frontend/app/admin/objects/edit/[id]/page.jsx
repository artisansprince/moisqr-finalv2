'use client';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../../components/sidebar";
import { useRouter } from 'next/navigation';

const CreateObjectPage = () => {
  const [formData, setFormData] = useState({
    name_english: '',
    location_english: '',
    category_id: '',
    description_english: '',
    name_indonesian: '',
    location_indonesian: '',
    description_indonesian: '',
    name_chinese_simp: '',
    location_chinese_simp: '',
    description_chinese_simp: '',
    name_japanese: '',
    location_japanese: '',
    description_japanese: '',
    name_russian: '',
    location_russian: '',
    description_russian: '',
    name_spanish: '',
    location_spanish: '',
    description_spanish: '',
    name_dutch: '',
    location_dutch: '',
    description_dutch: '',
    images: [],
  });
  
  const [categories, setCategories] = useState([]);
  const baseURL = 'http://localhost:9977';
  const descriptionRefs = {
    english: useRef(null),
    indonesian: useRef(null),
    chinese_simp: useRef(null),
    japanese: useRef(null),
    russian: useRef(null),
    spanish: useRef(null),
    dutch: useRef(null),
  };

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/categories/get-all`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    const updatedImages = [...formData.images];
    updatedImages[index] = file;
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const handleTextAreaChange = (lang) => {
    if (descriptionRefs[lang].current) {
      setFormData({
        ...formData,
        [`description_${lang}`]: descriptionRefs[lang].current.innerHTML,
      });
    }
  };

  const handleBold = (lang) => {
    document.execCommand('bold');
    handleTextAreaChange(lang);
  };

  const handleItalic = (lang) => {
    document.execCommand('italic');
    handleTextAreaChange(lang);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validasi form
    if (!formData.name_english || !formData.location_english || !formData.category_id) {
      alert('Please fill all required fields');
      return;
    }
  
    // Membuat FormData untuk pengiriman data
    const form = new FormData();
    form.append('category_id', formData.category_id);
  
    // Menambahkan data teks untuk setiap bahasa
    form.append('name_english', formData.name_english);
    form.append('location_english', formData.location_english);
    form.append('description_english', formData.description_english);
  
    form.append('name_indonesian', formData.name_indonesian || '');
    form.append('location_indonesian', formData.location_indonesian || '');
    form.append('description_indonesian', formData.description_indonesian || '');
  
    form.append('name_chinese_simp', formData.name_chinese_simp || '');
    form.append('location_chinese_simp', formData.location_chinese_simp || '');
    form.append('description_chinese_simp', formData.description_chinese_simp || '');
  
    form.append('name_japanese', formData.name_japanese || '');
    form.append('location_japanese', formData.location_japanese || '');
    form.append('description_japanese', formData.description_japanese || '');
  
    form.append('name_russian', formData.name_russian || '');
    form.append('location_russian', formData.location_russian || '');
    form.append('description_russian', formData.description_russian || '');
  
    form.append('name_spanish', formData.name_spanish || '');
    form.append('location_spanish', formData.location_spanish || '');
    form.append('description_spanish', formData.description_spanish || '');
  
    form.append('name_dutch', formData.name_dutch || '');
    form.append('location_dutch', formData.location_dutch || '');
    form.append('description_dutch', formData.description_dutch || '');
  
    // Menambahkan gambar ke FormData (mengonversi array gambar ke JSON)
    const imageUrls = formData.images.map((image) => image ? image.name : ''); // Ambil nama file gambar
    form.append('image_url', JSON.stringify(imageUrls));  // Mengirimkan JSON gambar
  
    // Menambahkan gambar ke FormData jika ada
    formData.images.forEach((image) => {
      if (image) {
        form.append('images', image);
      }
    });
  
    try {
      // Mengirimkan data ke backend
      await axios.post(`${baseURL}/api/objects/create`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      alert('Object created successfully');
      setFormData({
        name_english: '',
        location_english: '',
        category_id: '',
        description_english: '',
        name_indonesian: '',
        location_indonesian: '',
        description_indonesian: '',
        name_chinese_simp: '',
        location_chinese_simp: '',
        description_chinese_simp: '',
        name_japanese: '',
        location_japanese: '',
        description_japanese: '',
        name_russian: '',
        location_russian: '',
        description_russian: '',
        name_spanish: '',
        location_spanish: '',
        description_spanish: '',
        name_dutch: '',
        location_dutch: '',
        description_dutch: '',
        images: [],
      });
  
      router.push('/admin/objects'); // Mengarahkan kembali ke halaman objek setelah berhasil
    } catch (error) {
      console.error('Error creating object:', error);
      alert('Error occurred while saving data');
    }
  };

  

  return (
    <div className="flex">
      <Sidebar />
      <div className="m-5 w-full">
        <h1 className="text-xl font-semibold mb-4">Add New Object</h1>
        <form id="modalForm" onSubmit={handleSubmit}>
          {/* Input Gambar */}
          <div className="flex mb-6 space-x-2">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="relative w-20 h-20 border-dashed border-2 border-gray-400 rounded-md overflow-hidden"
              >
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, index)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {formData.images?.[index] ? (
                  <img
                    src={URL.createObjectURL(formData.images[index])}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-200">
                    <span className="text-sm text-gray-500">Select</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Dropdown Kategori */}
          <div className="mb-4">
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category_id"
              id="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="mt-2 p-2 w-full border rounded"
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

          {/* Input untuk setiap bahasa */}
          {['english', 'indonesian', 'chinese_simp', 'japanese', 'russian', 'spanish', 'dutch'].map((lang) => (
            <div key={lang}>
              <h3 className="text-lg font-medium text-gray-700 mt-4">{lang.charAt(0).toUpperCase() + lang.slice(1)}</h3>

              {/* Name */}
              <div className="mb-4">
                <label htmlFor={`name_${lang}`} className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id={`name_${lang}`}
                  name={`name_${lang}`}
                  value={formData[`name_${lang}`]}
                  onChange={handleChange}
                  className="mt-2 p-2 w-full border rounded"
                />
              </div>

              {/* Location */}
              <div className="mb-4">
                <label htmlFor={`location_${lang}`} className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  id={`location_${lang}`}
                  name={`location_${lang}`}
                  value={formData[`location_${lang}`]}
                  onChange={handleChange}
                  className="mt-2 p-2 w-full border rounded"
                />
              </div>

             {/* Description */}
                <div className="mb-4">
                <label htmlFor={`description_${lang}`} className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <div className="mb-2">
                    <button
                    type="button"
                    onClick={() => handleBold(lang)} // Menambahkan parameter 'lang' ke fungsi
                    className="bg-gray-200 p-2 rounded mx-1"
                    >
                    B
                    </button>
                    <button
                    type="button"
                    onClick={() => handleItalic(lang)} // Menambahkan parameter 'lang' ke fungsi
                    className="bg-gray-200 p-2 rounded mx-1"
                    >
                    I
                    </button>
                </div>
                <div
                    ref={descriptionRefs[lang]}
                    contentEditable
                    onInput={() => handleTextAreaChange(lang)}
                    className="mt-2 p-2 w-full border rounded min-h-[100px]"
                />
                </div>
            </div>
          ))}

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Save Object
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateObjectPage;




