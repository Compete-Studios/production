import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';
import IconSquareRotated from '../../../components/Icon/IconSquareRotated';
import IconX from '../../../components/Icon/IconX';
import { UserAuth } from '../../../context/AuthContext';
import IconMenuDragAndDrop from '../../../components/Icon/Menu/IconMenuDragAndDrop';
import { updateLatePaymentSteps, updateProspectPipelineSteps, updateStudentPipelineSteps } from '../../../functions/manuals';

export default function ReorderSteps({ type }: any) {
    const { pipelineSteps, prospectPipelineSteps, latePayementPipeline, setUpdate, update }: any = UserAuth();
    const [modal1, setModal1] = useState(false);
    const [steps, setSteps] = useState<any>([]);

    useEffect(() => {
        if (pipelineSteps && type === 1) {
            setSteps(pipelineSteps);
        } else if (prospectPipelineSteps && type === 2) {
            setSteps(prospectPipelineSteps);
        } else if (latePayementPipeline && type === 3) {
            setSteps(latePayementPipeline);
        } else {
            setSteps([]);
        }
    }, [pipelineSteps, prospectPipelineSteps, latePayementPipeline, type]);

    const handleSortUpdate = (newSteps: any) => {
        // Update PlacementOrdinal to match index + 1
        const updatedSteps = newSteps.map((step: any, index: number) => ({
            ...step,
            PlacementOrdinal: index + 1, // You can adjust this if you want to start from 0
        }));
        setSteps(updatedSteps);
    };

    const saveSteps = async (e: any) => {
        e.preventDefault();
        if (type === 1) {
            const res = await updateStudentPipelineSteps(steps);
            if (res.status === 200) {
                setUpdate(!update);
                setModal1(false);
            } else {
                console.error('Failed to update steps');
            }
        } else if (type === 2) {
            const res = await updateProspectPipelineSteps(steps);
            if (res.status === 200) {
                setUpdate(!update);
                setModal1(false);
            } else {
                console.error('Failed to update steps');
            }
        } else if (type === 3) {
            const res = await updateLatePaymentSteps(steps);
            if (res.status === 200) {
                setUpdate(!update);
                setModal1(false);
            } else {
                console.error('Failed to update steps');
            }
        } else {
            console.error('Invalid type');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-center">
                <button type="button" className="btn btn-info gap-2 " onClick={() => setModal1(true)}>
                    <IconSquareRotated /> Re-order Pipeline Steps
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
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-lg text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <div className="text-lg font-bold">Reorder Steps</div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal1(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <ReactSortable list={steps} setList={handleSortUpdate}>
                                            {steps?.map((data: any) => (
                                                <div key={data.PlacementOrdinal} className="w-full border rounded-md p-1 mb-1 flex items-center gap-1">
                                                    <IconMenuDragAndDrop className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                                    <div className="whitespace-nowrap cursor-pointer focus:cursor-grab">{data.StepName || data.PipelineStepName}</div>
                                                </div>
                                            ))}
                                        </ReactSortable>
                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setModal1(false)}>
                                                Discard
                                            </button>
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveSteps}>
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
