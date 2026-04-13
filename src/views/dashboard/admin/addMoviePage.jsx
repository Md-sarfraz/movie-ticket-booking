import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Film, Plus, X, ChevronDown, ChevronUp,
  CheckCircle, AlertCircle, Loader2, Upload, Users, Image as ImageIcon
} from "lucide-react";
import { uploadImageToCloudinary, createBulkMovies } from "../../../services/movie-service";

const GENRES = [
  "Action","Adventure","Animation","Comedy","Crime","Documentary",
  "Drama","Fantasy","Horror","Mystery","Romance","Sci-Fi","Thriller"
];
const LANGUAGES = [
  "English","Hindi","Telugu","Tamil","Malayalam","Kannada",
  "Bengali","Marathi","Punjabi","Gujarati","Urdu",
  "Korean","Japanese","Chinese","Spanish","French"
];

const makeMovie = () => ({
  id: Date.now() + Math.random(),
  title: "", description: "", genre: "", duration: "", language: "",
  rating: "", director: "", releaseDate: "", trailer: "",
  postUrl: "", backgroundImageUrl: "",
  posterPreview: null, bgPreview: null,
  uploadingPoster: false, uploadingBg: false,
  castMembers: [], crewMembers: [],
  collapsed: false,
});

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
      style={{ height: 90 }}
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
            <span className="text-xs">Upload</span>
          </div>
      }
      <input type="file" accept="image/*" className="sr-only" onChange={e => onChange(e.target.files[0])} />
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

