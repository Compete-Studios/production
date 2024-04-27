import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrash from '../../components/Icon/IconTrash';
import { UserAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { dropProgram, dropRoom } from '../../functions/api';
import IconEdit from '../../components/Icon/IconEdit';
import AddRoom from './AddRoom';
import { showWarningMessage } from '../../functions/shared';
import AddPrograms from './AddPrograms';
import IconUsers from '../../components/Icon/IconUsers';
import { Link, useNavigate } from 'react-router-dom';

export default function Programs() {
    const { update, setUpdate, programs, suid }: any = UserAuth();

    const navigate = useNavigate();

    const handleDeleteRoome = async (ProgramID: any) => {
        showWarningMessage('Are you sure you want to delete this program?', 'Remove Program', 'Your Program has been removed successfully')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    dropProgram(ProgramID).then((response) => {
                        console.log(response);
                        if (response.status === 200) {
                            setUpdate(!update);
                        } else {
                            console.error('Failed to delete program');
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

    const handleViewProgramRoster = (ProgramID: any) => {
        navigate(`/classes/view-program-roster/${ProgramID}/${suid}`);
    };

    return (
        <div className="panel px-0 pb-0 border-white-light dark:border-[#1b2e4b]">
            <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                <h2 className="text-xl">Programs</h2>

                <div className="gap-2 ltr:ml-auto rtl:mr-auto">
                    <AddPrograms />
                </div>
            </div>
            <div className="table-responsive ">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Enrollment</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programs?.map((data: any) => {
                            return (
                                <tr key={data.ProgramId}>
                                    <td>
                                        <div className="whitespace-nowrap">{data.Name}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{data.enrollment}</div>
                                    </td>

                                    <td className="text-center ">
                                        <Tippy content="View Student Roster">
                                            <button type="button" className="p-2 text-warning hover:text-orange-800" onClick={() => handleViewProgramRoster(data.ProgramId)}>
                                                <IconUsers />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Edit">
                                            <button type="button" className="p-2 text-primary hover:text-emerald-800">
                                                <IconEdit />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Delete">
                                            <button type="button" className="p-2 text-danger hover:text-red-700" onClick={() => handleDeleteRoome(data.ProgramId)}>
                                                <IconTrash />
                                            </button>
                                        </Tippy>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
