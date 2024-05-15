import { formatDate } from "@fullcalendar/core";

export const formatWithTimeZone = (date, timezone) => {
    const newDate = date !== '1900-01-01T00:00:00.000Z' ? formatDate(new Date(date), { month: 'short', day: 'numeric', year: 'numeric', timeZone: timezone }) : 'N/A';
    return newDate;
};



export const handleGetTimeZoneOfUser = () => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timeZone;
};
