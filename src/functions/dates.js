import { formatDate } from "@fullcalendar/core";

export const formatWithTimeZone = (date, timezone) => {
    const newDate = date !== '1900-01-01T00:00:00.000Z' ? formatDate(new Date(date), { month: 'short', day: 'numeric', year: 'numeric', timeZone: timezone }) : 'N/A';
    return newDate;
};

/// convert this StartTime "1800-01-01T16:30:00.000Z" tp 4:30 PM

export const formatHoursFromDateTime = (date, timezone) => {
    const newDate = date !== '1900-01-01T00:00:00.000Z' ? formatDate(new Date(date), { hour: 'numeric', minute: 'numeric', timeZone: timezone }) : 'N/A';
    return newDate;
};

export const handleGetTimeZoneOfUser = () => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timeZone;
};


export const convertToUserLocalDate = (utcDate, userTimeZone) => {
    const options = { timeZone: userTimeZone };
    const userLocalDate = new Date(utcDate.toLocaleString('en-US', options));
    userLocalDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 00:00:00
    return userLocalDate;
};