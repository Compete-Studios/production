import { Dialog, Transition, Tab } from '@headlessui/react';
import { useState, Fragment } from 'react';
import IconInfoCircle from '../components/Icon/IconInfoCircle';
import IconX from '../components/Icon/IconX';

export default function AddTaskGuidline() {
    const [modal1, setModal1] = useState(false);
    return (
        <div className="mb-5">
            <div className="flex items-center justify-center">
                <button type="button" className="btn btn-info gap-1" onClick={() => setModal1(true)}>
                    <IconInfoCircle />
                    Add Task Guidline
                </button>
            </div>
            <Transition appear show={modal1} as={Fragment}>
                <Dialog as="div" open={modal1} onClose={() => setModal1(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-3xl text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <div className="text-lg font-bold">Adding a Task Guidline</div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal1(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <h2 className="text-lg font-bold">Tagging Tasks</h2>
                                        <p>
                                            When adding a task, you can tag it with a specific <span className="font-bold">category</span> and <span className="font-bold">type</span>. This will help
                                            us to filter tasks based on their category. You can also add multiple tags to a single task.
                                        </p>
                                        <div className="flex items-start justify-center gap-24">
                                            <div>
                                                <h3 className="text-lg font-bold mt-5">Categories</h3>
                                                <ul className="list-disc pl-5">
                                                    <li>Dashboard</li>
                                                    <li>Students</li>
                                                    <li>Marketing</li>
                                                    <li>Classes</li>
                                                    <li>Payments</li>
                                                    <li>Staff</li>
                                                    <li>Reports</li>
                                                    <li>Tools</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold mt-5">Types</h3>
                                                <ul className="pr-5 space-y-3">
                                                    <li className="btn px-2 py-1 flex btn-outline-secondary">Important</li>
                                                    <li className="btn px-2 py-1 flex btn-outline-danger">Bug</li>
                                                    <li className="btn px-2 py-1 flex btn-outline-warning">UI</li>
                                                    <li className="btn px-2 py-1 flex btn-outline-info">Feature</li>
                                                    <li className="btn px-2 py-1 flex btn-danger">Critical</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <h2 className="text-lg font-bold">Task Descriptions</h2>
                                        <p>
                                            When adding a task, you can provide a detailed description of the task. This will help the developer to understand the task better and work on it more
                                            efficiently.
                                        </p>
                                        <h5 className="font-semibold mt-5">Depending on what you are adding there are phrases that can help us better understand the task.</h5>
                                        <div className="p-5 space-y-5">
                                            <div>
                                                If its something that needs to be added example:
                                                <span className="font-bold block">As a user, I want to be able to add a new student to the system.</span>
                                            </div>
                                            <div>
                                                If its something that needs to be fixed example:
                                                <span className="font-bold block">As a user, I should be able to see the list of students in the system.</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-end items-center mt-8">
                                            
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setModal1(false)}>
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
