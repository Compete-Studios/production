import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import IconX from '../../components/Icon/IconX';
import { UserAuth } from '../../context/AuthContext';
import { sendEmailToClass } from '../../functions/emails';
import { showErrorMessage, showMessage } from '../../functions/shared';

export default function PreviewNewsLetter({ emailData, htmlValue, listOfNewMembers }: any) {
    const { suid }: any = UserAuth();
    const [newsModal, setNewsModal] = useState(false);
    const [listOfEmails, setListOfEmails] = useState<any>([]);

    useEffect(() => {
        const onlyEmails = listOfNewMembers.map((d: any) => d.email);
        const removeDuplicates = onlyEmails.filter((value: any, index: any) => onlyEmails.indexOf(value) === index);       
        const removeBlanks = removeDuplicates.filter((d: any) => d !== '');
        setListOfEmails(removeBlanks);
    }, [listOfNewMembers]);

    const handleSendEmail = (e: any) => {
        e.preventDefault();
        const data = {
            studioId: suid,
            level: emailData.level,
            listName: emailData.listName,
            newsLetterTitle: emailData.newsLetterTitle,
            type: emailData.type,
            listDescription: emailData.listDescription,
            listOfNewMembers: listOfEmails,
            from: emailData.from,
            subject: emailData.subject,
            html: htmlValue,
        };

        
        // const data = {
        //     studioId: suid,
        //     level: emailData.level,
        //     listName: emailData.listName,
        //     newsLetterTitle: emailData.newsLetterTitle,
        //     type: emailData.type,
        //     listDescription: emailData.listDescription,
        //     listOfNewMembers: ['bret@techbret.com', "", "hello@codetega.com", "bretljohnson0@gmail.com"],
        //     from: emailData.from,
        //     subject: emailData.subject,
        //     html: htmlValue,
        // };
       
        
        sendEmailToClass(data).then((res) => {
            console.log(res);
            if (res.status === 200) {
                showMessage('Email Sent Successfully');
                setNewsModal(false);
            } else {
                showErrorMessage('Email Failed to Send, Please Try Again');
                setNewsModal(false);
            }
        });
    };

    return (
        <div>
            <div className="flex items-center justify-center">
                <button type="button" onClick={() => setNewsModal(true)} className="btn btn-primary ml-auto">
                    Preview Email
                </button>
            </div>
            <Transition appear show={newsModal} as={Fragment}>
                <Dialog as="div" open={newsModal} onClose={() => setNewsModal(false)}>
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
                                        <h5 className="font-bold text-lg">Preview Email Content</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setNewsModal(false)}>
                                            <IconX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <h2 className="text-2xl font-semibold mb-4">{emailData.subject}</h2>
                                        <p dangerouslySetInnerHTML={{ __html: htmlValue }}></p>
                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setNewsModal(false)}>
                                                Discard
                                            </button>
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleSendEmail}>
                                                Send
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
