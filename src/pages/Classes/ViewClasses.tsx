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
import IconSearch from '../../components/Icon/IconSearch';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconPlus from '../../components/Icon/IconPlus';

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
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-xl">Classes</h2>
                </div>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <AddEditClass />
                    </div>
                    <div className="relative">
                        <input type="text" placeholder="Search Classes" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-5 panel p-0 border-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table-striped ">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Enrollment</th>
                                <th>Prospects</th>
                                <th>Limit</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records?.map((rec: any) => {
                                return (
                                    <tr key={rec.ClassId} className={`${rec.EnrollmentLimit < rec.enrollment + rec.prospectEnrollment && 'bg-cs'}`}>
                                        <td>
                                            <div className="flex items-center w-max">
                                                <div>{rec.Name}</div>
                                            </div>
                                        </td>
                                        <td>{rec.enrollment || 0}</td>
                                        <td>{rec.prospectEnrollment || 0}</td>
                                        <td>{rec.EnrollmentLimit || 0}</td>
                                        <td>
                                            <div className="flex gap-4 items-center justify-center">
                                                <Link to={`/students/view-student/`} type="button" className="btn btn-sm btn-outline-info">
                                                    View
                                                </Link>
                                                {/* <Link to="/students/edit-student" type="button" className="btn btn-sm btn-outline-primary" onClick={() => editUser(contact)}>
                                                    Edit
                                                </Link> */}
                                                <Link to="/students/delete-student" type="button" className="btn btn-sm btn-outline-danger">
                                                    Delete
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {records?.length === 0 && (
                    <div className="flex items-center justify-center h-40">
                        <div className="text-center">
                            <p className="text-lg text-danger">No Students found</p>
                            <button className="btn btn-info gap-2 mt-2 w-full flex items-center justify-center">
                                <IconPlus />
                                Add a Class
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
