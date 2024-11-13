import React, { useContext, useState } from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { userContext } from '../Context/UserContext';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {userInfo,setUserInfo} = useContext(userContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your sign-up logic here
    if(confirmPassword===password){
        const response  = await axios.post("http://localhost:4000/auth/signup",
          {name,email,password},
          {
            withCredentials:true,
            headers:{
              "Content-Type":"application/json"
            }
          })
        if(response.status===200){
          console.log(response.data);
          setUserInfo(response.data);
          return  <Navigate to={'/'}/>
        }
    }
    else{
      console.log("password didn't matched");
    }
    console.log('Sign up attempt with:', name, email, password);
  };

  const handleGoogleSignUp = async () => {
      window.open('http://localhost:4000/auth/google',"_self")
  };

  if(userInfo)
    {
      return <Navigate to={'/'}/>
    }

  return (
    <div className="max-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-base-100 p-8 rounded-lg shadow-lg">
        <div>
          <h1 className="text-4xl font-bold text-center text-primary">ShareUp</h1>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-base-content">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 bg-base-200 border border-base-300 rounded-md shadow-sm placeholder-base-content/50 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 bg-base-200 border border-base-300 rounded-md shadow-sm placeholder-base-content/50 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 bg-base-200 border border-base-300 rounded-md shadow-sm placeholder-base-content/50 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign up
            </button>
          </div>
        </form>
        <div>
          <button
            onClick={handleGoogleSignUp}
            className="group relative w-full flex justify-center py-2 px-4 border border-base-300 text-sm font-medium rounded-md text-base-content bg-base-100 hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <GoogleIcon className="mr-2" sx={{color:"blue"}}/>
            Sign up with Google
          </button>
        </div>
        <div className="text-center">
          <p className="mt-2 text-sm text-base-content">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/signin')}
              className="font-medium text-primary hover:text-primary-focus"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;