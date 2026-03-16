import { Navigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'

const ProtectRoute = ({ children }) => {

    const { user, token } = useAuth()
    if (!user || !token) {
        return <Navigate to='/login' replace></Navigate>
    }
    return children
}

export default ProtectRoute
