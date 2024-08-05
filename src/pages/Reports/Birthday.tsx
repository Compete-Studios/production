import { useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getBirthdaysByStudioId } from "../../functions/api";

const Birthdays = () => {
    const { suid } = UserAuth() as { suid: number };
    const [loading, setLoading] = useState(false);
    const [birthdays, setBirthdays] = useState([]);
    const currentMonthIndex = new Date().getMonth();
    const [month, setMonth] = useState(currentMonthIndex + 1);

    const getBirthdaysForReports = async (suid: number, monthIndex: number) => {
        console.log("Getting birthdays for", suid, monthIndex);
        try {
            const response = await getBirthdaysByStudioId(suid, monthIndex);
            return response.recordset;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split('T')[0].split('-');
        return `${year}-${month}-${day}`;
    };

    const getBirthdays = async () => {
        setLoading(true);
        try {
            const birthdayData = await getBirthdaysForReports(suid, month);
            const currentYear = new Date().getFullYear();

            const formattedBirthdays = birthdayData
                .map((birthday: any) => {
                    let dob = new Date(birthday.Birthdate);
                    dob.setFullYear(currentYear);

                    const formattedDate = formatDate(dob.toISOString());

                    if (isNaN(dob.getTime())) {
                        console.error("Invalid date for", birthday);
                        return null;
                    }

                    return {
                        title: `${birthday.First_Name} ${birthday.Last_Name}`,
                        date: formattedDate,
                    };
                })
                .filter((event: any) => !!event);

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
                        initialView="dayGridMonth"
                        events={birthdays}
                        datesSet={handleMonthChange}
                    />
                )}
            </div>
        </div>
    );
};

export default Birthdays;
