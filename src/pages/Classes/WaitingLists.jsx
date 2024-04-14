import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrash from '../../components/Icon/IconTrash';
import IconPlus from '../../components/Icon/IconPlus';
import { UserAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { loadStudioRooms } from '../../functions/api';

export default function waitingLists() {
    const { waitingLists } = UserAuth();

    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                <h2 className="text-xl">Rooms</h2>

                <div className="gap-2 ltr:ml-auto rtl:mr-auto">
                    <button type="button" className="btn btn-primary gap-2 ltr:ml-auto rtl:mr-auto">
                        <IconPlus />
                        Add a Room
                    </button>
                </div>
            </div>
            <div className="table-responsive mb-5">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Student Enrollment</th>
                            <th>Prospect Enrollment</th>
                            
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {waitingLists?.map((data) => {
                            return (
                                <tr key={data.WaitingListId}>
                                    <td>
                                        <div className="whitespace-nowrap">{data.Title}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{data.studentEnrollment}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{data.prospectEnrollment}</div>
                                    </td>

                                    <td className="text-center">
                                        <Tippy content="Delete">
                                            <button type="button">
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
