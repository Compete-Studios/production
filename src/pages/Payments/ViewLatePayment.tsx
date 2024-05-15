import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { convertPhone, hashTheID, showErrorMessage, showMessage, unHashTheID } from '../../functions/shared';
import { UserAuth } from '../../context/AuthContext';
import { addPaymentNotes, getAllCustomerPaymentAccounts, getCustomerPayments, getLatePayment, getPaymentByID, getPaymentNotes } from '../../functions/payments';
import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import { getStudentIdFromPaysimpleCustomerId, getStudentInfo, updateStudentNotes } from '../../functions/api';
import { sendIndividualEmail } from '../../functions/emails';
import { REACT_BASE_URL } from '../../constants';
import IconSend from '../../components/Icon/IconSend';
import IconEye from '../../components/Icon/IconEye';
import { formatWithTimeZone, handleGetTimeZoneOfUser } from '../../functions/dates';
import AddNoteModal from '../Students/AddNoteModal';
import IconMail from '../../components/Icon/IconMail';
import IconPhoneCall from '../../components/Icon/IconPhoneCall';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const tableData = [
    {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@yahoo.com',
        date: '10/08/2020',
        sale: 120,
        status: 'Complete',
        register: '5 min ago',
        progress: '40%',
        position: 'Developer',
        office: 'London',
    },
    {
        id: 2,
        name: 'Shaun Park',
        email: 'shaunpark@gmail.com',
        date: '11/08/2020',
        sale: 400,
        status: 'Pending',
        register: '11 min ago',
        progress: '23%',
        position: 'Designer',
        office: 'New York',
    },
    {
        id: 3,
        name: 'Alma Clarke',
        email: 'alma@gmail.com',
        date: '12/02/2020',
        sale: 310,
        status: 'In Progress',
        register: '1 hour ago',
        progress: '80%',
        position: 'Accountant',
        office: 'Amazon',
    },
    {
        id: 4,
        name: 'Vincent Carpenter',
        email: 'vincent@gmail.com',
        date: '13/08/2020',
        sale: 100,
        status: 'Canceled',
        register: '1 day ago',
        progress: '60%',
        position: 'Data Scientist',
        office: 'Canada',
    },
];

