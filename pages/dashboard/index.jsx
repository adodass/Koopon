import Image from "next/image";
import { EState, MbButton } from 'mintbase-ui'
import { useWallet } from '../../services/providers/MintbaseWalletContext';
import { MetadataField } from 'mintbase'
import Link from "next/link";
import CouponCards from "../../components/CouponCard";
import { useEffect, useState } from "react";
import axios from 'axios';
import ModalBasic from "../../components/ModalBasic";
import Modal from "../../components/Modal";
import Toast from '../../components/Toast';
import Switch from "react-switch";
import { Wallet, FolderOpen, Folder, SignOut, Storefront, HouseSimple, Ticket, X, Lock} from 'phosphor-react';

function Dashboard() {
    const { wallet, isConnected, details } = useWallet();
    const [data, setData] = useState({category: ''})
    const [myCoupons, setMyCoupons] = useState([])
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [deployModalOpen, setDeployModalOpen] = useState(false);
    const [mintModalOpen, setMintModalOpen] = useState(false);
    const [mintModalOpen2, setMintModalOpen2] = useState(false);
    const [toastErrorOpen, setToastErrorOpen] = useState(false);
    const [toastErrorOpen2, setToastErrorOpen2] = useState(false);
    const [toastSuccessOpen, setToastSuccessOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [userDetails, setUserDetails] = useState({});
    const [selectedStore, setSelectedStore] = useState('');
    const [store, setStore] = useState({});
    const [toggle1, setToggle1] = useState(true);
    const [coupons, setCoupons] = useState([]);
    const [showDeployModal, setShowDeployModal] = useState(false);
    const [showMintModal, setShowMintModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [openSearch, setOpenSearch] = useState(false);
    

    function searchCategories(arr = null) {
      if(!arr) return;
      const newArr = [...arr];
      const filteredArr = newArr.filter(item => item?.toLowerCase().includes(data?.category?.toLowerCase()))
      return filteredArr;
    }


    async function getMyCoupons() {

      if (!wallet) return;

        try {
            const res = await axios.get(`https://still-garden-99623.herokuapp.com/koopon/${wallet?.activeAccount?.accountId}`, {
                headers: {
                    "Content-Type": 'application/json'
                }
            });
            console.log(res.data?.data)
            setMyCoupons(res.data?.data)

        } catch (error) {
            console.log(error)
        }
    }

    function getInputData(event) {
      const { name, value } = event.target;

      if (name === 'category') {
        setOpenSearch(true)
      }

      const newData = {...data}
      newData[name] = value;

      setData(newData);
     
    }

    async function getStoreDetails(event) {
      const { value, name } = event.target;
      const data = {...store}
      data[name] = value;
      setStore(data);
    }


    async function fetchCategories() {
      const response = await wallet?.api?.fetchCategories();
      setCategories(response?.data);
    }//


    async function httpCreateNewCoupon() {
      

      const newData = {...data}
      newData.account_id = wallet?.activeAccount?.accountId;

      console.log(newData);

      try {
      
        if (
          !newData.store_name ||
          !newData.price||
          !newData.discount||
          !newData.description||
          !newData.start_date||
          !newData.expiry_date ||
          !newData.store

        ) {
            setResponseMessage('Enter all required fields!');
            setToastErrorOpen(true);
            setFeedbackModalOpen(false)
            return
          }

        const res = await axios.post('https://still-garden-99623.herokuapp.com/koopon', newData, {
          headers: {
                "Content-Type": 'application/json'
            }
        });
        getMyCoupons();
        setToastSuccessOpen(true)
        setResponseMessage(res?.data?.message);
        setShowDeployModal(false);
        setData({});

      } catch (error) {
        console.log(error?.response?.data?.message);
        setResponseMessage(error?.response?.data?.message);
        setToastErrorOpen(true);
      }
      setFeedbackModalOpen(false)
    }

    async function mintKoopone() {

      console.log(data)

      if (
        !data.store_name ||
        !data.price||
        !data.discount||
        !data.description||
        !data.category ||
        !data.store

      ) {
          setResponseMessage('Enter all required fields!');
          setToastErrorOpen(true);
          setFeedbackModalOpen(false)
          return
        }
        
      if(!isConnected) return;
      if(!wallet) return;

      if(!data['file']) {
        setResponseMessage("Please select an image to upload");
        setToastErrorOpen(true);
        setFeedbackModalOpen(false)
        return;
      }
  
      const { data: didUpload, error } = await wallet?.minter?.uploadField(MetadataField.Media, data['file'])
  
      if (!didUpload || error) {
          console.log(error);
      }
  
      wallet?.minter?.setMetadata({
          title: data['store_name'],
          description: data['description'],
          coupon_id: data['_id']
      })

      localStorage.setItem('data', JSON.stringify(data));
  
      await wallet.mint(data?.quantity, data?.store, undefined, undefined, data?.category);
      setMintModalOpen(false)

  }


  async function httpUpdateCouponDetails(event) {


        
        
        
        // const getData = JSON.parse(localStorage.getItem('data'))
        // setData(getData)
        const store = await wallet?.api?.fetchStoreById('koopon.mintspace2.testnet');
        
        
        const thing = store?.data.store[0].things[store?.data.store[0].things.length - 1];
        
        // console.log(thing) 
        
        
        
        
        const account = await wallet?.api?.fetchAccount(details.accountId);
        console.log("Account: ", account)
        const filteredTokens = account?.data?.token?.filter((item) => item.id.includes(data?.store)).map((item) => item.id.split(':')[0]).sort((a, b) => a - b)
        const rightToken = account?.data?.token?.filter((item) => item.id.includes(filteredTokens[filteredTokens.length - 1]))
        const metaData = await wallet?.api?.fetchThingMetadata(rightToken[0]?.thing?.id)
        const tokenData = await wallet?.api?.fetchTokenById(rightToken[0]?.id)
  
        const update = {...metaData?.data, ...tokenData?.data}
    
        console.log(update)
        
        if (!data._id) return;
        
        
        console.log("loading...", data)
        try {
            const res = await axios.put(`https://still-garden-99623.herokuapp.com/koopon/${data?._id}`, {data: update, is_minted: true}, {
                headers: {
                    "Content-Type": 'application/json'
                }
            });
            
            localStorage.removeItem('data')
            setData({})
            setMintModalOpen(false)
            setMintModalOpen2(false)
            getMyCoupons()
            // console.log(res)

        } catch (error) {
            console.log(error)
        }
    setMintModalOpen(false)
    setMintModalOpen2(false);
  }

  async function deployAStore() {
    if (!store.store_name || !store.initials) {
      setDeployModalOpen(false)
      setToastErrorOpen2(true);
      setResponseMessage("Fill in all fields to create store.")
      return;
    }
    const response = await wallet.deployStore(store.store_name, store.initials);
    setDeployModalOpen(false);
  }
  

    function filteredCoupons(arr = []) {
      const newArr = [...arr];
      const filteredResult = newArr.filter(item => item.store_name.toLowerCase().includes(searchInput.toLowerCase()))
      return filteredResult;
    }

    async function getUserStoresAndToken() {
      // if (!isConnected) return;
      if (!details.accountId) return;
      const account = await wallet?.api?.fetchAccount(details.accountId);
      console.log("Account: ", account)

      if (account?.error) return;
      setUserDetails(account?.data)
      setSelectedStore(account?.data?.store[0])
    }

    useEffect(() => {
      getMyCoupons();
    }, [wallet?.isConnected]);

    useEffect(() => {
      if (userDetails?.store) return;
      getUserStoresAndToken();
    }, [userDetails?.store, details.accountId])

    useEffect(() => {
      // console.log(data)
      if (data?._id) return;
      const getData = JSON.parse(localStorage.getItem('data'))
      if (!getData) {
      
          return;
      }
      setData(getData);
      
  }, [wallet?.activeAccount?.accountId, data?._id])


  useEffect(() => {
    fetchCategories();
    // console.log(data)
    if (data?._id) return;
    const getData = JSON.parse(localStorage.getItem('data'));
    console.log('Get Data: ', getData)
    if (!getData) {
        setData({});
        setMintModalOpen2(false)
        return;
    }
    setData(getData);
    setMintModalOpen2(true);
}, [wallet?.activeAccount?.accountId, data?._id])

  

  console.log(data);

  return (
    <>
      <div className='flex' style={{ paddingLeft: '15%'}}>
        <div className='min-h-screen fixed top-0 left-0 z-10' style={{ background: '#1e3045', padding: '4rem 1rem', paddingTop: '7rem', width: '18%'}}>
        
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
        <div style={{ background: 'rgba(39,63,92, 0.9)', width: '100%', }} className="min-h-screen">
          <nav className='p-4 flex items-center justify-end sticky top-0 right-0 z-20' style={{ width: '100%', background: '#1e3045' }}>
            <div>
              <input type='search' placeholder="search coupons" onChange={e => setSearchInput(e.target.value)} style={{ background: 'rgba(39,63,92, 0.9)', color: 'white'}}  className='rounded-lg p-4'/>
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
                <h1 className='text-white text-center'>Dashboard</h1>
              </div>

              <div className='p-3 f' style={{ width: '20rem', }}>
                <h1 className='text-white font-extrabold text-right' style={{ fontSize: '1.4rem'}}>Welcome, {details?.accountId?.split('.')[0]}</h1>
                <p className="text-right text-white">Create and mint coupons</p>
                <div className='flex justify-end'>
                    <button onClick={() => {setShowDeployModal(true)}} className='animate-pulse mx-2 shadow-xl outline  text-white relative p-2 rounded-lg cursor-pointer  m-2' style={{ background: 'linear-gradient(90deg, #273f5c, #af4caa)'}}>Create coupon</button>
                    {
                      !toggle1 &&
                      <button onClick={() => {}} className='animate-pulse shadow-xl outline mx-2 text-white relative p-2 px-6 rounded-lg cursor-pointer  m-2' style={{ background: 'linear-gradient(90deg, #273f5c, #af4caa)'}}>Mint</button>
                    }
                </div>
              </div>
             


            </div>

          </div>
          <div style={{ }} className="flex flex-wrap p-6 justify-center">
            {
              filteredCoupons(myCoupons)?.filter(item => item).map(item => (
                <CouponCards 
                  {...item} 
                  key={item._id} 
                  getMyCoupons={getMyCoupons}
                  setData={setData} 
                  setFeedbackModalOpen={setShowDeployModal}
                  setMintModalOpen={setShowMintModal}
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
              <Toast type="error" open={toastErrorOpen} setOpen={setToastErrorOpen}>
               {responseMessage}
             </Toast>
              <h1 className='text-white' style={{ fontSize: '1.5rem'}}>Create new coupon</h1>
              <hr className='bg-white-400 mb-4'/>
              
              <div className="flex justify-center">

                <div className="mx-2" style={{ width: '50%'}}>

                  <div className="mb-2">
                    <div className="mb-2">
                        <label className="text-white" htmlFor="store_name">Business/store name: <span className="text-rose-500">*</span></label>
                    </div>
                  <select  className="rounded-lg p-4 w-full" style={{ background: 'white', color: '#7f7f7f'}}  name="store" onChange={getInputData}>
                      <option>Select store</option>
                      {
                        userDetails?.store?.map(item => (
                          <option key={item.id} value={item.id}>{item.id}</option>
                        ))
                      }
                    </select>
                </div>

                  <div className='mb-2'>
                    <div className='mb-2'>
                      <label className='text-white '>Title<span className="mx-2 text-rose-500">*</span></label>
                    </div>
                    <input type='search' placeholder="Title" onChange={getInputData} defaultValue={data?.store_name} id="store_name" name="store_name" style={{ background: 'white', color: '#7f7f7f'}}  className='rounded-lg p-4 w-full'/>
                  </div>

                  <div className='mb-2'>
                    <div className='mb-2'>
                      <label className='text-white'>Price<span className="mx-2 text-rose-500">*</span></label>
                    </div>
                    <input type='number' placeholder="$10" onChange={getInputData} defaultValue={data?.price} id="price" name="price"  style={{ background: 'white', color: '#7f7f7f'}}  className='rounded-lg p-4 w-full'/>
                  </div>
                  <div className='mb-2'>
                    <div className='mb-2'>
                      <label className='text-white'>Quantity<span className="mx-2 text-rose-500">*</span></label>
                    </div>
                    <input type='number' onChange={getInputData} defaultValue={data?.quantity}  id="quantity" name="quantity" placeholder="4"  style={{ background: 'white', color: '#7f7f7f'}}  className='rounded-lg p-4 w-full'/>
                  </div>
                </div>

                <div className="mx-2" style={{ width: '50%'}}>

                  
                  <div className='mb-2'>
                    <div className='mb-2'>
                      <label className='text-white'>Discount (%)<span className="mx-2 text-rose-500">*</span></label>
                    </div>
                    <input type='number' onChange={getInputData} defaultValue={data?.discount}  id="discount" name="discount"  placeholder="1"  style={{ background: 'white', color: '#7f7f7f'}}  className='rounded-lg p-4 w-full'/>
                  </div>
                  
                  <div className='mb-2'>
                    <div className='mb-2'>
                      <label className='text-white'>Start Date<span className="mx-2 text-rose-500">*</span></label>
                    </div>
                    <input type='date' onChange={getInputData} defaultValue={data?.start_date}  id="start_date" name="start_date"  style={{ background: 'white', color: '#7f7f7f'}}  className='rounded-lg p-4 w-full'/>
                  </div>
                  
                  <div className='mb-2'>
                    <div className='mb-2'>
                      <label className='text-white'>Expiry Date<span className="mx-2 text-rose-500">*</span></label>
                    </div>
                    <input type='date' onChange={getInputData} defaultValue={data?.expiry_date}  id="expiry_date" name="expiry_date"  style={{ background: 'white', color: '#7f7f7f'}}  className='rounded-lg p-4 w-full'/>
                  </div>
                  
                  <div className='mb-2'>
                    <div className='mb-2'>
                      <label className='text-white'>Description<span className="mx-2 text-rose-500">*</span></label>
                    </div>
                    <textarea onChange={getInputData} defaultValue={data?.description} id="description" name="description" style={{ background: 'white', color: '#7f7f7f'}} className='rounded-lg p-4 w-full' type="text" required />
                  </div>
                  
                </div>
              </div>

              
              <div className='p-4  text-center'>
                  <button onClick={httpCreateNewCoupon} className='text-white shadow-xl outline p-3 rounded-lg cursor-pointer' 
                style={{ background: 'linear-gradient(90deg, #273f5c, #af4caa)'}}
                // style={{ background: 'rgba(39,63,92, 0.9)'}}
                >{data?._id ? "Update coupon" : "Create coupon"}</button>
              </div>

            </div>
      

        </div>
      }
      {
        showMintModal &&
        <div className='fixed top-0 left-0 right-0 bottom-0 w-full min-h-screen z-20 flex justify-center items-center' style={{ background: 'rgba(0, 0, 0, 0.9)'}}>

        
            <div className=' rounded-lg m-2 p-6' onClick={
              () => {
                if(openSearch) {
                  setOpenSearch(false);
                }
              }
            } style={{
    
              background: ' #273f5c',
              // background: 'linear-gradient(90deg, #273f5c, #2a0f29)',
            }}>
              <X size={40} color="white" 
              onClick={() => setShowMintModal(false)}
              style={{
                position:'absolute',
                top: '1rem',
                right: '1rem',
                cursor: 'pointer'
              }}/>
              <Toast type="error" open={toastErrorOpen} setOpen={setToastErrorOpen}>
               {responseMessage}
             </Toast>
              <h1 className='text-white' style={{ fontSize: '1.5rem'}}>Mint coupon</h1>
              <hr className='bg-white-400 mb-4'/>
              
              <div className="flex justify-center">

                <div className="mx-2" style={{ width: '50%'}}>

                  {/* <div className="mb-2">
                    <div className="mb-2">
                        <label className="text-white" htmlFor="store_name">Business/store name: <span className="text-rose-500">*</span></label>
                    </div>
                  <select  className="rounded-lg p-4 w-full" style={{ background: 'white', color: '#7f7f7f'}}  name="store" onChange={getInputData}>
                      <option>Select store</option>
                      {
                        userDetails?.store?.map(item => (
                          <option key={item.id} value={item.id}>{item.id}</option>
                        ))
                      }
                    </select>
                </div> */}

                  <div className='mb-2'>
                    <div className='mb-2'>
                      <label className='text-white '>Business/store name<span className="mx-2 text-rose-500">*</span></label>
                    </div>
                    <input type='search' placeholder="Title" disabled onChange={getInputData} defaultValue={data?.store_name} id="store_name" name="store_name" style={{ background: 'white', color: '#7f7f7f'}}  className='rounded-lg p-4 w-full'/>
                  </div>

                  <div className='mb-2'>
                    <div className='mb-2'>
                      <label className='text-white'>Quantity<span className="mx-2 text-rose-500">*</span></label>
                    </div>
                    <input type='number' onChange={getInputData} defaultValue={data?.quantity}  id="quantity" name="quantity" placeholder="4"  style={{ background: 'white', color: '#7f7f7f'}}  className='rounded-lg p-4 w-full'/>
                  </div>
                <div className='mb-2'>
                    <div className='mb-2'>
                      <label className='text-white'>File(jpg/jpeg/png)<span className="mx-2 text-rose-500">*</span></label>
                    </div>
                    <input type='file'
                    onChange={() => {
                      const newData = {...data}
                      newData['file'] = event.target.files[0]
                      setData(newData)
                    }}
                    id="price" name="price"  style={{ background: 'white', color: '#7f7f7f'}}  className='rounded-lg p-4 w-full'/>
                  </div>
                </div>




                <div className="mx-2" style={{ width: '50%'}}>

                  
                  <div className='mb-2'>
                    <div className='mb-2'>
                      <label className='text-white'>Category<span className="mx-2 text-rose-500">*</span></label>
                    </div>
                    <input type='search' onChange={getInputData} value={data?.category}  id="category" name="category"  placeholder={`${categories.slice(0, 5).join(', ')}...`}  style={{ background: 'white', color: '#7f7f7f'}}  className={`'rounded-lg p-4 w-full ${openSearch && "rounded-bl-none rounded-br-none"} rounded-lg`}/>
                    {
                      openSearch && 
                      <div className="h-24 p-2 overflow-y-scroll" style={{ background: 'white'}}>
                        {
                          searchCategories(categories)?.map((item, index) => (
                            <p key={index.toString()} onClick={
                              () => {
                                const newData = {...data}
                                newData.category = item;
                                setData(newData);
                                setOpenSearch(false)
                              }
                            } className="p-2 shadow-md rounded-md cursor-pointer mb-2 bg-sky-100 rounded-bl-lg rounded-br-lg hover:bg-sky-700 hover:text-white" >{item}</p>
                          ))
                        }
                      </div>
                    }
                  </div>
                  
                  {/* <div className='mb-2'>
                    <div className='mb-2'>
                      <label className='text-white'>Start Date<span className="mx-2 text-rose-500">*</span></label>
                    </div>
                    <input type='date' onChange={getInputData} defaultValue={data?.start_date}  id="start_date" name="start_date"  style={{ background: 'white', color: '#7f7f7f'}}  className='rounded-lg p-4 w-full'/>
                  </div>
                  
                  <div className='mb-2'>
                    <div className='mb-2'>
                      <label className='text-white'>Expiry Date<span className="mx-2 text-rose-500">*</span></label>
                    </div>
                    <input type='date' onChange={getInputData} defaultValue={data?.expiry_date}  id="expiry_date" name="expiry_date"  style={{ background: 'white', color: '#7f7f7f'}}  className='rounded-lg p-4 w-full'/>
                  </div> */}
                  
                  <div className='mb-2'>
                    <div className='mb-2'>
                      <label className='text-white'>Description<span className="mx-2 text-rose-500">*</span></label>
                    </div>
                    <textarea onChange={getInputData} defaultValue={data?.description} id="description" name="description" style={{ background: 'white', color: '#7f7f7f', height: '10rem'}} className='rounded-lg p-4 w-full' type="text" required />
                  </div>
                  
                </div>
              </div>

              
              <div className='p-4  text-center'>
                  <button onClick={mintKoopone} className='text-white shadow-xl outline p-3 px-6 rounded-lg cursor-pointer' 
                style={{ background: 'linear-gradient(90deg, #273f5c, #af4caa)'}}
                // style={{ background: 'rgba(39,63,92, 0.9)'}}
                >Mint</button>
              </div>

            </div>
      

        </div>
      }

      {
        mintModalOpen2 && 
        <div className='fixed top-0 left-0 right-0 bottom-0 w-full min-h-screen z-20 flex justify-center items-center' style={{ background: 'rgba(0, 0, 0, 0.9)'}}>
            <div className=' rounded-lg m-2 p-6 text-center' style={{
    
                background: ' #273f5c',
                // background: 'linear-gradient(90deg, #273f5c, #2a0f29)',
              }}>

                  <h1 className="text-white mb-4">Coupon minted!</h1>
                  <button onClick={httpUpdateCouponDetails} className='text-white shadow-xl outline p-3 px-6 rounded-lg cursor-pointer' 
                style={{ background: 'linear-gradient(90deg, #273f5c, #af4caa)'}}
                // style={{ background: 'rgba(39,63,92, 0.9)'}}
                >Finish</button>
              </div>
        </div>
      }
    </>
  )

}


export default Dashboard;









{

  
}
  // return (
  //     <>
  //         {/* Profile background */}
  //       <div className="h-56 bg-slate-200">
  //           <Image className="object-cover h-full w-full" src="/assets/images/company-bg.jpg" width="2560" height={440} alt="Company background" />
  //       </div>
  
  //       {/* Header */}
  //       <header className="text-center bg-slate-50 pb-6 border-b border-slate-200">
  //         <div className="px-4 sm:px-6 lg:px-8 w-full">
  //           <div className="max-w-3xl mx-auto">
  //             {/* Avatar */}
  //             <div className="-mt-12 mb-2">
  //               <div className="inline-flex -ml-1 -mt-1 sm:mb-0">
  //                 <Link href='/' style={{ cursor: 'pointer' }}>  
  //                  <Image className="rounded-full border-4 border-white" src="/assets/images/company-icon-01.svg" width="104" height="104" alt="Avatar" />
  //                 </Link>
  //               </div>
  //             </div>
  
  //             {/* Company name and info */}
  //             <div className="mb-4">
  //               <h2 className="text-2xl text-slate-800 font-bold mb-2">{details.accountId}</h2>
  //               {
  //                 isConnected && 
  //                 <div className="flex justify-center my-2">
  //                   <p>Balance: {details.balance}🚀 </p>
  //                   <Lock title="Disconnect wallet" color="red" size={22} style={{margin: '0 1rem', cursor: 'pointer'}} onClick={() => {wallet?.disconnect(); window.location.reload()}}/>
  //                 </div>
  //               }
  //               <Toast type="error" open={toastErrorOpen2} setOpen={setToastErrorOpen2}>
  //                 {responseMessage}
  //               </Toast>
  //               {
  //                 isConnected &&
  //                 <div className="py-2 flex justify-center items-center">
  //                   <p className="mx-2">Minting to: </p>
              
  //                     <select style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 px-2 py-1" value={selectedStore} onChange={e => setSelectedStore(e.target.value)}>
  //                       <option>Select store</option>
  //                       {
  //                         userDetails?.store?.map(item => (
  //                           <option key={item.id} value={item.id}>{item.id}</option>
  //                         ))
  //                       }
  //                     </select>
  //                 </div>
  //               }
  //               <div>
  //                 {
  //                   isConnected &&
  //                   <Link href="/market">
  //                     <MbButton label='Market place'  style={{ background: 'rgb(99 102 241)', color: 'white', marginRight: '2rem'}}/>
  //                   </Link>
  //                 }
  
  //                 {
  //                   isConnected &&
  //                   <>
  //                     <MbButton onClick={() => {
  //                       if (userDetails?.store.length < 1) {
  //                         setToastErrorOpen2(true)
  //                         setResponseMessage('Please deploy a store.')
  //                         return;
  //                       }
  //                       setFeedbackModalOpen(true)
  //                     }} label='+ Create coupon' style={{ background: 'rgb(100 100 100)', color: 'white', marginRight: '2rem'}}/>
  //                     <MbButton onClick={() => {setDeployModalOpen(true)}} label='Deploy store' style={{ background: 'rgb(100 100 100)', color: 'white', marginRight: '2rem'}}/>
  //                   </>
  //                 }
  //                 {
  //                   !isConnected &&
  //                   <MbButton onClick={() => {console.log("click"); wallet?.connect({ requestSignIn: true })}} label='connect wallet' style={{ background: 'rgb(100 100 100)', color: 'white', marginRight: '2rem'}}/>
  //                 }
                
                  
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </header>
  
  
  //       <div className="flex justify-center items-center p-4">
  //         <input autoComplete="off" onChange={e => setSearchInput(e.target.value)} value={searchInput} id="search" name="search" style={{ border: '1px solid #eee', width: '40rem',}} className="form-input outline-slate-100 w-full px-4 py-2" type="text" placeholder="search..." />
  //         <p className="mx-2 " style={{ cursor: 'pointer', color: '#7f7f7f'}} onClick={() => setSearchInput('')}>clear</p>
  //       </div>
  
  
  //       <div className="px-6 flex flex-wrap justify-center">
  //         {
  //           filteredCoupons(myCoupons)?.map(item => (
  //             <CouponCards 
  //               key={item._id} {...item} 
  //               setData={setData} 
  //               setFeedbackModalOpen={setFeedbackModalOpen}
  //               setMintModalOpen={setMintModalOpen}
  //               getMyCoupons={getMyCoupons}
  //             />
  //             ))
  //           }
  //         {
  //           !myCoupons?.length && <div className="text-center" style={{ paddingTop: '5rem'}}>
  //             <Image src="/assets/images/ticket.png" alt="..." width="104" height="104"/>
  //             <p>No coupons</p>
  //             {
  //               isConnected &&
  //               <MbButton onClick={() => setFeedbackModalOpen(true)} label='+ Create coupon' style={{ background: 'rgb(100 100 100)', color: 'white'}}/>
  //             }
  //             {
  //               !isConnected &&
  //               <MbButton onClick={() => {wallet?.connect({ requestSignIn: true })}} label='connect wallet' style={{ background: 'rgb(100 100 100)', color: 'white'}}/>
  //             }
  //           </div>
  //         }
  //       </div>







  //       <Modal 
  //         feedbackModalOpen={feedbackModalOpen}
  //         setFeedbackModalOpen={httpCreateNewCoupon}
  //         title={data?._id ? "Update coupon": "Create coupon"}
  //         description="Please fill in required fields."
  //       >
  
  //           <Toast type="success" open={toastSuccessOpen} setOpen={setToastSuccessOpen}>
  //             {responseMessage}
  //           </Toast>                  
  
  //           <Toast type="error" open={toastErrorOpen} setOpen={setToastErrorOpen}>
  //             {responseMessage}
  //           </Toast>
            
  //           <div>
  //             <label className="block text-sm font-medium mb-1" htmlFor="store_name">Store name: <span className="text-rose-500">*</span></label>
  //               <select style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 w-full px-2 py-1" name="store" onChange={getInputData}>
  //                 <option>Select store</option>
  //                 {
  //                   userDetails?.store?.map(item => (
  //                     <option key={item.id} value={item.id}>{item.id}</option>
  //                   ))
  //                 }
  //               </select>
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium mb-1" htmlFor="store_name">Business name: <span className="text-rose-500">*</span></label>
  //             <input onChange={getInputData} defaultValue={data?.store_name} id="store_name" name="store_name" style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 w-full px-2 py-1" type="text" required />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium mb-1" htmlFor="price">Price: <span className="text-rose-500">*</span></label>
  //             <input onChange={getInputData} defaultValue={data?.price} id="price" name="price" style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 w-full px-2 py-1" type="number" required />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium mb-1" htmlFor="quantity">Quantity: <span className="text-rose-500">*</span></label>
  //             <input onChange={getInputData} defaultValue={data?.quantity}  id="quantity" name="quantity" style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 w-full px-2 py-1" type="number" required />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium mb-1" htmlFor="discount">Discount: <span className="text-rose-500">*</span></label>
  //             <input onChange={getInputData} defaultValue={data?.discount}  id="discount" name="discount" style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 w-full px-2 py-1" type="number" required />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium mb-1" htmlFor="start_date">Start date: <span className="text-rose-500">*</span></label>
  //             <input onChange={getInputData} defaultValue={data?.start_date}  id="start_date" name="start_date" style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 w-full px-2 py-1" type="date" required />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium mb-1" htmlFor="expiry_date">Expiry date: <span className="text-rose-500">*</span></label>
  //             <input onChange={getInputData} defaultValue={data?.expiry_date}  id="expiry_date" name="expiry_date" style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 w-full px-2 py-1" type="date" required />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium mb-1" htmlFor="description">Description: <span className="text-rose-500">*</span></label>
  //             <textarea onChange={getInputData} defaultValue={data?.description} id="description" name="description" style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 w-full px-2 py-1" type="text" required />
  //           </div>
  //       </Modal>





  
  
  //       {/* Minter */}
  //       <Modal 
  //         feedbackModalOpen={mintModalOpen}
  //         setFeedbackModalOpen={mintKoopone}
  //         title={`Minting coupon to ${data?.store}`}
  //         description="***To mint coupon to a different store, update coupon!***"
  //         btnMessage={`Mint ${data?.store_name}`}
  //       >
  
  //         <Toast type="error" open={toastErrorOpen} setOpen={setToastErrorOpen}>
  //           {responseMessage}
  //         </Toast>
  
  //         <div>
  //           <label className="block text-sm font-medium mb-1" htmlFor="store_name">Business name: <span className="text-rose-500">*</span></label>
  //           <input onChange={getInputData} defaultValue={data?.store_name} id="store_name" name="store_name" style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 w-full px-2 py-1" type="text" required />
  //         </div>
  
  //         <div>
  //           <label className="block text-sm font-medium mb-1" htmlFor="quantity">Quantity: <span className="text-rose-500">*</span></label>
  //           <input onChange={getInputData} defaultValue={data?.quantity} id="quantity" name="quantity" style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 w-full px-2 py-1" type="number" required />
  //         </div>
  
  //         <div>
  //           <label className="block text-sm font-medium mb-1" htmlFor="category">Category: <span className="text-rose-500">*</span></label>
  //           <input onChange={getInputData} defaultValue={data?.category} id="category" name="category" style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 w-full px-2 py-1" type="text" required />
  //         </div>
  
  //         <div>
  //           <label className="block text-sm font-medium mb-1" htmlFor="description">Description: <span className="text-rose-500">*</span></label>
  //           <textarea onChange={getInputData} defaultValue={data?.description} id="description" name="description" style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 w-full px-2 py-1" type="text" required />
  //         </div>
  
  
  //         <div>
  //           <label className="block text-sm font-medium mb-1" htmlFor="file">File: <span className="text-rose-500">*</span></label>
  //           <input onChange={() => {
  //             const newData = {...data}
  //             newData['file'] = event.target.files[0]
  //             setData(newData)
  //           }} defaultValue={data?.store_name} id="file" name="file" style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 w-full px-2 py-1" type="file" required />
  //         </div>
  
  //       </Modal>
  
  //       {/* Updater */}
  //       <Modal 
  //         feedbackModalOpen={mintModalOpen2}
  //         setFeedbackModalOpen={httpUpdateCouponDetails}
  //         title="Successful"
  //         btnMessage="Finish"
  //         // description="Please fill in required fields."
  //       >
  
  //           <div className="p-5 flex space-x-4">
  //             {/* Icon */}
  //             <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-100">
  //               <svg className="w-4 h-4 shrink-0 fill-current text-emerald-500" viewBox="0 0 16 16">
  //                 <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM7 11.4L3.6 8 5 6.6l2 2 4-4L12.4 6 7 11.4z" />
  //               </svg>
  //             </div>
  //             {/* Content */}
  //             <div>
  //               {/* Modal header */}
  //               <div className="mb-2">
  //                 <div className="text-lg font-semibold text-slate-800">Successfully minted {data?.store_name}</div>
  //               </div>
  //               {/* Modal content */}
  //               <div className="text-sm mb-10">
  //                 <div className="space-y-2">
  //                   <p>{data?.description}</p>
  //                 </div>
  //               </div>
  //           </div>
  //           </div>
  //       </Modal>
  
  //       <Modal 
  //         feedbackModalOpen={deployModalOpen}
  //         setFeedbackModalOpen={deployAStore}
  //         title="Create new store"
  //         btnMessage="Deploy store"
  //         // description="Please fill in required fields."
  //       >
  
  //         <div>
  //           <label className="block text-sm font-medium mb-1" htmlFor="store_name">Store name: <span className="text-rose-500">*</span></label>
  //           <input onChange={getStoreDetails} id="store_name" name="store_name" style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 w-full px-2 py-1" type="text" required />
  //         </div>
  
  //         <div>
  //           <label className="block text-sm font-medium mb-1" htmlFor="initials">Store initials: <span className="text-rose-500">*</span></label>
  //           <input onChange={getStoreDetails} id="store_name" name="initials" style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 w-full px-2 py-1" type="text" required />
  //         </div>
  
           
  //       </Modal>
        
  //     </>
  // )