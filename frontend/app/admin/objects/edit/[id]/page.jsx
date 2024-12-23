// frontend/app/admin/objects/edit/[id]/page.jsx

'use client';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../../../components/sidebar";
import { useRouter, useParams } from 'next/navigation';

const EditObjectPage = () => {
  const [formData, setFormData] = useState({
    images: [],
    category_id: '',

    name_english: '',
    location_english: '',
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

    name_korean: '',
    location_korean: '',
    description_korean: '',

    name_russian: '',
    location_russian: '',
    description_russian: '',

    name_spanish: '',
    location_spanish: '',
    description_spanish: '',

    name_dutch: '',
    location_dutch: '',
    description_dutch: '',
  });

  const [categories, setCategories] = useState([]);
  const baseURL = 'http://localhost:9977';
  
  const descriptionRefs = {
    english: useRef(null),
    indonesian: useRef(null),
    chinese_simp: useRef(null),
    japanese: useRef(null),
    korean: useRef(null),
    russian: useRef(null),
    spanish: useRef(null),
    dutch: useRef(null),
  };

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    // Fetch object data for editing
    const fetchObjectData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/objects/get-by-id/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching object data:', error);
      }
    };

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/categories/get-all`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchObjectData();
    fetchCategories();
  }, [id]);

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

//   const handleTextAreaChange = (lang) => {
//     if (descriptionRefs[lang].current) {
//       setFormData({
//         ...formData,
//         [`description_${lang}`]: descriptionRefs[lang].current.innerHTML,
//       });
//     }
//   };


const handleTextAreaInput = (lang) => {
    // Jangan update state langsung; hanya simpan posisi kursor
    const ref = descriptionRefs[lang];
    if (ref.current) {
    saveCursorPosition(ref.current);
    }
};

const handleTextAreaBlur = (lang) => {
    // Update state saat kehilangan fokus
    const ref = descriptionRefs[lang];
    if (ref.current) {
    setFormData((prev) => ({
        ...prev,
        [`description_${lang}`]: ref.current.innerHTML,
    }));
    }
};

const saveCursorPosition = (element) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const tempRange = document.createRange();

    tempRange.setStart(element, 0);
    tempRange.setEnd(range.startContainer, range.startOffset);

    element.dataset.cursorPosition = tempRange.toString().length; // Save position
};

const restoreCursorPosition = (element) => {
    const cursorPosition = parseInt(element.dataset.cursorPosition, 10);
    if (isNaN(cursorPosition)) return;

    const selection = window.getSelection();
    const range = document.createRange();

    let charCount = 0;
    let foundStart = false;
    const walkTextNodes = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
        const nextCharCount = charCount + node.length;
        if (!foundStart && cursorPosition >= charCount && cursorPosition <= nextCharCount) {
        range.setStart(node, cursorPosition - charCount);
        range.collapse(true);
        foundStart = true;
        }
        charCount = nextCharCount;
    } else {
        for (let child of node.childNodes) {
        walkTextNodes(child);
        if (foundStart) break;
        }
    }
    };

    walkTextNodes(element);
    if (foundStart) {
    selection.removeAllRanges();
    selection.addRange(range);
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

    // Membuat FormData untuk pengiriman
    const form = new FormData();
    form.append('category_id', formData.category_id);

    // Menambahkan data teks untuk setiap bahasa
    Object.keys(formData).forEach((key) => {
      if (key.startsWith('name_') || key.startsWith('location_') || key.startsWith('description_')) {
        form.append(key, formData[key] || '');
      }
    });

    // Menambahkan gambar ke FormData jika ada
  if (formData.images && formData.images.length > 0) {
    formData.images.forEach((image) => {
      if (image) {
        form.append('images', image);
      }
    });
  }

    try {
      // Mengirimkan data ke backend
      await axios.put(`${baseURL}/api/objects/update/${id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Object updated successfully');
      router.push('/admin/objects'); // Redirect setelah berhasil
    } catch (error) {
      console.error('Error updating object:', error);
      alert('Error occurred while saving data');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="m-5 w-full">
        <h1 className="text-xl font-semibold mb-4">Edit Object</h1>
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
                    src={
                      typeof formData.images[index] === 'string'
                        ? `${baseURL}/uploads/${formData.images[index]}`
                        : URL.createObjectURL(formData.images[index])
                    }
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
          {['english', 'indonesian', 'chinese_simp', 'japanese', 'korean', 'russian', 'spanish', 'dutch'].map((lang) => (
            <div key={lang}>
              <h3 className="text-lg font-medium text-gray-700 mt-4">{lang.charAt(0).toUpperCase() + lang.slice(1)}</h3>

              {/* Input untuk nama */}
              <div className="mb-4">
                <label htmlFor={`name_${lang}`} className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id={`name_${lang}`}
                  name={`name_${lang}`}
                  value={formData[`name_${lang}`] || ''}
                  onChange={handleChange}
                  className="mt-2 p-2 w-full border rounded"
                />
              </div>

              {/* Input untuk lokasi */}
              <div className="mb-4">
                <label htmlFor={`location_${lang}`} className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  id={`location_${lang}`}
                  name={`location_${lang}`}
                  value={formData[`location_${lang}`] || ''}
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
                    onClick={() => handleBold(lang)}
                    className="bg-gray-200 p-2 rounded mx-1"
                    >
                    B
                    </button>
                    <button
                    type="button"
                    onClick={() => handleItalic(lang)}
                    className="bg-gray-200 p-2 rounded mx-1"
                    >
                    I
                    </button>
                </div>
                <div
                    ref={descriptionRefs[lang]}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={() => handleTextAreaInput(lang)}
                    onBlur={() => handleTextAreaBlur(lang)}
                    dangerouslySetInnerHTML={{
                      __html: formData[`description_${lang}`] || '',
                    }}
                    className="mt-2 p-2 w-full border rounded min-h-[100px]"
                ></div>
                </div>

            </div>
          ))}

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditObjectPage;










// sudah aman tapi masih ada kendala kursor di deskripsi

// // frontend/app/admin/objects/edit/[id]/page.jsx

// 'use client';
// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import Sidebar from "../../../components/sidebar";
// import { useRouter, useParams } from 'next/navigation';

// const EditObjectPage = () => {
//   const [formData, setFormData] = useState({
//     images: [],
//     category_id: '',

//     name_english: '',
//     location_english: '',
//     description_english: '',

//     name_indonesian: '',
//     location_indonesian: '',
//     description_indonesian: '',

//     name_chinese_simp: '',
//     location_chinese_simp: '',
//     description_chinese_simp: '',

//     name_japanese: '',
//     location_japanese: '',
//     description_japanese: '',

//     name_korean: '',
//     location_korean: '',
//     description_korean: '',

//     name_russian: '',
//     location_russian: '',
//     description_russian: '',

//     name_spanish: '',
//     location_spanish: '',
//     description_spanish: '',

//     name_dutch: '',
//     location_dutch: '',
//     description_dutch: '',
//   });

//   const [categories, setCategories] = useState([]);
//   const baseURL = 'http://localhost:9977';
//   const descriptionRefs = {
//     english: useRef(null),
//     indonesian: useRef(null),
//     chinese_simp: useRef(null),
//     japanese: useRef(null),
//     korean: useRef(null),
//     russian: useRef(null),
//     spanish: useRef(null),
//     dutch: useRef(null),
//   };

//   const router = useRouter();
//   const { id } = useParams();

//   useEffect(() => {
//     // Fetch object data for editing
//     const fetchObjectData = async () => {
//       try {
//         const response = await axios.get(`${baseURL}/api/objects/get-by-id/${id}`);
//         setFormData(response.data);
//       } catch (error) {
//         console.error('Error fetching object data:', error);
//       }
//     };

//     // Fetch categories
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(`${baseURL}/api/categories/get-all`);
//         setCategories(response.data);
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };

