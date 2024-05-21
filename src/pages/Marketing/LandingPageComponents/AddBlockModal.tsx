import { Dialog, Transition, Tab } from '@headlessui/react';
import { useState, Fragment } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import IconPlus from '../../../components/Icon/IconPlus';
import IconX from '../../../components/Icon/IconX';

export default function AddBlockModal({ addComponent, removeComponent }: any) {
    const [modal1, setModal1] = useState(false);

    return (
        <>
            <div className="flex items-center justify-center">
                <Tippy content="Add a new block" placement="top">
                    <button type="button" className="btn btn-info hover:bg-blue-800 w-10 h-10 p-0 rounded-full" onClick={() => setModal1(true)}>
                        <IconPlus className="h-5 w-5 " aria-hidden="true" />
                    </button>
                </Tippy>
            </div>
            <div className="mb-5">
                <Transition appear show={modal1} as={Fragment}>
                    <Dialog as="div" open={modal1} onClose={() => setModal1(false)}>
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
                                    <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-lg text-black dark:text-white-dark">
                                        <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                            <div className="text-lg font-bold">Select Block</div>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal1(false)}>
                                                <IconX className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                        </div>
                                        <div className="p-5 grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    addComponent(0);
                                                    setModal1(false);
                                                }}
                                            >
                                                Headline
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    addComponent(1);
                                                    setModal1(false);
                                                }}
                                            >
                                                Sub Headline
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    addComponent(2);
                                                    setModal1(false);
                                                }}
                                            >
                                                Form
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    addComponent(3);
                                                    setModal1(false);
                                                }}
                                            >
                                                Image
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    addComponent(4);
                                                    setModal1(false);
                                                }}
                                            >
                                                Features
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    addComponent(5);
                                                    setModal1(false);
                                                }}
                                            >
                                                Testimonials
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    addComponent(6);
                                                    setModal1(false);
                                                }}
                                            >
                                                Countdown
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    addComponent(7);
                                                    setModal1(false);
                                                }}
                                            >
                                                Button
                                            </button>
                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setModal1(false)}>
                                                    Discard
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setModal1(false)}>
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
        </>
    );
}
