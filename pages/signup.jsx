import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MbButton } from "mintbase-ui";
import { useState } from 'react';
import Toast from '../components/Toast';
import axios from 'axios';
import { useRouter } from 'next/router';

// import AuthImage from '../images/auth-image.jpg';
// import AuthDecoration from '../images/auth-decoration.png';

function Signup() {
  const [data, setData] = useState({});
  const [responseMessage, setResponseMessage] = useState('');
  const [toastErrorOpen, setToastErrorOpen] = useState(false);
  const [toastSuccessOpen, setToastSuccessOpen] = useState(false);
  const router = useRouter();


  async function httpLoginUser(event) {
    event.preventDefault();
    const newData = {...data}
    try {
      console.log(data)
      if (!newData.email ||!newData.password || !newData.fullName || !newData.phone || !newData.confirmPassword) {
          setResponseMessage('Enter all required fields!');
          setToastErrorOpen(true);
          return;
        }

      if (!(newData.password === newData.confirmPassword)) {
        setResponseMessage('Password mismatch!');
        setToastErrorOpen(true);
        return;
      }

      const res = await axios.post('https://still-garden-99623.herokuapp.com/signup', newData, {
        headers: {
              "Content-Type": 'application/json'
          }
      });
  

      // localStorage.setItem('user', JSON.stringify(res?.data?.data));
  
      setToastSuccessOpen(true)
      setResponseMessage(res?.data?.message);
      setData({});
      
      router.push('/signin');
    } catch (error) {
      console.log(error);
      setResponseMessage(error?.response?.data?.message);
      setToastErrorOpen(true);
    }
  
  }



  function updateLoginDetails(event) {
    const { name, value } = event.target;

    const newData = {...data}
    newData[name] = value;
    setData(newData);
  }
  return (
    <main className="bg-white">

      <div className="relative md:flex">

        {/* Content */}
        <div className="md:w-1/2">
          <div className="min-h-screen h-full flex flex-col after:flex-1">

            {/* Header */}
            <div className="flex-1">
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link className="block" href="/">
                  <svg width="32" height="32" viewBox="0 0 32 32">
                    <defs>
                      <linearGradient x1="28.538%" y1="20.229%" x2="100%" y2="108.156%" id="logo-a">
                        <stop stopColor="#A5B4FC" stopOpacity="0" offset="0%" />
                        <stop stopColor="#A5B4FC" offset="100%" />
                      </linearGradient>
                      <linearGradient x1="88.638%" y1="29.267%" x2="22.42%" y2="100%" id="logo-b">
                        <stop stopColor="#38BDF8" stopOpacity="0" offset="0%" />
                        <stop stopColor="#38BDF8" offset="100%" />
                      </linearGradient>
                    </defs>
                    <rect fill="#6366F1" width="32" height="32" rx="16" />
                    <path d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z" fill="#4F46E5" />
                    <path d="M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z" fill="url(#logo-a)" />
                    <path d="M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z" fill="url(#logo-b)" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="max-w-sm mx-auto px-4 py-8">
              <h1 className="text-3xl text-slate-800 font-bold mb-6">Create your Account ✨</h1>
              <Toast type="success" open={toastSuccessOpen} setOpen={setToastSuccessOpen}>
                {responseMessage}
              </Toast>                  

              <Toast type="error" open={toastErrorOpen} setOpen={setToastErrorOpen}>
                {responseMessage}
              </Toast>
              {/* Form */}
              <form onSubmit={httpLoginUser}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="fullName">Full Name <span className="text-rose-500">*</span></label>
                    <input id="fullName" onChange={updateLoginDetails} name="fullName" autoComplete='off' style={{ borderRadius: '5px', border: '1px solid #eee', width: '20rem'}} className="form-input outline-slate-100 w-full px-4 py-2" type="text" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email <span className="text-rose-500">*</span></label>
                    <input id="email" onChange={updateLoginDetails} name="email" style={{ borderRadius: '5px', border: '1px solid #eee', width: '20rem'}} className="form-input outline-slate-100 w-full px-4 py-2" type="email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone no. <span className="text-rose-500">*</span></label>
                    <input id="phone" onChange={updateLoginDetails} name="phone" style={{ borderRadius: '5px', border: '1px solid #eee', width: '20rem'}} className="form-input outline-slate-100 w-full px-4 py-2" type="number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">Password <span className="text-rose-500">*</span></label>
                    <input id="password" onChange={updateLoginDetails} name="password" style={{ borderRadius: '5px', border: '1px solid #eee', width: '20rem'}} className="form-input outline-slate-100 w-full px-4 py-2" type="password" autoComplete="on" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">Confirm Password <span className="text-rose-500">*</span></label>
                    <input id="confirmPassword" onChange={updateLoginDetails} name="confirmPassword" style={{ borderRadius: '5px', border: '1px solid #eee', width: '20rem'}} className="form-input outline-slate-100 w-full px-4 py-2" type="password" autoComplete="on" />
                  </div>
                </div>
                <div className="flex items-center justify-center mt-6">
                  <MbButton label='Sign Up' type='submit'  style={{ width: '100%', background: 'rgb(99 102 241)', color: 'white', }}/>
                </div>
              </form>
              {/* Footer */}
              <div className="pt-5 mt-6 border-t border-slate-200">
                <div className="text-sm">
                  Have an account? <Link className="font-medium text-indigo-500 hover:text-indigo-600" href="/signin">Sign In</Link>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Image */}
        <div className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2" aria-hidden="true">
        <Image className="object-cover object-center w-full h-full" src="/assets/images/1.jpg" width="760" height="1024" alt="Authentication" />
          <Image className="absolute top-1/4 left-0 transform -translate-x-1/2 ml-8 hidden lg:block" src="/assets/images/auth-decoration.png"  width="218" height="224" alt="Authentication decoration" />
        </div>

      </div>

    </main>
  );
}

export default Signup;