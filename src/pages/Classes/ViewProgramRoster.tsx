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
import { dropProspectFromProgram, dropStudentFromProgram, getProspectsByProgramId, getStudentsByProgramId } from '../../functions/api';
import { UserAuth } from '../../context/AuthContext';
import IconSend from '../../components/Icon/IconSend';
import IconPrinter from '../../components/Icon/IconPrinter';
import IconMessage from '../../components/Icon/IconMessage';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import EmailClassModal from '../Marketing/EmailClassModal';
import SendBulkText from '../Marketing/SendBulkText';
import { REACT_BASE_URL } from '../../constants';
import AddStudentToProgram from './AddStudenToProgram';
import AddStudentProspectToProgram from './AddStudentProspectToProgram';
import { hashTheID, showWarningMessage } from '../../functions/shared';
import IconEye from '../../components/Icon/IconEye';

const ViewProgramRoster = () => {
    const { suid, programs }: any = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('View Program Roster'));
    });
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [studentRoster, setStudentRoster] = useState<any>([]);
    const [prospectRoster, setProspectRoster] = useState<any>([]);
    const [bulkRecipientsForText, setBulkRecipientsForText] = useState<any>([]);
    const [updatedPrograms, setUpdatedPrograms] = useState<any>(false);

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

    const { prID, uid }: any = useParams<any>();



    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const [search, setSearch] = useState<any>('');

    const programName = programs?.find((program: any) => parseInt(program.ProgramId) === parseInt(prID))?.Name;


    useEffect(() => {
        try {
            if (parseInt(suid) === parseInt(uid)) {
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
    }, [prID, suid, uid, updatedPrograms]);

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

    const handleSetBulk = (studentNumbers: any, prospectNumbers: any) => {
        let bulkRecipients: any = [];
        studentNumbers.map((d: any) => {
            bulkRecipients.push({ phoneNumber: d.Phone, name: d.Name, type: 'student', email: d.email });
        });
        prospectNumbers.map((d: any) => {
            bulkRecipients.push({ phoneNumber: d.Phone, name: d.Name, type: 'prospect', email: d.email });
        });
        setBulkRecipientsForText(bulkRecipients);
    };

    useEffect(() => {
        handleSetBulk(studentRoster, prospectRoster);
    }, [studentRoster, prospectRoster]);

    const handlePrintRoster = (students: any, prospects: any) => {
        const htmlData = tableHTML(students, prospects);
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(htmlData);
            printWindow.document.close();
            printWindow.focus(); // Ensure the new window is focused
            printWindow.print();
        }
    };

    const tableHTML = (students: any, prospects: any) => {
        const htmlForEmail = `<!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Roster</title>
        </head>
        <body style="margin:0px; background: #f8f8f8; ">
            <div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;">
                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #ddd; padding: 8px;">Name</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Phone</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Email</th>
                            <th style="border: 1px solid #ddd; padding: 8px; width: 300px;">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students
                            .map((d: any) => {
                                return `<tr>
                            <td style="border: 1px solid #ddd; padding: 8px; width: 100px">${d.Name}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; width: 100px">${d.Phone}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; width: 100px">${d.email}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; width: 300px;"></td>
                            </tr>`;
                            })
                            .join('')}
                        ${prospects
                            .map((d: any) => {
                                return `<tr>
                            <td style="border: 1px solid #ddd; padding: 8px; width: 100px">${d.Name}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; width: 100px">${d.Phone}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; width: 100px">${d.email}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; width: 300px;"></td>
                            </tr>`;
                            })
                            .join('')}
                    </tbody>
                </table>
            </div>
            <div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px">
                <p>
                    Powered by CompeteStudio.pro <br>
                    <a href="${REACT_BASE_URL}" style="color: #b2b2b5; text-decoration: underline;">Visit Us</a>
                </p>
            </div>
        </body>
        </html>`;
        return htmlForEmail;
    };

    const handleDropStudentFromProgram = (studentId: any) => {
        showWarningMessage('Are you sure you want to remove this student from this program?', 'Remove Student From Program', 'Your student has been removed from the program')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    // User confirmed the action
                    dropStudentFromProgram(prID, studentId).then((response) => {
                        if (response) {
                            setUpdatedPrograms(!updatedPrograms);
                        }
                    });
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

    const handleDropProspectFromProgram = (studentId: any) => {
        showWarningMessage('Are you sure you want to remove this student from this program?', 'Remove Student From Program', 'Your student has been removed from the program')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    // User confirmed the action
                    dropProspectFromProgram(studentId, prID).then((response) => {
                        if (response) {
                            setUpdatedPrograms(!updatedPrograms);
                        }
                    });
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
                    <Link to="/classes/programs" className="text-primary hover:underline">
                        View Programs
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>{programName || 'Program'}</span>
                </li>
            </ul>
            <div>
                <div className="sm:flex sm:items-center sm:justify-between sm:flex-wrap sm:gap-4">
                    <h2 className="text-xl ">
                        Roster for <span className="font-bold">{programName}</span>
                    </h2>
                    <div>
                        <div className="flex sm:flex-row flex-col sm:items-center justify-end sm:gap-3 gap-4 w-full sm:w-auto">
                            <div className="relative">
                                <input type="text" placeholder="Search Students" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search} onChange={(e) => setSearch(e.target.value)} />
                                <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                                    <IconSearch className="mx-auto" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="sm:flex space-y-4 sm:space-y-0 items-center gap-2 mt-4">
                        <AddStudentProspectToProgram programId={prID} studentRoster={studentRoster} student={true} updatedPrograms={updatedPrograms} setUpdatedPrograms={setUpdatedPrograms} />
                        <AddStudentProspectToProgram programId={prID} studentRoster={prospectRoster} student={false} updatedPrograms={updatedPrograms} setUpdatedPrograms={setUpdatedPrograms} />
                        <EmailClassModal type={'program'} recipients={bulkRecipientsForText} />
                        <SendBulkText isButton={true} recipients={bulkRecipientsForText} displayAll={false} />
                        <button type="button" className="btn btn-warning gap-2 w-full whitespace-nowrap" onClick={() => handlePrintRoster(studentRoster, prospectRoster)}>
                            <IconPrinter />
                            Print Roster
                        </button>
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

                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t border-gray-200">
                                    <th scope="colgroup" colSpan={4} className="bg-dark py-4 pl-4 pr-3 text-left text-xl font-semibold text-white sm:pl-3">
                                        Students
                                    </th>
                                </tr>
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
                                                <div className="flex gap-4 items-center justify-end">
                                                    <Link
                                                        to={`/students/view-student/${hashTheID(contact.Student_ID)}/${hashTheID(suid)}`}
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary gap-1"
                                                    >
                                                        <IconEye /> View
                                                    </Link>
                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDropStudentFromProgram(contact.Student_ID)}>
                                                        Remove
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                <tr className="border-t border-gray-200">
                                    <th scope="colgroup" colSpan={4} className="bg-dark py-4 pl-4 pr-3 text-left text-xl font-semibold text-white sm:pl-3">
                                        Prospects
                                    </th>
                                </tr>
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
                                                    <button type="button" className="btn btn-sm btn-outline-primary ml-auto">
                                                        Info
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDropProspectFromProgram(contact.ProspectId)}>
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

export default ViewProgramRoster;
