import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import IconBell from '../../components/Icon/IconBell';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { getPayments } from '../../functions/api';
import { UserAuth } from '../../context/AuthContext';
import { formatDate, hashThePayID, statusCSS } from '../../functions/shared';
import IconEye from '../../components/Icon/IconEye';
import { Link } from 'react-router-dom';
import Hashids from 'hashids';

const rowData: any = [];
const SearchPayments = () => {
    const { suid }: any = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Search Payments'));
    });
    const hashids = new Hashids();
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'id'));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [tempData, setTempData] = useState(initialRecords);
    const [search, setSearch] = useState('');
    // const set 7 days ago
    const [startDate, setStartDate] = useState<any>(new Date(new Date().setDate(new Date().getDate() - 7)));
    const [endDate, setEndDate] = useState(new Date());
    const [status, setStatus] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });

    const [payments, setPayments] = useState<any>([]);
    const [settledPayments, setSettledPayments] = useState<any>(0);

    

    const handleCountSettledPayments = (payments: any) => {
        const totalSettledPayments = payments.filter((payment: any) => payment.Status === 'Settled');
        setSettledPayments(totalSettledPayments.length);
    };

    useEffect(() => {
        handleCountSettledPayments(payments);
    }, [payments]);

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
            return tempData.filter((item) => {
                return (
                    item.id.toString().includes(search.toLowerCase()) ||
                    item.firstName.toLowerCase().includes(search.toLowerCase()) ||
                    item.lastName.toLowerCase().includes(search.toLowerCase()) ||
                    item.company.toLowerCase().includes(search.toLowerCase()) ||
                    item.email.toLowerCase().includes(search.toLowerCase()) ||
                    item.age.toString().toLowerCase().includes(search.toLowerCase()) ||
                    item.dob.toLowerCase().includes(search.toLowerCase()) ||
                    item.phone.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortStatus]);

    const [minAge, setMinAge] = useState<any>('');
    const [maxAge, setMaxAge] = useState<any>('');

    useEffect(() => {
        let dt = rowData;
        if (minAge !== '' && minAge !== null) {
            dt = dt.filter((d: any) => d.age >= Number(minAge));
        }
        if (maxAge !== '' && maxAge !== null) {
            dt = dt.filter((d: any) => d.age <= Number(maxAge));
        }
        if (minAge || maxAge) {
            setInitialRecords(dt);
            setTempData(dt);
        }
    }, [minAge, maxAge]);

    const handleConvertDateToYYYYMMDD = (date: any) => {
        const newDate = new Date(date);
        const formattedDate = newDate.toISOString().substr(0, 10);
        return formattedDate;
    };

    const handleSearch = async () => {
        const searchStartDate = handleConvertDateToYYYYMMDD(startDate);
        const searchEndDate = handleConvertDateToYYYYMMDD(endDate);
        const searchData = {
            suid,
            searchStartDate,
            searchEndDate,
            status,
        };
        try {
            getPayments(suid, searchStartDate, searchEndDate, status).then((response) => {
                if (response.Response && response.Response.length === 0) {
                    setPayments([]);
                    return;
                } else if (!response.Response) {
                    setPayments([]);
                } else {
                    setPayments(response.Response);
                }
            });
        } catch (error) {
            console.error(error);
        } finally {
            // setLoading(false);
            console.log('done');
        }
    };


    useEffect(() => {
        getPayments(suid, startDate, endDate, status)
            .then((response) => {
                if (!response || !response.Response || response.Response.length === 0) {
                    setPayments([]);
                    setLoading(false);
                } else {
                    setPayments(response.Response);
                    setLoading(false);
                }
            })
            .catch((error) => {
                // Handle error if the request fails
                console.error('Error fetching payments:', error);
                setLoading(false);
                setPayments([]);
            });
    }, []);

    console.log(payments, 'payments');

    return (
        <div>
            {/* <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                    <IconBell />
                </div>
                <span className="ltr:mr-3 rtl:ml-3">Documentation: </span>
                <a href="https://www.npmjs.com/package/mantine-datatable" target="_blank" className="block hover:underline">
                    https://www.npmjs.com/package/mantine-datatable
                </a>
            </div> */}
            <div className="panel ">
                <div className="mb-4.5 flex md:items-center md:flex-row flex-col gap-5">
                    <div className="flex items-center gap-5">
                        <h2 className="text-xl">Studio Payment History</h2>
                    </div>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <div className="flex items-center gap-5">
                            <div className="md:flex-auto flex-1">
                                <label className="form-label">Start Date</label>
                                <Flatpickr value={startDate} options={{ dateFormat: 'm-d-Y', position: 'auto right' }} className="form-input" onChange={(date: any) => setStartDate(date)} />
                            </div>
                            <div className="md:flex-auto flex-1">
                                <label className="form-label">End Date</label>
                                <Flatpickr value={endDate} options={{ dateFormat: 'm-d-Y', position: 'auto right' }} className="form-input" onChange={(date: any) => setEndDate(date)} />
                            </div>
                            <div className="md:flex-auto flex-1">
                                <label className="form-label">Status</label>
                                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="">All</option>
                                    <option value="pending">Pending</option>
                                    <option value="chargeback">Chargeback</option>
                                    <option value="posted">Posted</option>
                                    <option value="authorized">Authorized</option>
                                    <option value="failed">Failed</option>
                                    <option value="refundsettled">Refund Settled</option>
                                    <option value="returned">Returned</option>
                                    <option value="reversed">Reversed</option>
                                    <option value="reversensf">Reverse NSF</option>
                                    <option value="reverseposted">Reverse Posted</option>
                                    <option value="settled">Settled</option>
                                    <option value="voided">Voided</option>
                                </select>
                            </div>
                            <div className="md:flex-auto flex-1">
                                <label className="form-label text-transparent ">search</label>
                                <button type="button" className="btn btn-primary w-full" onClick={handleSearch}>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <p>
                    Total Settled Payments: <span className="font-bold">{settledPayments}</span>
                </p>
                {loading ? (
                    <div className="screen_loader flex items-center justify-center bg-[#fafafa] dark:bg-[#060818] z-[60] place-content-center animate__animated p-24">
                        <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#2A9D8F">
                            <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                                <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="-360 67 67" dur="2.5s" repeatCount="indefinite" />
                            </path>
                            <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                                <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="360 67 67" dur="8s" repeatCount="indefinite" />
                            </path>
                        </svg>
                    </div>
                ) : (
                    <div className="datatables">
                        <DataTable
                            highlightOnHover
                            className="whitespace-nowrap table-hover"
                            records={payments}
                            columns={[
                                {
                                    accessor: 'Amount',
                                    title: 'Amount',
                                    sortable: true,
                                    render: ({ Amount }: any) => <div>${Amount?.toFixed(2)}</div>,
                                },
                                {
                                    accessor: 'PaymentDate',
                                    title: 'Date',
                                    sortable: true,
                                    render: ({ PaymentDate }: any) => <div>{formatDate(PaymentDate)}</div>,
                                },
                                {
                                    accessor: 'Id',
                                    title: 'Id',
                                    sortable: true,
                                    render: ({ Id }: any) => <div>{Id}</div>,
                                },
                                {
                                    accessor: 'Status',
                                    title: 'Status',
                                    sortable: true,
                                    render: ({ Status }: any) => <div className={`${statusCSS(Status)}`}>{Status}</div>,
                                },
                                {
                                    accessor: 'CustomerFirstName',
                                    title: 'Billing Name',
                                    sortable: true,
                                    render: ({ CustomerFirstName, CustomerLastName }: any) => (
                                        <div>
                                            {CustomerFirstName} {CustomerLastName}
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'action',
                                    title: 'Payment Info',
                                    titleStyle: { textAlign: 'right' },
                                    sortable: false,
                                    render: ({ Id, Status }: any) => (
                                        <div className="flex items-center justify-end gap-2">
                                            {Status === 'Failed' ? (
                                                <Link
                                                    to={`/payments/view-late-payment/${suid}/${Id}`}
                                                    className="text-info hover:text-blue-800 flex items-center gap-1"
                                                >
                                                    <IconEye /> View Payment
                                                </Link>
                                            ) : (
                                                <Link
                                                    to={`/payments/view-payment-info/${hashids.encode(Id)}/${hashids.encode(suid)}`}
                                                    className="text-info hover:text-blue-800 flex items-center gap-1"
                                                >
                                                    <IconEye /> View Payment
                                                </Link>
                                            )}

                                            {/* <PaymentInfoSlider payID={Id} /> */}
                                        </div>
                                    ),
                                },
                            ]}
                            totalRecords={initialRecords.length}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPayments;
