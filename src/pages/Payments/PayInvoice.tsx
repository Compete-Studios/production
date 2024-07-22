import React, { useEffect, useState } from 'react';
import IconCreditCard from '../../components/Icon/IconCreditCard';
import { formatDate, showErrorMessage, showMessage } from '../../functions/shared';
import { addCreditCardToCustomerForQuickPay, addPaymentNotes, createNewPaySimpleCustomer, runPaymentForQuickPay } from '../../functions/payments';
import logo from '../../images/logo.png';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { getInvoiceById, getStudentInfo, getStudioInfo, markInvoiceAsPaid } from '../../functions/api';
import { formatWithTimeZone, handleGetTimeZoneOfUser } from '../../functions/dates';

interface PayDetails {
    studioId: number;
    paymentAccountId: number;
    amount: number;
    emailForReceipt: string;
    isResubmission: boolean;
    firstName: string;
    lastName: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    billingZip: string;
}

export default function PayInvoice() {
    const [notes, setNotes] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [invoiceData, setInvoiceData] = useState<any>(null);
    const [studentInfo, setStudentInfo] = useState<any>(null);
    const [studioInfo, setStudioInfo] = useState<any>(null);
    const [suid, setSuid] = useState<number>(0);

    const { invoiceID } = useParams();

    const [payDetails, setPayDetails] = useState<PayDetails>({
        studioId: 0,
        paymentAccountId: 0,
        amount: 0,
        emailForReceipt: '',
        isResubmission: false,
        firstName: '',
        lastName: '',
        cardNumber: '',
        expiryMonth: '01',
        expiryYear: '2024',
        billingZip: '',
    });

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Pay Invoice'));
    });

    const navigate = useNavigate();

    const handleGetStudent = async (studentID: any) => {
        getStudentInfo(studentID).then((res) => {
            setStudentInfo(res);
        });
    };

    const handleGetStudioInfo = async (studioID: any) => {
        getStudioInfo(studioID).then((res) => {
            setStudioInfo(res);
        });
    };

    const handleGetInvoice = async (inID: any) => {
        try {
            const response = await getInvoiceById(inID);
            console.log('response', response);
            if (!response.recordset || response.recordset.length === 0) {
                setInvoiceData({ deleted: true });
                showErrorMessage('Invoice not found');
                throw new Error('Invoice not found');
            } else {
                setInvoiceData(response.recordset[0]);
                const studentID = response.recordset[0].StudentId;
                const prospectId = response.recordset[0].ProspectId;
                const studioID = response.recordset[0].StudioId;
                const amount = response.recordset[0].Amount;
                setPayDetails((prevDetails) => ({
                    ...prevDetails,
                    amount: amount,
                }));
                setSuid(studioID);
                if (studentID !== 0) {
                    handleGetStudent(studentID);
                    handleGetStudioInfo(studioID);
                } else {
                    handleGetStudent(prospectId);
                    handleGetStudioInfo(studioID);
                }
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        handleGetInvoice(invoiceID);
    }, [invoiceID]);

    const handleCardChange = (event: any) => {
        const { value } = event.target;

        // Remove all non-digit characters
        const digitsOnly = value.replace(/\D/g, '');

        // Limit the number of digits to 16
        const limitedDigits = digitsOnly.slice(0, 16);

        // Remove spaces from the formatted value to store in the state
        const cardNumber = limitedDigits;

        // Add a space after every four digits for display
        const formattedValue = cardNumber.replace(/(.{4})/g, '$1 ');

        setPayDetails({ ...payDetails, cardNumber: cardNumber });

        // Update the input value
        event.target.value = formattedValue.trim();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setPayDetails((prevDetails) => ({
            ...prevDetails,
            [id]: value,
        }));
    };

    const createNewCustomer = async () => {
        const data = {
            studioId: suid,
            firstName: payDetails.firstName,
            lastName: payDetails.lastName,
            email: payDetails.emailForReceipt,
        };
        try {
            const response = await createNewPaySimpleCustomer(data);
            if (response && response.Response) {
                const customerId = response.Response.Id;
                return customerId;
            } else if (response && response.error) {
                throw new Error(`Error creating customer: ${response.error}`);
            } else {
                throw new Error('Error creating customer: Unexpected error occurred');
            }
        } catch (error) {
            let errorMessage = 'Unexpected error occurred';
            if (typeof error === 'object' && error !== null) {
                if ('error' in error) {
                    errorMessage = (error as any).error;
                } else if ('message' in error) {
                    errorMessage = (error as any).message;
                }
            }
            setLoading(false);
            throw new Error(`Error adding card to customer: ${errorMessage}`);
        }
    };

    const addCard = async (customerId: string) => {
        const expirationDate = `${payDetails.expiryMonth}/${payDetails.expiryYear}`;
        const data = {
            studioId: suid,
            customerId: customerId,
            ccNumber: payDetails.cardNumber,
            expDate: expirationDate,
        };

        try {
            const response = await addCreditCardToCustomerForQuickPay(data);

            if (response && response.Response) {
                const accountId = response.Response.Id;
                return accountId;
            } else if (response && response.error) {
                throw new Error(`Error adding card: ${response.error}`);
            } else {
                throw new Error('Error adding card: Unexpected error occurred');
            }
        } catch (error) {
            let errorMessage = 'Unexpected error occurred';
            if (typeof error === 'object' && error !== null) {
                if ('error' in error) {
                    errorMessage = (error as any).error;
                } else if ('message' in error) {
                    errorMessage = (error as any).message;
                }
            }
            setLoading(false);
            throw new Error(`Error adding card to customer: ${errorMessage}`);
        }
    };

    const runPayment = async (accountId: number) => {
        const updatedPayDetails = {
            ...payDetails,
            studioId: suid,
            paymentAccountId: accountId,
        };
        try {
            const res = await runPaymentForQuickPay(updatedPayDetails);

            const response = res.Response;

            // Successful payment
            if (response && response.Status === 'Authorized') {
                console.log('Payment Successful:', response);
                const paymentId = response.Id;
                await markInvoiceAsPaid(invoiceID, paymentId);
                console.log('Payment ID:', paymentId);
                showMessage('Payment Successful');
                // After successful payment, add payment notes
                addPaymentNotes(paymentId, notes);
                navigate('/payments/thank-you');
            }
            // Failed/declined payment
            else if (response && response.Status === 'Failed' && response.FailureData) {
                throw new Error(`Error running payment: ${response.FailureData.Description} - ${response.FailureData.MerchantActionText}`);
            }
            // API returned error in Meta.Errors
            else if (response && response.Meta && response.Meta.Errors) {
                const errorMessages = response.Meta.Errors.ErrorMessages.map((error: any) => error.Message).join('; ');
                throw new Error(`Error running payment: ${errorMessages}`);
            }
            // Unexpected response structure
            else {
                throw new Error('Unexpected error occurred: Invalid response structure');
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
            setLoading(false);
            throw new Error(`Error running payment: ${errorMessage}`);
        }
    };

    const handleRunPayment = async () => {
        setLoading(true);
        try {
            const customerId = await createNewCustomer();
            if (customerId && customerId > 0) {
                const paymentAccountId = await addCard(customerId);
                if (paymentAccountId && paymentAccountId > 0) {
                    await runPayment(paymentAccountId);
                } else {
                    showErrorMessage('Error adding card to customer');
                }
            } else {
                showErrorMessage('Error creating customer');
            }
        } catch (error) {
            console.log('Error in handleRunPayment:', error);
            showErrorMessage((error as Error).message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (invoiceData?.PaymentId > 0) {
            navigate('/payments/thank-you');
        }
    }, [invoiceData]);

    return (
        <div className="flex items-center justify-center h-screen">
            {invoiceData?.deleted ? (
                <div className="space-y-8 py-12">
                    <img className="w-auto h-6 mx-auto flex-none" src="/assets/images/logodark.png" alt="logo" />
                    <div className='text-danger text-2xl text-center '>Invoice not found</div>
                    <div className="text-center">Please contact your studio if you feel this is an error</div>
                </div>
            ) : (
                <div className="space-y-8">
                    <img className="w-auto h-6 mr-auto flex-none" src="/assets/images/logodark.png" alt="logo" />
                    <div className="panel rounded-b-lg max-w-lg mx-auto shadow-lg p-5">
                        <div className="text-3xl font-bold">${invoiceData?.Amount?.toFixed(2)}</div>
                        <div>Due {formatWithTimeZone(invoiceData?.DueDate, handleGetTimeZoneOfUser)}</div>
                        <div className="grid grid-cols-5 mt-12">
                            <div className="text-zinc-500 space-y-3">
                                <div>To:</div>
                                <div>From:</div>
                                <div>Notes:</div>
                            </div>
                            <div className="col-span-4 font-semibold space-y-3">
                                <div>
                                    {studentInfo?.First_Name} {studentInfo?.Last_Name}
                                </div>

                                <div>{studioInfo?.Studio_Name}</div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                    <div className="panel rounded-b-lg p-0 max-w-lg mx-auto shadow-lg">
                        <div className=" bg-zinc-50 p-5 rounded-t-lg shadow border-b space-y-4">
                            <div className="flex items-center justify-between">
                                <h5 className="font-semibold text-lg">Payment Information</h5>
                                <div className="text-secondary text-lg font-bold">Invoice #: {invoiceID}</div>
                            </div>
                        </div>
                        <div className="p-5 rounded-b-lg">
                            <form>
                                <div className="mb-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="firstName">First Name</label>
                                        <input id="firstName" type="text" placeholder="First Name" className="form-input h-12" value={payDetails.firstName} onChange={handleChange} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="lastName">Last Name</label>
                                        <input id="lastName" type="text" placeholder="Last Name" className="form-input h-12" value={payDetails.lastName} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="mb-5 grid grid-cols-1 sm:grid-cols-6 gap-4">
                                    <div className="sm:col-span-full">
                                        <label htmlFor="cardNumber">Card Number</label>
                                        <div className="relative mt-2 rounded-md shadow-sm">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <IconCreditCard fill={true} className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                                            </div>
                                            <input
                                                id="cardNumber"
                                                type="text"
                                                placeholder="Card Number"
                                                className="form-input pl-10 h-12"
                                                value={payDetails.cardNumber.replace(/(.{4})/g, '$1 ').trim()}
                                                onChange={handleCardChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="expiryMonth">Card Expiry Month</label>
                                        <select id="expiryMonth" className="form-select h-12 " value={payDetails.expiryMonth} onChange={handleChange}>
                                            <option value="01">01</option>
                                            <option value="02">02</option>
                                            <option value="03">03</option>
                                            <option value="04">04</option>
                                            <option value="05">05</option>
                                            <option value="06">06</option>
                                            <option value="07">07</option>
                                            <option value="08">08</option>
                                            <option value="09">09</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="expiryYear">Card Expiry Year</label>
                                        <select id="expiryYear" className="form-select h-12" value={payDetails.expiryYear} onChange={handleChange}>
                                            <option value="2024">2024</option>
                                            <option value="2025">2025</option>
                                            <option value="2026">2026</option>
                                            <option value="2027">2027</option>
                                            <option value="2028">2028</option>
                                            <option value="2029">2029</option>
                                            <option value="2030">2030</option>
                                            <option value="2031">2031</option>
                                            <option value="2032">2032</option>
                                            <option value="2033">2033</option>
                                            <option value="2034">2034</option>
                                            <option value="2035">2035</option>
                                        </select>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="billingZip">Billing Zip</label>
                                        <input id="billingZip" type="text" placeholder="Billing Zip" className="form-input h-12" value={payDetails.billingZip} onChange={handleChange} />
                                    </div>
                                </div>
                                <button type="button" className="btn btn-primary btn-lg ml-auto" onClick={handleRunPayment} disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                            <div>Processing Payment</div>
                                        </>
                                    ) : (
                                        <>
                                            <div>Run Payment</div>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
