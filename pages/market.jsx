import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { MbButton } from 'mintbase-ui';
import { useWallet } from '../services/providers/MintbaseWalletContext';
import Switch from "react-switch";
import { Wallet, FolderOpen, Folder, SignOut, Storefront, HouseSimple, Ticket, X} from 'phosphor-react';
import Toast from '../components/Toast';
import CouponCards from "../components/CouponCard";
import Image from 'next/image';

// import Sidebar from '../../partials/Sidebar';
// import Header from '../../partials/Header';

function Market() {
  const { wallet, isConnected, details } = useWallet();
  const [toggle1, setToggle1] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState('');
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [toastErrorOpen2, setToastErrorOpen2] = useState(false);
  const [store, setStore] = useState({});
  const [loading, setLoading]  = useState(false);
  const [compare, setCompare] = useState([]);
  const [openDropdown, setDropdown] = useState(false)
  const [openCompareModal, setOpenCompareModal] = useState(false)
  const [transferModal, setTransferModal] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const [recieverId, setRecieverId] = useState('')

  async function getStoreDetails(event) {
    const { value, name } = event.target;
    const data = {...store}
    data[name] = value;
    setStore(data);
  }
  

  async function deployAStore() {
    
    if (!store.store_name || !store.initials) {
      // setShowDeployModal(false)
      setToastErrorOpen2(true);
      setResponseMessage("Fill in all fields to create store.")
      return;
    }
    setLoading(true)
    const response = await wallet.deployStore(store.store_name, store.initials);
    setShowDeployModal(false);
    setLoading(false)
  }

  async function getAllCoupons() {

      try {
          const res = await axios.get(`https://still-garden-99623.herokuapp.com/koopon`, {
              headers: {
                  "Content-Type": 'application/json'
              }
          });
          // console.log(res.data?.data)
          setCoupons(res.data?.data)

      } catch (error) {
          console.log(error)
      }
  }

  function filteredCoupons(arr = []) {
    const newArr = [...arr];
    const filteredResult = newArr.filter(item => item?.data?.title?.toLowerCase().includes(searchInput.toLowerCase()) || item?.store_name?.toLowerCase().includes(searchInput.toLowerCase()))

    // console.log('Filtered result', filteredResult)
    // const filterByStore = filteredResult.filter(item => console.log(item?.store));
    // console.log('Filter by store', filterByStore)
    return filteredResult;
  }

  function filterByMarket(arr = []) {
    const newArr = [...arr];
    const filteredResult = newArr.filter(item => console.log(item?.store));

    return filteredResult;
  }

  function filterMarketPlace() {
    
    const filteredData = filteredCoupons(coupons.filter(item => item?.is_minted && item?.store)).map(item => item?.store)
    setShops(filteredData)
  }


  function compareAandB(data) {
    const newArr = [...compare]
    if (newArr.length === 2) {
      newArr.pop();
    }
    newArr.push(data);
    setCompare(newArr)
  }

  async function simpleTransferToken(tokenId, recieverId, contractName) {
    console.log({
      tokenId,
      recieverId,
      contractName
    });
    const response = await wallet.simpleTransfer(tokenId, recieverId, contractName);
    console.log(response);
  }


  useEffect(() => {
    getAllCoupons()
    filterMarketPlace();
  }, [coupons.length])


  console.table(details.balance)

  return (
    <>
      <div className='flex ' style={{ paddingLeft: '15%'}}>
        <div className='min-h-screen fixed top-0 left-0 z-10 ' style={{ background: '#1e3045', padding: '4rem 1rem', paddingTop: '7rem', width: '18%'}}>
        
          <ul className='' style={{paddingTop: '2rem'}} >
            <Link href='/' className=''>
              <li className='text-white cursor-pointer absolute  flex items-center' style={{ 
                marginBottom: '2rem',
                top: '1.5rem'
              }}> <Ticket size={32} /> Koopon</li>
            </Link>
            <Link href='/'>
              <li className='text-white cursor-pointer flex items-center' style={{ marginBottom: '2rem', fontSize: '0.8rem'}}> <HouseSimple size={18} color="white" style={{marginRight: '1rem'}}/> Home</li>
            </Link>
            <Link href='/market'>
              <li className='text-white cursor-pointer flex items-center' style={{ marginBottom: '2rem', fontSize: '0.8rem'}}> <Storefront size={18} color="white" style={{marginRight: '1rem'}}/> Market Place</li>
            </Link>
            <Link href='/dashboard'>
              <li className='text-white cursor-pointer flex items-center' style={{ marginBottom: '2rem', fontSize: '0.8rem'}}> <Folder size={18} color="white" style={{marginRight: '1rem'}}/> My Coupons</li>
            </Link>
            {isConnected && <li onClick={() => {wallet?.disconnect(); window.location.reload()}} className='text-white flex items-center cursor-pointer' style={{ marginBottom: '2rem', fontSize: '0.8rem'}}> <SignOut size={18} color="white" style={{marginRight: '1rem'}}/>{isConnected && "Disconnect wallet"}</li>}
          </ul>
        </div>
        <div style={{ 
          // background: 'rgba(39,63,92, 0.9)', 
          width: '100%', 
          }} className="min-h-screen bg-gray-100">
          <nav className='p-4 flex items-center justify-end sticky top-0 right-0 z-20' style={{ width: '100%', background: '#1e3045' }}>
            <div>
              <input type='search' placeholder="search stores, coupons, ..." onChange={e => setSearchInput(e.target.value)} style={{ background: 'rgba(39,63,92, 0.9)', color: 'white'}}  className='rounded-lg p-4'/>
            </div>
            <div className="m-3">
              <label>
                <Switch 
                  onChange={setToggle1} 
                  checked={toggle1} 
                  activeBoxShadow="0px 0px 1px 2px #273f5c"
                  uncheckedIcon={false}
                  checkedIcon={false}
                  handleDiameter={50}
                  borderRadius={6}
                  height={40}
                  width={100}
                  onColor="#273f5c"
                  offColor="#273f5c"
                  uncheckedHandleIcon={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        fontSize: 10,
                        color: '#fff',
                        borderRadius: '5px',
                        background: 'rgba(39,63,92, 0.8)'
                      }}
                    >
                      Seller
                    </div>
                  }
                  checkedHandleIcon={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        fontSize: 10,
                        color: '#fff',
                        borderRadius: '5px',
                        background: 'rgba(39,63,92, 0.8)'
                      }}
                    >
                      Buyer
                    </div>
                  }
                />
              </label>
            </div>
            <div>
            <div onClick={() => {wallet?.connect({ requestSignIn: true })}} className='mx-2 text-white p-3 rounded-lg cursor-pointer' 
            // style={{ background: 'linear-gradient(90deg, #273f5c, #af4caa)'}}
            style={{ background: 'rgba(39,63,92, 0.9)'}}
            >{details?.accountId || "Connect Wallet"}</div>
            </div>
          </nav>
          <div className='flex justify-center p-4'>
            <div className=' rounded-3xl m-2 relative p-3 flex justify-between' style={{
              width: '50rem',
              background: `${!toggle1 ? "linear-gradient(-90deg, #273f5c, #2a0f29)" : 'linear-gradient(90deg, #273f5c, #2a0f29)'}`,
            }}>

              <div className='p-4 '>
                <Ticket size={100} color="white"/>
                {isConnected && <h1 className='text-white text-center'>Balance: {details?.balance}</h1>}
                {!isConnected && <h1 className='text-white text-center'>Market Place</h1>}
                
              </div>

              <div className='p-3 f' style={{ width: '20rem', }}>
                <h1 className='text-white font-extrabold text-right' style={{ fontSize: '1.4rem'}}>Discover, Create and Sell Your Own NFT Coupons</h1>
                <div className='flex justify-end'>
                    <button onClick={() => isConnected ? setShowDeployModal(true): wallet?.connect({requestSignIn: true}) }className='animate-pulse mx-2 shadow-xl outline  text-white relative p-2 rounded-lg cursor-pointer  m-2' style={{ background: 'linear-gradient(90deg, #273f5c, #af4caa)'}}>Create store
                    
                    </button>
                    {
                      !toggle1 &&
                      <button onClick={() => {}} className='animate-pulse shadow-xl outline mx-2 text-white relative p-2 px-6 rounded-lg cursor-pointer  m-2' style={{ background: 'linear-gradient(90deg, #273f5c, #af4caa)'}}>Mint</button>
                    }
                </div>
              </div>
             


            </div>

          </div>
          <div style={{ }} className="flex flex-wrap p-6 justify-center ">
            {
              filteredCoupons(coupons)?.filter(item => item.is_minted).map(item => (
                <CouponCards 
                  {...item} 
                  key={item._id} 
                  compareAandB={compareAandB} 
                  setOpenCompareModal={setOpenCompareModal}
                  setTransferModal={setTransferModal}
                  setTokenId={setTokenId}
                  setRecieverId={setRecieverId}
                />
              )).reverse()
            }
          </div>
        </div>
      </div>
      {
        showDeployModal &&
        <div className='fixed top-0 left-0 right-0 bottom-0 w-full min-h-screen z-20 flex justify-center items-center' style={{ background: 'rgba(0, 0, 0, 0.9)'}}>

        
            <div className=' rounded-lg m-2 p-6' style={{
    
              background: ' #273f5c',
              // background: 'linear-gradient(90deg, #273f5c, #2a0f29)',
            }}>
              <X size={40} color="white" 
              onClick={() => setShowDeployModal(false)}
              style={{
                position:'absolute',
                top: '1rem',
                right: '1rem',
                cursor: 'pointer'
              }}/>
         
              <Toast type="error" open={toastErrorOpen2} setOpen={setToastErrorOpen2}>
               {responseMessage}
             </Toast>
              <h1 className='text-white' style={{ fontSize: '1.5rem'}}>Create new store</h1>
              <hr className='bg-white-400 mb-4'/>
              <div className='mb-2'>
                <div className='mb-2'>
                  <label className='text-white'>Store Name</label>
                </div>
                <input name='store_name'  type='search' placeholder="mintbase-store" onChange={getStoreDetails} style={{ background: 'white', color: '#7f7f7f'}}  className='rounded-lg p-4'/>
              </div>
              <div>
                <div className='mb-2'>
                  <label className='text-white'>Store Symbol</label>
                </div>
                <input name='initials' type='search' placeholder="MNTB" onChange={getStoreDetails} style={{ background: 'white', color: '#7f7f7f'}}  className='rounded-lg p-4'/>
              </div>
              
              <div className='p-4  text-center'>
                  <button onClick={deployAStore} className={`text-white shadow-xl outline p-3 rounded-lg cursor-pointer ${loading && 'animate-pulse'}`}
                // style={{ background: 'linear-gradient(90deg, #273f5c, #af4caa)'}}
                >
                  {loading ? "loading..." : "Deploy store"}</button>
              </div>

            </div>
      

        </div>
      }

      {
        openCompareModal &&
        <div className='fixed top-0 left-0 right-0 bottom-0 w-full min-h-screen z-20 flex justify-center items-center' style={{ background: 'rgba(0, 0, 0, 0.9)'}}>
          <div className='bg-white rounded-lg p-4 relative'>
            <h1 className='text-gray'>Comparing {compare[0]?.store_name} to {compare[1]?.store_name}</h1>
            <input onChange={e => {setSearchInput(e.target.value); setDropdown(true)}}  className='p-2 w-full border border-gray' value={searchInput} placeholder='search coupon to compare' type='search'/>
            {
              openDropdown &&
                <div className=' bg-white p-4 absolute top-22 overflow-y-scroll' style={{ width: '92.5%', height: '14rem'}}>
                  <ul className='divide-y divide-slate-700'>
                    {
                      filteredCoupons(coupons)?.filter(item => item.is_minted).map((item, i) => (
                        <li key={i} onClick={() => { setDropdown(false); compareAandB(item);}} className='p-1 bg-white cursor-pointer my-2 hover:bg-gray-300 hover:text-white'>{item.store_name}</li>
                      ))
                    }
                  </ul>
                </div>
            }
          <div className=' rounded-lg m-2 p-6 bg-gray-100 flex justify-center items-center' style={{
            
          }}>
            <div className='p-4 border-2 border-gray mx-2'>
              <h3 className=''>Shop: {compare[0]?.store_name}</h3>
              <div>
                {/* <Image /> */}
              </div>
              <p>Description: {compare[0]?.description}</p>
              <p>Quantity: {compare[0]?.quantity}</p>
              <p>Discount: {compare[0]?.discount}%</p>
              <p>Old Price: {compare[0]?.price}</p>
              <p>New Price: {compare[0]?.price - (compare[0]?.price * (compare[0]?.discount/100))}</p>
            </div>
            <div className='p-4 border-2 border-gray mx-2'>
            <h3 className=''>Shop: {compare[1]?.store_name}</h3>
              <div>
                {/* <Image /> */}
              </div>
              <p>Description: {compare[1]?.description}</p>
              <p>Quantity: {compare[1]?.quantity}</p>
              <p>Discount: {compare[1]?.discount}%</p>
              <p>Old Price: {compare[1]?.price}</p>
              <p>New Price: {compare[1]?.price - (compare[1]?.price * (compare[1]?.discount/100))}</p>
            </div>

            </div>
          <button onClick={() => { setSearchInput(''); setOpenCompareModal(false); setDropdown(false); setCompare([])}} className='animate-none shadow-xl outline mx-2  p-2 px-6 rounded-lg cursor-pointer  m-2'>Close</button>
          </div>
        </div>
      }


