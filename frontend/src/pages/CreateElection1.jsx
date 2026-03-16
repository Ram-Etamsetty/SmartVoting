import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'


const CreateElection1 = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        title: '',
        description: '',
        type: 'election',
        startDate: '',
        endDate: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { token } = useAuth()

    const handleHange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault('')
        setError('')
        if (form.endDate <= form.startDate) {
            setError("End Date Must be After Start Date")
            return;
        }
        setLoading(true)
        try {
            const res = await fetch('http://localhost:4000/api/elections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            })
            const data = res.json()
            if (!res.ok) {
                setError('Failed to create Election')
                setLoading(false)
                return
            }
            navigate('/dashboard')
        } catch (error) {
            setError("Couldn't Connect to Server")
            setLoading(false)
        }
    }
    return (
        <div className='flex items-center justify-center px-4 py-10 min-h-[80vh] bg-[#FAFAFA]'>
            <div className='w-full bg-white border max-w-xl px-10 py-8'>
                <h1 className='varela-font mb-1 font-extrabold text-[#00263A] text-3xl'>Create New Election</h1>
                <p className='inter-font text-gray-500 text-sm mb-8'>Fill in the details to setup your election</p>
                <form onSubmit={onSubmitHandler} className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-1.5'>
                        <label className='inter-font text-sm font-semibold text-[#262D3A]'>Election Name
                            <span className='text-orange-400'>*</span>
                        </label>
                        <input type="text"
                            name="title"
                            placeholder='e.g. CR Elections'
                            value={form.title}
                            onChange={handleHange}
                            required
                            className='w-full px-4 py-3 placeholder-gray-400 bg-[#F3F7FE] outline-none inter-font text-[#00263A] border-2 border-transparent rounded-sm  focus:border-[#F28A36] focus:bg-white transition-colors duration-200'
                        />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label className='inter-font text-sm font-semibold text-[#262D3A]'>Description
                            <span className='text-gray-400 ml-1 font-normal'>(Optional)</span>
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleHange}
                            placeholder='Breif Descrptio of the Election ...'
                            rows={3}
                            className='w-full px-4 py-3 resize-none placeholder-gray-400 bg-[#F3F7FE] outline-none inter-font text-[#00263A] border-2 border-transparent rounded-sm focus:border-[#F28A36] focus:bg-white transition-colors duration-200'
                        />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label className='font-semibold text-sm inter-font text-[#262D3A]'>Election Type
                            <span className='text-orange-400'>*</span>
                        </label>
                        <label className={`flex-1 flex items-center gap-2 px-4 py-3 cursor-pointer border-2 inter-font text-sm font-semibold transition-all duration-200
                        ${form.type === 'electionn' ?
                                'border-[#F28A36] bg-orange-50 text-[#F28A36]' :
                                'border-gray-200 text-gray-500'}`}
                        ><input type="radio"
                            name="type"
                            value={form.type}
                            onChange={handleHange}
                            checked={form.type === 'election'}
                            className='hidden' />Election</label>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-sm font-semibold inter-font text-[#262D3A]'>Start Date
                                <span className='text-orange-400'>*</span>
                            </label>
                            <input type="datetime-local"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleHange}
                                required
                                className='w-full px-4 py-3 inter-font text-sm bg-[#F3F7FE] outline-none border-2 rounded-sm border-transparent focus:border-[#F28A36] focus:bg-white transition-colors duration-200'
                            />
                        </div>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-sm font-semibold inter-font text-[#262D3A]'>End Date
                                <span className='text-orange-400'>*</span>
                            </label>
                            <input type="datetime-local"
                                name="endDate"
                                value={form.endDate}
                                onChange={handleHange}
                                required
                                className='w-full px-4 py-3 inter-font text-sm bg-[#F3F7FE] outline-none border-2 rounded-sm border-transparent focus:border-[#F28A36] focus:bg-white transition-colors duration-200'
                            />
                        </div>
                    </div>
                    {/* <div>
                        <p>Save As</p>
                        <div>

                        </div>
                    </div> */}
                    <div className='grid grid-cols-2 gap-4'>
                        <button type='button'
                            onClick={() => navigate('/dashboard')}
                            disabled={loading}
                            className='flex-1 px-6 py-3 border-2 border-gray-200 text-gray-500 inter-font font-semibold rounded-sm hover:border-[#0026#A] transition duration-300 cursor-pointer'>Cancel</button>
                        <button type='submit' className='flex-1 px-6 py-3 inter-font font-semibold bg-[#00263A] border-2 text-white rounded-sm hover:bg-[#F28A36] transition duration-300 disabled:opacity-50 cursor-pointer'>
                            {loading ? 'Creating ...' : 'Create Election'}</button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default CreateElection1
