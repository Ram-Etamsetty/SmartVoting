import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'


const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('');
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(''); // clears error while typing
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setError('');
        try {
            const res = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            const data = await res.json()
            if (!res.ok) {
                setError("Invalid email or password");
                return;
            }
            login(data.user, data.token)
            navigate("/dashboard")
        } catch (error) {
            setError("Server not reachable. Please try again.");
        }
    }

    return (
        <div className='flex items-center justify-center px-4 py-2 mt-10'>
            <div className='flex flex-col gap-3 w-110'>
                <div>
                    <h1 className='inter-font text-[32px] font-semibold text-[#262D34]'>Administrator Login</h1>
                    <p className='text-[16px] text-[#262D3A] mb-6.25'>To Cast Your Vote,Visit <a className='text-orange-400 underline text-sm font-bold' href="">Voting Page</a></p>
                </div>
                <form onSubmit={onSubmitHandler} action="" className='flex flex-col gap-3'>
                    <div className='flex flex-col gap-1'>
                        <p className='text-[16px] text-[#262D3A] mb-1 inter-font font-semibold'>Email</p>
                        <input className='w-full px-4 py-3 bg-[#F3F7FE] outline-none' type="email" name='email'
                            value={form.email} required onChange={handleChange} placeholder='Email' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='text-[16px] text-[#262D3A] mb-1 inter-font font-semibold'>Password</p>
                        <input className='w-full px-4 py-3 bg-[#F3F7FE] outline-none' type="password" name='password'
                            value={form.password} required onChange={handleChange} placeholder='Password' />
                    </div>
                    {error && (
                        <p className="text-red-700 text-xl text-center">
                            {error}
                        </p>
                    )}
                    <div className='flex justify-center mt-2'>
                        <button type='submit' className='w-[70%] px-7 py-3 bg-[#00263A] 
                        text-center text-white font-semibold text-md inter-font my-2 cursor-pointer'>Login</button>
                    </div>
                    <div className='flex items-center justify-center px-7 py-3 '>
                        <p className='px-1'>Don't Have Account ?</p><a className='text-orange-400 underline text-md font-normal' href="/get-started">SignUp</a>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
