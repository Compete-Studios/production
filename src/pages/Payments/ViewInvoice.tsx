import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconSend from '../../components/Icon/IconSend';
import IconPrinter from '../../components/Icon/IconPrinter';
import IconDownload from '../../components/Icon/IconDownload';
import { constFormateDateMMDDYYYY, convertPhone, showMessage, showWarningMessage, unHashTheID } from '../../functions/shared';
import { UserAuth } from '../../context/AuthContext';
import { createNewInvoice, deleteInvoice, getInvoiceById, getStudentInfo, sendAText } from '../../functions/api';
import IconTrash from '../../components/Icon/IconTrash';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import StudentsQuickPay from '../Students/StudentsQuickPay';
import { REACT_BASE_URL } from '../../constants';
import { sendIndividualEmail } from '../../functions/emails';

const columns = [
    {
        key: 'id',
        label: 'STATUS',
    },
    {
        key: 'title',
        label: 'REASON',
    },
    {
        key: 'quantity',
        label: 'QTY',
    },
    {
        key: 'price',
        label: 'PRICE',
        class: 'ltr:text-right rtl:text-left',
    },
    {
        key: 'amount',
        label: 'AMOUNT',
        class: 'ltr:text-right rtl:text-left',
    },
];

interface InvoiceData {
    InvoiceId: number;
    StudentId: number;
    StudioId: number;
    Amount: number;
    CreationDate: any;
    DueDate: any;
    ReasonForInvoice: string;
    Notes: string;
    PaymentId: number;
    ProspectId: number;
}

const invoiceInit: InvoiceData = {
    InvoiceId: 0,
    StudentId: 0,
    StudioId: 0,
    Amount: 0,
    CreationDate: new Date(),
    DueDate: new Date(),
    ReasonForInvoice: '',
    Notes: '',
    PaymentId: 0,
    ProspectId: 0,
};

export const TableToPDF = (invoice: any) => {
    const input: any = document.getElementById('invoice-table'); // Replace 'invoice-table' with the ID of your table
    html2canvas(input)
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`Invoice_#${invoice}.pdf`);
        })
        .catch((error) => console.log(error));
};

