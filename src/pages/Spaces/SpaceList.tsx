import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link } from 'react-router-dom';
import spaceImg from './images/content.svg';
import { UserAuth } from '../../context/AuthContext';
import IconTrash from '../../components/Icon/IconTrash';
import IconEdit from '../../components/Icon/IconEdit';
import IconEye from '../../components/Icon/IconEye';

export default function SpaceList() {
    const { spaces }: any = UserAuth();
    console.log(spaces);
    return (
        <div>
            {spaces?.length > 0 ? (
                <div className=" mb-5">
                    <table className='bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] border rounded-lg border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none'>
                        <thead>
                            <tr>
                                <th>Space</th>
                                <th>Address</th>
                                <th>Status</th>
                                <th>Current Renters</th>
                                <th>Total Earnings</th>
                                <th className="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {spaces?.map((data: any) => {
                                return (
                                    <tr key={data.id}>
                                        <td className="flex items-center gap-2">
                                            <img src={data.photos[0]} alt={data.title} className="w-12 h-12 rounded-lg" />
                                            <div className="whitespace-nowrap font-bold">
                                              <Link to={`/space-sharing/space/${data.id}`} className='hover:text-info'>{data.title}</Link></div>
                                        </td>
                                        <td>
                                            <div className="font-semibold">{data.address}</div>
                                            <div>
                                                {data.city}, {data.state} {data.zip}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={`whitespace-nowrap ${data.isAvailable === 'active' ? 'text-success' : data.isAvailable === 'inactive' ? 'text-danger' : 'text-warning'}`}>
                                                {data.isAvailable === 'active' ? 'Available' : data.isAvailable === 'pending' ? 'Pending' : 'In Active'}
                                            </div>
                                        </td>

                                        <td className={`whitespace-nowrap ${data.currentRenters?.length > 0 ? 'text-success' : 'text-danger'}`}>{data.currentRenters?.length || 0}</td>
                                        <td>
                                            <div className="font-bold text-success">${data.totalEarnings || 0}</div>
                                        </td>

                                        <td className="space-x-2 text-right">
                                            <Tippy content="View">
                                                <Link to={`/space-sharing/space/${data.id}`} type="button" className="text-info hover:text-blue-800">
                                                    <IconEye />
                                                </Link>
                                            </Tippy>
                                            <Tippy content="Edit">
                                                <button type="button">
                                                    <IconEdit />
                                                </button>
                                            </Tippy>
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
            ) : (
                <div>
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-bold leading-6 text-gray-900 tracking-tight">Spaces</h1>
                    </div>

                    <div className="overflow-hidden rounded-lg bg-white shadow mt-8">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center justify-center py-24">
                                <div className="text-center">
                                    <img src={spaceImg} alt="Renters" className="w-1/2 h-1/2 mx-auto" />
                                    <h3 className="text-lg font-bold text-zinc-800">All Your Spaces in One Place</h3>
                                    <p className="text-sm font-normal text-gray-500 ml-2">Manage your spaces, update their availability, and more.</p>
                                    <div className="mt-4">
                                        <Link
                                            to="/space-sharing/post-space"
                                            type="button"
                                            className="rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                                        >
                                            Add a Space
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
