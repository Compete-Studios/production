import { Link, NavLink } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { UserAuth } from '../../context/AuthContext';
import AddEditClass from './AddEditClass';
import ViewClass from './ViewClass';
import IconUsers from '../../components/Icon/IconUsers';
import { dropClassByClassID } from '../../functions/api';

export default function ViewClasses() {
    const { classes, suid, update, setUpdate }: any = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Search Prospects'));
    });

    const deleteRow = (id: any = null) => {
        if (window.confirm('Are you sure want to delete this class?')) {
            if (id) {
                alert('Class Deleted');
                setRecords(classes?.filter((user: any) => user.ClassId !== id));
                setInitialRecords(classes?.filter((user: any) => user.ClassId !== id));
                setSearch('');
                setSelectedRecords([]);
                dropClassByClassID(id);
                setUpdate(!update);
            } else {
                let selectedRows = selectedRecords || [];
                const ids = selectedRows.map((d: any) => {
                    return d.ClassId;
                });
                const result = classes?.filter((d: any) => !ids.includes(d.ClassId as never));
                setRecords(result);
                setInitialRecords(result);
                setSearch('');
                setSelectedRecords([]);
                setPage(1);
            }
        }
    };

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
    const [initialRecords, setInitialRecords] = useState([]);
    const [records, setRecords] = useState(initialRecords);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'ClassId',
        direction: 'asc',
    });

    useEffect(() => {
        setPage(1);
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [pageSize]);

    useEffect(() => {
        setInitialRecords(classes);
    }, [classes]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return classes?.filter((item: any) => {
                return (
                    item.Description.toLowerCase().includes(search.toLowerCase()) || item.Name.toLowerCase().includes(search.toLowerCase()) || item.Notes.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);

    useEffect(() => {
        const data2 = initialRecords;
        setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
        setPage(1);
    }, [sortStatus]);

    return (
        <>
            <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
                <div className="invoice-table">
                    <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">View Classes</h5>

                        <div className="flex items-center gap-2">
                            <div className="">
                                <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>
                        </div>

                        <div className="gap-2 ltr:ml-auto rtl:mr-auto">
                            <AddEditClass />
                        </div>
                    </div>

                    <div className="datatables pagination-padding">
                        <DataTable
                            className={`whitespace-nowrap table-hover invoice-table`}
                            records={records}
                            columns={[
                                {
                                    accessor: 'name',
                                    sortable: true,
                                    render: ({ Name }: { Name: any }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{Name}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'enrollment',
                                    title: 'Enrollment',
                                    sortable: true,
                                },
                                {
                                    accessor: 'prospectEnrollment',
                                    title: 'Prospects',
                                    sortable: true,
                                },
                                {
                                    accessor: 'EnrollmentLimit',
                                    title: 'Limit',
                                    sortable: true,
                                },
                                {
                                    accessor: 'status',
                                    sortable: false,
                                    render: ({ EnrollmentLimit, enrollment, prospectEnrollment }: { EnrollmentLimit: any; enrollment: any; prospectEnrollment: any }) => (
                                        <span className={`badge badge-outline-alert ${EnrollmentLimit < enrollment + prospectEnrollment && 'badge- badge-outline-danger'} `}>
                                            {EnrollmentLimit < enrollment + prospectEnrollment ? 'Over Enrolled' : null}
                                        </span>
                                    ),
                                },
                                {
                                    accessor: 'action',
                                    title: 'Actions',
                                    sortable: false,
                                    textAlignment: 'center',
                                    render: ({ ClassId }: { ClassId: any }) => (
                                        <div className="flex gap-4 items-center w-max mx-auto ">
                                            <ViewClass classId={ClassId} />

                                            <AddEditClass classId={ClassId} editClass={true} />
                                            <Tippy content="View Roster">
                                                <NavLink to={`/classes/view-roster/${ClassId}/${suid}`} className="flex hover:text-orange-800 text-orange-600">
                                                    <IconUsers />
                                                </NavLink>
                                            </Tippy>
                                            {/* <NavLink to="" className="flex"> */}
                                            <Tippy content="Delete Class">
                                                <button type="button" className="flex text-danger hover:text-danger" onClick={(e) => deleteRow(ClassId)}>
                                                    <IconTrashLines />
                                                </button>
                                            </Tippy>
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
                            // selectedRecords={selectedRecords}
                            // onSelectedRecordsChange={setSelectedRecords}
                            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
