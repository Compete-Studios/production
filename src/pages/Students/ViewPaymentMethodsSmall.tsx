import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import mastercardIcon from '../../assets/creditcardicons/mastercard.svg';
import visaIcon from '../../assets/creditcardicons/visa.svg';
import amexIcon from '../../assets/creditcardicons/amex.svg';
import discoverIcon from '../../assets/creditcardicons/discover.svg';
import genericIcon from '../../assets/creditcardicons/generic.svg';
import { getAllCustomerPaymentAccounts, updateCreditCard } from '../../functions/payments';
import { UserAuth } from '../../context/AuthContext';
import Tippy from '@tippyjs/react';
import IconX from '../../components/Icon/IconX';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { showMessage, showErrorMessage } from '../../functions/shared';

import IconCreditCard from '../../components/Icon/IconCreditCard';

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

export default function ViewPaymentMethodsSmall({ payID }: any) {
    const [open, setOpen] = useState(false);
    const [viewCards, setViewCards] = useState(false);
    const { suid }: any = UserAuth();
    const [defaultCard, setDefaultCard] = useState<any>('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);
    const [cards, setCards] = useState<any>([]);
    const [bankAccounts, setBankAccounts] = useState<any>([]);
    const [editedExpirationDates, setEditedExpirationDates] = useState<{ [key: string]: string }>({});
    const [editingExpirationCardId, setEditingExpirationCardId] = useState<string | null>(null); // State to track editing status

    useEffect(() => {
        console.log(payID);
        getAllCustomerPaymentAccounts(payID, suid).then((response) => {
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
        if (cards?.length > 0) {
            const defaultCC: any = cards.find((card: any) => card.IsDefault);
            setDefaultCard(defaultCC?.Id);
        } else {
            console.log('Error getting payment info');
        }
    }, [cards]);

    // Handle input change for the expiration date
    const handleExpirationDateChange = (cardId: string, value: string) => {
        setEditedExpirationDates((prev) => ({
            ...prev,
            [cardId]: value,
        }));
    };

    const handleExpirationDateEdit = (cardId: string) => {
        setEditingExpirationCardId(cardId);
    };

    const handleExpirationDateBlur = () => {
        // Exit editing mode when the input loses focus
        setEditingExpirationCardId(null);
    };

    const handleSave = async (card: any) => {
        console.log('BEGIN SAVE', card);

        // Default the expiration date and check if it has changed
        let expDate = card.ExpirationDate;
        const hasExpirationDateChanged = editedExpirationDates[card?.Id] !== undefined && editedExpirationDates[card?.Id] !== card.ExpirationDate;

        if (hasExpirationDateChanged) {
            expDate = editedExpirationDates[card?.Id];
        }

        // Check if the default status has changed
        const hasDefaultStatusChanged = card.Id !== defaultCard && defaultCard !== '';

        console.log('hasExpirationDateChanged', hasExpirationDateChanged, 'hasDefaultStatusChanged', hasDefaultStatusChanged);

        // Run the save logic only if expiration date or default status has changed
        if (hasExpirationDateChanged || hasDefaultStatusChanged) {
            console.log('UPDATING CARD', card);

            const cardData = {
                studioId: suid,
                customerId: card.CustomerId,
                creditCardId: card.Id,
                ccNumber: card.CreditCardNumber,
                expDate: expDate,
                isDefault: card.Id === defaultCard,
                billingZip: card.BillingZip?.toString(),
            };

            try {
                const response = await updateCreditCard(cardData);
                if (response.Status === 200) {
                    showMessage('Payment Method Updated', 'success');
                } else {
                    showErrorMessage('Error updating payment method');
                }
            } catch (error) {
                showErrorMessage('Error updating payment method');
            }
        }
        setViewCards(false);
    };


    return (
        <div>
            <Tippy content="View Payment Methods">
                <button className="text-info hover:text-green-700" onClick={() => setOpen(true)}>
                    <IconCreditCard />
                </button>
            </Tippy>
            <Transition.Root show={open} as={Fragment}>
                <Dialog className="relative z-50" onClose={setOpen}>
                    <div className="fixed inset-0" />
                    <div className="fixed inset-0 overflow-hidden">
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
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl bg-white shadow-xl">
                                    {/* Ensure full opacity by adding `bg-white` to the entire panel */}
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-bold text-lg">Payment Methods</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setOpen(false)}>
                                            <IconX className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <div className="p-5 bg-white">
                                        {/* Conditional rendering for payment methods */}
                                        {cards && cards.length > 0 ? (
                                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 grid-cols-1 gap-4">
                                                {cards.map((card: any, index: number) => {
                                                    const maskedCardNumber = card?.CreditCardNumber.replace(/\*/g, '•');
                                                    return (
                                                        <div className="relative" key={card?.Id}>
                                                            <div className="flex items-center w-full">
                                                                <div
                                                                    className={`relative block w-full rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-white p-4 ${bgcssColors[index % bgcssColors.length]
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
                                                                                {editingExpirationCardId === card?.Id ? (
                                                                                    <input
                                                                                        type="text"
                                                                                        className="text-lg font-semibold text-zinc-950 -mt-2 bg-white border border-gray-300 rounded p-1"
                                                                                        value={editedExpirationDates[card?.Id] || card?.ExpirationDate}
                                                                                        onChange={(e) => handleExpirationDateChange(card?.Id, e.target.value)}
                                                                                        onBlur={() => handleExpirationDateBlur()}
                                                                                        autoFocus
                                                                                    />
                                                                                ) : (
                                                                                    <div
                                                                                        className="text-lg font-semibold text-zinc-950 -mt-2 cursor-pointer"
                                                                                        onClick={() => handleExpirationDateEdit(card?.Id)}
                                                                                    >
                                                                                        {card?.ExpirationDate}
                                                                                    </div>
                                                                                )}
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
                                                                    <button>
                                                                        <IconTrashLines className='w-6 h-6 text-danger hover:text-red-800' />
                                                                    </button>
                                                                </Tippy>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            // Display message when no payment methods found
                                            <div className="text-center text-gray-500">
                                                No Payment Methods Found.
                                            </div>
                                        )}
                                        {/* Display Save and Discard buttons if there are payment methods */}
                                        {cards && cards.length > 0 && (
                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setOpen(false)}>
                                                    Discard
                                                </button>
                                                {cards.map((card: any) => (
                                                    <button
                                                        key={card?.Id}
                                                        type="button"
                                                        className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                        onClick={() => handleSave(card)}
                                                    >
                                                        Save
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );

}
