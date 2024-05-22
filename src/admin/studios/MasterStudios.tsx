import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconSearch from '../../components/Icon/IconSearch';
import { UserAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { REACT_API_BASE_URL } from '../../constants';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import { getMasterStudios, getSubStudiosForMaster } from '../../functions/api';

const MasterStudios = () => {
    const { isAdmin }: any = UserAuth();
    const [masterStudios, setMasterStudios] = useState<any>([]);
    const [subStudios, setSubStudios] = useState<any>({});
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        setShowLoading(true);
        getStudios();
    }, []);

    const getStudios = async () => {
        try {
            const response = await getMasterStudios();
            const studios = response;
            setMasterStudios(studios);
            fetchSubStudios(studios);
        } catch (error) {
            console.error('Error fetching master studios:', error);
        } finally {
            setShowLoading(false);
        }
    };

    const fetchSubStudios = async (studios: any[]) => {
        const subStudioMap: { [key: string]: any } = {}; 
        for (const studio of studios) {
            try {
                const response = await getSubStudiosForMaster(studio.Studio_Id);
                console.log('Sub studios for master studio:', studio.Studio_Id, response);
                subStudioMap[studio.Studio_Id] = response;
            } catch (error) {
                console.error('Error fetching sub studios for master studio:', studio.Studio_Id, error);
            }
        }
        setSubStudios(subStudioMap);
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Studios'));
    }, [dispatch]);

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
    const [filteredItems, setFilteredItems] = useState<any>(masterStudios);

    useEffect(() => {
        setFilteredItems(() => {
            return masterStudios?.filter((item: any) => {
                return (
                    item.Studio_Name.toLowerCase().includes(search.toLowerCase()) ||
                    item.Contact_Email.toLowerCase().includes(search.toLowerCase()) ||
                    item.Contact_Number.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search, masterStudios]);

    const editUser = (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
        }
        setAddContactModal(true);
    };

    const deleteUser = (user: any = null) => {
        setFilteredItems(filteredItems?.filter((d: any) => d.id !== user.id));
        showMessage('User has been deleted successfully.');
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const navigate = useNavigate();
    
    useEffect(() => {
        if (isAdmin) {
            return;
        } else {
            navigate('/dashboard');
        }
    }, [isAdmin]);

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
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-xl">Master Studios</h2>
                </div>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <Link to="/admin/set-master" type="button" className="btn btn-primary">
                            <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                            Add Master Studio
                        </Link>
                    </div>
                    <div className="relative">
                        <input type="text" placeholder="Search Studios" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-5 panel p-0 border-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Sub Studios</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems?.map((contact: any) => (
                                <tr key={contact.Studio_Id}>
                                    <td>
                                        <div className="flex items-center w-max">
                                            <div>{contact.Studio_Name}</div>
                                        </div>
                                    </td>
                                    <td>
                                        {subStudios[contact.Studio_Id] ? (
                                            <ul>
                                                {subStudios[contact.Studio_Id].map((subStudio: any) => (
                                                    <li key={subStudio.Studio_Id}>{subStudio.Studio_Name}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            'Loading...'
                                        )}
                                    </td>
                                    <td>
                                        <div className="flex gap-4 items-center justify-center">
                                            <Link
                                                to={`/admin/studio-overview/${contact.Studio_Id}`}
                                                type="button"
                                                className="btn btn-sm btn-outline-info"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                to="/admin/mimicStudio"
                                                type="button"
                                                className="btn btn-sm btn-outline-warning"
                                                onClick={() => editUser(contact)}
                                            >
                                                Mimic
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MasterStudios;