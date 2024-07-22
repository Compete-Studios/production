import { Dialog, Transition, Tab } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import IconX from '../../components/Icon/IconX';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { UserAuth } from '../../context/AuthContext';
import { getAllCustomerCreditCards, getStudentBillingAccounts, getStudentInfo } from '../../functions/api';
import { addPaymentNotes, getAllCustomerPaymentAccounts, runPaymentForCustomer } from '../../functions/payments';
import { showErrorMessage, showMessage } from '../../functions/shared';

export default function BulkPay({ students, prospects }: any) {
    const { suid }: any = UserAuth();
    const [openBulkPay, setOpenBulkPay] = useState(false);
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [studentsWithActiveBilling, setStudentsWithActiveBilling] = useState<any[]>([]);
    const [studentsToCharge, setStudentsToCharge] = useState<any[]>([]);
    const [runningPayment, setRunningPayment] = useState(false);

    useEffect(() => {
        const preNotes = '#BulkPayment ' + new Date().toLocaleDateString();
        setNotes(preNotes);
    }, []);

    const handleAmountChange = (e: any) => {
        const value = e.target.value;
        const regex = /^\d*\.?\d{0,2}$/;

        if (regex.test(value)) {
            setAmount(value);
        }
    };

    const handleBlur = () => {
        setAmount((prev) => (prev ? parseFloat(prev).toFixed(2) : ''));
    };

    const getPaySimpleInformation = async (studentID: any, name: any) => {
        try {
            const response = await getStudentBillingAccounts(studentID);
            if (response.recordset.length > 0) {
                const cardsRef = await getAllCustomerCreditCards(suid, response?.recordset[0]?.PaysimpleCustomerId);

                if (cardsRef?.Response?.length > 0) {
                    const studentToSave: any = {
                        studentID: studentID,
                        paySimpleID: response?.recordset[0]?.PaysimpleCustomerId,
                        billingInfo: cardsRef?.Response,
                        name: name,
                    };
                    setStudentsWithActiveBilling((prev) => [...prev, studentToSave]);
                    setStudentsToCharge((prev) => [...prev, studentToSave]);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCheckBillingInfo = async (studentList: any) => {
        const promises = studentList.map((student: any) => getPaySimpleInformation(student.Student_ID, student.Name));
        await Promise.all(promises);
    };

    useEffect(() => {
        if (students) {
            setStudentsWithActiveBilling([]);
            handleCheckBillingInfo(students);
        }
    }, [students]);

    const handleRunPayment = async () => {
        setRunningPayment(true);
        for (const student of studentsToCharge) {
            const defaultCardToUse = student.billingInfo.find((card: any) => card.IsDefault === true) || student.billingInfo[0];
            const paymentData = {
                paymentAccountId: defaultCardToUse?.Id,
                amount: amount,
            };
            try {
                const response = await runPaymentForCustomer(paymentData);
                const addedNote = await addPaymentNotes(response?.Response?.Id, notes);
                console.log(response);
                console.log(addedNote);
            } catch {
                showErrorMessage('An error occurred while processing the payment');
            }
        }
        showMessage('Payment processed successfully');
        setOpenBulkPay(false);
        setRunningPayment(false);
        setNotes('');
    };

    return (
        <div>
            <div className="flex items-center justify-center">
                <button type="button" className="btn btn-success gap-2 w-full whitespace-nowrap" onClick={() => setOpenBulkPay(true)}>
                    <IconDollarSignCircle />
                    Bulk Pay
                </button>
            </div>
            <Transition appear show={openBulkPay} as={Fragment}>
                <Dialog as="div" open={openBulkPay} onClose={() => setOpenBulkPay(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-lg text-black dark:text-white-dark min-h-24 max-h-[90vh]">
                                    <div className="flex bg-success text-white dark:bg-success-dark-light items-center justify-between px-5 py-3">
                                        <div className="text-lg font-bold">Bulk Pay</div>
                                        <button type="button" className="text-white" onClick={() => setOpenBulkPay(false)}>
                                            <IconX />
                                        </button>
                                    </div>

                                    <PerfectScrollbar className="relative min-h-64 max-h-[calc(100vh_-_200px)] chat-conversation-box">
                                    <div className="p-5 pb-36">
                                        <p>Please note that only students who have a default payment method (card or bank account) already attached can be charged.</p>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="amount">Amount</label>
                                                <div className="flex">
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                        $
                                                    </div>
                                                    <input
                                                        id="amount"
                                                        type="text"
                                                        placeholder="0.00"
                                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                                        value={amount}
                                                        onChange={handleAmountChange}
                                                        onBlur={handleBlur}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="notes">Notes</label>
                                                <textarea id="notes" className="form-textarea" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="space-y-4 ">
                                            {studentsWithActiveBilling?.map((stud: any) => (
                                                <label className="flex" key={stud.studentID}>
                                                    <input
                                                        type="checkbox"
                                                        checked={studentsToCharge.some((student) => student.studentID === stud.studentID)}
                                                        className="form-checkbox"
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setStudentsToCharge((prev) => [...prev, stud]);
                                                            } else {
                                                                setStudentsToCharge((prev) => prev.filter((student) => student.studentID !== stud.studentID));
                                                            }
                                                        }}
                                                    />
                                                    <span>{stud.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    </PerfectScrollbar>

                                    <div className="flex justify-end items-center absolute bottom-0 right-0 w-full bg-dark-light dark:bg-dark p-5 border-t ">
                                        <button type="button" className="btn btn-outline-danger" onClick={() => setOpenBulkPay(false)}>
                                            Discard
                                        </button>
                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleRunPayment} disabled={runningPayment}>
                                            {runningPayment && (
                                                <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                            )}
                                            {runningPayment ? 'Processing...' : 'Run Payment'}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
