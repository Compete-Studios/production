import React, { Fragment, useEffect, useState } from 'react';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';
import 'flatpickr/dist/flatpickr.css';
import { Tab } from '@headlessui/react';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import { getAllCustomerCreditCards, getStudentBillingAccounts } from '../../functions/api';
import { addInternalPayment, runPaymentForCustomer } from '../../functions/payments';
import Swal from 'sweetalert2';
import { formatDate } from '../../functions/shared';
import { useNavigate } from 'react-router-dom';

interface CreditCard {
    Id: number;
    Issuer: string;
    CreditCardNumber: string;
    ExpirationDate: string;
    CustomerId: number;
}

interface BillingInfoProps {
    billingInfo: CreditCard[];
}

export default function StudentsQuickPay({ student, suid, title = 'Quick Pay', invoiceID = null }: any) {
    const [showQuickPayModal, setShowQuickPayModal] = useState(false);
    const [billingInfo, setBillingInfo] = useState<CreditCard[] | null>(null);
    const [cardToUse, setCardToUse] = useState<CreditCard | null>(null);
    const [notes, setNotes] = useState<string | null>('');
    const [amount, setAmount] = useState<any>(null);
    const [invoice, setInvoice] = useState<any>(invoiceID);

    const showErrorMessage = (msg = '') => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: 'error',
            title: msg,
            padding: '10px 20px',
        });
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const getBillingInformation = async () => {
        getStudentBillingAccounts(student?.Student_id)
            .then((response) => {
                getAllCustomerCreditCards(suid, response.recordset[0]?.PaysimpleCustomerId).then((response) => {
                    if (response?.Response?.length > 0) {
                        setBillingInfo(response?.Response);
                    } else {
                        setBillingInfo(null);
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getBillingInformation();
    }, [student?.Student_id]);

    useEffect(() => {
        setInvoice(invoiceID);
    }, [invoiceID]);

    const runPayment = async () => {
        const paymentData = {
            paymentAccountId: cardToUse?.Id,
            amount: amount,
        };
        try {
            const response = await runPaymentForCustomer(paymentData);
            if (response?.Response?.Status === 'Authorized') {
                showMessage('Payment has been processed successfully');
                setCardToUse(null);
                setAmount(null);
                setShowQuickPayModal(false);
            } else {
                const errorMessage = response?.Response?.FailureData?.MerchantActionText || 'An error occurred while processing the payment';
                showErrorMessage(errorMessage);
            }
        } catch {
            showErrorMessage('An error occurred while processing the payment');
        }
    };

    const recordPayment = async () => {
        console.log('record payment');

        const paymentData = {
            studentId: student?.Student_id,
            amountPaid: amount,
            notes,
            paymentDate: formatDate(new Date()),
            invoiceNumber: invoice,
        };
        try {
            const res = await addInternalPayment(paymentData);
            console.log(res);
            if (res.NewInternalPaymentId > 0) {
                showMessage('Payment has been recorded successfully');
                setAmount(null);
                setShowQuickPayModal(false);
                setNotes(null);
            } else {
                showErrorMessage('Payement was recorded, but no ID was returned. Please check the payment history.');
            }
        } catch (error) {
            showErrorMessage('An error occurred while recording the payment');
        }
    };

    const navigate = useNavigate();

    const handleGoToPayments = () => {
        const newID = parseInt(student?.Student_id) * parseInt(suid);
        navigate(`/students/${newID}/finish-billing-setup-options`);
    };

    return (
        <div>
            <div>
                <button className="uppercase font-lg font-bold w-full hover:bg-success-light p-4 text-left" onClick={() => setShowQuickPayModal(true)}>
                    {title}
                </button>
            </div>
            <Transition appear show={showQuickPayModal} as={Fragment}>
                <Dialog as="div" open={showQuickPayModal} onClose={() => setShowQuickPayModal(false)} className="relative z-[51]">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-3xl text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setShowQuickPayModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        Quick Pay for {student?.First_Name} {student?.Last_Name}
                                    </div>
                                    <div className="p-5">
                                        <Tab.Group>
                                            <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a] ">
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}
                                                        >
                                                            Run Payment
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}
                                                        >
                                                            Record In-Studio Payment
                                                        </button>
                                                    )}
                                                </Tab>
                                            </Tab.List>

                                            <Tab.Panels>
                                                <Tab.Panel>
                                                    <div className="pt-8">
                                                        {!billingInfo && (
                                                            <div>
                                                                <div className="text-center text-gray-400">No billing information found</div>
                                                                <button type="button" className="btn btn-info mx-auto mt-4" onClick={handleGoToPayments}>
                                                                    Add Billing Account
                                                                </button>
                                                            </div>
                                                        )}
                                                        {cardToUse ? (
                                                            <div>
                                                                <div className="flex items-center justify-between border-b border-white-light dark:border-[#191e3a] py-3">
                                                                    <div>
                                                                        <div className="flex items-center">
                                                                            <div className="text-lg font-medium">{cardToUse?.Issuer}</div>
                                                                            <div className="ltr:ml-2 rtl:mr-2">{cardToUse?.CreditCardNumber}</div>
                                                                        </div>
                                                                        <div className="text-sm text-gray-400">{cardToUse.ExpirationDate}</div>
                                                                    </div>
                                                                    <button type="button" className="text-danger text-xs" onClick={() => setCardToUse(null)}>
                                                                        Switch Cards
                                                                    </button>
                                                                </div>
                                                                <div className="flex items-center justify-between border-b border-white-light dark:border-[#191e3a] py-3">
                                                                    <div>
                                                                        <div className="text-lg font-medium">Amount</div>
                                                                        <div className="text-sm text-gray-400">Total Amount</div>
                                                                        <div className="flex mt-2">
                                                                            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                                                $
                                                                            </div>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="0.00"
                                                                                value={amount || ''}
                                                                                className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                                                                onChange={(e: any) => setAmount(parseFloat(e.target.value))}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <button type="button" className="btn btn-success" onClick={runPayment}>
                                                                        Run Payment
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {billingInfo?.map((card: any) => (
                                                                    <div key={card?.Id} className="flex items-center justify-between border-b border-white-light dark:border-[#191e3a] py-3">
                                                                        <div>
                                                                            <div className="flex items-center">
                                                                                <div className="text-lg font-medium">{card?.Issuer}</div>
                                                                                <div className="ltr:ml-2 rtl:mr-2">{card?.CreditCardNumber}</div>
                                                                            </div>
                                                                            <div className="text-sm text-gray-400">{card?.ExpirationDate}</div>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            className={`btn btn-primary ${cardToUse === card?.Id ? 'bg-primary' : ''}`}
                                                                            onClick={() => setCardToUse(card)}
                                                                        >
                                                                            Select
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        )}
                                                    </div>
                                                </Tab.Panel>
                                                <Tab.Panel>
                                                    <div className="pt-8">
                                                        <div className="flex items-center justify-between border-b border-white-light dark:border-[#191e3a] py-3">
                                                            <div>
                                                                <div className="text-lg font-medium">Amount</div>
                                                                <div className="text-sm text-gray-400">Total Amount</div>
                                                                <div className="flex mt-2">
                                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                                        $
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        value={amount || ''}
                                                                        placeholder="0.00"
                                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                                                        onChange={(e) => setAmount(e.target.value)}
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Invoice Number (optional)"
                                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none ml-1"
                                                                        value={invoice}
                                                                        onChange={(e: any) => setInvoice(e.target.value)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <textarea placeholder="Notes" rows={5} className="form-textarea w-full mt-2" onChange={(e) => setNotes(e.target.value)} />
                                                                </div>
                                                            </div>
                                                            <div className="mt-auto">
                                                                <button type="button" className="btn btn-success" onClick={recordPayment}>
                                                                    Record Payment
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tab.Panel>
                                            </Tab.Panels>
                                        </Tab.Group>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
