import { Link, NavLink, useNavigate } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconPlus from '../../components/Icon/IconPlus';
import IconEdit from '../../components/Icon/IconEdit';
import { setPageTitle } from '../../store/themeConfigSlice';
import { UserAuth } from '../../context/AuthContext';
import ViewStaffMember from './ViewStaffMember';
import Hashids from 'hashids';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { showWarningMessage } from '../../functions/shared';
import { getStaffByStudioId, updateStaffActivity } from '../../functions/api';
import IconBolt from '../../components/Icon/IconBolt';
import IconEye from '../../components/Icon/IconEye';

const ViewStaff = () => {
    const { staff, suid, update, setUpdate }: any = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('View Staff'));
    });

    const hashids = new Hashids();
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);

    const [inactiveStaff, setInactiveStaff] = useState([]);
    const [showInactive, setShowInactive] = useState(true);

    const [combinedStaff, setCombinedStaff] = useState(staff.concat(inactiveStaff));
    const [initialRecords, setInitialRecords] = useState(sortBy(combinedStaff, 'invoice'));
    const [records, setRecords] = useState(initialRecords);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'Name',
        direction: 'asc',
    });

    useEffect(() => {
        if (!showInactive) {
            setCombinedStaff(staff.concat(inactiveStaff));
        } else {
            setCombinedStaff(staff);
        }
    }, [inactiveStaff, staff, showInactive]);

    const handleGetInactiveStaff = async () => {
        try {
            const response = await getStaffByStudioId(suid, 0);
            setInactiveStaff(response);
        } catch (error) {
            console.error(error);
        }
    };

    const handleHashAndGo = (id: any) => {
        navigate(`/staff/edit-staff-member/${hashids.encode(id, suid)}`);
    };

    useEffect(() => {
        handleGetInactiveStaff();
    }, []);

    useEffect(() => {
        setPage(1);
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return combinedStaff.filter((item: any) => {
                return item.Name.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase()) || item.Phone.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, inactiveStaff, combinedStaff]);

    useEffect(() => {
        const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
        setPage(1);
    }, [sortStatus]);

    const handleReactivate = (prosid: any, name: any) => {
        showWarningMessage(`Are you sure you want to reactivate ${name}?`, `Reactivate ${name}`, `${name} has been reactivated`)
            .then(async (confirmed: boolean) => {
                if (confirmed) {
                    const response = await updateStaffActivity(prosid, 1);
                    if (response.status === 200) {
                        setUpdate(!update);
                    }
                    setRecords(staff.filter((user: any) => user.StaffId !== prosid));
                    setInitialRecords(staff.filter((user: any) => user.StaffId !== prosid));
                    setSearch('');
                    setUpdate(!update);
                } else {
                    // User canceled the action
                    console.log('User canceled');
                }
            })
            .catch((error) => {
                // Handle error if any
                console.error('Error:', error);
            });
    };

    const deleteRow = (prosid: any, name: any) => {
        showWarningMessage(`Are you sure you want to deactivate ${name}?`, `Deactivate ${name}`, `${name} has been deactivated`)
            .then(async (confirmed: boolean) => {
                if (confirmed) {
                    const response = await updateStaffActivity(prosid, 0);
                    if (response.status === 200) {
                        setUpdate(!update);
                    }
                    setRecords(staff.filter((user: any) => user.StaffId !== prosid));
                    setInitialRecords(staff.filter((user: any) => user.StaffId !== prosid));
                    setSearch('');
                    setUpdate(!update);
                } else {
                    // User canceled the action
                    console.log('User canceled');
                }
            })
            .catch((error) => {
                // Handle error if any
                console.error('Error:', error);
            });
    };

    return (
        <>
            <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
                <div className="invoice-table">
                    <div className="mb-4.5 px-5 flex md:items-end md:flex-row flex-col gap-5">
                        <div className="">
                            <h2 className="text-xl">Staff</h2>
                            <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="flex staff-center gap-2 ltr:ml-auto rtl:mr-auto">
                            <Link to="/staff/add-staff" className="btn btn-primary gap-1">
                                <IconPlus />
                                Add Staff
                            </Link>
                        </div>
                    </div>
                    <div className="p-5 flex">
                        <label className="inline-flex ml-auto">
                            <input type="checkbox" checked={showInactive} className="form-checkbox text-danger peer" onChange={(e) => setShowInactive(e.target.checked)} />
                            <span className="peer-checked:text-danger">Hide Inactive Staff</span>
                        </label>
                    </div>

                    <div className="datatables pagination-padding">
                        <DataTable
                            className="whitespace-nowrap table-hover invoice-table"
                            records={records}
                            columns={[
                                {
                                    accessor: 'name',
                                    sortable: true,
                                    render: ({ Name, StaffId }) => (
                                        <div className="flex staff-center font-semibold">
                                            {/* <div className="p-0.5 bg-white-dark/30 rounded-full w-max ltr:mr-2 rtl:ml-2">
                                            <img className="h-8 w-8 rounded-full object-cover" src={`/assets/images/profile-${StaffId}.jpeg`} alt="" />
                                        </div> */}
                                            <div>{Name}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'email',
                                    sortable: true,
                                },
                                {
                                    accessor: 'Phone',
                                    sortable: true,
                                },
                                {
                                    accessor: 'ActivityLevel',
                                    title: 'Activity',
                                    sortable: true,
                                    render: ({ ActivityLevel }: any) => (
                                        <div className="">
                                            {ActivityLevel === 1 ? <span className="badge badge-outline-success">Active</span> : <span className="badge badge-outline-warning">Inactive</span>}
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'action',
                                    title: 'Actions',
                                    sortable: false,
                                    textAlignment: 'center',
                                    render: ({ StaffId, FirstName, ActivityLevel }: any) => (
                                        <div className="flex gap-4 staff-center w-max mx-auto">
                                            <Tippy content="View/Edit Staff Member">
                                                <button className="flex text-info hover:text-blue-800" onClick={() => handleHashAndGo(StaffId)}>
                                                    <IconEye className="w-5 h-5" />
                                                </button>
                                            </Tippy>
                                            {/* <ViewStaffMember staffID={StaffId} /> */}
                                            {/* <NavLink to="" className="flex"> */}
                                            {ActivityLevel === 1 ? (
                                                <Tippy content="Deactivate Staff Member">
                                                    <button type="button" className="flex text-danger hover:text-red-800" onClick={(e) => deleteRow(StaffId, FirstName)}>
                                                        <IconTrashLines />
                                                    </button>
                                                </Tippy>
                                            ) : (
                                                <Tippy content="Reactivate Staff Member">
                                                    <button type="button" className="flex text-success hover:text-gren-800" onClick={(e) => handleReactivate(StaffId, FirstName)}>
                                                        <IconBolt />
                                                    </button>
                                                </Tippy>
                                            )}

                                            {/* </NavLink> */}
                                        </div>
                                    ),
                                },
                            ]}
                            highlightOnHover
                            totalRecords={initialRecords.length}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewStaff;
