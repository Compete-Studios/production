import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import { showMessage } from '../../functions/shared';
import { REACT_BASE_URL } from '../../constants';
import IconX from '../../components/Icon/IconX';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import IconCopy from '../../components/Icon/IconCopy';
import IconPencil from '../../components/Icon/IconPencil';

export default function ViewFormIFrame({ formList }: any) {
    const [modal2, setModal2] = useState(false);
    const [message2, setMessage2] = useState<any>('');

    useEffect(() => {
        const iFrame = `<iframe src="${REACT_BASE_URL}form/${formList.id}" width="100%" height="100%" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`;
        setMessage2(iFrame);
    }, [formList]);

    const copyToClipboard = (text: any) => {
        navigator.clipboard.writeText(text);
        showMessage('Copied successfully!');
    };

    const copyNewFromToClipboard = (id: any) => {
        const iFrame = `<iframe src="${REACT_BASE_URL}/form/${id}" width="100%" height="100%" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`;
        navigator.clipboard.writeText(iFrame);
        showMessage('Copied successfully!');
    };

    return (
        <div className="">
            <div className="flex items-center justify-center">
                <button type="button" onClick={() => setModal2(true)} className="text-primary hover:text-emerald-800 text-center flex items-center gap-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-code-slash" viewBox="0 0 16 16">
                        <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0" />
                    </svg>{' '}
                    View Code
                </button>
            </div>
            <Transition appear show={modal2} as={Fragment}>
                <Dialog as="div" open={modal2} onClose={() => setModal2(false)}>
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
                                        <div>
                                            <h5 className="font-bold text-lg">iFrame Code</h5>
                                            <p className="text-sm text-gray-500">Copy and paste the code below to embed the form in your website.</p>
                                        </div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal2(false)}>
                                            <IconX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <textarea rows={5} wrap="soft" className="form-textarea" value={message2} id="message2" onChange={(e) => setMessage2(e.target.value)}></textarea>
                                            <div className="sm:flex space-y-2 sm:space-y-0 sm:space-x-2 rtl:space-x-reverse mt-5">
                                                <CopyToClipboard
                                                    text={message2}
                                                    onCopy={(text, result) => {
                                                        if (result) {
                                                            showMessage('Copied successfully!');
                                                        }
                                                    }}
                                                >
                                                    <button type="button" className="btn btn-primary gap-1" data-clipboard-target="#message2">
                                                        <IconCopy />
                                                        Copy from Input
                                                    </button>
                                                </CopyToClipboard>
                                                <CopyToClipboard
                                                    text={message2}
                                                    onCopy={(text, result) => {
                                                        if (result) {
                                                            showMessage('Cut successfully.');
                                                        }
                                                    }}
                                                >
                                                    <button type="button" className="btn btn-dark gap-1" onClick={() => setMessage2('')}>
                                                        <IconPencil />
                                                        Cut from Input
                                                    </button>
                                                </CopyToClipboard>
                                            </div>
                                        </form>
                                        <div className="flex justify-end items-center mt-8">
                                            
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setModal2(false)}>
                                                Close
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
