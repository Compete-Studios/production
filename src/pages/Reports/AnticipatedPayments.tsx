import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";
import { UserAuth } from "../../context/AuthContext";
import { getAllActivePaymentSchedules } from "../../functions/api";
import { showErrorMessage } from "../../functions/shared";

const AnticipatedPayments = () => {
    const { suid }: any = UserAuth();
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState<any>(null);
    const [total, setTotal] = useState('0');

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Upcoming Payments'));
    });

    const currentDate = new Date();

    // Create a date object representing the first day of the current month
    const thisMonthStartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    );

    // Create a date object representing the last day of the current month
    const thisMonthEndDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    );

    // Initialize the state with the formatted start and end dates
    const [startDate, setStartDate] = useState(thisMonthStartDate);
    const [endDate, setEndDate] = useState(thisMonthEndDate);


    useEffect(() => {
        //getPayments(startDate, endDate, suid);
    }, [suid, startDate, endDate]);

    const getPayments = async (startDate: Date, endDate: Date, studioId: string) => {
        setLoading(true);
        console.log('BEGIN FETCHING PAYMENTS', startDate, endDate, studioId);
        try {
            // const { data: activeSchedules } = await getAllActivePaymentSchedules(studioId);
            // console.log('Data', activeSchedules);
            // if (activeSchedules.Meta.HttpStatus === "OK" && activeSchedules.Meta.PagingDetails.TotalItems > 0) {
            //     const filteredPayments = filterPaymentsByDate(activeSchedules.Response, startDate, endDate);
            //     setPayments(filteredPayments);
            //     calculateTotal(filteredPayments);
            // } else {
            //     setPayments([]);
            // }
        } catch (error) {
            console.error(error);
            showErrorMessage(`Failed to fetch anticipated payments. Error: ${(error as Error).message}`);
        } finally {
            setLoading(false);
        }
    };

    const filterPaymentsByDate = (payments: any[], start: Date, end: Date) => {
        return payments.filter(payment => {
            const paymentStartDate = new Date(payment.StartDate);
            const paymentEndDate = payment.EndDate ? new Date(payment.EndDate) : null;

            if (!paymentEndDate && paymentStartDate < new Date(end)) return true;

            if (paymentEndDate && paymentStartDate < new Date(end) && paymentEndDate > new Date(start)) return true;

            return false;
        });
    };

    const calculateTotal = (payments: any[]) => {
        const totalAmount = payments.reduce((acc, payment) => acc + (payment.Amount || 0), 0); // Assuming 'Amount' is the field for payment amount
        setTotal(totalAmount);
    };

    const handleDateChange = async () => {
        // const formattedStartDate = startDate.toISOString().split("T")[0];
        // const formattedEndDate = endDate.toISOString().split("T")[0];

        // Discard timezone info and other irrelevant stuff in the date
        const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        await getPayments(start, end, suid);
    };

    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">Anticipated Payments</h2>
                    <p className="text-muted-foreground">
                        The total payment amount expected in the given date range. This report is based on students with Active payment schedules.
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-x-2">
                <div className="grid gap-2">
                    <span className="text-sm text-gray-500 font-medium">From:</span>
                    <div className="mt-2">
                        <input
                            type="date"
                            id="start-date"
                            className="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                            value={startDate.toISOString().split("T")[0]}
                            onChange={(e) => setStartDate(new Date(e.target.value))}
                        />
                    </div>
                </div>
                <div className="grid gap-2">
                    <span className="text-sm text-gray-500 font-medium">To:</span>
                    <div className="mt-2">
                        <input
                            type="date"
                            id="end-date"
                            className="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                            value={endDate.toISOString().split("T")[0]}
                            onChange={(e) => setEndDate(new Date(e.target.value))}
                        />
                    </div>
                </div>
                <div className="flex justify-end pt-12">
                    <button
                        type="submit"
                        className="rounded-sm bg-com px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-comhover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-com flex items-center"
                        onClick={handleDateChange}
                    >
                        Update
                    </button>
                </div>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : payments && payments.length > 0 ? (
                <div>
                    <p>Total: ${total}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Customer ID</th>
                                <th> Customer Name</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment: any, index: number) => (
                                <tr key={index}>
                                    <td>{payment.CustomerId}</td>
                                    <td> {payment.CustomerName}</td>
                                    <td>{new Date(payment.StartDate).toLocaleDateString()}</td>
                                    <td>{payment.EndDate ? new Date(payment.EndDate).toLocaleDateString() : 'N/A'}</td>
                                    <td>{payment.Amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No data available.</p>
            )}

        </div>
    );
};

export default AnticipatedPayments;