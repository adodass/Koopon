import { useEffect, useState } from 'react';
import { EState, MbButton } from 'mintbase-ui'
import Head from 'next/head'
import { Wallet as Wallet2, Stamp, Coins, Ticket } from 'phosphor-react';
import { useWallet } from '../services/providers/MintbaseWalletContext'
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';



type State = {
    fullName: string;
  };


const Home = () => {
    const [user, setUser] = useState<State>({ fullName: ''});
    const [selected, setSelected] = useState('signup');
    const { wallet, isConnected, details } = useWallet();
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();


    useEffect(() => {
        if (user.fullName) return;
        setUser(JSON.parse(localStorage.getItem('user') || '{}'));
    }, [user.fullName])

    // console.log(user)
    return (
        <>
            <header className='home-container' onClick={() => { if (showDropdown) {
                setShowDropdown(false)
            } }}>
                <div className='p-4' >
                    <nav className='flex justify-between items-center'>
                        <div style={{ textAlign: 'center', paddingLeft: '3.8rem' }}>
                            <h1 className='text-white flex items-center' style={{ fontSize: '2rem'}}> <Ticket size={32} /> koopon</h1>
                        </div>
                        <ul className='flex justify-center items-center px-4'>
                            <li className='mx-2 text-white cursor-pointer'>About</li>
                            <Link href="/market">
                                <li className='mx-2 text-white cursor-pointer'>
                                    Market place
                                </li>
                            </Link>
                            <li className='mx-2 text-white cursor-pointer'>FAQs</li>
                            {
                                !isConnected &&
                                <li onClick={() => {wallet?.connect({ requestSignIn: true })}} className='mx-2 text-white p-2 rounded-lg cursor-pointer' style={{ background: 'linear-gradient(90deg, #273f5c, #af4caa)'}}>Connect Wallet</li>
                            }
                            {
                                isConnected &&
                                <>
                                    <li  className='mx-2 text-white relative p-2 rounded-lg cursor-pointer' style={{ background: 'linear-gradient(90deg, #273f5c, #af4caa)', borderBottomLeftRadius: `${showDropdown ? 0 : '5px'}`, borderBottomRightRadius: `${showDropdown ? 0 : '5px'}`}}>
                                        <span onClick={() => setShowDropdown(true)} >
                                            {details.accountId}
                                        </span>

                                    {
                                        showDropdown &&
                                        <div className='transition ease-in-out delay-150 absolute z-10 p-4 top-10 rounded-md left-0' style={{ borderTopLeftRadius:0, borderTopRightRadius:0, width: '100%', background: 'linear-gradient(90deg, #273f5c, #af4caa)' }}>
                                            <h1 onClick={() => {wallet?.disconnect(); window.location.reload();  setShowDropdown(false)}}  className='text-center cursor-pointer'>Disconnect</h1>
                                        </div>
                                    }
                                    
                                    </li>
                                   
                                </>

                               
                            }
                        </ul>
                    </nav>
                </div>
                <section className='flex justify-center  pt-8' style={{ paddingTop: '2rem'}}>
                    <div className='' style={{ padding: '5rem', paddingTop: '10rem'}}>
                        <h1 style={{ fontSize: '4rem', lineHeight: 1.2, color: 'linear-gradient(90deg, #273f5c, #af4caa)'}} className="text-white font-extrabold">Get Any NFT Coupons Online</h1>
                        <p className='m-2 text-white'>Businesses rewarding customers...</p>
                        <Link href='/market'>
                            <button className='css-button-3d--green animate-pulse'>Buy NFT Coupons</button>
                        </Link>
                    </div>
                    <div className='text-center relative'>
                        <div className='blob pattern-dots-md gray flex justify-center items-center'>
                            <Image src='/assets/images/deal.svg' alt="..." width="400" height="300" className='rounded-lg'/>

                          
                                <p className='card p-4 absolute left-0 text-white' style={{ top: '10rem'}}>Create NFT Coupons</p>
                                <p className='card p-4 absolute top-10 right-5 text-white' style={{ top: '10rem'}}>Auction  NFT Coupons</p>
                                <p className='card p-4 absolute text-white left-0'>Trade  NFT Coupons</p>
                                <p className='card p-4 absolute right-5 text-white'>Exchange NFT Coupons</p>
                        
                        </div>
                        {/* <div className='blob pattern-dots-md gray absolute z-10'>
                        </div> */}
                    </div>
                </section>
            </header>
        </>
    )
}

export default Home;