import { useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { fetchFromAPI } from "../../functions/shared";
import { format, set } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getBirthdaysByStudioId } from "../../functions/api";

const Birthdays = () => {
    const { suid }: any = UserAuth();
    const [loading, setLoading] = useState(false);
    const [birthdays, setBirthdays] = useState([]);
    const currentMonthIndex = new Date().getMonth();
    // The database sproc expects a 1-based month index, Jan = 1, Feb = 2, etc.
    const [month, setMonth] = useState(currentMonthIndex + 1);

    const getBirthdaysForReports = async (suid: any, monthIndex: any) => {
        try {
           const response = await getBirthdaysByStudioId(suid, monthIndex);
            return response.recordset;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    function setDateToLocal(dateString: any) {
        // Extract date parts (year, month, day) from the dateString
        const [year, month, day] = dateString.split('T')[0].split('-');

        // Construct a date string in the format 'yyyy/mm/dd'
        const formattedDateString = `${year}/${month}/${day}`;

        // Create a new Date object from the formatted string
        const localDate = new Date(formattedDateString);

        return localDate;
    }

    // Get all students who have birthdays in the current month
    const getBirthdays = async () => {
        setLoading(true);
        try {
            const birthdays: any = await getBirthdaysForReports(suid, month);

            const formattedBirthdays = birthdays.map((birthday: any) => {
                let dob = new Date(birthday.Birthdate);
                console.log('DOB:', dob);
                const currentYear = new Date().getFullYear();

                // Set the year to the current year
                dob = new Date(dob.setFullYear(currentYear));

                // Set the birthday to local time
                dob = setDateToLocal(dob.toISOString());

                // Ensure the date is valid
                if (isNaN(dob.getTime())) {
                    console.error("Invalid date for", birthday);
                    return null;
                }
                return {
                    title: `${birthday.First_Name} ${birthday.Last_Name}`,
                    date: format(dob, "yyyy-MM-dd"),
                }
            }).filter((event: any) => !!event); //Filter out null values

            console.log('GET BIRTHDAYS RAN');
            setBirthdays(formattedBirthdays);

        } catch (error) {
            console.log(error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const handleMonthChange = (info: any) => {
        const newMonth = info.view.currentStart.getMonth() + 1;
        console.log('NEW MONTH:', newMonth, 'CURRENT MONTH:', month);
        if (newMonth !== month) {
            setMonth(newMonth);
        }
    };

    useEffect(() => {
        if (month) {
            getBirthdays();
        }
    }, [month]);

    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">Student Birthdays</h2>
                    <p className="text-muted-foreground">
                        These students have birthdays in the given month
                    </p>
                </div>
            </div>
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center">Loading birthdays...</div>
                ) : (
                    <FullCalendar
                        key={month}
                        plugins={[dayGridPlugin]}
                        initialView='dayGridMonth'
                        events={birthdays}
                        datesSet={handleMonthChange}
                    />
                )}
            </div>
        </div>
    );
};

export default Birthdays;