{
                            transferModal && 
                            <div className='fixed top-0 left-0 right-0 bottom-0 w-full min-h-screen z-20 flex justify-center items-center' style={{ background: 'rgba(0, 0, 0, 0.9)'}}>

                            
                                <div className=' rounded-lg m-2 p-6' style={{
                        
                                  background: ' #273f5c',
                                  // background: 'linear-gradient(90deg, #273f5c, #2a0f29)',
                                }}>
                                  <X size={40} color="white" 
                                  onClick={() => {setTransferModal(false); setTokenId('')}}
                                  style={{
                                    position:'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    cursor: 'pointer'
                                  }}/>
                            
                                  <Toast type="error" open={toastErrorOpen2} setOpen={setToastErrorOpen2}>
                                  {responseMessage}
                                </Toast>
                                  <h1 className='text-white' style={{ fontSize: '1.5rem'}}>Transfer {"data?.data?.title"}??</h1>
                                  <hr className='bg-white-400 mb-4'/>
                                  {tokenId && <p style={{fontSize: '0.7rem'}} className='text-gray rounded p-4 bg-white mb-2 '>Token id: #{tokenId?.id?.split(':')[0]} <br/> {tokenId.store}</p>}
                                  {tokenId && <input style={{fontSize: '0.7rem', width: '100%'}} className='text-gray rounded p-4 bg-white mb-2 ' placeholder='reciever id' onChange={e => setRecieverId(e.target.value)}/>}
                                  <div>
                                  <button onClick={() => {
                                    simpleTransferToken(tokenId?.id?.split(':')[0], recieverId, tokenId.store ); 
                                    setTransferModal(false); 
                                    setTokenId('');
                                  }} style={{ background: 'green'}} className={`w-full text-white h-full shadow-black text-left py-3 px-4 mb-2 rounded bg-white border border-slate-200 hover:border-slate-300 shadow-lg duration-150 ease-in-out`}
                                    >Yes</button>
                                  <button style={{ background: 'red'}} onClick={()=>{setTransferModal(false); setTokenId('')}} className={`w-full text-white h-full shadow-black text-left py-3 px-4 rounded bg-white border border-slate-200 hover:border-slate-300 shadow-lg duration-150 ease-in-out `}
                                    >No</button>
                                  </div>

                                </div>
                          

                            </div>
                          }

    </>
  )

  {

    // return (
    //   <div className="flex h-screen overflow-hidden" >
    //     <nav className='absolute top-0 left-0 flex justify-between items-center p-4' style={{ zIndex: 20, width: '100vw'}}>
    //                   <div className='px-4'>
    //                       <h1 className='text-white font-bold'>Koopon</h1>
    //                   </div>
    //                   <div className='flex justify-between items-center' style={{ width: '60%'}}>
    //                       <ul className='flex' style={{width: '60%'}}>
    //                           <li className='mx-4 cursor-pointer text-white'>Pricing</li>
    //                           <li className='mx-4 cursor-pointer text-white'>Blog</li>
    //                           <li className='mx-4 cursor-pointer text-white'>About us</li>
    //                       </ul>
    //                       <div style={{width: '40%'}}>
    //                         <div className='flex'>
    //                           {/* {
    //                             isConnected && <Link  href='/dashboard'><MbButton onClick={() =>  {}} label='Go to dashboard' style={{ background: 'rgb(99 102 241)', color: 'white', marginRight: '2rem'}}/></Link>
    //                           } */}
    //                           {
    //                               !isConnected &&
    //                               <Link href='/signin'>
    //                                   <MbButton onClick={() =>  {}} label='Sign In' style={{ background: 'rgb(99 102 241)', color: 'white', marginRight: '2rem'}}/>
    //                               </Link>
    //                           }
    //                           {
    //                               isConnected &&
    //                               <Link href='/dashboard'>
    //                                   <MbButton onClick={() =>  {}} label={`Go to dashboard`} style={{ background: 'rgb(99 102 241)', color: 'white', marginRight: '2rem'}}/>
    //                               </Link>
    //                           }
    //                           <div>
    //                             {/* { !isConnected && <MbButton onClick={() =>  wallet?.connect({ requestSignIn: true })} label='Connect wallet' style={{ background: 'rgb(99 102 241)', color: 'white', marginRight: '2rem'}}/>} */}
    //                             {/* { isConnected && <MbButton onClick={() =>  {wallet?.disconnect(); window.location.reload()}} label='Disconnect wallet' style={{ background: 'rgb(99 102 241)', color: 'white', marginRight: '2rem'}}/>} */}
    //                           </div>
    //                         </div>
    //                       </div>
    //                   </div>
    //     </nav>
    //     {/* Sidebar */}
    //     {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
  
    //     {/* Content area */}
    //     <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-white">
    //       {/*  Site header */}
    //       {/* <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
  
    //       <main>
  
    //         {/* Search area */}
    //         <div style={{ background: 'rgba(0,0,0,0.7)'}} className="relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-16 bg-slate-500 overflow-hidden">
    //           {/* Glow */}
    //           <div className="absolute pointer-events-none" aria-hidden="true">
    //             <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    //               <defs>
    //                 <radialGradient cx="50%" cy="50%" fx="50%" fy="50%" r="50%" id="ill-a">
    //                   <stop stopColor="#FFF" offset="0%" />
    //                   <stop stopColor="#FFF" stopOpacity="0" offset="100%" />
    //                 </radialGradient>
    //               </defs>
    //               <circle
    //                 style={{ mixBlendMode: 'overlay' }}
    //                 cx="588"
    //                 cy="650"
    //                 r="256"
    //                 transform="translate(-332 -394)"
    //                 fill="url(#ill-a)"
    //                 fillRule="evenodd"
    //                 opacity=".48"
    //               />
    //             </svg>
    //           </div>
    //           {/* Illustration */}
    //           <div className="absolute pointer-events-none" aria-hidden="true">
    //             <svg width="1280" height="361" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    //               <defs>
    //                 <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="ill2-b">
    //                   <stop stopColor="#A5B4FC" offset="0%" />
    //                   <stop stopColor="#818CF8" offset="100%" />
    //                 </linearGradient>
    //                 <linearGradient x1="50%" y1="24.537%" x2="50%" y2="100%" id="ill2-c">
    //                   <stop stopColor="#4338CA" offset="0%" />
    //                   <stop stopColor="#6366F1" stopOpacity="0" offset="100%" />
    //                 </linearGradient>
    //                 <path id="ill2-a" d="m64 0 64 128-64-20-64 20z" />
    //                 <path id="ill2-e" d="m40 0 40 80-40-12.5L0 80z" />
    //               </defs>
    //               <g fill="none" fillRule="evenodd">
    //                 <g transform="rotate(51 -92.764 293.763)">
    //                   <mask id="ill2-d" fill="#fff">
    //                     <use xlinkHref="#ill2-a" />
    //                   </mask>
    //                   <use fill="url(#ill2-b)" xlinkHref="#ill2-a" />
    //                   <path fill="url(#ill2-c)" mask="url(#ill2-d)" d="M64-24h80v152H64z" />
    //                 </g>
    //                 <g transform="rotate(-51 618.151 -940.113)">
    //                   <mask id="ill2-f" fill="#fff">
    //                     <use xlinkHref="#ill2-e" />
    //                   </mask>
    //                   <use fill="url(#ill2-b)" xlinkHref="#ill2-e" />
    //                   <path fill="url(#ill2-c)" mask="url(#ill2-f)" d="M40.333-15.147h50v95h-50z" />
    //                 </g>
    //               </g>
    //             </svg>
    //           </div>
    //           <div className="relative w-full max-w-2xl mx-auto text-center">
    //             <div className="mb-5">
    //               <h1 className="text-2xl md:text-3xl text-white font-bold">👋 Market Place</h1>
    //             </div>
    //             <form className="relative">
    //               <label htmlFor="action-search" className="sr-only">
    //                 Search
    //               </label>
    //               <input onChange={e => setSearchInput(e.target.value)} id="action-search" className="form-input pl-9 py-3 focus:border-slate-300 w-full" type="search" />
    //               <button className="absolute inset-0 right-auto group" type="submit" aria-label="Search">
    //                 <svg
    //                   className="w-4 h-4 shrink-0 fill-current text-slate-400 group-hover:text-slate-500 ml-3 mr-2"
    //                   viewBox="0 0 16 16"
    //                   xmlns="http://www.w3.org/2000/svg"
    //                 >
    //                   <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
    //                   <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
    //                 </svg>
    //               </button>
    //             </form>
    //           </div>
    //           <div className='flex justify-center items-center'>
    //             <select onChange={e => setSelectedShop(e.target.value)} className='m-4 hover:bg-slate-50 py-1 px-4 cursor-pointer'>
    //               <option>Filter by store</option>
    //               {
    //                 shops?.map((item, index) => <option key={index.toString()} value={item}>{item}</option> )
    //               }
    //             </select>
    //             <p className='mx-4 text-white'  onClick={() => setSelectedShop('')}>reset</p>
    //           </div>
    //         </div>
  
    //         <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
  
    //           {/* Sections */}
    //           <div className="space-y-8">
  
    //             <div className='flex justify-center items-center flex-wrap'>
  
    //               {
    //                 filteredCoupons(coupons)?.filter(item => item.is_minted).map(item => (
    //                   <CouponCards key={item._id} {...item}/>
    //                 )).reverse()
    //               }
    //             </div>
  
               
  
    //           </div>
  
    //         </div>
    //       </main>
  
    //     </div>
  
    //   </div>
    // );
  }


}

export default Market;