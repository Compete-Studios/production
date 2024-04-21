import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconX from '../../components/Icon/IconX';
import IconEdit from '../../components/Icon/IconEdit';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { updateProspectPipelineStep } from '../../functions/api';
import { UserAuth } from '../../context/AuthContext';
import { showErrorMessage, showMessage } from '../../functions/shared';
export default function EditProspectPipelineStep({ data }: any) {
    const { update, setUpdate } = UserAuth();
    const [showEditSteModal, setEditStepModal] = useState(false);
    const [pipelineStepId, setPipelineStepId] = useState(data.PipelineStepId);
    const [studioId, setStudioId] = useState(data.StudioId);
    const [stepName, setStepName] = useState<string>(data.StepName);
    const [description, setDescription] = useState<string>(data.Description);
    const [defaultEmailSubject, setDefaultEmailSubject] = useState<string>(data.DefaultEmailSubject);
    const [defaultEmailText, setDefaultEmailText] = useState<string>(data.DefaultEmailText);
    const [defaultSMSText, setDefaultSMSText] = useState<string>(data.DefaultSMSText);

    const handleUpdateStep = async () => {
        const updatedData = {
            pipelineStepId,
            studioId,
            stepName,
            description,
            defaultEmailSubject,
            defaultEmailText,
            defaultSMSText,
        };
        try {
            // Update the prospect pipeline step
            const response = await updateProspectPipelineStep(updatedData);
            console.log(response);
            if (response.status === 200) {
                showMessage('Prospect pipeline step updated successfully');
                setUpdate(!update);
                setEditStepModal(false);
            }
        } catch (error) {
            showErrorMessage('Error updating the prospect pipeline step');
        }
    };

    return (
        <div>
            <Tippy content="Edit Step">
                <button type="button" onClick={() => setEditStepModal(true)}>
                    <IconEdit className="w-5 h-5 text-success hover:text-green-800" />
                </button>
            </Tippy>

            <Transition appear show={showEditSteModal} as={Fragment}>
                <Dialog as="div" open={showEditSteModal} onClose={() => setEditStepModal(false)} className="relative z-[51]">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-start justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-5xl text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setEditStepModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        Edit Prospect Step <span className="text-primary font-bold">{data.StepName}</span>
                                    </div>
                                    <div className="p-5">
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="pipelineStepName">Pipeline Step Name</label>
                                                <input
                                                    type="text"
                                                    id="pipelineStepName"
                                                    name="pipelineStepName"
                                                    className="form-input"
                                                    value={stepName}
                                                    onChange={(e) => setStepName(e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="notes">Notes</label>
                                                <textarea id="notes" name="notes" rows={3} className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="smsDefaultText">SMS Default Text</label>
                                                <textarea
                                                    id="smsDefaultText"
                                                    name="smsDefaultText"
                                                    className="form-input"
                                                    rows={3}
                                                    value={defaultSMSText}
                                                    onChange={(e) => setDefaultSMSText(e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="pipelineStepName">Email Default Subject</label>
                                                <input
                                                    type="text"
                                                    id="emailSubject"
                                                    name="emailSubject"
                                                    className="form-input"
                                                    value={defaultEmailSubject}
                                                    onChange={(e) => setDefaultEmailSubject(e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-4 w-full ">
                                                <label htmlFor="emailDefaultText">Email Default Text</label>
                                                <div className="">
                                                    <ReactQuill theme="snow" value={defaultEmailText} onChange={setDefaultEmailText} />
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <button className="btn btn-primary ml-auto" onClick={handleUpdateStep}>
                                                    Update
                                                </button>
                                            </div>
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
