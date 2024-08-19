import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { addLatePayment, getStudioIdFromPaysimpleCustomerId, failedPaymentWebhookAuth } from '../functions/payments';

interface FailedPayment {
    paymentId: string;
    customerId: string;
    customerFirstName: string;
    customerLastName: string;
    accountId: string;
    amount: number;
    paymentType: string;
    failureReason: string;
    failureCode: string;
    isDecline: boolean;
    merchantId: string;
    paymentDate: string;
}

const FailedPaymentEndpoint: React.FC = () => {
    const [failedPayments, setFailedPayments] = useState<FailedPayment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Only fetch and display
    // For testing, delete when going live
    useEffect(() => {
        const fetchFailedPayments = async () => {
            try{
                const response = await failedPaymentWebhookAuth();
                const payments = response.data;
                setFailedPayments(payments);
            } catch (err) {
                if (err instanceof Error) {
                    console.error(err.message);
                } else {
                    console.error('An unknown error occurred', err);
                }
            }
        };
        fetchFailedPayments();
    }, []);
    
    // Fetch, process, and display
    useEffect(() => {
        setLoading(true);
        const fetchAndProcessFailedPayments = async () => {
            try {
                const response = await failedPaymentWebhookAuth();
                const payments = response.data;

                await addPaymentsToOurDB(payments);
                setFailedPayments(payments);
            } catch (err) {
                if (err instanceof Error) {
                    console.error(err.message);
                } else {
                    console.error('An unknown error occurred', err);
                }
             } finally {
                setLoading(false);
            }
        };

        fetchAndProcessFailedPayments();
    }, []);

    const addPaymentsToOurDB = async (payments: any) => {
        for (const payment of payments) {
            const studioId = await getStudioByCustomerId(payment.customerId);
            if (studioId) {
                const paymentData = {
                    studioId: studioId,
                    paysimpleTransactionId: payment.paymentId,
                    retriedTransactionId:0,
                    ignoreThisPayment: false,
                    paysimpleCustomerId: payment.customerId,
                    customerName: payment.customerFirstName + ' ' + payment.customerLastName,
                    amount: payment.amount,
                    date: new Date(payment.paymentDate),
                    notes:'',
                    nextContactDate:'',
                };

                await addLatePayment(paymentData);
            }
        }
    };

    const getStudioByCustomerId = async (customerId: string) => {
        try {
            const response = await getStudioIdFromPaysimpleCustomerId(customerId);
            return response.recordset;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <table className="min-w-full bg-white border border-gray-200">
            <thead>
                <tr>
                    <th className="py-2 px-4 border-b">Payment ID</th>
                    <th className="py-2 px-4 border-b">Customer ID</th>
                    <th className="py-2 px-4 border-b">Account ID</th>
                    <th className="py-2 px-4 border-b">Amount</th>
                    <th className="py-2 px-4 border-b">Payment Type</th>
                    <th className="py-2 px-4 border-b">Failure Reason</th>
                    <th className="py-2 px-4 border-b">Failure Code</th>
                    <th className="py-2 px-4 border-b">Is Decline</th>
                    <th className="py-2 px-4 border-b">Merchant ID</th>
                    <th className="py-2 px-4 border-b">Created At</th>
                </tr>
            </thead>
            <tbody>
                {failedPayments.map(payment => (
                    <tr key={payment.paymentId}>
                        <td className="py-2 px-4 border-b">{payment.paymentId}</td>
                        <td className="py-2 px-4 border-b">{payment.customerId}</td>
                        <td className="py-2 px-4 border-b">{payment.customerFirstName}</td>
                        <td className="py-2 px-4 border-b">{payment.customerLastName}</td>
                        <td className="py-2 px-4 border-b">{payment.accountId}</td>
                        <td className="py-2 px-4 border-b">{payment.amount}</td>
                        <td className="py-2 px-4 border-b">{payment.paymentType}</td>
                        <td className="py-2 px-4 border-b">{payment.failureReason}</td>
                        <td className="py-2 px-4 border-b">{payment.failureCode}</td>
                        <td className="py-2 px-4 border-b">{payment.isDecline ? 'Yes' : 'No'}</td>
                        <td className="py-2 px-4 border-b">{payment.merchantId}</td>
                        <td className="py-2 px-4 border-b">{new Date(payment.createdAt).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default FailedPaymentEndpoint;
