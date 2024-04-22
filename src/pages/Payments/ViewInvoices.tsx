import { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { UserAuth } from '../../context/AuthContext';
import { getInvoicesByStudioId, getProspectInvoicesByStudioId } from '../../functions/api';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrashLines from '../../components/Icon/IconTrashLines';



export default function ViewInvoices() {
    const { suid }: any = UserAuth();
    const [startDate, setStartDate] = useState<any>('01-01-2023');
    const [endDate, setEndDate] = useState<any>('05-01-2024');
    const [studentInvoices, setStudentInvoices] = useState<any>([]);
    const [prospectInvoices, setProspectInvoices] = useState<any>([]);
    const [loading, setLoading] = useState(false);
   

    const statusCSS = (status: string) => {
      switch (status) {
          case 'Pending':
              return 'text-blue-800';
          case 'Chargeback':
              return 'text-red-800';
          case 'Posted':
              return 'text-success';
          case 'Authorized':
              return 'text-success';
          case 'Failed':
              return 'text-red-800';
          case 'RefundSettled':
              return 'text-purple-800';
          case 'Returned':
              return ' text-orange-800';
          case 'Reversed':
              return ' text-red-800';
          case 'Reversensf':
              return ' text-red-800';
          case 'Reverseposted':
              return ' text-red-800';
          case 'Settled':
              return 'text-success';
          case 'Voided':
              return ' text-red-800';
          default:
              return 'text-gray-800';
      }
  };

    const handleGetStudentInvoices = async () => {
        try {
            const response = await getInvoicesByStudioId(suid, startDate, endDate);
            console.log(response);
            setStudentInvoices(response.recordset);
        } catch (error) {
            console.error(error);
        }
    };

    const handleGetProspectInvoices = async () => {
        try {
            const response = await getProspectInvoicesByStudioId(suid, startDate, endDate);
            console.log(response);
            setProspectInvoices(response.recordset);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleGetStudentInvoices();
        handleGetProspectInvoices();
    }, [suid]);

    const handleSearch = () => {
        console.log('searching...');
    };

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
                                <label className="form-label text-transparent ">search</label>
                                <button type="button" className="btn btn-primary w-full" onClick={handleSearch}>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <p>
                    Total Invoices: <span className="font-bold">1 Student invoices found. 1 Prospect invoices found.</span>
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
                      <div className="table-responsive mb-5">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Sale</th>
                                <th>Status</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentInvoices?.map((data: any) => {
                                return (
                                    <tr key={data.id}>
                                        <td>
                                            <div className="whitespace-nowrap">{data.name}</div>
                                        </td>
                                        <td>{data.date}</td>
                                        <td>{data.sale}</td>
                                        <td>
                                            <div
                                                className={`whitespace-nowrap ${
                                                    data.status === 'completed'
                                                        ? 'text-success'
                                                        : data.status === 'Pending'
                                                        ? 'text-secondary'
                                                        : data.status === 'In Progress'
                                                        ? 'text-info'
                                                        : data.status === 'Canceled'
                                                        ? 'text-danger'
                                                        : 'text-success'
                                                }`}
                                            >
                                                {data.status}
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <Tippy content="Delete">
                                                <button type="button">
                                                    <IconTrashLines className="m-auto" />
                                                </button>
                                            </Tippy>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                      
                    </div>
                )}
            </div>
        </div>
    );
}
