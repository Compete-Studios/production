import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import 'swiper/css';
import { setPageTitle } from '../../store/themeConfigSlice';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import IconX from '../../components/Icon/IconX';
import { addCreditCardToCustomer } from '../../functions/payments';
import IconInfoCircle from '../../components/Icon/IconInfoCircle';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { UserAuth } from '../../context/AuthContext';

interface CreditCard {
    ccNumber: string;
    customerId: number;
    expDate: string;
    billingZip: string;
    isDefault: boolean;
    studioId?: number;
}

export default function AddCardModal({ student, paySimpleID, cards, update, setUpdate, inStudent = false }: any) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Add Bank Card'));
    });
    const { suid }: any = UserAuth();
    const [modal, setModal] = useState<boolean>(false);
    const [month, setMonth] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [creditCardData, setCreditCardData] = useState<CreditCard>({
        ccNumber: '',
        customerId: paySimpleID,
        expDate: '',
        billingZip: '',
        isDefault: true,
        studioId: suid,
    });

    console.log('paySimpleID', paySimpleID);

    const convertToMMYYYY = (month: string, year: string) => {
        return `${month}/${year}`;
    };

    const handleCardChange = (event: any) => {
        const { value } = event.target;

        // Remove all non-digit characters
        const digitsOnly = value.replace(/\D/g, '');

        // Limit the number of digits to 16
        const limitedDigits = digitsOnly.slice(0, 16);

        // Add a space after every four digits
        const formattedValue = limitedDigits.replace(/(\d{4})(?=\d)/g, '$1 ');

        // Remove spaces from the formatted value
        const cardNumber = formattedValue.replace(/\s/g, '');

        if (cardNumber.length > 0) {
            setCreditCardData({ ...creditCardData, ccNumber: cardNumber });
        } else {
            setCreditCardData({ ...creditCardData, ccNumber: '' });
        }

        // Update the input value
        event.target.value = formattedValue;
    };

    useEffect(() => {
        setCreditCardData({
            ...creditCardData,
            customerId: paySimpleID,
            expDate: convertToMMYYYY(month, year),
        });
    }, [month, year]);

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

    const handleAddCreditCard = async () => {
        console.log(creditCardData)
        try {
            const response = await addCreditCardToCustomer(creditCardData);
            console.log(response)
            if (response.status === 200) {
                setCreditCardData({
                    ccNumber: '',
                    customerId: 0,
                    expDate: '',
                    billingZip: '',
                    isDefault: false,
                });
                showMessage('Bank Card Added Successfully!', 'success');
                setUpdate(!update);
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
                    <Tippy content="Add Credit Card">
                        <button className="uppercase font-lg font-bold w-full hover:bg-dark-light p-4 text-left flex items-center gap-4 whitespace-nowrap" onClick={() => setModal(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-credit-card-2-front" viewBox="0 0 16 16">
                                <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
                                <path d="M2 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5" />
                            </svg>
                            Add Credit Card
                        </button>
                    </Tippy>
                ) : cards?.length === 0 || !cards ? (
                    <button
                        type="button"
                        className="relative block w-full rounded-lg  p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 bg-gradient-to-r from-secondary via-purple-700 to-secondary hover:from-purple-900 hover:via-purple-900 hover:to-purple-900"
                        onClick={() => setModal(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-white" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
                            <path d="M2 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5" />
                        </svg>
                        <span className="mt-2 block text-sm font-semibold text-white">Add a Bank Card</span>
                    </button>
                ) : (
                    <div className="grid  sm:grid-cols-4 gap-x-4 w-full">
                        {cards?.map((card: any) => (
                            <div
                                key={card?.Id}
                                className="relative block w-full rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gradient-to-r from-primary via-emerald-500 to-primary  text-white"
                            >
                                <div className="">
                                    <div className="flex items-center justify-center">
                                        <div className="text-lg font-medium">{card?.Issuer}</div>
                                        <div className="ltr:ml-2 rtl:mr-2">{card?.CreditCardNumber}</div>
                                    </div>
                                    <div className="text-sm text-gray-50">{card?.ExpirationDate}</div>
                                </div>
                            </div>
                        ))}
                        <div className={`sm:col-span-${cards?.length == 1 ? 3 : 2 ? 2 : 3 ? 1 : 4}`}>
                            <button
                                type="button"
                                className="relative block w-full rounded-lg  p-10 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 bg-gradient-to-r from-secondary via-purple-700 to-secondary hover:from-purple-900 hover:via-purple-900 hover:to-purple-900"
                                onClick={() => setModal(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-white" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
                                    <path d="M2 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5" />
                                </svg>
                                <span className="mt-2 block text-sm font-semibold text-white">Add a New Bank Card</span>
                            </button>
                        </div>
                    </div>
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
                                                    Add Bank Card for {student?.First_Name} {student?.Last_Name}
                                                </h5>
                                                <p className="text-xs">After adding a bank account you'll be able to create payments and payments schedules using this account.</p>
                                            </div>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal(false)}>
                                                <IconX />
                                            </button>
                                        </div>

                                        <div className="p-5 grid grid-cols-6 gap-4">
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
                                                        <button type="button" className="ltr:ml-auto rtl:mr-auto hover:opacity-80" onClick={() => setErrorMessage('')}>
                                                            <IconX />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="col-span-6">
                                                <label htmlFor="ccNumber">Card Number</label>
                                                <input type="text" id="ccNumber" className="form-input" placeholder="Enter Card Number" onChange={handleCardChange} />
                                            </div>
                                            <div className="col-span-2">
                                                <label htmlFor="expMonth">Expiration Month</label>
                                                <select id="expMonth" className="form-select" onChange={(e) => setMonth(e.target.value)}>
                                                    <option value="">Select Month</option>
                                                    <option value="01">01</option>
                                                    <option value="02">02</option>
                                                    <option value="03">03</option>
                                                    <option value="04">04</option>
                                                    <option value="05">05</option>
                                                    <option value="06">06</option>
                                                    <option value="07">07</option>
                                                    <option value="08">08</option>
                                                    <option value="09">09</option>
                                                    <option value="10">10</option>
                                                    <option value="11">11</option>
                                                    <option value="12">12</option>
                                                </select>
                                            </div>
                                            <div className="col-span-2">
                                                <label htmlFor="expYear">Expiration Year</label>
                                                <select id="expYear" className="form-select" onChange={(e) => setYear(e.target.value)}>
                                                    <option value="">Select Year</option>
                                                    <option value="2024">2024</option>
                                                    <option value="2025">2025</option>
                                                    <option value="2026">2026</option>
                                                    <option value="2027">2027</option>
                                                    <option value="2028">2028</option>
                                                    <option value="2029">2029</option>
                                                    <option value="2030">2030</option>
                                                    <option value="2031">2031</option>
                                                    <option value="2032">2032</option>
                                                    <option value="2033">2033</option>
                                                    <option value="2034">2034</option>
                                                    <option value="2035">2035</option>
                                                    <option value="2036">2036</option>
                                                    <option value="2037">2037</option>
                                                    <option value="2038">2038</option>
                                                </select>
                                            </div>
                                            <div className="col-span-2">
                                                <label htmlFor="zip">Billing Zip</label>
                                                <input
                                                    type="text"
                                                    id="zip"
                                                    className="form-input"
                                                    placeholder="Billing Zip"
                                                    onChange={(e) => setCreditCardData({ ...creditCardData, billingZip: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-span-full">
                                                <div className="flex">
                                                    <input
                                                        type="checkbox"
                                                        id="isDefault"
                                                        className="form-checkbox bg-white dark:bg-[#1b2e4b] mr-2"
                                                        checked={creditCardData.isDefault}
                                                        onChange={(e) => setCreditCardData({ ...creditCardData, isDefault: e.target.checked })}
                                                    />
                                                    <label htmlFor="isDefault" className="flex items-center cursor-pointer">
                                                        Make this the default payment method from now on
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-span-full">
                                                <div className="mt-8 flex items-center justify-end ">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setModal(false)}>
                                                        Discard
                                                    </button>
                                                    <button type="button" className="btn btn-success ltr:ml-4 rtl:mr-4" onClick={handleAddCreditCard}>
                                                        Add bank Card
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
