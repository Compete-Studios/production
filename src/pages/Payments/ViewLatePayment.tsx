import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatDate, showErrorMessage, showMessage, unHashTheID } from '../../functions/shared';
import { UserAuth } from '../../context/AuthContext';
import { addPaymentNotes, getAllCustomerPaymentAccounts, getLatePayment, getPaymentByID, getPaymentNotes } from '../../functions/payments';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconUser from '../../components/Icon/IconUser';
import { getStudentIdFromPaysimpleCustomerId, getStudentInfo } from '../../functions/api';
import SendQuickEmail from '../Students/buttoncomponents/SendQuickEmail';
import IconPrinter from '../../components/Icon/IconPrinter';
import { sendIndividualEmail } from '../../functions/emails';
import { REACT_BASE_URL } from '../../constants';
import IconSend from '../../components/Icon/IconSend';

export default function ViewLatePayment() {
    const { suid, latePayementPipeline, studioInfo, studioOptions }: any = UserAuth();
    const { id, stud }: any = useParams();
    const paymentID = unHashTheID(id);

    const [paymentInfo, setPaymentInfo] = useState<any>({});
    const [paymentIDInfo, setPaymentIDInfo] = useState<any>({});
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

    const getTheLatePaymentInfo = async () => {
        try {
            const res = await getLatePayment(id);
            setPaymentInfo(res[0]);
            setCurrentPipeline(res[0].CurrentPipelineStatus);
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

    // useEffect(() => {
    //     if (customerPaymentAccount.length > 0) {
    //         const card = customerPaymentAccount.find((card: any) => card.Id === paymentInfo.AccountId);
    //         setCreditCard(card);
    //     }
    // }, [customerPaymentAccount, paymentInfo.AccountId]);

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
                                        <p>${formatDate(new Date())}</p>
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
        console.log(data);
        sendIndividualEmail(data).then((res) => {
            console.log(res);
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
        try {
            const previousNotes = paymentNotes;
            const newNotes = `${previousNotes}\n${newNote}`;
            const res = await addPaymentNotes(paymentInfo.PaysimpleTransactionId, newNote);
            if (res) {
                console.log(res);
                setPaymentNotes(newNotes);
                setNewNote('');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 max-w-5xl mx-auto">
            <div className="panel pb-0 sm:col-span-2 px-0">
                <div className="space-y-4 px-5">
                    <p className="font-bold ">
                        Student:{' '}
                        <span className="font-semibold text-primary">
                            {student?.First_Name} {student?.Last_Name}
                        </span>
                    </p>
                    <p className="font-bold ">
                        Billing Account: <span className="font-semibold text-primary">{paymentInfo?.CustomerName}</span>
                    </p>
                    <p className="font-bold ">
                        Card Number: <span className="font-semibold">{paymentInfo?.CustomerName}</span>
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
                        Settlement Date: <span className="font-semibold">{paymentIDInfo?.ActualSettledDate && formatDate(paymentIDInfo?.ActualSettledDate)}</span>
                    </p>
                    <p className="font-bold ">
                        Status: <span className={`font-semibold ${paymentIDInfo?.Status === 'Failed' && 'text-danger'}`}>{paymentIDInfo?.Status}</span>
                    </p>
                    <p className="font-bold ">
                        Can Void Until: <span className="font-semibold">{paymentIDInfo?.CanVoidUntil && formatDate(paymentIDInfo?.CanVoidUntil)}</span>
                    </p>
                    <p className="font-bold ">
                        Return Date: <span className="font-semibold">{}</span>
                    </p>
                    <p className="font-bold ">
                        Payment Schedule Id: <span className="font-semibold">{paymentIDInfo?.RecurringScheduleId}</span>
                    </p>

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
                <div className="flex justify-center mt-8  ">
                    <div className="cursor-pointer w-full border p-5 rounded-bl-lg text-center font-semibold text-success hover:bg-success/10" onClick={() => setEmailReciept(!emailReciept)}>
                        Send Email Recipet
                    </div>
                    <button className="cursor-pointer w-full border p-5 rounded-br-lg text-center font-semibold text-info hover:bg-info/10" onClick={handlePrintReceipt}>
                        Print Recipet
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
            <div className="panel">
                <h2 className="text-xl">Notes</h2>
                {paymentNotes?.split('\n').map((note: any, index: any) => {
                    return (
                        <div key={index} className="border-b border-gray-200 py-2">
                            <p>{note}</p>
                        </div>
                    );
                })}
                <textarea className="form-textarea w-full h-20 mt-4" placeholder="Add a note" value={newNote} onChange={(e) => setNewNote(e.target.value)} />
                <div className="flex justify-end">
                    <button className="btn btn-primary"
                        onClick={handleAddNote}
                    >Add Note</button>
                </div>
            </div>
            <div className="panel">
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
                <div className="flex justify-end">
                    <button className="btn btn-primary">Update Step</button>
                </div>
            </div>
        </div>
    );
}
