import { Route, Navigate, Routes } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const ProtectedRoute = ({ path, element }) => {
    const { isLoggedIn } = UserAuth();

    return isLoggedIn ? (
        <Routes>
            <Route path={path} element={element} />{' '}
        </Routes>
    ) : (
        <Navigate to="/auth/signin" />
    );
};

export default ProtectedRoute;
