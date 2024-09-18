import { UserAuth } from '../../context/AuthContext';
import { getLatePaymentCount } from '../../functions/manuals';
import { convertToUserLocalDate, handleGetTimeZoneOfUser } from '../../functions/dates';
import { formatDate } from '@fullcalendar/core';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { ignorePayment } from '../../functions/payments';
import { showWarningMessage } from '../../functions/shared';
import UpdateNotes from './UpdateNotes';
import RetryPayment from './RetryPayment';
import ViewLatePaymentDetails from './ViewLatePaymentDetails';

export default function LatePayments({ payments, setPayments }: any) {
    const { suid }: any = UserAuth();

    const handleGetLatePayments = async () => {
        try {
            const res = await getLatePaymentCount(suid);
            setPayments(res);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    console.log(payments)

    const handleIgnorePayment = (id: any) => {
        showWarningMessage('Are you sure you want to ignore this payment?', 'Ignore Payment', 'Payment Ignored', 'Ignored!')
            .then(async (confirmed: boolean) => {
                if (confirmed) {
                    const res = await ignorePayment(id);

                    if (res === 'Update was successful') {
                        handleGetLatePayments();
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
        <div className="active panel rounded-tl-none">
            <div className="mb-5 text-lg font-bold">Late Payments</div>
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th className="ltr:rounded-l-md rtl:rounded-r-md">ID</th>
                            <th>NEXT CONTACT DATE</th>
                            <th>NAME</th>
                            <th>AMOUNT</th>
                            <th className="text-right">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments?.map((payment: any, index: number) => (
                            <tr
                                key={index}
                                className={`${
                                    convertToUserLocalDate(payment.NextContactDate, handleGetTimeZoneOfUser()) < convertToUserLocalDate(new Date(), handleGetTimeZoneOfUser()) && 'bg-cs text-gray-900'
                                }`}
                            >
                                <td className="font-semibold">#{payment.PaysimpleTransactionId}</td>
                                <td className="whitespace-nowrap">{formatDate(payment.NextContactDate)}</td>
                                <td className="whitespace-nowrap">{payment.CustomerName}</td>
                                <td className="font-bold">${payment.Amount}</td>
                                <td className="flex items-center justify-end gap-2 ml-auto">
                                    <ViewLatePaymentDetails payID={payment.PaysimpleTransactionId} />
                                    <UpdateNotes payID={payment.PaysimpleTransactionId} />
                                    <RetryPayment payID={payment.PaysimpleTransactionId} />
                                    <Tippy content="Ignore Payment">
                                        <button type="button" className="text-danger" onClick={() => handleIgnorePayment(payment.PaymentId)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                            </svg>
                                        </button>
                                    </Tippy>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
