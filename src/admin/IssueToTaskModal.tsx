import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import Select from 'react-select';
import IconX from '../components/Icon/IconX';
import { showMessage } from '../functions/shared';
import { updateReport, updateSprint } from '../firebase/firebaseFunctions';

const options = [
    { value: 'Assign', label: 'Select' },
    { value: 'Bret', label: 'Bret' },
    { value: 'Evan', label: 'Evan' },
    { value: 'Mago', label: 'Mago' },
];

export default function IssueToTaskModal({ docData, cards, setIssues }: any) {
    const [modal2, setModal2] = useState(false);

    const [assignedToOption, setAssignedToOption] = useState<any>(options[0]);

    const handleUpdateSprintCards = (list: any) => {
        updateSprint('1', list);
    };

    const convertFBNanoandSecToDate = (timestamp: any) => {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString();
    };

    const [paramsTask, setParamsTask] = useState<any>({
        projectId: null,
        id: null,
        title: '',
        description: '',
        tags: 'Reported Issue',
        date: '',
        assignedTo: assignedToOption.label,
        ticketNumber: docData?.id,
    });

    useEffect(() => {
        if (docData.id) {
            const previousNotes =
                'Reported Issue: ' +
                docData.issue +
                '\n' +
                '\n' +
                'Path Reported From: ' +
                docData.path +
                '\n' +
                '\n' +
                'Reported: ' +
                docData.studioName +
                ` (${docData.studioId})` +
                '\n' +
                '\n' +
                'Reported Date: ' +
                convertFBNanoandSecToDate(docData.dateSubmitted);
            setParamsTask({ ...paramsTask, description: previousNotes });
        } else {
            setParamsTask({ ...paramsTask, description: '' });
        }
    }, [docData]);

    const addTaskData = (e: any) => {
        const { value, id } = e.target;
        setParamsTask({ ...paramsTask, [id]: value });
    };

    const handleSaveTask = (e: any) => {
        e.preventDefault();
        if (!paramsTask.title) {
            showMessage('Title is required.', 'error');
            return false;
        }
        const updatedSprintCards: any = [...cards];

        let maxId = 0;
        maxId = updatedSprintCards[0].tasks?.length ? updatedSprintCards[0]?.tasks.reduce((max: number, obj: any) => (obj.id > max ? obj.id : max), updatedSprintCards[0].tasks[0].id) : 0;

        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth()); //January is 0!
        const yyyy = today.getFullYear();
        const monthNames: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const task = {
            projectId: 1,
            id: maxId + 1,
            title: paramsTask.title,
            description: paramsTask.description,
            date: dd + ' ' + monthNames[mm] + ', ' + yyyy,
            tags: paramsTask.tags?.length > 0 ? paramsTask.tags.split(',') : [],
            assignedTo: assignedToOption.label,
            ticketNumber: docData?.id,
        };
        setParamsTask(updatedSprintCards[0]?.tasks.push(task));

        const issuesData = {
            assignedTo: assignedToOption.label,
            ticketNumber: docData?.id,
        };
        updateReport(docData?.id, issuesData);
        setIssues((prev: any) => {
            return prev.map((data: any) => {
                if (data.id === docData?.id) {
                    return { ...data, assignedTo: assignedToOption.label };
                }
                return data;
            });
        });

        handleUpdateSprintCards(updatedSprintCards);
        showMessage('Task has been saved successfully.');
        setModal2(false);
    };

    return (
        <div>
            <div className="p-0">
                <button type="button" onClick={() => setModal2(true)} className="text-primary whitespace-nowrap text-xs text-right ">
                    Assign and Ticket
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
                                        <h5 className="font-bold text-lg">Create Sprint Ticket</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal2(false)}>
                                            <IconX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <form onSubmit={(e) => handleSaveTask(e)}>
                                            <div className="grid gap-5">
                                                <div>
                                                    <label htmlFor="taskTitle">Ticket Title</label>
                                                    <input id="title" value={paramsTask.title} onChange={addTaskData} type="text" className="form-input" placeholder="Enter Ticket Title" />
                                                </div>
                                                <div>
                                                    <div className="w-full">
                                                        <label htmlFor="assign">Assigned To:</label>
                                                        <Select value={assignedToOption} className="w-full" options={options} onChange={(option) => setAssignedToOption(option)} isSearchable={false} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="taskTag">Tag</label>
                                                    <input id="tags" value={paramsTask.tags} onChange={addTaskData} type="text" className="form-input" placeholder="Enter Tag" />
                                                    <p className="ml-2 text-xs text-gray-500">Separate tags with commas</p>
                                                </div>
                                                <div>
                                                    <label htmlFor="taskdesc">Description</label>
                                                    <textarea
                                                        id="description"
                                                        value={paramsTask.description}
                                                        onChange={addTaskData}
                                                        className="form-textarea min-h-[130px]"
                                                        placeholder="Enter Description"
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setModal2(false)}>
                                                    Discard
                                                </button>
                                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                    Save
                                                </button>
                                            </div>
                                        </form>
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
