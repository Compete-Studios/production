import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconEye from '../Icon/IconEye';
import { useEffect, useState } from 'react';
import { listAllCustomers } from '../../functions/paymentsAll';
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
import ViewCustomer from './ViewCustomer';
import UpdateCustomer from './UpdateCustomer';
import ViewBillingInfo from './ViewBillingInfo';

export default function BillingAccounts() {
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
    const [totalRecords, setTotalRecords] = useState(0);

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
                return item.Id.toString().includes(search.toLowerCase()) || item.FirstName.toLowerCase().includes(search.toLowerCase()) || item.LastName.toLowerCase().includes(search.toLowerCase());
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleGetSchedules = async (id: any) => {
        try {
            const res = await listAllCustomers(id);
            setInitialRecords(res.Response);
            setSchedules(res.Response);
            setTotalRecords(res.Meta.PagingDetails.TotalItems);
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
                    <h5 className="font-semibold text-lg dark:text-white-light">
                        Your Billing Customers
                        <span className="text-sm text-gray-500 ml-2">({`Showing  ${initialRecords?.length} of ${totalRecords} billing accounts`})</span>
                    </h5>
                    <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
                                    accessor: 'LastName',
                                    title: 'Billing Name',
                                    render: ({ FirstName, LastName }) => (
                                        <button className="whitespace-nowrap flex items-end gap-1 hover:text-amber-600">
                                            {LastName}, {FirstName} <IconNotes className="text-warning hover:text-amber-600" />
                                        </button>
                                    ),
                                },
                                {
                                    accessor: 'Email',
                                    title: 'Contact',
                                    render: ({ Email, Phone }) => (
                                        <div>
                                            <div>{Email}</div>
                                            <div>{Phone}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'Id',
                                    title: 'ID',
                                    render: ({ Id }: any) => Id,
                                },
                                {
                                    accessor: 'Action',
                                    title: 'Action',
                                    textAlignment: 'right',
                                    render: ({ Id, ScheduleStatus }) => (
                                        <td className="flex items-center justify-end gap-2">
                                            <ViewCustomer customerID={Id} />
                                            <UpdateNotes payID={Id} />
                                            <UpdateCustomer customerID={Id} />
                                            <ViewBillingInfo customerID={Id} />
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
