import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrash from '../../components/Icon/IconTrash';
import { UserAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { dropRoom, loadStudioRooms } from '../../functions/api';
import IconEdit from '../../components/Icon/IconEdit';
import AddRoom from './AddRoom';
import { showWarningMessage } from '../../functions/shared';
import { Link } from 'react-router-dom';

export default function Rooms() {
    const { suid }: any = UserAuth();
    const [rooms, setRooms] = useState([]);
    const [] = useState(false);

    const getStudioRooms = async () => {
        try {
            const response = loadStudioRooms(suid);
            const data = await response;
            setRooms(data.recordset);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getStudioRooms();
    }, [suid]);

    const handleDeleteRoome = async (RoomId: any) => {
        showWarningMessage('Are you sure you want to delete this room?', 'Remove Room', 'Your Room has been removed successfully')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    dropRoom(RoomId).then((response) => {
                        if (response) {
                            getStudioRooms();
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
                <h2 className="text-xl">Rooms</h2>

                <div className="gap-2 ltr:ml-auto rtl:mr-auto">
                    <AddRoom update={getStudioRooms} />
                </div>
            </div>
            <div className="table-responsive ">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms?.map((data: any) => {
                            return (
                                <tr key={data.RoomId}>
                                    <td>
                                        <div className="whitespace-nowrap">{data.Name}</div>
                                    </td>

                                    <td className="text-center ">
                                        <Tippy content="Edit">
                                            <Link to={`/classes/edit-room/${data.RoomId}` }>
                                            <button type="button" className="p-2 text-primary hover:text-emerald-800">
                                                <IconEdit />
                                                </button>
                                            </Link>
                                        </Tippy>
                                        <Tippy content="Delete">
                                            <button type="button" className="p-2 text-danger hover:text-red-700" onClick={() => handleDeleteRoome(data.RoomId)}>
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
