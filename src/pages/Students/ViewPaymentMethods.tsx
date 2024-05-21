import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import mastercardIcon from '../../assets/creditcardicons/mastercard.svg';
import visaIcon from '../../assets/creditcardicons/visa.svg';
import amexIcon from '../../assets/creditcardicons/amex.svg';
import discoverIcon from '../../assets/creditcardicons/discover.svg';
import genericIcon from '../../assets/creditcardicons/generic.svg';
import { useParams } from 'react-router-dom';
import { getAllCustomerPaymentAccounts } from '../../functions/payments';
import { UserAuth } from '../../context/AuthContext';
import Tippy from '@tippyjs/react';
import IconX from '../../components/Icon/IconX';
import IconTrashLines from '../../components/Icon/IconTrashLines';

const bgcssColors: any = [
    'bg-gradient-to-r from-cyan-200 via-teal-300 to-cyan-300',
    'bg-gradient-to-r from-orange-200 via-red-300 to-orange-300',
    'bg-gradient-to-r from-pink-200 via-rose-300 to-pink-300',
    'bg-gradient-to-r from-indigo-200 via-sky-300 to-indigo-300',
];

const cardIcons: any = {
    Visa: visaIcon,
    Master: mastercardIcon,
    Amex: amexIcon,
    Discover: discoverIcon,
    Generic: genericIcon,
};
export default function ViewPaymentMethods({ payID }: any) {
    const [viewCards, setViewCards] = useState(false);
    const { suid }: any = UserAuth();

    const [defaultCard, setDefaultCard] = useState<any>('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);
    const [cards, setCards] = useState<any>([]);
    const [bankAccounts, setBankAccounts] = useState<any>([]);

    useEffect(() => {
        console.log(payID);
        getAllCustomerPaymentAccounts(payID, suid).then((response) => {
            console.log(response?.Response);
            if (response?.Response?.CreditCardAccounts?.length > 0) {
                setSelectedPaymentMethod(response?.Response?.CreditCardAccounts[0]?.Id);
                setCards(response?.Response?.CreditCardAccounts);
            } else {
                setCards(null);
            }
            if (response?.Response?.AchAccounts?.length > 0) {
                setBankAccounts(response?.Response?.AchAccounts);
            } else {
                setBankAccounts(null);
            }
        });
    }, [payID]);

    useEffect(() => {
        if (cards.length > 0) {
            const defaultCC: any = cards.find((card: any) => card.IsDefault);
            setDefaultCard(defaultCC?.Id);
        } else {
            console.log('Error getting payment info');
        }
    }, [cards]);

    return (
        <div>
            <button className="uppercase font-lg font-bold w-full hover:bg-info-light p-4 text-left flex items-center gap-4 whitespace-nowrap" onClick={() => setViewCards(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-wallet2" viewBox="0 0 16 16">
                    <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
                </svg>
                View Payment Methods
            </button>

            <Transition appear show={viewCards} as={Fragment}>
                <Dialog as="div" open={viewCards} onClose={() => setViewCards(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-5xl my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-bold text-lg">Payment Methods</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setViewCards(false)}>
                                            <IconX className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 grid-cols-1 gap-4">
                                            {cards?.map((card: any, index: number) => {
                                                // Replace asterisks with bullets
                                                const maskedCardNumber = card?.CreditCardNumber.replace(/\*/g, '•');
                                                return (
                                                    <div className='relative'>
                                                        
                                                        <div className="flex items-center w-full">
                                                            <div
                                                                key={card?.Id}
                                                                className={`relative block w-full rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-white p-4 ${
                                                                    bgcssColors[index % bgcssColors.length]
                                                                }`}
                                                            >
                                                                <img src={cardIcons[card?.Issuer] || cardIcons['Generic']} alt={card?.Issuer} className="w-12 h-auto" />
                                                                <div className="mt-4">
                                                                    <div className="flex items-center justify-between">
                                                                        <div>
                                                                            <label className="text-sm text-zinc-500">Card Number</label>
                                                                            <div className="text-lg text-zinc-950 font-semibold -mt-2">{maskedCardNumber}</div>
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-sm text-zinc-500">Expires</label>
                                                                            <div className="text-lg font-semibold text-zinc-950 -mt-2">{card?.ExpirationDate}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center justify-between mt-4">
                                                                        <div>
                                                                            <label className="text-sm text-zinc-500">Card Holder</label>
                                                                            <div className="text-xl font-bold text-zinc-950 -mt-2">{card?.AccountHolderName}</div>
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-sm text-zinc-500">Default</label>
                                                                            <label className="w-14 h-8 relative">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                                                    checked={defaultCard === card?.Id}
                                                                                    id="custom_switch_checkbox1"
                                                                                    onChange={() => setDefaultCard(card?.Id === defaultCard ? '' : card?.Id)}
                                                                                />
                                                                                <span className="outline_checkbox bg-white bg-opacity-60 block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark before:bottom-1 before:w-6 before:h-6 before:rounded-full before:bg-[url(/assets/images/default.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-white peer-checked:before:bg-cyan-500 before:transition-all before:duration-300"></span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='absolute right-0'>
                                                        <Tippy content="Remove Card" placement="top">
                                                        <button >
                                                          <IconTrashLines className='w-6 h-6 text-danger hover:text-red-800' />
                                                        </button>
                                                        </Tippy>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setViewCards(false)}>
                                                Discard
                                            </button>
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setViewCards(false)}>
                                                Save
                                            </button>
                                        </div>
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
