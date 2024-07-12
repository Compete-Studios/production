import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconBell from '../../components/Icon/IconBell';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import { getTextLogsByStudioId } from '../../functions/texts';
import { constFormateDateMMDDYYYY } from '../../functions/shared';
import { UserAuth } from '../../context/AuthContext';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { formatWithTimeZone, handleGetTimeZoneOfUser } from '../../functions/dates';
import { searchProspectsByPhone, searchStaffByPhone, searchStudentsByPhone } from '../../functions/api';

const ViewTextMessages = () => {
    const { suid, studioOptions, studioInfo }: any = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('View Text Messages'));
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [loading, setLoading] = useState(true);

    // show/hide
    const [page, setPage] = useState(1);
    const [textData, setTextData] = useState<any[]>([]);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
    const [initialRecords, setInitialRecords] = useState(sortBy(textData, 'sendDate'));
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });
    //start date is 7 days ago
    const [startDate, setStartDate] = useState<string>(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]);

    const formatDate = (date: any) => {
        if (date) {
            const dt = new Date(date);
            const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
            const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
            return month + '/' + day + '/' + dt.getFullYear();
        }
        return '';
    };

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    const totalPages = Math.ceil(initialRecords.length / pageSize);

    useEffect(() => {
        setInitialRecords(() => {
            return textData.filter((item) => {
                return (
                    item.body.toString().includes(search.toLowerCase()) ||
                    item.from.toLowerCase().includes(search.toLowerCase()) ||
                    item.recipients.some((r: any) => r.name.toLowerCase().includes(search.toLowerCase()))
                );
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortStatus]);

    // Remove +1 from the phone number if it exists and all empty spaces
    const removeNumber = (number: string) => {
        if (number[0] === '+') {
            return number.slice(2).replace(/\s/g, '');
        } else if (number[0] === '1') {
            return number.slice(1).replace(/\s/g, '');
        } else {
            return number.replace(/\s/g, '');
        }
    };

    const checkStudent = async (phoneNumber: string) => {
        try {
            const queryData = {
                studioId: suid,
                number: phoneNumber,
            };

            // Check if the phone number belongs to a staff member
            const staffResponse = await searchStaffByPhone(queryData);
            if (staffResponse.recordset.length > 0) {
                return {
                    name: staffResponse.recordset[0].FirstName + ' ' + staffResponse.recordset[0].LastName,
                    type: 'staff',
                };
            }

            // Check if the phone number belongs to a student
            const studentResponse = await searchStudentsByPhone(queryData);
            if (studentResponse.recordset.length > 0) {
                return {
                    name: studentResponse.recordset[0].First_Name + ' ' + studentResponse.recordset[0].Last_Name,
                    type: studentResponse.recordset[0].activity === 1 ? 'student' : 'inactive',
                };
            }

            // Check if the phone number belongs to a prospect
            const prospectResponse = await searchProspectsByPhone(queryData);
            if (prospectResponse.recordset.length > 0) {
                return {
                    name: prospectResponse.recordset[0].FName + ' ' + prospectResponse.recordset[0].LName,
                    type: 'prospect',
                };
            }

            // If not found in any category, return unknown
            return {
                name: phoneNumber,
                type: 'unknown',
            };
        } catch (error) {
            console.error('Error:', error);
            return {
                name: phoneNumber,
                type: 'error',
            };
        }
    };

    const handlegetlogs = async () => {
        const formatStartDate = constFormateDateMMDDYYYY(startDate);
        const formatEndDate = constFormateDateMMDDYYYY(endDate);
        const dataToSend = {
            studioId: suid,
            startDate: formatStartDate,
            endDate: formatEndDate,
        };

        try {
            const response = await getTextLogsByStudioId(dataToSend);
            const rawChatList = response.recordset;
            if (response.recordset?.length === 0) {
                setLoading(false);
                return;
            }

            const chatList = rawChatList.map((chat: any) => {
                return {
                    recipients: removeNumber(chat.ToNumber),
                    sendDate: formatWithTimeZone(chat.SendDate, handleGetTimeZoneOfUser()),
                    body: chat.Body,
                    from: removeNumber(chat.FromNumber),
                    type: removeNumber(chat.FromNumber) === removeNumber(studioOptions?.TextFromNumber) ? 'studio' : 'student',
                    isOutGoing: removeNumber(chat.FromNumber) === removeNumber(studioOptions?.TextFromNumber),
                    textID: chat.TextId,
                };
            });

            // Create an array of promises for checking 'from' numbers
            const fromChecks = chatList.map(async (chat: any) => {
                if (chat.from !== removeNumber(studioOptions?.TextFromNumber)) {
                    const fromCheck = await checkStudent(chat.from);
                    return {
                        ...chat,
                        fromName: fromCheck.name,
                        fromType: fromCheck.type,
                    };
                }
                return {
                    ...chat,
                    fromName: chat.from,
                    fromType: 'studio',
                };
            });

            // Resolve all promises concurrently
            const chatListWithFromNames = await Promise.all(fromChecks);

            // Group messages by sendDate, body, and from
            const groupedMessages = chatListWithFromNames.reduce((acc: any, chat: any) => {
                const key = `${chat.sendDate}-${chat.body}-${chat.from}`;
                if (!acc[key]) {
                    acc[key] = {
                        sendDate: chat.sendDate,
                        body: chat.body,
                        from: chat.fromName,
                        type: chat.fromType,
                        isOutGoing: chat.isOutGoing,
                        recipients: [],
                    };
                }
                acc[key].recipients.push({
                    type: 'student', // Default type; will be updated if necessary
                    name: chat.recipients === removeNumber(studioOptions?.TextFromNumber) ? studioInfo?.Studio_Name : chat.recipients,
                    phoneNumber: chat.recipients,
                    textID: chat.textID,
                });

                return acc;
            }, {});

            // Convert groupedMessages object to array
            const textMessages: any = Object.values(groupedMessages);

            // Create an array of promises for checking recipients
            const recipientChecks = textMessages.map(async (message: any) => {
                if (message.recipients.length === 1 && message.recipients[0].name !== studioInfo?.Studio_Name) {
                    const recipient = message.recipients[0];
                    const result = await checkStudent(recipient.phoneNumber);
                    recipient.name = result.name;
                    recipient.type = result.type;
                }
                return message;
            });

            // Resolve all recipient checks concurrently
            const finalTextMessages = await Promise.all(recipientChecks);

            setTextData(finalTextMessages);
            setInitialRecords(sortBy(finalTextMessages, 'sendDate'));
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        handlegetlogs();
    }, []);

    const totalPagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div>
            {loading ? (
                <div className="flex items-center justify-center h-96">
                    <div className="loader">Loading...</div>
                </div>
            ) : (
                <div className="panel">
                    <div className="flex items-start gap-4 pb-4">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-info" />
                            <div>Student</div>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <div>Prospect</div>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-danger" />
                            <div>Inactive Student</div>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-secondary" />
                            <div>Staff</div>
                        </div>
                    </div>
                    <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Search Message History</h5>
                        <div className="flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
                            <div className="text-right">
                                <input type="text" className="form-input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="datatables">
                        <div className="table-responsive mb-5">
                            <table className="table-hover">
                                <thead>
                                    <tr>
                                        <th>Date Sent</th>
                                        <th>Recipients</th>
                                        <th>Sender</th>
                                        <th className="max-w-48">Message</th>
                                        <th className="text-center">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recordsData.map((data, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="whitespace-nowrap">{formatDate(data.sendDate)}</div>
                                                </td>
                                                <td className="whitespace-nowrap">
                                                    {data.recipients?.length > 1 ? (
                                                        <>
                                                            {data.recipients.slice(0, 2).map((recipient, i) => (
                                                                <span
                                                                    key={i}
                                                                    className={`                                badge
                                    ${
                                        recipient.type === 'staff'
                                            ? 'bg-secondary/10 text-secondary ring-1 font-bold ring-inset ring-secondary'
                                            : recipient.type === 'student'
                                            ? 'bg-info/10 text-info ring-1 font-bold ring-inset ring-info'
                                            : recipient.type === 'prospect'
                                            ? 'bg-primary/10 text-primary ring-1 ring-inset font-bold ring-primary'
                                            : 'bg-danger/10 text-danger ring-1 ring-inset font-bold ring-danger'
                                    }
                                    `}
                                                                >
                                                                    {recipient.name}
                                                                </span>
                                                            ))}
                                                            {data.recipients.length > 2 && <span className="ml-1 text-xs text-gray-500">+{data.recipients.length - 2} more</span>}
                                                        </>
                                                    ) : data?.recipients[0]?.name === studioInfo?.Studio_Name ? (
                                                        <span className="badge bg-dark/10 text-dark ring-1 font-bold ring-inset ring-dark">{studioInfo?.Studio_Name}</span>
                                                    ) : (
                                                        <span
                                                            className={`
                            badge
                            ${
                                data?.recipients[0]?.type === 'staff'
                                    ? 'bg-secondary/10 text-secondary ring-1 font-bold ring-inset ring-secondary'
                                    : data?.recipients[0]?.type === 'student'
                                    ? 'bg-info/10 text-info ring-1 font-bold ring-inset ring-info'
                                    : data?.recipients[0]?.type === 'prospect'
                                    ? 'bg-primary/10 text-primary ring-1 ring-inset font-bold ring-primary'
                                    : 'bg-danger/10 text-danger ring-1 ring-inset font-bold ring-danger'
                            }
                            `}
                                                        >
                                                            {data?.recipients[0]?.name}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap">
                                                    <span
                                                        className={`
                            badge
                            ${
                                data.type === 'studio'
                                    ? 'bg-dark/10 text-dark ring-1 font-bold ring-inset ring-dark'
                                    : data?.recipients[0]?.type === 'student'
                                    ? 'bg-info/10 text-info ring-1 font-bold ring-inset ring-info'
                                    : data?.recipients[0]?.type === 'prospect'
                                    ? 'bg-primary/10 text-primary ring-1 ring-inset font-bold ring-primary'
                                    : 'bg-danger/10 text-danger ring-1 ring-inset font-bold ring-danger'
                            }`}
                                                    >
                                                        {data.from === removeNumber(studioOptions?.TextFromNumber) ? studioInfo?.Studio_Name : data.from}
                                                    </span>
                                                </td>
                                                <td className="text-pretty">
                                                    <div>{data.body}</div>
                                                </td>
                                                <td className="text-center">
                                                    <button type="button" className="text-info">
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex items-center justify-end w-full">
                        <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse mb-4">
                            <li>
                                <button
                                    type="button"
                                    className="flex justify-center font-semibold px-3.5 py-2 rounded transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                                    onClick={() => setPage(1)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-left" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                                        <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                                    </svg>
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className="flex justify-center font-semibold px-3.5 py-2 rounded transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                                    onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                                    </svg>
                                </button>
                            </li>
                            {totalPagesArray.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <button
                                            type="button"
                                            className={`flex justify-center font-semibold px-3.5 py-2 rounded transition ${
                                                page === item ? 'bg-primary text-white dark:bg-primary dark:text-white-light' : 'bg-white-light text-dark dark:bg-[#191e3a] dark:text-white-light'
                                            }`}
                                            onClick={() => setPage(item)}
                                        >
                                            {item}
                                        </button>
                                    </li>
                                );
                            })}

                            <li>
                                <button
                                    type="button"
                                    className="flex justify-center font-semibold px-3.5 py-2 rounded transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                                    onClick={() => setPage((prev) => (prev < Math.ceil(initialRecords.length / pageSize) ? prev + 1 : prev))}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                                    </svg>
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className="flex justify-center font-semibold px-3.5 py-2 rounded transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                                    onClick={() => setPage(Math.ceil(initialRecords.length / pageSize))}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708" />
                                        <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708" />
                                    </svg>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewTextMessages;
