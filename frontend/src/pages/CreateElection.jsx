import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'

const CreateElection = () => {
    const navigate = useNavigate()
    const { token } = useAuth()

    const [form, setForm] = useState({
        title: '',
        description: '',
        type: 'election',
        startDate: '',
        endDate: '',
        status: 'draft'
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setError('')

        // Basic validation
        if (form.endDate <= form.startDate) {
            setError('End date must be after start date')
            return
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
            const data = await res.json()
            if (!res.ok) {
                setError(data.message || 'Failed to create election')
                setLoading(false)
                return
            }
            navigate('/dashboard')
        } catch (err) {
            setError('Could not connect to server.')
            setLoading(false)
        }
    }

    return (
        <div className='flex items-center justify-center px-4 py-10 bg-[#FAFAFA] min-h-[80vh]'>
            <div className='w-full max-w-xl bg-white border border-gray-200 px-10 py-8'>

                <h1 className='inter-font text-[32px] font-semibold text-[#262D34] mb-1'>
                    Create New Election
                </h1>
                <p className='text-[16px] text-[#262D3A] mb-6.25'>
                    Fill in the details below to set up your election
                </p>

                {error && (
                    <div className='bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 inter-font mb-6'>
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmitHandler} className='flex flex-col gap-5'>

                    {/* Title */}
                    <div className='flex flex-col gap-1.5'>
                        <label className='text-[16px] text-[#262D3A] mb-1 inter-font font-semibold'>
                            Election Name <span className='text-[#F28A36]'>*</span>
                        </label>
                        <input
                            className='w-full px-4 py-3 bg-[#F3F7FE] outline-none'
                            type='text'
                            name='title'
                            value={form.title}
                            onChange={handleChange}
                            placeholder='e.g. Board of Directors Election 2026'
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className='flex flex-col gap-1.5'>
                        <label className='text-[16px] text-[#262D3A] mb-1 inter-font font-semibold'>
                            Description <span className='text-gray-400 font-normal'>(optional)</span>
                        </label>
                        <textarea
                            className='w-full px-4 py-3 bg-[#F3F7FE] outline-none resize-none'
                            name='description'
                            rows={3}
                            value={form.description}
                            onChange={handleChange}
                            placeholder='Brief description of this election...'
                        />
                    </div>

                    {/* Type */}
                    <div className='flex flex-col gap-1.5'>
                        <label className='text-[16px] text-[#262D3A] mb-1 inter-font font-semibold'>
                            Election Type <span className='text-[#F28A36]'>*</span>
                        </label>
                        <div className='flex gap-3'>
                            {[
                                { value: 'election', label: 'Election' },
                                { value: 'poll', label: 'Poll' },
                                { value: 'meeting-vote', label: 'Meeting Vote' },
                            ].map(opt => (
                                <label key={opt.value}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 cursor-pointer inter-font text-sm font-semibold transition-all duration-200
                                        ${form.type === opt.value
                                            ? 'border-[#F28A36] bg-orange-50 text-[#F28A36]'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                                    <input
                                        type='radio'
                                        name='type'
                                        value={opt.value}
                                        checked={form.type === opt.value}
                                        onChange={handleChange}
                                        className='hidden'
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Dates */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-[16px] text-[#262D3A] mb-1 inter-font font-semibold'>
                                Start Date <span className='text-[#F28A36]'>*</span>
                            </label>
                            <input
                                className='w-full px-4 py-3 bg-[#F3F7FE] outline-none'
                                type='datetime-local'
                                name='startDate'
                                value={form.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-[16px] text-[#262D3A] mb-1 inter-font font-semibold'>
                                End Date <span className='text-[#F28A36]'>*</span>
                            </label>
                            <input
                                className='w-full px-4 py-3 bg-[#F3F7FE] outline-none'
                                type='datetime-local'
                                name='endDate'
                                value={form.endDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className='flex flex-col gap-1.5'>
                        <label className='text-[16px] text-[#262D3A] mb-1 inter-font font-semibold'>
                            Save as
                        </label>
                        <div className='flex gap-3'>
                            {[
                                { value: 'draft', label: '📝 Draft', desc: 'Save and activate later' },
                                { value: 'active', label: '🚀 Active', desc: 'Open for voting now' },
                            ].map(opt => (
                                <label key={opt.value}
                                    className={`flex-1 px-4 py-3 border-2 cursor-pointer transition-all duration-200
                                        ${form.status === opt.value
                                            ? 'border-[#00263A] bg-[#00263A]/5'
                                            : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input
                                        type='radio'
                                        name='status'
                                        value={opt.value}
                                        checked={form.status === opt.value}
                                        onChange={handleChange}
                                        className='hidden'
                                    />
                                    <p className={`inter-font text-sm font-semibold ${form.status === opt.value ? 'text-[#00263A]' : 'text-gray-500'}`}>
                                        {opt.label}
                                    </p>
                                    <p className='inter-font text-xs text-gray-400 mt-0.5'>{opt.desc}</p>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className='flex gap-3 pt-2'>
                        <button
                            type='button'
                            onClick={() => navigate('/dashboard')}
                            className='w-[50%] px-7 py-3 text-[#262D3A] bg-gray-200 font-semibold text-md inter-font my-2 rounded-md flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-300 transition'>
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={loading}
                            className={`w-[50%] px-7 py-3 text-white font-semibold text-md inter-font my-2 rounded-md flex items-center justify-center gap-2
                            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#00263A] cursor-pointer hover:bg-[#001a28] transition"}`}>
                            {loading ? 'Creating...' : 'Create Election'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default CreateElection