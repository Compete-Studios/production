import { Link } from 'react-router-dom';
import Dropdown from '../../components/Dropdown';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Fragment, useEffect, useState } from 'react';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import IconEye from '../../components/Icon/IconEye';

import { UserAuth } from '../../context/AuthContext';
import PageVisits from '../PageVisits';
import Schedules from '../../pages/Marketing/Schedules';
import { getLatePaymentCount, getNumberOfStudentsWithoutPaymentSchedules, getStudentIdFromBillingId } from '../../functions/manuals';
import { formatDate } from '@fullcalendar/core';
import { convertToUserLocalDate, handleGetTimeZoneOfUser } from '../../functions/dates';
import IconNotes from '../Icon/IconNotes';
import Tippy from '@tippyjs/react';
import IconMinusCircle from '../Icon/IconMinusCircle';
import QuickPayModal from '../../pages/Payments/QuickPayModal';
import { Tab } from '@headlessui/react';
import { hashTheID, showWarningMessage } from '../../functions/shared';
import { getAllActivePaymentSchedules } from '../../functions/api';
import ViewStudentSlider from '../ActionSliders/ViewStudentSlider';
import { ignorePayment } from '../../functions/payments';
import LatePaymentPipeline from '../../pages/Payments/LatePaymentPipeline';
import LatePayments from '../PaymentDashboard/LatePayments';
import PaySchedules from '../PaymentDashboard/PaySchedules';
import SearchPayments from '../../pages/Payments/SearchPayments';
import ViewPaymentDetails from '../PaymentDashboard/ViewPaymentDetails';
import UpdateNotes from '../PaymentDashboard/UpdateNotes';
import UpdatePaymentSchedule from '../PaymentDashboard/UpdatePaymentSchedule';
import BillingAccounts from '../PaymentDashboard/BillingAccounts';

