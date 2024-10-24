import { RadioGroup, Tab } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import IconCircleCheck from '../../components/Icon/IconCircleCheck';
import { saveFromToFirebase } from '../../firebase/firebaseFunctions';
import { UserAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader } from '@mantine/core';
import { showErrorMessage, showMessage } from '../../functions/shared';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';

const formInfoInit = {
    StudioId: '',
    FriendlyName: '',
    CreationDate: '',
    FormType: '',
    FormStyle: '',
    Name: '',
    LastName: '',
    Email: '',
    Phone: '',
    Address: '',
    City: '',
    State: '',
    Zip: '',
    Age: '',
    Notes: '',
    IncludeCaptcha: '',
    SendEmailNotification: '',
    BackgroundColor: '',
    ButtonColor: '',
    ProspectPipelineStep: '',
    MarketingMethod: '',
    NoteText: '',
    SuccessURL: '',
    SuccessMessage: '',
    EmailToNotify: '',
    ParentName: '',
    DefaultSMS: '',
    DefaultFromEmail: '',
    DefaultEmailSubject: '',
    DefaultEmailContent: '',
};

const formInfoSelected = {
    StudioId: false,
    FriendlyName: true,
    FormDescription: true,
    CreationDate: false,
    FormType: false,
    FormStyle: false,
    Name: true,
    LastName: true,
    Email: true,
    Phone: true,
    Address: false,
    City: false,
    State: false,
    Zip: false,
    Age: false,
    Notes: true,
    IncludeCaptcha: false,
    SendEmailNotification: false,
    BackgroundColor: false,
    ButtonColor: false,
    ProspectPipelineStep: false,
    MarketingMethod: false,
    NoteText: false,
    SuccessURL: false,
    SuccessMessage: false,
    EmailToNotify: false,
    ParentName: false,
    DefaultSMS: false,
    DefaultFromEmail: false,
    DefaultEmailSubject: false,
    DefaultEmailContent: false,
};

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}

const roundedOptions = [
    { name: 'None', rounded: 'rounded-none' },
    { name: 'Small', rounded: 'rounded-sm' },
    { name: 'Medium', rounded: 'rounded-md' },
    { name: 'Large', rounded: 'rounded-lg' },
    { name: 'XL', rounded: 'rounded-xl' },
    { name: '2XL', rounded: 'rounded-2xl' },
];

const colors = [
    { name: 'Pink', bgColor: 'bg-danger', selectedColor: 'ring-danger', btn: 'btn-danger', bg: 'bg-danger-light' },
    { name: 'Warning', bgColor: 'bg-warning', selectedColor: 'ring-warning', btn: 'btn-warning', bg: 'bg-warning-light' },
    { name: 'Success', bgColor: 'bg-success', selectedColor: 'ring-success', btn: 'btn-success', bg: 'bg-success-light' },
    { name: 'Primary', bgColor: 'bg-primary', selectedColor: 'ring-primary', btn: 'btn-primary', bg: 'bg-primary-light' },
    { name: 'Secondary', bgColor: 'bg-secondary', selectedColor: 'ring-secondary', btn: 'btn-secondary', bg: 'bg-secondary-light' },
    { name: 'Info', bgColor: 'bg-info', selectedColor: 'ring-info', btn: 'btn-info', bg: 'bg-info-light' },
    { name: 'Gray', bgColor: 'bg-gray-100', selectedColor: 'ring-gray-400', btn: 'bg-gray-800 hover:bg-gray-950 text-white', bg: 'bg-gray-200' },
    { name: 'Dark', bgColor: 'bg-dark', selectedColor: 'ring-dark', btn: 'btn-dark', bg: 'bg-dark-light' },
    { name: 'Black', bgColor: 'bg-black', selectedColor: 'ring-black', btn: 'bg-zinc-800 hover:bg-zinc-950 text-white', bg: 'bg-black-light' },
    { name: 'White', bgColor: 'bg-white', selectedColor: 'ring-gray-100', btn: 'bg-zinc-800 hover:bg-zinc-950 text-white', bg: 'bg-white' },
];

const heightOptions = [
    { name: 'Short', height: 'h-10', text: 'text-sm' },
    { name: 'Medium', height: 'h-12', text: 'text-md' },
    { name: 'Tall', height: 'h-14', text: 'text-base' },
    { name: 'Extra Tall', height: 'h-20', text: 'text-2xl' },
];

