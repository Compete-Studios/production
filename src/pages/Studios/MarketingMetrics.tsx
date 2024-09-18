import { Suspense, useEffect, useState } from 'react';
import Dropdown from '../../components/Dropdown';
import { UserAuth } from '../../context/AuthContext';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import IconMail from '../../components/Icon/IconMail';
import IconMessage2 from '../../components/Icon/IconMessage2';
import IconUsers from '../../components/Icon/IconUsers';

import 'tippy.js/dist/tippy.css';
import { getMonthlyLimit, getNumberOfEmailsSentByStudio } from '../../functions/emails';
import { convertPhone, formatDate, formatForEmails, showMessage } from '../../functions/shared';
import { getCountOfActiveProspects, getCountOfInactiveOrInactive, getNumberOfTextsSentByStudioHelper } from '../../functions/api';
import { Link } from 'react-router-dom';
import PageVisits from '../../components/PageVisits';
import IconEye from '../../components/Icon/IconEye';
import { getNumberOfStudentBirthDays } from '../../functions/manuals';
import { getWebsiteCount } from '../../firebase/firebaseFunctions';
import CopyToClipboard from 'react-copy-to-clipboard';
import { REACT_API_BASE_URL } from '../../constants';

export default function MarketingMetrics() {
    const { classes, staff, suid, studioOptions, students, studioInfo }: any = UserAuth();
    const formatDateForPP = (date: any) => {
        const newDate = new Date(date);
        const formattedDate = newDate.toISOString().substr(0, 10);
        return formattedDate;
    };
    const [prospectCount, setProspectCount] = useState(0);
    const [loadingDashboard, setLoadingDashboard] = useState<any>({
        students: true,
        classes: true,
        staff: true,
        prospectCount: true,
    });
    const [loadingActiveStudents, setLoadingActiveStudents] = useState(true);
    const [loadingEmails, setLoadingEmails] = useState(true);
    const [loadingEmailCount, setLoadingEmailCount] = useState(true);
    const [loadingTexts, setLoadingTexts] = useState(true);
    const [numberOfEmails, setNumberOfEmails] = useState(0);
    const [monthlyEmailLimit, setMonthlyEmailLimit] = useState(0);
    const [numberOfTexts, setNumberOfTexts] = useState(0);
    const [monthlyTextLimit, setMonthlyTextLimit] = useState(0);
    const [totalBirthdays, setTotalBirthdays] = useState(0);
    const [count, setCount] = useState(0);
    const [showCopyLink, setShowCopyLink] = useState(false);

    useEffect(() => {
        if (studioOptions) {
            setMonthlyTextLimit(studioOptions?.MonthlyTextVolume);
        }
    }, [studioOptions]);

    const getAlltheEmails = async () => {
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
    };

    const getMonthlyEmailLimit = async () => {
        const response = await getMonthlyLimit(suid);
        if (response) {
            setMonthlyEmailLimit(response?.limit?.recordset[0]?.MonthlyEmailVolume);
            localStorage.setItem('monthlyEmailLimit', response?.limit?.recordset[0]?.MonthlyEmailVolume);
            setLoadingEmails(false);
        } else {
            setMonthlyEmailLimit(0);
            localStorage.setItem('monthlyEmailLimit', '0');
            setLoadingEmails(false);
        }
    };

    useEffect(() => {
        getAlltheEmails();
        getMonthlyEmailLimit();
    }, [suid]);

    const getTotalTexts = async () => {
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
            localStorage.setItem('numberOfTexts', '0');
            setLoadingTexts(false);
        }
    };

    useEffect(() => {
        getTotalTexts();
    }, [suid]);

    const handleGetBirthdayCount = async () => {
        try {
            const response = await getNumberOfStudentBirthDays(suid);
            console.log(response);
            if (response) {
                setTotalBirthdays(response);
            } else {
                setTotalBirthdays(0);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetBirthdayCount();
    }, [suid]);

    const handleGetProspectCount = async () => {
        try {
            const response = await getCountOfActiveProspects(suid);
            if (response.count) {
                setProspectCount(response.count);
                setLoadingDashboard({ ...loadingDashboard, prospectCount: false });
            } else {
                setProspectCount(0);
                setLoadingDashboard({ ...loadingDashboard, prospectCount: false });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetProspectCount();
    }, [suid]);

    const handleGetCount = async () => {
        try {
            const res = await getWebsiteCount(suid);
            if (res.status === 200) {
                setCount(res.count);
                setShowCopyLink(false);
            } else if (res.status === 404) {
                setShowCopyLink(true);
                setCount(0);
            } else {
                setCount(0);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        handleGetCount();
    }, [suid]);

    const scriptToCopy = `
    <script>
      fetch("${REACT_API_BASE_URL}/manual/countVisit/${suid}", {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  </script>
  `;

    return (
        <div className="grid sm:grid-cols-2 2xl:grid-cols-4 gap-4 mb-6">
            <div className="col-span-full">
                <dl className="grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-6">
                    {/* Prospects */}
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white">
                        <div className="badge bg-white/30">Prospects In Pipelines</div>

                        <div className="text-center mt-2">
                            <div className="text-2xl font-bold text-center">
                                {' '}
                                {loadingDashboard.prospectCount ? <div className="animate-pulse w-10 h-10 bg-white/30 rounded-full"></div> : prospectCount}{' '}
                            </div>
                        </div>
                    </div>
                    {/* Students */}
                    <div className="p-3 bg-gradient-to-r from-primary to-success text-white">
                        <div className="badge bg-white/30">Total Active Students</div>

                        <div className="tect-center mt-2">
                            <div className="text-2xl font-bold ltr:mr-3 rtl:ml-3"> {students?.length || 0} </div>
                        </div>
                    </div>
                    {/* Classes */}
                    <div className="p-3 bg-gradient-to-r from-violet-500 to-violet-400 text-white">
                        <div className="badge bg-white/30">Classes</div>

                        <div className="text-center mt-2">
                            <div className="text-2xl font-bold ltr:mr-3 rtl:ml-3"> {classes?.length || 0} </div>
                        </div>
                    </div>

                    {/* Staff */}
                    <div className="p-3 bg-gradient-to-r from-amber-500 to-amber-400 text-white">
                        <div className="badge bg-white/30">Staff Members</div>

                        <div className="text-center mt-2">
                            <div className="text-2xl font-bold ltr:mr-3 rtl:ml-3"> {staff?.length || 0} </div>
                        </div>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                        <div className="badge bg-white/30">Website Visits</div>
                        {/*  */}

                        {showCopyLink ? (
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <CopyToClipboard
                                    text={scriptToCopy}
                                    onCopy={(text, result) => {
                                        if (result) {
                                            showMessage('Copied successfully! Paste it in your website');
                                        }
                                    }}
                                >
                                    <button className=" hover:text-gray-200 mt-2 flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                            <path
                                                fill-rule="evenodd"
                                                d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                                            />
                                        </svg>
                                        Copy Code
                                    </button>
                                </CopyToClipboard>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-globe" viewBox="0 0 16 16">
                                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z" />
                                </svg>
                                <div className="text-2xl font-bold "> {count} </div>
                            </div>
                        )}
                    </div>
                    <div className="p-3 bg-gradient-to-r from-red-500  to-red-400 text-white">
                        <div className="badge bg-white/30">Birthdays this Month</div>

                        <div className="flex items-center justify-center gap-2 mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cake2-fill" viewBox="0 0 16 16">
                                <path d="m2.899.804.595-.792.598.79A.747.747 0 0 1 4 1.806v4.886q-.532-.09-1-.201V1.813a.747.747 0 0 1-.1-1.01ZM13 1.806v4.685a15 15 0 0 1-1 .201v-4.88a.747.747 0 0 1-.1-1.007l.595-.792.598.79A.746.746 0 0 1 13 1.806m-3 0a.746.746 0 0 0 .092-1.004l-.598-.79-.595.792A.747.747 0 0 0 9 1.813v5.17q.512-.02 1-.055zm-3 0v5.176q-.512-.018-1-.054V1.813a.747.747 0 0 1-.1-1.01l.595-.79.598.789A.747.747 0 0 1 7 1.806" />
                                <path d="M4.5 6.988V4.226a23 23 0 0 1 1-.114V7.16c0 .131.101.24.232.25l.231.017q.498.037 1.02.055l.258.01a.25.25 0 0 0 .26-.25V4.003a29 29 0 0 1 1 0V7.24a.25.25 0 0 0 .258.25l.259-.009q.52-.018 1.019-.055l.231-.017a.25.25 0 0 0 .232-.25V4.112q.518.047 1 .114v2.762a.25.25 0 0 0 .292.246l.291-.049q.547-.091 1.033-.208l.192-.046a.25.25 0 0 0 .192-.243V4.621c.672.184 1.251.409 1.677.678.415.261.823.655.823 1.2V13.5c0 .546-.408.94-.823 1.201-.44.278-1.043.51-1.745.696-1.41.376-3.33.603-5.432.603s-4.022-.227-5.432-.603c-.702-.187-1.305-.418-1.745-.696C.408 14.44 0 14.046 0 13.5v-7c0-.546.408-.94.823-1.201.426-.269 1.005-.494 1.677-.678v2.067c0 .116.08.216.192.243l.192.046q.486.116 1.033.208l.292.05a.25.25 0 0 0 .291-.247M1 8.82v1.659a1.935 1.935 0 0 0 2.298.43.935.935 0 0 1 1.08.175l.348.349a2 2 0 0 0 2.615.185l.059-.044a1 1 0 0 1 1.2 0l.06.044a2 2 0 0 0 2.613-.185l.348-.348a.94.94 0 0 1 1.082-.175c.781.39 1.718.208 2.297-.426V8.833l-.68.907a.94.94 0 0 1-1.17.276 1.94 1.94 0 0 0-2.236.363l-.348.348a1 1 0 0 1-1.307.092l-.06-.044a2 2 0 0 0-2.399 0l-.06.044a1 1 0 0 1-1.306-.092l-.35-.35a1.935 1.935 0 0 0-2.233-.362.935.935 0 0 1-1.168-.277z" />
                            </svg>
                            <div className="text-2xl font-bold "> {totalBirthdays} </div>
                        </div>
                    </div>

                    {/* <div className="panel bg-gradient-to-r from-zinc-600 to-black text-white">
                        <div className="badge bg-white/30">Total Emails Sent</div>

                        <div className="flex items-center mt-2">
                            <div className="text-2xl font-bold  "> {numberOfEmails || 0} </div>
                        </div>
                        {loadingEmails ? (
                            <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                <div className="bg-gradient-to-r from-[#7579ff] to-[#b224ef] w-1/2 h-full rounded-full" style={{ width: `100%` }}></div>
                            </div>
                        ) : (
                            <>
                                <div className="rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                    <div
                                        className="bg-gradient-to-r from-[#7579ff] to-[#b224ef] w-1/2 h-full rounded-full"
                                        style={{ width: `${convertToPercentage(numberOfEmails, monthlyEmailLimit)}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-right">
                                    {((numberOfEmails / monthlyEmailLimit) * 100).toFixed(0)}% of {monthlyEmailLimit}
                                </div>
                            </>
                        )}
                        {!(monthlyEmailLimit > 0) && <button className="text-red-50 hover:text-red-200">Click Here to Increase Email Limit</button>}
                    </div>
                    <div className="panel bg-gradient-to-r from-black to-zinc-600 text-white">
                        <div className="badge bg-white/30">Total Texts Sent</div>
                        <div className="flex items-center mt-2">
                            <div className="text-2xl font-bold ltr:mr-3 rtl:ml-3"> {numberOfTexts} </div>
                           
                        </div>
                        {loadingTexts ? (
                            <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                <div className="bg-gradient-to-r from-[#3cba92] to-[#0ba360] w-full h-full rounded-full animate-pulse" style={{ width: `100%` }}></div>
                            </div>
                        ) : (
                            <>
                            <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                <div
                                    className="bg-gradient-to-r from-[#3cba92] to-[#0ba360] w-full h-full rounded-full"
                                    style={{ width: `${convertToPercentage(numberOfTexts, monthlyTextLimit)}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-right">
                                {((numberOfTexts / monthlyTextLimit) * 100).toFixed(0)}% of {monthlyTextLimit}
                            </div>
                            </>
                        )}
                        {monthlyTextLimit === 0 && <button className="text-danger hover:text-red-800">Click Here to Increase Text Limit</button>}
                    </div> */}
                </dl>{' '}
            </div>
        </div>
    );
}
