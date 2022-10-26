import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { MbButton } from 'mintbase-ui';
import { useWallet } from '../services/providers/MintbaseWalletContext';
import Switch from "react-switch";
import { PokerChip, Wallet, FolderOpen, Folder, SignOut, Storefront, HouseSimple, Ticket, X} from 'phosphor-react';
import Toast from '../components/Toast';
import CouponCards2 from "../components/CouponCard";
import CouponCard from '../components/CouponCard/coupon-card';
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




  return (
    <>
      <div className='flex '>
        <div className='min-h-screen fixed top-0 shadow-lg left-0 z-50  p-4 pt-32 min-w-fit xsm:hidden' style={{
          // background: `${'linear-gradient(0deg, #fff, #273f5c)'}`
        }}>
        
          <ul className='' style={{paddingTop: '2rem'}} >
            <Link href='/' className=''>
              <li className='text-card-color cursor-pointer absolute  flex items-center' style={{ 
                marginBottom: '2rem',
                top: '1.5rem'
              }}> <Ticket size={32} /> Koopon</li>
            </Link>
            <Link href='/'>
              <li className='text-card-color cursor-pointer flex items-center' style={{ marginBottom: '2rem', fontSize: '0.8rem'}}> <HouseSimple size={18}  style={{marginRight: '1rem'}}/> Home</li>
            </Link>
            <Link href='/market'>
              <li className='text-card-color cursor-pointer flex items-center' style={{ marginBottom: '2rem', fontSize: '0.8rem'}}> <Storefront size={18}  style={{marginRight: '1rem'}}/> Market Place</li>
            </Link>
            <Link href='/dashboard'>
              <li className='text-card-color cursor-pointer flex items-center' style={{ marginBottom: '2rem', fontSize: '0.8rem'}}> <PokerChip size={18}  style={{marginRight: '1rem'}}/>Rewards</li>
            </Link>
            <Link href='/dashboard'>
              <li className='text-card-color cursor-pointer flex items-center' style={{ marginBottom: '2rem', fontSize: '0.8rem'}}> <Folder size={18}  style={{marginRight: '1rem'}}/> My Coupons</li>
            </Link>
            {isConnected && <li onClick={() => {wallet?.disconnect(); window.location.reload()}} className='text-card-color flex items-center cursor-pointer' style={{ marginBottom: '2rem', fontSize: '0.8rem'}}> <SignOut size={18} style={{marginRight: '1rem'}}/>{isConnected && "Disconnect wallet"}</li>}
          </ul>

        </div>

        <div  className="min-h-screen  w-full ">
          <nav className='p-4 flex items-center w-full justify-end sticky top-0 right-0 z-20  xsm:hidden' style={{
            // background: `${'linear-gradient(90deg, #fff, #273f5c)'}`
          }}>
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

          <div className='flex justify-center p-4 xsm:p-0 xsm:m-0'>
            <div className="lg:hidden md:hidden sm:hidden w-full  p-4 shadow-md" style={{ 
               background: `${!toggle1 ? "linear-gradient(-90deg, #fff, #273f5c)" : 'linear-gradient(90deg, #fff, #273f5c)'}`
            }}>
              <div className='flex justify-center'>
                <Ticket size={32} color="white"/> 
                <h1 className='text-white text-center text-2xl '>Koopon</h1>
              </div>
              <div className='flex justify-center my-2'>
                <input type='search' placeholder="search stores, coupons, ..." onChange={e => setSearchInput(e.target.value)}  className='rounded-lg p-4 text-center'/>
              </div>
              <div className='text-white text-center p-4 flex justify-evenly items-center'>
                <Link href="/market">
                  <Storefront size={32} color="#273f5c"  style={{marginRight: '1rem'}} />
                </Link>
                <Link href="/dashboard">
                  <PokerChip size={32} color="#273f5c"  style={{marginRight: '1rem'}}/>
                </Link>
                <Link href="/dashboard">
                  <Folder size={32} color="#273f5c"  style={{marginRight: '1rem'}}/>
                </Link>
                <SignOut size={32} color="#273f5c"  style={{marginRight: '1rem'}}/>
              </div>
            </div>
          <div className=' rounded-lg m-2 relative p-3 ml-32 flex justify-between shadow-md w-3/4 xsm:hidden' style={{
            // width: '50rem',
            background: `${!toggle1 ? "linear-gradient(-90deg, #fff, #273f5c)" : 'linear-gradient(90deg, #fff, #273f5c)'}`,
            // background: `${!toggle1 ? "linear-gradient(-90deg, #273f5c, #2a0f29)" : 'linear-gradient(90deg, #273f5c, #2a0f29)'}`,
          }}>

            

            <div className='p-4 '>
              <Ticket size={100} color={`${ !toggle1 ? "white" : "#273f5c" } `}/>
              {isConnected && <h1 className='text-white text-center' style={{color: `${ !toggle1 ? "white" : "#273f5c" } `}}>Balance: {details?.balance}</h1>}
              {!isConnected && <h1 className='text-white text-center' style={{color: `${ !toggle1 ? "white" : "#273f5c" } `}}>Market Place</h1>}
              
            </div>

            <div className='p-3 f' style={{ width: '20rem', }}>
              <h1 className='text-white font-extrabold text-right' style={{ fontSize: '1.4rem', color: `${ toggle1 ? "white" : "#273f5c" } `}}>Discover, Create and Sell Your Own NFT Coupons</h1>
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
          
          <div  className="flex flex-wrap px-32 justify-center w-full xsm:px-2">
            {
              filteredCoupons(coupons)?.filter(item => item.is_minted).map(item => (
                <CouponCard 
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

}

export default Market;