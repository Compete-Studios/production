import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrash from '../../components/Icon/IconTrash';
import { UserAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { dropRank, getRanksByStudioId } from '../../functions/api';
import IconEdit from '../../components/Icon/IconEdit';
import { showWarningMessage } from '../../functions/shared';
import IconUsers from '../../components/Icon/IconUsers';
import { Link, useNavigate } from 'react-router-dom';
import AddNewRank from './AddNewRank';

export default function Ranks() {
    const { suid }: any = UserAuth();
    const [ranks, setRanks] = useState<any>([]);
    const [update, setUpdate] = useState(false);

    const navigate = useNavigate();

    const getStudioRanks = async () => {
        try {
            const response = getRanksByStudioId(suid);
            const data = await response;
            setRanks(data);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getStudioRanks();
    }, [suid, update]);


    const handleDeleteRoome = async (RankID: any) => {
        showWarningMessage('Are you sure you want to delete this rank?', 'Remove Rank', 'Your Rank has been removed successfully')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    dropRank(RankID).then((response) => {
                        console.log(response);
                        if (response.status === 200) {
                           console.log('Rank deleted successfully')
                        } else {
                            console.error('Failed to delete Rank');
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

    const handleViewRankRoster = (RankId: any, name: any) => {
        navigate(`/classes/students-in-rank/${RankId}/${suid}/${name}`);
    };

    return (
        <div className="panel px-0 pb-0 border-white-light dark:border-[#1b2e4b]">
            <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                <h2 className="text-xl">Ranks</h2>

                <div className="gap-2 ltr:ml-auto rtl:mr-auto">
                    <AddNewRank update={update} setUpdate={setUpdate}/>
                </div>
            </div>
            <div className="table-responsive ">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranks?.map((data: any) => {
                            return (
                                <tr key={data.ProgramId}>
                                    <td>
                                        <div className="whitespace-nowrap">{data.Name}</div>
                                    </td>

                                    <td className="text-right ">
                                        <Tippy content="View Student Roster">
                                            <button type="button" className="p-2 text-warning hover:text-orange-800" onClick={() => handleViewRankRoster(data.RankId, data.Name)}>
                                                <IconUsers />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Edit">
                                            <button type="button" className="p-2 text-primary hover:text-emerald-800">
                                                <IconEdit />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Delete">
                                            <button type="button" className="p-2 text-danger hover:text-red-700" onClick={() => handleDeleteRoome(data.RankId)}>
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
