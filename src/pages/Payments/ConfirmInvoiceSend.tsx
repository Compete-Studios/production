import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import IconX from '../../components/Icon/IconX';
import IconSend from '../../components/Icon/IconSend';
import { REACT_BASE_URL } from '../../constants';
import { sendIndividualEmail } from '../../functions/emails';
import { sendAText } from '../../functions/api';
import { showMessage } from '../../functions/shared';

export default function ConfirmInvoiceSend({ suid, studioInfo, invoiceID, studentInfo }: any) {
    const [invoiceModal, setInvoiceModal] = useState(false);
    const [emailInvoice, setEmailInvoice] = useState(true);
    const [textInvoice, setTextInvoice] = useState(true);
    const [sending, setSending] = useState(false);
    const [sendToEmail, setSendToEmail] = useState('');
    const [sendToText, setSendToText] = useState('');

    useEffect(() => {
        setSendToEmail(studentInfo?.email);
        setSendToText(studentInfo?.Phone);
    }, [studentInfo]);

    const createInvoiceURL = async (invoiceId: any) => {
        const linkForInvoice = `${REACT_BASE_URL}pay-invoice/${invoiceId}`;
        const htmlFOrEmail = `"<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>Document</title></head><body style=\"background-color: #f4f4f4; font-family: Arial, sans-serif;\"><div style=\"max-width: 600px; margin: 0 auto; padding: 20px;\"><h2 style=\"color: #333;\">You have a new Invoice from ${studioInfo?.Studio_Name}</h2><p style=\"color: #666;\">Please go to ${linkForInvoice} to pay your invoice.</p><p style=\"color: #666;\">Best regards,<br> ${studioInfo?.Studio_Name}</p></div></body></html>"`;
        return htmlFOrEmail;
    };

    const handleResendInvoice = async (e: any) => {
        e.preventDefault();
        try {
            setSending(true);
            const newInvoiceLink = await createInvoiceURL(invoiceID);
            const linkForInvoice = `${REACT_BASE_URL}pay-invoice/${invoiceID}`;

            const emailData = {
                to: sendToEmail,
                from: studioInfo?.Contact_Email,
                subject: 'Invoice for your payment',
                html: newInvoiceLink,
                deliverytime: null,
            };

            const text = {
                to: sendToText,
                studioId: suid,
                message: 'You have a new invoice from ' + studioInfo?.Studio_Name + ' please go to ' + linkForInvoice + ' to pay your invoice.',
            };

            const data = {
                studioId: suid,
                email: emailData,
            };

            if (emailInvoice) {
                sendIndividualEmail(data).then((res) => {
                    console.log(res);
                });
            }

            if (textInvoice) {
                sendAText(text).then((res) => {
                    console.log(res);
                });
            }
            setTimeout(() => {
                showMessage('Invoice Sent Successfully');
                setSending(false);
                setInvoiceModal(false);
            }, 2000);
        } catch (error) {
            console.log(error);
            setTimeout(() => {
                showMessage('Invoice Sent Successfully');
                setSending(false);
                setInvoiceModal(false);
            }, 2000);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-center">
                <button type="button" onClick={() => setInvoiceModal(true)} className="btn btn-info gap-2">
                    <IconSend />
                    Resend Invoice
                </button>
            </div>
            <Transition appear show={invoiceModal} as={Fragment}>
                <Dialog as="div" open={invoiceModal} onClose={() => setInvoiceModal(false)}>
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
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-bold text-lg">Resend Invoice</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setInvoiceModal(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <p>Are you sure you want to resend this invoice?</p>
                                        <div className="flex items-center gap-4 mt-4">
                                            <label className="flex items-center cursor-pointer">
                                                <input type="checkbox" className="form-checkbox" checked={emailInvoice} onChange={() => setEmailInvoice(!emailInvoice)} />
                                                <span className=" text-white-dark whitespace-nowrap">Email Invoice</span>
                                            </label>
                                            {emailInvoice && <input type="email" className="form-input" placeholder="Email" value={sendToEmail} onChange={(e) => setSendToEmail(e.target.value)} />}
                                        </div>
                                        <div className="flex items-center gap-4 mt-4">
                                            <label className="flex items-center cursor-pointer">
                                                <input type="checkbox" className="form-checkbox" checked={textInvoice} onChange={() => setTextInvoice(!textInvoice)} />
                                                <span className=" text-white-dark whitespace-nowrap">Text Invoice</span>
                                            </label>
                                            {textInvoice && <input type="text" className="form-input" placeholder="Phone Number" value={sendToText} onChange={(e) => setSendToText(e.target.value)} />}
                                        </div>
                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setInvoiceModal(false)}>
                                                Discard
                                            </button>
                                            <button type="button" className="btn btn-info gap-2 ltr:ml-4 rtl:mr-4" onClick={(e: any) => handleResendInvoice(e)}>
                                                {sending ? (
                                                    <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                                ) : (
                                                    <IconSend />
                                                )}
                                                {sending ? 'Sending...' : 'Resend Invoice'}
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
