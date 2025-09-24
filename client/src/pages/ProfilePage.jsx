import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Generate preview URL for selected image
  useEffect(() => {
    if (!selectedImg) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedImg);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl); // cleanup
  }, [selectedImg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profileData = { fullName: name, bio };

      if (selectedImg) {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImg);
        await new Promise((resolve) => {
          reader.onloadend = () => {
            profileData.profilePic = reader.result;
            resolve();
          };
        });
      }

      await updateProfile(profileData);
      navigate('/');
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen floating-particles flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-md glass-morphism rounded-3xl overflow-hidden shadow-2xl relative z-10 shimmer">
        {/* Back Button */}
        <button
          type="button"
          aria-label="Go back"
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-green-400/50 group z-10"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white group-hover:text-green-300 transition-colors">
            <path d="M19 12H5M12 19L5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round" />
          </svg>
        </button>

        <form onSubmit={handleSubmit} className="p-8 pt-16 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
  Edit Profile
</h1>

            <p className="text-gray-400 text-sm">Update your information</p>
          </div>

          {/* Profile Image Upload */}
          <div className="flex justify-center">
            <label htmlFor="avatar" className="group cursor-pointer">
              <input
                onChange={(e) => setSelectedImg(e.target.files[0])}
                type="file"
                id="avatar"
                accept=".png,.jpg,.jpeg"
                hidden
              />
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-3 border-white/20 group-hover:border-green-500/50 transition-all duration-300 shadow-lg">

                  <img
                    src={preview || authUser?.profilePic || assets.avatar_icon}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center border-2 border-white/20 group-hover:scale-110 group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-300">

                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M23 19C23 20.1046 22.1046 21 21 21H3C1.89543 21 1 20.1046 1 19V8C1 6.89543 1.89543 6 3 6H7L9 3H15L17 6H21C22.1046 6 23 6.89543 23 8V19Z"
                      stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="13" r="4"
                      stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-green-600 text-xs mt-2 group-hover:text-green-300 transition-colors">
  Change Photo
</p>

            </label>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
                placeholder="Enter your name"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 text-white placeholder-gray-400 transition-all duration-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell something about yourself..."
                required
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 text-white placeholder-gray-400 resize-none transition-all duration-200 text-sm"
                rows={3}
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 shadow-lg transform
              ${loading
  ? "bg-gray-500 cursor-not-allowed"
  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:shadow-xl hover:shadow-green-700/25 hover:scale-[1.02] active:scale-[0.98]"
}
`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
