import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';

import IconEye from '../../components/Icon/IconEye';
import Tippy from '@tippyjs/react';
import { UserAuth } from '../../context/AuthContext';
import { getPaymentsForCustomer, handleGetPayment } from '../../functions/paymentsAll';
import { formatDate } from '@fullcalendar/core';
import { getPaymentNotes } from '../../functions/payments';

export default function ViewLatePaymentDetails({ payID }: any) {
    const { suid }: any = UserAuth();
    const [open, setOpen] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState<any>({});
    const [payments, setPayments] = useState<any>([]);
    const [paymentNotes, setPaymentNotes] = useState<any>('');

    const handleGetLatePayment = async (id: any) => {
        try {
            const res = await handleGetPayment(suid, id);
            setPaymentInfo(res);
            const paymentRes = await getPaymentsForCustomer(suid, res.CustomerId);
            setPayments(paymentRes);
            const notesRes = await getPaymentNotes(id);
            setPaymentNotes(notesRes[0].Notes);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (open) {
            handleGetLatePayment(payID);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, payID]);

    return (
        <>
            <Tippy content="View Late Payment">
                <button className="text-info hover:text-blue-800" onClick={() => setOpen(true)}>
                    <IconEye />
                </button>
            </Tippy>
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
                                        <div className="flex h-full flex-col overflow-y-scroll bg-zinc-100 py-6 shadow-xl pb-36">
                                            <div className="px-4 sm:px-6">
                                                <div className="flex items-start justify-between">
                                                    <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">Payment Information</Dialog.Title>
                                                    <div className="ml-3 flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="relative rounded-md bg-zinc-100 text-gray-400 hover:text-gray-500 focus:outline-none "
                                                            onClick={() => setOpen(false)}
                                                        >
                                                            <span className="absolute -inset-2.5" />
                                                            <span className="sr-only">Close panel</span>
                                                            <IconX className="h-6 w-6" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative flex-1 px-4 sm:px-6 space-y-2">
                                                <div className="panel">
                                                    <h2>Payment Information</h2>
                                                    <div className="text-xs mt-2 space-y-1">
                                                        <div className="font-bold">
                                                            ID: <span className="font-normal">{paymentInfo.Id}</span>{' '}
                                                        </div>
                                                        <div className="font-semibold">
                                                            Status: <span className="font-normal">{paymentInfo.Status}</span>
                                                        </div>
                                                        <div className="font-bold">
                                                            Auth Code: <span className="font-normal">{paymentInfo.ProviderAuthCode}</span>
                                                        </div>
                                                        <div className="font-bold">
                                                            Reason: <span className="font-normal">{paymentInfo?.FailureData?.Description}</span>
                                                        </div>
                                                        <div className="font-bold">
                                                            Payment Type: <span className="font-normal">{paymentInfo.PaymentType}</span>{' '}
                                                        </div>
                                                        <div className="font-bold">
                                                            Card Number: <span className="font-normal">{paymentInfo.Id}</span>{' '}
                                                        </div>
                                                        <div className="font-bold">
                                                            Amount: <span className="text-danger">${paymentInfo.Amount}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="panel">
                                                    <h2>Last 5 Payments</h2>
                                                    <div className="text-xs mt-2 space-y-1">
                                                        {payments.slice(0, 5).map((payment: any, index: number) => (
                                                            <div key={index} className="flex justify-between">
                                                                <div className="font-bold">{formatDate(payment.PaymentDate)}</div>
                                                                <div
                                                                    className={`badge whitespace-nowrap ${
                                                                        payment.Status === 'Settled'
                                                                            ? 'bg-success'
                                                                            : payment.Status === 'Pending'
                                                                            ? 'bg-warning'
                                                                            : payment.Status === 'In Progress'
                                                                            ? 'bg-info'
                                                                            : payment.Status === 'Failed'
                                                                            ? 'bg-danger'
                                                                            : 'bg-primary'
                                                                    }`}
                                                                >
                                                                    {payment.Status || 'Internal'}
                                                                </div>
                                                                <div className="font-bold">Amount: ${payment.Amount}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="panel">
                                                    <h1>Late Payment Notes</h1>
                                                    <div className="p-3 bg-dark-light/50 dark:bg-dark mt-2 border rounded-sm">
                                                        {paymentNotes?.split('\n').map((note: any, index: any) => {
                                                            return (
                                                                <div key={index} className={`${note?.length > 1 && 'p-2 border-b border-dashed border-zinc-400 dark:border-gray-700'} `}>
                                                                    <p>{note}</p>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="flex flex-shrink-0 justify-end px-4 py-4 bg-white fixed bottom-0 right-0 left-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpen(false)}
                                                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                                                    >
                                                        Close
                                                    </button>
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
