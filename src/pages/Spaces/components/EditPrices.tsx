import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import availableTimes from '../../../assets/json/availableTimeBlocks.json';
import IconPlus from '../../../components/Icon/IconPlus';
import IconTrashLines from '../../../components/Icon/IconTrashLines';

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}

const daysAvailableInitial = {
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
};

const timesInit = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

export default function EditPrices({ prices, setPrices }: any) {
    const [daysAvailable, setDaysAvailable] = useState<any>(daysAvailableInitial);
    const [mondayTimes, setMondayTimes] = useState<any[]>([]);
    const [tuesdayTimes, setTuesdayTimes] = useState<any[]>([]);
    const [wednesdayTimes, setWednesdayTimes] = useState<any[]>([]);
    const [thursdayTimes, setThursdayTimes] = useState<any[]>([]);
    const [fridayTimes, setFridayTimes] = useState<any[]>([]);
    const [saturdayTimes, setSaturdayTimes] = useState<any[]>([]);
    const [sundayTimes, setSundayTimes] = useState<any[]>([]);
    const [sundayTimeSlots, setSundayTimeSlots] = useState<any[]>([]);
    const [mondayTimeSlots, setMondayTimeSlots] = useState<any[]>([]);
    const [tuesdayTimeSlots, setTuesdayTimeSlots] = useState<any[]>([]);
    const [wednesdayTimeSlots, setWednesdayTimeSlots] = useState<any[]>([]);
    const [thursdayTimeSlots, setThursdayTimeSlots] = useState<any[]>([]);
    const [fridayTimeSlots, setFridayTimeSlots] = useState<any[]>([]);
    const [saturdayTimeSlots, setSaturdayTimeSlots] = useState<any[]>([]);

    const timeOptions = Object.values(availableTimes)[0];

    const addTimeSlot = (day: any) => {
        const newTimeSlot = {
            startTime: '12:00am', // Set default values for start and end time
            endTime: '11:00pm',
            price: '0',
        };
        switch (
            day // Corrected typo from 'swtich' to 'switch'
        ) {
            case 'sunday':
                setSundayTimeSlots([...sundayTimeSlots, newTimeSlot]);
                break;
            case 'monday':
                setMondayTimeSlots([...mondayTimeSlots, newTimeSlot]);
                break;
            case 'tuesday':
                setTuesdayTimeSlots([...tuesdayTimeSlots, newTimeSlot]);
                break;
            case 'wednesday':
                setWednesdayTimeSlots([...wednesdayTimeSlots, newTimeSlot]);
                break;
            case 'thursday':
                setThursdayTimeSlots([...thursdayTimeSlots, newTimeSlot]);
                break;
            case 'friday':
                setFridayTimeSlots([...fridayTimeSlots, newTimeSlot]);
                break;
            case 'saturday':
                setSaturdayTimeSlots([...saturdayTimeSlots, newTimeSlot]);
                break;
            default:
                break;
        }
    };

    const removeTimeSlot = (index: any, day: any) => {
        let updatedTimeSlots;
        switch (day) {
            case 'sunday':
                updatedTimeSlots = [...sundayTimeSlots];
                updatedTimeSlots.splice(index, 1);
                setSundayTimeSlots(updatedTimeSlots);
                break;
            case 'monday':
                updatedTimeSlots = [...mondayTimeSlots];
                updatedTimeSlots.splice(index, 1);
                setMondayTimeSlots(updatedTimeSlots);
                break;
            case 'tuesday':
                updatedTimeSlots = [...tuesdayTimeSlots];
                updatedTimeSlots.splice(index, 1);
                setTuesdayTimeSlots(updatedTimeSlots);
                break;
            case 'wednesday':
                updatedTimeSlots = [...wednesdayTimeSlots];
                updatedTimeSlots.splice(index, 1);
                setWednesdayTimeSlots(updatedTimeSlots);
                break;
            case 'thursday':
                updatedTimeSlots = [...thursdayTimeSlots];
                updatedTimeSlots.splice(index, 1);
                setThursdayTimeSlots(updatedTimeSlots);
                break;
            case 'friday':
                updatedTimeSlots = [...fridayTimeSlots];
                updatedTimeSlots.splice(index, 1);
                setFridayTimeSlots(updatedTimeSlots);
                break;
            case 'saturday':
                updatedTimeSlots = [...saturdayTimeSlots];
                updatedTimeSlots.splice(index, 1);
                setSaturdayTimeSlots(updatedTimeSlots);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        // add time values from availableTimes to sundayTimes
        if (daysAvailable.sunday && sundayTimeSlots.length === 0) {
            setSundayTimes(timesInit);
        } else {
            const timeSlots: any[] = [];
            sundayTimeSlots.forEach((timeSlot) => {
                const startTime: any = timeOptions.find((time) => time.displayValue === timeSlot.startTime);
                const endTime: any = timeOptions.find((time) => time.displayValue === timeSlot.endTime);

                // Convert start and end times to integers
                const startHour: any = parseInt(startTime.dbvalue);
                const endHour: any = parseInt(endTime.dbvalue);

                // Create an array of hours from start to end
                for (let i = startHour; i < endHour; i++) {
                    // Check if the time slot already exists in sundayTimes
                    if (!timeSlots.includes(i)) {
                        timeSlots.push(i);
                    }
                }
            });
            setSundayTimes(timeSlots);
        }
    }, [sundayTimeSlots, timeOptions]);

    useEffect(() => {
        // add time values from availableTimes to saturdayTimes
        if (daysAvailable.saturday && saturdayTimeSlots.length === 0) {
            setSaturdayTimes(timesInit);
        } else {
            const timeSlots: any[] = [];
            saturdayTimeSlots.forEach((timeSlot) => {
                const startTime: any = timeOptions.find((time) => time.displayValue === timeSlot.startTime);
                const endTime: any = timeOptions.find((time) => time.displayValue === timeSlot.endTime);

                // Convert start and end times to integers
                const startHour = parseInt(startTime.dbvalue);
                const endHour = parseInt(endTime.dbvalue);

                // Create an array of hours from start to end
                for (let i = startHour; i < endHour; i++) {
                    // Check if the time slot already exists in sundayTimes
                    if (!timeSlots.includes(i)) {
                        timeSlots.push(i);
                    }
                }
            });
            setSaturdayTimes(timeSlots);
        }
    }, [saturdayTimeSlots, timeOptions]);

    useEffect(() => {
        if (daysAvailable.tuesday && tuesdayTimeSlots.length === 0) {
            setTuesdayTimes(timesInit);
        } else {
            // add time values from availableTimes to tuesdayTimes
            const timeSlots: any[] = [];
            tuesdayTimeSlots.forEach((timeSlot) => {
                const startTime: any = timeOptions.find((time) => time.displayValue === timeSlot.startTime);
                const endTime: any = timeOptions.find((time) => time.displayValue === timeSlot.endTime);

                // Convert start and end times to integers
                const startHour = parseInt(startTime.dbvalue);
                const endHour = parseInt(endTime.dbvalue);

                // Create an array of hours from start to end
                for (let i = startHour; i < endHour; i++) {
                    // Check if the time slot already exists in sundayTimes
                    if (!timeSlots.includes(i)) {
                        timeSlots.push(i);
                    }
                }
            });
            setTuesdayTimes(timeSlots);
        }
    }, [tuesdayTimeSlots, timeOptions]);

    useEffect(() => {
        if (daysAvailable.monday && mondayTimeSlots.length === 0) {
            setMondayTimes(timesInit);
        } else {
            const timeSlots: any = [];
            mondayTimeSlots.forEach((timeSlot) => {
                const startTime: any = timeOptions.find((time) => time.displayValue === timeSlot.startTime);
                const endTime: any = timeOptions.find((time) => time.displayValue === timeSlot.endTime);

                // Convert start and end times to integers
                const startHour: any = parseInt(startTime.dbvalue);
                const endHour: any = parseInt(endTime.dbvalue);

                // Create an array of hours from start to end
                for (let i = startHour; i < endHour; i++) {
                    // Check if the time slot already exists in sundayTimes
                    if (!timeSlots.includes(i)) {
                        timeSlots.push(i);
                    }
                }
            });
            setMondayTimes(timeSlots);
        }
    }, [mondayTimeSlots, timeOptions]);

    useEffect(() => {
        if (daysAvailable.wednesday && wednesdayTimeSlots.length === 0) {
            setWednesdayTimes(timesInit);
        } else {
            const timeSlots: any[] = [];
            wednesdayTimeSlots.forEach((timeSlot) => {
                const startTime: any = timeOptions.find((time) => time.displayValue === timeSlot.startTime);
                const endTime: any = timeOptions.find((time) => time.displayValue === timeSlot.endTime);

                // Convert start and end times to integers
                const startHour: any = parseInt(startTime.dbvalue);
                const endHour: any = parseInt(endTime.dbvalue);

                // Create an array of hours from start to end
                for (let i = startHour; i < endHour; i++) {
                    // Check if the time slot already exists in sundayTimes
                    if (!timeSlots.includes(i)) {
                        timeSlots.push(i);
                    }
                }
            });
            setWednesdayTimes(timeSlots);
        }
    }, [wednesdayTimeSlots, timeOptions]);

    useEffect(() => {
        // add time values from availableTimes to thursdayTimes
        if (daysAvailable.thursday && thursdayTimeSlots.length === 0) {
            setThursdayTimes(timesInit);
        } else {
            const timeSlots: any[] = [];
            thursdayTimeSlots.forEach((timeSlot) => {
                const startTime: any = timeOptions.find((time) => time.displayValue === timeSlot.startTime);
                const endTime: any = timeOptions.find((time) => time.displayValue === timeSlot.endTime);

                // Convert start and end times to integers
                const startHour: any = parseInt(startTime.dbvalue);
                const endHour: any = parseInt(endTime.dbvalue);

                // Create an array of hours from start to end
                for (let i = startHour; i < endHour; i++) {
                    // Check if the time slot already exists in sundayTimes
                    if (!timeSlots.includes(i)) {
                        timeSlots.push(i);
                    }
                }
            });
            setThursdayTimes(timeSlots);
        }
    }, [thursdayTimeSlots, timeOptions]);

    useEffect(() => {
        // add time values from availableTimes to fridayTimes
        if (daysAvailable.friday && fridayTimeSlots.length === 0) {
            setFridayTimes(timesInit);
        } else {
            const timeSlots: any[] = [];
            fridayTimeSlots.forEach((timeSlot) => {
                const startTime: any = timeOptions.find((time) => time.displayValue === timeSlot.startTime);
                const endTime: any = timeOptions.find((time) => time.displayValue === timeSlot.endTime);

                // Convert start and end times to integers
                const startHour: any = parseInt(startTime.dbvalue);
                const endHour: any = parseInt(endTime.dbvalue);

                // Create an array of hours from start to end
                for (let i = startHour; i < endHour; i++) {
                    // Check if the time slot already exists in sundayTimes
                    if (!timeSlots.includes(i)) {
                        timeSlots.push(i);
                    }
                }
            });
            setFridayTimes(timeSlots);
        }
    }, [fridayTimeSlots, timeOptions]);

    const handleSetAvailableDaysAndTimes = (day: any, setDayTimes: any) => {
        if (day) {
            setDaysAvailable({ ...daysAvailable, [day]: !daysAvailable[day] });
            const boool = daysAvailable[day];
            if (boool) {
                setDayTimes([]);
            } else {
                setDayTimes(timesInit);
            }
        }
    };

    const price = {
        // sunday: sundayTimes,
        // monday: mondayTimes,
        // tuesday: tuesdayTimes,
        // wednesday: wednesdayTimes,
        // thursday: thursdayTimes,
        // friday: fridayTimes,
        // saturday: saturdayTimes,
        // daysAvailable: daysAvailable,
        // mondayTimeSlots: mondayTimeSlots,
        sundayTimeSlots: sundayTimeSlots,
    };

    console.log('price', price);

    return (
        <div className="">
            <div className="divide-y divide-gray-200 overflow-hidden rounded-xl text-white bg-zinc-900 shadow">
                <div className="px-4 py-5 sm:p-6">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <h3 className="text-base font-semibold leading-6 flex items-center">Availability and Pricing</h3>
                        <div className="flex items-center justify-between gap-4 mt-2 sm:mt-0">
                            <button
                                className={`rounded-full w-12 h-12 p-2 font-bold ${daysAvailable.sunday ? 'text-zinc-950 bg-lime-300 hover:bg-lime-200 ' : 'hover:bg-zinc-800'}`}
                                onClick={() => handleSetAvailableDaysAndTimes('sunday', setSundayTimes)}
                            >
                                S
                            </button>
                            <button
                                className={`rounded-full w-12 h-12 p-2 font-bold ${daysAvailable.monday ? 'text-zinc-950 bg-lime-300 hover:bg-lime-200 ' : 'hover:bg-zinc-800'}`}
                                onClick={() => handleSetAvailableDaysAndTimes('monday', setMondayTimes)}
                            >
                                M
                            </button>
                            <button
                                className={`rounded-full w-12 h-12 p-2 font-bold ${daysAvailable.tuesday ? 'text-zinc-950 bg-lime-300 hover:bg-lime-200 ' : 'hover:bg-zinc-800'}`}
                                onClick={() => handleSetAvailableDaysAndTimes('tuesday', setTuesdayTimes)}
                            >
                                T
                            </button>
                            <button
                                className={`rounded-full w-12 h-12 p-2 font-bold ${daysAvailable.wednesday ? 'text-zinc-950 bg-lime-300 hover:bg-lime-200 ' : 'hover:bg-zinc-800'}`}
                                onClick={() => handleSetAvailableDaysAndTimes('wednesday', setWednesdayTimes)}
                            >
                                W
                            </button>
                            <button
                                className={`rounded-full w-12 h-12 p-2 font-bold ${daysAvailable.thursday ? 'text-zinc-950 bg-lime-300 hover:bg-lime-200 ' : 'hover:bg-zinc-800'}`}
                                onClick={() => handleSetAvailableDaysAndTimes('thursday', setThursdayTimes)}
                            >
                                T
                            </button>
                            <button
                                className={`rounded-full w-12 h-12 p-2 font-bold ${daysAvailable.friday ? 'text-zinc-950 bg-lime-300 hover:bg-lime-200 ' : 'hover:bg-zinc-800'}`}
                                onClick={() => handleSetAvailableDaysAndTimes('friday', setFridayTimes)}
                            >
                                F
                            </button>
                            <button
                                className={`rounded-full w-12 h-12 p-2 font-bold ${daysAvailable.saturday ? 'text-zinc-950 bg-lime-300 hover:bg-lime-200 ' : 'hover:bg-zinc-800'}`}
                                onClick={() => handleSetAvailableDaysAndTimes('saturday', setSaturdayTimes)}
                            >
                                S
                            </button>
                        </div>
                    </div>

                    <div>
                        {daysAvailable.sunday && (
                            <div className="grid grid-cols-3 mt-6">
                                <div className="flex items-end gap-2 col-span-3 mb-1">
                                    <div className="font-bold text-lg">Sunday</div>

                                    <div className="text-zinc-400">{sundayTimes.length === 24 ? '' : sundayTimes?.length + ' hours'}</div>
                                    <button
                                        className="text-info ml-auto font-semibold hover:text-lime-400 flex items-center gap-1"
                                        onClick={() => {
                                            addTimeSlot('sunday'); // Add a new time slot when the plus icon is clicked
                                        }}
                                    >
                                        <IconPlus /> Add Time Slot
                                    </button>
                                </div>
                                {sundayTimeSlots?.length > 0 && (
                                    <div className="col-span-full space-y-2 ">
                                        {sundayTimeSlots.map((timeSlot, index) => (
                                            <div key={index} className="flex items-center gap-1 bg-zinc-700/80 rounded-xl p-2">
                                                <select
                                                    className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10 form-select"
                                                    value={timeSlot.startTime}
                                                    onChange={(e) => {
                                                        const updatedTimeSlots = [...sundayTimeSlots];
                                                        updatedTimeSlots[index].startTime = e.target.value;
                                                        setSundayTimeSlots(updatedTimeSlots);
                                                    }}
                                                >
                                                    {timeOptions.map((time) => (
                                                        <option key={time.dbvalue} value={time.displayValue}>
                                                            {time.displayValue}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="font-bold">-</div>
                                                <select
                                                    className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10 form-select"
                                                    defaultValue="Canada"
                                                    value={timeSlot.endTime}
                                                    onChange={(e) => {
                                                        const updatedTimeSlots = [...sundayTimeSlots];
                                                        updatedTimeSlots[index].endTime = e.target.value;
                                                        setSundayTimeSlots(updatedTimeSlots);
                                                    }}
                                                >
                                                    {timeOptions.map((time) => (
                                                        <option key={time.dbvalue} value={time.displayValue}>
                                                            {time.displayValue}
                                                        </option>
                                                    ))}
                                                </select>

                                                <div className="ml-auto flex items-center justify-center gap-2 xl:pl-6">
                                                    <div className="relative rounded-md shadow-sm">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <span className="text-gray-500 sm:text-sm">$</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="price"
                                                            id="price"
                                                            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                            placeholder="0.00"
                                                            aria-describedby="price-currency"
                                                            onChange={(e) => {
                                                                const updatedTimeSlots = [...sundayTimeSlots];
                                                                updatedTimeSlots[index].price = e.target.value;
                                                                setSundayTimeSlots(updatedTimeSlots);
                                                            }}
                                                        />
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                            <span className="text-gray-500 sm:text-sm" id="price-currency">
                                                                per hour
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button className="text-white font-semibold hover:text-red-400" onClick={() => removeTimeSlot(index, 'sunday')}>
                                                        <IconTrashLines />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {daysAvailable.monday && (
                            <div className="grid grid-cols-3 mt-4">
                                <div className="flex items-end gap-2 col-span-3 mb-1">
                                    <div className="font-bold text-lg">Monday</div>
                                    <div className="text-zinc-400">{mondayTimes.length === 24 ? '' : mondayTimes?.length + ' hours'}</div>

                                    <button
                                        className="text-info ml-auto font-semibold hover:text-lime-400 flex items-center gap-1"
                                        onClick={() => {
                                            addTimeSlot('monday'); // Add a new time slot when the plus icon is clicked
                                        }}
                                    >
                                        <IconPlus /> Add Time Slot
                                    </button>
                                </div>

                                {mondayTimeSlots?.length > 0 && (
                                    <div className="col-span-full space-y-2">
                                        {mondayTimeSlots.map((timeSlot, index) => (
                                            <div key={index} className="flex items-center gap-1 bg-zinc-700/80 rounded-xl p-2">
                                                <select
                                                    className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                    defaultValue="Canada"
                                                    value={timeSlot.startTime}
                                                    onChange={(e) => {
                                                        const updatedTimeSlots = [...mondayTimeSlots];
                                                        updatedTimeSlots[index].startTime = e.target.value;
                                                        setMondayTimeSlots(updatedTimeSlots);
                                                    }}
                                                >
                                                    {timeOptions.map((time) => (
                                                        <option key={time.dbvalue} value={time.displayValue}>
                                                            {time.displayValue}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="font-bold">-</div>
                                                <select
                                                    className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                    defaultValue="Canada"
                                                    value={timeSlot.endTime}
                                                    onChange={(e) => {
                                                        const updatedTimeSlots = [...mondayTimeSlots];
                                                        updatedTimeSlots[index].endTime = e.target.value;
                                                        setMondayTimeSlots(updatedTimeSlots);
                                                    }}
                                                >
                                                    {timeOptions.map((time) => (
                                                        <option key={time.dbvalue} value={time.displayValue}>
                                                            {time.displayValue}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="ml-auto flex items-center justify-center gap-2 xl:pl-6">
                                                    <div className="relative rounded-md shadow-sm">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <span className="text-gray-500 sm:text-sm">$</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="price"
                                                            id="price"
                                                            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                            placeholder="0.00"
                                                            aria-describedby="price-currency"
                                                            onChange={(e) => {
                                                                const updatedTimeSlots = [...mondayTimeSlots];
                                                                updatedTimeSlots[index].price = e.target.value;
                                                                setMondayTimeSlots(updatedTimeSlots);
                                                            }}
                                                        />
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                            <span className="text-gray-500 sm:text-sm" id="price-currency">
                                                                per hour
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button className="text-white font-semibold hover:text-red-400" onClick={() => removeTimeSlot(index, 'monday')}>
                                                        <IconTrashLines />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {daysAvailable.tuesday && (
                            <div className="grid grid-cols-3 mt-4">
                                <div className="flex items-end gap-2 col-span-3 mb-1">
                                    <div className="font-bold text-lg">Tuesday</div>
                                    <div className="text-zinc-400">{tuesdayTimes.length === 24 ? '' : tuesdayTimes?.length + ' hours'}</div>

                                    <button
                                        className="text-info ml-auto font-semibold hover:text-lime-400 flex items-center gap-1"
                                        onClick={() => {
                                            addTimeSlot('tuesday'); // Add a new time slot when the plus icon is clicked
                                        }}
                                    >
                                        <IconPlus /> Add Time Slot
                                    </button>
                                </div>
                                {tuesdayTimeSlots?.length > 0 && (
                                    <div className="col-span-full space-y-2">
                                        {tuesdayTimeSlots.map((timeSlot, index) => (
                                            <div key={index} className="flex items-center gap-1 bg-zinc-700/80 rounded-xl p-2">
                                                <select
                                                    className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                    defaultValue="Canada"
                                                    value={timeSlot.startTime}
                                                    onChange={(e) => {
                                                        const updatedTimeSlots = [...tuesdayTimeSlots];
                                                        updatedTimeSlots[index].startTime = e.target.value;
                                                        setTuesdayTimeSlots(updatedTimeSlots);
                                                    }}
                                                >
                                                    {timeOptions.map((time) => (
                                                        <option key={time.dbvalue} value={time.displayValue}>
                                                            {time.displayValue}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="font-bold">-</div>
                                                <select
                                                    className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                    defaultValue="Canada"
                                                    value={timeSlot.endTime}
                                                    onChange={(e) => {
                                                        const updatedTimeSlots = [...tuesdayTimeSlots];
                                                        updatedTimeSlots[index].endTime = e.target.value;
                                                        setTuesdayTimeSlots(updatedTimeSlots);
                                                    }}
                                                >
                                                    {timeOptions.map((time) => (
                                                        <option key={time.dbvalue} value={time.displayValue}>
                                                            {time.displayValue}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="ml-auto flex items-center justify-center gap-2 xl:pl-6">
                                                    <div className="relative rounded-md shadow-sm">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <span className="text-gray-500 sm:text-sm">$</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="price"
                                                            id="price"
                                                            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                            placeholder="0.00"
                                                            aria-describedby="price-currency"
                                                            onChange={(e) => {
                                                                const updatedTimeSlots = [...tuesdayTimeSlots];
                                                                updatedTimeSlots[index].price = e.target.value;
                                                                setTuesdayTimeSlots(updatedTimeSlots);
                                                            }}
                                                        />
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                            <span className="text-gray-500 sm:text-sm" id="price-currency">
                                                                per hour
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button className="text-white font-semibold hover:text-red-400" onClick={() => removeTimeSlot(index, 'tuesday')}>
                                                        <IconTrashLines />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {daysAvailable.wednesday && (
                            <div className="grid grid-cols-3 mt-4">
                                <div className="flex items-end gap-2 col-span-3 mb-1">
                                    <div className="font-bold text-lg">Wednesday</div>
                                    <div className="text-zinc-400"> {wednesdayTimes.length === 24 ? '' : wednesdayTimes?.length + ' hours'}</div>

                                    <button
                                        className="text-info ml-auto font-semibold hover:text-lime-400 flex items-center gap-1"
                                        onClick={() => {
                                            addTimeSlot('wednesday'); // Add a new time slot when the plus icon is clicked
                                        }}
                                    >
                                        <IconPlus /> Add Time Slot
                                    </button>
                                </div>

                                {wednesdayTimeSlots?.length > 0 && (
                                    <div className="col-span-3 space-y-2">
                                        {wednesdayTimeSlots.map((timeSlot, index) => (
                                            <div key={index} className="flex items-center gap-1 bg-zinc-700/80 rounded-xl p-2">
                                                <select
                                                    className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                    defaultValue="Canada"
                                                    value={timeSlot.startTime}
                                                    onChange={(e) => {
                                                        const updatedTimeSlots = [...wednesdayTimeSlots];
                                                        updatedTimeSlots[index].startTime = e.target.value;
                                                        setWednesdayTimeSlots(updatedTimeSlots);
                                                    }}
                                                >
                                                    {timeOptions.map((time) => (
                                                        <option key={time.dbvalue} value={time.displayValue}>
                                                            {time.displayValue}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="font-bold">-</div>
                                                <select
                                                    className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                    defaultValue="Canada"
                                                    value={timeSlot.endTime}
                                                    onChange={(e) => {
                                                        const updatedTimeSlots = [...wednesdayTimeSlots];
                                                        updatedTimeSlots[index].endTime = e.target.value;
                                                        setWednesdayTimeSlots(updatedTimeSlots);
                                                    }}
                                                >
                                                    {timeOptions.map((time) => (
                                                        <option key={time.dbvalue} value={time.displayValue}>
                                                            {time.displayValue}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="ml-auto flex items-center justify-center gap-2 xl:pl-6">
                                                    <div className="relative rounded-md shadow-sm">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <span className="text-gray-500 sm:text-sm">$</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="price"
                                                            id="price"
                                                            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                            placeholder="0.00"
                                                            aria-describedby="price-currency"
                                                            onChange={(e) => {
                                                                const updatedTimeSlots = [...wednesdayTimeSlots];
                                                                updatedTimeSlots[index].price = e.target.value;
                                                                setWednesdayTimeSlots(updatedTimeSlots);
                                                            }}
                                                        />
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                            <span className="text-gray-500 sm:text-sm" id="price-currency">
                                                                per hour
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button className="text-white font-semibold hover:text-red-400" onClick={() => removeTimeSlot(index, 'wednesday')}>
                                                        <IconTrashLines />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {daysAvailable.thursday && (
                            <div className="grid grid-cols-3 mt-6">
                                <div className="flex items-end gap-2 col-span-3 mb-1">
                                    <div className="font-bold text-lg">Thursday</div>
                                    <div className="text-zinc-400">{thursdayTimes.length === 24 ? '' : thursdayTimes?.length + ' hours'}</div>

                                    <button
                                        className="text-info ml-auto font-semibold hover:text-lime-400 flex items-center gap-1"
                                        onClick={() => {
                                            addTimeSlot('thursday'); // Add a new time slot when the plus icon is clicked
                                        }}
                                    >
                                        <IconPlus /> Add Time Slot
                                    </button>
                                </div>
                                {thursdayTimeSlots?.length > 0 && (
                                    <div className="col-span-3 space-y-2 ">
                                        {thursdayTimeSlots.map((timeSlot, index) => (
                                            <div key={index} className="flex items-center gap-1 bg-zinc-700/80 rounded-xl p-2">
                                                <select
                                                    className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                    defaultValue="Canada"
                                                    value={timeSlot.startTime}
                                                    onChange={(e) => {
                                                        const updatedTimeSlots = [...thursdayTimeSlots];
                                                        updatedTimeSlots[index].startTime = e.target.value;
                                                        setThursdayTimeSlots(updatedTimeSlots);
                                                    }}
                                                >
                                                    {timeOptions.map((time) => (
                                                        <option key={time.dbvalue} value={time.displayValue}>
                                                            {time.displayValue}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="font-bold">-</div>
                                                <select
                                                    className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                    defaultValue="Canada"
                                                    value={timeSlot.endTime}
                                                    onChange={(e) => {
                                                        const updatedTimeSlots = [...thursdayTimeSlots];
                                                        updatedTimeSlots[index].endTime = e.target.value;
                                                        setThursdayTimeSlots(updatedTimeSlots);
                                                    }}
                                                >
                                                    {timeOptions.map((time) => (
                                                        <option key={time.dbvalue} value={time.displayValue}>
                                                            {time.displayValue}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="ml-auto flex items-center justify-center gap-2 xl:pl-6">
                                                    <div className="relative rounded-md shadow-sm">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <span className="text-gray-500 sm:text-sm">$</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="price"
                                                            id="price"
                                                            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                            placeholder="0.00"
                                                            aria-describedby="price-currency"
                                                            onChange={(e) => {
                                                                const updatedTimeSlots = [...thursdayTimeSlots];
                                                                updatedTimeSlots[index].price = e.target.value;
                                                                setThursdayTimeSlots(updatedTimeSlots);
                                                            }}
                                                        />
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                            <span className="text-gray-500 sm:text-sm" id="price-currency">
                                                                per hour
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button className="text-white font-semibold hover:text-red-400" onClick={() => removeTimeSlot(index, 'thursday')}>
                                                        <IconTrashLines />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {daysAvailable.friday && (
                            <div className="grid grid-cols-3 mt-4">
                                <div className="flex items-end gap-2 col-span-3 mb-1">
                                    <div className="font-bold text-lg">Friday</div>
                                    <div className="text-zinc-400"> {fridayTimes.length === 24 ? ' ' : fridayTimes?.length + ' hours'}</div>

                                    <button
                                        className="text-info ml-auto font-semibold hover:text-lime-400 flex items-center gap-1"
                                        onClick={() => {
                                            addTimeSlot('friday'); // Add a new time slot when the plus icon is clicked
                                        }}
                                    >
                                        <IconPlus /> Add Time Slot
                                    </button>
                                </div>
                                {fridayTimeSlots?.length > 0 && (
                                    <div className="col-span-3 space-y-2">
                                        {fridayTimeSlots.map((timeSlot, index) => (
                                            <div key={index} className="flex items-center gap-1 bg-zinc-700/80 rounded-xl p-2">
                                                <select
                                                    className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                    defaultValue="Canada"
                                                    value={timeSlot.startTime}
                                                    onChange={(e) => {
                                                        const updatedTimeSlots = [...fridayTimeSlots];
                                                        updatedTimeSlots[index].startTime = e.target.value;
                                                        setFridayTimeSlots(updatedTimeSlots);
                                                    }}
                                                >
                                                    {timeOptions.map((time) => (
                                                        <option key={time.dbvalue} value={time.displayValue}>
                                                            {time.displayValue}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="font-bold">-</div>
                                                <select
                                                    className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                    defaultValue="Canada"
                                                    value={timeSlot.endTime}
                                                    onChange={(e) => {
                                                        const updatedTimeSlots = [...fridayTimeSlots];
                                                        updatedTimeSlots[index].endTime = e.target.value;
                                                        setFridayTimeSlots(updatedTimeSlots);
                                                    }}
                                                >
                                                    {timeOptions.map((time) => (
                                                        <option key={time.dbvalue} value={time.displayValue}>
                                                            {time.displayValue}
                                                        </option>
                                                    ))}
                                                </select>

                                                <div className="ml-auto flex items-center justify-center gap-2 xl:pl-6">
                                                    <div className="relative rounded-md shadow-sm">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <span className="text-gray-500 sm:text-sm">$</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="price"
                                                            id="price"
                                                            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                            placeholder="0.00"
                                                            aria-describedby="price-currency"
                                                            onChange={(e) => {
                                                                const updatedTimeSlots = [...fridayTimeSlots];
                                                                updatedTimeSlots[index].price = e.target.value;
                                                                setFridayTimeSlots(updatedTimeSlots);
                                                            }}
                                                        />
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                            <span className="text-gray-500 sm:text-sm" id="price-currency">
                                                                per hour
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button className="text-white font-semibold hover:text-red-400" onClick={() => removeTimeSlot(index, 'friday')}>
                                                        <IconTrashLines />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {daysAvailable.saturday && (
                            <div className="grid grid-cols-3 mt-4">
                                <div className="flex items-end gap-2 col-span-3 mb-1">
                                    <div className="font-bold text-lg">Saturday</div>
                                    <div className="text-zinc-400">{saturdayTimes.length === 24 ? '' : saturdayTimes?.length + ' hours'}</div>

                                    <button
                                        className="text-info ml-auto font-semibold hover:text-lime-400 flex items-center gap-1"
                                        onClick={() => {
                                            addTimeSlot('saturday'); // Add a new time slot when the plus icon is clicked
                                        }}
                                    >
                                        <IconPlus /> Add Time Slot
                                    </button>
                                </div>
                                {saturdayTimeSlots?.length > 0 && (
                                    <div className="col-span-3 space-y-2">
                                        {saturdayTimeSlots.map((timeSlot, index) => (
                                            <div key={index} className="flex items-center gap-1 bg-zinc-700/80 rounded-xl p-2">
                                                <select
                                                    className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                    defaultValue="Canada"
                                                    value={timeSlot.startTime}
                                                    onChange={(e) => {
                                                        const updatedTimeSlots = [...saturdayTimeSlots];
                                                        updatedTimeSlots[index].startTime = e.target.value;
                                                        setSaturdayTimeSlots(updatedTimeSlots);
                                                    }}
                                                >
                                                    {timeOptions.map((time) => (
                                                        <option key={time.dbvalue} value={time.displayValue}>
                                                            {time.displayValue}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="font-bold">-</div>
                                                <select
                                                    className="block w-36 rounded-md border-0 py-1.5 pl-3 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                    defaultValue="Canada"
                                                    value={timeSlot.endTime}
                                                    onChange={(e) => {
                                                        const updatedTimeSlots = [...saturdayTimeSlots];
                                                        updatedTimeSlots[index].endTime = e.target.value;
                                                        setSaturdayTimeSlots(updatedTimeSlots);
                                                    }}
                                                >
                                                    {timeOptions.map((time) => (
                                                        <option key={time.dbvalue} value={time.displayValue}>
                                                            {time.displayValue}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="ml-auto flex items-center justify-center gap-2 xl:pl-6">
                                                    <div className="relative rounded-md shadow-sm">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <span className="text-gray-500 sm:text-sm">$</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="price"
                                                            id="price"
                                                            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-10 text-white ring-2 ring-inset ring-zinc-400 focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6 bg-zinc-800 h-10"
                                                            placeholder="0.00"
                                                            aria-describedby="price-currency"
                                                            onChange={(e) => {
                                                                const updatedTimeSlots = [...saturdayTimeSlots];
                                                                updatedTimeSlots[index].price = e.target.value;
                                                                setSaturdayTimeSlots(updatedTimeSlots);
                                                            }}
                                                        />
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                            <span className="text-gray-500 sm:text-sm" id="price-currency">
                                                                per hour
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button className="text-white font-semibold hover:text-red-400" onClick={() => removeTimeSlot(index, 'saturday')}>
                                                        <IconTrashLines />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="md:col-start-4 md:col-end-8">
                <p className="text-xs text-gray-500 mt-2">
                    *<span className="font-bold">All prices are negotiable, this is just a base price to help us give renter the most accurate estimated quote.</span> A renter will be required to tell
                    you the use case and you can adjust the price accordingly. You can also update a security deposit to protect your space.
                </p>
            </div>
        </div>
    );
}
