import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';
import Tippy from '@tippyjs/react';
import IconEye from '../Icon/IconEye';
import BillingInfoUpdate from '../../pages/Students/components/BillingInfoUpdate';
import IconPencilPaper from '../Icon/IconPencilPaper';
import {UserAuth} from '../../context/AuthContext';
import { getCustomerInfo } from '../../functions/payments.js';

export default function ViewCustomer({ customerId }: any) {
    const { suid }: any = UserAuth();
    const [open, setOpen] = useState(false);
    const [updateBilling, setUpdateBilling] = useState<boolean>(false);
    const [billingLoading, setBillingLoading] = useState<boolean>(true);
    const [billingInfo, setBillingInfo] = useState<any>({});
    
    const handleUpdateBilling = (e: any) => {
        e.preventDefault();
        setUpdateBilling(!updateBilling);
    };

    const handleGoToPaymentSchedules = () => {
        setOpen(false);
        //window.location.href = `/students/${customerId}/payment-schedules`;
    };

    const handleGoToPayments = () => {
        setOpen(false);
        //window.location.href = `/students/${customerId}/payments`;
    };



    const getBillingInfo = async (customerId: any) => {
        try {
            if (customerId) {
                //const customerInfo = await getCustomerInfo(customerId, suid);
                const customerInfo = await getCustomerInfo(customerId, suid);
                console.timeLog('customerIdResponse', customerInfo);
                if (customerInfo?.Response) {
                    setBillingInfo(customerInfo?.Response);
                    console.log('BILLING INFO', customerInfo?.Response);
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
        getBillingInfo(customerId);
    }, [customerId]);


    return (
        <>
            <Tippy content="View Customer">
                <button className="text-info hover:text-blue-700" onClick={() => setOpen(true)}>
                    <IconEye />
                </button>
            </Tippy>
            <Transition.Root show={open} as={Fragment}>
                <Dialog className="relative z-50" onClose={setOpen}>
                    <div className="fixed inset-0" />
                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                                        <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                            <div className="px-4 sm:px-6">
                                                <div className="flex items-start justify-between">
                                                    <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                                        Customer Information
                                                    </Dialog.Title>
                                                    <div className="ml-3 flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                                            onClick={() => setOpen(false)}
                                                        >
                                                            <span className="absolute -inset-2.5" />
                                                            <span className="sr-only">Close panel</span>
                                                            <IconX className="h-6 w-6" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between p-5">
                                                    {updateBilling ? (
                                                        <Tippy content="Update Billing Info">
                                                            <button className="ltr:ml-auto rtl:mr-auto text-danger hover:text-red-700 p-2 " onClick={(e: any) => handleUpdateBilling(e)}>
                                                                Update
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

                                                {/* Content Wrapper */}
                                                <div className="flex justify-center items-center mt-6">
                                                    {billingLoading ? (
                                                        <div className="flex items-center justify-center h-56">
                                                            <span className="animate-spin border-4 border-primary border-l-transparent rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full">
                                                            {!billingInfo || Object.keys(billingInfo).length === 0 ? (
                                                                <div className="flex items-center justify-center h-56">
                                                                    <div className="text-center">
                                                                        <div className="text-center text-gray-400">
                                                                            No billing information found
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex justify-center items-center">
                                                                            <BillingInfoUpdate
                                                                                billingInfo={billingInfo}
                                                                                updateBilling={updateBilling} 
                                                                                setUpdateBilling={setUpdateBilling}
                                                                            />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );

}
