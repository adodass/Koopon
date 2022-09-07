import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MbButton } from "mintbase-ui";
import { useState } from 'react';
import Toast from '../components/Toast';
import axios from 'axios';
import { useRouter } from 'next/router';

function Signin() {
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
      if (!newData.email ||!newData.password) {
          setResponseMessage('Enter all required fields!');
          setToastErrorOpen(true);
          return;
        }

      const res = await axios.post('https://still-garden-99623.herokuapp.com/signin', newData, {
        headers: {
              "Content-Type": 'application/json'
          }
      });

      localStorage.setItem('user', JSON.stringify(res?.data?.data));
  
      setToastSuccessOpen(true)
      setResponseMessage(res?.data?.message);
      setData({});
      router.push('/dashboard');
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
              <h1 className="text-3xl text-slate-800 font-bold mb-6">Welcome back! ✨</h1>
              <Toast type="success" open={toastSuccessOpen} setOpen={setToastSuccessOpen}>
                {responseMessage}
              </Toast>                  

              <Toast type="error" open={toastErrorOpen} setOpen={setToastErrorOpen}>
                {responseMessage}
              </Toast>
              {/* Form */}
              <form onSubmit={httpLoginUser}>
                <div className="space-y-4">
                  {/* <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email Address</label>
                    <input id="email" className="form-input w-full" type="email" />
                  </div> */}
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email: <span className="text-rose-500">*</span></label>
                    <input onChange={updateLoginDetails}   id="email" name="email" style={{ borderRadius: '5px', border: '1px solid #eee', width: '20rem'}} className="form-input outline-slate-100 w-full px-4 py-2" type="email" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                    <input onChange={updateLoginDetails} name="password" id="password" className="form-input outline-slate-100 w-full px-4 py-2" style={{ borderRadius: '5px', border: '1px solid #eee'}} type="password" autoComplete="on" />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="mr-1">
                    <Link style={{ color: '#7f7f7f'}} className="text-sm underline hover:no-underline" href="/reset-password">Forgot Password?</Link>
                  </div>
                    <MbButton label='Sign In'  type='submit' style={{ background: 'rgb(99 102 241)', color: 'white', marginRight: '2rem'}}/>
                  {/* <Link className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3" href="/">
                  </Link> */}
                </div>
              </form>
              {/* Footer */}
              <div className="pt-5 mt-6 border-t border-slate-200">
                <div className="text-sm">
                  Don’t you have an account? 
                  <Link className="font-medium text-indigo-500 hover:text-indigo-600" href="/signup">
                    Sign Up
                  </Link>
                </div>
                {/* Warning */}
                {/* <div className="mt-5">
                  <div className="bg-amber-100 text-amber-600 px-3 py-2 rounded">
                    <svg className="inline w-3 h-3 shrink-0 fill-current mr-2" viewBox="0 0 12 12">
                      <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                    </svg>
                    <span className="text-sm">
                      To support you during the pandemic super pro features are free until March 31st.
                    </span>
                  </div>
                </div> */}
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

export default Signin;