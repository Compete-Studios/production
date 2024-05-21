import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';
import { getStudentIdFromPaysimpleCustomerId, getStudentInfo } from '../../functions/api';
import { UserAuth } from '../../context/AuthContext';
import mastercardIcon from '../../assets/creditcardicons/mastercard.svg';
import visaIcon from '../../assets/creditcardicons/visa.svg';
import amexIcon from '../../assets/creditcardicons/amex.svg';
import discoverIcon from '../../assets/creditcardicons/discover.svg';
import genericIcon from '../../assets/creditcardicons/generic.svg';
import { getAllCustomerPaymentAccounts, getPaymentByID, voidAPayment } from '../../functions/payments';
import { REACT_BASE_URL } from '../../constants';
import { formatDate } from 'date-fns';
import { sendIndividualEmail } from '../../functions/emails';
import { hashTheID, showErrorMessage, showMessage, showWarningMessage } from '../../functions/shared';
import { Link } from 'react-router-dom';
import IconSend from '../../components/Icon/IconSend';
import { formatWithTimeZone, handleGetTimeZoneOfUser } from '../../functions/dates';
import IconEye from '../../components/Icon/IconEye';

export default function PaymentInfoSlider({ payID }: any) {
    const { suid, studioInfo, studioOptions }: any = UserAuth();
    const [open, setOpen] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState<any>({});
    const [customerPaymentAccount, setCustomerPaymentAccount] = useState<any>({});
    const [creditCard, setCreditCard] = useState<any>({});
    const [voidDate, setVoidDate] = useState<any>({});
    const [student, setStudent] = useState<any>({});
    const [emailReciept, setEmailReciept] = useState(false);
    const [notes, setNotes] = useState<any>('');
    const [fromEmail, setFromEmail] = useState<any>('');
    const [toEmail, setToEmail] = useState<any>('');

    const cardIcons: any = {
        Visa: visaIcon,
        Master: mastercardIcon,
        Amex: amexIcon,
        Discover: discoverIcon,
        Generic: genericIcon,
    };

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

    const handleGetPaymeingInfo = async () => {
        try {
            getPaymentByID(payID, suid).then((res) => {
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

    useEffect(() => {
        if (customerPaymentAccount.length > 0) {
            const card = customerPaymentAccount.find((card: any) => card.Id === paymentInfo.AccountId);
            setCreditCard(card);
        }
    }, [customerPaymentAccount, paymentInfo.AccountId]);

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

    const subjectForEmail = `Receipt #${payID} from ${studioInfo?.Studio_Name}`;

    const handleSendEmail = async () => {
        const htmlData = await recipieptHTML(payID);
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
        const htmlData = await recipieptHTML(payID);
        const printWindow = window.open('', '_blank');
        printWindow?.document.open();
        printWindow?.document.write(htmlData);
        printWindow?.document.close();
    };

    const handleVoidPayment = async () => {
        const voidData = {
            studioId: suid,
            paymentId: payID,
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

    return (
        <>
            <button className="text-info hover:text-blue-800 flex items-center gap-1" onClick={() => setOpen(true)}>
                <IconEye /> View Payment
            </button>
            <Transition.Root show={open} as={Fragment}>
                <Dialog className="relative z-50" onClose={setOpen}>
                    <div className="fixed inset-0" />

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                                        <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                            <div className="px-4 sm:px-6">
                                                <div className="flex items-start justify-between">
                                                    <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">Payment Information for #{payID}</Dialog.Title>
                                                    <div className="ml-3 flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none "
                                                            onClick={() => setOpen(false)}
                                                        >
                                                            <span className="absolute -inset-2.5" />
                                                            <span className="sr-only">Close panel</span>
                                                            <IconX className="h-6 w-6" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                                <div>
                                                    <div className="flex items-center justify-between">
                                                        <h2 className="text-xl">Payment Information</h2>
                                                        <Link to="/payments/late-payment-pipeline" className="text-primary">
                                                            View your payment pipeline
                                                        </Link>
                                                    </div>
                                                    <div className='py-6'>
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
                                                        <dl className="w-full grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 ">
                                                            <div>
                                                                <dt className="font-medium ">Billing Information</dt>
                                                                <dd className="mt-3">
                                                                        Student:{' '}
                                                                        <span>
                                                                            {' '}
                                                                            <Link
                                                                                to={`/students/view-student/${hashTheID(student.Student_id)}/${hashTheID(suid)}`}
                                                                                className="text-info font-bold hover:text-blue-800 "
                                                                            >
                                                                                {student?.First_Name} {student?.Last_Name}
                                                                            </Link>
                                                                        
                                                                    </span>
                                                                    <span className="block mt-2">
                                                                        Billing Account:{' '}
                                                                        <span>
                                                                            {' '}
                                                                            <Link to="/students/update-billing" className="text-info font-bold hover:text-blue-800">
                                                                                {paymentInfo?.CustomerFirstName} {paymentInfo?.CustomerLastName}
                                                                            </Link>
                                                                        </span>{' '}
                                                                    </span>
                                                                    <span className="block mt-8">
                                                                        Status:{' '}
                                                                        <span>
                                                                            {' '}
                                                                            <Link to="/students/update-billing" className="text-info font-bold hover:text-blue-800">
                                                                                {paymentInfo?.Status}
                                                                            </Link>
                                                                        </span>{' '}
                                                                    </span>
                                                                </dd>
                                                            </div>
                                                        </dl>

                                                        <dl className="mt-8 w-full divide-y divide-gray-200 text-sm lg:mt-0">
                                                            <div className="flex items-center justify-between pb-4">
                                                                <dt className="">Can Void Until</dt>
                                                                <dd className="font-medium ">{}</dd>
                                                            </div>
                                                            <div className="flex items-center justify-between py-4">
                                                                <dt className="">Transaction ID</dt>
                                                                <dd className="font-medium ">{paymentInfo?.Id}</dd>
                                                            </div>
                                                            <div className="flex items-center justify-between py-4">
                                                                <dt className="">Authorization Code</dt>
                                                                <dd className="font-medium ">{paymentInfo?.ProviderAuthCode}</dd>
                                                            </div>
                                                            <div className="flex items-center justify-between pt-4 text-2xl">
                                                                <dt className="font-medium text-gray-900 dark:text-white">Amount</dt>
                                                                <dd className="font-medium text-success">${paymentInfo?.Amount?.toFixed(2)}</dd>
                                                            </div>
                                                        </dl>
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-4">
                                                        <button className="btn btn-info w-full" onClick={() => setEmailReciept(!emailReciept)}>
                                                            Email Reciept
                                                        </button>
                                                        <button className="btn btn-primary w-full" onClick={() => handlePrintReceipt()}>
                                                            Print Reciept
                                                        </button>
                                                        <button
                                                            className="btn btn-secondary w-full"
                                                            onClick={() => handleVoidPayment()}
                                                            disabled={
                                                                paymentInfo?.Status === 'Voided' ||
                                                                paymentInfo?.Status === 'Declined' ||
                                                                paymentInfo?.Status === 'Refunded' ||
                                                                paymentInfo?.Status === 'Voided'
                                                            }
                                                        >
                                                            Void Payment
                                                        </button>
                                                    </div>
                                                    {/* {emailReciept && (
                                                        <div className="mt-4 space-y-4">
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
                                                    )} */}
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}
