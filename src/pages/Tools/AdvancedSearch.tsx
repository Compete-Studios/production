import { useEffect, useState } from 'react';
import { getProspectsByClassId, getProspectsByProgramId, getStaffByClassId, getStudentsByClassId, getStudentsByProgramId, searchAll } from '../../functions/api';
import { UserAuth } from '../../context/AuthContext';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconEye from '../../components/Icon/IconEye';
import { Link, useNavigate } from 'react-router-dom';
import SendBulkText from '../Marketing/SendBulkText';
import { hashTheID } from '../../functions/shared';
import ViewStaffMember from '../Staff/ViewStaffMember';
import EmailClassModal from '../Marketing/EmailClassModal';
import { Loader } from '@mantine/core';

const searchInit = {
    studioId: 32,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    active: '3',
    address: '',
    city: '',
    state: '',
    zip: '',
    notesContains: '',
    students: false,
    prospects: false,
    staff: false,
};

export default function AdvancedSearch() {
    const { suid, programs, classes, setEmailList }: any = UserAuth();
    const [searchQuery, setSearchQuery] = useState(searchInit);
    const [searchStudents, setSearchStudents] = useState<boolean>(false);
    const [searchProspects, setSearchProspects] = useState<boolean>(false);
    const [searchStaff, setSearchStaff] = useState<boolean>(false);
    const [results, setResults] = useState<any>([]);
    const [students, setStudents] = useState<any>([]);
    const [prospects, setProspects] = useState<any>([]);
    const [staff, setStaff] = useState<any>([]);
    const [combinedResults, setCombinedResults] = useState<any>([]);
    const [program, setProgram] = useState<any>(null);
    const [classID, setClassID] = useState<any>(null);
    const [classStaff, setClassStaff] = useState<any>([]);
    const [studentRoster, setStudentRoster] = useState<any>([]);
    const [prospectRoster, setProspectRoster] = useState<any>([]);
    const [studentProgramRoster, setStudentProgramRoster] = useState<any>([]);
    const [prospectProgramRoster, setProspectProgramRoster] = useState<any>([]);
    const [bulkRecipientsForText, setBulkRecipientsForText] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20; // Number of rows per page

    const totalPages = Math.ceil(combinedResults.length / itemsPerPage);

    // Get the items for the current page
    const paginatedResults = combinedResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePrevious = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const navigate = useNavigate();

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setSearchQuery({ ...searchQuery, [name]: value });
    };

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        if (searchStudents) {
            console.log(results.students.recordset, 'students');
            setStudents(results.students.recordset);
        }
        if (searchProspects) {
            const updatedProspects = results.prospects.recordset.map((prospect: any) => ({
                ...prospect,
                email: prospect.Email.toLowerCase(),
            }));
            setProspects(updatedProspects);
        }
        if (searchStaff) {
            const updatedStaff = results.staff.recordset.map((staff: any) => ({
                ...staff,
                email: staff.Email.toLowerCase(),
            }));
            setStaff(updatedStaff);
        }
    }, [results]);

    const handleCombineResults = () => {
        let combinedResults = [];

        // Filter by classID if it exists
        if (classID) {
            const filteredStudents = students.filter((student: any) => studentRoster.some((rosterStudent: any) => rosterStudent.Student_ID === student.Student_id));
            const filteredProspects = prospects.filter((prospect: any) => prospectRoster.some((rosterProspect: any) => rosterProspect.ProspectId === prospect.ProspectId));
            const filteredStaff = staff.filter((staffMember: any) => classStaff.some((classStaffMember: any) => classStaffMember.StaffId === staffMember.StaffId));

            combinedResults = [...filteredStudents, ...filteredProspects, ...filteredStaff];
        } else {
            combinedResults = [...students, ...prospects, ...staff];
        }

        // Further filter by program if it exists
        if (program) {
            const filteredStudentPrograms = combinedResults.filter((student: any) => studentProgramRoster.some((studentProgram: any) => studentProgram.Student_ID === student.Student_id));
            const filteredProspectPrograms = combinedResults.filter((prospect: any) => prospectProgramRoster.some((prospectProgram: any) => prospectProgram.ProspectId === prospect.ProspectId));

            combinedResults = [...filteredStudentPrograms, ...filteredProspectPrograms];
        }

        setCombinedResults(combinedResults);
    };

    useEffect(() => {
        handleCombineResults();
    }, [students, prospects, staff, classStaff, studentRoster, prospectRoster, studentProgramRoster, prospectProgramRoster]);

    const handleGetClassStaff = async () => {
        try {
            const res = await getStaffByClassId(classID);
            const modifiedRes = res.map((staff: any) => ({
                ...staff,
                StaffId: staff.StaffId[0], // Set StaffId to the first element of the StaffId array
            }));
            setClassStaff(modifiedRes);

            getStudentsByClassId(classID).then((res) => {
                setStudentRoster(res);
            });

            getProspectsByClassId(classID).then((res) => {
                setProspectRoster(res);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetProgramPeople = async (prID: any) => {
        try {
            if (searchStudents) {
            const res = await getStudentsByProgramId(prID);
            setStudentProgramRoster(res.recordset);
            }
            if (searchProspects) {
            const res2 = await getProspectsByProgramId(prID);
            setProspectProgramRoster(res2.recordset);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleSearch = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setStudents([]);
        setProspects([]);
        setStaff([]);
        setCurrentPage(1);
        const mockQuery = {
            studioId: suid,
            firstName: searchQuery.firstName,
            lastName: searchQuery.lastName,
            email: searchQuery.email,
            phone: searchQuery.phone,
            active: searchQuery.active,
            address: searchQuery.address,
            city: searchQuery.city,
            state: searchQuery.state,
            zip: searchQuery.zip,
            notesContain: searchQuery.notesContains,
            students: searchStudents,
            prospects: searchProspects,
            staff: searchStaff,
            programId: program,
            classId: classID,
        };
        try {
            const res = await searchAll(mockQuery);
            setResults(res);
            if (classID) {
                await handleGetClassStaff();
            }
            if (program) {
                await handleGetProgramPeople(program);
            }
            setLoading(false);
            handleScrollToTop();
        } catch (error) {
            console.log(error);
        }
    };

    const handleClear = (e: any) => {
        e.preventDefault();
        setSearchQuery(searchInit);
    };

    const handleGetEmails = () => {
        setEmailList(combinedResults);
        navigate('/marketing/create-news-letter/0/search');
    };

    const handleSetBulk = (staffNumbers: any, studentNumbers: any, prospectNumbers: any) => {
        let bulkRecipients: any = [];
        staffNumbers.map((d: any) => {
            bulkRecipients.push({ phoneNumber: d.Phone, name: d.FirstName + ', ' + d.LastName, type: 'staff', email: d.email });
        });
        studentNumbers.map((d: any) => {
            bulkRecipients.push({ phoneNumber: d.Phone, name: d.First_Name + ', ' + d.Last_Name, type: 'student', email: d.email });
        });
        prospectNumbers.map((d: any) => {
            bulkRecipients.push({ phoneNumber: d.Phone, name: d.FName + ', ' + d.LName, type: 'prospect', email: d.email });
        });
        setBulkRecipientsForText(bulkRecipients);
    };

    useEffect(() => {
        handleSetBulk(staff, students, prospects);
    }, [staff, students, prospects]);

    return (
        <>
            {loading ? (
                <div className="flex items-center justify-center h-screen -mt-36">
                    <Loader size="md" color="blue" />
                    {program && <p className="ml-2">This may take a few moments. Fetching Program Info can take longer than normal.</p>}
                </div>
            ) : (
                <div>
                    <div className="flex items-end justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Advanced Search</h1>
                            <p className="text-gray-500">Search for students, prospects, and staff</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* <button className="btn btn-info w-44" onClick={() => handleGetEmails()}>
                        Email This List
                    </button> */}
                            <EmailClassModal recipients={bulkRecipientsForText} type={'search'} />
                            <SendBulkText isButton={true} recipients={bulkRecipientsForText} displayAll={false} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        <form className="mt-4 panel space-y-4" onSubmit={(e) => handleSearch(e)}>
                            <div>
                                <div>
                                    <label className="inline-flex">
                                        <input type="checkbox" className="form-checkbox" name="students" checked={searchStudents} onChange={() => setSearchStudents(!searchStudents)} />
                                        <span>Students</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="inline-flex">
                                        <input type="checkbox" className="form-checkbox" name="prospects" checked={searchProspects} onChange={() => setSearchProspects(!searchProspects)} />
                                        <span>Prospects</span>
                                    </label>
                                </div>
                                <div>
                                    {' '}
                                    <label className="inline-flex">
                                        <input type="checkbox" className="form-checkbox" name="staff" checked={searchStaff} onChange={() => setSearchStaff(!searchStaff)} />
                                        <span>Staff</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label>First Name</label>
                                <input type="text" placeholder="First Name" className="form-input" name="firstName" value={searchQuery.firstName} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Last Name</label>
                                <input type="text" placeholder="Last Name" className="form-input" name="lastName" value={searchQuery.lastName} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Email</label>
                                <input type="text" placeholder="Email" className="form-input" name="email" value={searchQuery.email} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Phone</label>
                                <input type="text" placeholder="Phone" className="form-input" name="phone" value={searchQuery.phone} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Active</label>
                                <select className="form-select" name="active" value={searchQuery.active} onChange={handleChange}>
                                    <option value="3">Both Active and Inactive</option>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label>Notes Contain</label>
                                <input type="text" placeholder="Notes Contain" className="form-input" name="notesContains" value={searchQuery.notesContains} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Address</label>
                                <input type="text" placeholder="Address" className="form-input" name="address" value={searchQuery.address} onChange={handleChange} />
                            </div>
                            <div>
                                <label>City</label>
                                <input type="text" placeholder="City" className="form-input" name="city" value={searchQuery.city} onChange={handleChange} />
                            </div>
                            <div>
                                <label>State</label>
                                <input type="text" placeholder="State" className="form-input" name="state" value={searchQuery.state} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Zip</label>
                                <input type="text" placeholder="Zip" className="form-input" name="zip" value={searchQuery.zip} onChange={handleChange} />
                            </div>
                            {/* <div>
                        <label>Program</label>
                        <select className="form-select">
                            <option value="Select">Select Option</option>
                            {programs?.map((program: any, index: any) => (
                                <option key={index} value={program.ProgramId}>
                                    {program.Name}
                                </option>
                            ))}

                            <option value="program2">Program 2</option>
                        </select>
                    </div> */}
                            <div>
                                <label>Class</label>
                                <select className="form-select" value={classID} onChange={(e) => setClassID(e.target.value)}>
                                    <option value={''}>Select Option</option>
                                    {classes?.map((classData: any, index: any) => (
                                        <option key={index} value={classData.ClassId}>
                                            {classData.Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Programs</label>
                                <select className="form-select" value={program} onChange={(e) => setProgram(e.target.value)}>
                                    <option value={''}>Select Option</option>
                                    {programs?.map((programData: any, index: any) => (
                                        <option key={index} value={programData.ProgramId}>
                                            {programData.Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary w-full" onClick={(e) => handleSearch(e)}>
                                    Search
                                </button>
                                <button className="btn btn-secondary w-full mt-2" onClick={(e) => handleClear(e)}>
                                    Clear Search
                                </button>
                            </div>
                        </form>
                        {combinedResults.length > 0 && (
                            <div className="table-responsive mb-5 col-span-3 panel mt-4 ">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Name</th>
                                            <th>Contact</th>
                                            <th>Status</th>
                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedResults?.map((data: any, index: any) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="whitespace-nowrap">
                                                            {data.Student_id ? (
                                                                <span className="badge bg-primary">Student</span>
                                                            ) : data.ProspectId ? (
                                                                <span className="badge bg-info">Prospect</span>
                                                            ) : (
                                                                <span className="badge bg-dark">Staff</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {data.Student_id
                                                            ? data.Last_Name + ', ' + data.First_Name
                                                            : data.ProspectId
                                                            ? data.LName + ', ' + data.FName
                                                            : data.LastName + ', ' + data.FirstName}
                                                    </td>
                                                    <td>
                                                        <div>{data?.Phone}</div>
                                                        <div>{data.email}</div>
                                                    </td>
                                                    <td>
                                                        <div className={`whitespace-nowrap ${data.activity === 1 ? 'text-success' : 'text-danger'}`}>
                                                            {data.activity === 1 || data.ActivityLevel === 1 ? (
                                                                <span className="badge badge-outline-success">Active</span>
                                                            ) : data.activity === 0 || data.ActivityLevel === 0 ? (
                                                                <span className="badge badge-outline-danger">Inactive</span>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        {data.Student_id ? (
                                                            <Tippy content="View">
                                                                <Link
                                                                    to={`/students/view-student/${hashTheID(data.Student_id)}/${hashTheID(suid)}`}
                                                                    type="button"
                                                                    className="text-info hover:text-blue-800"
                                                                >
                                                                    <IconEye />
                                                                </Link>
                                                            </Tippy>
                                                        ) : data.ProspectId ? (
                                                            <Link
                                                                to={`/prospects/view-prospect/${hashTheID(data.ProspectId)}/${hashTheID(suid)}`}
                                                                type="button"
                                                                className="text-info hover:text-blue-800"
                                                            >
                                                                <IconEye />
                                                            </Link>
                                                        ) : (
                                                            <ViewStaffMember staffID={data.StaffId} />
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {/* Pagination Controls */}
                                <div className="flex items-center gap-4 justify-between mt-4">
                                    <button
                                        type="button"
                                        className="flex justify-center font-semibold px-3.5 py-2 rounded transition text-dark hover:text-primary border-2 border-white-light dark:border-[#191e3a] hover:border-primary dark:hover:border-primary dark:text-white-light items-center gap-2"
                                        onClick={handlePrevious}
                                        disabled={currentPage === 1}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                                        </svg>
                                        Prev
                                    </button>
                                    <span>
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        type="button"
                                        className="flex justify-center font-semibold px-3.5 py-2 rounded transition text-dark hover:text-primary border-2 border-white-light dark:border-[#191e3a] hover:border-primary dark:hover:border-primary dark:text-white-light items-center gap-2"
                                        onClick={handleNext}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next{' '}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
