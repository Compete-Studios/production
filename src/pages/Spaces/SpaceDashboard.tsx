import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import IconPlusCircle from '../../components/Icon/IconPlusCircle';
import IconBell from '../../components/Icon/IconBell';
import Calendar from '../Tools/Calendar';
import BookingsList from './components/BookingsList';
import SpaceSlider from './components/SpaceSlider';
import IconX from '../../components/Icon/IconX';

export default function SpaceDashboard() {
    const [showTrainingInfo, setShowTrainingInfo] = useState(true);
    return (
        <div className="">
            <div className="grid gird-cols-1 sm:grid-cols-2 gap-4">
                {showTrainingInfo && (
                    <div className="sm:col-span-2">
                        <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
                            <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                                <IconBell />
                            </div>
                            <span className="ltr:mr-3 rtl:ml-3">Register for Space Share Training: </span>
                            <a href="https://www.npmjs.com/package/mantine-datatable" target="_blank" className="block hover:underline">
                                https://www.linkfortraining.com
                            </a>
                            <div className="ml-auto">
                                <button onClick={() => setShowTrainingInfo(false)}>
                                    <IconX />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="col-span-2 flex items-center">
                    <h1 className="text-2xl font-bold leading-6 text-gray-900 tracking-tight">Space Dashboard</h1>
                    <Link to="/space-sharing/post-space" className="btn ml-auto btn-dark gap-1">
                        <IconPlusCircle />
                        Add New Space
                    </Link>
                </div>
                <div>
                    <BookingsList />
                </div>
                <div className="row-span-6">
                    <Calendar />
                </div>
                <div>
                    <SpaceSlider />
                </div>
            </div>
        </div>
    );
}
