import { useEffect, useState } from 'react';
import Hashids from 'hashids';
import { getStudentIdFromPaysimpleCustomerId, getStudentInfo } from '../../functions/api';
import { UserAuth } from '../../context/AuthContext';
import mastercardIcon from '../../assets/creditcardicons/mastercard.svg';
import visaIcon from '../../assets/creditcardicons/visa.svg';
import amexIcon from '../../assets/creditcardicons/amex.svg';
import discoverIcon from '../../assets/creditcardicons/discover.svg';
import genericIcon from '../../assets/creditcardicons/generic.svg';
import { addPaymentNotes, getAllCustomerPaymentAccounts, getPaymentByID, getPaymentNotes, voidAPayment } from '../../functions/payments';
import { REACT_BASE_URL } from '../../constants';
import { sendIndividualEmail } from '../../functions/emails';
import { hashTheID, showErrorMessage, showMessage, showWarningMessage, statusCSS } from '../../functions/shared';
import { Link, useParams } from 'react-router-dom';
import { formatWithTimeZone, handleGetTimeZoneOfUser } from '../../functions/dates';
import IconSend from '../../components/Icon/IconSend';
import BaseEmail from '../Tools/BaseEmail';
import Tippy from '@tippyjs/react';

export default function ViewPaymentInfo() {
    const { suid, studioInfo, studioOptions }: any = UserAuth();
    const hashids = new Hashids();
    const [paymentNotes, setPaymentNotes] = useState<any>('');
    const [newNote, setNewNote] = useState<any>('');
    const [paymentInfo, setPaymentInfo] = useState<any>({});
    const [customerPaymentAccount, setCustomerPaymentAccount] = useState<any>({});
    const [creditCard, setCreditCard] = useState<any>({});
    const [voidDate, setVoidDate] = useState<any>({});
    const [student, setStudent] = useState<any>({});
    const [emailReciept, setEmailReciept] = useState(false);
    const [notes, setNotes] = useState<any>('');
    const [fromEmail, setFromEmail] = useState<any>('');
    const [toEmail, setToEmail] = useState<any>('');

    const { payID, amyID }: any = useParams();

    const paymentID: any = hashids.decode(payID)[0];
    const studID: any = hashids.decode(amyID)[0];

    // useEffect(() => {
    //     if (parseInt(studID) !== parseInt(suid)) showMessage('You are not authorized to view this page');
    // }, []);

    const cardIcons: any = {
        Visa: visaIcon,
        Master: mastercardIcon,
        Amex: amexIcon,
        Discover: discoverIcon,
        Generic: genericIcon,
    };

    const handleGetCustomerInfo = async (customerID: any) => {
        console.log('customerID', customerID);
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

    const handleGetPaymeingInfo = async () => {
        try {
            getPaymentByID(paymentID, suid).then((res) => {
                if (res.Meta.HttpStatusCode) {
                    setPaymentInfo(res.Response);
                    handleGetCustomerInfo(res.Response.CustomerId);
                    if (res.Response.CanVoidUntil) {
                        setVoidDate(res.Response.CanVoidUntil);
                    } else {
                        setVoidDate(res.Response.CreatedOn);
                    }

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
            });
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        handleGetPaymeingInfo();
    }, []);

    const handleGetNotes = async () => {
        const paymentNotes = await getPaymentNotes(paymentInfo?.Id);
        setPaymentNotes(paymentNotes[0].Notes);
    };

    useEffect(() => {
        handleGetNotes();
    }, [paymentInfo]);

    useEffect(() => {
        if (customerPaymentAccount.length > 0) {
            const card = customerPaymentAccount.find((card: any) => card.Id === paymentInfo.AccountId);
            setCreditCard(card);
        }
    }, [customerPaymentAccount, paymentInfo.AccountId]);

    const handleAddNote = async () => {
        if (!newNote) return showErrorMessage('Please add a note');
        try {
            const newNotes = `${paymentNotes}\n${newNote}`; // Create a new string with the new note appended
            const res = await addPaymentNotes(paymentInfo.Id, newNotes);
            if (res) {
                console.log(res);
                setPaymentNotes(newNotes); // Update the paymentNotes state with the new string
                setNewNote('');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const recipieptHTML = async () => {
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
                                        <p>${paymentInfo?.CustomerFirstName} ${paymentInfo?.CustomerLastName}</p>
                                        <b>Payment Result: </b>
                                        <p>${paymentInfo?.ProviderAuthCode}</p>
                                        <b>Amount: </b>
                                        <p>$ ${paymentInfo?.Amount?.toFixed(2)}</p>
                                        <b>Payment Status: </b>
                                        <p>${paymentInfo?.Status}</p>
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

    const subjectForEmail = `Receipt #${paymentID} from ${studioInfo?.Studio_Name}`;

    const handleSendEmail = async () => {
        const htmlData = await recipieptHTML();
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
        const htmlData = await recipieptHTML();
        const printWindow = window.open('', '_blank');
        printWindow?.document.open();
        printWindow?.document.write(htmlData);
        printWindow?.document.close();
    };

    const handleVoidPayment = async () => {
        const voidData = {
            studioId: suid,
            paymentId: paymentID,
        };
        try {
            showWarningMessage('Are you sure you want to void this payment?', 'Void Payement', 'Payment has been Successfully voided').then((confirmed: boolean) => {
                if (confirmed) {
                    voidAPayment(voidData).then((res) => {
                        console.log(res);
                        if (res.Meta.HttpStatusCode) {
                            setPaymentInfo(res.Response);
                            handleGetCustomerInfo(res.Response.CustomerId);
                            if (res.Response.CanVoidUntil) {
                                setVoidDate(res.Response.CanVoidUntil);
                            } else {
                                setVoidDate(res.Response.CreatedOn);
                            }

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
                    });
                } else {
                    // User canceled the action
                    console.log('User canceled');
                }
            });
        } catch (error) {
            console.log('error', error);
        }
    };

    const mockEmail = {
        to: 'bret@techbret.com',
        from: studioOptions?.EmailFromAddress,
        subject: subjectForEmail,
        html: '',
        deliverytime: null,
    };
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex h-full flex-col bg-white py-6 shadow-xl">
                <div className="relative flex-1 px-4 sm:px-6">
                    <div>
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl">Payment Information</h2>
                            <Link to="/payments/late-payment-pipeline" className="text-primary">
                                View your payment pipeline
                            </Link>
                        </div>
                        <div className="py-6">
                            <dt className="font-medium ">Card information</dt>
                            <dd className="relative block bg-gradient-to-r from-cyan-200 via-teal-300 to-cyan-300 w-full rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-white p-4">
                                <img src={cardIcons[creditCard?.Issuer ?? 'Generic']} alt="Visa" className="w-12 h-auto" />
                                <p className="sr-only">{creditCard?.Issuer}</p>

                                <div className="mt-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm text-zinc-500">Card Number</label>
                                            <div className="text-lg text-zinc-950 font-semibold -mt-2">{creditCard?.CreditCardNumber}</div>
                                        </div>
                                        <div>
                                            <label className="text-sm text-zinc-500">Expires</label>
                                            <div className="text-lg font-semibold text-zinc-950 -mt-2">{creditCard?.ExpirationDate}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div>
                                            <label className="text-sm text-zinc-500">Card Holder</label>
                                            <div className="text-xl font-bold text-zinc-950 -mt-2">{creditCard?.AccountHolderName}</div>
                                        </div>
                                    </div>
                                </div>
                            </dd>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-6 sm:rounded-lg sm:px-6 lg:flex lg:items-start lg:justify-between lg:px-8 lg:py-8">
                            <dl className="mt-8 w-full divide-y divide-gray-200 text-sm lg:mt-0">
                                <div className="flex items-center justify-between pb-4">
                                    <dt className="">Student</dt>
                                    {student?.First_Name || student?.Last_Name ? (
                                        <dd className="font-medium ">
                                            {' '}
                                            <Link
                                                to={`/students/view-student/${hashTheID(student.Student_id)}/${hashTheID(suid)}`}
                                                className="text-info font-bold hover:text-blue-800 whitespace-nowrap "
                                            >
                                                {student?.First_Name} {student?.Last_Name}
                                            </Link>
                                        </dd>
                                    ) : (
                                        <dd className="font-medium ">No Student Found</dd>
                                    )}
                                </div>
                                <div className="flex items-center justify-between py-4">
                                    <dt className="">Billing Account</dt>
                                    <dd className="font-medium ">
                                        <Link to="/students/update-billing" className="text-info font-bold hover:text-blue-800">
                                            {paymentInfo?.CustomerFirstName} {paymentInfo?.CustomerLastName}
                                        </Link>
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between py-4">
                                    <dt className="">Status</dt>
                                    <dd className={`font-medium ${statusCSS(paymentInfo?.Status)}`}>{paymentInfo?.Status}</dd>
                                </div>
                                <div className="flex items-center justify-between py-4">
                                    <dt className="">Can Void Until</dt>
                                    <dd className="font-medium ">{formatWithTimeZone(new Date(paymentInfo?.CanVoidUntil), handleGetTimeZoneOfUser)}</dd>
                                </div>
                                <div className="flex items-center justify-between py-4">
                                    <dt className="">Transaction ID</dt>
                                    <dd className="font-medium ">{paymentInfo?.Id}</dd>
                                </div>
                                <div className="flex items-center justify-between py-4">
                                    <dt className="">Authorization Code</dt>
                                    <dd className="font-medium ">{paymentInfo?.ProviderAuthCode}</dd>
                                </div>
                                <div className="flex items-center justify-between py-4">
                                    <dt className="">Payment Schedule Id</dt>
                                    <dd className="font-medium ">{paymentInfo?.RecurringScheduleId}</dd>
                                </div>

                                <div className="flex items-center justify-between pt-4 text-2xl">
                                    <dt className="font-medium text-gray-900 dark:text-white">Amount</dt>
                                    <dd className="font-medium text-success">${paymentInfo?.Amount?.toFixed(2)}</dd>
                                </div>
                            </dl>
                        </div>
                        {paymentInfo?.Status === 'Posted' && (
                            <div className="text-center mt-4 text-success">This payment is awaiting authorization. It can be refunded after it has left this status or has settled.</div>
                        )}
                        {paymentInfo?.Status === 'RefundSettled' && <div className="text-center mt-4 text-info">This payment is a refund and has settled.</div>}

                        <div className="flex items-center gap-4 mt-4">
                            <div className="w-full">
                                <BaseEmail
                                    email={mockEmail}
                                    emailhtml={recipieptHTML()}
                                    setNotes={setNotes}
                                    notes={notes}
                                    title={'Email Reciept'}
                                    additional="Any notes you would like to add to the receipt?"
                                />
                            </div>
                            <button className="btn btn-primary w-full" onClick={() => handlePrintReceipt()}>
                                Print Reciept
                            </button>
                            {paymentInfo?.Status === 'Authorized' ? (
                                <button
                                    className="btn btn-secondary w-full"
                                    onClick={() => handleVoidPayment()}
                                    disabled={paymentInfo?.Status === 'Settled' || paymentInfo?.Status === 'Declined' || paymentInfo?.Status === 'Refunded' || paymentInfo?.Status === 'Voided'}
                                >
                                    Void Payment
                                </button>
                            ) : paymentInfo?.Status === 'Settled' ? (
                                <button className="btn btn-danger w-full" onClick={() => handleVoidPayment()}>
                                    Refund Payment
                                </button>
                            ) : (
                                <button className="btn btn-secondary w-full" onClick={() => handleVoidPayment()} disabled>
                                    Void Payment
                                </button>
                            )}
                        </div>                       
                    </div>
                </div>
            </div>
            <div className="panel p-0 relative">
                <div className="p-5 pb-20">
                    <h2 className="text-xl">Late Payment Notes</h2>
                    <div className="p-3 bg-dark-light/50 dark:bg-dark mt-2 border rounded-sm">
                        {paymentNotes?.split('\n').map((note: any, index: any) => {
                            return (
                                <div key={index} className={`${note?.length > 1 && 'p-2 border-b border-dashed border-zinc-400 dark:border-gray-700'} `}>
                                    <p>{note}</p>
                                </div>
                            );
                        })}
                    </div>
                    <textarea className="form-textarea w-full h-20 mt-4" placeholder="Add a note" value={newNote} onChange={(e) => setNewNote(e.target.value)} />
                    {!newNote && <p className="text-danger text-xs text-center">*To add a new note begin typing</p>}
                </div>
                <div className="absolute bottom-0 right-0 left-0">
                    <button
                        className="cursor-pointer w-full p-5 border-t rounded-b-lg text-center font-semibold text-success hover:bg-success/10 whitespace-nowrap
                                                    disabled:text-zinc-300 disabled:bg-dark-light
                                                    "
                        onClick={handleAddNote}
                        disabled={!newNote}
                    >
                        Save New Note
                    </button>
                </div>
                <div className="absolute bottom-0 right-0 left-0">
                    <button
                        className="cursor-pointer w-full p-5 border-t rounded-b-lg text-center font-semibold text-success hover:bg-success/10 whitespace-nowrap
                                                    disabled:text-zinc-300 disabled:bg-dark-light
                                                    "
                        onClick={handleAddNote}
                        disabled={!newNote}
                    >
                        Save New Note
                    </button>
                </div>
            </div>
        </div>
    );
}
