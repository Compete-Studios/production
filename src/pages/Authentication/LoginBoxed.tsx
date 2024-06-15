import { Link, useNavigate } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, Fragment } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { UserAuth } from '../../context/AuthContext';
import { emailLogin, login } from '../../firebase/auth';
import IconLockDots from '../../components/Icon/IconLockDots';
import NavBar from '../Home/NavBar';
import Error from './Error';
import IconMail from '../../components/Icon/IconMail';

const LoginBoxed = () => {
    const { isLoggedIn }: any = UserAuth();
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [userNameOption, setUserNameOption] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [rememberCrudentials, setRememberCrudentials] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Login Boxed'));
    });
    const navigate = useNavigate();

    const submitForm = async (e: any) => {
        e.preventDefault();
        let response = null;
        if (selectedIndex === 1) {
            response = await login(userName, password);
            if (rememberCrudentials) {
                const data = {
                    username: userName,
                    email: email,
                    remember: rememberCrudentials,
                };
                localStorage.setItem('loginData', JSON.stringify(data));
            }
        } else {
            response = await emailLogin(email, password);
            if (rememberCrudentials) {
                const data = {
                    username: userName,
                    email: email,
                    remember: rememberCrudentials,
                };
                localStorage.setItem('loginData', JSON.stringify(data));
            }
        }
        if (response.error) {
            setError(true);
            setErrorMessage(response.error);
        } else if (parseInt(response) > 0) {
            window.location.href = '/password-reset/' + response;
        } else {
            setError(false);
            setErrorMessage('');
        }
    };

    //get login data from local storage
    useEffect(() => {
        const loginData = localStorage.getItem('loginData');
        if (loginData) {
            const data = JSON.parse(loginData);
            setUserName(data.username);
            setEmail(data.email);
            setPassword(data.password);
            setRememberCrudentials(data.remember);
        }
    }, []);

    const handleClear = () => {
        setError(false);
        setErrorMessage('');
        setUserName('');
        setPassword('');
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
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign in</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your email/username and password to login</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={(e) => submitForm(e)}>
                                {error && <Error message={errorMessage} handleClear={handleClear} />}
                                <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                                    <Tab.List className="mt-3 flex flex-wrap">
                                    <Tab as={Fragment}>
                                            {({ selected }) => (
                                                <button
                                                    className={`${
                                                        selected ? 'text-info !outline-none before:!w-full' : ''
                                                    } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full gap-x-1`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill-lock" viewBox="0 0 16 16">
                                                        <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5v-1a2 2 0 0 1 .01-.2 4.49 4.49 0 0 1 1.534-3.693Q8.844 9.002 8 9c-5 0-6 3-6 4m7 0a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1" />
                                                    </svg>
                                                    Username
                                                </button>
                                            )}
                                        </Tab>
                                        <Tab as={Fragment}>
                                            {({ selected }) => (
                                                <button
                                                    className={`${
                                                        selected ? 'text-info !outline-none before:!w-full' : ''
                                                    } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full gap-x-1`}
                                                >
                                                    <IconMail />
                                                    Email
                                                </button>
                                            )}
                                        </Tab>
                                       
                                    </Tab.List>

                                    <Tab.Panels>
                                       
                                        <Tab.Panel>
                                            <div className="relative text-white-dark">
                                                <input
                                                    id="username"
                                                    type="text"
                                                    value={userName}
                                                    placeholder="Enter Username"
                                                    className="form-input ps-10 placeholder:text-white-dark h-12"
                                                    onChange={(e) => setUserName(e.target.value)}
                                                />
                                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill-lock" viewBox="0 0 16 16">
                                                        <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5v-1a2 2 0 0 1 .01-.2 4.49 4.49 0 0 1 1.534-3.693Q8.844 9.002 8 9c-5 0-6 3-6 4m7 0a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </Tab.Panel>
                                        <Tab.Panel>
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
                                        </Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>

                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Password"
                                            type="password"
                                            value={password}
                                            placeholder="Enter Password"
                                            className="form-input ps-10 placeholder:text-white-dark h-12"
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            checked={rememberCrudentials}
                                            className="form-checkbox bg-white dark:bg-black"
                                            onChange={(e) => setRememberCrudentials(e.target.checked)}
                                        />
                                        <span className="text-white-dark">Remember crudentials</span>
                                    </label>
                                </div>
                                <button type="submit" className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    Sign in
                                </button>
                                <div className="text-center dark:text-white mt-12">
                                    Forgot your password &nbsp;
                                    <Link to="/auth/reset-password" className="uppercase text-danger underline transition hover:text-black dark:hover:text-white">
                                        Reset Password
                                    </Link>
                                </div>
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

export default LoginBoxed;
