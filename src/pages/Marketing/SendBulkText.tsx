import IconChatDot from '../../components/Icon/IconChatDot';
import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment } from 'react';

export default function SendBulkText() {
    const [openBulk, setOpenBulk] = useState(false);
    return (
        <div>
            {' '}
            <div className="mb-5">
                <div className="flex items-center justify-center">
                    <button type="button" className="text-info hover:text-blue-800" onClick={() => setOpenBulk(true)}>
                        <IconChatDot />
                    </button>
                </div>
                <Transition appear show={openBulk} as={Fragment}>
                    <Dialog as="div" open={openBulk} onClose={() => setOpenBulk(false)}>
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
                                            <h5 className="font-bold text-lg">Modal Title</h5>
                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setOpenBulk(false)}>
                                                <svg>...</svg>
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <p>
                                                Mauris mi tellus, pharetra vel mattis sed, tempus ultrices eros. Phasellus egestas sit amet velit sed luctus. Orci varius natoque penatibus et magnis
                                                dis parturient montes, nascetur ridiculus mus. Suspendisse potenti. Vivamus ultrices sed urna ac pulvinar. Ut sit amet ullamcorper mi.
                                            </p>
                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setOpenBulk(false)}>
                                                    Discard
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setOpenBulk(false)}>
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
        </div>
    );
}
