import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ShareIcon from '@mui/icons-material/Share';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { userContext } from '../Context/UserContext';
import axios from 'axios';

function LandingPage() {
  const navigate = useNavigate();
  const {setUserInfo, setFolders} = useContext(userContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:4000/auth/profile', {
          withCredentials: true// This is important for sending cookies
        });
        setUserInfo(response.data.user_data);
        setFolders(response.data.folder_list);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      {/* Navbar */}
      <nav className="bg-base-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-3xl font-bold text-primary">ShareUp</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/signin')}
                className="px-4 py-2 rounded-md text-sm font-medium text-base-content hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-base-100 shadow-md">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-base-content sm:text-5xl">
            Welcome to <span className="text-primary">ShareUp</span>
          </h2>
          <p className="mt-4 text-xl text-base-content/80 max-w-3xl mx-auto">
            Upload, manage, and share your images with ease. Experience the future of image sharing.
          </p>
          <div className="mt-8">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-110"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-extrabold text-base-content">What You Can Do with ShareUp</h3>
            <p className="mt-4 text-xl text-base-content/70 max-w-3xl mx-auto">
              Discover the features that allow you to manage and share your images effortlessly.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <FeatureCard
              icon={<CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main' }} />}
              title="Easy Upload"
              description="Securely upload your images with just a few clicks."
            />
            <FeatureCard
              icon={<PhotoLibraryIcon sx={{ fontSize: 48, color: 'primary.main' }} />}
              title="Manage Library"
              description="Organize and manage your image library effortlessly."
            />
            <FeatureCard
              icon={<ShareIcon sx={{ fontSize: 48, color: 'primary.main' }} />}
              title="Share Instantly"
              description="Create shareable links and share your images instantly."
            />
            <FeatureCard
              icon={<CheckCircleIcon sx={{ fontSize: 48, color: 'primary.main' }} />}
              title="Storage Limits"
              description="Create up to 10 folders and upload 300 images per folder."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-xl mb-8">Join ShareUp today and experience the easiest way to manage and share your images.</p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition duration-150 ease-in-out"
          >
            Sign Up Now
          </button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-base-100 rounded-lg shadow-md p-6 text-center transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
      <div className="flex justify-center mb-4">{icon}</div>
      <h4 className="text-xl font-semibold text-base-content mb-2">{title}</h4>
      <p className="text-base-content/70">{description}</p>
    </div>
  );
}

export default LandingPage;
