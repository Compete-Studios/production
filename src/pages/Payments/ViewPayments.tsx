import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPaymentPipelineStepById } from '../../functions/api';
import IconPlus from '../../components/Icon/IconPlus';
import { hashTheID, hashThePayID, showWarningMessage } from '../../functions/shared';
import { getPaymentsByPipelineStep, ignorePayment } from '../../functions/payments';
import { UserAuth } from '../../context/AuthContext';
import LatePaymentAction from './LatePaymentAction';
import { formatDate } from '@fullcalendar/core';
import { convertToUserLocalDate } from '../../functions/dates';

export default function ViewPayments() {
    const { suid, latePayementPipeline, update, setUpdate, studioOptions }: any = UserAuth();
    const [pipelineStep, setPipelineStep] = useState<any>({});
    const [studentsInPipeline, setStudentsInPipeline] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    const { id } = useParams();

    const navigate = useNavigate();

    const handleGetTimeZoneOfUser = () => {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return timeZone;
    };

    console.log(convertToUserLocalDate(new Date(), handleGetTimeZoneOfUser()))

    useEffect(() => {
        try {
            getPaymentsByPipelineStep(id, suid).then((data) => {
                setStudentsInPipeline(data);
                console.log(data);
                setLoading(false);
            });
        } catch (error) {
            console.log(error);
        }
    }, [id, suid, update]);
   

    const handleIgnorePayment = (id: any) => {
        showWarningMessage('Are you sure you want to ignore this payment?', 'Ignore Payment', 'Payment Ignored', 'Ignored!')
            .then(async (confirmed: boolean) => {
                if (confirmed) {
                    console.log(id);
                    const res = await ignorePayment(id);
                   if (res.status === 200) {
                        setUpdate(!update);
                    } else {
                        console.error('Failed to ignore payment');
                    }
                } else {
                    // User canceled the action
                    console.log('User canceled');
                }
            })
            .catch((error: any) => {
                // Handle error if any
                console.error('Error:', error);
            });
    };

    return (
        <>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/payments/late-payment-pipeline" className="text-primary hover:underline">
                        Late Payment Pipeline
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 dark:text-white">
                    <span>{latePayementPipeline?.find((step: any) => step.PaymentPipelineStepId === parseInt(id ?? ''))?.PipelineStepName}</span>
                </li>
            </ul>
            <div className="px-4 sm:px-6 lg:px-8 mt-4">
                <div className="lg:flex lg:items-center">
                    <div className="sm:flex-auto w-full sm:gap-x-4">
                        <h1 className="uppercase font-semibold text-lg dark:text-white">
                            Students in Pipeline Step{' '}
                            <span className="font-bold text-primary">{latePayementPipeline?.find((step: any) => step.PaymentPipelineStepId === parseInt(id ?? ''))?.PipelineStepName}</span>
                        </h1>
                    </div>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="mt-4 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 dark:text-white">
                                                    Billing Name
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell dark:text-white">
                                                    Date
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell dark:text-white">
                                                    Amount
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell dark:text-white">
                                                    Next Contact Date
                                                </th>

                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">View</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                            {studentsInPipeline?.map((list: any) => (
                                                <tr key={list.PaymentId} className={`${convertToUserLocalDate(list.NextContactDate, handleGetTimeZoneOfUser()) < convertToUserLocalDate(new Date(), handleGetTimeZoneOfUser()) && 'bg-cs text-gray-900'}`}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6">{list.CustomerName}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm  hidden sm:table-cell">
                                                        {list.Date && list.Date !== '1900-01-01T00:00:00.000Z'
                                                            ? formatDate(new Date(list.Date), { month: 'short', day: 'numeric', year: 'numeric', timeZone: handleGetTimeZoneOfUser() })
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm  hidden sm:table-cell">${list.Amount}</td>
                                                    <td
                                                        className={`whitespace-nowrap px-3 py-4 text-sm hidden sm:table-cell ${
                                                            new Date(list.NextContactDate) <= new Date() ? 'text-danger font-bold' : 'text-gray-900 dark:text-white'
                                                        }`}
                                                    >
                                                        {list.NextContactDate && list.NextContactDate !== '1900-01-01T00:00:00.000Z'
                                                            ? formatDate(new Date(list.NextContactDate), { month: 'short', day: 'numeric', year: 'numeric', timeZone: handleGetTimeZoneOfUser() })
                                                            : 'N/A'}
                                                    </td>

                                                    <td className="text-center gap-x-4 flex items-center justify-center">
                                                        <Link
                                                            to={`/payments/view-late-payment/${suid}/${list.PaysimpleTransactionId}`}
                                                            type="button"
                                                            className={`btn btn-sm ${new Date(list.NextContactDate) <= new Date() ? 'btn-success' : 'btn-outline-success dark:bg-gray-800'}`}
                                                        >
                                                            View
                                                        </Link>
                                                        <button type="button" className={`btn btn-sm btn-outline-danger`} onClick={() => handleIgnorePayment(list.PaymentId)}>
                                                            Ignore
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
