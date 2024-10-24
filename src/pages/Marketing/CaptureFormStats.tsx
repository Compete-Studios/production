import { Link, useParams } from 'react-router-dom';
import Dropdown from '../../components/Dropdown';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import IconEye from '../../components/Icon/IconEye';

import IconBitcoin from '../../components/Icon/IconBitcoin';
import IconEthereum from '../../components/Icon/IconEthereum';
import IconLitecoin from '../../components/Icon/IconLitecoin';
import IconBinance from '../../components/Icon/IconBinance';
import IconTether from '../../components/Icon/IconTether';
import IconSolana from '../../components/Icon/IconSolana';
import IconCircleCheck from '../../components/Icon/IconCircleCheck';
import IconInfoCircle from '../../components/Icon/IconInfoCircle';
import { getAllFormSubmissions, getFormsFromFirebase } from '../../firebase/firebaseFunctions';
import IconCalendar from '../../components/Icon/IconCalendar';

const formInit = {
    heightOption: {
        height: 'h-10',
        text: 'text-sm',
        name: 'Short',
    },
    redirect: true,
    stats: [],
    successMessage: '',
    pipelineStep: 149,
    sendEmail: false,
    successURL: '',
    selectedColor: {
        bgColor: 'bg-gray-100',
        name: 'Gray',
        btn: 'bg-gray-800 hover:bg-gray-950 text-white',
        selectedColor: 'ring-gray-400',
        bg: 'bg-gray-200',
    },
    formDescription: '',
    studioID: '32',
    formHeadline: '',
    defaultEmailContent: '',
    loads: 0,
    formInfo: {
        Zip: false,
        DefaultFromEmail: false,
        State: false,
        DefaultEmailSubject: false,
        Name: true,
        FriendlyName: false,
        AdditionalInfo: false,
        NoteText: false,
        StudioId: false,
        CreationDate: false,
        SuccessURL: false,
        ParentName: false,
        Phone: true,
        City: false,
        ProspectPipelineStep: false,
        Notes: true,
        BackgroundColor: false,
        IncludeCaptcha: false,
        SendEmailNotification: false,
        MarketingMethod: false,
        FormStyle: false,
        DefaultEmailContent: false,
        FormDescription: false,
        LastName: true,
        FormType: false,
        Age: false,
        Email: true,
        SuccessMessage: false,
        EmailToNotify: false,
        Address: false,
        DefaultSMS: false,
        ButtonColor: false,
    },
    formName: 'Brets Test',
    defaultEmailSubject: '',
    notesText: '',
    selectedWidth: {
        width: 'max-w-2xl',
        name: 'Normal',
    },
    mem: {
        rounded: 'rounded-md',
        name: 'Medium',
    },
    submissions: 0,
    emailFrom: 'info@springsdance.com',
};

