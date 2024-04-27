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
import { getProspectsByProgramId, getStudentsByProgramId } from '../../functions/api';
import { UserAuth } from '../../context/AuthContext';
import IconSend from '../../components/Icon/IconSend';
import IconPrinter from '../../components/Icon/IconPrinter';
import IconMessage from '../../components/Icon/IconMessage';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';

const ViewProgramRoster = () => {
    const { suid }: any = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Contacts'));
    });
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [studentRoster, setStudentRoster] = useState<any>([]);
    const [prospectRoster, setProspectRoster] = useState<any>([]);

    const [value, setValue] = useState<any>('list');
    const [defaultParams] = useState({
        id: null,
        name: '',
        email: '',
        phone: '',
        role: '',
        location: '',
    });

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));

    const { prID, uid } = useParams<any>();

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const [search, setSearch] = useState<any>('');

    useEffect(() => {
        try {
            if (suid === uid) {
              getStudentsByProgramId(prID).then((res) => {
                    setStudentRoster(res.recordset);
                });
                getProspectsByProgramId(prID).then((res) => {
                    setProspectRoster(res.recordset);
                });
            } else {
                setStudentRoster([]);
            }
        } catch (error) {
            console.error(error);
        }
    }, [prID, suid, uid]);

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


   

   


    return (
        <> <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
            <Link to="/classes/view-classes" className="text-primary hover:underline">
                View Classes
            </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span>Class</span>
        </li>
    </ul>
            <div>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-xl">Students Enrolled</h2>
                    <div>
                        <div className="flex sm:flex-row flex-col sm:items-center justify-end sm:gap-3 gap-4 w-full sm:w-auto">
                            <div className="relative">
                                <input type="text" placeholder="Search Students" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search} onChange={(e) => setSearch(e.target.value)} />
                                <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                                    <IconSearch className="mx-auto" />
                                </button>
                            </div>
                        </div>
                        <div className="flex sm:flex-row flex-col sm:items-center justify-end sm:gap-3 gap-4 w-full sm:w-auto mt-3">
                            <button type="button" className="btn btn-primary">
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Add Student
                            </button>

                            <button type="button" className="btn btn-secondary">
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Add Prospect
                            </button>

                            <button type="button" className="btn btn-info gap-2">
                                <IconSend />
                                Email Class
                            </button>
                            <button type="button" className="btn btn-success gap-2">
                                <IconPrinter />
                                Print Roster
                            </button>

                            <Link to="/apps/invoice/add" className="btn btn-dark gap-2">
                                <IconMessage />
                                Text CLass
                            </Link>

                            <Link to="/apps/invoice/edit" className="btn btn-warning gap-2">
                                <IconDollarSignCircle />
                                Bulk Pay
                            </Link>
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
                                                    <button type="button" className="btn btn-sm btn-outline-primary" >
                                                        Info
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger" >
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

                <Transition appear show={addContactModal} as={Fragment}>
                    <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-[51]">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-[black]/60" />
                        </Transition.Child>
                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center px-4 py-8">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                        <button
                                            type="button"
                                            onClick={() => setAddContactModal(false)}
                                            className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                        >
                                            <IconX />
                                        </button>
                                        <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                            {params.id ? 'Edit Contact' : 'Add Contact'}
                                        </div>
                                        <div className="p-5">
                                            <form>
                                                <div className="mb-5">
                                                    <label htmlFor="name">Name</label>
                                                    <input id="name" type="text" placeholder="Enter Name" className="form-input" value={params.name} onChange={(e) => changeValue(e)} />
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="email">Email</label>
                                                    <input id="email" type="email" placeholder="Enter Email" className="form-input" value={params.email} onChange={(e) => changeValue(e)} />
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="number">Phone Number</label>
                                                    <input id="phone" type="text" placeholder="Enter Phone Number" className="form-input" value={params.phone} onChange={(e) => changeValue(e)} />
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="occupation">Occupation</label>
                                                    <input id="role" type="text" placeholder="Enter Occupation" className="form-input" value={params.role} onChange={(e) => changeValue(e)} />
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="address">Address</label>
                                                    <textarea
                                                        id="location"
                                                        rows={3}
                                                        placeholder="Enter Address"
                                                        className="form-textarea resize-none min-h-[130px]"
                                                        value={params.location}
                                                        onChange={(e) => changeValue(e)}
                                                    ></textarea>
                                                </div>
                                                <div className="flex justify-end items-center mt-8">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                        Cancel
                                                    </button>
                                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                        {params.id ? 'Update' : 'Add'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
            <div className="mt-12">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-xl">Prospects Enrolled</h2>
                </div>
                {value === 'list' && (
                    <div className="mt-5 panel p-0 border-0 overflow-hidden">
                        <div className="table-responsive">
                            <table className="table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>

                                        <th className="!text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProspects?.map((contact: any) => {
                                        return (
                                            <tr key={contact.ProspectId}>
                                                <td>
                                                    <div className="flex items-center w-max">
                                                        <div>{contact.Name}</div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap">{contact.Phone}</td>
                                                <td className="whitespace-nowrap">{contact.email}</td>
                                                <td>
                                                    <div className="flex gap-4 items-center justify-center">
                                                        <button type="button" className="btn btn-sm btn-outline-primary" >
                                                            Info
                                                        </button>
                                                        <button type="button" className="btn btn-sm btn-outline-danger" >
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
                )}

                <Transition appear show={addContactModal} as={Fragment}>
                    <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-[51]">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-[black]/60" />
                        </Transition.Child>
                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center px-4 py-8">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                        <button
                                            type="button"
                                            onClick={() => setAddContactModal(false)}
                                            className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                        >
                                            <IconX />
                                        </button>
                                        <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                            {params.id ? 'Edit Contact' : 'Add Contact'}
                                        </div>
                                        <div className="p-5">
                                            <form>
                                                <div className="mb-5">
                                                    <label htmlFor="name">Name</label>
                                                    <input id="name" type="text" placeholder="Enter Name" className="form-input" value={params.name} onChange={(e) => changeValue(e)} />
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="email">Email</label>
                                                    <input id="email" type="email" placeholder="Enter Email" className="form-input" value={params.email} onChange={(e) => changeValue(e)} />
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="number">Phone Number</label>
                                                    <input id="phone" type="text" placeholder="Enter Phone Number" className="form-input" value={params.phone} onChange={(e) => changeValue(e)} />
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="occupation">Occupation</label>
                                                    <input id="role" type="text" placeholder="Enter Occupation" className="form-input" value={params.role} onChange={(e) => changeValue(e)} />
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="address">Address</label>
                                                    <textarea
                                                        id="location"
                                                        rows={3}
                                                        placeholder="Enter Address"
                                                        className="form-textarea resize-none min-h-[130px]"
                                                        value={params.location}
                                                        onChange={(e) => changeValue(e)}
                                                    ></textarea>
                                                </div>
                                                <div className="flex justify-end items-center mt-8">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                        Cancel
                                                    </button>
                                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" >
                                                        {params.id ? 'Update' : 'Add'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </>
    );
};

export default ViewProgramRoster;
