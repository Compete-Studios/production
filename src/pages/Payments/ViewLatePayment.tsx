import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { convertPhone, hashTheID, showErrorMessage, showMessage, unHashTheID } from '../../functions/shared';
import { UserAuth } from '../../context/AuthContext';
import {
    addPaymentNotes,
    getAllCustomerPaymentAccounts,
    getCustomerPayments,
    getInternalPaymentsByStudentId,
    getLatePayment,
    getPaymentByID,
    getPaymentNotes,
    runPaymentForCustomer,
    updateLatePaymentDateStepID,
    addLatePayment,
    showAPaymentWasRetried
} from '../../functions/payments';
import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import { getPaysimpleCustomerIdFromStudentId, getStudentIdFromPaysimpleCustomerId, getStudentInfo, updateStudentNotes } from '../../functions/api';
import { sendIndividualEmail } from '../../functions/emails';
import { REACT_BASE_URL } from '../../constants';
import { formatWithTimeZone, handleGetTimeZoneOfUser } from '../../functions/dates';
import AddNoteModal from '../Students/AddNoteModal';
import mastercardIcon from '../../assets/creditcardicons/mastercard.svg';
import visaIcon from '../../assets/creditcardicons/visa.svg';
import amexIcon from '../../assets/creditcardicons/amex.svg';
import discoverIcon from '../../assets/creditcardicons/discover.svg';
import genericIcon from '../../assets/creditcardicons/generic.svg';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconPlus from '../../components/Icon/IconPlus';
import AddCardModal from '../Students/AddCardModal';
import AddBankModal from '../Students/AddBankModal';
import EmailFailedPayment from './EmailFailedPayment';
import TextFailedPayment from './TextFailedPayment';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconNotes from '../../components/Icon/IconNotes';
import PaymentInfoSlider from './PaymentInfoSlider';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import IconCopy from '../../components/Icon/IconCopy';
import Hashids from 'hashids';

interface Payment {
    PaymentDate: string;
}

