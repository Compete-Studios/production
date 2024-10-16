import { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { deleteForm, getUserFormsByStudioId } from '../../functions/api';
import { showWarningMessage } from '../../functions/shared';
import { Loader } from '@mantine/core';
import { REACT_BASE_URL } from '../../constants';
import { deleteFormFromFirebase } from '../../firebase/firebaseFunctions';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconEye from '../../components/Icon/IconEye';
import IconNotesEdit from '../../components/Icon/IconNotesEdit';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import ViewFormIFrame from './ViewFormIFrame';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconBarChart from '../../components/Icon/IconBarChart';

export default function CaptureForms() {
    const { suid }: any = UserAuth();
    const [fbForms, setFBForms] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [forms, setForms] = useState([]);
    const [update, setUpdate] = useState(false);
    const [matchedFormIds, setMatchedFormIds] = useState<any>([]);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Capture Forms'));
    });

    const handleReturnCSS = (submissions: any, loads: any) => {
        if (submissions && loads) {
            if ((submissions / loads) * 100 >= 10) {
                return 'text-success font-bold md:table-cell hidden';
            } else  if ((submissions / loads) * 100 >= 2) {
                return 'text-warning font-bold md:table-cell hidden';
            } else {
                return 'font-bold md:table-cell hidden';
            }
        } else {
            return 'text-red-200 md:table-cell hidden';
        }
    };

    const getFromsFromFirebaseWithStudioID = async (suid: any) => {
        try {
            // Convert suid to both a string and a number for querying
            const idAsString = suid.toString();
            const idAsNumber = typeof suid === 'number' ? suid : parseInt(suid);
    
            // Check if conversion to number is NaN, and create queries based on type
            const qString = query(collection(db, 'forms'), where('studioID', '==', idAsString));
            const qNumber = !isNaN(idAsNumber) ? query(collection(db, 'forms'), where('studioID', '==', idAsNumber)) : null;
    
            // Execute the string query
            const querySnapshotString = await getDocs(qString);
            const forms: any[] = [];
    
            querySnapshotString.forEach((doc: any) => {
                const dacData = {
                    id: doc.id,
                    ...doc.data(),
                };
                forms.push(dacData);
            });
    
            // If there's also a number variant of the ID, run that query and merge results
            if (qNumber) {
                const querySnapshotNumber = await getDocs(qNumber);
                querySnapshotNumber.forEach((doc: any) => {
                    const dacData = {
                        id: doc.id,
                        ...doc.data(),
                    };
                    // Prevent duplicates (if both string and number match the same form)
                    if (!forms.some((form) => form.id === dacData.id)) {
                        forms.push(dacData);
                    }
                });
            }
    
            setFBForms(forms);
    
            // Handle form IDs
            const formsWithIDs = forms.map((form: any) => {
                const formID = parseInt(form.oldFormID);
                return isNaN(formID) ? form.oldFormID : formID;
            });
    
            setMatchedFormIds(formsWithIDs);
        } catch (error) {
            console.error('Error getting documents: ', error);
        }
    };
    
    useEffect(() => {
        setLoading(true);
        try {
            getFromsFromFirebaseWithStudioID(suid);
            getUserFormsByStudioId(suid).then((data) => {
                setForms(data.recordset);
                setLoading(false);
            });
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [suid, update]);

    const handlePreview = (id: any) => {
        window.open(`${REACT_BASE_URL}form/${id}`, '_blank');
    };

    const handleDeleteOldForm = (id: any) => {
        showWarningMessage('Are you sure you want to delete this form?', 'Remove Form', 'Your Form has been removed successfully')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    deleteForm(id).then((response: any) => {
                        console.log(response);
                        if (response) {
                            setUpdate(!update);
                        } else {
                            console.error('Failed to delete form');
                        }
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

    const handleDeleteForm = (id: any) => {
        showWarningMessage('Are you sure you want to delete this form?', 'Remove Form', 'Your Form has been removed successfully')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    deleteFormFromFirebase(id).then((response: any) => {
                        console.log(response);
                        if (response) {
                            setUpdate(!update);
                        } else {
                            console.error('Failed to delete form');
                        }
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
        <>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">Capture Forms</h1>
                        <p className="text-sm text-gray-700">Here&apos;s a list of all your forms</p>
                    </div>

                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Link to="/marketing/create-capture-form" type="button" className="btn btn-primary">
                            Create a New Form
                        </Link>
                    </div>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <Loader color="blue" />;
                    </div>
                ) : (
                    <div className="mt-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th>Form Name</th>
                                                <th className='md:table-cell hidden'>
                                                    Form Submissions
                                                </th>
                                                <th className='md:table-cell hidden'>
                                                    Form Loads
                                                </th>
                                                <th className='md:table-cell hidden'>
                                                    Submit Percentage
                                                </th>
                                                <th >
                                                    <span className="sr-only">Delete</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {fbForms?.map((list: any) => (
                                                <tr key={list.id}>
                                                    <td>{list.formName}</td>
                                                   

                                                    <td className={`${list.submissions ? "font-bold" : "text-red-200"} md:table-cell hidden`}>
                                                       {list.submissions || 0}
                                                    </td>
                                                    <td className={`${list.loads ? "font-bold" : "text-red-200"} md:table-cell hidden`}>
                                                        {list.loads || 0}
                                                    </td>
                                                    <td className={handleReturnCSS(list.submissions, list.loads)}>
                                                        {(list.loads && list.submissions) ? `${((list.submissions / list.loads) * 100)?.toFixed(1)}%` : '0%'}
                                                    </td>
                                                    <td className="flex items-center justify-end gap-2">
                                                   
                                                    <ViewFormIFrame formList={list} />
                                                   
                                                            <button className="btn btn-sm btn-info hover:bg-blue-800 gap-1" onClick={() => handlePreview(list.id)}>
                                                                <IconEye /> Preview
                                                            </button>
                                                        {/* <Tippy content="View Stats">
                                                        <Link to={`/marketing/capture-forms/stats/${list.id}`} className="text-info hover:text-blue-800 ">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bar-chart-line" viewBox="0 0 16 16">
                                                                <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z" />
                                                            </svg>
                                                        </Link>
                                                        </Tippy> */}
                                                            <Link to={`/marketing/capture-forms/edit/${list.id}`} className="btn btn-sm btn-success hover:bg-green-800 gap-1">
                                                                <IconNotesEdit /> Edit
                                                            </Link><Link to={`/marketing/capture-forms/stats/${list.id}`} className="btn btn-sm btn-warning hover:bg-yellow-800 gap-1">
                                                                <IconBarChart /> Stats
                                                            </Link>
                                                            <button className="text-danger hover:text-red-800" onClick={() => handleDeleteForm(list.id)}>
                                                                <IconTrashLines />
                                                            </button>
                                                    </td>
                                                </tr>
                                            ))}

                                            {forms?.map((list: any) => (
                                                <tr key={list.FormId} className={`${matchedFormIds.includes(parseInt(list.FormId)) ? 'bg-danger text-white' : 'bg-cs'}`}>
                                                    <td>{list.FriendlyName}</td>
                                                    <td>
                                                        {/* <button className="text-primary hover:text-primary/70" onClick={() => copyToClipboard(list.IFrameHTML)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-code-slash" viewBox="0 0 16 16">
                                                                    <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0" />
                                                                </svg>
                                                            </button> */}
                                                    </td>

                                                    <td colSpan={5} className="text-right">
                                                        {matchedFormIds.includes(parseInt(list.FormId)) ? (
                                                            <div className="flex items-center justify-end text-white">
                                                                <div>This form is a legacy form. Please update your site with the new form you created</div>
                                                                <button
                                                                    className="btn btn-danger hover:bg-red-700 border outline outline-1 outline-white btn-sm ml-2 flex items-center gap-1"
                                                                    onClick={() => handleDeleteOldForm(list.FormId)}
                                                                >
                                                                    <IconTrashLines />
                                                                    Delete Form
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-end">
                                                                <div className="text-warning"></div>
                                                                <Link to={`/marketing/legacy/capture-forms/${list.FormId}`} className="text-info hover:text-blue-900 ml-2">
                                                                    {' '}
                                                                    Please update this form to the new version by clicking here
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
