import { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { constFormateDateForPaySimple, constFormateDateMMDDYYYY, formatDate, hashTheID, showErrorMessage } from '../../functions/shared';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { getPaysimpleCustomerIdFromStudentId, getStudentBillingAccounts, getStudentInfo } from '../../functions/api';
import Swal from 'sweetalert2';
import { createPaymentSchedule, getAllCustomerPaymentAccounts } from '../../functions/payments';

interface Schedule {
    studioId: number;
    paymentAccountId: number;
    amount: number;
    startDate: string;
    paymentScheduleType: string;
    endDate: string;
    emailForReceipt: string;
    description: string;
}

export default function AddPaymentSchedule() {
    const { suid } = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Create Payment Schedule'));
    });
    const [studentID, setStudentID] = useState<number>(0);
    const [scheduleInfo, setScheduleInfo] = useState<Schedule>({
        studioId: 0,
        paymentAccountId: 0,
        amount: 0,
        startDate: '',
        paymentScheduleType: 'SpecificDayofMonth',
        endDate: '',
        emailForReceipt: '',
        description: '',
    });
    const [studentInfo, setStudentInfo] = useState<any>({});
    const [customerID, setCustomerID] = useState<number>(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number>(0);
    const [bankAccounts, setBankAccounts] = useState<any>([]);
    const [cards, setCards] = useState<any>([]);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    
    useEffect(() => {
        const parsedId: number = parseInt(id ?? '');
        const parsedSuid = parseInt(suid);
        setScheduleInfo({
            ...scheduleInfo,
            studioId: suid,
        });
        if (!isNaN(parsedId) && !isNaN(parsedSuid)) {
            const newID: number = parsedId / parsedSuid;
            setStudentID(newID);
            getStudentInfo(newID).then((res) => {
                setStudentInfo(res);
                console.log(res);
                if (res.email) {
                    setScheduleInfo({ ...scheduleInfo, emailForReceipt: res.email });
                }
            });
            getStudentBillingAccounts(newID).then((res) => {
                if (res.recordset.length === 0) {
                    navigate(`/students/add-billing-account/${id}`);
                } else {
                    getPaysimpleCustomerIdFromStudentId(res.recordset[0].PaysimpleCustomerId, suid).then((res) => {
                        if (res.Response) {
                            setCustomerID(res?.Response?.Id);
                        } else {
                            showErrorMessage('Error getting Paysimple ID');
                        }
                    });
                    getAllCustomerPaymentAccounts(res.recordset[0]?.PaysimpleCustomerId, suid).then((response) => {
                        console.log(response?.Response);
                        if (response?.Response?.CreditCardAccounts?.length > 0) {
                            setSelectedPaymentMethod(response?.Response?.CreditCardAccounts[0]?.Id);
                            setCards(response?.Response?.CreditCardAccounts);
                        } else {
                            setCards(null);
                        }
                        if (response?.Response?.AchAccounts?.length > 0) {
                            setBankAccounts(response?.Response?.AchAccounts);
                        } else {
                            setBankAccounts(null);
                        }
                    });
                }
            });
        } else {
            console.log('Invalid ID');
        }
    }, [id, suid]);

    useEffect(() => {
        setScheduleInfo({
            ...scheduleInfo,
            paymentAccountId: selectedPaymentMethod,
        });
    }, [selectedPaymentMethod]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setScheduleInfo({ ...scheduleInfo, amount: parseInt(e.target.value) });
    };

    const handleSubmitSchedule = async (e: any) => {
        e.preventDefault();
        if (scheduleInfo.amount === 0) {
            showErrorMessage('Please enter an amount');
            return;
        } else if (scheduleInfo.paymentAccountId === 0) {
            showErrorMessage('Please select a payment method');
            return;
        } else if (scheduleInfo.paymentScheduleType === '') {
            showErrorMessage('Please select a billing frequency');
            return;
        } else if (scheduleInfo.startDate === '') {
            showErrorMessage('Please select a start date');
            return;
        } else if (scheduleInfo.emailForReceipt === '') {
            showErrorMessage('Please enter an email for the receipt');
            return;
        } else {
            scheduleInfo.startDate = constFormateDateForPaySimple(scheduleInfo.startDate);
            scheduleInfo.endDate = constFormateDateForPaySimple(scheduleInfo.endDate);
            console.log(scheduleInfo);
            try {
                const res = await createPaymentSchedule(scheduleInfo);

                if (res) {
                    console.log(res);
                    Swal.fire({
                        title: 'Payment Schedule Created',
                        icon: 'success',
                        padding: '10px 20px',
                    });
                    navigate(`/students/view-student/${hashTheID(studentID)}/${hashTheID(suid)}`);
                } else {
                    showErrorMessage('Error creating payment schedule');
                }
            } catch (error) {
                showErrorMessage('Error creating payment schedule');
            }
        }
    };

    return (
        <div className="space-y-4">
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/students/view-students" className="text-primary hover:underline">
                        Students
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <Link to={`/students/view-student/${hashTheID(studentID)}/${hashTheID(suid)}`} className="text-info">
                        Students Info
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Create Payment Schedule</span>
                </li>
            </ul>
            <div className="flex justify-center justify-between">
                <div>
                    <h5 className="font-semibold text-lg uppercase">Create a Payment Schedule</h5>
                    <p>
                        This form will create a schedule for{' '}
                        <span className="font-bold text-primary">
                            {studentInfo?.First_Name} {studentInfo?.Last_Name}
                        </span>{' '}
                        to pay their tuition.
                    </p>
                </div>
                <div>
                    <button className="btn btn-danger">Create 'Paid in Full' Schedule</button>
                </div>
            </div>
            <h3 className="font-semibold text-lg uppercase">Payment Methods</h3>
            <div className="grid sm:grid-cols-2 gap-x-4 w-full">
                {cards?.map((card: any) => (
                    <div className="flex items-center sm:w-96 w-full">
                        <input
                            type="checkbox"
                            id="isDefault"
                            checked={selectedPaymentMethod === card?.Id}
                            className="form-checkbox bg-white dark:bg-[#1b2e4b] mr-2"
                            onChange={() => setSelectedPaymentMethod(card?.Id)}
                        />
                        <div
                            key={card?.Id}
                            className="relative block w-full rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gradient-to-r from-primary via-emerald-500 to-primary  text-white"
                        >
                            <div className="">
                                <div className="flex items-center justify-center">
                                    <div className="text-lg font-medium">{card?.Issuer}</div>
                                    <div className="ltr:ml-2 rtl:mr-2">{card?.CreditCardNumber}</div>
                                </div>
                                <div className="text-sm text-gray-50">{card?.ExpirationDate}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-x-4 w-full">
                {bankAccounts?.map((account: any) => (
                    <div className="flex items-center sm:w-96 w-full ">
                        <input
                            type="checkbox"
                            id="isDefault"
                            checked={selectedPaymentMethod === account?.Id}
                            className="form-checkbox bg-white dark:bg-[#1b2e4b] mr-2"
                            onChange={() => setSelectedPaymentMethod(account?.Id)}
                        />
                        <div
                            key={account?.Id}
                            className="relative block w-full rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-warning focus:ring-offset-2 bg-gradient-to-r from-warning via-yellow-500 to-warning  text-white"
                        >
                            <div className="">
                                <div className="">
                                    <div className="text-lg font-medium">{account?.BankName}</div>
                                    <div className="ltr:ml-2 rtl:mr-2">{account?.AccountNumber}</div>
                                </div>
                                <div className="text-sm text-gray-50">{account?.IsCheckingAccount ? 'Checking' : 'Savings'}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="panel bg-gray-50">
                <div className="p-5 grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="amount">Amount</label>
                        <div className="flex ">
                            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                $
                            </div>
                            <input type="text" placeholder="0.00" className="form-input ltr:rounded-l-none rtl:rounded-r-none" onChange={handleAmountChange} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="frequency">Billing Frequency</label>
                        <select id="frequency" className="form-select" onChange={(e) => setScheduleInfo({ ...scheduleInfo, paymentScheduleType: e.target.value })}>
                            <option value="SpecificDayofMonth">Monthly</option>
                            <option value="Annually">Yearly</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="startdate">Start Date</label>
                        <Flatpickr
                            value={scheduleInfo.startDate}
                            className="form-input"
                            options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                            onChange={(date: any) => setScheduleInfo({ ...scheduleInfo, startDate: date })}
                        />
                    </div>
                    <div>
                        <label htmlFor="enddate">End Date</label>
                        <Flatpickr
                            value={scheduleInfo.endDate}
                            className="form-input"
                            options={{ dateFormat: 'm-d-Y', position: 'auto right' }}
                            onChange={(date: any) => setScheduleInfo({ ...scheduleInfo, endDate: date })}
                        />
                    </div>
                    <div>
                        <label htmlFor="emailForReceipt">Email For Receipt</label>
                        <input
                            type="email"
                            id="emailForReceipt"
                            className="form-input"
                            value={scheduleInfo?.emailForReceipt}
                            onChange={(e) => setScheduleInfo({ ...scheduleInfo, emailForReceipt: e.target.value })}
                        />
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="notes">Notes</label>
                        <textarea id="notes" className="form-textarea" rows={5} onChange={(e) => setScheduleInfo({ ...scheduleInfo, description: e.target.value })} />
                    </div>
                    <div className="col-span-2 flex">
                        <button className="btn btn-success sm:ml-auto w-full sm:w-auto" onClick={handleSubmitSchedule}>
                            Create Payment Schedule
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