/* ─────────────── MovieCard ─────────────── */
const MovieCard = ({ movie, index, totalMovies, onUpdate, onRemove, onToggleCollapse, onImageUpload, onAddPerson, onRemovePerson, onUpdatePerson, onPersonImageUpload }) => {
  const hasImages = movie.postUrl && movie.backgroundImageUrl;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {totalMovies > 1 && (
            <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
              {index + 1}
            </span>
          )}
          <span className="font-semibold text-gray-800 text-sm truncate max-w-xs">
            {movie.title || <span className="text-gray-400 font-normal italic">Untitled Movie</span>}
          </span>
          {hasImages && <CheckCircle size={14} className="text-green-500 flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onToggleCollapse} className="text-gray-500 hover:text-gray-800 transition-all">
            {movie.collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
          {totalMovies > 1 && (
            <button type="button" onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-all">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Card Body */}
      {!movie.collapsed && (
        <div className="p-4 space-y-5">
          {/* Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ImageUploadBox
              label="Poster Image *"
              preview={movie.posterPreview}
              uploading={movie.uploadingPoster}
              onChange={file => onImageUpload('postUrl', file)}
            />
            <ImageUploadBox
              label="Background Image *"
              preview={movie.bgPreview}
              uploading={movie.uploadingBg}
              onChange={file => onImageUpload('backgroundImageUrl', file)}
            />
          </div>

          {/* Core fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-3">
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Title *</label>
              <input
                type="text" value={movie.title} placeholder="Movie title"
                onChange={e => onUpdate({ title: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Genre *</label>
              <select value={movie.genre} onChange={e => onUpdate({ genre: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="">Select Genre</option>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Language *</label>
              <select value={movie.language} onChange={e => onUpdate({ language: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="">Select Language</option>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Duration</label>
              <input type="text" value={movie.duration} placeholder="2h 30m"
                onChange={e => onUpdate({ duration: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Rating</label>
              <input type="number" value={movie.rating} placeholder="8.5" min="0" max="10" step="0.1"
                onChange={e => onUpdate({ rating: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Director</label>
              <input type="text" value={movie.director} placeholder="Director name"
                onChange={e => onUpdate({ director: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Release Date</label>
              <input type="date" value={movie.releaseDate}
                onChange={e => onUpdate({ releaseDate: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Trailer URL</label>
              <input type="url" value={movie.trailer} placeholder="https://youtube.com/..."
                onChange={e => onUpdate({ trailer: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>

            <div className="md:col-span-3">
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Description</label>
              <textarea value={movie.description} placeholder="Movie description..." rows={3}
                onChange={e => onUpdate({ description: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            </div>
          </div>

          {/* Cast */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Users size={15} className="text-red-500" />
                <span className="text-sm font-semibold text-gray-700">Cast Members</span>
              </div>
              <button type="button" onClick={() => onAddPerson('cast')}
                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium">
                <Plus size={13} /> Add Cast
              </button>
            </div>
            <div className="space-y-2">
              {movie.castMembers.map(p => (
                <PersonRow
                  key={p.id} person={p}
                  onUpdate={(field, val) => onUpdatePerson('cast', p.id, field, val)}
                  onRemove={() => onRemovePerson('cast', p.id)}
                  onImageUpload={file => onPersonImageUpload('cast', p.id, file)}
                />
              ))}
              {movie.castMembers.length === 0 && (
                <p className="text-xs text-gray-400 italic">No cast members added yet</p>
              )}
            </div>
          </div>

          {/* Crew */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <ImageIcon size={15} className="text-red-500" />
                <span className="text-sm font-semibold text-gray-700">Crew Members</span>
              </div>
              <button type="button" onClick={() => onAddPerson('crew')}
                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium">
                <Plus size={13} /> Add Crew
              </button>
            </div>
            <div className="space-y-2">
              {movie.crewMembers.map(p => (
                <PersonRow
                  key={p.id} person={p}
                  onUpdate={(field, val) => onUpdatePerson('crew', p.id, field, val)}
                  onRemove={() => onRemovePerson('crew', p.id)}
                  onImageUpload={file => onPersonImageUpload('crew', p.id, file)}
                />
              ))}
              {movie.crewMembers.length === 0 && (
                <p className="text-xs text-gray-400 italic">No crew members added yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────── Main Page ─────────────── */
const AddMoviePage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([makeMovie()]);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);

  const updateMovie = (id, updates) =>
    setMovies(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));

  const addMovie = () => {
    setMovies(prev => {
      const collapsed = prev.map(m => ({ ...m, collapsed: true }));
      return [...collapsed, makeMovie()];
    });
  };

  const removeMovie = (id) => setMovies(prev => prev.filter(m => m.id !== id));

  const toggleCollapse = (id) =>
    setMovies(prev => prev.map(m => m.id === id ? { ...m, collapsed: !m.collapsed } : m));

  const handleImageUpload = async (movieId, field, file) => {
    if (!file) return;
    const isPost = field === 'postUrl';
    const loadingKey = isPost ? 'uploadingPoster' : 'uploadingBg';
    const previewKey = isPost ? 'posterPreview' : 'bgPreview';
    updateMovie(movieId, { [previewKey]: URL.createObjectURL(file), [loadingKey]: true });
    try {
      const url = await uploadImageToCloudinary(file);
      updateMovie(movieId, { [field]: url, [loadingKey]: false });
    } catch (err) {
      alert("Image upload failed: " + (err.response?.data?.message || err.message));
      updateMovie(movieId, { [loadingKey]: false });
    }
  };

  const addPerson = (movieId, type) => {
    setMovies(prev => prev.map(m => {
      if (m.id !== movieId) return m;
      const person = makePerson();
      return type === 'cast'
        ? { ...m, castMembers: [...m.castMembers, person] }
        : { ...m, crewMembers: [...m.crewMembers, person] };
    }));
  };

  const removePerson = (movieId, type, personId) => {
    setMovies(prev => prev.map(m => {
      if (m.id !== movieId) return m;
      return type === 'cast'
        ? { ...m, castMembers: m.castMembers.filter(p => p.id !== personId) }
        : { ...m, crewMembers: m.crewMembers.filter(p => p.id !== personId) };
    }));
  };

  const updatePerson = (movieId, type, personId, field, value) => {
    setMovies(prev => prev.map(m => {
      if (m.id !== movieId) return m;
      const arr = type === 'cast' ? m.castMembers : m.crewMembers;
      const updated = arr.map(p => p.id === personId ? { ...p, [field]: value } : p);
      return type === 'cast' ? { ...m, castMembers: updated } : { ...m, crewMembers: updated };
    }));
  };

  const handlePersonImageUpload = async (movieId, type, personId, file) => {
    if (!file) return;
    updatePerson(movieId, type, personId, 'imagePreview', URL.createObjectURL(file));
    updatePerson(movieId, type, personId, 'uploading', true);
    try {
      const url = await uploadImageToCloudinary(file);
      updatePerson(movieId, type, personId, 'imageUrl', url);
    } catch {
      alert("Cast/crew image upload failed");
    } finally {
      updatePerson(movieId, type, personId, 'uploading', false);
    }
  };

  const handleSubmit = async () => {
    for (const m of movies) {
      if (!m.title.trim()) { alert("Please fill in the title for all movies"); return; }
      if (!m.genre) { alert(`Please select a genre for "${m.title || 'untitled'}"`); return; }
      if (!m.language) { alert(`Please select a language for "${m.title || 'untitled'}"`); return; }
      if (!m.postUrl) { alert(`Please upload a poster image for "${m.title || 'untitled'}"`); return; }
      if (!m.backgroundImageUrl) { alert(`Please upload a background image for "${m.title || 'untitled'}"`); return; }
    }

    setSubmitting(true);
    setResults(null);
    try {
      const payload = movies.map(m => ({
        title: m.title.trim(),
        description: m.description,
        genre: m.genre,
        duration: m.duration,
        language: m.language,
        rating: m.rating ? parseFloat(m.rating) : null,
        director: m.director,
        releaseDate: m.releaseDate || null,
        trailer: m.trailer,
        postUrl: m.postUrl,
        backgroundImageUrl: m.backgroundImageUrl,
        featured: false,
        castMember: m.castMembers.filter(p => p.name.trim()).map(({ name, role, imageUrl }) => ({ name, role, imageUrl })),
        crewMember: m.crewMembers.filter(p => p.name.trim()).map(({ name, role, imageUrl }) => ({ name, role, imageUrl })),
      }));

      const response = await createBulkMovies(payload);
      setResults(response);
      if (response.status) {
        setMovies([makeMovie()]);
      }
    } catch (err) {
      alert("Failed to save: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const isBulk = movies.length > 1;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 md:p-6">
      {/* Header */}
      <div className="mb-4">
        <button onClick={() => navigate('/adminDashboard/movieList')}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 mb-3 transition-all text-sm">
          <ArrowLeft size={18} />
          <span className="font-medium">Back to Movie List</span>
        </button>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-lg"><Film className="text-red-600" size={24} /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Add <span className="text-red-500">Movie</span>
                {isBulk && (
                  <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {movies.length} queued
                  </span>
                )}
              </h1>
              <p className="text-sm text-gray-500">
                {isBulk ? "Images upload automatically — submit when ready" : "Fill in the details and submit, or add more movies"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addMovie}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-900 transition-all">
              <Plus size={16} /> Add Another Movie
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
              {submitting ? "Saving..." : isBulk ? `Submit All (${movies.length})` : "Submit Movie"}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className={`mb-4 p-4 rounded-xl border ${results.status ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <p className={`font-semibold mb-2 ${results.status ? 'text-green-700' : 'text-yellow-700'}`}>
            {results.message}
          </p>
          <ul className="space-y-1">
            {results.data?.map((r, i) => (
              <li key={i} className={`text-sm flex items-center gap-1.5 ${r.startsWith('SUCCESS') ? 'text-green-600' : 'text-red-600'}`}>
                {r.startsWith('SUCCESS') ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                {r}
              </li>
            ))}
          </ul>
          {results.status && (
            <button onClick={() => navigate('/adminDashboard/movieList')}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-all">
              Go to Movie List
            </button>
          )}
        </div>
      )}

      {/* Movie Cards */}
      <div className="space-y-4">
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            index={index}
            totalMovies={movies.length}
            onUpdate={(updates) => updateMovie(movie.id, updates)}
            onRemove={() => removeMovie(movie.id)}
            onToggleCollapse={() => toggleCollapse(movie.id)}
            onImageUpload={(field, file) => handleImageUpload(movie.id, field, file)}
            onAddPerson={(type) => addPerson(movie.id, type)}
            onRemovePerson={(type, personId) => removePerson(movie.id, type, personId)}
            onUpdatePerson={(type, personId, field, value) => updatePerson(movie.id, type, personId, field, value)}
            onPersonImageUpload={(type, personId, file) => handlePersonImageUpload(movie.id, type, personId, file)}
          />
        ))}
      </div>

      {/* Sticky bottom bar when many movies */}
      {movies.length > 2 && (
        <div className="sticky bottom-4 mt-6 flex justify-end">
          <button onClick={handleSubmit} disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:bg-red-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
            {submitting ? "Saving..." : `Submit All ${movies.length} Movies`}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddMoviePage;
