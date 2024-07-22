import { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { deleteInvoice, getInvoicesByStudioId, getProspectInvoicesByStudioId } from '../../functions/api';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { formatDate, hashTheID, showMessage, showErrorMessage, showWarningMessage } from '../../functions/shared';
import IconEye from '../../components/Icon/IconEye';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Link } from 'react-router-dom';

interface Invoice {
    InvoiceId: string;
    StudentName?: string;
    Name?: string;
    Amount: number;
    CreationDate: string;
    DueDate: string;
    PaymentId: number;
    status: string;
}

// Helper function to format date to 'MM/DD/YYYY'
const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day}-${year}`;
};

export default function ViewInvoices() {
    const { suid }: any = UserAuth();
    const [studentInvoices, setStudentInvoices] = useState<Invoice[]>([]);
    const [prospectInvoices, setProspectInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentDate = new Date();
    const thisMonthStartDate = formatDateString(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
    const thisMonthEndDate = formatDateString(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));
    const [startDate, setStartDate] = useState<string>(thisMonthStartDate);
    const [endDate, setEndDate] = useState<string>(thisMonthEndDate);
    const [updated, setUpdated] = useState(false);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Invoices'));
    }, [dispatch]);
   


    const handleGetStudentInvoices = async () => {
        try {
            const response = await getInvoicesByStudioId(suid, startDate, endDate);
            setStudentInvoices(response.recordset);
        } catch (error) {
            console.error('Error fetching student invoices:', error);
            setError('Failed to fetch student invoices.');
            showErrorMessage('Failed to fetch student invoices.');
        }
    };

    const handleGetProspectInvoices = async () => {
        try {
            const response = await getProspectInvoicesByStudioId(suid, startDate, endDate);
            setProspectInvoices(response.recordset);
        } catch (error) {
            console.error('Error fetching prospect invoices:', error);
            setError('Failed to fetch prospect invoices.');
            showErrorMessage('Failed to fetch prospect invoices.');
        }
    };

    useEffect(() => {
        handleGetStudentInvoices();
        handleGetProspectInvoices();
    }, [suid, updated]);

    const handleSearch = async () => {
        console.log('searching...', startDate, endDate);
        setLoading(true);
        try {
            await handleGetStudentInvoices();
            await handleGetProspectInvoices();
        } catch (error) {
            console.error('Error during search:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="panel">
                <div className="mb-4.5 flex md:items-center md:flex-row flex-col gap-5">
                    <div className="flex items-center gap-5">
                        <h2 className="text-xl">View Your Invoices</h2>
                    </div>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <div className="flex items-center gap-5">
                            <div className="md:flex-auto flex-1">
                                <label className="form-label">Start Date</label>
                                <Flatpickr
                                    value={startDate}
                                    options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                    className="form-input"
                                    onChange={(date: Date[]) => setStartDate(formatDateString(date[0]))}
                                />
                            </div>
                            <div className="md:flex-auto flex-1">
                                <label className="form-label">End Date</label>
                                <Flatpickr
                                    value={endDate}
                                    options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                                    className="form-input"
                                    onChange={(date: Date[]) => setEndDate(formatDateString(date[0]))}
                                />
                            </div>
                            <div className="md:flex-auto flex-1">
                                <label className="form-label text-transparent">Search</label>
                                <button type="button" className="btn btn-primary w-full" onClick={handleSearch} disabled={loading}>
                                    {loading ? 'Searching...' : 'Search'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <p>
                    Total Invoices: <span className="font-bold">{studentInvoices?.length}</span> Student invoices found. &nbsp;
                    <span className="font-bold">{prospectInvoices?.length}</span> Prospect invoices found.
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
                    <div>
                        <InvoiceTable title="Student Invoices" invoices={studentInvoices} suid={suid} setUpdated={setUpdated} updated={updated} />
                        <InvoiceTable title="Prospect Invoices" invoices={prospectInvoices} suid={suid} setUpdated={setUpdated} updated={updated} />
                    </div>
                )}
            </div>
        </div>
    );
}

const InvoiceTable = ({ title, invoices, suid, setUpdated, updated }: { title: string; invoices: Invoice[]; suid: string; setUpdated: any; updated: any }) => {

     const handleDeleteTheInvoice = async (invoiceID: any) => {
        showWarningMessage('Are you sure you want to delete this invoice?', 'Delete Invoice', 'Your invoice has been removed successfully')
            .then(async (confirmed: boolean) => {
                if (confirmed) {
                    const response = await deleteInvoice(invoiceID);
                    if (response.status === 200) {
                        console.log('Invoice Deleted');
                        setUpdated(!updated);
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
    return (
        <div className="table-responsive mt-12">
            <h2 className="text-xl">{title}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Date Created</th>
                        <th>Date Due</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((data) => (
                        <tr key={data.InvoiceId}>
                            <td>
                                <div className="whitespace-nowrap">{data.StudentName || data.Name}</div>
                            </td>
                            <td>${data.Amount?.toFixed(2)}</td>
                            <td>{formatDate(data.CreationDate)}</td>
                            <td>{formatDate(data.DueDate)}</td>
                            <td>
                                <div
                                    className={`whitespace-nowrap ${
                                        data.PaymentId > 0
                                            ? 'text-success'
                                            : data.status === 'Pending'
                                            ? 'text-secondary'
                                            : data.status === 'In Progress'
                                            ? 'text-info'
                                            : data.status === 'Canceled'
                                            ? 'text-danger'
                                            : 'text-danger'
                                    }`}
                                >
                                    {data.PaymentId > 0 ? 'Paid' : 'Open'}
                                </div>
                            </td>
                            <td className="text-center flex items-center justify-center gap-x-2">
                                <div>
                                    <Tippy content="View Invoice">
                                        <Link to={`/payments/view-invoice/${hashTheID(data.InvoiceId)}/${hashTheID(suid)}`} type="button">
                                            <IconEye className="m-auto text-info hover:text-blue-900" />
                                        </Link>
                                    </Tippy>
                                </div>
                                <div>
                                    <Tippy content="Delete Invoice">
                                        <button type="button" onClick={() => handleDeleteTheInvoice(data.InvoiceId)}>
                                            <IconTrashLines className="m-auto text-danger hover:text-red-800" />
                                        </button>
                                    </Tippy>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
