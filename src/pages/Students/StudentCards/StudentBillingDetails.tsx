import Tippy from '@tippyjs/react';
import React, { useEffect, useState } from 'react';
import IconPencilPaper from '../../../components/Icon/IconPencilPaper';
import { getPaymentScheduleByID, getPaymentSchedulesForCustomer, getPaysimpleCustomerIdFromStudentId, getStudentBillingAccounts } from '../../../functions/api';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../../context/AuthContext';
import IconPlus from '../../../components/Icon/IconPlus';
import BillingInfoUpdate from '../components/BillingInfoUpdate';
import ViewPaymentMethods from '../ViewPaymentMethods';
import AddCardModal from '../AddCardModal';
import AddBankModal from '../AddBankModal';
import { getAllCustomerPaymentAccounts } from '../../../functions/payments';
import Hashids from 'hashids';
import IconCalendar from '../../../components/Icon/IconCalendar';
import { formatDate } from '@fullcalendar/core';
import ViewActivePaymentSchedules from '../ViewActivePaymentSchedules';

export default function StudentBillingDetails({ student, paymentSchedules, setPaymentSchedules, updated, setUpdated, setPaySimpleInfo, paySimpleInfo }: any) {
    const { suid }: any = UserAuth();
    const [updateBilling, setUpdateBilling] = useState<boolean>(false);
    const [billingLoading, setBillingLoading] = useState<boolean>(true);
    const [paymentsLoading, setPaymentsLoading] = useState<boolean>(true);        
    const [billingInfo, setBillingInfo] = useState<any>({});
    const [hasCards, setHasCards] = useState<boolean>(false);
    const hashids = new Hashids();
    
    const navigate = useNavigate();

    const payHistoryIds = hashids.encode(paySimpleInfo, student?.Student_id);

    const getBillingInfo = async (paySimpleID: any, studioId: any) => {
        try {
            if (paySimpleID && suid) {
                const customerIdResponse = await getPaysimpleCustomerIdFromStudentId(paySimpleInfo, studioId);
                console.timeLog('customerIdResponse', customerIdResponse);
                if (customerIdResponse?.Response) {
                    setBillingInfo(customerIdResponse?.Response);
                    setBillingLoading(false);
                } else {
                    setBillingInfo(null);
                    setBillingLoading(false);
                }
            } else {
                setBillingInfo(null);
                setBillingLoading(false);
            }
        } catch {
            console.log('error');
            setBillingLoading(false);
        }
    };

    const getPaySimpleInformation = async (studentID: any) => {
        try {
            const response = await getStudentBillingAccounts(studentID);
            if (response.recordset.length > 0) {
                setPaySimpleInfo(response.recordset[0].PaysimpleCustomerId);
                getAllCustomerPaymentAccounts(response.recordset[0]?.PaysimpleCustomerId, suid).then((response) => {
                    if (response?.Response?.CreditCardAccounts?.length > 0 || response?.Response?.AchAccounts?.length > 0) {
                        setHasCards(true);
                    } else {
                        setHasCards(false);
                    }
                });
            } else {
                setPaySimpleInfo(null);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getPaySimpleInformation(student?.Student_id);
    }, [student]);

    const getPaymentSchedules = async (paySimpleID: any, studioId: any) => {
        setPaymentSchedules([]);
        setPaymentsLoading(true);
        try {
            if (paySimpleID && suid) {
                const customerIdResponse = await getPaymentSchedulesForCustomer(paySimpleInfo, studioId);
                if (customerIdResponse?.Response) {
                    const schedules = customerIdResponse?.Response;
                    for (let i = 0; i < schedules.length; i++) {
                        getPaymentScheduleByID(schedules[i].Id, studioId).then((res) => {
                            setPaymentSchedules((prev: any) => {
                                return [...prev, res.Response];
                            });
                            setPaymentsLoading(false);
                        });
                        if (i === schedules.length - 1) {
                            setPaymentsLoading(false);
                        }
                    }
                } else {
                    setPaymentSchedules([]);
                    setPaymentsLoading(false);
                }
            } else {
                setPaymentSchedules([]);
                setPaymentsLoading(false);
            }
        } catch {
            console.log('error');
            setPaymentsLoading(false);
        }
    };

    useEffect(() => {
        getBillingInfo(paySimpleInfo, suid);
        getPaymentSchedules(paySimpleInfo, suid);
    }, [paySimpleInfo, suid, updated]);


    const handleUpdateBilling = (e: any) => {
        e.preventDefault();
        setUpdateBilling(!updateBilling);
    };

    const handleGoToPayments = () => {
        const newID = parseInt(student?.Student_id) * parseInt(suid);
        navigate(`/students/${newID}/finish-billing-setup-options`);
    };

    const handleGoToPaymentSchedules = () => {
        const newID = parseInt(student?.Student_id) * parseInt(suid);
        navigate(`/students/${newID}/add-payment-schedules`);
    };

    return (
        <div className="pt-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 2xl:grid-cols-3 xl:grid-cols-1 gap-4">
            {/* BILLING INFO */}
            <div>
                <div className="panel p-0">
                    <div className="flex items-center justify-between p-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Billing Info</h5>
                        {updateBilling ? (
                            <Tippy content="Update Billing Info">
                                <button className="ltr:ml-auto rtl:mr-auto text-danger hover:text-red-700 p-2 " onClick={(e: any) => handleUpdateBilling(e)}>
                                    Discard
                                </button>
                            </Tippy>
                        ) : (
                            <Tippy content="Update Billing Info">
                                <button className="ltr:ml-auto rtl:mr-auto text-info hover:text-blue-700 p-2 rounded-full" onClick={(e: any) => handleUpdateBilling(e)}>
                                    <IconPencilPaper />
                                </button>
                            </Tippy>
                        )}
                    </div>
                    {billingLoading ? (
                        <div className="flex items-center justify-center h-56">
                            <span className="animate-spin border-4 border-primary border-l-transparent rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span>
                        </div>
                    ) : (
                        <div>
                            {!billingInfo || Object?.keys(billingInfo)?.length === 0 ? (
                                <div className="flex items-center justify-center h-56">
                                    <div className="text-center">
                                        <div className="text-center text-gray-400">No billing information found</div>
                                        <button type="button" className="btn btn-info mx-auto mt-4" onClick={() => handleGoToPayments()}>
                                            <IconPlus /> Add Billing Info
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <BillingInfoUpdate billingInfo={billingInfo} updateBilling={updateBilling} setUpdateBilling={setUpdateBilling} />
                                    <ul className="mt-7 ">
                                        <li>
                                            <ViewPaymentMethods payID={paySimpleInfo} />
                                        </li>
                                        <li>
                                            <AddCardModal inStudent={true} paySimpleID={paySimpleInfo} />
                                        </li>
                                        <li>
                                            <AddBankModal inStudent={true} />
                                        </li>
                                        <li>
                                            <button
                                                className="uppercase font-lg font-bold w-full hover:bg-success-light p-4 text-left flex items-center gap-3 whitespace-nowrap"
                                                onClick={handleGoToPaymentSchedules}
                                            >
                                                <IconPlus /> Add Payment Schedule
                                            </button>
                                        </li>
                                    </ul>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {/* ACTIVE PAYMENT SCHEDULES */}
            <div className="col-span-2 row-span-full">
                {paymentsLoading ? (
                    <div className="panel">
                        <div className="flex items-center justify-center h-24">
                            <span className="animate-spin border-4 border-primary border-l-transparent rounded-full w-10 h-10 inline-block align-middle m-auto"></span>
                        </div>
                    </div>
                ) : (
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="font-semibold text-lg dark:text-white-light">Payment Schedules</h5>

                            <div>
                                <Link to={`/students/view-payment-history/${payHistoryIds}`} className="btn btn-danger btn-sm gap-x-2">
                                    <IconCalendar /> View Payment History
                                </Link>
                            </div>
                        </div>

                        {!hasCards ? (
                            <div className="flex items-center justify-center h-56">
                                <div className="text-center">
                                    <div className="text-center text-gray-400">No billing information found</div>
                                    <button type="button" className="btn btn-info mx-auto mt-4" onClick={() => handleGoToPayments()}>
                                        Add Billing Account First
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive ">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Amount</th>
                                                <th>First Payment Date</th>
                                                <th>End Date</th>
                                                <th>Status</th>
                                                <th className="text-center">View/Edit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paymentSchedules.map((data: any, index: any) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className="font-bold">${parseInt(data?.PaymentAmount)?.toFixed(2)}</td>
                                                        <td>
                                                            <div className="whitespace-nowrap">{formatDate(data?.StartDate)}</div>
                                                        </td>
                                                        <td>{formatDate(data?.EndDate)}</td>
                                                        <td>
                                                            <span className={`badge whitespace-nowrap ${data.ScheduleStatus === 'Active' ? 'badge-outline-primary' : 'badge-outline-danger'}`}>
                                                                {data.ScheduleStatus}
                                                            </span>
                                                        </td>
                                                        <td className="text-center flex items-center justify-center">
                                                            <ViewActivePaymentSchedules student={student} paymentInfo={data} setUpdated={setUpdated} updated={updated} />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    <div className="flex mt-4 items-center justify-end"></div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