const widthOptions = [
    { name: 'Small', width: 'max-w-xl' },
    { name: 'Normal', width: 'max-w-2xl' },
    { name: 'Full', width: 'max-w-full' },
];

export default function CreateCaptureForms() {
    const { suid, prospectPipelineSteps, studioOptions }: any = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Create Form'));
    });
    const [formInfo, setFormInfo] = useState(formInfoSelected);
    const [value, setValue] = useState('');
    const [formName, setFormName] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState(colors[6]);
    const [mem, setMem] = useState(roundedOptions[2]);
    const [heightOption, setHeightOption] = useState(heightOptions[0]);
    const [loading, setLoading] = useState(false);
    const [alertFormName, setAlertFormName] = useState(false);
    const [pipelineStep, setPipelineStep] = useState(prospectPipelineSteps[0].PipelineStepId);
    const [sendEmail, setSendEmail] = useState(false);
    const [formHeadline, setFormHeadline] = useState('' as any);
    const [selectedWidth, setSelectedWidth] = useState(widthOptions[1]);
    const [redirect, setRedirect] = useState(true);
    const [successURL, setSuccessURL] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [alertURL, setAlertURL] = useState(false);
    const [alertMessage, setAlertMessage] = useState(false);
    const [defualtEmailSubject, setDefualtEmailSubject] = useState('');
    const [notesText, setNotesText] = useState('');

    const formData = {
        formName,
        formHeadline,
        formDescription,
        formInfo,
        selectedColor,
        emailFrom: studioOptions?.EmailFromAddress || studioOptions?.EmailFromAddress2 || '',
        mem,
        heightOption,
        studioID: suid,
        pipelineStep,
        selectedWidth,
        sendEmail,
        redirect,
        successURL,
        successMessage,
        stats: [],
        defaultEmailSubject: defualtEmailSubject,
        defaultEmailContent: value,
        notesText,
    };

    const navigate = useNavigate();

    const handleSaveForm = async () => {
        setLoading(true);
        if (formName === '') {
            showErrorMessage('Form Name is Required');
            setAlertFormName(true);
            setLoading(false);
            setSelectedIndex(0);
            return;
        } else if (redirect && successURL === '') {
            showErrorMessage('Success URL is Required');
            setLoading(false);
            setSelectedIndex(3);
            setAlertURL(true);
            return;
        } else if (!redirect && successMessage === '') {
            showErrorMessage('Success Message is Required');
            setLoading(false);
            setSelectedIndex(3);
            setAlertMessage(true);
            return;
        } else {
            const response = await saveFromToFirebase(formData);
            if (response) {
                const newFormId = response.id;
                setTimeout(() => {
                    setLoading(false);
                    showMessage('Form Saved Successfully!');
                    console.log('newFormId', newFormId);
                    navigate(`/marketing/capture-forms/${newFormId}`);
                }, 5000);
            } else {
                alert('Error Saving Form');
                setLoading(false);
            }
        }
    };

    return (
        <div>
            {loading && (
                <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-md">
                        <div className="flex items-center justify-center gap-4">
                            <Loader color="blue" />
                            <span>Saving Form...</span>
                        </div>
                    </div>
                </div>
            )}
            <div>
                <div className="md:flex md:items-center md:justify-between bg-dark p-5 rounded-md">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">Capture Form Editor</h2>
                    </div>
                    <div className="mt-4 flex md:ml-4 md:mt-0">
                        <button
                            type="button"
                            className="ml-3 inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            onClick={handleSaveForm}
                        >
                            Save Form
                        </button>
                    </div>
                </div>
                <h4 className=" text-2xl font-semibold mt-4">Form Details</h4>
                <p className="mb-4 text-xs">
                    In just a couple of simple steps Compete Studio can create a small piece of code that you can place on your site to capture visitors' contact information. You can select the type
                    of info you're collecting, and when someone fills out the form on your site their information is entered directly as a prospect into your account.
                </p>

                <div className="grid sm:grid-cols-2 sm:gap-2 mt-8">
                    <div className="drop-shadow">
                        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                            <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${selected ? '!border-white-light !border-b-white bg-zinc-100 text-primary !outline-none  rounded-t-lg' : ''}
                    dark:hover:border-b-black -mb-[1px] block  p-3.5 py-2 hover:text-primary `}
                                        >
                                            Description
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${selected ? '!border-white-light !border-b-white  text-primary bg-zinc-100 !outline-none  rounded-t-lg' : ''}
                    dark:hover:border-b-black -mb-[1px] block  p-3.5 py-2 hover:text-primary`}
                                        >
                                            Displayed Values
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${selected ? '!border-white-light !border-b-white  text-primary bg-zinc-100 !outline-none  rounded-t-lg' : ''}
                    dark:hover:border-b-black -mb-[1px] block  p-3.5 py-2 hover:text-primary`}
                                        >
                                            Style
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${selected ? '!border-white-light !border-b-white  text-primary bg-zinc-100 !outline-none  rounded-t-lg' : ''}
                    dark:hover:border-b-black -mb-[1px] block  p-3.5 py-2 hover:text-primary`}
                                        >
                                            Submission
                                        </button>
                                    )}
                                </Tab>
                            </Tab.List>

                            <Tab.Panels>
                                <Tab.Panel>
                                    <div className="active p-5 bg-zinc-100">
                                        <h5 className="text-xl font-medium">Give Your Form a Name</h5>
                                        <p className="text-gray-500 mb-2">It's a good idea to give your form a recognizable name that will help you to keep track of what it does and where it is.</p>
                                        <input
                                            type="text"
                                            className={`form-input w-full ${alertFormName && 'borderr bg-danger-light border-danger'}`}
                                            placeholder="Form Name"
                                            value={formName}
                                            onChange={(e) => setFormName(e.target.value)}
                                            onClick={() => setAlertFormName(false)}
                                        />
                                        {alertFormName && <p className="text-danger text-xs">Form Name is Required</p>}

                                        <label htmlFor="form-name" className="mt-6">
                                            Pipeline Step
                                        </label>
                                        <p className="text-gray-500 mb-2 text-xs">Select the pipeline step that you would like to add the prospect to when they fill out this form.</p>
                                        <select id="pipelineStatus" className="form-select" onChange={(e) => setPipelineStep(e.target.value)}>
                                            {prospectPipelineSteps?.map((step: any) => (
                                                <option key={step.PipelineStepId} value={step.PipelineStepId}>
                                                    {step.StepName}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="form-name" className="mt-6">
                                            Send Email Notification
                                        </label>
                                        <p className="text-gray-500 mb-2 text-xs">Would you like to send an automated email notification when someone fills out the form?</p>
                                        <div className="flex items-center ">
                                            <input type="checkbox" className="form-checkbox bg-white " onChange={() => setSendEmail(!sendEmail)} />
                                            <label htmlFor="form-name" className="mt-1">
                                                Yes, Send Email Notification
                                            </label>
                                        </div>
                                        {sendEmail && (
                                            <>
                                                <label htmlFor="response-subject" className="mt-6">
                                                    Response Email Subject
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-input w-full"
                                                    placeholder="Subject"
                                                    value={defualtEmailSubject}
                                                    onChange={(e) => setDefualtEmailSubject(e.target.value)}
                                                />
                                                <label htmlFor="form-name" className="mt-6">
                                                    Response Email
                                                </label>
                                                <p className="text-gray-500 mb-2 text-xs">This is the email that will be sent to the prospect when they fill out the form.</p>
                                                <div>
                                                    <ReactQuill className="bg-white" theme="snow" value={value} onChange={setValue} />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div className="active p-5 bg-zinc-100">
                                        <h4 className=" text-2xl font-semibold">Form Values</h4>
                                        <p className="mb-4 text-xs">Select the values that you would like to collect from the prospect when they fill out the form.</p>
                                        <div className="space-y-4">
                                            <div>
                                                <button className="flex items-center gap-2 w-full" onClick={() => setFormInfo({ ...formInfo, FriendlyName: !formInfo.FriendlyName })}>
                                                    <div>
                                                        {formInfo?.FriendlyName ? (
                                                            <div className="text-success">
                                                                <IconCircleCheck fill={true} />
                                                            </div>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                            </svg>
                                                        )}{' '}
                                                    </div>
                                                    <div
                                                        className={`${
                                                            formInfo?.FriendlyName ? 'bg-info text-white ' : 'bg-white outline outline-info text-info hover:bg-info-light'
                                                        } rounded-md h-10 xl:w-1/2 w-full flex items-center justify-start p-3`}
                                                    >
                                                        Headline
                                                    </div>
                                                </button>
                                                {formInfo?.FriendlyName && (
                                                    <div className="mt-2">
                                                        <input
                                                            type="text"
                                                            className={`form-input w-full ${alertFormName && 'borderr bg-danger-light border-danger'}`}
                                                            placeholder="Form Headline"
                                                            onChange={(e) => setFormHeadline(e.target.value)}
                                                        />
                                                        <p className="text-gray-500 mb-2 text-xs text-center">This is the headline that will be displayed at the top of the form.</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <button className="flex items-center gap-2 w-full" onClick={() => setFormInfo({ ...formInfo, FormDescription: !formInfo.FormDescription })}>
                                                    <div>
                                                        {formInfo?.FormDescription ? (
                                                            <div className="text-success">
                                                                <IconCircleCheck fill={true} />
                                                            </div>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                            </svg>
                                                        )}{' '}
                                                    </div>
                                                    <div
                                                        className={`${
                                                            formInfo?.FormDescription ? 'bg-info text-white ' : 'bg-white outline outline-info text-info hover:bg-info-light'
                                                        } rounded-md h-10 xl:w-1/2 w-full flex items-center justify-start p-3`}
                                                    >
                                                        Form Description
                                                    </div>
                                                </button>
                                                {formInfo?.FormDescription && (
                                                    <div className="mt-2">
                                                        <textarea
                                                            rows={4}
                                                            name="description"
                                                            id="description"
                                                            className="form-textarea w-full"
                                                            placeholder={'Description of Form'}
                                                            onChange={(e) => setFormDescription(e.target.value)}
                                                        />
                                                        <p className="text-gray-500 mb-2 text-xs text-center">This is the description that will be displayed at the top of the form.</p>
                                                    </div>
                                                )}
                                            </div>

                                            <button className="flex items-center gap-2 w-full" onClick={() => setFormInfo({ ...formInfo, Name: !formInfo.Name })}>
                                                <div>
                                                    {formInfo?.Name ? (
                                                        <div className="text-success">
                                                            <IconCircleCheck fill={true} />
                                                        </div>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                        </svg>
                                                    )}{' '}
                                                </div>
                                                <div
                                                    className={`${
                                                        formInfo?.Name ? 'bg-info text-white ' : 'bg-white outline outline-info text-info hover:bg-info-light'
                                                    } rounded-md h-10 xl:w-1/2 w-full flex items-center justify-start p-3`}
                                                >
                                                    First Name
                                                </div>
                                            </button>
                                            <button className="flex items-center gap-2 w-full" onClick={() => setFormInfo({ ...formInfo, LastName: !formInfo.LastName })}>
                                                <div>
                                                    {formInfo?.LastName ? (
                                                        <div className="text-success">
                                                            <IconCircleCheck fill={true} />
                                                        </div>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                        </svg>
                                                    )}{' '}
                                                </div>
                                                <div
                                                    className={`${
                                                        formInfo?.LastName ? 'bg-info text-white ' : 'bg-white outline outline-info text-info hover:bg-info-light'
                                                    } rounded-md h-10 xl:w-1/2 w-full flex items-center justify-start p-3`}
                                                >
                                                    Last Name
                                                </div>
                                            </button>

                                            <button className="flex items-center gap-2 w-full" onClick={() => setFormInfo({ ...formInfo, Email: !formInfo.Email })}>
                                                <div>
                                                    {formInfo?.Email ? (
                                                        <div className="text-success">
                                                            <IconCircleCheck fill={true} />
                                                        </div>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                        </svg>
                                                    )}{' '}
                                                </div>
                                                <div
                                                    className={`${
                                                        formInfo?.Email ? 'bg-info text-white ' : 'bg-white outline outline-info text-info hover:bg-info-light'
                                                    } rounded-md h-10 xl:w-1/2 w-full flex items-center justify-start p-3`}
                                                >
                                                    Email
                                                </div>
                                            </button>
                                            <button className="flex items-center gap-2 w-full" onClick={() => setFormInfo({ ...formInfo, Phone: !formInfo.Phone })}>
                                                <div>
                                                    {formInfo?.Phone ? (
                                                        <div className="text-success">
                                                            <IconCircleCheck fill={true} />
                                                        </div>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                        </svg>
                                                    )}{' '}
                                                </div>
                                                <div
                                                    className={`${
                                                        formInfo?.Phone ? 'bg-info text-white ' : 'bg-white outline outline-info text-info hover:bg-info-light'
                                                    } rounded-md h-10 xl:w-1/2 w-full flex items-center justify-start p-3`}
                                                >
                                                    Phone Number
                                                </div>
                                            </button>
                                            <button className="flex items-center gap-2 w-full" onClick={() => setFormInfo({ ...formInfo, Address: !formInfo.Address })}>
                                                <div>
                                                    {formInfo?.Address ? (
                                                        <div className="text-success">
                                                            <IconCircleCheck fill={true} />
                                                        </div>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                        </svg>
                                                    )}{' '}
                                                </div>
                                                <div
                                                    className={`${
                                                        formInfo?.Address ? 'bg-info text-white ' : 'bg-white outline outline-info text-info hover:bg-info-light'
                                                    } rounded-md h-10 xl:w-1/2 w-full flex items-center justify-start p-3`}
                                                >
                                                    Address
                                                </div>
                                            </button>
                                            <button className="flex items-center gap-2 w-full" onClick={() => setFormInfo({ ...formInfo, City: !formInfo.City })}>
                                                <div>
                                                    {formInfo?.City ? (
                                                        <div className="text-success">
                                                            <IconCircleCheck fill={true} />
                                                        </div>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                        </svg>
                                                    )}{' '}
                                                </div>
                                                <div
                                                    className={`${
                                                        formInfo?.City ? 'bg-info text-white ' : 'bg-white outline outline-info text-info hover:bg-info-light'
                                                    } rounded-md h-10 xl:w-1/2 w-full flex items-center justify-start p-3`}
                                                >
                                                    City
                                                </div>
                                            </button>
                                            <button className="flex items-center gap-2 w-full" onClick={() => setFormInfo({ ...formInfo, State: !formInfo.State })}>
                                                <div>
                                                    {formInfo?.State ? (
                                                        <div className="text-success">
                                                            <IconCircleCheck fill={true} />
                                                        </div>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                        </svg>
                                                    )}{' '}
                                                </div>
                                                <div
                                                    className={`${
                                                        formInfo?.State ? 'bg-info text-white ' : 'bg-white outline outline-info text-info hover:bg-info-light'
                                                    } rounded-md h-10 xl:w-1/2 w-full flex items-center justify-start p-3`}
                                                >
                                                    State
                                                </div>
                                            </button>
                                            <button className="flex items-center gap-2 w-full" onClick={() => setFormInfo({ ...formInfo, Zip: !formInfo.Zip })}>
                                                <div>
                                                    {formInfo?.Zip ? (
                                                        <div className="text-success">
                                                            <IconCircleCheck fill={true} />
                                                        </div>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                        </svg>
                                                    )}{' '}
                                                </div>
                                                <div
                                                    className={`${
                                                        formInfo?.Zip ? 'bg-info text-white ' : 'bg-white outline outline-info text-info hover:bg-info-light'
                                                    } rounded-md h-10 xl:w-1/2 w-full flex items-center justify-start p-3`}
                                                >
                                                    Zip
                                                </div>
                                            </button>
                                            <button className="flex items-center gap-2 w-full" onClick={() => setFormInfo({ ...formInfo, Age: !formInfo.Age })}>
                                                <div>
                                                    {formInfo?.Age ? (
                                                        <div className="text-success">
                                                            <IconCircleCheck fill={true} />
                                                        </div>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                        </svg>
                                                    )}{' '}
                                                </div>
                                                <div
                                                    className={`${
                                                        formInfo?.Age ? 'bg-info text-white ' : 'bg-white outline outline-info text-info hover:bg-info-light'
                                                    } rounded-md h-10 xl:w-1/2 w-full flex items-center justify-start p-3`}
                                                >
                                                    Age
                                                </div>
                                            </button>
                                            <button className="flex items-center gap-2 w-full" onClick={() => setFormInfo({ ...formInfo, ParentName: !formInfo.ParentName })}>
                                                <div>
                                                    {formInfo?.ParentName ? (
                                                        <div className="text-success">
                                                            <IconCircleCheck fill={true} />
                                                        </div>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                        </svg>
                                                    )}{' '}
                                                </div>
                                                <div
                                                    className={`${
                                                        formInfo?.ParentName ? 'bg-info text-white ' : 'bg-white outline outline-info text-info hover:bg-info-light'
                                                    } rounded-md h-10 xl:w-1/2 w-full flex items-center justify-start p-3`}
                                                >
                                                    Parents Name
                                                </div>
                                            </button>
                                            <button className="flex items-center gap-2 w-full" onClick={() => setFormInfo({ ...formInfo, Notes: !formInfo.Notes })}>
                                                <div>
                                                    {formInfo?.Notes ? (
                                                        <div className="text-success">
                                                            <IconCircleCheck fill={true} />
                                                        </div>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                        </svg>
                                                    )}{' '}
                                                </div>
                                                <div
                                                    className={`${
                                                        formInfo?.Notes ? 'bg-info text-white ' : 'bg-white outline outline-info text-info hover:bg-info-light'
                                                    } rounded-md h-10 xl:w-1/2 w-full flex items-center justify-start p-3`}
                                                >
                                                    Additional Info
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div className="p-5 bg-zinc-100">
                                        <RadioGroup value={selectedColor} onChange={setSelectedColor}>
                                            <RadioGroup.Label className="block text-sm font-medium leading-6 text-gray-900">Choose a Theme Color</RadioGroup.Label>
                                            <div className="mt-4 flex flex-wrap items-center xl:justify-between gap-3">
                                                {colors.map((color) => (
                                                    <RadioGroup.Option
                                                        key={color.name}
                                                        value={color}
                                                        className={({ active, checked }) =>
                                                            classNames(
                                                                color.selectedColor,
                                                                active && checked ? 'ring ' : '',
                                                                !active && checked ? 'ring-2' : '',
                                                                'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-2 focus:outline-none'
                                                            )
                                                        }
                                                    >
                                                        <RadioGroup.Label as="span" className="sr-only">
                                                            {color.name}
                                                        </RadioGroup.Label>
                                                        <span aria-hidden="true" className={classNames(color.bgColor, 'h-8 w-8 rounded-full border border-black border-opacity-10')} />
                                                    </RadioGroup.Option>
                                                ))}
                                            </div>
                                        </RadioGroup>
                                        <div className="mt-8">
                                            <RadioGroup value={mem} onChange={setMem} className="mt-2">
                                                <RadioGroup.Label className="block text-sm font-medium leading-6 text-gray-900">Roundness Level</RadioGroup.Label>
                                                <div className="mt-4 grid grid-cols-3 gap-3">
                                                    {roundedOptions.map((option) => (
                                                        <RadioGroup.Option
                                                            key={option.name}
                                                            value={option}
                                                            className={({ active, checked }) =>
                                                                classNames(
                                                                    active ? 'ring-2 ring-primary ring-offset-2' : '',
                                                                    checked ? 'bg-primary text-white hover:primary/90' : 'ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50',
                                                                    `flex items-center justify-center ${option.rounded} py-3 px-3 font-semibold text-xs sm:flex-1 cursor-pointer focus:outline-none`
                                                                )
                                                            }
                                                        >
                                                            <RadioGroup.Label as="span" className="text-sm">
                                                                {option.name}
                                                            </RadioGroup.Label>
                                                        </RadioGroup.Option>
                                                    ))}
                                                </div>
                                            </RadioGroup>
                                        </div>
                                        <div className="mt-8">
                                            <RadioGroup value={heightOption} onChange={setHeightOption} className="mt-2">
                                                <RadioGroup.Label className="block text-sm font-medium leading-6 text-gray-900">Input Height</RadioGroup.Label>
                                                <div className="flex items-center gap-3">
                                                    {heightOptions.map((option) => (
                                                        <RadioGroup.Option
                                                            key={option.name}
                                                            value={option}
                                                            className={({ active, checked }) =>
                                                                classNames(
                                                                    active ? 'ring-2 ring-primary ring-offset-2' : '',
                                                                    checked ? 'bg-primary text-white hover:primary/90' : 'ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50',
                                                                    `flex items-center justify-center ${option.height} py-3 px-3 font-semibold sm:flex-1 cursor-pointer focus:outline-none`
                                                                )
                                                            }
                                                        >
                                                            <RadioGroup.Label as="span" className="text-sm">
                                                                {option.name}
                                                            </RadioGroup.Label>
                                                        </RadioGroup.Option>
                                                    ))}
                                                </div>
                                            </RadioGroup>
                                        </div>
                                        <div className="mt-8">
                                            <RadioGroup value={selectedWidth} onChange={setSelectedWidth} className="mt-2">
                                                <RadioGroup.Label className="block text-sm font-medium leading-6 text-gray-900">Width</RadioGroup.Label>
                                                <div className="flex items-center gap-3">
                                                    {widthOptions.map((option) => (
                                                        <RadioGroup.Option
                                                            key={option.name}
                                                            value={option}
                                                            className={({ active, checked }) =>
                                                                classNames(
                                                                    active ? 'ring-2 ring-primary ring-offset-2' : '',
                                                                    checked ? 'bg-primary text-white hover:primary/90' : 'ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50',
                                                                    `flex items-center justify-center ${option.width} py-3 px-3 font-semibold text-xs sm:flex-1 cursor-pointer focus:outline-none`
                                                                )
                                                            }
                                                        >
                                                            <RadioGroup.Label as="span" className="text-sm">
                                                                {option.name}
                                                            </RadioGroup.Label>
                                                        </RadioGroup.Option>
                                                    ))}
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div className="p-5 bg-zinc-100">
                                        <h4 className=" text-2xl font-semibold">Form Submission</h4>
                                        <p className="mb-4 text-xs">
                                            Select the type of submission you would like to have when someone fills out the form. You can choose to have the form redirect to a URL, or display a
                                            success message.
                                        </p>
                                        <label className="inline-flex">
                                            <input type="radio" checked={redirect} name="default_radio" className="form-radio text-success" onChange={() => setRedirect(true)} />
                                            <span>Success URL</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-input w-full ${alertURL && redirect && 'borderr bg-danger-light border-danger'}`}
                                            placeholder="Success URL"
                                            value={successURL}
                                            onChange={(e) => setSuccessURL(e.target.value)}
                                            onClick={() => setAlertURL(false)}
                                        />
                                        {alertURL && redirect && <p className="text-danger text-xs">Selected URL is Required</p>}
                                        <label className="inline-flex mt-6">
                                            <input type="radio" name="default_radio" checked={!redirect} className="form-radio text-secondary" onChange={() => setRedirect(false)} />
                                            <span>Success Message</span>
                                        </label>
                                        <textarea
                                            rows={4}
                                            name="description"
                                            id="description"
                                            className={`form-input w-full ${alertMessage && !redirect && 'borderr bg-danger-light border-danger'}`}
                                            value={successMessage}
                                            placeholder={'Success Message'}
                                            onChange={(e) => setSuccessMessage(e.target.value)}
                                            onClick={() => setAlertMessage(false)}
                                        />
                                        {alertMessage && !redirect && <p className="text-danger text-xs">Success Message is Required</p>}

                                        <label htmlFor="form-name" className="mt-6">
                                            Notes Text
                                        </label>
                                        <p className="text-gray-500 mb-2 text-xs">
                                            When this form is submitted it can automatically enter some text into the "notes" section of the database record. You might want to do this to help keep
                                            track of which form was filled out, or to distinguish one entry from another. It can be something like "kids program" or "advanced ballet." Later you can
                                            search the record in Compete Studio based on these entries. If you don't care about this functionality, you can just leave this box blank and move on to the
                                            next step.
                                        </p>
                                        <textarea
                                            rows={4}
                                            name="description"
                                            id="description"
                                            className="form-textarea w-full"
                                            placeholder={'Notes Text'}
                                            onChange={(e) => setNotesText(e.target.value)}
                                        />
                                    </div>
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                    <div className="">
                        <h3 className="text-2xl font-semibold text-center text-primary mb-4">Form Preview</h3>
                        <div className={`p-5 ${selectedColor?.bg} ${mem.rounded} ${selectedWidth.width} shadow shadow-zinc-400 grid mx-auto grid-cols-1 sm:grid-cols-6 gap-4`}>
                            {(formInfo.FriendlyName || formInfo.FormDescription) && (
                                <div className="sm:col-span-full">
                                    {formInfo.FriendlyName && <div className="text-2xl font-semibold text-center">{formHeadline || 'Headline'}</div>}
                                    {formInfo.FormDescription && <p className="text-gray-500 mb-2 text-xs text-center">{formDescription || 'Form Description'}</p>}
                                </div>
                            )}

                            {formInfo.Name && (
                                <div className={`${formInfo.Name && formInfo.LastName ? 'sm:col-span-3' : 'sm:col-span-full'}`}>
                                    <label htmlFor="first-name">First name</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="first-name"
                                            id="first-name"
                                            autoComplete="given-name"
                                            className={`form-input w-full ${mem.rounded} ${heightOption?.height} ${heightOption.text}`}
                                        />
                                    </div>
                                </div>
                            )}

                            {formInfo.LastName && (
                                <div className={`${formInfo.Name && formInfo.LastName ? 'sm:col-span-3' : 'sm:col-span-full'}`}>
                                    <label htmlFor="last-name">Last name</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="last-name"
                                            id="last-name"
                                            autoComplete="family-name"
                                            className={`form-input w-full ${mem.rounded} ${heightOption?.height} ${heightOption.text}`}
                                        />
                                    </div>
                                </div>
                            )}

                            {formInfo.Email && (
                                <div className={formInfo.Phone ? 'sm:col-span-3' : 'sm:col-span-full'}>
                                    <label htmlFor="email">Email address</label>
                                    <div className="mt-2">
                                        <input id="email" name="email" type="email" autoComplete="email" className={`form-input w-full ${mem.rounded} ${heightOption?.height} ${heightOption.text}`} />
                                    </div>
                                </div>
                            )}

                            {formInfo.Phone && (
                                <div className={formInfo.Email ? 'sm:col-span-3' : 'sm:col-span-full'}>
                                    <label htmlFor="phone">Phone</label>
                                    <div className="mt-2">
                                        <input id="phone" name="phone" type="tel" autoComplete="phone" className={`form-input w-full ${mem.rounded} ${heightOption?.height} ${heightOption.text}`} />
                                    </div>
                                </div>
                            )}

                            {formInfo.Address && (
                                <div className="sm:col-span-full">
                                    <label htmlFor="street-address">Mailing address</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="street-address"
                                            id="street-address"
                                            autoComplete="street-address"
                                            className={`form-input w-full ${mem.rounded} ${heightOption?.height} ${heightOption.text} `}
                                        />
                                    </div>
                                </div>
                            )}

                            {formInfo.City && (
                                <div className={`${formInfo.State && formInfo.Zip ? 'sm:col-span-3' : formInfo.State || formInfo.Zip ? 'col-span-3' : 'sm:col-span-full'}`}>
                                    <label htmlFor="city">City</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="city"
                                            id="city"
                                            autoComplete="address-level2"
                                            className={`form-input w-full ${mem.rounded} ${heightOption?.height} ${heightOption.text}`}
                                        />
                                    </div>
                                </div>
                            )}

                            {formInfo.State && (
                                <div className={`${formInfo.City && formInfo.Zip ? 'sm:col-span-1' : 'sm:col-span-3'}`}>
                                    <label htmlFor="region">State</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="region"
                                            id="region"
                                            autoComplete="address-level1"
                                            className={`form-input w-full ${mem.rounded} ${heightOption?.height} ${heightOption.text}`}
                                        />
                                    </div>
                                </div>
                            )}

                            {formInfo.Zip && (
                                <div className={`${formInfo.City && formInfo.State ? 'sm:col-span-2' : 'sm:col-span-3'}`}>
                                    <label htmlFor="postal-code">ZIP / Postal code</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="postal-code"
                                            id="postal-code"
                                            autoComplete="postal-code"
                                            className={`form-input w-full ${mem.rounded} ${heightOption?.height} ${heightOption.text}`}
                                        />
                                    </div>
                                </div>
                            )}

                            {formInfo.ParentName && (
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name">Parent Name</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="first-name"
                                            id="first-name"
                                            autoComplete="given-name"
                                            className={`form-input w-full ${mem.rounded} ${heightOption?.height} ${heightOption.text}`}
                                        />
                                    </div>
                                </div>
                            )}

                            {formInfo.Age && (
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name">Age Of Student</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="first-name"
                                            id="first-name"
                                            autoComplete="given-name"
                                            className={`form-input w-full ${mem.rounded} ${heightOption?.height} ${heightOption.text}`}
                                        />
                                    </div>
                                </div>
                            )}

                            {formInfo.Notes && (
                                <div className="sm:col-span-full">
                                    <label htmlFor="email">Additional Info</label>
                                    <div className="mt-2">
                                        <textarea rows={4} name="comment" id="comment" className={`form-textarea w-full ${mem.rounded}`} defaultValue={''} />
                                    </div>
                                </div>
                            )}

                           

                            <button className={`btn ${selectedColor?.btn}  ${heightOption?.height} ${heightOption.text} ${mem?.rounded} sm:col-span-full`}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
