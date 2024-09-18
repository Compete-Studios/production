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
    const [total, setTotal] = useState<any>(0);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Upcoming Payments'));
    });

    const currentDate = new Date();
    
    const thisMonthEndDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    );
    const [startDate, setStartDate] = useState(currentDate);
    const [endDate, setEndDate] = useState(thisMonthEndDate);


    useEffect(() => {
        getPayments(startDate, endDate, suid);
    }, [suid]);

    const getPayments = async (startDate: any, endDate: any, studioId: string) => {
        setLoading(true);
        try {
            //Get all active payment schedules for the studio
            const activeSchedules = await getAllActivePaymentSchedules(studioId);
            //For all active schedules, filter out the ones that are within the given date range
            if (activeSchedules.Meta.HttpStatus === "OK" && activeSchedules.Meta.PagingDetails.TotalItems > 0) {
                const filteredPayments = filterPaymentsByDate(activeSchedules.Response, startDate, endDate);
                setPayments(filteredPayments.filteredPayments);
                setTotal(filteredPayments.totalAmount);
            } else {
                setPayments([]);
            }
        } catch (error) {
            console.error(error);
            showErrorMessage(`Failed to fetch anticipated payments. Error: ${(error as Error).message}`);
        } finally {
            setLoading(false);
        }
    };

    const filterPaymentsByDate = (payments: any[], start: any, end: any) => {
        // Convert start and end to Date objects for comparison
        const startDate = new Date(start);
        const endDate = new Date(end);

        let totalAmount = 0;

        const filteredPayments = payments.filter(payment => {
            const paymentStartDate = new Date(payment.StartDate);
            const paymentEndDate = payment.EndDate ? new Date(payment.EndDate) : null;
            const executionDay = payment.ExecutionFrequencyParameter;

            // Check if the payment is active within the given range
            const isActive = (!paymentEndDate && paymentStartDate <= endDate) ||
                (paymentEndDate && paymentStartDate <= endDate && paymentEndDate >= startDate);

            if (!isActive) {
                return false;
            }

            // Check if the payment will run on the specified days within the date range
            let current = new Date(startDate);
            let paymentCount = 0;

            while (current <= endDate) {
                const month = current.getMonth();
                const year = current.getFullYear();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const runDay = executionDay > daysInMonth ? daysInMonth : executionDay;

                const runDate = new Date(year, month, runDay);
                if (runDate >= startDate && runDate <= endDate) {
                    paymentCount++;
                }

                // Move to the next month
                current.setMonth(current.getMonth() + 1);
            }

            // Calculate the total amount for this payment
            totalAmount += payment.PaymentAmount * paymentCount;

            return paymentCount > 0;
        });
        
        return {
            filteredPayments,
            totalAmount
        };
    };

    const handleDateChange = async () => {
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];
        await getPayments(formattedStartDate, formattedEndDate, suid);
    };

    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">Anticipated Payments</h2>
                    <p className="text-muted-foreground">
                        The ESTIMATED total payment amount expected in the given date range. This report is based on students with Active payment schedules.
                    </p>
                    <p className="text-muted-foreground">It does not include things like intro program payments, paid-in-full schedules, or payments made in the studio.</p>
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
                        className="rounded-sm bg-blue-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 flex items-center"
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
                    <h2 className="text-3xl font-bold mb-4">
                        Anticipated Total: <span className="text-blue-500">${total}</span>
                    </h2>
                    <p>Estimated Number of Payments: {payments.length}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Billing Name</th>
                                <th>Amount</th>
                                <th>Most Recent Payment</th>
                                <th>Next Payment</th>
                                <th>Schedule Began</th>
                                <th>Schedule Ends</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments?.map((payment: any, index: number) => (
                                <tr key={index}>
                                    <td>{payment.CustomerFirstName} {payment.CustomerLastName}</td>
                                    <td>{payment.PaymentAmount}</td>
                                    <td>{new Date(payment.DateOfLastPaymentMade).toLocaleDateString()}</td>
                                    <td>{new Date(payment.NextScheduleDate).toLocaleDateString()}</td>
                                    <td>{new Date(payment.StartDate).toLocaleDateString()}</td>
                                    <td>{payment.EndDate ? new Date(payment.EndDate).toLocaleDateString() : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No active payment schedules found in the given date range.</p>
            )}

        </div>
    );
};

export default AnticipatedPayments;