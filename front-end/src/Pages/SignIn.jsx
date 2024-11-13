import React, { useContext, useState } from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import { userContext } from '../Context/UserContext';
import axios from 'axios';

function SignIn() {
  const [email, setEmail] = useState('');
  const {userInfo,setUserInfo} = useContext(userContext);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your sign-in logic here
    const response = await axios.post('http://localhost:4000/auth/login', 
      {email,password},
      {
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }
      });
    if(response.status === 200){
      setUserInfo(response.data);
    }

    console.log('Sign in attempt with:', email, password);
  };

  const handleGoogleSignIn = () => {
    // Add your Google sign-in logic here
    window.open('http://localhost:4000/auth/google',"_self")
    console.log('Google sign-in attempt');
  };

  if(userInfo){
    return <Navigate to={"/"}/>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-base-100 p-8 rounded-lg shadow-lg">
        <div>
          <h1 className="text-4xl font-bold text-center text-primary">ShareUp</h1>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-base-content">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 bg-base-200 border border-base-300 rounded-md shadow-sm placeholder-base-content/50 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full px-3 py-2 bg-base-200 border border-base-300 rounded-md shadow-sm placeholder-base-content/50 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign in
            </button>
          </div>
        </form>
        <div>
          <button
            onClick={handleGoogleSignIn}
            className="group relative w-full flex justify-center py-2 px-4 border border-base-300 text-sm font-medium rounded-md text-base-content bg-base-100 hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <GoogleIcon className="mr-2" sx={{color:"blue"}} />
            Sign in with Google
          </button>
        </div>
        <div className="text-center">
          <p className="mt-2 text-sm text-base-content">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="font-medium text-primary hover:text-primary-focus"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
