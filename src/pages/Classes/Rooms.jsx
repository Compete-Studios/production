import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrash from '../../components/Icon/IconTrash';
import IconPlus from '../../components/Icon/IconPlus';
import { UserAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { loadStudioRooms } from '../../functions/api';

const tableData = [
    {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@yahoo.com',
        date: '10/08/2020',
        sale: 120,
        status: 'Complete',
        register: '5 min ago',
        progress: '40%',
        position: 'Developer',
        office: 'London',
    },
    {
        id: 2,
        name: 'Shaun Park',
        email: 'shaunpark@gmail.com',
        date: '11/08/2020',
        sale: 400,
        status: 'Pending',
        register: '11 min ago',
        progress: '23%',
        position: 'Designer',
        office: 'New York',
    },
    {
        id: 3,
        name: 'Alma Clarke',
        email: 'alma@gmail.com',
        date: '12/02/2020',
        sale: 310,
        status: 'In Progress',
        register: '1 hour ago',
        progress: '80%',
        position: 'Accountant',
        office: 'Amazon',
    },
    {
        id: 4,
        name: 'Vincent Carpenter',
        email: 'vincent@gmail.com',
        date: '13/08/2020',
        sale: 100,
        status: 'Canceled',
        register: '1 day ago',
        progress: '60%',
        position: 'Data Scientist',
        office: 'Canada',
    },
];

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
