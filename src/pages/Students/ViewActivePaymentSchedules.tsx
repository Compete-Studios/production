import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { constFormateDateForPaySimple, hashTheID, showErrorMessage, showMessage, showWarningMessage, statusCSS, unHashTheID } from '../../functions/shared';
import { Dialog, Transition } from '@headlessui/react';
import { UserAuth } from '../../context/AuthContext';
import mastercardIcon from '../../assets/creditcardicons/mastercard.svg';
import visaIcon from '../../assets/creditcardicons/visa.svg';
import amexIcon from '../../assets/creditcardicons/amex.svg';
import discoverIcon from '../../assets/creditcardicons/discover.svg';
import genericIcon from '../../assets/creditcardicons/generic.svg';
import IconX from '../../components/Icon/IconX';
import IconEye from '../../components/Icon/IconEye';
import Tippy from '@tippyjs/react';
import { formatWithTimeZone, handleGetTimeZoneOfUser } from '../../functions/dates';
import { addPaymentScheduleNote, getAllCustomerPaymentAccounts, getCreditCard, getPaymentNotes, getPaymentScheduleNote, updatePaymentSchedule } from '../../functions/payments';
import PausePaymentSchedule from './PausePaymentSchedule';

export default function ViewActivePaymentSchedules({ student, paymentInfo, setUpdated, updated }: any) {
    const { suid }: any = UserAuth();
    const [open, setOpen] = useState(false);
    const [creditCard, setCreditCard] = useState<any>({});
    const [paymentNotes, setPaymentNotes] = useState<any>('');
    const [update, setUpdate] = useState<boolean>(false);
    const [newAmount, setNewAmount] = useState<any>('');
    const [newNote, setNewNote] = useState('');
    const [updating, setUpdating] = useState<boolean>(false);
    const [newEndDate, setNewEndDate] = useState<any>('');

    const cardIcons: any = {
        Visa: visaIcon,
        Master: mastercardIcon,
        Amex: amexIcon,
        Discover: discoverIcon,
        Generic: genericIcon,
    };

    const handleGetCardInfo = async (CustomerId: any) => {
        const res = await getCreditCard(CustomerId, suid);
        if (res.Response) {
            const card = res.Response;
            setCreditCard(card);
        } else {
            setCreditCard({});
        }
    };

    useEffect(() => {
        handleGetCardInfo(paymentInfo.AccountId);
        setNewAmount(paymentInfo.PaymentAmount.toFixed(2));
        if (paymentInfo.EndDate) {
            setNewEndDate(new Date(paymentInfo.EndDate).toISOString().split('T')[0]);
        }
    }, [paymentInfo]);

    const handleGetNotes = async () => {
        const paymentNotes = await getPaymentScheduleNote(paymentInfo?.Id);
        const scheduleNotes = paymentNotes?.recordset[0]?.Notes;
        setPaymentNotes(scheduleNotes);
    };

    useEffect(() => {
        handleGetNotes();
    }, [paymentInfo]);

    const handleUpdateSchedule = () => {
        setUpdate(true);
    };

    const handlesaveChangesToPaymentShedule = async (e: any) => {
        e.preventDefault();
        setUpdating(true);
        const bodyData = {
            studioId: suid,
            paymentScheduleId: paymentInfo?.Id,
            paymentAccountId: paymentInfo?.AccountId,
            amount: newAmount,
            startDate: constFormateDateForPaySimple(paymentInfo?.StartDate),
            endDate: constFormateDateForPaySimple(newEndDate),
        };
        const res = await updatePaymentSchedule(bodyData);
        setUpdating(false);
        if (res.Meta.HttpStatusCode === 200) {
            showMessage('Payment Schedule Updated Successfully');
            setUpdate(false);
            setUpdated(!updated);
        } else {
            setUpdate(false);
            setUpdated(!updated);
        }
    };

 
    const handleSusependSchedule = async () => {
        const res = await showWarningMessage('Are you sure you want to suspend this schedule?', 'Suspend Schedule', 'Your schedule has been suspended successfully', 'Suspended');
    };

    const handleAddNote = async () => {
        if (!newNote) return showErrorMessage('Please add a note');

        if (paymentNotes) {
            try {
                const newNotes = `${paymentNotes}\n${newNote}`; // Create a new string with the new note appended
                const res = await addPaymentScheduleNote(paymentInfo.Id, newNotes);
                if (res) {
                    setPaymentNotes(newNotes); // Update the paymentNotes state with the new string
                    setNewNote('');
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                const res = await addPaymentScheduleNote(paymentInfo.Id, newNote);
                if (res) {
                    setPaymentNotes(newNote); // Update the paymentNotes state with the new string
                    setNewNote('');
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <>
            <Tippy content="View Payment Schedule">
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
                                        <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                            <div className="px-4 sm:px-6">
                                                <div className="flex items-start justify-between">
                                                    <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">Payment Information</Dialog.Title>
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
                                            <div className="relative flex-1 px-4 sm:px-6">
                                                <div className="py-6">
                                                    <div className="bg-gray-100 dark:bg-gray-800 px-4 py-6 sm:rounded-lg sm:px-6 lg:flex lg:items-start lg:justify-between lg:px-8 ">
                                                        <dl className="w-full divide-y divide-gray-200 text-sm ">
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
                                                                <dd className={`font-medium ${statusCSS(paymentInfo?.ScheduleStatus)}`}>{paymentInfo?.ScheduleStatus}</dd>
                                                            </div>
                                                            <div className="flex items-center justify-between py-4">
                                                                <dt className="">Card Info</dt>
                                                                <dd className="font-bold flex items-center gap-x-1">
                                                                    <img src={cardIcons[creditCard?.Issuer ?? 'Generic']} alt="Visa" className="w-8 h-auto" />
                                                                    {creditCard?.CreditCardNumber}{' '}
                                                                </dd>
                                                            </div>
                                                            <div className="flex items-center justify-between py-4">
                                                                <dt className="">Expiration Date</dt>
                                                                <dd className="font-medium ">{creditCard?.ExpirationDate}</dd>
                                                            </div>
                                                            <div className="flex items-center justify-between py-4">
                                                                <dt className="">Payment Schedule Id</dt>
                                                                <dd className="font-medium ">{paymentInfo?.Id}</dd>
                                                            </div>
                                                            <div className="flex items-center justify-between py-4">
                                                                <dt className="">Frequency</dt>
                                                                <dd className="font-medium ">{paymentInfo?.ExecutionFrequencyType === 'SpecificDayofMonth' ? 'Monthly' : 'Paid in Full'}</dd>
                                                            </div>
                                                            <div className="flex items-center justify-between py-4">
                                                                <dt className="">Start Date</dt>
                                                                <dd className="font-medium ">{formatWithTimeZone(new Date(paymentInfo?.StartDate), handleGetTimeZoneOfUser)}</dd>
                                                            </div>
                                                            <div className="flex items-center justify-between py-4">
                                                                <dt className="">End Date</dt>
                                                                {update ? (
                                                                    <input
                                                                        type="date"
                                                                        value={newEndDate ? new Date(newEndDate).toISOString().split('T')[0] : ''}
                                                                        className="form-input w-1/2"
                                                                        onChange={(e) => setNewEndDate(e.target.value)}
                                                                    />
                                                                ) : (
                                                                    <dd className="font-medium">{formatWithTimeZone(new Date(paymentInfo?.EndDate), handleGetTimeZoneOfUser)}</dd>
                                                                )}
                                                            </div>

                                                            {update ? (
                                                                <div className="flex items-center justify-between pt-4 text-2xl">
                                                                    <dt className="font-medium text-gray-900 dark:text-white">Amount</dt>
                                                                    <div className="flex w-1/2">
                                                                        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                                            $
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            placeholder="0.00"
                                                                            value={newAmount}
                                                                            className="form-input ltr:rounded-l-none rtl:rounded-r-none text-right"
                                                                            onChange={(e) => setNewAmount(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center justify-between pt-4 text-2xl">
                                                                    <dt className="font-medium text-gray-900 dark:text-white">Amount</dt>
                                                                    <dd className="font-medium text-success">${paymentInfo?.PaymentAmount?.toFixed(2)}</dd>
                                                                </div>
                                                            )}
                                                            {update && (
                                                                <div className="flex items-center gap-2">
                                                                    <button className="btn btn-danger w-full mt-4" onClick={() => setUpdate(false)}>
                                                                        Discard
                                                                    </button>
                                                                    <button className="btn btn-primary w-full mt-4" onClick={(e: any) => handlesaveChangesToPaymentShedule(e)}>
                                                                        Updated Schedule
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </dl>
                                                    </div>
                                                    {paymentInfo?.Status === 'Posted' && (
                                                        <div className="text-center mt-4 text-success">
                                                            This payment is awaiting authorization. It can be refunded after it has left this status or has settled.
                                                        </div>
                                                    )}
                                                    {paymentInfo?.Status === 'RefundSettled' && <div className="text-center mt-4 text-info">This payment is a refund and has settled.</div>}

                                                    <div className="flex items-center gap-4 mt-4">
                                                        {paymentInfo?.ScheduleStatus === 'Active' && (
                                                            <button className="btn btn-primary w-full" onClick={handleUpdateSchedule}>
                                                                Update Schedule
                                                            </button>
                                                        )}

                                                        <div className="w-full">
                                                            <PausePaymentSchedule id={paymentInfo.Id} suide={suid} suspended={paymentInfo?.ScheduleStatus} setUpdated={setUpdated} updated={updated} />
                                                        </div>
                                                    </div>
                                                    <div className="panel p-0 relative">
                                                        <div className="p-5 pb-20">
                                                            <h2 className="text-xl">Payment Notes</h2>
                                                            {paymentNotes !== '' && (
                                                                <div className="p-3 bg-dark-light/50 dark:bg-dark mt-2 border rounded-sm">
                                                                    {paymentNotes?.split('\n').map((note: any, index: any) => {
                                                                        return (
                                                                            <div key={index} className={`${note?.length > 1 && 'p-2 border-b border-dashed border-zinc-400 dark:border-gray-700'} `}>
                                                                                <p>{note}</p>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}

                                                            <textarea
                                                                className="form-textarea w-full h-20 mt-4"
                                                                placeholder="Add a note"
                                                                value={newNote}
                                                                onChange={(e) => setNewNote(e.target.value)}
                                                            />
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
