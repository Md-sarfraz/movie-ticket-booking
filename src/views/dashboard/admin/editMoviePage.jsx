import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Film, Plus, X, CheckCircle,
  Loader2, Upload, Users, Image as ImageIcon, Save
} from "lucide-react";
import { getMovieById, updateMovie, uploadImageToCloudinary } from "../../../services/movie-service";

const GENRES = [
  "Action","Adventure","Animation","Comedy","Crime","Documentary",
  "Drama","Fantasy","Horror","Mystery","Romance","Sci-Fi","Thriller"
];
const LANGUAGES = [
  "English","Hindi","Telugu","Tamil","Malayalam","Kannada",
  "Bengali","Marathi","Punjabi","Gujarati","Urdu",
  "Korean","Japanese","Chinese","Spanish","French"
];

const makePerson = () => ({
  id: Date.now() + Math.random(),
  name: "", role: "", imageUrl: "", imagePreview: null, uploading: false,
});

/* ─────────────── ImageUploadBox ─────────────── */
const ImageUploadBox = ({ label, preview, uploading, onChange }) => (
  <label className="block cursor-pointer">
    <span className="text-xs font-semibold text-gray-700 mb-1.5 block">{label}</span>
    <div
      className={`relative border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden
        ${preview ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50 hover:border-red-400 hover:bg-red-50"}
        transition-all`}
      style={{ height: 110 }}
    >
      {uploading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <Loader2 size={20} className="animate-spin text-red-500" />
        </div>
      )}
      {preview
        ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
        : <div className="flex flex-col items-center gap-1 text-gray-400">
            <Upload size={18} />
            <span className="text-xs">Click to upload</span>
          </div>
      }
      <input type="file" accept="image/*" className="sr-only" onChange={e => onChange(e.target.files[0])} />
      {preview && (
        <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-xs text-center py-1">
          Click to replace
        </div>
      )}
    </div>
  </label>
);

/* ─────────────── PersonRow ─────────────── */
const PersonRow = ({ person, onUpdate, onRemove, onImageUpload }) => (
  <div className="flex gap-2 items-center">
    <label className="cursor-pointer flex-shrink-0">
      <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50 hover:border-red-400 transition-all relative">
        {person.uploading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <Loader2 size={12} className="animate-spin text-red-500" />
          </div>
        )}
        {person.imagePreview
          ? <img src={person.imagePreview} alt="" className="w-full h-full object-cover" />
          : <Upload size={12} className="text-gray-400" />
        }
        <input type="file" accept="image/*" className="sr-only" onChange={e => onImageUpload(e.target.files[0])} />
      </div>
    </label>
    <input
      type="text" placeholder="Name" value={person.name}
      onChange={e => onUpdate('name', e.target.value)}
      className="flex-1 min-w-0 p-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-400"
    />
    <input
      type="text" placeholder="Role" value={person.role}
      onChange={e => onUpdate('role', e.target.value)}
      className="flex-1 min-w-0 p-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-400"
    />
    <button type="button" onClick={onRemove} className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-all">
      <X size={14} />
    </button>
  </div>
);

