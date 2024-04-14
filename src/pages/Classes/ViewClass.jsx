import { Dialog, Transition, Tab } from '@headlessui/react';
import { useState, Fragment } from 'react';
import IconX from '../../components/Icon/IconX';
import IconEye from '../../components/Icon/IconEye';

export default function ViewClass() {
    const [modal18, setModal18] = useState(false);
    return (
        <div>
            <button onClick={() => setModal18(true)} type="button" className="flex hover:text-primary">
                <IconEye />
            </button>
            <Transition appear show={modal18} as={Fragment}>
                <Dialog as="div" open={modal18} onClose={() => setModal18(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div id="tabs_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
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
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-bold text-lg">Tabs</h5>
                                        <button onClick={() => setModal18(false)} type="button" className="text-white-dark hover:text-dark">
                                            <IconX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <Tab.Group>
                                            <Tab.List className="flex flex-wrap mt-3 border-b border-white-light dark:border-[#191e3a]">
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            type="button"
                                                            className={`${
                                                                selected ? '!border-white-light !border-b-white  text-primary dark:!border-[#191e3a] dark:!border-b-black !outline-none ' : ''
                                                            } p-3.5 py-2 -mb-[1px] block border border-transparent hover:text-primary dark:hover:border-b-black`}
                                                        >
                                                            Class Info
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            type="button"
                                                            className={`${
                                                                selected ? '!border-white-light !border-b-white  text-primary dark:!border-[#191e3a] dark:!border-b-black !outline-none ' : ''
                                                            } p-3.5 py-2 -mb-[1px] block border border-transparent hover:text-primary dark:hover:border-b-black`}
                                                        >
                                                            Staff
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            type="button"
                                                            className={`${
                                                                selected ? '!border-white-light !border-b-white  text-primary dark:!border-[#191e3a] dark:!border-b-black !outline-none ' : ''
                                                            } p-3.5 py-2 -mb-[1px] block border border-transparent hover:text-primary dark:hover:border-b-black`}
                                                        >
                                                            Schedule
                                                        </button>
                                                    )}
                                                </Tab>
                                                <Tab as={Fragment}>
                                                    {({ selected }) => (
                                                        <button
                                                            type="button"
                                                            className={`${
                                                                selected ? '!border-white-light !border-b-white  text-primary dark:!border-[#191e3a] dark:!border-b-black !outline-none ' : ''
                                                            } p-3.5 py-2 -mb-[1px] block border border-transparent hover:text-primary dark:hover:border-b-black`}
                                                        >
                                                            Roster
                                                        </button>
                                                    )}
                                                </Tab>
                                            </Tab.List>
                                            <Tab.Panels>
                                                <Tab.Panel>
                                                    <div className="active pt-5">
                                                        <h4 className="font-semibold text-2xl mb-4">We move your world!</h4>
                                                        <p className="mb-4">
                                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                            minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                                        </p>
                                                        <p>
                                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                            minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                                        </p>
                                                    </div>
                                                </Tab.Panel>
                                                <Tab.Panel>
                                                    <div>
                                                        <div className="flex items-start pt-5">
                                                            <div className="w-20 h-20 ltr:mr-4 rtl:ml-4 flex-none">
                                                                <img
                                                                    src="/assets/images/profile-34.jpeg"
                                                                    alt="img"
                                                                    className="w-20 h-20 m-0 rounded-full ring-2 ring-[#ebedf2] dark:ring-white-dark object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-auto">
                                                                <h5 className="text-xl font-medium mb-4">Media heading</h5>
                                                                <p className="text-white-dark">
                                                                    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate
                                                                    at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tab.Panel>
                                                <Tab.Panel>
                                                    <div className="pt-5">
                                                        <p>
                                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                            minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                                                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                                            deserunt mollit anim id est laborum.
                                                        </p>
                                                    </div>
                                                </Tab.Panel>
                                                <Tab.Panel>Roster</Tab.Panel>
                                            </Tab.Panels>
                                        </Tab.Group>
                                        <div className="flex justify-end items-center mt-8">
                                            <button onClick={() => setModal18(false)} type="button" className="btn btn-outline-danger">
                                                Discard
                                            </button>
                                            <button onClick={() => setModal18(false)} type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4">
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