const CaptureFormStats = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Finance'));
    });
    const [formInfo, setFormInfo] = useState(formInit);
    const [submissions, setSubmissions] = useState([]);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const { id }: any = useParams();

    const months = [
        {
            name: 'January',
            value: 1,
        },
        {
            name: 'February',
            value: 2,
        },
        {
            name: 'March',
            value: 3,
        },
        {
            name: 'April',
            value: 4,
        },
        {
            name: 'May',
            value: 5,
        },
        {
            name: 'June',
            value: 6,
        },
        {
            name: 'July',
            value: 7,
        },
        {
            name: 'August',
            value: 8,
        },
        {
            name: 'September',
            value: 9,
        },
        {
            name: 'October',
            value: 10,
        },
        {
            name: 'November',
            value: 11,
        },
        {
            name: 'December',
            value: 12,
        },
    ];

    const handleGetForm = async () => {
        const res: any = await getFormsFromFirebase(id);
        setFormInfo(res);
        const resSubs: any = await getAllFormSubmissions(id);
        setSubmissions(resSubs);
    };

    useEffect(() => {
        handleGetForm();
    }, []);

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const date: any = `${currentMonth}${currentYear}`;

    console.log(submissions);



    const formatDateWithSecondsAndNanoseconds = (date: any) => {
        return new Date(date.seconds * 1000 + date.nanoseconds / 1000000).toLocaleDateString();
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/marketing/capture-forms" className="text-primary hover:underline">
                        Capture Forms
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>{formInfo?.formName}</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                    <div className="p-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white">
                        <div className="badge bg-white/30">Total Loads</div>

                        <div className="text-center mt-2">
                            <div className="text-2xl font-bold text-center"> {formInfo?.submissions}</div>
                        </div>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-violet-500 to-violet-400 text-white">
                        <div className="badge bg-white/30">Total Submissions</div>

                        <div className="text-center mt-2">
                            <div className="text-2xl font-bold text-center"> {formInfo?.loads}</div>
                        </div>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white">
                        <div className="badge bg-white/30">Submit Percentage</div>

                        <div className="text-center mt-2">
                            <div className="text-2xl font-bold text-center"> {formInfo.loads && formInfo.submissions ? `${((formInfo.submissions / formInfo.loads) * 100)?.toFixed(1)}%` : '0%'}</div>
                        </div>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-fuchsia-500 to-fuchsia-400 text-white">
                        <div className="badge bg-white/30">Submissions This Month</div>

                        <div className="text-center mt-2">
                            <div className="text-2xl font-bold text-center"> {formInfo[date] || 0}</div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
                    {/* <div className="grid gap-6 xl:grid-flow-row"> */}
                        {/*  Previous Statement  */}
                        {/* <div className="panel overflow-hidden">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-bold">Previous Month</div>
                                    <div className="text-success"> September 2024 </div>
                                </div>
                                <div className="dropdown">
                                    <Dropdown
                                        offset={[0, 5]}
                                        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                        btnClassName="hover:opacity-80"
                                        button={<IconCalendar className="hover:opacity-80 opacity-70" />}
                                    >
                                        <ul>
                                            <li>
                                                <button type="button">August 2024</button>
                                            </li>
                                            <li>
                                                <button type="button">July 2024</button>
                                            </li>
                                            <li>
                                                <button type="button">June 2024</button>
                                            </li>
                                        </ul>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="relative mt-10">
                                <div className="absolute -bottom-12 ltr:-right-12 rtl:-left-12 w-24 h-24">
                                    <IconCircleCheck className="text-success opacity-20 w-full h-full" />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div>
                                        <div className="text-primary">Card Limit</div>
                                        <div className="mt-2 font-semibold text-2xl">$50,000.00</div>
                                    </div>
                                    <div>
                                        <div className="text-primary">Spent</div>
                                        <div className="mt-2 font-semibold text-2xl">$15,000.00</div>
                                    </div>
                                    <div>
                                        <div className="text-primary">Minimum</div>
                                        <div className="mt-2 font-semibold text-2xl">$2,500.00</div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/*  Current Statement */}
                        {/* <div className="panel overflow-hidden">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-bold">Current Statement</div>
                                    <div className="text-danger"> Must be paid before July 27, 2022 </div>
                                </div>
                                <div className="dropdown">
                                    <Dropdown offset={[0, 5]} placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`} button={<IconHorizontalDots className="hover:opacity-80 opacity-70" />}>
                                        <ul>
                                            <li>
                                                <button type="button">View Report</button>
                                            </li>
                                            <li>
                                                <button type="button">Edit Report</button>
                                            </li>
                                        </ul>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="relative mt-10">
                                <div className="absolute -bottom-12 ltr:-right-12 rtl:-left-12 w-24 h-24">
                                    <IconInfoCircle className="text-danger opacity-20 w-24 h-full" />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div>
                                        <div className="text-primary">Card Limit</div>
                                        <div className="mt-2 font-semibold text-2xl">$50,000.00</div>
                                    </div>
                                    <div>
                                        <div className="text-primary">Spent</div>
                                        <div className="mt-2 font-semibold text-2xl">$30,500.00</div>
                                    </div>
                                    <div>
                                        <div className="text-primary">Minimum</div>
                                        <div className="mt-2 font-semibold text-2xl">$8,000.00</div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    {/* </div> */}

                    {/*  Recent Transactions  */}
                    <div className="panel">
                        <div className="mb-5 text-lg font-bold">Recent Submissions</div>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">Prospect ID</th>
                                        <th>DATE</th>
                                        <th>NAME</th>
                                        <th className="text-center ltr:rounded-r-md rtl:rounded-l-md">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions?.map((submission: any, index: number) => (
                                        <tr key={index} className="hover:bg-gray-100">
                                            <td className="font-semibold">{submission.prospectID}</td>
                                            <td className="whitespace-nowrap">{formatDateWithSecondsAndNanoseconds(submission.date)}</td>
                                            <td className="whitespace-nowrap">{submission.prospectName}</td>
                                            <td className="text-center">
                                                <span className="badge bg-success/20 text-success rounded-full hover:top-0">Completed</span>
                                            </td>
                                        </tr>
                                    ))}
                              
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaptureFormStats;
