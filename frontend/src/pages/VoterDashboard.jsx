import React from 'react';
import { useAuth } from '../Context/AuthContext';

const VoterDashboard = () => {
  const { user } = useAuth();

  return (
    <div className='flex items-center justify-center px-4 py-10 bg-[#FAFAFA] min-h-[80vh]'>
        <div className='w-full max-w-xl bg-white border border-gray-200 px-10 py-12 text-center shadow-sm'>
            <div className="flex justify-center mb-6">
                <span className="text-[60px]">🗳️</span>
            </div>
            <h1 className='inter-font text-[32px] font-bold text-[#262D34] mb-3'>
                Welcome Voter, {user?.name}!
            </h1>
            <p className='text-[16px] text-gray-500 leading-relaxed max-w-sm mx-auto'>
                This is your secure voting platform. Any live, active elections that you have been approved to participate in will appear here.
            </p>
        </div>
    </div>
  )
}

export default VoterDashboard;
