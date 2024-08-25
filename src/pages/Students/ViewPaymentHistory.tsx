import React, { useEffect, useState } from 'react';
import { getCustomerPayments, getInternalPaymentsByStudentId } from '../../functions/payments';
import { UserAuth } from '../../context/AuthContext';
import { formatWithTimeZone, handleGetTimeZoneOfUser } from '../../functions/dates';
import { Link, useParams } from 'react-router-dom';
import Hashids from 'hashids';
import { hashTheID } from '../../functions/shared';
import PaymentInfoSlider from '../Payments/PaymentInfoSlider';
import IconEye from '../../components/Icon/IconEye';

export default function ViewPaymentHistory() {
    const { suid, students }: any = UserAuth();
    const hashids = new Hashids();
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [paysimplehistory, setPaysimpleHistory] = useState([]);
    const [internalHistory, setInternalHistory] = useState([]);
    const [loadingData, setLoadingData] = useState({
        paymentInfo: true,
    });
    const [student, setStudent] = useState<any>({
        First_Name: '',
        Last_Name: '',
        Student_ID: '',
    });

    const { paymentID }: any = useParams();

    const handleGetPaymentHistory = async (payID: any) => {
        const data = {
            customerId: payID,
            studioId: suid,
        };
        try {
            const res = await getCustomerPayments(data);
            setPaysimpleHistory(res?.Response);
            setLoadingData((prevState) => ({ ...prevState, paymentInfo: false }));
        } catch (error) {
            console.log('error', error);
            setLoadingData((prevState) => ({ ...prevState, paymentInfo: false }));
        } finally {
            setLoadingData((prevState) => ({ ...prevState, paymentInfo: false }));
        }
    };

    const handleGetInternalPayments = async (studentID: any) => {
        try {
            const res = await getInternalPaymentsByStudentId(studentID);
            setInternalHistory(res);
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        const numbers: any[] = hashids.decode(paymentID);
        handleGetPaymentHistory(numbers[0]);
        handleGetInternalPayments(numbers[1]);
        const payStudent = students.find((student: any) => parseInt(student.Student_ID) === parseInt(numbers[1]));
        setStudent(payStudent);
    }, [paymentID]);

    useEffect(() => {
        if (paysimplehistory.length > 0 && internalHistory.length > 0) {
            const allPayments = [...paysimplehistory, ...internalHistory];
            const sortedPayments = allPayments.sort((a: Payment, b: Payment) => new Date(b.PaymentDate).getTime() - new Date(a.PaymentDate).getTime());
            setPaymentHistory(sortedPayments);
        } else if (paysimplehistory.length > 0) {
            setPaymentHistory(paysimplehistory);
        } else if (internalHistory.length > 0) {
            setPaymentHistory(internalHistory);
        } else {
            setPaymentHistory([]);
        }
    }, [paysimplehistory, internalHistory]);

    return (
        <>
            <div className="sm:flex sm:items-center sm:justify-between">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/students/view-students" className="text-primary hover:underline">
                            Students
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <Link to={`/students/view-student/${hashTheID(student.Student_ID)}/${hashTheID(suid)}`} className="text-primary hover:underline">
                            {student?.First_Name} {student?.Last_Name}
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Payment History</span>
                    </li>
                </ul>
            </div>

            <div className="panel p-0 mt-5">
                <div className="flex-auto">
                    <h5 className="text-xl font-medium p-5">Payment History</h5>
                    <div className="table-responsive rouned-lg mb-5">
                        <table className="panel border rounded-lg">
                            <thead>
                                <tr>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Billing Name</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th className="text-right">View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentHistory?.map((data: any) => {
                                    return (
                                        <tr key={data.Id} className={`${!data.Id ? 'bg-primary-light' : data.Status === 'Settled' ? 'bg-success-light' : 'bg-danger-light'} `}>
                                            <td className="font-bold">${data.Amount?.toFixed(2) || data.AmountPaid?.toFixed(2)}</td>
                                            <td>{data.PaymentDate && formatWithTimeZone(data.PaymentDate, handleGetTimeZoneOfUser())}</td>
                                            <td>
                                                {data.CustomerFirstName || ''} {data.CustomerLastName || ''}
                                            </td>
                                            <td className={`text-xs font-bold ${data.Id ? 'text-info' : 'text-primary'}`}>{data.Id ? 'External Payment' : 'Internal Payment'}</td>
                                            <td>
                                                <span
                                                    className={`ml-auto badge whitespace-nowrap ${
                                                        data.Status === 'Settled'
                                                            ? 'bg-success'
                                                            : data.Status === 'Pending'
                                                            ? 'bg-warning'
                                                            : data.Status === 'In Progress'
                                                            ? 'bg-info'
                                                            : data.Status === 'Failed'
                                                            ? 'bg-danger'
                                                            : 'bg-primary'
                                                    }`}
                                                >
                                                    {data.Status || 'Internal'}
                                                </span>
                                            </td>
                                            <td className="flex">
                                                <div className="ml-auto">
                                                    {data.Status === 'Failed' ? (
                                                        <Link to={`/payments/view-late-payment/${suid}/${data.Id}`} className="text-danger hover:text-red-800 flex items-center gap-1">
                                                          <IconEye /> View Payment
                                                        </Link>
                                                    ) : (
                                                        <PaymentInfoSlider payID={data.Id} />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
