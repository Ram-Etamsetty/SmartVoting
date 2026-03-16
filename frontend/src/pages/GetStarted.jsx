import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext';

const GetStarted = () => {

    const navigate = useNavigate()
    const { login } = useAuth()
    const [form, setForm] = useState({ name: '', email: '', password: '', jobTitle: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await fetch('http://localhost:4000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            const data = await res.json()
            if (!res.ok) {
                alert(data.message)
                setError(data.message || "Registration Failes")
                setLoading(false)
                return;
            }
            login(data.user, data.token)
            navigate('/dashboard')

        } catch (error) {
            setError('Could not Connnect to Server');
            setLoading(false)
        }
    }

    return (
        <div className='flex items-center justify-center px-4 py-2'>
            <div className=' w-125 flex flex-col gap-2 px-4 py-2'>
                <h1 className='inter-font text-[32px] font-semibold text-[#262D34]'>Administrator Sign Up</h1>
                <p className='text-[16px] text-[#262D3A] mb-6.25'>Already have an account ? <a className='text-orange-400 underline text-sm font-bold' href="/login">Login</a></p>
                <form action="" onSubmit={onSubmitHandler} className='flex flex-col gap-3'>
                    <div className='flex flex-col gap-1'>
                        <p className='text-[16px] text-[#262D3A] mb-1 inter-font font-semibold'>Name</p>
                        <input className='w-full px-4 py-3 bg-[#F3F7FE] outline-none' type="text" name='name'
                            value={form.name} required onChange={handleChange} placeholder='Name' />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <p className='text-[16px] text-[#262D3A] mb-1 inter-font font-semibold'>Email</p>
                        <input className='w-full px-4 py-3 bg-[#F3F7FE] outline-none' type="email" name='email'
                            value={form.email} required onChange={handleChange} placeholder='Email' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='text-[16px] text-[#262D3A] mb-1 inter-font font-semibold'>Password</p>
                        <input className='w-full px-4 py-3 bg-[#F3F7FE] outline-none' type="password" placeholder='Password'
                            onChange={handleChange} required name='password' value={form.password} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='text-[16px] text-[#262D3A] mb-1 inter-font font-semibold'>Job Title </p>
                        <input className='w-full px-4 py-3 bg-[#F3F7FE] outline-none' type="text" placeholder=''
                            name='jobTitle' onChange={handleChange} value={form.jobTitle} />
                    </div>

                    <div className='flex justify-center mt-2'>
                        <button type='submit' disabled={loading} className='w-[70%] px-7 py-3 bg-[#00263A] 
                        text-center text-white font-semibold text-md inter-font my-2 cursor-pointer'>{loading ? 'Signing Up...' : 'Sign-Up'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default GetStarted
