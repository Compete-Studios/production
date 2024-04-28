import { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '../../components/Dropdown';
import { UserAuth } from '../../context/AuthContext';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import IconMail from '../../components/Icon/IconMail';
import IconMessage2 from '../../components/Icon/IconMessage2';
import IconUsers from '../../components/Icon/IconUsers';

import 'tippy.js/dist/tippy.css';
import { REACT_API_BASE_URL } from '../../constants';
import { getMonthlyLimit, getNumberOfEmailsSentByStudio } from '../../functions/emails';
import { formatDate, formatForEmails } from '../../functions/shared';
import { getCountOfInactiveOrInactive, getNumberOfTextsSentByStudioHelper } from '../../functions/api';

export default function MarketingMetrics() {
    const { prospectIntros, suid }: any = UserAuth();
    const formatDateForPP = (date: any) => {
        const newDate = new Date(date);
        const formattedDate = newDate.toISOString().substr(0, 10);
        return formattedDate;
    };
    const [loadingActiveStudents, setLoadingActiveStudents] = useState(true);
    const [loadingEmails, setLoadingEmails] = useState(true);
    const [loadingEmailCount, setLoadingEmailCount] = useState(true);
    const [loadingTexts, setLoadingTexts] = useState(true);
    const [numberOfEmails, setNumberOfEmails] = useState(0);
    const [monthlyEmailLimit, setMonthlyEmailLimit] = useState(0);
    const [numberOfTexts, setNumberOfTexts] = useState(0);
    const [monthlyTextLimit, setMonthlyTextLimit] = useState(30000);
    const [numberOfActiveStudents, setNumberOfActiveStudents] = useState(0);

    const getAlltheEmails = async () => {
        const numOfEmails: any = localStorage.getItem('numberOfEmails');

        if (numOfEmails) {
            setNumberOfEmails(numOfEmails);
            setLoadingEmailCount(false);
        } else {
            const firstDateOfThisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const lastDateOfThisMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
            const data = {
                studioId: suid,
                startDate: formatForEmails(firstDateOfThisMonth),
                endDate: formatForEmails(lastDateOfThisMonth),
            };
            const response = await getNumberOfEmailsSentByStudio(data);
            if (response) {
                setNumberOfEmails(response.numberOfEmailsSent);
                localStorage.setItem('numberOfEmails', response.numberOfEmailsSent);
                setLoadingEmailCount(false);
            } else {
                setNumberOfEmails(0);
                localStorage.setItem('numberOfEmails', '0');
                setLoadingEmailCount(false);
            }
        }
    };

    const getMonthlyEmailLimit = async () => {
        const emailLimit: any = localStorage.getItem('monthlyEmailLimit');
        if (emailLimit) {
            setMonthlyEmailLimit(emailLimit);
            setLoadingEmails(false);
        } else {
            const response = await getMonthlyLimit(suid);
            if (response) {
                setMonthlyEmailLimit(response?.limit?.recordset[0]?.MonthlyEmailVolume);
                localStorage.setItem('monthlyEmailLimit', response?.limit?.recordset[0]?.MonthlyEmailVolume);
                setLoadingEmails(false);
            } else {
                setMonthlyEmailLimit(0);
                localStorage.setItem('monthlyEmailLimit', "0");
                setLoadingEmails(false);
            }
        }
    };

    const convertToPercentage = (num1: number, num2: number) => {
        return (num1 / num2) * 100;
    };

    useEffect(() => {
        getAlltheEmails();
        getMonthlyEmailLimit();
    }, [suid]);

    const getTotalTexts = async () => {
        const numOfTexts: any = localStorage.getItem('numberOfTexts');
        if (numOfTexts) {
            setNumberOfTexts(numOfTexts);
            setLoadingTexts(false);
        } else {
            const firstDateOfThisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const lastDateOfThisMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
            const data = {
                studioId: suid,
                startDate: formatForEmails(firstDateOfThisMonth),
                endDate: formatForEmails(lastDateOfThisMonth),
            };
            const response = await getNumberOfTextsSentByStudioHelper(data);

            if (response) {
                setNumberOfTexts(response);
                localStorage.setItem('numberOfTexts', response);
                setLoadingTexts(false);
            } else {
                setNumberOfTexts(0);
                localStorage.setItem('numberOfTexts', "0");
                setLoadingTexts(false);
            }
        }
    };

    useEffect(() => {
        getTotalTexts();
    }, [suid]);

    const getCountOfActiveStudents = async () => {
        const numOfStudents: any = localStorage.getItem('activeStudents');
        if (numOfStudents) {
            setNumberOfActiveStudents(numOfStudents);
            setLoadingActiveStudents(false);
        } else {
            const response = await getCountOfInactiveOrInactive(suid, 1);
            if (response) {
                setNumberOfActiveStudents(response?.recordset[0]?.CountOfStudents);
                localStorage.setItem('activeStudents', response?.recordset[0]?.CountOfStudents);
                setLoadingActiveStudents(false);
            } else {
                setNumberOfActiveStudents(0);
                localStorage.setItem('activeStudents', "0");
            }
        }
    };

    useEffect(() => {
        getCountOfActiveStudents();
    }, [suid]);

    return (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
            <div className="panel h-auto sm:col-span-2 xl:col-span-1 pb-0">
                <h5 className="font-semibold text-lg dark:text-white-light mb-5">Prospect Intros</h5>

                <PerfectScrollbar className="relative h-[160px] ltr:pr-3 rtl:pl-3 ltr:-mr-3 rtl:-ml-3 mb-4">
                    <div className="text-sm cursor-pointer">
                        {prospectIntros?.filter((intro: any) => formatDateForPP(intro.IntroDate) === formatDateForPP(new Date()))?.length < 1 ? (
                            <div className="text-center">
                                <p className="text-danger">No intros today</p>
                            </div>
                        ) : (
                            prospectIntros
                                ?.filter((intro: any) => formatDateForPP(intro.IntroDate) === formatDateForPP(new Date()))
                                ?.map((intro: any) => {
                                    return (
                                        <div key={intro.id} className="flex items-center py-1.5 relative group">
                                            <div className="bg-primary w-1.5 h-1.5 rounded-full ltr:mr-1 rtl:ml-1.5"></div>
                                            <div className="flex-1">
                                                {intro.FName} {intro.LName}
                                            </div>
                                            <div className="ltr:ml-auto rtl:mr-auto text-xs text-white-dark dark:text-gray-500">{formatDateForPP(intro.IntroDate)}</div>

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

            <div className="panel h-full sm:col-span-2 xl:col-span-2">
                <div className="flex items-center justify-between dark:text-white-light mb-5">
                    <h5 className="font-semibold text-lg">Marketing Summary</h5>
                    <div className="dropdown">
                        <Dropdown placement="bottom-end" button={<IconHorizontalDots className="w-5 h-5 text-black/70 dark:text-white/70 hover:!text-primary" />}>
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
                                <h6>
                                    Emails Sent <span className="text-secondary">({numberOfEmails}) </span>
                                </h6>
                                <p className="ltr:ml-auto rtl:mr-auto">{convertToPercentage(numberOfEmails, monthlyEmailLimit).toFixed(0)}%</p>
                            </div>
                            {loadingEmails && <div>Loading...</div>}
                            {loadingEmails ? (
                                <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                    <div className="bg-gradient-to-r from-[#7579ff] to-[#b224ef] w-1/2 h-full rounded-full" style={{ width: `100%` }}></div>
                                </div>
                            ) : (
                                <div className="rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                    <div
                                        className="bg-gradient-to-r from-[#7579ff] to-[#b224ef] w-1/2 h-full rounded-full"
                                        style={{ width: `${convertToPercentage(numberOfEmails, monthlyEmailLimit)}%` }}
                                    ></div>
                                </div>
                            )}
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
                                <h6>
                                    Text Messages Sent <span className="text-primary">({numberOfTexts}) </span>
                                </h6>
                                <p className="ltr:ml-auto rtl:mr-auto">{convertToPercentage(numberOfTexts, monthlyTextLimit).toFixed(0)}%</p>
                            </div>
                            {loadingTexts && <div>Loading...</div>}
                            {loadingTexts ? (
                                <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                    <div className="bg-gradient-to-r from-[#3cba92] to-[#0ba360] w-full h-full rounded-full animate-pulse" style={{ width: `100%` }}></div>
                                </div>
                            ) : (
                                <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                    <div
                                        className="bg-gradient-to-r from-[#3cba92] to-[#0ba360] w-full h-full rounded-full"
                                        style={{ width: `${convertToPercentage(numberOfTexts, monthlyTextLimit)}%` }}
                                    ></div>
                                </div>
                            )}
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
                                <h6>
                                    Active Students <span className="text-[#f09819]">({numberOfActiveStudents}) </span>
                                </h6>
                                <p className="ltr:ml-auto rtl:mr-auto">{((numberOfActiveStudents * 100) / 500).toFixed(0)}%</p>
                            </div>
                            {loadingActiveStudents && <div>Loading...</div>}
                            {loadingEmails ? (
                                <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                    <div className="bg-gradient-to-r from-[#f09819] to-[#ff5858] w-full h-full rounded-full" style={{ width: `100%` }}></div>
                                </div>
                            ) : (
                                <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                    <div
                                        className="bg-gradient-to-r from-[#f09819] to-[#ff5858] w-full h-full rounded-full"
                                        style={{ width: `${((numberOfActiveStudents * 100) / 500).toFixed(0)}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
