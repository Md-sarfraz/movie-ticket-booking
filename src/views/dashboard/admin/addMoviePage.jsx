import React, { useEffect, useState } from "react";
import { myAxios } from "../../../services/helper";
import { format } from "date-fns"
import { CalendarIcon, ArrowLeft, Film, Users, Image, FileText, Star, Plus, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { useNavigate } from "react-router-dom";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const AddMoviePage = () => {
  const navigate = useNavigate();
  const [date, setDate] = React.useState();
  const [dateOpen, setDateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [bgImagePreview, setBgImagePreview] = useState(null);

  // Dynamic cast and crew arrays
  const [castMembers, setCastMembers] = useState([]);
  const [crewMembers, setCrewMembers] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    duration: "",
    language: "",
    rating: "",
    director: "",
    releaseDate: "",
    trailer: "",
    image: "",
    backgroundImage: "",
  });

  // Add new cast member
  const addCastMember = () => {
    setCastMembers([...castMembers, { id: Date.now(), name: "", role: "", image: null, imagePreview: null }]);
  };

  // Remove cast member
  const removeCastMember = (id) => {
    setCastMembers(castMembers.filter(member => member.id !== id));
  };

  // Update cast member
  const updateCastMember = (id, field, value) => {
    setCastMembers(castMembers.map(member => {
      if (member.id === id) {
        if (field === 'image' && value) {
          // Create preview for image
          const reader = new FileReader();
          reader.onloadend = () => {
            setCastMembers(prev => prev.map(m => 
              m.id === id ? { ...m, imagePreview: reader.result } : m
            ));
          };
          reader.readAsDataURL(value);
          return { ...member, image: value };
        }
        return { ...member, [field]: value };
      }
      return member;
    }));
  };

  // Add new crew member
  const addCrewMember = () => {
    setCrewMembers([...crewMembers, { id: Date.now(), name: "", role: "", image: null, imagePreview: null }]);
  };

  // Remove crew member
  const removeCrewMember = (id) => {
    setCrewMembers(crewMembers.filter(member => member.id !== id));
  };

  // Update crew member
  const updateCrewMember = (id, field, value) => {
    setCrewMembers(crewMembers.map(member => {
      if (member.id === id) {
        if (field === 'image' && value) {
          // Create preview for image
          const reader = new FileReader();
          reader.onloadend = () => {
            setCrewMembers(prev => prev.map(m => 
              m.id === id ? { ...m, imagePreview: reader.result } : m
            ));
          };
          reader.readAsDataURL(value);
          return { ...member, image: value };
        }
        return { ...member, [field]: value };
      }
      return member;
    }));
  };

  // Handle input changes
  const handleChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      setFormData({ ...formData, [e.target.name]: file });
      
      // Create preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (e.target.name === "image") {
            setImagePreview(reader.result);
          } else if (e.target.name === "backgroundImage") {
            setBgImagePreview(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Upload image to get URL
  const uploadImage = async (file) => {
    if (!file) return null;
    
    try {
      const imageFormData = new FormData();
      imageFormData.append('image', file);
      
      const response = await myAxios.post('/cloudinary/upload/simple', imageFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const imageUrl = response.data.secure_url || response.data.url || response.data.imageUrl;
      
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + (error.response?.data?.message || error.message));
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();

      // Upload cast member images
      const castMemberData = await Promise.all(
        castMembers.map(async (member) => {
          const imageUrl = member.image ? await uploadImage(member.image) : null;
          return {
            name: member.name,
            role: member.role,
            imageUrl: imageUrl
          };
        })
      );

      // Upload crew member images
      const crewMemberData = await Promise.all(
        crewMembers.map(async (member) => {
          const imageUrl = member.image ? await uploadImage(member.image) : null;
          return {
            name: member.name,
            role: member.role,
            imageUrl: imageUrl
          };
        })
      );

      // Prepare movie JSON object (without files)
      const movieData = {
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        duration: formData.duration,
        language: formData.language,
        rating: parseFloat(formData.rating),
        director: formData.director,
        releaseDate: formData.releaseDate,
        trailer: formData.trailer,
        featured: false,
        castMember: castMemberData.filter(member => member.name.trim() !== ''),
        crewMember: crewMemberData.filter(member => member.name.trim() !== '')
      };

      // Append JSON as string
      payload.append("movie", JSON.stringify(movieData));

      // Append files separately
      if (formData.image) {
        payload.append("image", formData.image);
      }

      if (formData.backgroundImage) {
        payload.append("backgroundImage", formData.backgroundImage);
      }

      const response = await myAxios.post(
        `/movie/createMovie`,
        payload
      );

      if (response.status === 201) {
        alert("Movie created successfully!");
        // Navigate back to movie list
        navigate('/adminDashboard/movieList');
      }

    } catch (error) {
      console.error(error);
      alert("Failed to create movie");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormData(prev => ({ ...prev, releaseDate: date ? format(date, "yyyy-MM-dd") : "" }));
  }, [date]);

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 md:p-6'>
      {/* Header */}
      <div className='mb-4'>
        <button 
          onClick={() => navigate('/adminDashboard/movieList')}
          className='flex items-center gap-2 text-gray-600 hover:text-red-600 mb-3 transition-all text-sm'
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back to Movie List</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-100 rounded-lg">
            <Film className="text-red-600" size={24} />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Add New <span className='text-red-500'>Movie</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className='max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100'>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Information Section */}
          <div className="pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Film className="text-red-500" size={20} />
              <h2 className='text-xl font-bold text-gray-800'>Basic Information</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className="md:col-span-3">
                <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                  Movie Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter movie title"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                  Genre <span className="text-red-500">*</span>
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
                  required
                >
                  <option value="">Select Genre</option>
                  <option value="Action">Action</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Animation">Animation</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Crime">Crime</option>
                  <option value="Documentary">Documentary</option>
                  <option value="Drama">Drama</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Horror">Horror</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Romance">Romance</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Thriller">Thriller</option>
                </select>
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="2h 30m"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                  Language <span className="text-red-500">*</span>
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
                  required
                >
                  <option value="">Select Language</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Urdu">Urdu</option>
                  <option value="Korean">Korean</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>

              <div>
                <label className='flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5'>
                  <Star size={14} className="text-yellow-500" />
                  Rating <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="8.5"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                  Director <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  placeholder="Director name"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                  Release Date <span className="text-red-500">*</span>
                </label>
                <Popover onOpenChange={setDateOpen} open={dateOpen}>
                  <PopoverTrigger asChild>
                    <button 
                      type="button"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white flex items-center justify-between cursor-pointer hover:border-red-300 transition-all text-left text-sm"
                    >
                      <span className={date ? "text-gray-900" : "text-gray-400"}>
                        {date ? format(date, "PPP") : "Choose date"}
                      </span>
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="md:col-span-2">
                <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                  Trailer URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="trailer"
                  value={formData.trailer}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Cast & Crew Section */}
          <div className="pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-red-500" size={20} />
              <h2 className='text-xl font-bold text-gray-800'>Cast & Crew</h2>
            </div>

            {/* Cast Members */}
            <div className='mb-5'>
              <div className='flex justify-between items-center mb-3'>
                <label className='block text-xs font-semibold text-gray-700'>
                  Cast Members
                </label>
                <button
                  type="button"
                  onClick={addCastMember}
                  className='flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-xs font-semibold'
                >
                  <Plus size={16} />
                  Add Cast
                </button>
              </div>

              {castMembers.length === 0 ? (
                <div className='bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-center'>
                  <Users className='mx-auto text-gray-400 mb-1' size={28} />
                  <p className='text-sm text-gray-500'>No cast members added yet</p>
                </div>
              ) : (
                <div className='space-y-2.5'>
                  {castMembers.map((member, index) => (
                    <div key={member.id} className='bg-gray-50 border border-gray-200 rounded-lg p-3 hover:border-red-300 transition-all'>
                      <div className='flex gap-3 items-start'>
                        <div className='flex-1 grid grid-cols-1 md:grid-cols-3 gap-3'>
                          <div>
                            <label className='block text-xs font-semibold text-gray-600 mb-1'>
                              Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => updateCastMember(member.id, 'name', e.target.value)}
                              placeholder="Cast member name"
                              className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm'
                              required
                            />
                          </div>
                          <div>
                            <label className='block text-xs font-semibold text-gray-600 mb-1'>
                              Role/Character <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) => updateCastMember(member.id, 'role', e.target.value)}
                              placeholder="as Character Name"
                              className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm'
                              required
                            />
                          </div>
                          <div>
                            <label className='block text-xs font-semibold text-gray-600 mb-1'>
                              Profile Image
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => updateCastMember(member.id, 'image', e.target.files[0])}
                              className='w-full p-2 border border-dashed border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-red-50 file:text-red-700 hover:file:bg-red-100 text-xs'
                            />
                          </div>
                        </div>
                        {member.imagePreview && (
                          <div className='w-16 h-16 rounded-lg overflow-hidden border border-gray-300'>
                            <img src={member.imagePreview} alt="Preview" className='w-full h-full object-cover' />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeCastMember(member.id)}
                          className='p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all'
                          title="Remove cast member"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Crew Members */}
            <div>
              <div className='flex justify-between items-center mb-3'>
                <label className='block text-xs font-semibold text-gray-700'>
                  Crew Members
                </label>
                <button
                  type="button"
                  onClick={addCrewMember}
                  className='flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-xs font-semibold'
                >
                  <Plus size={16} />
                  Add Crew
                </button>
              </div>

              {crewMembers.length === 0 ? (
                <div className='bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-center'>
                  <Users className='mx-auto text-gray-400 mb-1' size={28} />
                  <p className='text-sm text-gray-500'>No crew members added yet</p>
                </div>
              ) : (
                <div className='space-y-2.5'>
                  {crewMembers.map((member, index) => (
                    <div key={member.id} className='bg-gray-50 border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-all'>
                      <div className='flex gap-3 items-start'>
                        <div className='flex-1 grid grid-cols-1 md:grid-cols-3 gap-3'>
                          <div>
                            <label className='block text-xs font-semibold text-gray-600 mb-1'>
                              Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => updateCrewMember(member.id, 'name', e.target.value)}
                              placeholder="Crew member name"
                              className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm'
                              required
                            />
                          </div>
                          <div>
                            <label className='block text-xs font-semibold text-gray-600 mb-1'>
                              Role/Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) => updateCrewMember(member.id, 'role', e.target.value)}
                              placeholder="Director, Producer, etc."
                              className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm'
                              required
                            />
                          </div>
                          <div>
                            <label className='block text-xs font-semibold text-gray-600 mb-1'>
                              Profile Image
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => updateCrewMember(member.id, 'image', e.target.files[0])}
                              className='w-full p-2 border border-dashed border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-xs'
                            />
                          </div>
                        </div>
                        {member.imagePreview && (
                          <div className='w-16 h-16 rounded-lg overflow-hidden border border-gray-300'>
                            <img src={member.imagePreview} alt="Preview" className='w-full h-full object-cover' />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeCrewMember(member.id)}
                          className='p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all'
                          title="Remove crew member"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description & Media Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-red-500" size={20} />
              <h2 className='text-xl font-bold text-gray-800'>Description & Media</h2>
            </div>
            <div className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  onChange={handleChange}
                  value={formData?.description}
                  name='description'
                  placeholder="Enter movie description..."
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-y min-h-[100px]"
                  required
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2'>
                    <Image size={16} className="text-red-500" />
                    Movie Poster <span className="text-red-500">*</span>
                  </label>
                  {imagePreview && (
                    <div className="mb-2">
                      <img 
                        src={imagePreview} 
                        alt="Poster preview" 
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full p-2 border border-dashed border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-red-50 file:text-red-700 hover:file:bg-red-100 text-xs cursor-pointer hover:border-red-300"
                    required
                  />
                </div>

                <div>
                  <label className='flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2'>
                    <Image size={16} className="text-red-500" />
                    Background Image <span className="text-red-500">*</span>
                  </label>
                  {bgImagePreview && (
                    <div className="mb-2">
                      <img 
                        src={bgImagePreview} 
                        alt="Background preview" 
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    name="backgroundImage"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full p-2 border border-dashed border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-red-50 file:text-red-700 hover:file:bg-red-100 text-xs cursor-pointer hover:border-red-300"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200'>
            <button
              type="button"
              onClick={() => navigate('/adminDashboard/movieList')}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 rounded-lg transition-all font-semibold flex items-center justify-center gap-2 text-sm ${
                loading
                  ? 'bg-red-300 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-md'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Movie...
                </>
              ) : (
                <>
                  <Film size={18} />
                  Add Movie
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMoviePage;
