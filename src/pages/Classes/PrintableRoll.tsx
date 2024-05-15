import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Tab } from '@headlessui/react';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconX from '../../components/Icon/IconX';
import IconPrinter from '../../components/Icon/IconPrinter';
import { UserAuth } from '../../context/AuthContext';
import { getAttendanceByClassIdDate, getProspectsByClassId, getStudentsByClassId, getTheClassScheduleByClassId } from '../../functions/api';
import { REACT_BASE_URL } from '../../constants';

export default function PrintableRoll({ classes }: any) {
    const [showQuickPayModal, setShowQuickPayModal] = useState(false);
    const [roster, setRoster] = useState<any>([]);
    const [classID, setClassID] = useState<any>(null);
    const [scheduleDates, setScheduleDates] = useState<any>([]);
    const [month, setMonth] = useState<any>(null);
    const [includeProspects, setIncludeProspects] = useState(false);

    const handlePrintReceipt = (sDates: any, rstr: any) => {
        const htmlData: any = tableHTML(sDates, rstr);
        const printWindow = window.open('', '_blank');
        printWindow?.document.open();
        printWindow?.document.write(htmlData);
        printWindow?.document.close();
    };

    const handleGetRoster = async (classID: any) => {
        try {
            const scheduleResponse = await getTheClassScheduleByClassId(classID);
            const daysOftheWeek = scheduleResponse.recordset.map((item: any) => (item.DayIndex === 7 ? 0 : item.DayIndex + 1));
            const determineMonths = (month: any) => {
                const date = new Date();
                if (month === 'this month') {
                    return date;
                } else if (month === 'next month') {
                    return new Date(date.getFullYear(), date.getMonth() + 1, 1);
                }
                return new Date(date.getFullYear(), date.getMonth() - 1, 1);
            };

            const dates = daysOftheWeek.map((day: any) => {
                const dates = [];
                const date = determineMonths(month);
                const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                for (let i = 1; i <= lastDay; i++) {
                    const d = new Date(date.getFullYear(), date.getMonth(), i);
                    if (d.getDay() === day) {
                        dates.push(d.toISOString().split('T')[0]);
                    }
                }
                return dates;
            });
            setScheduleDates(dates.flat());
            const prospects = includeProspects ? await getProspectsByClassId(classID) : [];
            const students = await getStudentsByClassId(classID);
            const roster = [...prospects, ...students];
            setRoster(roster);
            handlePrintReceipt(dates.flat(), roster);
        } catch (error) {
            console.error(error);
        }
    };

    const tableHTML = (sDates: any, rstr: any) => {
        const htmlForEmail = `<!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Roster</title>
        </head>
        <body style="margin:0px; background: #f8f8f8; ">
            <div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;">
                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #ddd; padding: 8px;">Name</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Phone</th>
                            ${sDates.map((date: any) => `<th key=${date} style="border: 1px solid #ddd; padding: 8px;">${date}</th>`).join('')}
                        </tr>
                    </thead>
                <tbody>
                    ${rstr.map(
                        (item: any, index: any) => `
                        <tr key=${item.Student_ID} style="background-color: ${index % 2 ? '#ffffff' : '#f2f2f2'};">
                            <td style="border: 1px solid #ddd; padding: 8px;">${item.Name}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${item.Phone}</td>
                            ${sDates?.map(
                                (date: any) => `
                                <td key=${date} style="border: 1px solid #ddd; padding: 8px;"></td>
                            `
                            ).join('')}
                        </tr>
                    `
                    ).join('')}
                </tbody>
            </table>
            </div>
            <div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px">
            <p>
                Powered by CompeteServices.com <br>
                <a href="${REACT_BASE_URL}" style="color: #b2b2b5; text-decoration: underline;">Visit Us</a>
            </p>
        </div>
        </body>
        </html>`;
        return htmlForEmail;
    };
    
    

    const tableToPrint = () => {
        return (
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="border">Name</th>
                        <th className="border">Phone</th>
                        {scheduleDates.map((date: any) => (
                            <th key={date} className="border">
                                {date}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {roster.map((item: any) => (
                        <tr key={item.Student_ID}>
                            <td className="border">{item.Name}</td>
                            <td className="border">{item.Phone}</td>
                            {scheduleDates.map((date: any) => (
                                <td key={date} className="border">
                                    {roster.find((x: any) => x.Student_ID === item.Student_ID && x.Date === date) ? 'X' : ''}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div>
            <div>
                <button type="button" className="btn btn-secondary gap-2 ltr:ml-auto rtl:mr-auto" onClick={() => setShowQuickPayModal(true)}>
                    <IconPrinter />
                    Printable Roll
                </button>
            </div>
            <Transition appear show={showQuickPayModal} as={Fragment}>
                <Dialog as="div" open={showQuickPayModal} onClose={() => setShowQuickPayModal(false)} className="relative z-[51]">
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
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-3xl text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setShowQuickPayModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Printable Roll</div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-x-4">
                                            <div className="w-2/3">
                                                <label className="text-sm">Select Class</label>
                                                <select className="form-select" onChange={(e) => setClassID(e.target.value)}>
                                                    <option>Choose a Class</option>
                                                    {classes.map((item: any) => (
                                                        <option key={item.ClassId} value={item.ClassId}>
                                                            {item.Name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="w-1/3">
                                                <label className="text-sm">Select Month</label>

                                                <select className="form-select" onChange={(e) => setMonth(e.target.value)}>
                                                    <option>Choose a Month</option>
                                                    <option value="this month">This Month</option>
                                                    <option value="next month">Next Month</option>
                                                    <option value="last month">Last Month</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex">
                                            <input type="checkbox" className="form-checkbox" onChange={(e) => setIncludeProspects(e.target.checked)} />
                                            <label className="text-sm">Include Prospective Students</label>
                                        </div>
                                        <div className="mt-4 flex">
                                            <input type="checkbox" className="form-checkbox" />
                                            <label className="text-sm">Add additional blank lines</label>
                                        </div>
                                        <div className="mt-4 flex">
                                            <button type="button" className="ml-auto btn btn-secondary gap-x-2" onClick={() => handleGetRoster(classID)}>
                                                <IconPrinter /> Generate and Print Roll
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
