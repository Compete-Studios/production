import { Link, NavLink } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { UserAuth } from '../../context/AuthContext';
import ViewClass from './ViewClass';
import IconUsers from '../../components/Icon/IconUsers';
import { dropClassByClassID } from '../../functions/api';
import IconSearch from '../../components/Icon/IconSearch';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconPlus from '../../components/Icon/IconPlus';
import IconEdit from '../../components/Icon/IconEdit';
import ViewEditClass from './ViewEditClass';
import AddNewClass from './AddNewClass';
import { showWarningMessage } from '../../functions/shared';

export default function ViewClasses() {
    const { classes, suid, update, setUpdate }: any = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Search Prospects'));
    });

    const handleDeleteClass = (id: any) => {
        showWarningMessage('Are you sure want to delete this class?', 'Delete Class', 'Your class has been removed')
            .then(async (confirmed: boolean) => {
                if (confirmed) {
                    const dropRes = await dropClassByClassID(id);
                    if (dropRes.status === 200) {
                    setRecords(classes?.filter((user: any) => user.ClassId !== id));
                    setInitialRecords(classes?.filter((user: any) => user.ClassId !== id));
                    setSearch('');
                    setSelectedRecords([]);                    
                    setUpdate(!update);
                    } else {
                        console.error('Error:', dropRes);
                    }
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

    // const handleDeleteClasss = (id: any = null) => {
    //     if (window.confirm('Are you sure want to delete this class?')) {
    //         if (id) {
    //             alert('Class Deleted');
    //             setRecords(classes?.filter((user: any) => user.ClassId !== id));
    //             setInitialRecords(classes?.filter((user: any) => user.ClassId !== id));
    //             setSearch('');
    //             setSelectedRecords([]);
    //             dropClassByClassID(id);
    //             setUpdate(!update);
    //         } else {
    //             let selectedRows = selectedRecords || [];
    //             const ids = selectedRows.map((d: any) => {
    //                 return d.ClassId;
    //             });
    //             const result = classes?.filter((d: any) => !ids.includes(d.ClassId as never));
    //             setRecords(result);
    //             setInitialRecords(result);
    //             setSearch('');
    //             setSelectedRecords([]);
    //         }
    //     }
    // };

    const [initialRecords, setInitialRecords] = useState([]);
    const [records, setRecords] = useState(initialRecords);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'ClassId',
        direction: 'asc',
    });

    useEffect(() => {
        setInitialRecords(classes);
    }, [classes]);

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
    }, [sortStatus]);

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-xl">Classes</h2>
                </div>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <AddNewClass color={true} />
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
                    <table>
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
                            {initialRecords?.map((rec: any) => {
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
                                                <Link to={`/classes/view-roster/${rec.ClassId}/${suid}`} type="button" className="flex hover:text-orange-800 text-warning">
                                                    <IconUsers /> Roster
                                                </Link>
                                                <ViewEditClass classId={rec.ClassId} nameOfClass={rec?.Name} />
                                                <button type="button" className="flex text-danger hover:text-danger" onClick={() => handleDeleteClass(rec.ClassId)}>
                                                    <IconTrashLines /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {initialRecords?.length === 0 && (
                    <div className="flex items-center justify-center h-40">
                        <div className="text-center">
                            <p className="text-lg text-danger">No Classes found</p>
                            <div className="w-full">
                                <AddNewClass color={false} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