export default function ViewLatePayment() {
    const { suid, latePayementPipeline, studioInfo, update, setUpdate }: any = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('View Late Payment Info'));
    });
    const { id, stud }: any = useParams();
    const hashids = new Hashids();

    const [loading, setLoading] = useState(true);
    const [message1, setMessage1] = useState<any>('https://www.competestudio.pro/resolve-payment/0');

    const [paymentInfo, setPaymentInfo] = useState<any>({});
    const [mutablePaymentInfo, setMutablePaymentInfo] = useState<any>({});
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
    const [mutablePipelineStep, setMutablePipelineStep] = useState<number>(0);
    const [paysimplehistory, setPaysimpleHistory] = useState<any>([]);
    const [internalHistory, setInternalHistory] = useState<any>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [defaultTab, setDefaultTab] = useState<any>(0);
    const [defaultCard, setDefaultCard] = useState<any>('');
    const [billingInfo, setBillingInfo] = useState<any>({});
    const [loadingData, setLoadingData] = useState({
        student: true,
        paymentInfo: true,
        paymentIDInfo: true,
        customerPaymentAccount: true,
        paymentNotes: true,
        billingInfo: true,
        overall: true,
    });

    const cardIcons: any = {
        Visa: visaIcon,
        Master: mastercardIcon,
        Amex: amexIcon,
        Discover: discoverIcon,
        Generic: genericIcon,
    };

    const bgcssColors: any = [
        'bg-gradient-to-r from-cyan-200 via-teal-300 to-cyan-300',
        'bg-gradient-to-r from-orange-200 via-red-300 to-orange-300',
        'bg-gradient-to-r from-pink-200 via-rose-300 to-pink-300',
        'bg-gradient-to-r from-indigo-200 via-sky-300 to-indigo-300',
    ];

    const navigate = useNavigate();

    const updateOverallLoading = () => {
        const { student, paymentInfo, paymentIDInfo, customerPaymentAccount, paymentNotes, billingInfo } = loadingData;
        const overallLoading = student || paymentInfo || paymentIDInfo || customerPaymentAccount || paymentNotes || billingInfo;
        setLoadingData((prevState) => ({ ...prevState, overall: overallLoading }));
    };

    const handleGetCustomerInfo = async (customerID: any) => {
        try {
            getStudentIdFromPaysimpleCustomerId(customerID).then(async (res) => {
                if (res.recordset) {
                    const studentID = await res.recordset[0].studentId;
                    await getStudentInfo(studentID).then((res) => {
                        setStudent(res);
                        setToEmail(res.email);
                    });
                    await handleGetInternalPayments(studentID);
                    setLoadingData((prevState) => ({ ...prevState, student: false }));
                } else {
                    console.log('Error getting payment info');
                    setLoadingData((prevState) => ({ ...prevState, student: false }));
                }
            });
        } catch (error) {
            console.log('error', error);
            setLoadingData((prevState) => ({ ...prevState, student: false }));
        } finally {
            updateOverallLoading();
        }
    };

    const handleGetPaymentHistory = async (data: any) => {
        console.log(data, 'data');
        try {
            const res = await getCustomerPayments(data);
            setPaysimpleHistory(res?.Response);
            setLoadingData((prevState) => ({ ...prevState, paymentInfo: false }));
        } catch (error) {
            console.log('error', error);
            setLoadingData((prevState) => ({ ...prevState, paymentInfo: false }));
        } finally {
            updateOverallLoading();
        }
    };

    const handleGetInternalPayments = async (studentID: any) => {
        try {
            const res = await getInternalPaymentsByStudentId(studentID);
            setInternalHistory(res);
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        if (paysimplehistory.length > 0 && internalHistory.length > 0) {
            const allPayments = [...paysimplehistory, ...internalHistory];
            const sortedPayments = allPayments.sort((a: Payment, b: Payment) => new Date(b.PaymentDate).getTime() - new Date(a.PaymentDate).getTime());
            setPaymentHistory(sortedPayments);
        } else if (paysimplehistory.length > 0) {
            setPaymentHistory(paysimplehistory);
        } else if (internalHistory.length > 0) {
            setPaymentHistory(internalHistory);
        } else {
            setPaymentHistory([]);
        }
    }, [paysimplehistory, internalHistory]);

    const handleGetPaymentInfo = async (payID: any) => {
        try {
            const res = await getPaymentByID(payID, suid);
            if (res.Meta.HttpStatusCode) {
                setPaymentIDInfo(res.Response);
                handleGetCustomerInfo(res.Response.CustomerId);
                setLoadingData((prevState) => ({ ...prevState, paymentIDInfo: false }));
                if (res.Response.PaymentType === 'CC') {
                    getAllCustomerPaymentAccounts(res.Response.CustomerId, suid).then((res2) => {
                        if (res2.Response) {
                            setCustomerPaymentAccount(res2?.Response?.CreditCardAccounts);
                            setLoadingData((prevState) => ({ ...prevState, customerPaymentAccount: false }));
                        } else {
                            console.log('Error getting payment info');
                            setLoadingData((prevState) => ({ ...prevState, customerPaymentAccount: false }));
                        }
                    });
                } else {
                    getAllCustomerPaymentAccounts(res.Response.CustomerId, suid).then((res2) => {
                        if (res2.Response) {
                            setCustomerPaymentAccount(res2?.Response?.AchAccounts);
                            setLoadingData((prevState) => ({ ...prevState, customerPaymentAccount: false }));
                        } else {
                            console.log('Error getting payment info');
                            setLoadingData((prevState) => ({ ...prevState, customerPaymentAccount: false }));
                        }
                    });
                }
            } else {
                alert('Error getting payment info');
                setLoadingData((prevState) => ({ ...prevState, paymentIDInfo: false }));
            }
        } catch (error) {
            console.log('error', error);
            setLoadingData((prevState) => ({ ...prevState, paymentIDInfo: false }));
        } finally {
            updateOverallLoading();
        }
    };

    useEffect(() => {
        if (paymentIDInfo && suid && student?.Student_id) {
            setMessage1(`${REACT_BASE_URL}payments/resolve-payment/${hashids.encode(paymentIDInfo?.Id, suid, student?.Student_id)}`);
        } else {
            console.log('Error getting payment info');
        }
    }, [paymentIDInfo, suid, student?.Student_id]);

    const getBillingInfo = async (paySimpleID: any, studioId: any) => {
        try {
            if (paySimpleID && suid) {
                const customerIdResponse = await getPaysimpleCustomerIdFromStudentId(paySimpleID, studioId);
                if (customerIdResponse?.Response) {
                    setBillingInfo(customerIdResponse?.Response);
                    setLoading(false);
                    setLoadingData((prevState) => ({ ...prevState, billingInfo: false }));
                } else {
                    setBillingInfo(null);
                    setLoading(false);
                    setLoadingData((prevState) => ({ ...prevState, billingInfo: false }));
                }
            } else {
                setBillingInfo(null);
                setLoading(false);
                setLoadingData((prevState) => ({ ...prevState, billingInfo: false }));
            }
        } catch {
            console.log('error');
            setLoading(false);
            setLoadingData((prevState) => ({ ...prevState, billingInfo: false }));
        } finally {
            updateOverallLoading();
        }
    };

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
            setDefaultCard(card?.IsDefault ? card?.Id : '');
        } else {
            console.log('Error getting payment info');
        }
    }, [customerPaymentAccount, paymentInfo.AccountId]);

    const getTheLatePaymentInfo = async () => {
        try {
            const res = await getLatePayment(id);
            setPaymentInfo(res[0]);
            setMutablePaymentInfo(res[0]);
            setCurrentPipeline(res[0].CurrentPipelineStatus);
            setMutablePipelineStep(res[0].CurrentPipelineStatus);
            const data = {
                customerId: res[0].PaysimpleCustomerId,
                studioId: suid,
            };
            handleGetPaymentHistory(data);
            getBillingInfo(res[0].PaysimpleCustomerId, suid);
            if (res[0].PaysimpleTransactionId) {
                handleGetPaymentInfo(res[0].PaysimpleTransactionId);
            }
            if (res[0].PaymentId) {
                const paymentNotes = await getPaymentNotes(res[0].PaysimpleTransactionId);
                setPaymentNotes(paymentNotes[0].Notes);
                setLoadingData((prevState) => ({ ...prevState, paymentNotes: false }));
            }
        } catch (error) {
            console.log(error);
        } finally {
            updateOverallLoading();
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

    const handleUpdateLatePayment = async (e: any) => {
        e.preventDefault();
        const data = {
            paysimpleTransactionId: paymentInfo.PaysimpleTransactionId,
            currentPipelineStatus: mutablePipelineStep,
            nextContactDate: mutablePaymentInfo.NextContactDate,
        };
        try {
            const res = await updateLatePaymentDateStepID(data);
            if (res) {
                console.log(res);
                showMessage('Pipeline Updated');
                setUpdate(!update);
            }
        } catch (error) {
            console.log(error);
        }
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

    const handleGoToPayments = () => {
        const newID = parseInt(student?.Student_id) * parseInt(suid);
        navigate(`/students/${newID}/finish-billing-setup-options`);
    };

    const handleRetryPayment = async () => {
        // Get the original payment ID before anything else
        const originalPaymentId = paymentInfo?.PaysimpleTransactionId;
        if (!originalPaymentId) {
            showErrorMessage('No payment ID found. Cannot retry payment.');
            return;
        }

        const newPaymentInfo = {
            Amount: paymentInfo?.Amount,
            paymentAccountId: creditCard.Id,
            emailForReceipt: toEmail,
        };

        try {
            // Run the payment on the same card
            const res = await runPaymentForCustomer(newPaymentInfo);
            const response = res.Response;

            // Successful payment
            if (response && response.Status === 'Authorized') {
                const newPaymentId = response.Id;
                
                // Add the new payment to our db in LatePAyments table
                const newPayment = {
                    studioId: suid,
                    paysimpleTransactionId: newPaymentId,
                    retriedTransactionId: 0,
                    ignoreThisPayment: false,
                    paysimpleCustomerId: response.CustomerId,
                    customerName: `${response.CustomerFirstName} ${response.CustomerLastName}`,
                    amount: response.Amount,
                    date: response.PaymentDate,
                };

                await addLatePayment(newPayment);

                // Record that the retry happened
                const notes = `This payment is a retry of Paysimple payment: ${originalPaymentId}, which occurred on ${formatWithTimeZone(new Date(), handleGetTimeZoneOfUser())} for the amount of $${paymentInfo.Amount}.`;

                const retryData = {
                    originalPaymentId: originalPaymentId,
                    newPaymentId: newPaymentId,
                    retryTime: response.PaymentDate,
                    notes: notes,
                };

                await showAPaymentWasRetried(retryData);

                showMessage('Retry Payment Successful. You will be redirected to the new payment momentarily.');
                setTimeout(() => {
                    navigate(`/payments/view-late-payment/${suid}/${newPaymentId}`);
                }, 3000);
            }
            // Failed/declined payment
            else if (response && response.Status === 'Failed' && response.FailureData) {
                showErrorMessage(`Error running payment: ${response.FailureData.Description} - ${response.FailureData.MerchantActionText}`);
            }
            // API returned error in Meta.Errors
            else if (response && response.Meta && response.Meta.Errors) {
                 const errorMessages = response.Meta.Errors.ErrorMessages.map((error: any) => error.Message).join('; ');
                showErrorMessage(`Error running payment: ${errorMessages}`);
            }
            // Unexpected response structure
            else {
                showErrorMessage('Unexpected error occurred: Invalid response structure');
            }
        } catch (error) {
            let errorMessage = 'Unexpected error occurred';
            if (typeof error === 'object' && error !== null) {
                if ('message' in error) {
                    errorMessage = (error as any).message;
                } else if ('error' in error) {
                    errorMessage = (error as any).error;
                }
            }
            console.error(`Error running payment: ${errorMessage}`);
            showErrorMessage(`Error running payment: ${errorMessage}`);
        }
    };


    // const overallLoading = loadingData.student || loadingData.paymentInfo || loadingData.paymentIDInfo || loadingData.customerPaymentAccount || loadingData.paymentNotes || loadingData.billingInfo;
    const [overallLoading, setOverallLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setOverallLoading(false);
        }, 2000);
    }, [loadingData]);

    return (
        <>
            {overallLoading ? (
                <div className="max-w-full grid 2xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mx-auto min-h-[650px] max-h-screen animate-pulse">
                    <div className="panel bg-zinc-200 flex w-full h-full 2xl:row-span-1 sm:row-span-2"></div>
                    <div className="panel bg-zinc-200  flex w-full h-full"></div>
                    <div className="panel bg-zinc-200  flex w-full h-full"></div>
                </div>
            ) : (
                <>
                    {' '}
                    <div className="flex items-center justify-between flex-wrap">
                        <ul className="flex space-x-2 rtl:space-x-reverse">
                            <li>
                                <Link to="/payments/late-payment-pipeline" className="text-primary hover:underline">
                                    Late Payment Pipeline
                                </Link>
                            </li>
                            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-primary hover:underline">
                                <Link to={`/payments/late-payment-pipeline/view-payments/${currentPipeline}/${suid}`} className="text-primary hover:underline">
                                    Pipeline Step
                                </Link>
                            </li>
                            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                                <span>
                                    {student?.First_Name} {student?.Last_Name}
                                </span>
                            </li>
                        </ul>
                        <div className="flex items-center flex-wrap gap-2 mt-4 xl:mt-0">
                            <EmailFailedPayment suid={suid} PaymentPipelineStepId={currentPipeline} student={student} btn={true} />
                            <TextFailedPayment suid={suid} PaymentPipelineStepId={currentPipeline} student={student} btn={true} />
                            <button className="btn btn-warning gap-1 sm:w-auto w-full" onClick={handleRetryPayment}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z" />
                                </svg>
                                Retry Payment
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <div>
                            <h4 className="text-lg font-semibold">Payment Information</h4>
                        </div>
                    </div>
                    <div className="mt-5">
                        <label>Payment Link</label>
                    </div>
                    <form className="flex items-center gap-3">
                        <input type="text" value={message1} className="form-input" onChange={(e) => setMessage1(e.target.value)} />
                        <div className="sm:flex space-y-2 sm:space-y-0 sm:space-x-2 rtl:space-x-reverse ">
                            <CopyToClipboard
                                text={message1}
                                onCopy={(text, result) => {
                                    if (result) {
                                        showMessage('Link Copied to Clipboard');
                                    }
                                }}
                            >
                                <button type="button" className="btn btn-primary whitespace-nowrap gap-1">
                                    <IconCopy />
                                    Copy Payment Link
                                </button>
                            </CopyToClipboard>
                        </div>
                    </form>
                    <div className="mb-5 flex flex-col sm:flex-row">
                        <Tab.Group selectedIndex={defaultTab} onChange={setDefaultTab}>
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
                                        <div className="pt-5">
                                            <div className="grid sm:grid-cols-2 2xl:grid-cols-3 grid-cols-1 gap-4 ">
                                                <div className="panel p-0 sm:row-span-2 2xl:row-span-1 2xl:h-[575px] relative">
                                                    <div className="p-5">
                                                        <div className="border-b pb-2">
                                                            <div className="flex items-start justify-between w-full">
                                                                {' '}
                                                                <div>
                                                                    <Tippy content="View Student Profile" placement="right">
                                                                        <Link
                                                                            to={`/students/view-student/${hashTheID(student.Student_id)}/${hashTheID(suid)}`}
                                                                            className="flex text-2xl font-semibold  hover:text-green-800 text-primary gap-1"
                                                                        >
                                                                            {' '}
                                                                            {student?.First_Name} {student?.Last_Name}{' '}
                                                                            <span className="text-warning hover:yellow-900">
                                                                                <IconNotes />
                                                                            </span>
                                                                        </Link>
                                                                    </Tippy>
                                                                    <p className={`badge -mt-0.5 text-center ${student?.activity ? 'bg-success' : 'bg-danger'}`}>
                                                                        {student?.activity ? 'Active Student' : 'Inactive Student'}
                                                                    </p>
                                                                </div>
                                                                <p className="font-bold text-2xl text-danger">-${paymentInfo?.Amount}</p>
                                                            </div>

                                                            <EmailFailedPayment suid={suid} PaymentPipelineStepId={currentPipeline} student={student} btn={false} />
                                                            <TextFailedPayment suid={suid} PaymentPipelineStepId={currentPipeline} student={student} btn={false} />
                                                        </div>

                                                        <div className="mt-4 space-y-2">
                                                            <p className="font-bold ">
                                                                Status: <span className={`badge ${paymentIDInfo?.Status === 'Failed' ? 'bg-danger' : 'bg-success'}`}>{paymentIDInfo?.Status}</span>
                                                            </p>
                                                            <p className="font-bold ">
                                                                Payment Type: <span className="font-normal">{paymentIDInfo?.PaymentType}</span>
                                                            </p>
                                                            <p className="font-bold ">
                                                                Card Number: <span className="font-normal">{creditCard?.CreditCardNumber || 'N/A'}</span>
                                                            </p>
                                                            <p className="font-bold ">
                                                                Billing Account:{' '}
                                                                <span className="font-semibold text-info">
                                                                    <button onClick={() => setDefaultTab(3)}>{paymentInfo?.CustomerName}</button>
                                                                </span>
                                                            </p>
                                                            <p className="font-bold ">
                                                                Settlement Date:{' '}
                                                                <span className="font-normal">
                                                                    {paymentIDInfo?.ActualSettledDate && formatWithTimeZone(paymentIDInfo?.ActualSettledDate, handleGetTimeZoneOfUser())}
                                                                </span>
                                                            </p>
                                                            <p className="font-bold ">
                                                                Can Void Until:{' '}
                                                                <span className="font-normal">
                                                                    {paymentIDInfo?.CanVoidUntil && formatWithTimeZone(paymentIDInfo?.CanVoidUntil, handleGetTimeZoneOfUser())}
                                                                </span>
                                                            </p>
                                                            <p className="font-bold ">
                                                                Payment Schedule Id: <span className="text-info font-semibold">{paymentIDInfo?.RecurringScheduleId}</span>
                                                            </p>
                                                            <p className="font-bold ">
                                                                Transaction ID: <span className="text-info font-semibold">{paymentInfo?.PaysimpleTransactionId}</span>
                                                            </p>
                                                            <p className="font-bold ">
                                                                Return Date:{' '}
                                                                <span className="font-semibold">
                                                                    {paymentIDInfo?.ReturnDate ? formatWithTimeZone(paymentIDInfo?.ReturnDate, handleGetTimeZoneOfUser()) : 'N/A'}
                                                                </span>
                                                            </p>
                                                            <p className="font-bold ">
                                                                Authorization Code: <span className="font-normal">{paymentIDInfo?.ProviderAuthCode}</span>
                                                            </p>
                                                            <p className="text-danger font-semibold">{paymentIDInfo?.FailureData?.Description}</p>
                                                            <p className="text-danger font-semibold">{paymentIDInfo?.FailureData?.MerchantActionText}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-center absolute bottom-0 right-0 left-0">
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
                                                </div>
                                                <div className="panel p-0 relative">
                                                    <div className="p-5 pb-20">
                                                        <h2 className="text-xl">Payment Pipeline Status</h2>
                                                        <div className="mt-4">
                                                            Next Contact Date
                                                            <input
                                                                type="date"
                                                                className="form-input w-full mt-2"
                                                                value={mutablePaymentInfo?.NextContactDate ? mutablePaymentInfo.NextContactDate.slice(0, 10) : ''}
                                                                onChange={(e) => setMutablePaymentInfo({ ...paymentInfo, NextContactDate: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="mt-4">
                                                            {latePayementPipeline?.map((step: any) => {
                                                                return (
                                                                    <div key={step.PlacementOrdinal}>
                                                                        <label htmlFor={step.PaymentPipelineStepId} className="flex items-center cursor-pointer hover:bg-gray-100 p-1">
                                                                            <input
                                                                                type="radio"
                                                                                name="pipeline"
                                                                                className="form-radio"
                                                                                value={mutablePipelineStep}
                                                                                checked={mutablePipelineStep === step.PaymentPipelineStepId}
                                                                                onChange={() => setMutablePipelineStep(step.PaymentPipelineStepId)}
                                                                            />
                                                                            <span>{step.PipelineStepName}</span>
                                                                        </label>
                                                                    </div>
                                                                );
                                                            })}
                                                            <div>
                                                                <label htmlFor="completed" className="flex items-center cursor-pointer hover:bg-gray-100 p-1">
                                                                    <input
                                                                        type="radio"
                                                                        name="pipeline"
                                                                        className="form-radio"
                                                                        value={mutablePipelineStep}
                                                                        checked={mutablePipelineStep === 0}
                                                                        onChange={() => setMutablePipelineStep(0)}
                                                                    />
                                                                    <span>No Status/Ignore</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="absolute bottom-0 right-0 left-0">
                                                        <button
                                                            className="cursor-pointer w-full border-t p-5 rounded-b-md text-center font-semibold text-success hover:bg-success/10 whitespace-nowrap"
                                                            onClick={(e) => handleUpdateLatePayment(e)}
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
                                                    <div className="mt-4">
                                                        <div className="flex items-center justify-between gap-4 ">
                                                            <div className="text-2xl">
                                                                Student:{' '}
                                                                <span className="font-bold">
                                                                    {student?.First_Name} {student?.Last_Name}
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-4">
                                                                {!updateNotes && (
                                                                    <button className="text-danger ml-auto" onClick={() => handleUpdateNotes()}>
                                                                        Update All Notes
                                                                    </button>
                                                                )}
                                                                <div>{!updateNotes && <AddNoteModal student={student} setStudent={setStudent} />}</div>
                                                            </div>
                                                        </div>
                                                        <div className="lg:col-span-4 col-span-full mt-2">
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
                                                                    <th>Type</th>
                                                                    <th>Status</th>
                                                                    <th className="text-right">View</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {paymentHistory?.map((data: any) => {
                                                                    return (
                                                                        <tr
                                                                            key={data.Id}
                                                                            className={`${!data.Id ? 'bg-primary-light' : data.Status === 'Settled' ? 'bg-success-light' : 'bg-danger-light'} `}
                                                                        >
                                                                            <td className="font-bold">${data.Amount?.toFixed(2) || data.AmountPaid?.toFixed(2)}</td>
                                                                            <td>{data.PaymentDate && formatWithTimeZone(data.PaymentDate, handleGetTimeZoneOfUser())}</td>
                                                                            <td>
                                                                                {data.CustomerFirstName || student?.First_Name} {data.CustomerLastName || student?.Last_Name}
                                                                            </td>
                                                                            <td className={`text-xs font-bold ${data.Id ? 'text-success' : 'text-dark'}`}>
                                                                                {data.Id ? 'External Payment' : 'Internal Payment'}
                                                                            </td>
                                                                            <td className="">
                                                                                <span
                                                                                    className={`ml-auto badge whitespace-nowrap ${
                                                                                        data.Status === 'Settled'
                                                                                            ? 'bg-success'
                                                                                            : data.Status === 'Pending'
                                                                                            ? 'bg-warning'
                                                                                            : data.Status === 'In Progress'
                                                                                            ? 'bg-info'
                                                                                            : data.Status === 'Failed'
                                                                                            ? 'bg-danger'
                                                                                            : 'bg-primary'
                                                                                    }`}
                                                                                >
                                                                                    {data.Status || 'Internal'}
                                                                                </span>
                                                                            </td>
                                                                            <td className="flex">
                                                                                <div className="ml-auto">
                                                                                    <PaymentInfoSlider payID={data.Id} />
                                                                                </div>
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
                                            <div>
                                                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full items-start">
                                                    {/* BILLING INFO */}
                                                    <div className="row-span-4">
                                                        <div className="panel p-0">
                                                            <div className="flex items-center justify-between p-5">
                                                                <h5 className="font-semibold text-lg dark:text-white-light">Billing Info</h5>
                                                            </div>
                                                            {loading ? (
                                                                <div className="flex items-center justify-center h-56">
                                                                    <span className="animate-spin border-4 border-primary border-l-transparent rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    {!billingInfo || Object?.keys(billingInfo)?.length === 0 ? (
                                                                        <div className="flex items-center justify-center h-56">
                                                                            <div className="text-center">
                                                                                <div className="text-center text-gray-400">No billing information found</div>
                                                                                <button type="button" className="btn btn-info mx-auto mt-4" onClick={() => handleGoToPayments()}>
                                                                                    <IconPlus /> Add Billing Info
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <div className="mb-5 space-y-4 p-5">
                                                                                <p className="font-bold ">
                                                                                    Billing Name:{' '}
                                                                                    <span className="font-normal">
                                                                                        {billingInfo?.FirstName} {billingInfo?.LastName}
                                                                                    </span>
                                                                                </p>
                                                                                <p className="font-bold ">
                                                                                    Phone: <span className="font-normal">{convertPhone(billingInfo?.Phone)}</span>
                                                                                </p>
                                                                                <p className="font-bold ">
                                                                                    Email: <span className="font-normal">{billingInfo?.Email}</span>
                                                                                </p>
                                                                                <p className="font-bold ">
                                                                                    Address: <span className="font-normal">{billingInfo?.BillingAddress?.StreetAddress1}</span>
                                                                                </p>
                                                                                <p className="font-bold ">
                                                                                    City: <span className="font-normal">{billingInfo?.BillingAddress?.City}</span>
                                                                                </p>
                                                                                <p className="font-bold ">
                                                                                    State: <span className="font-normal">{billingInfo?.BillingAddress?.StateCode}</span>
                                                                                </p>
                                                                                <p className="font-bold ">
                                                                                    Zip: <span className="font-normal">{billingInfo?.BillingAddress?.ZipCode}</span>
                                                                                </p>
                                                                            </div>
                                                                            <ul className="mt-7 ">
                                                                                <li>
                                                                                    <AddCardModal inStudent={true} />
                                                                                </li>
                                                                                <li>
                                                                                    <AddBankModal inStudent={true} />
                                                                                </li>
                                                                            </ul>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {customerPaymentAccount?.map((card: any, index: number) => {
                                                        // Replace asterisks with bullets
                                                        const maskedCardNumber = card?.CreditCardNumber.replace(/\*/g, '•');
                                                        return (
                                                            <div className="flex items-center w-full">
                                                                <div
                                                                    key={card?.Id}
                                                                    className={`relative block w-full rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-white p-4 ${
                                                                        bgcssColors[index % bgcssColors.length]
                                                                    }`}
                                                                >
                                                                    <img src={cardIcons[card?.Issuer] || cardIcons['Generic']} alt={card?.Issuer} className="w-12 h-auto" />
                                                                    <div className="mt-4">
                                                                        <div className="flex items-center justify-between">
                                                                            <div>
                                                                                <label className="text-sm text-zinc-500">Card Number</label>
                                                                                <div className="text-lg text-zinc-950 font-semibold -mt-2">{maskedCardNumber}</div>
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-sm text-zinc-500">Expires</label>
                                                                                <div className="text-lg font-semibold text-zinc-950 -mt-2">{card?.ExpirationDate}</div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center justify-between mt-4">
                                                                            <div>
                                                                                <label className="text-sm text-zinc-500">Card Holder</label>
                                                                                <div className="text-xl font-bold text-zinc-950 -mt-2">{card?.AccountHolderName}</div>
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-sm text-zinc-500">Default</label>
                                                                                <label className="w-14 h-8 relative">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                                                        checked={defaultCard === card?.Id}
                                                                                        id="custom_switch_checkbox1"
                                                                                        onChange={() => setDefaultCard(card?.Id === defaultCard ? '' : card?.Id)}
                                                                                    />
                                                                                    <span className="outline_checkbox bg-white bg-opacity-60 block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark before:bottom-1 before:w-6 before:h-6 before:rounded-full before:bg-[url(/assets/images/default.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-white peer-checked:before:bg-cyan-500 before:transition-all before:duration-300"></span>
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </Tab.Panel>
                                </Tab.Panels>
                            </div>
                        </Tab.Group>
                    </div>
                </>
            )}
        </>
    );
}
