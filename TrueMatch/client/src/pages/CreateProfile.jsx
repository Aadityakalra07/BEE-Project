import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all duration-200 bg-white';
const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5';

const CreateProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: '', religion: '', caste: '', profession: '', education: '', city: '', bio: '',
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get('/api/profile/me');
        const p = res.data;
        setFormData({
          age: p.age || '', religion: p.religion || '', caste: p.caste || '',
          profession: p.profession || '', education: p.education || '',
          city: p.city || '', bio: p.bio || '',
        });
        if (p.photo) setPhotoPreview(`/uploads/${p.photo}`);
      } catch (err) { /* no existing profile */ }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!formData.age || !formData.religion || !formData.city) {
      setError('Please fill in age, religion, and city');
      return;
    }
    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (photo) data.append('photo', photo);
      await axios.put('/api/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Profile saved! Waiting for admin approval.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">Complete Your Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in your details to start appearing in search results</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}
          {success && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-28 h-28 rounded-full object-cover ring-4 ring-gray-100" />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center text-4xl ring-4 ring-gray-200">
                    ðŸ“·
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <span className="text-sm font-semibold text-gray-900 hover:text-black border border-gray-200 hover:border-gray-900 px-4 py-2 rounded-full transition-all duration-200">
                  {photoPreview ? 'Change Photo' : 'Upload Photo'}
                </span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
              <p className="text-xs text-gray-400">Max 5MB Â· JPG, PNG</p>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Age *</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputCls} placeholder="e.g. 25" min="18" max="100" />
              </div>

              <div>
                <label className={labelCls}>Religion *</label>
                <select name="religion" value={formData.religion} onChange={handleChange} className={inputCls}>
                  <option value="">Select Religion</option>
                  {['Hindu','Muslim','Christian','Sikh','Buddhist','Jain','Other'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Caste</label>
                <input type="text" name="caste" value={formData.caste} onChange={handleChange} className={inputCls} placeholder="e.g. Brahmin, Rajput" />
              </div>

              <div>
                <label className={labelCls}>Education</label>
                <select name="education" value={formData.education} onChange={handleChange} className={inputCls}>
                  <option value="">Select Education</option>
                  {["High School","Diploma","Bachelor's","Master's","PhD","Other"].map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Profession</label>
                <input type="text" name="profession" value={formData.profession} onChange={handleChange} className={inputCls} placeholder="e.g. Software Engineer" />
              </div>

              <div>
                <label className={labelCls}>City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputCls} placeholder="e.g. Mumbai" />
              </div>
            </div>

            <div>
              <label className={labelCls}>About Me</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className={`${inputCls} resize-none`}
                rows={4}
                placeholder="Write something about yourself..."
                maxLength={500}
              />
              <p className="text-right text-xs text-gray-400 mt-1">{formData.bio.length}/500</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-900 hover:bg-black text-white font-semibold rounded-full transition-all duration-200 disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
