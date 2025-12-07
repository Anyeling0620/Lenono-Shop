import type {FC} from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore'


   
// 路由保护

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, redirectTo = '/' }) => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} />
    }
    return <>{children}</>
}

export default ProtectedRoute