import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrash from '../../components/Icon/IconTrash';
import IconPlus from '../../components/Icon/IconPlus';
import { UserAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { loadStudioRooms } from '../../functions/api';
import IconEdit from '../../components/Icon/IconEdit';


export default function Rooms() {
    const { suid } = UserAuth();
    const [rooms, setRooms] = useState([]);

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

    console.log(rooms)

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
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms?.map((data) => {
                            return (
                                <tr key={data.RoomId}>
                                    <td>
                                        <div className="whitespace-nowrap">{data.Name}</div>
                                    </td>
                               
                                    <td className="text-center ">
                                    <Tippy content="Edit">
                                            <button type="button" className='p-2 text-primary hover:text-emerald-800'>
                                                <IconEdit />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Delete">
                                            <button type="button" className='p-2 text-danger hover:text-red-700'>
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
