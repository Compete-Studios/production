import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconEye from '../Icon/IconEye';
import { useEffect, useState } from 'react';
import { getAllSchedulesByStatus } from '../../functions/paymentsAll';
import { UserAuth } from '../../context/AuthContext';
import { formatDate } from '@fullcalendar/core';
import IconNotes from '../Icon/IconNotes';
import { Link } from 'react-router-dom';
import { DataTable } from 'mantine-datatable';
import ViewPaymentDetails from './ViewPaymentDetails';
import UpdateNotes from './UpdateNotes';
import UpdatePaymentSchedule from './UpdatePaymentSchedule';
import PausePayment from './PausePayment';
import ResumeSchedule from './ResumeSchedule';

export default function PaySchedules() {
    const { suid }: any = UserAuth();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('Active');

    const [search, setSearch] = useState<any>('');

    const PAGE_SIZES = [10, 20, 30, 50, 100];

    //Skin: Striped
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState([]);
    const [recordsData, setRecordsData] = useState(initialRecords);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return schedules.filter((item: any) => {
                return (
                    item.Id.toString().includes(search.toLowerCase()) ||
                    item.CustomerFirstName.toLowerCase().includes(search.toLowerCase()) ||
                    item.CustomerLastName.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleGetSchedules = async (id: any) => {
        try {
            const res = await getAllSchedulesByStatus(id, status);
            setInitialRecords(res);
            setSchedules(res);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (suid) {
            handleGetSchedules(suid);
        }
    }, [suid, status]);

    return (
        <>
            <div className="panel">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Payment Schedules</h5>
                    <div className="flex items-center gap-1">
                        <select
                            className="form-select w-auto"
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setLoading(true);
                            }}
                        >
                            <option value="Active">Active</option>
                            <option value="Suspended">Paused</option>
                            <option value="Suspended">Suspended</option>
                            <option value="Expired">Expired</option>
                        </select>
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="datatables">
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <DataTable
                            striped
                            className="whitespace-nowrap table-striped"
                            records={recordsData}
                            columns={[
                                {
                                    accessor: 'Id',
                                    title: 'ID',
                                    render: ({ Id, ScheduleStatus }) => (
                                        <div className="flex items-center gap-1">
                                            <Link to={`/payment-schedule/${Id}`}>{Id}</Link>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'CustomerLastName',
                                    title: 'Billing Name',
                                    render: ({ CustomerFirstName, CustomerLastName }) => (
                                        <button className="whitespace-nowrap flex items-end gap-1 hover:text-amber-600">
                                            {CustomerLastName}, {CustomerFirstName} <IconNotes className="text-warning hover:text-amber-600" />
                                        </button>
                                    ),
                                },
                                {
                                    accessor: 'NextScheduleDate',
                                    title: 'Next Pay Date',
                                    render: ({ NextScheduleDate }) => formatDate(NextScheduleDate),
                                },
                                {
                                    accessor: 'StartDate',
                                    title: 'Start Date',
                                    render: ({ StartDate }) => formatDate(StartDate),
                                },
                                {
                                    accessor: 'EndDate',
                                    title: 'End Date',
                                    render: ({ EndDate }) => formatDate(EndDate),
                                },

                                {
                                    accessor: 'PaymentAmount',
                                    title: 'Payment Amount',
                                    render: ({ PaymentAmount }: any) => <div className="font-bold text-success">${PaymentAmount?.toFixed(2)}</div>,
                                },

                                {
                                    accessor: 'ScheduleStatus',
                                    title: 'Status',
                                    render: ({ ScheduleStatus }: any) => (
                                        <div
                                            className={`badge text-center
                    ${ScheduleStatus === 'Active' ? 'bg-success' : ScheduleStatus === 'Suspended' ? 'bg-warning' : 'bg-danger'}
                        `}
                                        >
                                            {ScheduleStatus}
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'Id',
                                    title: 'Action',
                                    textAlignment: 'center',
                                    render: ({ Id, ScheduleStatus }) => (
                                        <td className="flex items-center justify-end gap-2">
                                            <ViewPaymentDetails payID={Id} />
                                            <UpdateNotes payID={Id} />
                                            <UpdatePaymentSchedule payID={Id} />
                                            {ScheduleStatus === 'Active' ? <PausePayment payID={Id} /> : <ResumeSchedule payID={Id} />}
                                        </td>
                                    ),
                                },
                            ]}
                            totalRecords={initialRecords.length}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