const Studio = () => {
    const { students, suid }: any = UserAuth();
    const [payments, setPayments] = useState<any>([]);
    const [antPayments, setAntPayments] = useState<any>(null);
    const [total, setTotal] = useState<any>(0);
    const [noActiveStudents, setNoActiveStudents] = useState<any>([]);
    const [toExpire, setToExpire] = useState<any>([]);
    const [loadingDashboard, setLoadingDashboard] = useState<any>({
        students: true,
        classes: true,
        staff: true,
        total: true,
    });
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Payment Dashboard'));
    });

    const handleGetLatePayments = async () => {
        try {
            const res = await getLatePaymentCount(suid);
            setPayments(res);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        handleGetLatePayments();
    }, [suid]);

    const handleGetStudentsWithoutSchedules = async () => {
        try {
            const res = await getNumberOfStudentsWithoutPaymentSchedules(suid);
            setNoActiveStudents(res);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        handleGetStudentsWithoutSchedules();
    }, [suid]);

    const handleReturnDataWithEndDateInNext30Days = (data: any) => {
        const next30Days = new Date();
        next30Days.setDate(next30Days.getDate() + 30);

        return data.filter((item: any) => {
            const endDate = new Date(item.EndDate);
            const startDate = new Date(item.StartDate);

            // Compare the end date with next 30 days and ensure start and end dates are different
            return endDate < next30Days && endDate.getTime() !== startDate.getTime();
        });
    };

    const handlegetExpireSchedules = async () => {
        try {
            const res = await getAllActivePaymentSchedules(suid);
            if (res.Response.length > 0) {
                const dataToSort: any = handleReturnDataWithEndDateInNext30Days(res.Response);

                let expstudents = [];
                for (let i = 0; i < dataToSort.length; i++) {
                    const studentRes = await getStudentIdFromBillingId(dataToSort[i].CustomerId);

                    const student = students.find((student: any) => student.PaysimpleCustomerId === studentRes[0].PaysimpleCustomerId);
                    if (student) {
                        expstudents.push({
                            ...dataToSort[i],
                            CustomerName: student.Name,
                            StudentID: student.Student_ID,
                        });
                    }
                }
                setToExpire(expstudents);
            } else {
                console.log('No data found');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        handlegetExpireSchedules();
    }, [suid]);

    const currentDate = new Date();
    const thisMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const [startDate, setStartDate] = useState(currentDate);
    const [endDate, setEndDate] = useState(thisMonthEndDate);

    const getPayments = async (startDate: any, endDate: any, studioId: string) => {
        setLoadingDashboard({
            ...loadingDashboard,
            total: true,
        });
        try {
            //Get all active payment schedules for the studio
            const activeSchedules = await getAllActivePaymentSchedules(studioId);
            //For all active schedules, filter out the ones that are within the given date range
            if (activeSchedules.Meta.HttpStatus === 'OK' && activeSchedules.Meta.PagingDetails.TotalItems > 0) {
                const filteredPayments = filterPaymentsByDate(activeSchedules.Response, startDate, endDate);
                setAntPayments(filteredPayments.filteredPayments);
                setTotal(filteredPayments.totalAmount);
            } else {
                setAntPayments([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingDashboard({
                ...loadingDashboard,
                total: false,
            });
        }
    };

    const filterPaymentsByDate = (payments: any[], start: any, end: any) => {
        // Convert start and end to Date objects for comparison
        const startDate = new Date(start);
        const endDate = new Date(end);

        let totalAmount = 0;

        const filteredPayments = payments.filter((payment) => {
            const paymentStartDate = new Date(payment.StartDate);
            const paymentEndDate = payment.EndDate ? new Date(payment.EndDate) : null;
            const executionDay = payment.ExecutionFrequencyParameter;

            // Check if the payment is active within the given range
            const isActive = (!paymentEndDate && paymentStartDate <= endDate) || (paymentEndDate && paymentStartDate <= endDate && paymentEndDate >= startDate);

            if (!isActive) {
                return false;
            }

            // Check if the payment will run on the specified days within the date range
            let current = new Date(startDate);
            let paymentCount = 0;

            while (current <= endDate) {
                const month = current.getMonth();
                const year = current.getFullYear();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const runDay = executionDay > daysInMonth ? daysInMonth : executionDay;

                const runDate = new Date(year, month, runDay);
                if (runDate >= startDate && runDate <= endDate) {
                    paymentCount++;
                }

                // Move to the next month
                current.setMonth(current.getMonth() + 1);
            }

            // Calculate the total amount for this payment
            totalAmount += payment.PaymentAmount * paymentCount;

            return paymentCount > 0;
        });

        return {
            filteredPayments,
            totalAmount,
        };
    };

    useEffect(() => {
        getPayments(startDate, endDate, suid);
    }, [suid]);

    return (
        <div>
            {/* <div className="grid grid-cols-4 gap-2">
                <QuickPayModal />
            </div> */}

            <div className="grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4 ">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white">
                    <div className="badge bg-white/30">Late Payments</div>

                    <div className="text-center mt-2">
                        <div className="text-2xl font-bold text-center">{payments?.length || 0}</div>
                    </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-red-500 to-red-400 text-white ">
                    <div className="badge bg-white/30">Outstanding Total</div>

                    <div className="tect-center mt-2">
                        <div className="text-2xl font-bold ltr:mr-3 rtl:ml-3"> ${payments?.reduce((acc: any, payment: any) => acc + parseInt(payment.Amount), 0) || 0} </div>
                    </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-600 to-green-500 text-white ">
                    <div className="badge bg-white/30">Anticipated Payments</div>

                    <div className="tect-center mt-2">
                        <div className="text-2xl font-bold ltr:mr-3 rtl:ml-3"> ${total || 0}</div>
                    </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white ">
                    <div className="badge bg-white/30">Estimated # of Payments</div>

                    <div className="tect-center mt-2">
                        <div className="text-2xl font-bold ltr:mr-3 rtl:ml-3"> {antPayments?.length || 0} </div>
                    </div>
                </div>
                {/* <div className="panel space-y-3">
                        <button type="button" className="btn btn-primary w-full">
                            Primary
                        </button>
                        <button type="button" className="btn btn-primary w-full">
                            Primary
                        </button>
                        <button type="button" className="btn btn-primary w-full">
                            Primary
                        </button>
                        <button type="button" className="btn btn-primary w-full">
                            Primary
                        </button>
                    </div> */}
            </div>

            <div className="">
                {/*  Recent Transactions  */}
                <div className="">
                    <div className="">
                        <Tab.Group>
                            <div className="mb-0">
                                <Tab.List className="mt-3 flex flex-wrap gap-1 justify-start border-b border-white-light dark:border-[#191e3a]">
                                    <Tab as={Fragment}>
                                        {({ selected }) => (
                                            <button
                                                className={`${
                                                    selected ? '!border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black bg-white ' : 'bg-white/40 hover:text-success'
                                                }  -mb-[1px] block border border-transparent p-3.5 py-2 hover:border-white-light hover:border-b-white dark:hover:border-[#191e3a] dark:hover:border-b-black rounded-t-lg`}
                                            >
                                                Late Payments
                                            </button>
                                        )}
                                    </Tab>
                                    <Tab as={Fragment}>
                                        {({ selected }) => (
                                            <button
                                                className={`${
                                                    selected ? '!border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black bg-white ' : 'bg-white/40 hover:text-success'
                                                }  -mb-[1px] block border border-transparent p-3.5 py-2 hover:border-white-light hover:border-b-white dark:hover:border-[#191e3a] dark:hover:border-b-black rounded-t-lg`}
                                            >
                                                Late Payment Pipeline
                                            </button>
                                        )}
                                    </Tab>
                                    <Tab as={Fragment}>
                                        {({ selected }) => (
                                            <button
                                                className={`${
                                                    selected ? '!border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black bg-white ' : 'bg-white/40 hover:text-success'
                                                }  -mb-[1px] block border border-transparent p-3.5 py-2 hover:border-white-light hover:border-b-white dark:hover:border-[#191e3a] dark:hover:border-b-black rounded-t-lg`}
                                            >
                                                Students Without Schedules
                                            </button>
                                        )}
                                    </Tab>
                                    <Tab as={Fragment}>
                                        {({ selected }) => (
                                            <button
                                                className={`${
                                                    selected ? '!border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black bg-white ' : 'bg-white/40 hover:text-success'
                                                }  -mb-[1px] block border border-transparent p-3.5 py-2 hover:border-white-light hover:border-b-white dark:hover:border-[#191e3a] dark:hover:border-b-black rounded-t-lg`}
                                            >
                                                Expiring Schedules
                                            </button>
                                        )}
                                    </Tab>
                                    <Tab as={Fragment}>
                                        {({ selected }) => (
                                            <button
                                                className={`${
                                                    selected ? '!border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black bg-white ' : 'bg-white/40 hover:text-success'
                                                }  -mb-[1px] block border border-transparent p-3.5 py-2 hover:border-white-light hover:border-b-white dark:hover:border-[#191e3a] dark:hover:border-b-black rounded-t-lg`}
                                            >
                                                Payment Schedules
                                            </button>
                                        )}
                                    </Tab>
                                    <Tab as={Fragment}>
                                        {({ selected }) => (
                                            <button
                                                className={`${
                                                    selected ? '!border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black bg-white ' : 'bg-white/40 hover:text-success'
                                                }  -mb-[1px] block border border-transparent p-3.5 py-2 hover:border-white-light hover:border-b-white dark:hover:border-[#191e3a] dark:hover:border-b-black rounded-t-lg`}
                                            >
                                                Search Payments
                                            </button>
                                        )}
                                    </Tab>
                                    <Tab as={Fragment}>
                                        {({ selected }) => (
                                            <button
                                                className={`${
                                                    selected ? '!border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black bg-white ' : 'bg-white/40 hover:text-success'
                                                }  -mb-[1px] block border border-transparent p-3.5 py-2 hover:border-white-light hover:border-b-white dark:hover:border-[#191e3a] dark:hover:border-b-black rounded-t-lg`}
                                            >
                                                Billing Accounts
                                            </button>
                                        )}
                                    </Tab>
                                </Tab.List>
                            </div>

                            <Tab.Panels>
                                <Tab.Panel>
                                    <LatePayments payments={payments} setPayments={setPayments} />
                                </Tab.Panel>
                                <Tab.Panel>
                                    <LatePaymentPipeline />
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div className="panel">
                                        <div className="mb-5 text-lg font-bold">Students Without Payment Schedules</div>
                                        <div className="table-responsive">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">NAME</th>

                                                        <th>CONTACT</th>
                                                        <th className="text-right">ACTIONS</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {noActiveStudents?.map((payment: any, index: number) => (
                                                        <tr key={index}>
                                                            <td className="font-semibold">
                                                                {' '}
                                                                {payment.First_Name} {payment.Last_Name}
                                                            </td>

                                                            <td className="whitespace-nowrap">
                                                                <div>{payment.email}</div>
                                                                <div>{payment.Phone}</div>
                                                            </td>
                                                            <td className="flex items-center gap-2">
                                                                <Tippy content="View Student">
                                                                    <Link to={`/students/view-student/${hashTheID(payment.Student_Id)}/${hashTheID(suid)}`} type="button" className="text-info ml-auto">
                                                                        <IconEye />
                                                                    </Link>
                                                                </Tippy>
                                                                <ViewStudentSlider student={payment} />
                                                                <Tippy content="Retry Payment">
                                                                    <Link to={`/payments/view-late-payment/${suid}/${payment.PaysimpleTransactionId}`} type="button" className="text-success">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="16"
                                                                            height="16"
                                                                            fill="currentColor"
                                                                            className="bi bi-credit-card-2-front"
                                                                            viewBox="0 0 16 16"
                                                                        >
                                                                            <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
                                                                            <path d="M2 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5" />
                                                                        </svg>
                                                                    </Link>
                                                                </Tippy>
                                                                <Tippy content="Ignore Payment">
                                                                    <Link to={`/payments/view-late-payment/${suid}/${payment.PaysimpleTransactionId}`} type="button" className="text-danger">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="16"
                                                                            height="16"
                                                                            fill="currentColor"
                                                                            className="bi bi-dash-circle"
                                                                            viewBox="0 0 16 16"
                                                                        >
                                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                                                        </svg>
                                                                    </Link>
                                                                </Tippy>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div className="panel rounded-t-none">
                                        <div className="mb-5 text-lg font-bold">Expiring Payments</div>
                                        <div className="table-responsive">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">ID</th>
                                                        <th>END DATE</th>
                                                        <th>STUDENT</th>
                                                        <th>AMOUNT</th>
                                                        <th className="text-right">ACTIONS</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {toExpire?.map((payment: any, index: number) => (
                                                        <tr key={index}>
                                                            <td className="font-semibold">#{payment.Id}</td>
                                                            <td className="whitespace-nowrap">{formatDate(payment.EndDate)}</td>
                                                            <td className="whitespace-nowrap">{payment.CustomerName}</td>
                                                            <td className="font-bold">${payment.PaymentAmount}</td>
                                                            <td className="flex items-center justify-end gap-2">
                                                                <ViewPaymentDetails payID={payment.Id} />
                                                                <UpdateNotes payID={payment.Id} />
                                                                <UpdatePaymentSchedule payID={payment.Id} />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <PaySchedules />
                                </Tab.Panel>
                                <Tab.Panel>
                                    <SearchPayments />
                                </Tab.Panel>
                                <Tab.Panel>
                                    <BillingAccounts />
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Studio;
