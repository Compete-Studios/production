import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { showErrorMessage } from '../functions/shared';

export default function Error() {
    const { isLoggedIn }: any = UserAuth();

    const navigate = useNavigate();

    const handleCheckLogin = () => {
        if (isLoggedIn) {
            showErrorMessage('Something went wrong');
            navigate('/dashboard');
        } else {
            navigate('/login');
            showErrorMessage('Something went wrong');
        }
    };

    useEffect(() => {
        handleCheckLogin();
    }, []);

    return <div>Error</div>;
}
