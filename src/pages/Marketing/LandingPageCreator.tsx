import { RadioGroup, Tab } from '@headlessui/react';
import { Fragment, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import IconCircleCheck from '../../components/Icon/IconCircleCheck';
import { createLandingPagePreview, saveFromToFirebase } from '../../firebase/firebaseFunctions';
import { UserAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader } from '@mantine/core';
import { showErrorMessage, showMessage } from '../../functions/shared';
import IconEye from '../../components/Icon/IconEye';
import IconSave from '../../components/Icon/IconSave';
import SimpleTemplate from './LandingPageTemplates/SimpleTemplate';
import BlankTemplate from './LandingPageTemplates/BlankTemplate';

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
    AdditionalInfo: '',
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
    AdditionalInfo: false,
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

const features = [
    {
        name: 'Benifit One',
        description: "Description of benifit one and why it's important",
        icon: IconCircleCheck,
    },
    {
        name: 'Benifit Two',
        description: "Description of benifit two and why it's important",
        icon: IconCircleCheck,
    },
    {
        name: 'Benifit Three',
        description: "Description of benifit three and why it's important",
        icon: IconCircleCheck,
    },
];

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
    { name: 'Dark', bgColor: 'bg-dark', selectedColor: 'ring-dark', btn: 'btn-dark', bg: 'bg-dark-light' },
    { name: 'Black', bgColor: 'bg-black', selectedColor: 'ring-black', btn: 'bg-zinc-800 hover:bg-zinc-950 text-white', bg: 'bg-black-light' },
    { name: 'White', bgColor: 'bg-white', selectedColor: 'ring-white', btn: 'bg-zinc-800 hover:bg-zinc-950 text-white', bg: 'bg-white' },
];

const heightOptions = [
    { name: 'Short', height: 'h-10' },
    { name: 'Medium', height: 'h-12' },
    { name: 'Tall', height: 'h-14' },
];

export default function LandingPageCreator() {
    const { layout, logo, setLogo }: any = UserAuth();
    const [components, setComponents] = useState([]);
    const [template, setTemplate] = useState<any>(0);
    

    const navigate = useNavigate();

    const landingPageData = {
        title: 'Main Headline',
    };

    const handlePreview = async () => {
        console.log('layout', layout)
        // const response = await createLandingPagePreview(layout);
        // navigate(`/marketing/landing-page-preview/${response}`);
    };

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        const logoasURL = URL.createObjectURL(file);
        setLogo(logoasURL);
    };

    const templates = [<BlankTemplate />, <SimpleTemplate />];



    return (
        <div>
            <div className="md:flex md:items-center md:justify-between bg-zinc-900 p-5 rounded-md">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">Landing Page Editor</h2>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    <button
                        type="button"
                        className="ml-3 inline-flex items-center rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                        onClick={handlePreview}
                    >
                        <IconEye className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        Preview
                    </button>
                    <button
                        type="button"
                        className="ml-3 inline-flex items-center rounded-md bg-info px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info"
                    >
                        <IconSave className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        Save Landing Page
                    </button>
                </div>
            </div>
            <div className="grid sm:grid-cols-4 sm:gap-4 mt-8">
                <div className="drop-shadow">
                    <Tab.Group>
                        <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`${selected ? '!border-white-light !border-b-white bg-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary `}
                                    >
                                        Template
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`${selected ? '!border-white-light !border-b-white  text-primary bg-white !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}
                                    >
                                        Displayed Values
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`${selected ? '!border-white-light !border-b-white  text-primary bg-white !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}
                                    >
                                        Style
                                    </button>
                                )}
                            </Tab>
                        </Tab.List>

                        <Tab.Panels>
                            <Tab.Panel>
                                <div className="active p-5 bg-white grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-info focus:ring-offset-2"
                                        onClick={() => setTemplate(0)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 16 16">
                                            <path d="M11 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4z" />
                                        </svg>

                                        <span className="mt-2 block text-sm font-semibold text-gray-900">Blank Template</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-info focus:ring-offset-2"
                                        onClick={() => setTemplate(1)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 16 16">
                                            <path d="M11 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4z" />
                                        </svg>

                                        <span className="mt-2 block text-sm font-semibold text-gray-900">Simple Template</span>
                                    </button>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="active p-5 bg-white"></div>
                            </Tab.Panel>
                            <Tab.Panel>
                            <div className="active p-5 bg-white"></div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
                <div className="sm:col-span-3">
                    <div className="panel">
                        <div className="relative cursor-pointer hover:border-danger hover:border p-4 text-transparent hover:text-danger">
                            <label htmlFor="upload-button" className="cursor-pointer">
                                <img src={logo} alt="Landing Page Logo" className="w-36 h-auto cursor-pointer" />
                                <input type="file" id="upload-button" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageChange(e)} />
                                <p className="text-center cursor-pointer">Click to upload logo</p>
                            </label>
                        </div>
                        {templates[template]}
                    </div>
                </div>
            </div>
        </div>
    );
}
