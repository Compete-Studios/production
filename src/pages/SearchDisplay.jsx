import React from 'react';
import { UserAuth } from '../context/AuthContext';
import IconInfoCircle from '../components/Icon/IconInfoCircle';
import IconEye from '../components/Icon/IconEye';
import { hashTheID } from '../functions/shared';
import { useNavigate } from 'react-router-dom';

export default function SearchDisplay() {
    const { searchedStudentsAndProspects, suid } = UserAuth();

    const navigate = useNavigate();

    const handleViewStudent = (id) => {
        const hashedStudentId = hashTheID(id);
        const hashedSUID = hashTheID(suid);
        navigate(`/students/view-student/${hashedStudentId}/${hashedSUID}`);
    };

    const handleViewProspect = (id) => {
        const hashedStudentId = hashTheID(id);
        const hashedSUID = hashTheID(suid);
        navigate(`/prospects/view-prospect/${hashedStudentId}/${hashedSUID}`);
    };

    // Sort students and prospects by last name
    const sortedStudents = searchedStudentsAndProspects?.students?.sort((a, b) => a.Last_Name.localeCompare(b.Last_Name));
    const sortedProspects = searchedStudentsAndProspects?.prospects?.sort((a, b) => a.LName.localeCompare(b.LName));

    return (
        <div className="grid 2xl:grid-cols-2 grid-cols-12 gap-x-2">
            <div className='2xl:col-span-1 col-span-7'>
                <div>
                    <h2 className="text-xl">Students</h2>
                    <p className="text-sm text-gray-700">A list of all the students that match the criteria</p>
                </div>

                <div className="mt-4 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Info</th>
                                    <th>Contact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedStudents?.length > 0 ? (
                                    sortedStudents.map((person) => (
                                        <tr key={person.Last_Name}>
                                            <td>
                                                <div className="flex flex-wrap">
                                                    {person.Last_Name}, {person.First_Name}
                                                </div>
                                            </td>
                                            <td className={`${person.activity === 1 ? "text-success" : "text-danger"}`}>{person.activity === 1 ? 'Active' : 'Inactive'}</td>
                                            <td>
                                                <button onClick={() => handleViewStudent(person.Student_id)}>
                                                    <IconEye className="text-info hover:text-blue-900" />
                                                </button>
                                            </td>
                                            <td>
                                                <div>{person.email}</div>
                                                <div>{person.Phone}</div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-3 py-4 text-sm text-center text-red-500">
                                            This search returned no students.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className='2xl:col-span-1 col-span-5'>
                {' '}
                <div>
                    <div>
                        <h2 className="text-xl">Prospects</h2>
                        <p className="text-sm text-gray-700">A list of all the prospects that match the criteria</p>
                    </div>
                    <div className="mt-4 panel p-0 border-0 overflow-hidden">
                        <div className="table-responsive">
                            <table className="table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Info</th>
                                        <th>Contact</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedProspects?.length > 0 ? (
                                        sortedProspects.map((person) => (
                                            <tr key={person.LName}>
                                                <td>
                                                    <div className="flex flex-wrap">
                                                        {person.LName}, {person.FName}
                                                    </div>
                                                </td>

                                                <td>
                                                    <button onClick={() => handleViewProspect(person.ProspectId)}>
                                                        <IconEye className="text-info hover:text-blue-900" />
                                                    </button>
                                                </td>
                                                <td>
                                                    <div>{person.Email}</div>
                                                    <div>{person.Phone}</div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-3 py-4 text-sm text-center text-red-500">
                                                This search returned no prospects.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
