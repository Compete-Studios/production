import Hashids from 'hashids';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import IconLock from '../../components/Icon/IconLock';
import IconCircleCheck from '../../components/Icon/IconCircleCheck';
import { getStudentInfo } from '../../functions/api';
import { addCreditCardToCustomer, getPaymentByID, runPaymentForCustomer } from '../../functions/payments';
import { formatWithTimeZone, handleGetTimeZoneOfUser } from '../../functions/dates';
import { showErrorMessage, showMessage } from '../../functions/shared';
interface CreditCard {
    ccNumber: string;
    customerId: number;
    expDate: string;
    billingZip: string;
    isDefault: boolean;
}

export default function ResolvePaymentTest() {
    const hashids = new Hashids();
    const { payID }: any = useParams();
    const [student, setStudent] = useState<any>(null);
    const [paymentIDInfo, setPaymentIDInfo] = useState<any>(null);
    const [month, setMonth] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const [paySimpleID, setPaySimpleID] = useState<number>(2124955);
    const [creditCardData, setCreditCardData] = useState<CreditCard>({
        ccNumber: '',
        customerId: 0,
        expDate: '',
        billingZip: '',
        isDefault: true,
    });

    const convertToMMYYYY = (month: string, year: string) => {
        return `${month}/${year}`;
    };

    const handleCardChange = (event: any) => {
        const { value } = event.target;

        // Remove all non-digit characters
        const digitsOnly = value.replace(/\D/g, '');

        // Limit the number of digits to 16
        const limitedDigits = digitsOnly.slice(0, 16);

        // Add a space after every four digits
        const formattedValue = limitedDigits.replace(/(\d{4})(?=\d)/g, '$1 ');

        // Remove spaces from the formatted value
        const cardNumber = formattedValue.replace(/\s/g, '');

        if (cardNumber.length > 0) {
            setCreditCardData({ ...creditCardData, ccNumber: cardNumber });
        } else {
            setCreditCardData({ ...creditCardData, ccNumber: '' });
        }

        // Update the input value
        event.target.value = formattedValue;
    };

    useEffect(() => {
        setCreditCardData({
            ...creditCardData,
            customerId: paySimpleID,
            expDate: convertToMMYYYY(month, year),
        });
    }, [month, year]);

    const handleGetStudent = async (studentId: number) => {
        try {
            const res = await getStudentInfo(studentId);
            setStudent(res);
        } catch (error) {
            console.error(error);
        }
    };

    const handleGetPaymentInfo = async (payID: any, suid: any) => {
        try {
            const res = await getPaymentByID(payID, suid);
            if (res.Meta.HttpStatusCode) {
                setPaymentIDInfo(res.Response);
                // handleGetCustomerInfo(res.Response.CustomerId);
                // if (res.Response.PaymentType === 'CC') {
                //     getAllCustomerPaymentAccounts(res.Response.CustomerId, suid).then((res2) => {
                //         if (res2.Response) {
                //             setCustomerPaymentAccount(res2?.Response?.CreditCardAccounts);
                //             setLoadingData((prevState) => ({ ...prevState, customerPaymentAccount: false }));
                //         } else {
                //             console.log('Error getting payment info');
                //             setLoadingData((prevState) => ({ ...prevState, customerPaymentAccount: false }));
                //         }
                //     });
                // } else {
                //     getAllCustomerPaymentAccounts(res.Response.CustomerId, suid).then((res2) => {
                //         if (res2.Response) {
                //             setCustomerPaymentAccount(res2?.Response?.AchAccounts);
                //             setLoadingData((prevState) => ({ ...prevState, customerPaymentAccount: false }));
                //         } else {
                //             console.log('Error getting payment info');
                //             setLoadingData((prevState) => ({ ...prevState, customerPaymentAccount: false }));
                //         }
                //     });
                // }
            } else {
                alert('Error getting payment info');
            }
        } catch (error) {
            console.log('error', error);
        } finally {
        }
    };

    useEffect(() => {     
        const studioId = 32;
        const studentId = 100124;
        handleGetStudent(studentId);
    }, [payID]);

    const runPayment = async (id:any) => {
        const paymentData = {
            paymentAccountId: id,
            amount: paymentIDInfo?.Amount,
        };
        try {
            const response = await runPaymentForCustomer(paymentData);
            if (response?.Response?.Status === 'Authorized') {
                showMessage('Payment has been processed successfully');
            } else {
                const errorMessage = response?.Response?.FailureData?.MerchantActionText || 'An error occurred while processing the payment';
                showErrorMessage(errorMessage);
            }
        } catch {
            showErrorMessage('An error occurred while processing the payment');
        }
    };

    const handleAddCreditCard = async () => {
        console.log('creditCardData', creditCardData);
        try {
            const response = await addCreditCardToCustomer(creditCardData);
            if (response.status === 200) {
                runPayment(response?.Id);
                setCreditCardData({
                    ccNumber: '',
                    customerId: 0,
                    expDate: '',
                    billingZip: '',
                    isDefault: false,
                });
                showMessage('Bank Card Added Successfully!', 'success');
            }
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                // Handle 400 Bad Request error
                showErrorMessage('Bad Request: Please check your input data.');
                console.log('Bad Request: Please check your input data.');
            } else {
                // Handle other errors
                console.log('An error occurred:', error.message);
                // Optionally, you can display a generic error message to the user here
            }
        }
    };
   
    console.log('paymentIDInfo', paymentIDInfo);

    return (
        <>
            <div className="max-w-7xl mx-auto h-screen flex items-center justify-center">
                <div>
                    <div className="block">
                        <h3 className="text-3xl font-bold text-center whitespace-nowrap">Resolve Your Payment</h3>
                        <p className="text-lg text-center">Try a different payment method</p>
                    </div>

                    <div className="flex items-start gap-4 mt-12">
                        <div className="w-full">
                            <div className="panel p-0">
                                <h4 className="text-2xl font-bold bg-secondary-light rounded-t-lg p-5"> Information</h4>
                                <div className="p-5">
                                    <div className="text-lg flex items-center justify-between">
                                        Billing Name:{' '}
                                        <span className="font-bold text-secondary">
                                            {paymentIDInfo?.CustomerFirstName} {paymentIDInfo?.CustomerLastName}
                                        </span>
                                    </div>
                                    <div className="text-lg flex items-center justify-between">
                                        Student Name:{' '}
                                        <span className="font-bold text-secondary">
                                            {student?.First_Name} {student?.Last_Name}
                                        </span>
                                    </div>
                                    <div className="mt-4 text-lg flex items-center justify-between">
                                        Email: <span className="font-bold text-secondary">{student?.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-6 gap-6 mt-8">
                                <div className="col-span-full w-full">
                                    <h1 className="text-2xl font-bold">Payment Details</h1>
                                </div>
                                <div className="col-span-full w-full">
                                    <label>Card Number</label>
                                    <input type="text" className="w-full p-4 border border-gray-200 rounded-lg" placeholder="Card Number" onChange={handleCardChange} />
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="expMonth">Expiration Month</label>
                                    <select id="expMonth" className="w-full p-4 border border-gray-200 rounded-lg" onChange={(e) => setMonth(e.target.value)}>
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
                                <div className="col-span-2">
                                    <label htmlFor="expYear">Expiration Year</label>
                                    <select id="expYear" className="w-full p-4 border border-gray-200 rounded-lg" onChange={(e) => setYear(e.target.value)}>
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
                                        <option value="2036">2036</option>
                                        <option value="2037">2037</option>
                                        <option value="2038">2038</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="zip">Billing Zip</label>
                                    <input
                                        type="text"
                                        id="zip"
                                        className="w-full p-4 border border-gray-200 rounded-lg"
                                        placeholder="Billing Zip"
                                        onChange={(e) => setCreditCardData({ ...creditCardData, billingZip: e.target.value })}
                                    />
                                </div>
                                <div className="relative flex items-start col-span-full">
                                    <div className="flex h-6 items-center">
                                        <input
                                            id="comments"
                                            aria-describedby="comments-description"
                                            name="comments"
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-1 text-sm leading-6">
                                        <label htmlFor="comments" className="font-medium text-gray-900">
                                            Make this my default payment method from now on
                                        </label>{' '}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="min-w-96 w-full panel">
                            <h3 className="text-3xl font-bold mb-12">Payment Summary</h3>
                            <dl className="mt-8 w-full divide-y divide-gray-200 text-sm lg:mt-0">
                                <div className="flex items-center justify-between pb-4">
                                    <dt className="">Subtotal</dt>
                                    <dd className="font-medium ">$100.00</dd>
                                </div>
                                <div className="flex items-center justify-between py-4">
                                    <dt className="">Todays Date</dt>
                                    <dd className="font-medium ">{formatWithTimeZone(new Date(), handleGetTimeZoneOfUser())}</dd>
                                </div>
                                <div className="flex items-center justify-between pt-4 text-2xl">
                                    <dt className="font-medium text-gray-900 dark:text-white">Amount</dt>
                                    <dd className="font-medium text-success">${100}</dd>
                                </div>
                            </dl>
                            <div className="flex items-center justify-between py-4 mt-12">
                                <button className="w-full p-4 btn btn-secondary btn-lg"
                                    onClick={handleAddCreditCard}
                                >
                                    <IconLock className="w-6 h-6 mr-2" />
                                    Add Card and Pay Now
                                </button>
                            </div>
                            <div className="py-4 w-full text-center">
                                <h5 className="text-sm font-medium flex items-center justify-center p-2 gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-success" viewBox="0 0 16 16">
                                        <path
                                            fill-rule="evenodd"
                                            d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m2.146 5.146a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793z"
                                        />
                                    </svg>
                                    Secure Payment
                                </h5>
                                <p className="text-sm ">
                                    By clicking "Pay Now" you agree to our{' '}
                                    <a href="#" className="text-primary">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-primary">
                                        Privacy Policy
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
