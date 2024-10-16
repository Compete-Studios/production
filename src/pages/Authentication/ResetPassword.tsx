import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import { UserAuth } from '../../context/AuthContext';
import { emailLogin, login, sendPasswordReset } from '../../firebase/auth';
import IconLockDots from '../../components/Icon/IconLockDots';
import NavBar from '../Home/NavBar';
import Error from './Error';
import IconMail from '../../components/Icon/IconMail';
import { showMessage } from '../../functions/shared';

const ResetPassword = () => {
    const { isLoggedIn }: any = UserAuth();
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [userNameOption, setUserNameOption] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Password Reset'));
    });
    const navigate = useNavigate();

    const submitForm = async (e: any) => {
        e.preventDefault();
        if (email === '') {
            setError(true);
            setErrorMessage('Email is required');
            return;
        } else {
            try {
                await sendPasswordReset(email);
                showMessage('Password reset link has been sent to your email', 'success');
                navigate('/auth/email-sent');
            } catch (error: any) {
                setError(true);
                setErrorMessage(error.message);
            }
        }
    };

    const handleClear = () => {
        setError(false);
        setErrorMessage('');
        setUserName('');
        setPassword('');
    };

    const handleSwitch = (e: any) => {
        e.preventDefault();
        setUserNameOption(!userNameOption);
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        scrollToBottom();
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn]);

    return (
        <div>
            <NavBar />
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center  bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />

                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                        <img src="/assets/images/logodark.png" alt="logo" className="mx-auto max-w-48" />
                        <div className="mx-auto w-full max-w-[440px] mt-12">
                            <div className="mb-10">
                                <h1 className="text-3xl font-bold !leading-snug text-primary md:text-4xl">Password Reset</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your email to reset your password</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={(e) => submitForm(e)}>
                                {error && <Error message={errorMessage} handleClear={handleClear} />}
                                <div>
                                    <label htmlFor="email">
                                        {' '}
                                        <label htmlFor="email">Email</label>
                                    </label>

                                    <div className="relative text-white-dark">
                                        <input
                                            id="email"
                                            type="text"
                                            value={email}
                                            placeholder="Enter Email"
                                            className="form-input ps-10 placeholder:text-white-dark h-12"
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary h-12 !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    Reset Password
                                </button>
                            </form>

                            <div className="text-center dark:text-white mt-12">
                                Don't have an account ?&nbsp;
                                <Link to="/auth/boxed-signup" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                    SIGN UP
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
