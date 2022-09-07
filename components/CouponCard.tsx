import { useState } from "react"
import Link from "next/link"
import { MbButton } from "mintbase-ui"
import Modal from "./Modal"
import Image from "next/image"
import { Trash, Fire, Ticket, Coins, Swap } from 'phosphor-react';
import { useWallet } from '../services/providers/MintbaseWalletContext'
import axios from "axios"
import { useRouter } from "next/router"


function CouponCards({ 
    id,
    _id,
    store_name, 
    category,
    data, 
    is_minted, 
    expiry_date, 
    start_date, 
    price, 
    quantity, 
    discount, 
    description, 
    accountId,
    store,
    setData,
    setFeedbackModalOpen,
    setMintModalOpen,
    getMyCoupons,
    burnOne
  }:any) {

    const { wallet, isConnected, details } = useWallet();
    const router = useRouter();
    async function deleteCoupon(id: string) {
      try {  
        const res = await axios.delete(`https://still-garden-99623.herokuapp.com/koopon/${id}`, {
          headers: {
                "Content-Type": 'application/json'
            }
        });
        getMyCoupons();
      } catch (error) {
        console.log(error)
      }
   
    }

    

    function couponData() {
      setFeedbackModalOpen(true)
      return (
        {
          _id,
          store_name, 
          category,
          data, 
          is_minted, 
          expiry_date, 
          start_date, 
          price, 
          quantity, 
          discount, 
          description, 
          accountId,
          store,
        }
      )
    }
    function mintData() {
      setMintModalOpen(true)
      return (
        {
          _id,
          store_name, 
          category,
          data, 
          is_minted, 
          expiry_date, 
          start_date, 
          price, 
          quantity, 
          discount, 
          description, 
          accountId,
          store,
        }
      )
    }


    function saveToLocalStorage() {
      localStorage.setItem('data', JSON.stringify({
        _id,
        store_name, 
        category,
        data, 
        is_minted, 
        expiry_date, 
        start_date, 
        price, 
        quantity, 
        discount, 
        description, 
        accountId,
        store,
      }));

      router.push(`/coupon/${_id}`)
    }


    return (
        <>
            <div style={{ width: '15rem', background: 'rgba(39,63,92, 0.9)'}} className="  hover:scale-110 delay-150 duration-300 ease-in-out  col-span-full m-4 sm:col-span-6 xl:col-span-3 bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="flex flex-col h-full">
                {/* Image */}
                <div className="relative flex justify-between items-center px-4 pt-2">
                {
                  (details.accountId === data?.ownerId) && 
                  <>
                      <a className="text-xs text-emerald-500 hover:text-emerald-600 font-semibold uppercase tracking-widest mb-1" href="#0">{is_minted ? "Minted": "Unminted"}</a>
                  <button className=" z-10 top-0 right-0 mr-4">
                    <div title={is_minted ? "Burn" : "Delete"} className="text-slate-100 p-1 bg-slate-900 bg-opacity-60 rounded-full" style={{ background: 'white'}}>
                      {
                        is_minted && (details.accountId === data.ownerId) && <Fire size={20} color='red' onClick={(e) => {
                          burnOne(id)}
                        }/> 
                      }
                    
                    </div>
                  </button>
                  </>
                }
                {
                  (details.accountId === data?.ownerId) && 
                  <>
                      <a className="text-xs text-emerald-500 hover:text-emerald-600 font-semibold uppercase tracking-widest mb-1" href="#0">{is_minted ? "Minted": "Unminted"}</a>
                  <button className=" z-10 top-0 right-0 mr-4">
                    <div title={is_minted ? "Burn" : "Delete"} className="text-slate-100 p-1 bg-slate-900 bg-opacity-60 rounded-full" style={{ background: 'white'}}>
                      {
                        is_minted && (details.accountId === data.ownerId) && <Fire size={20} color='red' onClick={(e) => {
                          burnOne(id)}
                        }/> 
                      }
                    
                    </div>
                  </button>
                  </>
                }
                {
                  !is_minted && 
                  <button className="">
                    <div title={is_minted ? "Burn" : "Delete"} className="text-slate-100 p-1 bg-slate-900 bg-opacity-60 rounded-full" style={{ background: 'white'}}>
                      <Trash size={20} color="red" onClick={() => deleteCoupon(_id)}/>
                    </div>
                  </button>
                }
                </div>
 
                <div className="grow flex justify-center items-center " >

                 
                  
                    <header className="mb-4 p-0 cursor-pointer " onClick={saveToLocalStorage}>
                      <p className="mb-1 text-white text-center px-3" style={{fontSize: '0.8rem'}}>Store: {data && store?.split('.')[0]}</p>
                      <div className="flex justify-center p-0 rounded-lg">
                       {data && <Image src={`${data?.media}`} alt="..." className="rounded-lg" width={200} height={200} quality={70}
                        />}
                        {!data && <Ticket size={100} color="white"/>}
                      </div>
                      <div className="text-sm text-center text-white m-2" style={{ fontSize: '0.7rem'}}>{description}</div>
                      {id && <p className="text-rose-400 text-center" style={{ fontSize: '0.6rem'}}>token id: {id}</p>} 


                      {/* <div >
                          {
                            is_minted && (details.accountId === data.ownerId) && <button title={`Sell ${data?.title || store_name}`} className='animate-none shadow-xl outline mx-2 text-white  p-2 px-6 rounded-lg cursor-pointer  m-2' style={{ background: 'linear-gradient(90deg, #273f5c, #af4caa)'}} onClick={() => {}}><Coins size={18} /></button>
                          }
                          {
                            is_minted && (details.accountId === data.ownerId) && <button title={`Sell ${data?.title || store_name}`} className='animate-none shadow-xl outline mx-2 text-white  p-2 px-6 rounded-lg cursor-pointer  m-2' style={{ background: 'linear-gradient(90deg, #273f5c, #af4caa)'}} onClick={() => {}}><Swap size={18} /></button>
                          }
                        </div> */}
                    </header>
                   
                
                </div>
                        <div className="flex justify-center pb-2">

                          {
                            !is_minted && <button className='animate-none shadow-xl outline mx-2 text-white  p-2 px-6 rounded-lg cursor-pointer  m-2' style={{ background: 'linear-gradient(90deg, #273f5c, #af4caa)'}} onClick={() => setData(mintData())}>Mint</button>
                          }
                          {
                            !is_minted && <button onClick={() => setData(couponData())} className='animate-none shadow-xl outline mx-2 text-white  p-2 px-6 rounded-lg cursor-pointer  m-2' style={{ background: 'linear-gradient(90deg, #273f5c, #af4caa)'}}>Edit</button>
                          }
                        </div>
              </div>
            </div>
        
        </>
    )
  }
  
  export default CouponCards;
  
  
  
  
  
  
  
  
  
  
  
   {/* Info */}
  {/* <div className="mb-0"> */}
    {/* <div className="flex justify-between text-sm space-x-2 mb-2">
      <div><span className="italic text-white" style={{ fontSize: '0.7rem'}}>Prev Amount: </span><span style={{ textDecoration: 'line-through',  fontSize: '0.7rem'}} className="font-semibold text-slate-800 text-white">${price}</span> </div>
      <div style={{ fontSize: '0.7rem'}} className="text-white">Discount: {discount}%</div>
    </div>
    <div className="flex justify-between text-sm space-x-2 mb-2">
      <div><span className="italic text-white" style={{ fontSize: '0.7rem'}}>Discounted Amount: </span><span className="font-semibold text-slate-800">${(price) * (discount / 100)}</span> 
      </div>
      <div>Discount: {discount}%</div>
    </div> */}
    {/* Bar */}
    {/* <div className="relative w-full h-2 rounded-full bg-slate-200 mb-2">
      <div className="absolute left-0 top-0 bottom-0 bg-emerald-500 rounded-full" style={{width: `${discount }%`}}></div>
    </div> */}
    {/* {store && <div className="font-medium text-xs text-white" style={{ fontSize: '0.7rem'}}>Store: {store}</div>} */}
  {/* </div> */}
  
  
  
  
  
  
  
  
  
  {/* <Modal 
      feedbackModalOpen={feedbackModalOpen}
      setFeedbackModalOpen={setFeedbackModalOpen}
      title="Mint Coupon"
  >

    <div>
      <label className="block text-sm font-medium mb-1" htmlFor="store_name">Store Name: <span className="text-rose-500">*</span></label>
      <input id="store_name" name="store_name" style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 w-full px-2 py-1" type="text" required />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1" htmlFor="store_name">File: <span className="text-rose-500">*</span></label>
      <input id="store_name" name="store_name" style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 w-full px-2 py-1" type="file" required />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1" htmlFor="description">Description: <span className="text-rose-500">*</span></label>
      <textarea id="description" name="description" style={{ border: '1px solid #eee'}} className="form-input outline-slate-100 w-full px-2 py-1" required />
    </div>
  </Modal> */}








  {/* <div className="col-span-full m-4 sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200">
            <div className="flex flex-col h-full p-5">
                <header>
                <div className="flex items-center justify-between">
                    
                    <div className="flex shrink-0 -space-x-3 -ml-px">
                   
                    </div>
                </div>
                </header>
                <div className="grow mt-2">
                <Link className="inline-flex text-slate-800 hover:text-slate-900 mb-1" href={"props.link"}>
                    <h2 className="text-xl leading-snug font-semibold">{store_name}</h2>
                </Link>
                <div className="text-sm">{description}</div>
                </div>
                <footer className="mt-5">
                <div className="text-sm font-medium text-slate-500 mb-2">{start_date} <span className="text-slate-400">-&gt;</span> {expiry_date}</div>
                <div className="flex justify-between items-center">
                    <div>
                    <div className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${is_minted ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>{is_minted ? "Minted" : "Not Minted"}</div>
                    </div>
                    <div>
                    <Link className="text-sm font-medium text-indigo-500 hover:text-indigo-600" href={"props.link"}>View -&gt;</Link>
                    </div>
                </div>
                <div className="p-2">
                   {!is_minted && <MbButton onClick={() => setFeedbackModalOpen(true)} label='Mint'  style={{ background: 'rgb(99 102 241)', color: 'white', marginRight: '2rem'}}/>}
                   {
                        is_minted && 
                        <>
                            <MbButton label='List'  style={{ background: 'rgb(99 102 241)', color: 'white', marginRight: '2rem'}}/>
                            <MbButton label='Auction'  style={{ background: 'rgb(99 102 241)', color: 'white', marginRight: '2rem'}}/>
                            <MbButton label='Compare'  style={{ background: 'rgb(99 102 241)', color: 'white', marginRight: '2rem'}}/>
                        </>
                    }
                </div>
                </footer>
            </div>
        </div> */}