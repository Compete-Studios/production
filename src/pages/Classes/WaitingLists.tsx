import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrash from '../../components/Icon/IconTrash';
import IconPlus from '../../components/Icon/IconPlus';
import { UserAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { deleteWaitingList, loadStudioRooms } from '../../functions/api';
import IconEdit from '../../components/Icon/IconEdit';
import IconUsers from '../../components/Icon/IconUsers';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import AddWaitingList from './AddWaitingList';
import { showWarningMessage } from '../../functions/shared';

export default function waitingLists() {
    const { waitingLists, update, setUpdate }: any = UserAuth();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Waiting Lists'));
    });

    const handleDeleteWaitingList = async (listid: any) => {
        showWarningMessage('Are you sure you want to delete this room?', 'Remove Room', 'Your Room has been removed successfully')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    deleteWaitingList(listid).then((response) => {
                        if (response) {
                            setUpdate(!update);
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
        <div className="panel px-0 pb-0 border-white-light dark:border-[#1b2e4b]">
            <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                <h2 className="text-xl">Waiting Lists</h2>

                <div className="gap-2 ltr:ml-auto rtl:mr-auto">
                    <AddWaitingList />
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
                        {waitingLists?.map((data: any) => {
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

                                    <td className="text-center ">
                                        <Tippy content="Edit">
                                            <button type="button" className="p-2 text-orange-500 hover:text-orange-800" >
                                                <IconUsers />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Edit">
                                            <button type="button" className="p-2 text-primary hover:text-emerald-800">
                                                <IconEdit />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Delete">
                                            <button type="button" className="p-2 text-danger hover:text-red-700" onClick={() => handleDeleteWaitingList(data.WaitingListId)}>
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
