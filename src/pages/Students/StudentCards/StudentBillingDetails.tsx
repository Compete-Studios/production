import Tippy from '@tippyjs/react';
import React, { useEffect, useState } from 'react';
import IconPencilPaper from '../../../components/Icon/IconPencilPaper';
import { getPaymentScheduleByID, getPaymentSchedulesForCustomer, getPaysimpleCustomerIdFromStudentId, getStudentBillingAccounts } from '../../../functions/api';
import { UserAuth } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import BillingInfoUpdate from '../components/BillingInfoUpdate';
import ViewPaymentMethods from '../ViewPaymentMethods';
import AddCardModal from '../AddCardModal';
import AddBankModal from '../AddBankModal';
import IconPlus from '../../../components/Icon/IconPlus';
import AddStudentToBillingAccountModal from '../AddStudentToBillingAccountModal';
import IconCalendar from '../../../components/Icon/IconCalendar';
import { formatDate } from '@fullcalendar/core';
import ViewActivePaymentSchedules from '../ViewActivePaymentSchedules';
import { getAllCustomerPaymentAccounts } from '../../../functions/payments';
import Hashids from 'hashids';
import { getCustomer, getPaymentsForCustomer, listAccountsForCustomer } from '../../../functions/paymentsAll';

export default function StudentBillingDetails({ student }: any) {
    const { suid }: any = UserAuth();
    const [updateBilling, setUpdateBilling] = useState<boolean>(false);
    const [billingLoading, setBillingLoading] = useState<boolean>(true);
    const [billingInfo, setBillingInfo] = useState<any>({});
    const [paymentsLoading, setPaymentsLoading] = useState<boolean>(true);
    const [paymentSchedules, setPaymentSchedules] = useState<any>([]);
    const [updated, setUpdated] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    const [hasCards, setHasCards] = useState<boolean>(false);
    const [paySimpleInfo, setPaySimpleInfo] = useState<any>({});
    const [creditCards, setCreditCards] = useState<any>([]);
    const [achAccounts, setAchAccounts] = useState<any>([]);
    const hashids = new Hashids();

    const navigate = useNavigate();

    const payHistoryIds = hashids.encode(paySimpleInfo, student?.Student_id);

    const handleUpdateBilling = (e: any) => {
        e.preventDefault();
        setUpdateBilling(!updateBilling);
    };

    // const handleGetBillingDetails = async (customerID: any) => {
    //     console.log('GETTING BILLING DETAILS');
    //     try {
    //         const res = await getCustomer(suid, customerID);
    //         console.log('BILLING DETAILS', res);
    //     } catch (error) {
    //         console.log('ERROR GETTING BILLING DETAILS', error);
    //     }
    // };

    // const handleGetPaymentHistory = async (customerID: any) => {
    //     console.log('GETTING PAYMENT HISTORY');
    //     try {
    //         const res = await getPaymentsForCustomer(suid, customerID);
    //         console.log('BILLING DETAILS', res);
    //     } catch (error) {
    //         console.log('ERROR GETTING PAYMENT HISTORY', error);
    //     }
    // };

    const handleGetPaymentMethods = async (customerID: any) => {
        console.log('GETTING PAYMENT METHODS');
        try {
            const res = await listAccountsForCustomer(suid, customerID);
            setCreditCards(res?.CreditCardAccounts);
            setAchAccounts(res?.AchAccounts);
            console.log('BILLING DETAILS', res);
        } catch (error) {
            console.log('ERROR GETTING BILLING DETAILS', error);
        }
    };

    console.log('STUDENT', creditCards);

    // const handleGetPaymentSchedules = async (customerID: any) => {
    //     console.log('GETTING PAYMENT SCHEDULES');
    //     try {
    //         const res = await listAccountsForCustomer(suid, customerID);
    //         console.log('BILLING DETAILS', res);
    //     } catch (error) {
    //         console.log('ERROR GETTING BILLING DETAILS', error);
    //     }
    // };

    const handleGoToPayments = () => {
        const newID = parseInt(student?.Student_id) * parseInt(suid);
        navigate(`/students/${newID}/finish-billing-setup-options`);
    };

    const handleGoToPaymentSchedules = () => {
        const newID = parseInt(student?.Student_id) * parseInt(suid);
        navigate(`/students/${newID}/add-payment-schedules`);
    };

    // useEffect(() => {
    //     if (paySimpleInfo) {
    //         handleGetBillingDetails(paySimpleInfo);
    //         handleGetPaymentHistory(paySimpleInfo);
    //         handleGetPaymentMethods(paySimpleInfo);
    //         handleGetPaymentSchedules(paySimpleInfo);
    //     }
    // }, [paySimpleInfo]);

    const getPaySimpleInformation = async (studentID: any) => {
        try {
            const response = await getStudentBillingAccounts(studentID);
            if (response.recordset.length > 0) {
                setPaySimpleInfo(response.recordset[0].PaysimpleCustomerId);
                await getAllCustomerPaymentAccounts(response.recordset[0]?.PaysimpleCustomerId, suid).then((response) => {
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

    const getBillingInfo = async (paySimpleID: any, studioId: any) => {
        try {
            if (paySimpleID && suid) {
                const customerIdResponse = await getPaysimpleCustomerIdFromStudentId(paySimpleInfo, studioId);
                console.timeLog('customerIdResponse', customerIdResponse);
                if (customerIdResponse?.Response) {
                    setBillingInfo(customerIdResponse?.Response);
                    console.log('BILLING INFO', customerIdResponse?.Response);
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

    useEffect(() => {
        getBillingInfo(paySimpleInfo, suid);
        getPaymentSchedules(paySimpleInfo, suid);
        handleGetPaymentMethods(paySimpleInfo);
    }, [paySimpleInfo, suid, updated]);

    console.log(creditCards)

    return (
        <div className="pt-5 grid grid-cols-6 gap-4">
            {/* BILLING INFO */}

            <div className="panel p-0 col-span-2">
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
                                    <li>
                                        <AddStudentToBillingAccountModal inStudent={true} billingAccountId={billingInfo?.Id} update={update} setUpdate={setUpdate} />
                                    </li>
                                </ul>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* ACTIVE PAYMENT SCHEDULES */}
            <div className="col-span-4">
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
            <div className="panel col-span-3">
     
            </div>
            <div className="col-span-3 panel p-0">
                <div className="flex rounded-t-lg items-center justify-between gap-4 p-5 bg-zinc-100">
                    <h3 className="font-bold text-lg">Payment Methods</h3>
                </div>
                <div>
                    {creditCards?.length > 0 && (
                        <div className="panel">
                            <h4 className="font-bold text-lg p-5">Credit Cards</h4>
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Card Number</th>
                                            <th>Expiration Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {creditCards?.map((card: any, index: any) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{card.CreditCardNumber}</td>
                                                    <td>{card.ExpirationDate}</td>
                                                    <td>
                                                        <button className="btn btn-info btn-sm">Edit</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
