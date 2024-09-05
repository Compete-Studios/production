import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { UserAuth } from '../../context/AuthContext';
import AddNewMethod from './AddNewMethod';
import EditMethod from './EditMethod';
import { dropMarketingMethod } from '../../functions/api';
import Tippy from '@tippyjs/react';
export default function ViewClasses() {
    const { marketingSources, update, setUpdate }: any = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Marketing Methods'));
    });

    const deleteRow = async (id: any = null) => {
        console.log('id', id);
        if (window.confirm('Are you sure want to delete selected row ?')) {
            const res = await dropMarketingMethod(id);
            if (res.status === 200) {
                console.log('Deleted');
                setSearch('');
                setSelectedRecords([]);
                setUpdate(!update);
            } else {
                console.log('Failed to delete');
            }
        }
    };

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
    const [initialRecords, setInitialRecords] = useState(marketingSources);
    const [records, setRecords] = useState(initialRecords);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'MethodId',
        direction: 'asc',
    });

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
            return marketingSources?.filter((item: any) => {
                return item.Name.toLowerCase().includes(search.toLowerCase()) || item.Notes.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, marketingSources]);

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
                        <div className="flex items-center gap-2">
                            <div className="">
                                <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>
                        </div>

                        <div className="gap-2 ltr:ml-auto rtl:mr-auto">
                            <AddNewMethod />
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
                                    render: ({ Name }: any) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{Name}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'action',
                                    title: 'Actions',
                                    sortable: false,
                                    textAlignment: 'right',
                                    render: ({ MethodId, Name, Notes }) => (
                                        <div className="flex gap-4 items-start justify-end">
                                            <EditMethod MethodId={MethodId} Name={Name} Notes={Notes} />
                                            {/* <NavLink to="" className="flex"> */}
                                            <Tippy content="Delete Method">
                                            <button type="button" className="text-danger hover:text-danger" onClick={(e: any) => deleteRow(MethodId)}>
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
