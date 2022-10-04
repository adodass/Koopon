import React, { useState } from 'react';
import Image from 'next/image';
import { MbButton } from 'mintbase-ui';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import CouponCards from '../../components/CouponCard';
import { useWallet } from '../../services/providers/MintbaseWalletContext';
import Toast from '../../components/Toast';
import { X } from 'phosphor-react';
import * as nearAPI from "near-api-js";


function Product() {
  const { utils } = nearAPI;
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState({});
  const { wallet, isConnected, details } = useWallet();
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [loading, setLoading]  = useState(false);
  const [store, setStore] = useState({});
  const [responseMessage, setResponseMessage] = useState("");
  const [toastErrorOpen2, setToastErrorOpen2] = useState(false);
  const [couponDetails, setCouponDetails] = useState({});
  const [burnModal, setBurnModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const [recieverId, setRecieverId] = useState('')


  async function getList() {
    const response = await wallet?.api?.fetchStoreById(data?.data?.store?.id);
    const response2 = await wallet?.api?.fetchTokenById(
      data?.data?.id)
    const response3 = await wallet?.api?.fetchThingById(`${data?.data?.thing?.metaId}:${data?.data?.store?.id}`)
    // console.log(data?.data?.store?.id)
    // console.log('Metadata: ', data?.data?.thing?.metaId+ ":" + data?.data?.store?.id);
    // console.log('Minter: ', data?.data?.thing?.metaId+ ":" + data?.store_name);
    // const response2 = await wallet?.api?.fetchThingById(response?.data?.store[0]?.things[1]?.id)
    // console.log(data?.data?.thing?.metaId + ":" + data?.store)
    // console.log(await wallet?.transactionStatus('srqYiYYPTDyJkBSsSXPZPbvEuf64PsyrtKnsKLxggo5', 'mbiplang.testnet')) 

    // console.log(await wallet?.api?.fetchTokenById("45" + ":" + data?.store))
    // console.log(response2?.data?.thing[0])
    // console.log(await wallet?.api?.fetchListById("45" + ":" + data?.store))
    // console.log(await wallet?.api?.fetchLists())
    // console.log(await wallet?.api?.fetchMarketplace())
    // console.log(await wallet?.api?.fetchListById('51:shop45.mintspace2.testnet'))
    console.log("Store: ", response)
    console.log("Token: ", response2)
    console.log("Thing: ", response3?.data?.thing[0])
    setCouponDetails(response3?.data?.thing[0])
    // setCouponDetails(response?.data?.store[0]?.things[0])
  }

  async function burnAllCoupons() {                           
    // response = await wallet.burn(couponDetails?.tokens)
    console.log(couponDetails)
    setBurnModal(false);
  }

  async function burnSpecificCoupon(id) {
    console.log(id)
    // const _id = couponDetails.tokens.filter((coupon) => coupon.id !== id );
    // console.log(_id)
    await wallet?.burn([id]);
  }

  async function getStoreDetails(event) {
    const { value, name } = event.target;
    const data = {...store}
    data[name] = value;
    setStore(data);
     
  }

  async function deployAStore() {


    console.log({...store, storeId: couponDetails?.storeId});
    
    if (!couponDetails?.storeId| !store.price || !store.tokenId) {
      setToastErrorOpen2(true);
      setResponseMessage("Fill in all fields to create store.")
      return;
    }
    setLoading(true);
    // "market.mintspace2.testnet"
    const response = await wallet.list(store.tokenId?.split(':')[0], couponDetails?.storeId, utils.format.parseNearAmount(store.price), { autotransfer: true, marketAddress: 'market.mintspace2.testnet'});
    setShowDeployModal(false);
    setLoading(false)
  }

  async function simpleTransferToken(tokenId, recieverId, contractName) {
    console.log({
      tokenId,
      recieverId,
      contractName
    });
  }

  useEffect(() => {
    const getData = JSON.parse(localStorage.getItem('data'));
    setData(getData);
    // console.log("Get data: ", getData);
    if(data._id){
      getList()
    }
  }, [data?._id]);





  // useEffect(() => {

  // }, [couponDetails?.length])


  // console.log("Final Tokens: ", couponDetails);
  
  return (
    <>
      <div className="flex h-screen overflow-hidden" style={{ background: '#1e3045'}}>

        {/* Sidebar */}
        {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

    

          <main>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">

              {/* Page content */}
              <div className="max-w-5xl mx-auto flex justify-between flex-col lg:flex-row lg:space-x-8 xl:space-x-16">


                {/* Content */}
                <div className=" w-50">
                  <div className="mb-3">
                    <a className="text-sm font-medium text-white hover:animate-pulse" onClick={() => {localStorage.removeItem('data'); router.back(); } } href="#0">&lt;- Back</a>
                  </div>

                  {/* <div style={{minWidth: '30rem', minHeight: '30rem', background: 'black', overflow: 'hidden'}}>

                    {
                      data?.data &&
                      <Image className="" layout="responsive"
                      width={100} height={100} src={data?.data?.media}  alt={data?.data?.title}/>
                    }
                        <Image className="" layout='responsive' width={100} height={100} src={"/assets/images/1.jpg"}  alt="User 04" />
                  </div> */}
                      
                  <header className="my-4">
                    {/* Title */}
                    <h1 className="text-2xl text-white md:text-3xl font-bold mb-2">{data?.data?.title}✨</h1>
                    <p className='text-white'>{data?.data?.description}</p>
                   
                  </header>

                  

                  {/* Image */}
                  <figure className="mb-6">
                    {/* <Image className="w-full rounded-sm" src="" width="640" height="360" alt="Product" /> */}
                  </figure>

                
                  <hr className="my-6 border-t border-slate-200" />

                  <div className='flex justify-center items-center flex-wrap' style={{ height: '60vh', overflowY: 'scroll'}}>
                    {
                      couponDetails?.tokens?.map((item, index) => (
                        <CouponCards 
                          key={index.toString()}
                          burnOne={burnSpecificCoupon}  
                          setTransferModal={setTransferModal}
                          setTokenId={setTokenId}
                          simpleTransferToken={simpleTransferToken}
                          {...data} 
                          {...item} 
                        />
                      ))
                    }
                  </div>


                </div>

                {/* Sidebar */}
                <div >
                
                  <div className="bg-white  top-10 p-5 shadow-2xl rounded-sm  lg:w-72 xl:w-80 " style={{ background: 'rgba(39,63,92, 0.4)'}}>
                    <div className="text-sm font-semibold mb-3 text-white">Select action</div>
                    <ul className="space-y-2 sm:flex sm:space-y-0 sm:space-x-2 lg:space-y-2 lg:space-x-0 lg:flex-col mb-4">
                      {
                        
                        (details.accountId === data?.data?.ownerId) && 
                        <>
                          <li>
                            <button onClick={() => setBurnModal(true)} style={{ background: 'red'}} className="w-full h-full text-left py-3 px-4 rounded bg-white hover:border-slate-300 shadow-lg shadow-black duration-150 ease-in-out">
                              <div className="flex flex-wrap items-center justify-center mb-0.5 " >
                                <span className="font-semibold text-slate-800 " style={{ color: 'white'}}>Burn</span>
                              </div>
                            </button>
                          </li>
                          {
                            burnModal && data?.data?.ownerId &&
                            <div className='fixed top-0 left-0 right-0 bottom-0 w-full min-h-screen z-20 flex justify-center items-center' style={{ background: 'rgba(0, 0, 0, 0.9)'}}>

                            
                                <div className=' rounded-lg m-2 p-6' style={{
                        
                                  background: ' #273f5c',
                                  // background: 'linear-gradient(90deg, #273f5c, #2a0f29)',
                                }}>
                                  <X size={40} color="white" 
                                  onClick={() => setBurnModal(false)}
                                  style={{
                                    position:'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    cursor: 'pointer'
                                  }}/>
                            
                                  <Toast type="error" open={toastErrorOpen2} setOpen={setToastErrorOpen2}>
                                  {responseMessage}
                                </Toast>
                                  <h1 className='text-white' style={{ fontSize: '1.5rem'}}>Burn All Of {data?.data?.title}??</h1>
                                  <hr className='bg-white-400 mb-4'/>
                                  {/* <div className='mb-2'>
                                    <div className='mb-2'>
                                      <label className='text-white'>Store Name</label>
                                    </div>
                                    <input name='store_name'  type='search' placeholder="mintbase-store" onChange={getStoreDetails} style={{ background: 'white', color: '#7f7f7f'}}  className='rounded-lg p-4'/>
                                  </div> */}
                                  <div>
                                  <button onClick={burnAllCoupons} className={`text-white shadow-xl outline p-3 rounded-lg cursor-pointer `}
                                    // style={{ background: 'linear-gradient(90deg, #273f5c, #af4caa)'}}
                                    >Yes</button>
                                  <button onClick={()=>setBurnModal(false)} className={`text-white shadow-xl outline p-3 rounded-lg cursor-pointer `}
                                    // style={{ background: 'linear-gradient(90deg, #273f5c, #af4caa)'}}
                                    >No</button>
                                  </div>

                                </div>
                          

                            </div>
                          }
                        
                          <li>
                            <button onClick={() => setTransferModal(true)} style={{ background: '#7f7f7f', color: 'white', border: 'none', cursor: details.accountId === data?.data?.ownerId ? 'pointer' : 'no-drop'}}  className="w-full h-full text-left py-3 px-4 rounded bg-white border-2 border-indigo-400 shadow-lg shadow-black duration-150 ease-in-out">
                              <div className="flex flex-wrap items-center justify-center mb-0.5">
                                <span className="font-semibold text-slate-800" style={{ color: 'white'}}>Transfer</span>
                                {/* <span className="font-medium text-emerald-600">$69.00</span> */}
                              </div>
                              {/* <div className="text-sm">Lorem ipsum dolor sit amet elit sed do eiusmod.</div> */}
                            </button>
                          </li>
                          {
                            transferModal && data?.data?.ownerId &&
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
                                  <h1 className='text-white' style={{ fontSize: '1.5rem'}}>Transfer {data?.data?.title}??</h1>
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

                          <li>
                            <button onClick={() => setShowDeployModal(true)} className="w-full h-full shadow-black text-left py-3 px-4 rounded bg-white border border-slate-200 hover:border-slate-300 shadow-lg duration-150 ease-in-out">
                              <div className="flex flex-wrap items-center justify-center mb-0.5">
                                <span className="font-semibold text-slate-800" >List</span>
                                {/* <span className="font-medium text-emerald-600">$89.00</span> */}
                              </div>
                              {/* <div className="text-sm">Lorem ipsum dolor sit amet elit sed do eiusmod.</div> */}
                            </button>
                          </li>
                          <li>
                            <button className="w-full h-full  py-3 px-4 rounded  shadow-lg text-white shadow-black duration-150 ease-in-out text-white">
                              <div className="flex flex-wrap items-center justify-center mb-0.5">
                                <span className="font-semibold" >Auction</span>
                                {/* <span className="font-medium text-emerald-600">$89.00</span> */}
                              </div>
                              {/* <div className="text-sm">Lorem ipsum dolor sit amet elit sed do eiusmod.</div> */}
                            </button>
                          </li>
                        </>
                      }
                    </ul>
                    {
                      !(details.accountId === data?.data?.ownerId) && 
                      <div className="mb-4">
                        <MbButton label='Buy' className="w-full h-full  py-3 px-4 rounded  shadow-lg text-white shadow-black duration-150 ease-in-out" style={{ background: 'green'}}/>
                      </div>
                    }
                    {/* <div className="text-xs text-slate-500 italic text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do <a className="underline hover:no-underline" href="#0">Terms</a>.</div> */}
                  </div>

                  <div className="bg-white sticky top-10 p-5 shadow-2xl rounded-sm  lg:w-72 xl:w-80 " style={{ background: 'rgba(39,63,92, 0.4)'}}>
                  <div className='flex flex-wrap'>
                      <p className='text-white p-2 rounded-lg m-1 text-xs shadow-md italic text-center' style={{background: 'rgba(39,63,92, 1)', fontSize: '0.7rem', }}>Quantity: {data?.quantity}</p>
                      <p className='text-white p-2 rounded-lg m-1 text-xs shadow-md italic text-center' style={{background: 'rgba(39,63,92, 1)', fontSize: '0.7rem', }}>Owner: {data?.data?.ownerId}</p>
                      <p className='text-white p-2 rounded-lg m-1 text-xs shadow-md italic text-center' style={{background: 'rgba(39,63,92, 1)', fontSize: '0.7rem', }}>Minter: {data?.data?.minter}</p>
                      <p className='text-white p-2 rounded-lg m-1 text-xs shadow-md italic text-center' style={{background: 'rgba(39,63,92, 1)', fontSize: '0.7rem', }}>Store: {couponDetails?.storeId}</p>
                      <p className='text-white p-2 rounded-lg m-1 text-xs shadow-md italic text-center' style={{background: 'rgba(39,63,92, 1)', fontSize: '0.7rem', }}>Category: {couponDetails?.memo}</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </main>

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
              <h1 className='text-white' style={{ fontSize: '1.5rem'}}>List token</h1>
              <hr className='bg-white-400 mb-4'/>
              <div className="mb-2">
                    <div className="mb-2">
                        <label className="text-white" htmlFor="store_name">Token id: <span className="text-rose-500">*</span></label>
                    </div>
                  <select  className="rounded-lg p-4 w-full" style={{ background: 'white', color: '#7f7f7f'}}  name="tokenId" onChange={getStoreDetails}>
                      <option>Select Token</option>
                      {
                        couponDetails?.tokens?.map(item => (
                          <option key={item.id} value={item.id}>{item.id}</option>
                        ))
                      }
                    </select>
                </div>
              <div className='mb-2'>
                <div className='mb-2'>
                  <label className='text-white'>Store Name <span className="text-rose-500">*</span></label>
                </div>
                <input name='storeId'  type='search' disabled value={couponDetails?.storeId} placeholder="store id" onChange={getStoreDetails} style={{ background: 'white', color: '#7f7f7f'}}  className='rounded-lg p-4 w-full'/>
              </div>
              <div>
                <div className='mb-2'>
                  <label className='text-white'>Price <span className="text-rose-500">*</span></label>
                </div>
                <input name='price'  placeholder="1 Near" type="number" onChange={getStoreDetails} style={{ background: 'white', color: '#7f7f7f'}}  className='rounded-lg p-4 w-full'/>
              </div>
              
              <div className='p-4  text-center'>
                  <button onClick={deployAStore} className={`text-white shadow-xl outline p-3 rounded-lg cursor-pointer ${loading && 'animate-pulse'}`}
                // style={{ background: 'linear-gradient(90deg, #273f5c, #af4caa)'}}
                >
                  {loading ? "loading..." : "List token"}</button>
              </div>

            </div>
      

        </div>
      }
     
    </>
  );
}

export default Product;