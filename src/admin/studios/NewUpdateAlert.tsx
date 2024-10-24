import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { updateUserNew } from '../../firebase/firebaseFunctions';

export default function NewUpdateAlert() {
    const { user, currentUsername }: any = UserAuth();
    const [modal2, setModal2] = useState(false);

    useEffect(() => {
        if (user?.newUpdate) {
            setModal2(true);
        }
    }, [user]);

    const handleUpdateUser = async () => {
        if (currentUsername) {
            await updateUserNew(currentUsername);
            setModal2(false);
            window.location.reload();
        } else {
            console.log('No Current Username');
            setModal2(false);
        }
    };

    return (
        <div>
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
                                    <div className="bg-[#fbfbfb] dark:bg-[#121c2c] px-5 py-3">
                                        <h5 className="font-bold text-xl text-center">💃🥳🎉We've Made Some Updates!🎉🥳🕺</h5>
                                    </div>
                                    <div className="p-5">
                                        <p>You may notice some changes since the last time you logged in. We've made some updates to improve your experience.</p>
                                        <div className="mt-5 ">
                                            <h6 className="font-bold text-info">✨What's New?</h6>
                                            <ul className="list-disc list-inside mt-2">
                                                <li>Calander Events</li>
                                                <li>Attendance Tracker</li>
                                                <li>Student Profile Pictures</li>
                                                <li>Text and Email all your students at once</li>
                                                <li>Payment Dashboard</li>
                                                <li>Website Code Visit</li>
                                                <li>More customization options</li>
                                            </ul>
                                        </div>
                                        <div className="mt-5">
                                            <h6 className="font-bold text-warning">🪲What we fixed?</h6>
                                            <ul className="list-disc list-inside mt-2">
                                                <li>ACH Payment Views</li>
                                                <li>Class Roster now loads Students and Prospects</li>
                                                <li>Search for Active and Inactive Students within a Program</li>
                                                <li>Contact Forms Stats</li>
                                                <li>More customization options</li>
                                            </ul>
                                        </div>

                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-info w-full btn-lg" onClick={handleUpdateUser}>
                                                Go to Dashboard
                                            </button>
                                            {/* <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4 w-full" onClick={() => setModal2(false)}>
                                                Take the Tour
                                            </button> */}
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