//     fetchObjectData();
//     fetchCategories();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleFileChange = (e, index) => {
//     const file = e.target.files[0];
//     const updatedImages = [...formData.images];
//     updatedImages[index] = file;
//     setFormData({
//       ...formData,
//       images: updatedImages,
//     });
//   };

//   const handleTextAreaChange = (lang) => {
//     if (descriptionRefs[lang].current) {
//       setFormData({
//         ...formData,
//         [`description_${lang}`]: descriptionRefs[lang].current.innerHTML,
//       });
//     }
//   };

  
// //   ============= handle cursor description ==================
    


// //   ============= handle cursor description ==================
  

//   const handleBold = (lang) => {
//     document.execCommand('bold');
//     handleTextAreaChange(lang);
//   };

//   const handleItalic = (lang) => {
//     document.execCommand('italic');
//     handleTextAreaChange(lang);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validasi form
//     if (!formData.name_english || !formData.location_english || !formData.category_id) {
//       alert('Please fill all required fields');
//       return;
//     }

//     // Membuat FormData untuk pengiriman
//     const form = new FormData();
//     form.append('category_id', formData.category_id);

//     // Menambahkan data teks untuk setiap bahasa
//     Object.keys(formData).forEach((key) => {
//       if (key.startsWith('name_') || key.startsWith('location_') || key.startsWith('description_')) {
//         form.append(key, formData[key] || '');
//       }
//     });

