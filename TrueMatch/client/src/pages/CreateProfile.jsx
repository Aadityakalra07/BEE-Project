import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

/* ── Tag Input Component ── */
const TagInput = ({ label, values, onChange, placeholder }) => {
  const [input, setInput] = useState('');
  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      if (!values.includes(input.trim())) onChange([...values, input.trim()]);
      setInput('');
    }
  };
  const removeTag = (index) => onChange(values.filter((_, i) => i !== index));

  return (
    <div>
      <label className="label-premium">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {values.map((val, i) => (
          <span key={i} className="inline-flex items-center gap-1 text-xs font-semibold bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 px-2.5 py-1 rounded-full border border-brand-200 dark:border-brand-800/50">
            {val}
            <button type="button" onClick={() => removeTag(i)} className="hover:text-red-500 transition-colors">×</button>
          </span>
        ))}
      </div>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
        className="input-premium" placeholder={placeholder} />
      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Press Enter or comma to add</p>
    </div>
  );
};

const CreateProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: '', religion: '', caste: '', profession: '', education: '', city: '', bio: '',
  });
  const [partnerPrefs, setPartnerPrefs] = useState({
    minAge: '', maxAge: '', religion: [], city: [], education: [], profession: [],
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
        if (p.partnerPreferences) {
          setPartnerPrefs({
            minAge: p.partnerPreferences.minAge || '',
            maxAge: p.partnerPreferences.maxAge || '',
            religion: p.partnerPreferences.religion || [],
            city: p.partnerPreferences.city || [],
            education: p.partnerPreferences.education || [],
            profession: p.partnerPreferences.profession || [],
          });
        }
        if (p.photo) setPhotoPreview(`/uploads/${p.photo}`);
      } catch (err) { /* no existing profile */ }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePrefChange = (e) => setPartnerPrefs({ ...partnerPrefs, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) { setPhoto(file); setPhotoPreview(URL.createObjectURL(file)); }
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
      data.append('partnerPreferences', JSON.stringify(partnerPrefs));
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
    <div className="min-h-screen bg-surface-100 dark:bg-dark-bg py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Complete Your Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill in your details and partner preferences</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {error && (
            <div className="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}
          {success && (
            <div className="mb-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-sm px-4 py-3 rounded-xl">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ═══ PHOTO ═══ */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-28 h-28 rounded-full object-cover ring-4 ring-brand-100 dark:ring-brand-900" />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-brand-50 dark:bg-dark-card flex items-center justify-center text-4xl ring-4 ring-brand-100 dark:ring-dark-border">📷</div>
                )}
              </div>
              <label className="cursor-pointer">
                <span className="btn-secondary text-sm !px-4 !py-2">{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>

            {/* ═══ PERSONAL DETAILS ═══ */}
            <div>
              <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                <span className="text-brand-500">👤</span> Personal Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label-premium">Age *</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} className="input-premium" placeholder="e.g. 25" min="18" max="100" />
                </div>
                <div>
                  <label className="label-premium">Religion *</label>
                  <select name="religion" value={formData.religion} onChange={handleChange} className="input-premium">
                    <option value="">Select Religion</option>
                    {['Hindu','Muslim','Christian','Sikh','Buddhist','Jain','Other'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-premium">Caste</label>
                  <input type="text" name="caste" value={formData.caste} onChange={handleChange} className="input-premium" placeholder="e.g. Brahmin" />
                </div>
                <div>
                  <label className="label-premium">Education</label>
                  <select name="education" value={formData.education} onChange={handleChange} className="input-premium">
                    <option value="">Select Education</option>
                    {["High School","Diploma","Bachelor's","Master's","PhD","Other"].map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-premium">Profession</label>
                  <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="input-premium" placeholder="e.g. Software Engineer" />
                </div>
                <div>
                  <label className="label-premium">City *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="input-premium" placeholder="e.g. Mumbai" />
                </div>
              </div>
              <div className="mt-5">
                <label className="label-premium">About Me</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} className="input-premium resize-none" rows={4} placeholder="Write something about yourself..." maxLength={500} />
                <p className="text-right text-xs text-gray-400 dark:text-gray-500 mt-1">{formData.bio.length}/500</p>
              </div>
            </div>

            {/* ═══ PARTNER PREFERENCES ═══ */}
            <div className="border-t border-brand-100/30 dark:border-dark-border/30 pt-8">
              <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-2 flex items-center gap-2">
                <span className="text-brand-500">💍</span> Partner Preferences
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
                Help us find your best matches. These preferences power your compatibility scores.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="label-premium">Preferred Min Age</label>
                  <input type="number" name="minAge" value={partnerPrefs.minAge} onChange={handlePrefChange}
                    className="input-premium" placeholder="e.g. 21" min="18" max="100" />
                </div>
                <div>
                  <label className="label-premium">Preferred Max Age</label>
                  <input type="number" name="maxAge" value={partnerPrefs.maxAge} onChange={handlePrefChange}
                    className="input-premium" placeholder="e.g. 35" min="18" max="100" />
                </div>
              </div>

              <div className="space-y-5">
                <TagInput label="Preferred Religions" values={partnerPrefs.religion}
                  onChange={(v) => setPartnerPrefs({ ...partnerPrefs, religion: v })}
                  placeholder="e.g. Hindu, Sikh" />
                <TagInput label="Preferred Cities" values={partnerPrefs.city}
                  onChange={(v) => setPartnerPrefs({ ...partnerPrefs, city: v })}
                  placeholder="e.g. Mumbai, Delhi" />
                <TagInput label="Preferred Education" values={partnerPrefs.education}
                  onChange={(v) => setPartnerPrefs({ ...partnerPrefs, education: v })}
                  placeholder="e.g. Master's, PhD" />
                <TagInput label="Preferred Professions" values={partnerPrefs.profession}
                  onChange={(v) => setPartnerPrefs({ ...partnerPrefs, profession: v })}
                  placeholder="e.g. Engineer, Doctor" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary !py-3 disabled:opacity-60">
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
