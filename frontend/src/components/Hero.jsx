import React from 'react'
import { NavLink } from 'react-router-dom'
import home_cover from '../assets/home-cover.jpg'
import ulu from '../assets/users-love-us.png'

const Hero = () => {
    return (
        <div className='bg-white flex items-center justify-between mx-8 my-7'>
            <div className='px-6 py-5 max-w-150' >
                <p className='text-orange-400 font-semibold text-3xl py-3  popin-font'>Loved in 100+ Organisations</p>
                <h1 className='varela-font text-4xl md:text-5xl lg:text-6xl py-4 font-extrabold'>Easy Online Election </h1>
                <h1 className='varela-font text-6xl  font-extrabold'>Excellence</h1>
                <p className='w-full text-gray-600 text-lg py-4'>ElectionBuddy guarantees election integrity,<br /> boosts voter
                    engagement and saves serious hours. <br /> It's free to test and free for up to 20 voters.</p>

                <div className='my-8'>
                    <NavLink to='' className='px-6 py-6 bg-orange-400 tranisition duration-300 text-2xl text-white font-bold rounded-xl hover:bg-orange-500 '>
                        Start A Free Election
                    </NavLink>
                </div>
                <div className='flex flex-row gap-3 mt-15'>
                    <img src={ulu} className='h-24 w-18 mr-7' alt="" />
                    <p className='text-gray-400 text-sm italic max-w-md'>"ElectionBuddy is easy to use and intuitive <br />
                        at a great price!" Executive Director</p>
                </div>
            </div>
            <div>
                <img className='h-160 w-200' src={home_cover} alt="" />
            </div>
        </div >
    )
}

export default Hero