export default function ViewLatePayment() {
    const { suid, latePayementPipeline, studioInfo, studioOptions }: any = UserAuth();
    const { id, stud }: any = useParams();

    const [paymentInfo, setPaymentInfo] = useState<any>({});
    const [paymentIDInfo, setPaymentIDInfo] = useState<any>({});
    const [paymentHistory, setPaymentHistory] = useState<any>([]);
    const [updateNotes, setUpdateNotes] = useState(false);
    const [student, setStudent] = useState<any>({});
    const [toEmail, setToEmail] = useState('');
    const [customerPaymentAccount, setCustomerPaymentAccount] = useState<any>([]);
    const [voidDate, setVoidDate] = useState('');
    const [creditCard, setCreditCard] = useState<any>({});
    const [paymentNotes, setPaymentNotes] = useState<any>('');
    const [notes, setNotes] = useState('');
    const [emailReciept, setEmailReciept] = useState(false);
    const [fromEmail, setFromEmail] = useState('');
    const [newNote, setNewNote] = useState('');
    const [currentPipeline, setCurrentPipeline] = useState('');

    const handleGetCustomerInfo = async (customerID: any) => {
        try {
            getStudentIdFromPaysimpleCustomerId(customerID).then((res) => {
                if (res.recordset) {
                    const studentID = res.recordset[0].studentId;
                    getStudentInfo(studentID).then((res) => {
                        setStudent(res);
                        setToEmail(res.email);
                    });
                } else {
                    console.log('Error getting payment info');
                }
            });
        } catch (error) {
            console.log('error', error);
        }
    };

    const handleGetPaymentHistory = async (data: any) => {
        console.log(data, 'data');
        try {
            const res = await getCustomerPayments(data);
            setPaymentHistory(res?.Response);
        } catch (error) {
            console.log('error', error);
        }
    };

    const handleGetPaymentInfo = async (payID: any) => {
        try {
            const res = await getPaymentByID(payID, suid);
            if (res.Meta.HttpStatusCode) {
                setPaymentIDInfo(res.Response);
                handleGetCustomerInfo(res.Response.CustomerId);
                if (res.Response.PaymentType === 'CC') {
                    getAllCustomerPaymentAccounts(res.Response.CustomerId, suid).then((res2) => {
                        if (res2.Response) {
                            setCustomerPaymentAccount(res2?.Response?.CreditCardAccounts);
                        } else {
                            console.log('Error getting payment info');
                        }
                    });
                } else {
                    getAllCustomerPaymentAccounts(res.Response.CustomerId, suid).then((res2) => {
                        if (res2.Response) {
                            setCustomerPaymentAccount(res2?.Response?.AchAccounts);
                        } else {
                            console.log('Error getting payment info');
                        }
                    });
                }
            } else {
                alert('Error getting payment info');
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    // console.log(customerPaymentAccount, 'customerPaymentAccount');
    // console.log(creditCard, 'creditCard');
    // console.log(paymentInfo, 'paymentInfo');
    // console.log(paymentIDInfo, 'paymentIDInfo');
    console.log(currentPipeline, 'currentPipeline');

    const handleUpdateNotes = () => {
        setUpdateNotes(true);
    };

    const handleSaveNotes = () => {
        updateStudentNotes(student?.Student_id, student?.notes);
        setUpdateNotes(false);
        showMessage('Notes Updated!');
    };

    useEffect(() => {
        if (customerPaymentAccount.length > 0) {
            const card = customerPaymentAccount.find((card: any) => card.Id === paymentIDInfo.AccountId);
            setCreditCard(card);
        }
    }, [customerPaymentAccount, paymentInfo.AccountId]);

    const getTheLatePaymentInfo = async () => {
        try {
            const res = await getLatePayment(id);
            setPaymentInfo(res[0]);
            setCurrentPipeline(res[0].CurrentPipelineStatus);
            const data = {
                customerId: res[0].PaysimpleCustomerId,
                studioId: suid,
            };
            handleGetPaymentHistory(data);
            if (res[0].PaysimpleTransactionId) {
                handleGetPaymentInfo(res[0].PaysimpleTransactionId);
            }
            if (res[0].PaymentId) {
                const paymentNotes = await getPaymentNotes(res[0].PaysimpleTransactionId);
                setPaymentNotes(paymentNotes[0].Notes);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (parseInt(stud) === parseInt(suid)) {
            getTheLatePaymentInfo();
        } else {
            alert('This is not your payment');
        }
    }, [stud, suid]);

    const recipieptHTML = async (invoiceId: any) => {
        const htmlFOrEmail = `"<!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Payment Receipt</title>
        </head>
        <body style="margin:0px; background: #f8f8f8; ">
            <div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;">
                <div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px">
                    <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px">
                        <tbody>
                            <tr>
                                <td style="vertical-align: top; padding-bottom:30px;" align="center">
                                    <b>${studioInfo?.Studio_Name}</b>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="padding: 40px; background: #fff;">
                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                            <tbody>
                                <tr>
                                    <td>
                                        <b>Date: </b>
                                        <p>${formatWithTimeZone(new Date(), handleGetTimeZoneOfUser())}</p>
                                        <b>Name: </b>
                                        <p>${paymentInfo?.CustomerName}</p>
                                        <b>Payment Result: </b>
                                        <p>${paymentIDInfo?.ProviderAuthCode}</p>
                                        <b>Amount: </b>
                                        <p>$ ${paymentInfo?.Amount}</p>
                                        <b>Payment Status: </b>
                                        <p>${paymentIDInfo?.Status}</p>
                                        <b>Notes: </b>
                                        <p>${notes}</p>
                                       
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px">
                        <p>
                            Powered by CompeteServices.com <br>
                            <a href="${REACT_BASE_URL}" style="color: #b2b2b5; text-decoration: underline;">Visit Us</a>
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        "`;
        return htmlFOrEmail;
    };

    const subjectForEmail = `Receipt #${id} from ${studioInfo?.Studio_Name}`;

    const handleSendEmail = async () => {
        const htmlData = await recipieptHTML(id);
        const data = {
            studioId: suid,
            email: {
                to: toEmail,
                from: fromEmail,
                subject: subjectForEmail,
                html: htmlData,
                deliverytime: null,
            },
        };
        sendIndividualEmail(data).then((res) => {
            if (res.status === 200) {
                showMessage('Email Sent Successfully');
                setNotes('');
                setEmailReciept(false);
            } else {
                showErrorMessage('Error sending email');
            }
        });
    };

    const handlePrintReceipt = async () => {
        const htmlData = await recipieptHTML(id);
        const printWindow = window.open('', '_blank');
        printWindow?.document.open();
        printWindow?.document.write(htmlData);
        printWindow?.document.close();
    };

    const handleAddNote = async () => {
        if (!newNote) return showErrorMessage('Please add a note');
        try {
            const newNotes = `${paymentNotes}\n${newNote}`; // Create a new string with the new note appended
            const res = await addPaymentNotes(paymentInfo.PaysimpleTransactionId, newNotes);
            if (res) {
                console.log(res);
                setPaymentNotes(newNotes); // Update the paymentNotes state with the new string
                setNewNote('');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div>
                <h4 className="text-xl font-semibold">Payment Information</h4>
            </div>
            <div className="mb-5 flex flex-col sm:flex-row">
                <Tab.Group>
                    <div className="w-full">
                        <Tab.List className="mt-3 flex flex-wrap justify-center border-b border-zinc-200">
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`${
                                            selected ? 'text-info !outline-none before:!w-full' : ''
                                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                                    >
                                        Payment Details
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`${
                                            selected ? 'text-info !outline-none before:!w-full' : ''
                                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                                    >
                                        Student Info
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`${
                                            selected ? 'text-info !outline-none before:!w-full' : ''
                                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                                    >
                                        Payment History
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`${
                                            selected ? 'text-info !outline-none before:!w-full' : ''
                                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                                    >
                                        Billing Info
                                    </button>
                                )}
                            </Tab>
                        </Tab.List>

                        <Tab.Panels>
                            <Tab.Panel>
                                <div className="pt-5 ">
                                    <h4 className="mb-4 text-xl font-semibold">Payment Details</h4>

                                    <div className="grid sm:grid-cols-2 2xl:grid-cols-3 grid-cols-1 gap-4">
                                        <div className="sm:col-span-full 2xl:col-span-1 p-0 ">
                                            <div className="flex items-start justify-between panel border-b-0 rounded-b-none shadow-none border">
                                                <div className="space-y-4">
                                                    <p className="font-bold flex gap-2">
                                                        Student:{' '}
                                                        <Link
                                                            to={`/students/view-student/${hashTheID(student.Student_id)}/${hashTheID(suid)}`}
                                                            type="button"
                                                            className="font-semibold text-primary flex items-center gap-2"
                                                        >
                                                            {student?.First_Name} {student?.Last_Name} <IconEye />
                                                        </Link>
                                                    </p>
                                                    <p className="font-bold ">
                                                        Billing Account: <span className="font-semibold text-primary">{paymentInfo?.CustomerName}</span>
                                                    </p>
                                                    <p className="font-bold ">
                                                        Card Number: <span className="font-semibold">{creditCard?.CreditCardNumber || 'N/A'}</span>
                                                    </p>
                                                    <p className="font-bold ">
                                                        Transaction ID: <span className="font-semibold">{paymentInfo?.PaysimpleTransactionId}</span>
                                                    </p>
                                                    <p className="font-bold ">
                                                        Authorization Code: <span className="font-semibold">{paymentIDInfo?.ProviderAuthCode}</span>
                                                    </p>
                                                    <p className="font-bold ">
                                                        Amount: <span className="font-semibold text-success">${paymentInfo?.Amount}</span>
                                                    </p>
                                                    <p className="font-bold ">
                                                        Payment Type: <span className="font-semibold">{paymentIDInfo?.PaymentType}</span>
                                                    </p>
                                                    <p className="font-bold ">
                                                        Settlement Date:{' '}
                                                        <span className="font-semibold">
                                                            {paymentIDInfo?.ActualSettledDate && formatWithTimeZone(paymentIDInfo?.ActualSettledDate, handleGetTimeZoneOfUser())}
                                                        </span>
                                                    </p>
                                                    <p className="font-bold ">
                                                        Status: <span className={`font-semibold ${paymentIDInfo?.Status === 'Failed' && 'text-danger'}`}>{paymentIDInfo?.Status}</span>
                                                    </p>
                                                    <p className="font-bold ">
                                                        Can Void Until:{' '}
                                                        <span className="font-semibold">
                                                            {paymentIDInfo?.CanVoidUntil && formatWithTimeZone(paymentIDInfo?.CanVoidUntil, handleGetTimeZoneOfUser())}
                                                        </span>
                                                    </p>
                                                    <p className="font-bold ">
                                                        Return Date: <span className="font-semibold">{}</span>
                                                    </p>
                                                    <p className="font-bold ">
                                                        Payment Schedule Id: <span className="font-semibold">{paymentIDInfo?.RecurringScheduleId}</span>
                                                    </p>
                                                    <p className="text-danger font-semibold">{paymentIDInfo?.FailureData?.Description}</p>
                                                    <p className="text-danger font-semibold">{paymentIDInfo?.FailureData?.MerchantActionText}</p>

                                                    {/* <ul className="mt-7 flex items-center justify-center gap-2 ">
                        <li>
                            <SendQuickEmail student={student} />
                        </li>
                        <li>
                            <Tippy content="Print Recipet">
                                <Link to="/students/update-barcode" className="btn btn-info flex items-center justify-center rounded-full w-10 h-10 p-0">
                                    <IconPrinter />
                                </Link>
                            </Tippy>
                        </li>
                    </ul> */}
                                                </div>
                                            </div>
                                            <div className="flex justify-center bg-white rounded-lg">
                                                <div
                                                    className="cursor-pointer w-full border border-r-0 p-5 rounded-bl-lg text-center font-semibold text-success hover:bg-success/10 whitespace-nowrap"
                                                    onClick={() => setEmailReciept(!emailReciept)}
                                                >
                                                    Email Receipt
                                                </div>
                                                <button
                                                    className=" whitespace-nowrap cursor-pointer w-full border border-r-0 p-5 text-center font-semibold text-info hover:bg-info/10"
                                                    onClick={handlePrintReceipt}
                                                >
                                                    Print Receipt
                                                </button>
                                                <button
                                                    className="cursor-pointer w-full border p-5 rounded-br-lg text-center font-semibold text-warning hover:bg-warning/10 whitespace-nowrap"
                                                    onClick={handlePrintReceipt}
                                                >
                                                    Retry Payment
                                                </button>
                                            </div>
                                            {emailReciept && (
                                                <div className="mt-4 space-y-4 p-5">
                                                    <h3 className="text-lg font-semibold">Email Reciept</h3>
                                                    <div>
                                                        <label htmlFor="acno" className="block text-sm font-medium text-gray-700 dark:text-white">
                                                            From Email
                                                        </label>
                                                        <select id="acno" name="acno" className="form-select flex-1" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)}>
                                                            <option value="" disabled>
                                                                Select Email
                                                            </option>
                                                            <option value={studioOptions?.EmailFromAddress}>{studioOptions?.EmailFromAddress}</option>
                                                            <option value={studioOptions?.EmailFromAddress2}>{studioOptions?.EmailFromAddress2}</option>
                                                            <option value={studioOptions?.EmailFromAddress3}>{studioOptions?.EmailFromAddress3}</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-white">
                                                            To
                                                        </label>
                                                        <input id="to" type="text" className="form-input" placeholder="Enter To" value={toEmail} onChange={(e) => setToEmail(e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-white">
                                                            Any notes you would like to add to the receipt?
                                                        </label>
                                                        <textarea
                                                            id="notes"
                                                            name="notes"
                                                            rows={3}
                                                            className="form-textarea mt-1 block w-full shadow-sm  focus:ring-primary focus:border-primary sm:text-sm border-gray-300 rounded-md"
                                                            value={notes}
                                                            onChange={(e) => setNotes(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex">
                                                        <button className="btn btn-primary ml-auto gap-x-2" onClick={handleSendEmail}>
                                                            Send Email <IconSend />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-0 ">
                                            <div className="panel border-b-0 rounded-b-none shadow-none border">
                                                <h2 className="text-xl">Late Payment Notes</h2>
                                                <div className="p-3 bg-dark-light dark:bg-dark mt-2">
                                                    {paymentNotes?.split('\n').map((note: any, index: any) => {
                                                        return (
                                                            <div key={index} className={`${note?.length > 1 && 'p-2 border-b border-dashed border-zinc-400 dark:border-gray-700'} `}>
                                                                <p>{note}</p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <textarea className="form-textarea w-full h-20 mt-4" placeholder="Add a note" value={newNote} onChange={(e) => setNewNote(e.target.value)} />
                                            </div>
                                            <div className="bg-white rounded-lg ">
                                                <button
                                                    className="cursor-pointer w-full border p-5 rounded-b-lg text-center font-semibold text-success hover:bg-success/10 whitespace-nowrap"
                                                    onClick={handleAddNote}
                                                >
                                                    Add New Note
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-0 ">
                                            <div className="panel border-b-0 rounded-b-none shadow-none border">
                                                <h2 className="text-xl">Payment Pipeline Status</h2>
                                                <div className="mt-4">
                                                    {latePayementPipeline?.map((step: any) => {
                                                        return (
                                                            <div key={step.PlacementOrdinal}>
                                                                <label htmlFor={step.PaymentPipelineStepId} className="flex items-center cursor-pointer hover:bg-gray-100 p-1">
                                                                    <input
                                                                        type="radio"
                                                                        name="pipeline"
                                                                        className="form-radio"
                                                                        value={currentPipeline}
                                                                        checked={currentPipeline === step.PaymentPipelineStepId}
                                                                        onChange={() => setCurrentPipeline(step.PaymentPipelineStepId)}
                                                                    />
                                                                    <span>{step.PipelineStepName}</span>
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div className="flex justify-center bg-white rounded-lg">
                                                <button
                                                    className="cursor-pointer w-full border p-5 rounded-b-md text-center font-semibold text-success hover:bg-success/10 whitespace-nowrap"
                                                    onClick={() => console.log('Update Step')}
                                                >
                                                    Update Step
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div>
                                    <div className="flex items-start pt-5">
                                        <div className="flex-auto">
                                            <div className="flex items-center justify-between">
                                                <h5 className="mb-4 text-xl font-medium">Student Profile</h5>
                                                <div className="flex items-center justify-end gap-4 ">
                                                    <div className="flex">
                                                        {!updateNotes && (
                                                            <button className="text-danger ml-auto" onClick={() => handleUpdateNotes()}>
                                                                Update All Notes
                                                            </button>
                                                        )}
                                                    </div>
                                                    {!updateNotes && <AddNoteModal student={student} setStudent={setStudent} />}
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <div className="panel p-0 lg:col-span-3 divide-y divide-y-zinc-600 ">
                                                    <div className="flex items-start justify-between mb-5 p-4">
                                                        <div>
                                                            <div className="font-semibold  text-2xl">
                                                                {student?.First_Name} {student?.Last_Name}
                                                            </div>

                                                            <button>
                                                                <p className="font-normal text-sm flex items-center gap-1 hover:text-info">
                                                                    {student?.email}
                                                                    {student?.email && <IconMail className="text-info" fill={true} />}
                                                                </p>
                                                            </button>
                                                            <p className="font-normal text-sm flex items-center gap-1">
                                                                {convertPhone(student?.Phone)}
                                                                <Tippy content="Call">
                                                                    <button>
                                                                        <IconPhoneCall className="text-info" fill={true} />
                                                                    </button>
                                                                </Tippy>
                                                                <Tippy content="Text Student">
                                                                    <button>
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="16"
                                                                            height="16"
                                                                            fill="currentColor"
                                                                            className="text-secondary"
                                                                            viewBox="0 0 16 16"
                                                                        >
                                                                            <path d="M3 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm6 11a1 1 0 1 0-2 0 1 1 0 0 0 2 0" />
                                                                        </svg>
                                                                    </button>
                                                                </Tippy>
                                                            </p>
                                                            <p className="font-normal text-sm flex items-center gap-1">
                                                                {convertPhone(student?.Phone2)}
                                                                <Tippy content="Call">
                                                                    <button>
                                                                        <IconPhoneCall className="text-info" fill={true} />
                                                                    </button>
                                                                </Tippy>
                                                                <Tippy content="Text Student">
                                                                    <button>
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="16"
                                                                            height="16"
                                                                            fill="currentColor"
                                                                            className="text-secondary"
                                                                            viewBox="0 0 16 16"
                                                                        >
                                                                            <path d="M3 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm6 11a1 1 0 1 0-2 0 1 1 0 0 0 2 0" />
                                                                        </svg>
                                                                    </button>
                                                                </Tippy>
                                                            </p>

                                                            <p className={`font-normal text-md mt-4 ${student?.activity ? 'text-success' : 'text-danger'}`}>
                                                                {student?.activity ? 'Active' : 'Inactive'}
                                                            </p>
                                                            <p className="font-normal text-xs ">Next Contact Date: {formatWithTimeZone(student?.NextContactDate, handleGetTimeZoneOfUser())}</p>
                                                            <p className="font-normal text-xs ">Created: {formatWithTimeZone(student?.EntryDate, handleGetTimeZoneOfUser())}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="lg:col-span-4 col-span-full">
                                                    {updateNotes && (
                                                        <div className="flex items-center p-3.5 rounded text-danger bg-danger-light dark:bg-danger-dark-light">
                                                            <span className="ltr:pr-2 rtl:pl-2">
                                                                <span className="ltr:mr-1 rtl:ml-1 font-bold">Warning!</span>
                                                                You are about to update all notes for this student. Deleting or modifying notes can not be undone.
                                                            </span>
                                                            <button type="button" className="ltr:ml-auto rtl:mr-auto hover:opacity-80" onClick={() => setUpdateNotes(false)}>
                                                                Close without saving
                                                            </button>
                                                        </div>
                                                    )}

                                                    {updateNotes ? (
                                                        <div className="border border-[#ebedf2] bg-white rounded dark:bg-[#1b2e4b] dark:border-0 mt-4">
                                                            <div className="p-4">
                                                                <textarea
                                                                    className="w-full border-0 focus:ring-0 focus:outline-none dark:bg-[#1b2e4b] dark:text-white-dark"
                                                                    rows={24}
                                                                    value={student?.notes}
                                                                    onChange={(e) => setStudent({ ...student, notes: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="border border-[#ebedf2] bg-white rounded dark:bg-[#1b2e4b] dark:border-0">
                                                            <div className="p-4">
                                                                {student?.notes?.split('\n').map((note: any, index: any) =>
                                                                    // Check if the line starts with '#'
                                                                    note.trim().startsWith('#') ? (
                                                                        <div key={index} className="text-[#515365] dark:text-white-dark mt-2 font-bold">
                                                                            {note}
                                                                        </div>
                                                                    ) : null
                                                                )}
                                                                {student?.notes?.split('\n').map((note: any, index: any) =>
                                                                    // Check if the line starts with '#'
                                                                    note.trim().startsWith('*') ? (
                                                                        <div key={index} className="text-[#515365] dark:text-white-dark mt-2 font-bold">
                                                                            {note}
                                                                        </div>
                                                                    ) : null
                                                                )}
                                                                {/* Render other notes excluding the line starting with '#' */}
                                                                {student?.notes?.split('\n').map((note: any, index: any) =>
                                                                    !note.trim().startsWith('#') && !note.trim().startsWith('*') ? (
                                                                        <div key={index} className="text-[#515365] dark:text-white-dark mt-2">
                                                                            {note}
                                                                        </div>
                                                                    ) : null
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {updateNotes && (
                                                        <button className=" mt-4 btn btn-primary ml-auto" onClick={() => handleSaveNotes()}>
                                                            Save Notes
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div>
                                    <div className="pt-5">
                                        <div className="flex-auto">
                                            <h5 className="mb-4 text-xl font-medium">Payment History</h5>
                                            <div className="table-responsive rouned-lg mb-5">
                                                <table className="panel border rounded-lg">
                                                    <thead>
                                                        <tr>
                                                            <th>Amount</th>
                                                            <th>Date</th>
                                                            <th>Billing Name</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {paymentHistory?.map((data: any) => {
                                                            return (
                                                                <tr key={data.Id}>
                                                                    <td className='font-bold'>${data.Amount?.toFixed(2)}</td>
                                                                    <td>{data.PaymentDate && formatWithTimeZone(data.PaymentDate, handleGetTimeZoneOfUser())}</td>
                                                                    <td>
                                                                        {data.CustomerFirstName} {data.CustomerLastName}
                                                                    </td>
                                                                    <td>
                                                                        <span
                                                                            className={`badge whitespace-nowrap ${
                                                                                data.Status === 'Settled'
                                                                                    ? 'badge-outline-primary'
                                                                                    : data.Status === 'Pending'
                                                                                    ? 'badge-outline-secondary'
                                                                                    : data.Status === 'In Progress'
                                                                                    ? 'badge-outline-info'
                                                                                    : data.Status === 'Failed'
                                                                                    ? 'badge-outline-danger'
                                                                                    : 'badge-outline-primary'
                                                                            }`}
                                                                        >
                                                                            {data.Status}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="pt-5">
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                                        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </p>
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </div>
                </Tab.Group>
            </div>
        </>
    );
}
