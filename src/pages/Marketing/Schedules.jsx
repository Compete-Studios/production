import React, { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from '../../components/Dropdown';
import { UserAuth } from '../../context/AuthContext';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import IconMail from '../../components/Icon/IconMail';
import IconMessage2 from '../../components/Icon/IconMessage2';
import IconUsers from '../../components/Icon/IconUsers';
import IconEye from '../../components/Icon/IconEye';
import IconPrinter from '../../components/Icon/IconPrinter';
import IconBolt from '../../components/Icon/IconBolt';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { REACT_API_BASE_URL } from '../../constants';

export default function Schedules() {
    const { prospectIntros, studentIntros, suid } = UserAuth();
    const isRtl = useSelector((state) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const formatDate = (date) => {
        const newDate = new Date(date);
        const formattedDate = newDate.toISOString().substr(0, 10);
        return formattedDate;
    };

    ///post data from the API
    const postStudentData = async () => {
        const response = await fetch(`${REACT_API_BASE_URL}/daily-schedule-tools/getStudentsByNextContactDate/${suid}`, {
            method: 'POST',
            body: JSON.stringify({
                nextContactDate: '2024-04-15',
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const data = await response.json();
        console.log(data);
    };

    const postProspectData = async () => {
        const response = await fetch(`${REACT_API_BASE_URL}/daily-schedule-tools/getStudentsByNextContactDate/${suid}`, {
            method: 'POST',
            body: JSON.stringify({
                nextContactDate: '2024-04-15',
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const data = await response.json();
        console.log(data);
    };

    useEffect(() => {
        postStudentData();
        postProspectData();
    }, [suid]);
    return (
        <div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                <div className="panel h-auto sm:col-span-2 xl:col-span-1 pb-0">
                    <h5 className="font-semibold text-lg dark:text-white-light mb-5">Prospect Intros</h5>

                    <PerfectScrollbar className="relative h-[160px] ltr:pr-3 rtl:pl-3 ltr:-mr-3 rtl:-ml-3 mb-4">
                        <div className="text-sm cursor-pointer">
                            {prospectIntros?.filter((intro) => formatDate(intro.IntroDate) === formatDate(new Date()))?.length < 1 ? (
                                <div className="text-center">
                                    <p className="text-danger">No intros today</p>
                                </div>
                            ) : (
                                prospectIntros
                                    ?.filter((intro) => formatDate(intro.IntroDate) === formatDate(new Date()))
                                    ?.map((intro) => {
                                        return (
                                            <div key={intro.id} className="flex items-center py-1.5 relative group">
                                                <div className="bg-primary w-1.5 h-1.5 rounded-full ltr:mr-1 rtl:ml-1.5"></div>
                                                <div className="flex-1">
                                                    {intro.FName} {intro.LName}
                                                </div>
                                                <div className="ltr:ml-auto rtl:mr-auto text-xs text-white-dark dark:text-gray-500">{formatDate(intro.IntroDate)}</div>

                                                <span className="badge badge-outline-primary absolute ltr:right-0 rtl:left-0 text-xs bg-primary-light dark:bg-black opacity-0 group-hover:opacity-100">
                                                    Pending
                                                </span>
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                    </PerfectScrollbar>
                    {/* <div className="border-t border-white-light dark:border-white/10">
                            <Link to="/" className=" font-semibold group hover:text-primary p-4 flex items-center justify-center group">
                                View All
                                <IconArrowLeft className="rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition duration-300 ltr:ml-1 rtl:mr-1" />
                            </Link>
                        </div> */}
                </div>
          
                <div className="panel h-full">
                    <div className="flex items-center justify-between dark:text-white-light mb-5">
                        <h5 className="font-semibold text-lg">Marketing Summary</h5>
                        <div className="dropdown">
                            <Dropdown placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`} button={<IconHorizontalDots className="w-5 h-5 text-black/70 dark:text-white/70 hover:!text-primary" />}>
                                <ul>
                                    <li>
                                        <button type="button">View Report</button>
                                    </li>
                                    <li>
                                        <button type="button">Edit Report</button>
                                    </li>
                                    <li>
                                        <button type="button">Mark as Done</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="space-y-9">
                        <div className="flex items-center">
                            <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
                                <div className="bg-secondary-light dark:bg-secondary text-secondary dark:text-secondary-light  rounded-full w-9 h-9 grid place-content-center">
                                    <IconMail />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex font-semibold text-white-dark mb-2">
                                    <h6>Emails Sent</h6>
                                    <p className="ltr:ml-auto rtl:mr-auto">50%</p>
                                </div>
                                <div className="rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                    <div className="bg-gradient-to-r from-[#7579ff] to-[#b224ef] w-1/2 h-full rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
                                <div className="bg-success-light dark:bg-success text-success dark:text-success-light rounded-full w-9 h-9 grid place-content-center">
                                    <IconMessage2 />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex font-semibold text-white-dark mb-2">
                                    <h6>Text Messages Sent</h6>
                                    <p className="ltr:ml-auto rtl:mr-auto">25%</p>
                                </div>
                                <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                    <div className="bg-gradient-to-r from-[#3cba92] to-[#0ba360] w-full h-full rounded-full" style={{ width: '25%' }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
                                <div className="bg-warning-light dark:bg-warning text-warning dark:text-warning-light rounded-full w-9 h-9 grid place-content-center">
                                    <IconUsers />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex font-semibold text-white-dark mb-2">
                                    <h6>Active Students</h6>
                                    <p className="ltr:ml-auto rtl:mr-auto">80%</p>
                                </div>
                                <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                    <div className="bg-gradient-to-r from-[#f09819] to-[#ff5858] w-full h-full rounded-full" style={{ width: '80%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mb-6">
                <div className="panel h-full w-full">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Prospects Schedule</h5>
                        <div className="">
                            <IconPrinter className="w-5 h-5 text-black/70 dark:text-white/70 hover:!text-primary" />
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th className="ltr:rounded-l-md rtl:rounded-r-md">Pipeline Step</th>
                                    <th>Name</th>
                                    <th>Parent Name</th>
                                    <th>Class</th>
                                    <th className="ltr:rounded-r-md rtl:rounded-l-md">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                    <td className="min-w-[150px] text-black dark:text-white">
                                        <div className="flex items-center">
                                            <span className="whitespace-nowrap">1st Class Scheduled/Intro Dance</span>
                                        </div>
                                    </td>
                                    <td className="text-primary">Cleo Kastner</td>
                                    <td>
                                        <Link to="/apps/invoice/preview">Melinda</Link>
                                    </td>
                                    <td>
                                        <div>01 DANCE</div>
                                        <div>Fund (5-7) Sec 4 Sat 9a</div>
                                    </td>
                                    <td className="flex gap-1 staff-center w-max mx-auto ">
                                        <Tippy content="View">
                                            <NavLink to="/apps/invoice/preview" className="flex hover:text-primary">
                                                <IconEye />
                                            </NavLink>
                                        </Tippy>
                                        <Tippy content="Contact">
                                            <NavLink to="/apps/invoice/preview" className="flex hover:text-info">
                                                <IconBolt />
                                            </NavLink>
                                        </Tippy>
                                    </td>
                                </tr>
                                <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                    <td className="min-w-[150px] text-black dark:text-white">
                                        <div className="flex items-center">
                                            <span className="whitespace-nowrap">1st Class Scheduled/Intro Dance</span>
                                        </div>
                                    </td>
                                    <td className="text-primary">Cleo Kastner</td>
                                    <td>
                                        <Link to="/apps/invoice/preview">Melinda</Link>
                                    </td>
                                    <td>
                                        <div>01 DANCE</div>
                                        <div>Fund (5-7) Sec 4 Sat 9a</div>
                                    </td>
                                    <td className="flex gap-1 staff-center w-max mx-auto ">
                                        <Tippy content="View">
                                            <NavLink to="/apps/invoice/preview" className="flex hover:text-primary">
                                                <IconEye />
                                            </NavLink>
                                        </Tippy>
                                        <Tippy content="Contact">
                                            <NavLink to="/apps/invoice/preview" className="flex hover:text-info">
                                                <IconBolt />
                                            </NavLink>
                                        </Tippy>
                                    </td>
                                </tr>
                                <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                    <td className="min-w-[150px] text-black dark:text-white">
                                        <div className="flex items-center">
                                            <span className="whitespace-nowrap">1st Class Scheduled/Intro Dance</span>
                                        </div>
                                    </td>
                                    <td className="text-primary">Cleo Kastner</td>
                                    <td>
                                        <Link to="/apps/invoice/preview">Melinda</Link>
                                    </td>
                                    <td>
                                        <div>01 DANCE</div>
                                        <div>Fund (5-7) Sec 4 Sat 9a</div>
                                    </td>
                                    <td className="flex gap-1 staff-center w-max mx-auto ">
                                        <Tippy content="View">
                                            <NavLink to="/apps/invoice/preview" className="flex hover:text-primary">
                                                <IconEye />
                                            </NavLink>
                                        </Tippy>
                                        <Tippy content="Contact">
                                            <NavLink to="/apps/invoice/preview" className="flex hover:text-info">
                                                <IconBolt />
                                            </NavLink>
                                        </Tippy>
                                    </td>
                                </tr>
                                <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                    <td className="min-w-[150px] text-black dark:text-white">
                                        <div className="flex items-center">
                                            <span className="whitespace-nowrap">1st Class Scheduled/Intro Dance</span>
                                        </div>
                                    </td>
                                    <td className="text-primary">Cleo Kastner</td>
                                    <td>
                                        <Link to="/apps/invoice/preview">Melinda</Link>
                                    </td>
                                    <td>
                                        <div>01 DANCE</div>
                                        <div>Fund (5-7) Sec 4 Sat 9a</div>
                                    </td>
                                    <td className="flex gap-1 staff-center w-max mx-auto ">
                                        <Tippy content="View">
                                            <NavLink to="/apps/invoice/preview" className="flex hover:text-primary">
                                                <IconEye />
                                            </NavLink>
                                        </Tippy>
                                        <Tippy content="Contact">
                                            <NavLink to="/apps/invoice/preview" className="flex hover:text-info">
                                                <IconBolt />
                                            </NavLink>
                                        </Tippy>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="panel h-full w-full">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Students Schedule</h5>
                        <div className="">
                            <IconPrinter className="w-5 h-5 text-black/70 dark:text-white/70 hover:!text-primary" />
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th className="ltr:rounded-l-md rtl:rounded-r-md">Pipeline Step</th>
                                    <th>Name</th>
                                    <th>Parent Name</th>
                                    <th>Class</th>
                                    <th className="ltr:rounded-r-md rtl:rounded-l-md">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                    <td className="min-w-[150px] text-black dark:text-white">
                                        <div className="flex items-center">
                                            <span className="whitespace-nowrap">1st Class Scheduled/Intro Dance</span>
                                        </div>
                                    </td>
                                    <td className="text-primary">Cleo Kastner</td>
                                    <td>
                                        <Link to="/apps/invoice/preview">Melinda</Link>
                                    </td>
                                    <td>
                                        <div>01 DANCE</div>
                                        <div>Fund (5-7) Sec 4 Sat 9a</div>
                                    </td>
                                    <td className="flex gap-1 staff-center w-max mx-auto ">
                                        <Tippy content="View">
                                            <NavLink to="/apps/invoice/preview" className="flex hover:text-primary">
                                                <IconEye />
                                            </NavLink>
                                        </Tippy>
                                        <Tippy content="Contact">
                                            <NavLink to="/apps/invoice/preview" className="flex hover:text-info">
                                                <IconBolt />
                                            </NavLink>
                                        </Tippy>
                                    </td>
                                </tr>
                                <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                    <td className="min-w-[150px] text-black dark:text-white">
                                        <div className="flex items-center">
                                            <span className="whitespace-nowrap">1st Class Scheduled/Intro Dance</span>
                                        </div>
                                    </td>
                                    <td className="text-primary">Cleo Kastner</td>
                                    <td>
                                        <Link to="/apps/invoice/preview">Melinda</Link>
                                    </td>
                                    <td>
                                        <div>01 DANCE</div>
                                        <div>Fund (5-7) Sec 4 Sat 9a</div>
                                    </td>
                                    <td className="flex gap-1 staff-center w-max mx-auto ">
                                        <Tippy content="View">
                                            <NavLink to="/apps/invoice/preview" className="flex hover:text-primary">
                                                <IconEye />
                                            </NavLink>
                                        </Tippy>
                                        <Tippy content="Contact">
                                            <NavLink to="/apps/invoice/preview" className="flex hover:text-info">
                                                <IconBolt />
                                            </NavLink>
                                        </Tippy>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
