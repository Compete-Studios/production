import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import 'swiper/css';
import { setPageTitle } from '../../store/themeConfigSlice';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import IconX from '../../components/Icon/IconX';
import Swal from 'sweetalert2';
import { addBankAccountToCustomer } from '../../functions/payments';
import IconInfoCircle from '../../components/Icon/IconInfoCircle';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';


interface BankInfo {
    customerId: string;
    routingNumber: string;
    bankAccountNumber: string;
    bankName: string;
    isCheckingAccount: boolean;
    expDate: string;
    isDefault: boolean;
}

export default function AddBankModal({ student, paySimpleID, bankAccounts, inStudent = false }: any) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Add bank account'));
    });
    const [bankInfo, setBankInfo] = useState<BankInfo>({
        customerId: paySimpleID,
        routingNumber: '',
        bankAccountNumber: '',
        bankName: '',
        isCheckingAccount: true,
        expDate: '',
        isDefault: true,
    });
    const [errorMessage, setErrorMessage] = useState<string>('');

    const [confirmAccountNumber, setConfirmAccountNumber] = useState<string>('');
    const [misMatchError, setMisMatchError] = useState<boolean>(false);

    const [modal, setModal] = useState(false);

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    useEffect(() => {
        setBankInfo({ ...bankInfo, customerId: paySimpleID });
    }, [paySimpleID]);

    const handleAddAccount = async () => {
        if (bankInfo.bankAccountNumber !== confirmAccountNumber) {
            setErrorMessage('Account numbers do not match');
            setMisMatchError(true);
            return;
        }
        try {
            const response = await addBankAccountToCustomer(bankInfo);
            if (response) {
                setBankInfo({
                    customerId: paySimpleID,
                    routingNumber: '',
                    bankAccountNumber: '',
                    bankName: '',
                    isCheckingAccount: true,
                    expDate: '',
                    isDefault: true,
                });
                showMessage('Bank Card Added Successfully!', 'success');
                setModal(false);
            }
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                // Handle 400 Bad Request error
                setErrorMessage(error?.response?.data?.error);
                console.log('Bad Request: Please check your input data.');
            } else {
                // Handle other errors
                console.log('An error occurred:', error.message);
                // Optionally, you can display a generic error message to the user here
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-center">
                {inStudent ? (
                    <Tippy content="Add Bank Account">
                    <button className="btn btn-secondary flex items-center justify-center rounded-full w-10 h-10 p-0" onClick={() => setModal(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bank" viewBox="0 0 16 16">
                            <path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89zM3.777 3h8.447L8 1zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h1V6zm2 0v7H12V6zM13 6v7h1V6zm2-1V4H1v1zm-.39 9H1.39l-.25 1h13.72z" />
                        </svg>
                    </button>
                </Tippy>
                ) : bankAccounts?.length > 0 ? (
                    <div className="grid  sm:grid-cols-4 gap-x-4 w-full">
                        {bankAccounts?.map((account: any) => (
                            <div
                                key={account?.Id}
                                className="relative block w-full rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-warning focus:ring-offset-2 bg-gradient-to-r from-warning via-yellow-500 to-warning  text-white"
                            >
                                <div className="">
                                    <div className="">
                                        <div className="text-lg font-medium">{account?.BankName}</div>
                                        <div className="ltr:ml-2 rtl:mr-2">{account?.AccountNumber}</div>
                                    </div>
                                    <div className="text-sm text-gray-50">{account?.IsCheckingAccount ? 'Checking' : 'Savings'}</div>
                                </div>
                            </div>
                        ))}
                        <div className={`sm:col-span-${bankAccounts?.length == 1 ? 3 : 2 ? 2 : 3 ? 1 : 4}`}>
                            <button
                                type="button"
                                className="relative block w-full rounded-lg  p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-info focus:ring-offset-2 bg-gradient-to-r from-info via-blue-700 to-info hover:from-blue-900 hover:via-blue-900 hover:to-blue-900"
                                onClick={() => setModal(true)}
                            >
                                  <svg className="mx-auto h-12 w-12 text-white" fill="currentColor" viewBox="0 0 16 16">
                            <path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89zM3.777 3h8.447L8 1zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h1V6zm2 0v7H12V6zM13 6v7h1V6zm2-1V4H1v1zm-.39 9H1.39l-.25 1h13.72z" />
                        </svg>
                                <span className="mt-2 block text-sm font-semibold text-white">Add a New Bank Account</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="relative block w-full rounded-lg  p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-info focus:ring-offset-2 bg-gradient-to-r from-info via-blue-700 to-info hover:from-blue-900 hover:via-blue-900 hover:to-blue-900"
                        onClick={() => setModal(true)}
                    >
                        <svg className="mx-auto h-12 w-12 text-white" fill="currentColor" viewBox="0 0 16 16">
                            <path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89zM3.777 3h8.447L8 1zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h1V6zm2 0v7H12V6zM13 6v7h1V6zm2-1V4H1v1zm-.39 9H1.39l-.25 1h13.72z" />
                        </svg>
                        <span className="mt-2 block text-sm font-semibold text-white">Add a Bank Account</span>
                    </button>
                )}

                <Transition appear show={modal} as={Fragment}>
                    <Dialog as="div" open={modal} onClose={() => setModal(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                            <div className="flex min-h-screen items-center justify-center px-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                        <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <div>
                                                <h5 className="text-lg font-bold">
                                                    Add Bank Account for {student?.First_Name} {student?.Last_Name}
                                                </h5>
                                                <p className="text-xs">After adding a bank account you'll be able to create payments and payments schedules using this account.</p>
                                            </div>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal(false)}>
                                                <IconX />
                                            </button>
                                        </div>

                                        <div className="p-5 space-y-4">
                                            {errorMessage && (
                                                <div className="col-span-full">
                                                    <div className="relative flex items-center border p-3.5 rounded before:inline-block before:absolute before:top-1/2 ltr:before:right-0 rtl:before:left-0 rtl:before:rotate-180 before:-mt-2 before:border-r-8 before:border-t-8 before:border-b-8 before:border-t-transparent before:border-b-transparent before:border-r-inherit text-danger bg-danger-light border-danger ltr:border-r-[64px] rtl:border-l-[64px] dark:bg-danger-dark-light">
                                                        <span className="absolute ltr:-right-11 rtl:-left-11 inset-y-0 text-white w-6 h-6 m-auto">
                                                            <IconInfoCircle />
                                                        </span>
                                                        <span className="ltr:pr-2 rtl:pl-2">
                                                            <strong className="ltr:mr-1 rtl:ml-1">Something went wrong!</strong>
                                                            {errorMessage}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="ltr:ml-auto rtl:mr-auto hover:opacity-80"
                                                            onClick={() => {
                                                                setErrorMessage('');
                                                                setMisMatchError(false);
                                                            }}
                                                        >
                                                            <IconX />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <label htmlFor="bankName">Bank Name</label>
                                                <input
                                                    type="text"
                                                    id="bankName"
                                                    className="form-input"
                                                    placeholder="Enter the name of the bank"
                                                    value={bankInfo.bankName}
                                                    onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="routingNumber">Routing Number</label>
                                                <input
                                                    type="text"
                                                    id="routingNumber"
                                                    className="form-input"
                                                    value={bankInfo.routingNumber}
                                                    onChange={(e) => setBankInfo({ ...bankInfo, routingNumber: e.target.value })}
                                                />
                                            </div>
                                            <div onClick={() => setMisMatchError(false)}>
                                                <label htmlFor="bankAccountNumber">Bank Account Number</label>
                                                <input
                                                    type="text"
                                                    id="bankAccountNumber"
                                                    className={`form-input ${misMatchError ? 'border-danger' : ''}`}
                                                    value={bankInfo.bankAccountNumber}
                                                    onChange={(e) => setBankInfo({ ...bankInfo, bankAccountNumber: e.target.value })}
                                                />
                                                {misMatchError && <p className="text-danger">Account numbers do not match</p>}
                                            </div>
                                            <div onClick={() => setMisMatchError(false)}>
                                                <label htmlFor="confirmAccountNumber">Confirm Bank Account Number</label>
                                                <input
                                                    type="text"
                                                    id="confirmAccountNumber"
                                                    className={`form-input ${misMatchError ? 'border-danger' : ''}`}
                                                    value={confirmAccountNumber}
                                                    onChange={(e) => setConfirmAccountNumber(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="isCheckingAccount">Account Type</label>
                                                <select
                                                    id="isCheckingAccount"
                                                    className="form-select"
                                                    onChange={(e) => setBankInfo({ ...bankInfo, isCheckingAccount: e.target.value === 'true' ? true : false })}
                                                >
                                                    <option value="true">Checking</option>
                                                    <option value="false">Savings</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="isDefault" className="flex items-center cursor-pointer">
                                                    Make this the default payment method from now on
                                                    <input
                                                        type="checkbox"
                                                        id="isDefault"
                                                        className="form-checkbox bg-white dark:bg-[#1b2e4b] ml-2"
                                                        checked={bankInfo.isDefault}
                                                        onChange={(e) => setBankInfo({ ...bankInfo, isDefault: e.target.checked })}
                                                    />
                                                </label>
                                            </div>

                                            <div className="col-span-full">
                                                <div className="mt-8 flex items-center justify-end ">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setModal(false)}>
                                                        Discard
                                                    </button>
                                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleAddAccount}>
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    );
}
