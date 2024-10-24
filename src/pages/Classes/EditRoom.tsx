import { useEffect, useState } from 'react';

import { editRoom, getRoomByRoomId } from '../../functions/api';
import { showMessage } from '../../functions/shared';
import { UserAuth } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditRoom() {
    const { suid }: any = UserAuth();
    const [roomData, setRoomData] = useState({
        studioId: '',
        name: '',
        description: '',
        notes: '',
    });

    const { rmID } = useParams();

    const navigate = useNavigate();

    const handleGetRoom = async () => {
        try {
            const response = await getRoomByRoomId(rmID);
            console.log(response, 'response');
            const roomInfo = response.recordset[0];
            setRoomData({
                studioId: roomInfo.StudioId,
                name: roomInfo.Name,
                description: roomInfo.Description,
                notes: roomInfo.Notes,
            });
        } catch (error) {
            console.error(error);
            showMessage('Failed to get room', 'error');
        }
    };

    useEffect(() => {
        handleGetRoom();
    }, [rmID]);

    const handleUpdateRoom = async () => {
        roomData.studioId = suid;
        try {
            const roomToEdit = {
                roomId: rmID,
                name: roomData.name,
                description: roomData.description,
                notes: roomData.notes,
            };
            const response = await editRoom(roomToEdit);
            if (response.status === 200) {
                showMessage('Room added successfully');
                setRoomData({
                    studioId: '',
                    name: '',
                    description: '',
                    notes: '',
                });
                navigate('/classes/rooms');
            } else {
                showMessage('Failed to add room', 'error');
            }
        } catch (error) {
            console.error(error);
            showMessage('Failed to add room', 'error');
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold">Edit Room</h1>
            <div className="space-y-4 panel bg-zinc-50 mt-4">
                <div>
                    <label htmlFor="roomname">Room Name</label>
                    <input type="text" id="roomname" name="roomname" value={roomData.name} className="form-input" onChange={(e) => setRoomData({ ...roomData, name: e.target.value })} />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        rows={4}
                        name="description"
                        value={roomData.description}
                        className="form-input"
                        onChange={(e) => setRoomData({ ...roomData, description: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="notes">Notes</label>
                    <textarea id="notes" rows={4} name="notes" value={roomData.notes} className="form-input" onChange={(e) => setRoomData({ ...roomData, notes: e.target.value })} />
                </div>
                <div className="flex">
                    <button type="button" className="ml-auto btn btn-primary" onClick={handleUpdateRoom}>
                        Update Room
                    </button>
                </div>
            </div>
        </div>
    );
}
