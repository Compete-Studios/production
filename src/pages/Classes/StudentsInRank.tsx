import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconSearch from '../../components/Icon/IconSearch';
import IconUser from '../../components/Icon/IconUser';
import IconX from '../../components/Icon/IconX';
import { Link, useParams } from 'react-router-dom';
import { dropStudentFromRank, getProspectsByProgramId, getStudentsByProgramId, getStudentsByRankId } from '../../functions/api';
import { UserAuth } from '../../context/AuthContext';
import IconSend from '../../components/Icon/IconSend';
import IconPrinter from '../../components/Icon/IconPrinter';
import IconMessage from '../../components/Icon/IconMessage';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import { hashTheID, showWarningMessage } from '../../functions/shared';
import AddStudentToRank from './AddStudentToRank';

const StudentsInRank = () => {
    const { suid }: any = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Contacts'));
    });
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [studentRoster, setStudentRoster] = useState<any>([]);
    const [prospectRoster, setProspectRoster] = useState<any>([]);

    const [update, setUpdate] = useState<any>(false);
    const [defaultParams] = useState({
        id: null,
        name: '',
        email: '',
        phone: '',
        role: '',
        location: '',
    });

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));

    const { rkID, uid, name } = useParams<any>();

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const [search, setSearch] = useState<any>('');

    useEffect(() => {
        try {
            if (suid) {
                getStudentsByRankId(rkID).then((res) => {
                    setStudentRoster(res);
                });
            } else {
                setStudentRoster([]);
            }
        } catch (error) {
            console.error(error);
        }
    }, [rkID, suid, uid, update]);

    const [filteredItems, setFilteredItems] = useState<any>(studentRoster);
    const [filteredProspects, setFilteredProspects] = useState<any>(prospectRoster);

    useEffect(() => {
        setFilteredItems(() => {
            return studentRoster?.filter((item: any) => {
                return item.Name.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, studentRoster]);

    useEffect(() => {
        setFilteredProspects(() => {
            return prospectRoster?.filter((item: any) => {
                return item.Name.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, prospectRoster]);

    const handleDropFromRank = (id: any) => {
        showWarningMessage('Are you sure want to remove student from rank?', 'Remove from Rank', 'Your student has been removed')
            .then(async (confirmed: boolean) => {
                if (confirmed) {
                    const dropRes = await dropStudentFromRank(id, rkID);
                    setUpdate(!update);
                    console.log('dropRes', dropRes);
                } else {
                    // User canceled the action
                    console.log('User canceled');
                }
            })
            .catch((error) => {
                // Handle error if any
                console.error('Error:', error);
            });
    };

    return (
        <>
            {' '}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/classes/ranks" className="text-primary hover:underline">
                        View Ranks
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>{name}</span>
                </li>
            </ul>
            <div>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-xl">
                        Students in <span className="font-bold text-primary">{name}</span> Rank
                    </h2>
                    <div>
                        <div className="flex items-center"></div>

                        <div className="flex sm:flex-row flex-col sm:items-center justify-end sm:gap-3 gap-4 w-full sm:w-auto mt-3">
                            <input type="text" placeholder="Search Students" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search} onChange={(e) => setSearch(e.target.value)} />
                            <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary ">
                         
                            </button>
                            <div className="w-full">
                                <AddStudentToRank rkID={rkID} studentRoster={studentRoster} update={update} setUpdate={setUpdate} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>

                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems?.map((contact: any) => {
                                    return (
                                        <tr key={contact.Student_ID}>
                                            <td>
                                                <div className="flex items-center w-max">
                                                    {/* {contact.path && (
                                                        <div className="w-max">
                                                            <img src={`/assets/images/${contact.path}`} className="h-8 w-8 rounded-full object-cover ltr:mr-2 rtl:ml-2" alt="avatar" />
                                                        </div>
                                                    )} */}

                                                    {!contact.path && !contact.Name && (
                                                        <div className="border border-gray-300 dark:border-gray-800 rounded-full p-2 ltr:mr-2 rtl:ml-2">
                                                            <IconUser className="w-4.5 h-4.5" />
                                                        </div>
                                                    )}
                                                    <div>{contact.Name}</div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap">{contact.Phone}</td>
                                            <td>{contact.email}</td>

                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <Link to={`/students/view-student/${hashTheID(contact.Student_ID)}/${hashTheID(suid)}`} type="button" className="btn btn-sm btn-outline-primary">
                                                        Info
                                                    </Link>
                                                    <button type="button" className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDropFromRank(contact.Student_ID)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentsInRank;
