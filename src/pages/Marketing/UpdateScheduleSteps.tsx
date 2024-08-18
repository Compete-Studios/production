import { Dialog, Transition, Tab } from '@headlessui/react';
import Tippy from '@tippyjs/react';
import { useState, Fragment, useEffect } from 'react';
import IconNotesEdit from '../../components/Icon/IconNotesEdit';
import IconX from '../../components/Icon/IconX';
import { UserAuth } from '../../context/AuthContext';

export default function UpdateScheduleSteps({ type, steps, studioID, ppStepId, scheduleId }: any) {
    const { prospectPipelineSteps, pipelineSteps }: any = UserAuth();
    const [selectedSteps, setSelectedSteps] = useState<any>(steps);
    const [modal1, setModal1] = useState(false);

    const handleAddOrRemoveStep = (step: any) => {
        if (selectedSteps.find((s: any) => s.PipelineStepId === step.PipelineStepId)) {
            setSelectedSteps((prev: any) => prev.filter((s: any) => s.PipelineStepId !== step.PipelineStepId));
        } else {
            setSelectedSteps((prev: any) => [...prev, step]);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-center">
                <Tippy content="Update Steps">
                    <button type="button" onClick={() => setModal1(true)} className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600">
                        <span className="flex items-center">
                            <IconNotesEdit className="w-5 h-5 text-white dark:text-white/70 hover:!text-warning" />
                        </span>
                    </button>
                </Tippy>
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
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-lg text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <div className="text-lg font-bold">Update your Daily Schedule Steps</div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal1(false)}>
                                            <IconX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        {type === 'student' ? (
                                            <p>
                                                {pipelineSteps?.map((step: any) => {
                                                    return (
                                                        <div key={step.Step_Id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-2">
                                                            <div>
                                                                <div className="font-semibold">{step.StepName}</div>
                                                                <div className="text-sm line-clamp-1 max-w-96">{step.Description}</div>
                                                            </div>
                                                            <label className="inline-flex">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        step.PipelineStepId === steps.find((s: any) => s.PipelineStepId === step.PipelineStepId)?.PipelineStepId ||
                                                                        selectedSteps.find((s: any) => s.PipelineStepId === step.PipelineStepId)?.PipelineStepId
                                                                    }
                                                                    className="form-checkbox"
                                                                    onClick={() => handleAddOrRemoveStep(step)}
                                                                />
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                            </p>
                                        ) : (
                                            <p>
                                                {prospectPipelineSteps?.map((step: any) => {
                                                    return (
                                                        <div key={step.Step_Id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-2">
                                                            <div>
                                                                <div className="font-semibold">{step.StepName}</div>
                                                                <div className="text-sm line-clamp-1 max-w-96">{step.Description}</div>
                                                            </div>
                                                            <label className="inline-flex">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        step.PipelineStepId === steps.find((s: any) => s.PipelineStepId === step.PipelineStepId)?.PipelineStepId ||
                                                                        selectedSteps.find((s: any) => s.PipelineStepId === step.PipelineStepId)?.PipelineStepId
                                                                    }
                                                                    className="form-checkbox"
                                                                    onClick={() => handleAddOrRemoveStep(step)}
                                                                />
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                            </p>
                                        )}

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
    );
}
