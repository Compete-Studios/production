import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import IconSearch from '../components/Icon/IconSearch';
import { UserAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { REACT_API_BASE_URL } from '../constants';
import { convertPhone, hashTheID, showWarningMessage } from '../functions/shared';
import IconUserPlus from '../components/Icon/IconUserPlus';
import { updateStudioIDForAdmimMimic } from '../firebase/firebaseFunctions';
import axios from 'axios';
import { sendPasswordReset } from '../firebase/auth';

const ManageStudioAccounts = () => {
    const { suid, isAdmin }: any = UserAuth();
    const [studios, setStudios] = useState<any>([]);
    const [showLoading, setShowLoading] = useState(false);
    const [activeOnly, setActiveOnly] = useState(true);
    const [allUsers, setAllUsers] = useState<any>([]);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Studios'));
    });

    useEffect(() => {
        setShowLoading(true);
        const role = 'User';
        console.log('BEGIN FETCH STUDIOS');
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${REACT_API_BASE_URL}/admin-tools/fbusers/${role}`);
                setStudios(response.data);
                setShowLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setShowLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const [addContactModal, setAddContactModal] = useState<any>(false);

    const [value, setValue] = useState<any>('list');
    const [defaultParams] = useState({
        id: null,
        Name: '',
        email: '',
        Phone: '',
        role: '',
        location: '',
    });

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));

    const [search, setSearch] = useState<any>('');

    const [filteredItems, setFilteredItems] = useState<any>(studios);

    useEffect(() => {
        setFilteredItems(() => {
            return studios?.filter((item: any) => {
                return (
                    item.Studio_Name.toLowerCase().includes(search.toLowerCase()) ||
                    item.Contact_Email.toLowerCase().includes(search.toLowerCase()) ||
                    item.Contact_Number.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search, studios]);

    const navigate = useNavigate();

    useEffect(() => {
        if (isAdmin) {
            return;
        } else {
            navigate('/dashboard');
        }
    }, [isAdmin]);

    const handleMimic = (id: any) => {
        updateStudioIDForAdmimMimic(id);
        navigate('/dashboard');
    };

    const handleLogAllUsersOut = async (e: any) => {
        e.preventDefault();
        const response = await axios.get(`${REACT_API_BASE_URL}/admin-tools/fbMassLogout`);
        console.log(response);
        if (response.status === 200) {
            Swal.fire('Logged Out', 'All users have been logged out', 'success');
        } else {
            Swal.fire('Error', 'Failed to log all users out', 'error');
        }
    };

    const handleResetPassword = async (email: any) => {
        showWarningMessage('Are you sure you want to send a password reset', 'Sent Reset Link', 'Link Sent Successfully', 'Sent!')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    sendPasswordReset(email).then((response) => {
                        console.log(response);
                    });
                } else {
                    // User canceled the action
                    console.log('User canceled');
                }
            })
            .catch((error: any) => {
                // Handle error if any
                console.error('Error:', error);
            });
    };

    return (
        <div>
            {showLoading && (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#4361ee">
                        <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                            <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="-360 67 67" dur="2.5s" repeatCount="indefinite" />
                        </path>
                        <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                            <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="360 67 67" dur="8s" repeatCount="indefinite" />
                        </path>
                    </svg>
                </div>
            )}
            <div className="">
                <div>
                    <h2 className="text-xl">Studios</h2>
                </div>
                <div className="flex items-center justify-between">
                    <div className="w-96 relative">
                        <input type="text" placeholder="Search Studios" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                    <button type="button" className="btn btn-danger" onClick={(e) => handleLogAllUsersOut(e)}>
                        Log All Users Out
                    </button>
                </div>
            </div>
            <div className="mt-5 panel p-0 border-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="">
                        <thead>
                            <tr>
                                <th>Account Status</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems?.map((contact: any) => {
                                return (
                                    <tr key={contact.Studio_Id}>
                                        <td>{contact?.hasAccount ? <span className="badge bg-success">Has Account</span> : <span className="badge badge-outline-danger">No Account</span>}</td>
                                        <td>
                                            <div className="flex items-center w-max">
                                                <div>{contact.Studio_Name}</div>
                                            </div>
                                        </td>
                                        <td>{contact.Contact_Email}</td>

                                        <td>
                                            {contact?.hasAccount && (<div className="flex gap-4 items-center justify-center">
                                                <button type="button" className="btn btn-sm btn-outline-info" onClick={() => handleResetPassword(contact.Contact_Email)}>
                                                    Reset Password
                                                </button>

                                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleMimic(contact.Studio_Id)}>
                                                    Disable Account
                                                </button>
                                            </div>)}
                                            
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageStudioAccounts;
