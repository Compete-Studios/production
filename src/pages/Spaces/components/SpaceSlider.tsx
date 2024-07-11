import { Link } from 'react-router-dom';
import IconPlusCircle from '../../../components/Icon/IconPlusCircle';
import { UserAuth } from '../../../context/AuthContext';
import { useEffect, useState } from 'react';

export default function SpaceSlider() {
    const { spaces }: any = UserAuth();

    return (
        <div>
            {spaces?.length > 0 ? (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {spaces?.map((space: any, index: any) => (
                            <div key={index} className="mb-5 flex items-center justify-center">
                                <div className="max-w-[22rem] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                                    <div className="py-7 px-6">
                                        <div className="-mt-7 mb-7 -mx-6 rounded-tl rounded-tr h-[260px] overflow-hidden">
                                            <img src={space?.photos[0]} alt={space?.title} className="w-full h-full object-cover" />
                                        </div>
                                        <p className="text-primary text-xs mb-1.5 font-bold">
                                            {space?.city}, {space?.state}, {space?.zip}
                                        </p>

                                        <h5 className="text-[#3b3f5c] text-[15px] font-bold mb-4 dark:text-white-light">{space?.title}</h5>

                                        <div className="font-semibold">
                                            Estimated Per Month: <span className="text-success">$250</span>
                                        </div>
                                    </div>
                                    <div className="relative flex justify-between  before:w-[250px] before:h-[1px] before:bg-white-light before:inset-x-0 before:top-0 before:absolute before:mx-auto dark:before:bg-[#1b2e4b]">
                                        <div>
                                            <button className="uppercase font-lg font-bold w-full hover:bg-danger-light p-4 text-left">Delete Space</button>
                                            <button className="uppercase font-lg font-bold w-full hover:bg-warning-light p-4 text-left">Edit Space</button>
                                            <button className="uppercase font-lg font-bold w-full hover:bg-info-light p-4 text-left">View Space</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <Link
                    to="/space-sharing/post-space"
                    type="button"
                    className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                    <IconPlusCircle className="mx-auto h-12 w-12 text-gray-400" />

                    <span className="mt-2 block text-sm font-semibold text-gray-900">Add your first space</span>
                </Link>
            )}
        </div>
    );
}
