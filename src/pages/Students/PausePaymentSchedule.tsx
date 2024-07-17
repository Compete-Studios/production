import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment } from 'react';
import IconX from '../../components/Icon/IconX';
import { pausePaymentSchedule, resumePaymentSchedule } from '../../functions/payments';
import { constFormateDateForPaySimple } from '../../functions/shared';

export default function PausePaymentSchedule({ id, suid, suspended, setUpdated, updated }: any) {
    const [modal2, setModal2] = useState(false);
    const [date, setDate] = useState<any>(new Date());

    const handlePause = async () => {
        const pauseData = {
            studioId: suid,
            paymentScheduleId: id,
            scheduleResumeDate: date,
        };
        const res = await pausePaymentSchedule(pauseData);
        if (res) {
            setModal2(false);
            setUpdated(!updated);
        }
    };

    const handleResume = async () => {
        const resumeData = {
            studioId: suid,
            paymentScheduleId: id,
        };
        const res = await resumePaymentSchedule(resumeData);
        if (res) {
            setModal2(false);
            setUpdated(!updated);
        }
    };

    return (
        <div>
            <div className="whitespace-nowrap">
                {suspended === 'Suspended' ? (
                    <button type="button" onClick={() => setModal2(true)} className="btn btn-secondary w-full">
                        Resume Schedule
                    </button>
                ) : (
                    <button type="button" onClick={() => setModal2(true)} className="btn btn-secondary w-full">
                        Pause Schedule
                    </button>
                )}
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
                                        <h5 className="font-bold text-lg">Pause Payment</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal2(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        {suspended === 'Suspended' ? (
                                            <p>This payment schedule is currently paused.</p>
                                        ) : (
                                            <>
                                                {' '}
                                                <p>This payment schedule can be paused until a future date.</p>
                                                <div>
                                                    <input type="date" className="form-input mt-4" value={date} onChange={(e) => setDate(e.target.value)} />
                                                </div>
                                            </>
                                        )}

                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setModal2(false)}>
                                                Discard
                                            </button>
                                            {suspended === 'Suspended' ? (
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleResume}>
                                                    Resume Payment Schedule
                                                </button>
                                            ) : (
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handlePause}>
                                                    Pause Payment Schedule
                                                </button>
                                            )}
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
