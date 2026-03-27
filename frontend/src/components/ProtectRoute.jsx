import { Navigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'

const ProtectRoute = ({ children, allowedRole = 'admin' }) => {

    const { user, token } = useAuth()
    if (!user || !token) {
        return <Navigate to='/login' replace></Navigate>
    }

    if (user.activeSessionRole && user.activeSessionRole !== allowedRole) {
        if (user.activeSessionRole === 'voter') {
            return <Navigate to='/voter-dashboard' replace></Navigate>
        } else {
            return <Navigate to='/dashboard' replace></Navigate>
        }
    }

    return children
}

export default ProtectRoute
