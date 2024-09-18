import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconSearch from '../../components/Icon/IconSearch';
import { UserAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { REACT_API_BASE_URL } from '../../constants';
import { convertPhone, hashTheID, showErrorMessage } from '../../functions/shared';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import { setStudioAsMaster, addStudioToItselfAsAMaster, addStudioToMasterStudioRoster } from '../../functions/api';

const SetMasterStudio = () => {
    //const { suid }: any = UserAuth();
    const [studios, setStudios] = useState<any>([]);
    const [showLoading, setShowLoading] = useState(false);
    const [masterStudio, setMasterStudio] = useState<any>(null);
    const [subStudios, setSubStudios] = useState<any>([]);
    const [search, setSearch] = useState<any>('');
    const [filteredItems, setFilteredItems] = useState<any>(studios);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Studios'));
    }, [dispatch]);

    useEffect(() => {
        setShowLoading(true);
        const role = "User";
        fetch(`${REACT_API_BASE_URL}/admin-tools/getStudiosByRole/${role}`)
            .then((response) => response.json())
            .then((json) => {
                setStudios(json.recordset);
                setFilteredItems(json.recordset);
                setShowLoading(false);
            });
    }, []);

    useEffect(() => {
        setFilteredItems(studios.filter((item: any) => {
            return item.Studio_Name.toLowerCase().includes(search.toLowerCase()) ||
                item.Contact_Email.toLowerCase().includes(search.toLowerCase()) ||
                item.Contact_Number.toLowerCase().includes(search.toLowerCase());
        }));
    }, [search, studios]);

    const handleSelectMasterStudio = (studio: any) => {
        setMasterStudio(studio);
        setSubStudios([]);
    };

    const handleCheckboxChange = (studioId: any) => {
        setSubStudios((prevSubStudios: any) => {
            if (prevSubStudios.includes(studioId)) {
                return prevSubStudios.filter((id: any) => id !== studioId);
            } else {
                return [...prevSubStudios, studioId];
            }
        });
    };

    const handleSubmit = async () => {
        if (masterStudio) {
            try{
                //Set this studio as the master studio
                console.log('BEGIN Setting Master Studio:', masterStudio.Studio_Id);
                await setStudioAsMaster(masterStudio.Studio_Id);
                //Confusingly, a master studio needs to be added to itself as a sub-studio
                await addStudioToItselfAsAMaster(masterStudio.Studio_Id);
                //Add the selected sub-studios to the master studio
                for (const studioId of subStudios) {
                    const result = await addStudioToMasterStudioRoster(masterStudio.Studio_Id, studioId);
                 
                }
                showMessage(`${masterStudio.Studio_Name} has been designated as the master studio. The selected Sub-studios have been added to it successfully.`);
            }catch(error){
                console.error('Failed to set Master Studio:', error);
                showErrorMessage(`Failed to set Master Studio. Error: ${(error as Error).message}`);
            }
            
        } else {
            showErrorMessage('Please select a master studio first.');
        }
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
            {!masterStudio && (
                <div>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h2 className="text-xl">Select a studio to designate it as a Master Studio</h2>
                        </div>
                        <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
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
                                        <th className="!text-center">Select</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems?.map((studio: any) => (
                                        <tr key={studio.Studio_Id}>
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <div>{studio.Studio_Name}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => handleSelectMasterStudio(studio)}
                                                    >
                                                        Select
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            {masterStudio && (
                <div>
                    <h2 className="text-xl">Check all studios that should be sub-studios of <span className="text-lg font-bold text-blue-500">{masterStudio?.Studio_Name}</span></h2>
                    <div className="flex justify-between mt-4">
                        <button type="button" className="btn btn-secondary" onClick={() => setMasterStudio(null)}>
                            Back
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                    <div className="relative mt-4">
                        <input type="text" placeholder="Search Studios" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                    <div className="mt-5 panel p-0 border-0 overflow-hidden">
                        <div className="table-responsive">
                            <table className="table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th className="!text-center">Select</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems?.filter((studio: any) => studio.Studio_Id !== masterStudio.Studio_Id).map((studio: any) => (
                                        <tr key={studio.Studio_Id}>
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <div>{studio.Studio_Name}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={subStudios.includes(studio.Studio_Id)}
                                                        onChange={() => handleCheckboxChange(studio.Studio_Id)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SetMasterStudio;
