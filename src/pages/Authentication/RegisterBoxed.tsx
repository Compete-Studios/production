import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import { createUser } from '../../firebase/auth';
import NavBar from '../Home/NavBar';

interface User {
    studio_Name: string;
    contact_Name: string;
    contact_Number: string;
    contact_Email: string;
    contact_Address: string;
    contact_City: string;
    contact_State: string;
    contact_Zip: string;
    method_of_Contact: string;
    is_Activated: boolean;
    desired_UserName: string;
    desired_Pswd: string;
    salt: string;
    paysimpleCustomerId: string;
    role: string;
    Studio_Id: string;
    userRole: string;
}

const userInit = {
    studio_Name: '',
    contact_Name: '',
    contact_Number: '',
    contact_Email: '',
    contact_Address: '',
    contact_City: '',
    contact_State: '',
    contact_Zip: '',
    method_of_Contact: '',
    is_Activated: false,
    desired_UserName: '',
    desired_Pswd: '',
    salt: '',
    paysimpleCustomerId: '',
    role: 'User',
    Studio_Id: '',
    userRole: '',
};

const RegisterBoxed = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Register Boxed'));
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<User>(userInit);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');

    useEffect(() => {
        setUserData({
            ...userData,
            contact_Name: `${firstName} ${lastName}`,
        });
    }, [firstName, lastName]);

    const handleCreateUser = (e: any) => {
        e.preventDefault();
        setLoading(true);
        if (userData?.desired_Pswd !== confirmPassword) {
            alert('Passwords do not match');
            setLoading(false);
            return;
        } else {
            createUser(userData?.contact_Email, confirmPassword, userData)
                .then((res) => {
                    if (res.status === 'success') {
                        setLoading(false);
                        window.location.href = '/';
                    } else if (res.error) {
                        setLoading(false);
                        setError(true);
                        setErrorMessage(res.error);
                    } else {
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    console.error('Error creating user:', error); // Log the error
                    // You can handle the error or return a response indicating the failure
                });
        }
    };

    return (
        <>
            <NavBar />
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            {loading && (
                <div className="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-com"></div>
                </div>
            )}
            <div className="relative flex min-h-screen items-center justify-center  bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />

                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                        <img src="/assets/images/logodark.png" alt="logo" className="mx-auto max-w-48" />
                        <div className="mx-auto w-full max-w-[440px] mt-12">
                            <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-4">
                                <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create a new studio account.</h2>
                            </div>

                            <p className="text-center text-sm text-gray-600">
                                Or{' '}
                                <Link to="/login" className="font-medium text-orn hover:text-ornhover">
                                    sign in to your existing account
                                </Link>
                            </p>

                            <div className="mt-6 grid sm:grid-cols-4 grid-cols-1 sm:gap-2">
                                <div className="sm:col-span-4 relative text-white-dark">
                                    <input
                                        type="text"
                                        name="studio-name"
                                        id="studio-name"
                                        className="form-input  placeholder:text-white-dark h-12"
                                        placeholder="Studio Name"
                                        onChange={(e) => setUserData({ ...userData, studio_Name: e.target.value })}
                                    />
                                </div>
                                <div className="sm:col-span-4 mt-2">
                                    <input
                                        type="text"
                                        name="user-name"
                                        id="user-name"
                                        className="form-input  placeholder:text-white-dark h-12"
                                        placeholder="Username"
                                        onChange={(e) => setUserData({ ...userData, desired_UserName: e.target.value })}
                                    />

                                    {error && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
                                </div>
                                <div className="mt-2 sm:col-span-2">
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        className="form-input  placeholder:text-white-dark h-12"
                                        placeholder="First Name"
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="mt-2 sm:col-span-2">
                                    <input
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        className="form-input  placeholder:text-white-dark h-12"
                                        placeholder="Last Name"
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                                <div className="mt-2 sm:col-span-4">
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        className="form-input  placeholder:text-white-dark h-12"
                                        placeholder="Phone Number"
                                        onChange={(e) => setUserData({ ...userData, contact_Number: e.target.value })}
                                    />
                                </div>
                                <div className="mt-2 sm:col-span-4">
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        className="form-input  placeholder:text-white-dark h-12"
                                        placeholder="Address"
                                        onChange={(e) => setUserData({ ...userData, contact_Address: e.target.value })}
                                    />
                                </div>
                                <div className="mt-2 sm:col-span-2">
                                    <input
                                        type="text"
                                        name="city"
                                        id="city"
                                        className="form-input  placeholder:text-white-dark h-12"
                                        placeholder="City"
                                        onChange={(e) => setUserData({ ...userData, contact_City: e.target.value })}
                                    />
                                </div>
                                <div className="mt-2">
                                    <select className="form-select placeholder:text-white-dark h-12" onChange={(e) => setUserData({ ...userData, contact_State: e.target.value })}>
                                        <option value="AL">Alabama</option>
                                        <option value="AK">Alaska</option>
                                        <option value="AZ">Arizona</option>
                                        <option value="AR">Arkansas</option>
                                        <option value="CA">California</option>
                                        <option value="CO">Colorado</option>
                                        <option value="CT">Connecticut</option>
                                        <option value="DE">Delaware</option>
                                        <option value="DC">District Of Columbia</option>
                                        <option value="FL">Florida</option>
                                        <option value="GA">Georgia</option>
                                        <option value="HI">Hawaii</option>
                                        <option value="ID">Idaho</option>
                                        <option value="IL">Illinois</option>
                                        <option value="IN">Indiana</option>
                                        <option value="IA">Iowa</option>
                                        <option value="KS">Kansas</option>
                                        <option value="KY">Kentucky</option>
                                        <option value="LA">Louisiana</option>
                                        <option value="ME">Maine</option>
                                        <option value="MD">Maryland</option>
                                        <option value="MA">Massachusetts</option>
                                        <option value="MI">Michigan</option>
                                        <option value="MN">Minnesota</option>
                                        <option value="MS">Mississippi</option>
                                        <option value="MO">Missouri</option>
                                        <option value="MT">Montana</option>
                                        <option value="NE">Nebraska</option>
                                        <option value="NV">Nevada</option>
                                        <option value="NH">New Hampshire</option>
                                        <option value="NJ">New Jersey</option>
                                        <option value="NM">New Mexico</option>
                                        <option value="NY">New York</option>
                                        <option value="NC">North Carolina</option>
                                        <option value="ND">North Dakota</option>
                                        <option value="OH">Ohio</option>
                                        <option value="OK">Oklahoma</option>
                                        <option value="OR">Oregon</option>
                                        <option value="PA">Pennsylvania</option>
                                        <option value="RI">Rhode Island</option>
                                        <option value="SC">South Carolina</option>
                                        <option value="SD">South Dakota</option>
                                        <option value="TN">Tennessee</option>
                                        <option value="TX">Texas</option>
                                        <option value="UT">Utah</option>
                                        <option value="VT">Vermont</option>
                                        <option value="VA">Virginia</option>
                                        <option value="WA">Washington</option>
                                        <option value="WV">West Virginia</option>
                                        <option value="WI">Wisconsin</option>
                                        <option value="WY">Wyoming</option>
                                    </select>
                                </div>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="zip"
                                        id="zip"
                                        className="form-input  placeholder:text-white-dark h-12"
                                        placeholder="Zip Code"
                                        onChange={(e) => setUserData({ ...userData, contact_Zip: e.target.value })}
                                    />
                                </div>

                                <div className="mt-2 sm:col-span-4">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="form-input  placeholder:text-white-dark h-12"
                                        placeholder="you@email.com"
                                        onChange={(e) => setUserData({ ...userData, contact_Email: e.target.value })}
                                    />
                                </div>
                                <div className="mt-2 sm:col-span-full">
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        className="form-input placeholder:text-white-dark h-12"
                                        placeholder="Password"
                                        onChange={(e) => setUserData({ ...userData, desired_Pswd: e.target.value })}
                                    />
                                </div>
                                <div className="mt-2 sm:col-span-full">
                                    <input
                                        type="password"
                                        name="confirm"
                                        id="confirm"
                                        className="form-input placeholder:text-white-dark h-12"
                                        placeholder="Re-enter password"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <div className="mt-2 sm:col-span-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-full h-12 border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                                        onClick={(e) => handleCreateUser(e)}
                                    >
                                        Create Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterBoxed;
