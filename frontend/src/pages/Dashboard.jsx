import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/EB_logo.svg'
import { useAuth } from '../Context/AuthContext'

const StatusBadge = ({ status }) => {
    const styles = {
        draft: 'bg-gray-100 text-gray-500',
        active: 'bg-green-100 text-green-700',
        closed: 'bg-red-100 text-red-700'
    }
    return (
        <span className={`inter-font text-xs font-semibold px-3 py-1 rounded-full capitalize ${styles[status] || styles.draft}`}>
            {status || 'draft'}
        </span>
    )
}

const ElectionCard = ({ election, onDelete }) => {
    const format = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

    return (
        <div className='bg-white border border-gray-200 px-6 py-4 flex items-center justify-between hover:shadow-md hover:border-[#F28A36]/40 transition-all duration-200'>
            <div className='flex flex-col gap-1'>
                <h3 className='inter-font text-[#00263A] font-semibold text-base'>{election.title}</h3>
                {election.description && (
                    <p className='inter-font text-gray-400 text-xs max-w-md truncate'>{election.description}</p>
                )}
                <p className='inter-font text-gray-400 text-xs'>
                    {format(election.startDate)} — {format(election.endDate)}
                </p>
            </div>
            <div className='flex items-center gap-5 shrink-0'>
                <StatusBadge status={election.status} />
                <button className='inter-font text-sm text-gray-400 hover:text-[#F28A36] cursor-pointer transition'>
                    View
                </button>
                <button
                    onClick={() => onDelete(election._id)}
                    className='inter-font text-sm text-gray-400 hover:text-red-400 cursor-pointer transition'>
                    Delete
                </button>
            </div>
        </div>
    )
}

const Dashboard = () => {
    const [accountOpen, setAccountOpen] = useState(false)
    const [elections, setElections] = useState([])
    const [loading, setLoading] = useState(true)
    const { user, logout, token } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/elections', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const data = await res.json()
                setElections(Array.isArray(data) ? data : [])
            } catch (error) {
                console.log('Failed to fetch Election', error);
            } finally {
                setLoading(false)
            }
        }
        fetchElections()
    }, [token])

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this election?')) return
        try {
            await fetch(`http://localhost:4000/api/elections/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })
            setElections(prev => prev.filter(e => e._id !== id))
        } catch (error) {
            console.log('Delete Failed', error)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <div className='min-h-screen flex flex-col bg-white'>

            {/* ── Navbar ── */}
            <nav className='w-full bg-white border-b border-gray-200 px-8 h-20 flex items-center justify-between'>

                {/* Left — Logo + email */}
                <div className='flex items-center gap-3'>
                    <img src={logo} alt='logo' className='h-15 w-60' />
                    <span className='text-xl  text-black'>{user?.email}</span>
                </div>

                {/* Right — Bell, Dashboard, Help, Account, + New */}
                <div className='flex items-center gap-6'>

                    {/* Bell */}
                    <button className='text-gray-500 hover:text-gray-800 transition'>
                        <svg width='25' height='25' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                            <path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' />
                            <path d='M13.73 21a2 2 0 0 1-3.46 0' />
                        </svg>
                    </button>

                    {/* Dashboard */}
                    <span className='text-[#F28A36] font-semibold text-md border-b-2 border-[#F28A36] pb-0.5 cursor-pointer'>
                        Dashboard
                    </span>

                    {/* Help */}
                    <span className='text-gray-600 text-md cursor-pointer hover:text-gray-900 transition'>
                        Help
                    </span>

                    {/* Account dropdown */}
                    <div className='relative'>
                        <button
                            onClick={() => setAccountOpen(o => !o)}
                            className='flex items-center gap-1 text-gray-600 text-md hover:text-gray-900 transition'
                        >
                            Account
                            <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                                <polyline points='6 9 12 15 18 9' />
                            </svg>
                        </button>

                        {accountOpen && (
                            <div className='absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg min-w-36 overflow-hidden z-50'>
                                {/* {['Profile', 'Settings', 'Billing'].map(item => (
                                    <div key={item} className='px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer'>
                                        {item}
                                    </div>
                                ))} */}
                                <div
                                    onClick={handleLogout}
                                    className='px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 cursor-pointer border-t border-gray-100'
                                >
                                    Sign Out
                                </div>
                            </div>
                        )}
                    </div>

                    {/* + New */}
                    <NavLink
                        to='/create-election'
                        className='flex items-center gap-1 bg-[#F28A36] text-white text-xl font-bold px-5 py-2 rounded-md hover:bg-orange-500 transition duration-200'
                    >
                        + New
                    </NavLink>
                </div>
            </nav>

            {/* ── Empty State ── */}
            <main className='flex-1 bg-[#FAFAFA]'>

                {loading ? (
                    <div className='flex items-center justify-center h-80'>
                        <p className='inter-font text-gray-400 text-sm'>Loading elections...</p>
                    </div>
                ) : elections.length === 0 ? (
                    <div className='flex flex-col items-center justify-center h-80 gap-4'>
                        <svg width='100' height='86' viewBox='0 0 120 100' fill='none'>
                            <rect x='10' y='20' width='100' height='70' rx='6' fill='#F5F7FA' stroke='#E2E8F0' strokeWidth='1.5' />
                            <rect x='20' y='32' width='60' height='6' rx='3' fill='#E2E8F0' />
                            <rect x='20' y='44' width='40' height='5' rx='2.5' fill='#EDF0F5' />
                            <rect x='20' y='54' width='50' height='5' rx='2.5' fill='#EDF0F5' />
                            <circle cx='95' cy='25' r='14' fill='#FFF4E8' stroke='#F28A36' strokeWidth='1.5' />
                            <text x='95' y='30' textAnchor='middle' fontSize='14' fill='#F28A36' fontWeight='bold'>+</text>
                        </svg>
                        <p className='inter-font text-[#1F2937] font-bold text-xl text-center'>
                            There are no elections in your account.
                        </p>
                        <p className='inter-font text-[#1F2937] text-lg text-center'>
                            <NavLink to='/create-election'
                                className='text-[#F28A36] font-bold underline underline-offset-2 hover:text-orange-500'>
                                Create New
                            </NavLink>
                            {' '}to get started
                        </p>
                    </div>

                ) : (
                    <div className='max-w-4xl mx-auto px-8 py-10'>
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='varela-font text-[#00263A] font-bold text-xl'>Your Elections</h2>
                            <span className='inter-font text-sm text-gray-400'>
                                {elections.length} election{elections.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className='flex flex-col gap-3'>
                            {elections.map(e => (
                                <ElectionCard key={e._id} election={e} onDelete={handleDelete} />
                            ))}
                        </div>
                    </div>
                )}

            </main>

        </div>
    )
}

export default Dashboard