/* ─────────────── Main Page ─────────────── */
const EditMoviePage = () => {
  const navigate = useNavigate();
  const { movieId } = useParams();

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", genre: "", duration: "", language: "",
    rating: "", director: "", releaseDate: "", trailer: "",
    postUrl: "", backgroundImageUrl: "",
    posterPreview: null, bgPreview: null,
    uploadingPoster: false, uploadingBg: false,
  });
  const [castMembers, setCastMembers] = useState([]);
  const [crewMembers, setCrewMembers] = useState([]);

  useEffect(() => {
    getMovieById(movieId)
      .then(m => {
        setForm({
          title: m.title || "",
          description: m.description || "",
          genre: m.genre || "",
          duration: m.duration || "",
          language: m.language || "",
          rating: m.rating != null ? String(m.rating) : "",
          director: m.director || "",
          releaseDate: m.releaseDate || "",
          trailer: m.trailer || "",
          postUrl: m.postUrl || "",
          backgroundImageUrl: m.backgroundImageUrl || "",
          posterPreview: m.postUrl || null,
          bgPreview: m.backgroundImageUrl || null,
          uploadingPoster: false,
          uploadingBg: false,
        });
        setCastMembers(
          (m.castMember || []).map(p => ({
            id: Date.now() + Math.random(),
            name: p.name || "",
            role: p.role || "",
            imageUrl: p.imageUrl || "",
            imagePreview: p.imageUrl || null,
            uploading: false,
          }))
        );
        setCrewMembers(
          (m.crewMember || []).map(p => ({
            id: Date.now() + Math.random(),
            name: p.name || "",
            role: p.role || "",
            imageUrl: p.imageUrl || "",
            imagePreview: p.imageUrl || null,
            uploading: false,
          }))
        );
      })
      .catch(() => alert("Failed to load movie details"))
      .finally(() => setPageLoading(false));
  }, [movieId]);

  const handleImageUpload = async (field, file) => {
    if (!file) return;
    const isPost = field === 'postUrl';
    const loadingKey = isPost ? 'uploadingPoster' : 'uploadingBg';
    const previewKey = isPost ? 'posterPreview' : 'bgPreview';
    setForm(prev => ({ ...prev, [previewKey]: URL.createObjectURL(file), [loadingKey]: true }));
    try {
      const url = await uploadImageToCloudinary(file);
      setForm(prev => ({ ...prev, [field]: url, [loadingKey]: false }));
    } catch (err) {
      alert("Image upload failed: " + (err.response?.data?.message || err.message));
      setForm(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const addPerson = (type) => {
    const person = makePerson();
    if (type === 'cast') setCastMembers(prev => [...prev, person]);
    else setCrewMembers(prev => [...prev, person]);
  };

  const removePerson = (type, id) => {
    if (type === 'cast') setCastMembers(prev => prev.filter(p => p.id !== id));
    else setCrewMembers(prev => prev.filter(p => p.id !== id));
  };

  const updatePerson = (type, id, field, value) => {
    const setter = type === 'cast' ? setCastMembers : setCrewMembers;
    setter(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handlePersonImageUpload = async (type, id, file) => {
    if (!file) return;
    updatePerson(type, id, 'imagePreview', URL.createObjectURL(file));
    updatePerson(type, id, 'uploading', true);
    try {
      const url = await uploadImageToCloudinary(file);
      updatePerson(type, id, 'imageUrl', url);
    } catch {
      alert("Image upload failed");
    } finally {
      updatePerson(type, id, 'uploading', false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { alert("Title is required"); return; }
    if (!form.genre) { alert("Please select a genre"); return; }
    if (!form.language) { alert("Please select a language"); return; }
    if (!form.postUrl) { alert("Poster image is required"); return; }
    if (!form.backgroundImageUrl) { alert("Background image is required"); return; }

    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description,
        genre: form.genre,
        duration: form.duration,
        language: form.language,
        rating: form.rating ? parseFloat(form.rating) : null,
        director: form.director,
        releaseDate: form.releaseDate || null,
        trailer: form.trailer,
        postUrl: form.postUrl,
        backgroundImageUrl: form.backgroundImageUrl,
        castMember: castMembers
          .filter(p => p.name.trim())
          .map(({ name, role, imageUrl }) => ({ name, role, imageUrl })),
        crewMember: crewMembers
          .filter(p => p.name.trim())
          .map(({ name, role, imageUrl }) => ({ name, role, imageUrl })),
      };

      await updateMovie(movieId, payload);
      alert("Movie updated successfully!");
      navigate('/adminDashboard/movieList');
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={32} className="animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 md:p-6">
      {/* Header */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/adminDashboard/movieList')}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 mb-3 transition-all text-sm"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back to Movie List</span>
        </button>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <Film className="text-red-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit <span className="text-red-500">Movie</span>
              </h1>
              <p className="text-sm text-gray-500 truncate max-w-xs">{form.title}</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-6 space-y-6">

        {/* Images */}
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">
            <ImageIcon size={18} className="text-red-500" /> Images
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUploadBox
              label="Poster Image *"
              preview={form.posterPreview}
              uploading={form.uploadingPoster}
              onChange={file => handleImageUpload('postUrl', file)}
            />
            <ImageUploadBox
              label="Background Image *"
              preview={form.bgPreview}
              uploading={form.uploadingBg}
              onChange={file => handleImageUpload('backgroundImageUrl', file)}
            />
          </div>
        </div>

        {/* Basic Info */}
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">
            <Film size={18} className="text-red-500" /> Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Title *</label>
              <input
                type="text" value={form.title} placeholder="Movie title"
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Genre *</label>
              <select
                value={form.genre}
                onChange={e => setForm(p => ({ ...p, genre: e.target.value }))}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Genre</option>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Language *</label>
              <select
                value={form.language}
                onChange={e => setForm(p => ({ ...p, language: e.target.value }))}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Language</option>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Duration</label>
              <input
                type="text" value={form.duration} placeholder="2h 30m"
                onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Rating</label>
              <input
                type="number" value={form.rating} placeholder="8.5" min="0" max="10" step="0.1"
                onChange={e => setForm(p => ({ ...p, rating: e.target.value }))}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Director</label>
              <input
                type="text" value={form.director} placeholder="Director name"
                onChange={e => setForm(p => ({ ...p, director: e.target.value }))}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Release Date</label>
              <input
                type="date" value={form.releaseDate}
                onChange={e => setForm(p => ({ ...p, releaseDate: e.target.value }))}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Trailer URL</label>
              <input
                type="url" value={form.trailer} placeholder="https://youtube.com/..."
                onChange={e => setForm(p => ({ ...p, trailer: e.target.value }))}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Description</label>
              <textarea
                value={form.description} placeholder="Movie description..." rows={4}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Cast */}
        <div>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-800">
              <Users size={18} className="text-red-500" /> Cast Members
            </h2>
            <button
              type="button"
              onClick={() => addPerson('cast')}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium"
            >
              <Plus size={13} /> Add Cast
            </button>
          </div>
          <div className="space-y-2">
            {castMembers.map(p => (
              <PersonRow
                key={p.id} person={p}
                onUpdate={(field, val) => updatePerson('cast', p.id, field, val)}
                onRemove={() => removePerson('cast', p.id)}
                onImageUpload={file => handlePersonImageUpload('cast', p.id, file)}
              />
            ))}
            {castMembers.length === 0 && (
              <p className="text-xs text-gray-400 italic">No cast members — click "Add Cast" to add</p>
            )}
          </div>
        </div>

        {/* Crew */}
        <div>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-800">
              <ImageIcon size={18} className="text-red-500" /> Crew Members
            </h2>
            <button
              type="button"
              onClick={() => addPerson('crew')}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium"
            >
              <Plus size={13} /> Add Crew
            </button>
          </div>
          <div className="space-y-2">
            {crewMembers.map(p => (
              <PersonRow
                key={p.id} person={p}
                onUpdate={(field, val) => updatePerson('crew', p.id, field, val)}
                onRemove={() => removePerson('crew', p.id)}
                onImageUpload={file => handlePersonImageUpload('crew', p.id, file)}
              />
            ))}
            {crewMembers.length === 0 && (
              <p className="text-xs text-gray-400 italic">No crew members — click "Add Crew" to add</p>
            )}
          </div>
        </div>

        {/* Bottom save button */}
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMoviePage;