const ViewInvoice = () => {
    const { suid, studioInfo }: any = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Invoice Preview'));
    });
    const exportTable = () => {
        window.print();
    };
    const [invoiceID, setInvoiceID] = useState<any>('');
    const [hashedSUID, setHashedSUID] = useState<any>('');
    const [invoiceData, setInvoiceData] = useState<InvoiceData>(invoiceInit);
    const [studentInfo, setStudentInfo] = useState<any>({});
    const [sending, setSending] = useState(false);
    const [sendEmail, setSendEmail] = useState(true);
    const [sendText, setSendText] = useState(true);

    const { id, stud } = useParams<{ id: string; stud: string }>();

    const navigate = useNavigate();

    const handleGetStudent = async (studentID: any) => {
        getStudentInfo(studentID).then((res) => {
            setStudentInfo(res);
        });
    };

    const downloadTable = () => {
        TableToPDF(invoiceID); // Call the PDF generator function
    };

    const handleGetInvoice = async (inID: any) => {
        try {
            const response = await getInvoiceById(inID);
            console.log('response', response);
            setInvoiceData(response.recordset[0]);
            const studentID = response.recordset[0].StudentId;
            const prospectId = response.recordset[0].ProspectId;
            if (studentID !== 0) {
                handleGetStudent(studentID);
            } else {
                handleGetStudent(prospectId);
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        const invoicunhashed: any = unHashTheID(id);
        setInvoiceID(invoicunhashed);
        const hashedstud: any = unHashTheID(stud);
        setHashedSUID(hashedstud);
        if (parseInt(suid) !== parseInt(hashedstud)) {
            console.log('Unauthorized');
        } else {
            handleGetInvoice(invoicunhashed);
        }
    }, [id, stud]);

    const handleDeleteInvoice = async (invoiceID: any) => {
        showWarningMessage('Are you sure you want to delete this invoice?', 'Delete Invoice', 'Your invoice has been removed successfully')
            .then(async (confirmed: boolean) => {
                if (confirmed) {
                    const response = await deleteInvoice(invoiceID);
                    if (response.status === 200) {
                        console.log('Invoice Deleted');
                        navigate('/payments/view-invoices');
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

    const createInvoiceURL = async (invoiceId: any) => {
        const linkForInvoice = `${REACT_BASE_URL}pay-invoice/${invoiceId}`;
        const htmlFOrEmail = `"<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>Document</title></head><body style=\"background-color: #f4f4f4; font-family: Arial, sans-serif;\"><div style=\"max-width: 600px; margin: 0 auto; padding: 20px;\"><h2 style=\"color: #333;\">You have a new Invoice from ${studioInfo?.Studio_Name}</h2><p style=\"color: #666;\">Please go to ${linkForInvoice} to pay your invoice.</p><p style=\"color: #666;\">Best regards,<br> ${studioInfo?.Studio_Name}</p></div></body></html>"`;
        return htmlFOrEmail;
    };


   
    const handleResendInvoice = async (e: any) => {
        e.preventDefault();
        try {
            setSending(true);
            const newInvoiceLink = await createInvoiceURL(invoiceID);
            const linkForInvoice = `${REACT_BASE_URL}pay-invoice/${invoiceID}`;

            const emailData = {
                to: "bret@techbret.com",
                from: studioInfo?.Contact_Email,
                subject: 'Invoice for your payment',
                html: newInvoiceLink,
                deliverytime: null,
            };

            const text = {
                to: '7193184101',
                studioId: suid,
                message: 'You have a new invoice from ' + studioInfo?.Studio_Name + ' please go to ' + linkForInvoice + ' to pay your invoice.',
            };

            const data = {
                studioId: suid,
                email: emailData,
            };
            
            if (sendEmail) {
                sendIndividualEmail(data).then((res) => {
                    console.log(res);
                });
            }

            if (sendText) {
                sendAText(text).then((res) => {
                    console.log(res);
                });
            }
            setTimeout(() => {
                showMessage('Invoice Sent Successfully');
                setSending(false);
                navigate(-1);
            }, 2000);;
        } catch (error) {
            console.log(error);
            setTimeout(() => {
              showMessage('Invoice Sent Successfully');
              setSending(false);
              navigate(-1);
          }, 2000);;
        }
    };

    return (
        <div>
            <div className="flex items-center lg:justify-end justify-center flex-wrap gap-4 mb-6">
                <button type="button" className="btn btn-info gap-2" onClick={(e: any) => handleResendInvoice(e)}>
                    <IconSend />
                    Resend Invoice
                </button>

                <button type="button" className="btn btn-primary gap-2" onClick={() => exportTable()}>
                    <IconPrinter />
                    Print
                </button>

                <button type="button" className="btn btn-secondary gap-2" onClick={() => downloadTable()}>
                    <IconDownload />
                    Download
                </button>

                <StudentsQuickPay student={studentInfo} title={'Pay In Studio'} invoiceID={invoiceID} />

                <button className="btn btn-danger gap-2" onClick={() => handleDeleteInvoice(invoiceID)}>
                    <IconTrash />
                    Delete Invoice
                </button>
            </div>
            <div id="invoice-table" className="panel">
                <div className="flex justify-between flex-wrap gap-4 px-4">
                    <div className="text-2xl font-semibold uppercase">Invoice</div>
                    <div className="shrink-0">
                        <img src="/assets/images/logo.svg" alt="img" className="w-14 ltr:ml-auto rtl:mr-auto" />
                    </div>
                </div>
                <div className="ltr:text-right rtl:text-left px-4">
                    <div className="space-y-1 mt-6 text-white-dark">
                        <div>
                            {studioInfo?.Contact_Address} {studioInfo?.Contact_City}, {studioInfo?.Contact_State}, {studioInfo?.Contact_Zip}
                        </div>
                        <div>{studioInfo?.Contact_Email}</div>
                        <div>+1 {convertPhone(studioInfo?.Contact_Number)}</div>
                    </div>
                </div>

                <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
                <div className="flex justify-between lg:flex-row flex-col gap-6 flex-wrap">
                    <div className="flex-1">
                        <div className="space-y-1 text-white-dark">
                            <div>Issue For:</div>
                            <div className="text-black dark:text-white font-semibold">
                                {studentInfo?.First_Name} {studentInfo?.Last_Name}
                            </div>
                            <div>
                                {studentInfo?.mailingaddr} {studentInfo?.mailingaddr2} {studentInfo?.city}, {studentInfo?.state}, {studentInfo?.Zip}
                            </div>
                            <div>{studentInfo?.email}</div>
                            <div>{convertPhone(studentInfo?.Phone)}</div>
                        </div>
                    </div>
                    <div className="flex justify-between sm:flex-row flex-col gap-6 lg:w-2/3">
                        <div className="xl:1/3 lg:w-2/5 sm:w-1/2">
                            <div className="flex items-center w-full justify-between mb-2">
                                <div className="text-white-dark">Invoice :</div>
                                <div>#{invoiceID}</div>
                            </div>
                            <div className="flex items-center w-full justify-between mb-2">
                                <div className="text-white-dark">Issue Date :</div>
                                <div>{constFormateDateMMDDYYYY(invoiceData?.CreationDate)}</div>
                            </div>
                            <div className="flex items-center w-full justify-between mb-2">
                                <div className="text-white-dark">Due Date :</div>
                                <div>{constFormateDateMMDDYYYY(invoiceData?.CreationDate)}</div>
                            </div>
                            <div className="flex items-center w-full justify-between">
                                <div className="text-white-dark">Reason for Invoice :</div>
                                <div>{invoiceData?.ReasonForInvoice}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="table-responsive mt-6">
                    <table className="table-striped">
                        <thead>
                            <tr>
                                {columns.map((column) => {
                                    return (
                                        <th key={column.key} className={column?.class}>
                                            {column.label}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td
                                    className={`${
                                        invoiceData.PaymentId > 0
                                            ? 'text-success'
                                            : invoiceData.PaymentId === 3
                                            ? 'text-secondary'
                                            : invoiceData.PaymentId === 2
                                            ? 'text-info'
                                            : invoiceData.PaymentId === 1
                                            ? 'text-danger'
                                            : 'text-danger'
                                    }`}
                                >
                                    {invoiceData.PaymentId === 0 ? 'Open' : 'Paid'}
                                </td>
                                <td>{invoiceData.ReasonForInvoice}</td>
                                <td>1</td>
                                <td className="ltr:text-right rtl:text-left">${invoiceData.Amount?.toFixed(2)}</td>
                                <td className="ltr:text-right rtl:text-left">${invoiceData.Amount?.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="grid sm:grid-cols-2 grid-cols-1 px-4 mt-6">
                    <div></div>
                    <div className="ltr:text-right rtl:text-left space-y-2">
                        <div className="flex items-center font-semibold text-lg">
                            <div className="flex-1">Total</div>
                            <div className="w-[37%]">${invoiceData.Amount?.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewInvoice;