//     // Menambahkan gambar ke FormData jika ada
//   if (formData.images && formData.images.length > 0) {
//     formData.images.forEach((image) => {
//       if (image) {
//         form.append('images', image);
//       }
//     });
//   }

//     try {
//       // Mengirimkan data ke backend
//       await axios.put(`${baseURL}/api/objects/update/${id}`, form, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       alert('Object updated successfully');
//       router.push('/admin/objects'); // Redirect setelah berhasil
//     } catch (error) {
//       console.error('Error updating object:', error);
//       alert('Error occurred while saving data');
//     }
//   };

//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="m-5 w-full">
//         <h1 className="text-xl font-semibold mb-4">Edit Object</h1>
//         <form id="modalForm" onSubmit={handleSubmit}>
//           {/* Input Gambar */}
//           <div className="flex mb-6 space-x-2">
//             {[...Array(5)].map((_, index) => (
//               <div
//                 key={index}
//                 className="relative w-20 h-20 border-dashed border-2 border-gray-400 rounded-md overflow-hidden"
//               >
//                 <input
//                   type="file"
//                   onChange={(e) => handleFileChange(e, index)}
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                 />
//                 {formData.images?.[index] ? (
//                   <img
//                     src={
//                       typeof formData.images[index] === 'string'
//                         ? `${baseURL}/uploads/${formData.images[index]}`
//                         : URL.createObjectURL(formData.images[index])
//                     }
//                     alt={`Preview ${index + 1}`}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex items-center justify-center w-full h-full bg-gray-200">
//                     <span className="text-sm text-gray-500">Select</span>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Dropdown Kategori */}
//           <div className="mb-4">
//             <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
//               Category
//             </label>
//             <select
//               name="category_id"
//               id="category_id"
//               value={formData.category_id}
//               onChange={handleChange}
//               className="mt-2 p-2 w-full border rounded"
//               required
//             >
//               <option value="">Select a category</option>
//               {categories.map((category) => (
//                 <option key={category.id} value={category.id}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Input untuk setiap bahasa */}
//           {['english', 'indonesian', 'chinese_simp', 'japanese', 'korean', 'russian', 'spanish', 'dutch'].map((lang) => (
//             <div key={lang}>
//               <h3 className="text-lg font-medium text-gray-700 mt-4">{lang.charAt(0).toUpperCase() + lang.slice(1)}</h3>

//               {/* Input untuk nama */}
//               <div className="mb-4">
//                 <label htmlFor={`name_${lang}`} className="block text-sm font-medium text-gray-700">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   id={`name_${lang}`}
//                   name={`name_${lang}`}
//                   value={formData[`name_${lang}`] || ''}
//                   onChange={handleChange}
//                   className="mt-2 p-2 w-full border rounded"
//                 />
//               </div>

//               {/* Input untuk lokasi */}
//               <div className="mb-4">
//                 <label htmlFor={`location_${lang}`} className="block text-sm font-medium text-gray-700">
//                   Location
//                 </label>
//                 <input
//                   type="text"
//                   id={`location_${lang}`}
//                   name={`location_${lang}`}
//                   value={formData[`location_${lang}`] || ''}
//                   onChange={handleChange}
//                   className="mt-2 p-2 w-full border rounded"
//                 />
//               </div>

//                 {/* Description */}
//                 <div className="mb-4">
//                 <label htmlFor={`description_${lang}`} className="block text-sm font-medium text-gray-700">
//                     Description
//                 </label>
//                 <div className="mb-2">
//                     <button
//                     type="button"
//                     onClick={() => handleBold(lang)}
//                     className="bg-gray-200 p-2 rounded mx-1"
//                     >
//                     B
//                     </button>
//                     <button
//                     type="button"
//                     onClick={() => handleItalic(lang)}
//                     className="bg-gray-200 p-2 rounded mx-1"
//                     >
//                     I
//                     </button>
//                 </div>
//                 <div
//                     ref={descriptionRefs[lang]}
//                     contentEditable
//                     onInput={() => handleTextAreaChange(lang)}
//                     className="mt-2 p-2 w-full border rounded min-h-[100px]"
//                     dangerouslySetInnerHTML={{
//                     __html: formData[`description_${lang}`] || "",
//                     }}
//                 ></div>
//                 </div>

//             </div>
//           ))}

//           <button
//             type="submit"
//             className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//           >
//             Save Changes
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditObjectPage;
