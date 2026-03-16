import React from 'react'
import ElectionMsg from '../components/ElectionMsg'
import { Link, NavLink } from 'react-router-dom'

const Elections = () => {
    return (
        <div className='flex flex-col gap-10'>
            <div className='flex flex-col items-center w-full'>
                <h1 className='varela-font text-5xl pt-6 pb-4 font-extrabold'>3 Easy Steps to Election Excellence</h1>
                <p className='text-orange-400 text-xl font-semibold  pb-4 inter-font'>How Elections Work in ElectionBuddy</p>
            </div>
            <div className='flex flex-row justify-between max-w-[60%]'>
                <div className='flex flex-col'>
                    <ElectionMsg SerialNo="1" heading="Design your perfect ballot in minutes" headingInfo="Add your election name and schedule dates. Choose from a variety of ballot types and add candidate details, photos and bios, or approvals with bylaws documents. Personalize notices for email, text message, postcards or letters. Then add your voter list and let the voting begin."></ElectionMsg>
                    <ElectionMsg SerialNo="2" heading="It's easy for voters to vote" headingInfo="Voters receive notice by email, text or mail and click to vote on their computer, phone or tablet. Schedule reminders to effortlessly increase turnout, and we'll monitor notice delivery for you too!"></ElectionMsg>
                    <ElectionMsg SerialNo="3" heading="Immediate high-integrity results" headingInfo="Results are tallied instantly and shared automatically with voters or after approval, you choose. Add results to your website and statistics to your member management system, while keeping voter's choices secret and ensuring observability."></ElectionMsg>
                </div>
                <div className='border'>
                    <img src="" alt="" />
                </div>
            </div>
            <div className='flex flex-col mb-20'>
                <p className='ml-30 inter-font text-xl text-gray-500 py-4'>Next Step</p>
                <NavLink className='inter-font font-bold text-xxl ml-30 bg-orange-400 text-white rounded-sm w-60 px-4 py-3 hover:bg-[#22063A]'>Explore Service Options</NavLink>
            </div>
        </div>
    )
}

export default Elections
