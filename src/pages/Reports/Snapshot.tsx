import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";
import { UserAuth } from "../../context/AuthContext";
import IconPhone from "../../components/Icon/IconPhone";
import IconAward from "../../components/Icon/IconAward";
import IconAirplay from "../../components/Icon/IconAirplay";
import IconUsers from "../../components/Icon/IconUsers";
import IconArrowBackward from "../../components/Icon/IconArrowBackward";
import StudentDetailsModal from "../../pages/Apps/StudentDetailsModal";
import { getStudioSnapShot, getFirstContactStudents, getFirstContactProspects, getStudentIntros, getProspectIntros, getStudentFirstClasses, getProspectFirstClasses, getStudentEnrollments, getStudentWithdrawals } from "../../functions/api";

// Define the Snapshot interface here as well
interface Snapshot {
    firstContacts: number;
    intros: number;
    firstClasses: number;
    enrollments: number;
    withdrawls: number; //Note the typo here, which is present in the DB function. Easier to just keep it as is
}

const Snapshot = () => {
    const { suid }: any = UserAuth();
    const [loading, setLoading] = useState(true);
    const [snapshot, setSnapshot] = useState<Snapshot | null>(null); // Change type to Snapshot or null
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [students, setStudents] = useState([]);
    const [prospects, setProspects] = useState([]);
    
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Snapshot'));
    });

    const currentDate = new Date();
    const thisMonthStartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    );
    const thisMonthEndDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    );
    const [startDate, setStartDate] = useState(thisMonthStartDate);
    const [endDate, setEndDate] = useState(thisMonthEndDate);

    const getSnapshot = async (startDate: any, endDate: any, suid: any) => {
        try {
            setLoading(true);
            const snapshot: Snapshot = await getStudioSnapShot(startDate, endDate, suid);
            console.log(snapshot);
            setSnapshot(snapshot);
        } catch (error) {
            console.log(error);
            setSnapshot(null);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = async () => {
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];
        await getSnapshot(formattedStartDate, formattedEndDate, suid);
    };

    const handleCategoryClick = async (category: string) => {
        setLoading(true);
        try {
            let studentData = [];
            let prospectData = [];

            const formattedStartDate = startDate.toISOString().split("T")[0];
            const formattedEndDate = endDate.toISOString().split("T")[0];

            switch (category) {
                case "First Contacts":
                    studentData = await getFirstContactStudents(formattedStartDate, formattedEndDate, suid);
                    prospectData = await getFirstContactProspects(formattedStartDate, formattedEndDate, suid);
                    break;
                case "Intros":
                    studentData = await getStudentIntros(formattedStartDate, formattedEndDate, suid);
                    prospectData = await getProspectIntros(formattedStartDate, formattedEndDate, suid);
                    break;
                case "First Classes":
                    studentData = await getStudentFirstClasses(formattedStartDate, formattedEndDate, suid);
                    prospectData = await getProspectFirstClasses(formattedStartDate, formattedEndDate, suid);
                    break;
                case "Enrollments":
                    studentData = await getStudentEnrollments(formattedStartDate, formattedEndDate, suid);
                    break;
                case "Withdrawals":
                    studentData = await getStudentWithdrawals(formattedStartDate, formattedEndDate, suid);
                    break;
                default:
                    break;
            }

            setStudents(studentData);
            setProspects(prospectData);
            setSelectedCategory(category);
            setIsModalOpen(true);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleDateChange();
    }, []);

    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">Studio Snapshot</h2>
                    <p className="text-muted-foreground">
                        A look at your most important stats. Click on any category to see more details.
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-x-2">
                <div className="grid gap-2">
                    <span className="text-sm text-gray-500 font-medium">From:</span>
                    <div className="mt-2">
                        <input
                            type="date"
                            id="start-date"
                            className="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                            value={startDate.toISOString().split("T")[0]}
                            onChange={(e) => setStartDate(new Date(e.target.value))}
                        />
                    </div>
                </div>
                <div className="grid gap-2">
                    <span className="text-sm text-gray-500 font-medium">To:</span>
                    <div className="mt-2">
                        <input
                            type="date"
                            id="end-date"
                            className="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                            value={endDate.toISOString().split("T")[0]}
                            onChange={(e) => setEndDate(new Date(e.target.value))}
                        />
                    </div>
                </div>
                <div className="flex justify-end pt-12">
                    <button
                        type="submit"
                        className="rounded-sm bg-blue-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 flex items-center"
                        onClick={handleDateChange}
                    >
                        Update
                    </button>
                </div>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : snapshot ? (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div
                            className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleCategoryClick("First Contacts")}
                        >
                            <div className="flex items-center">
                                <IconPhone className="text-lg text-purple-400" />
                                <p className="text-gray-600 ml-2">First Contacts</p>
                            </div>
                            <p className="text-xl font-semibold ml-2">{snapshot.firstContacts}</p>
                        </div>
                        <div
                            className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleCategoryClick("Intros")}
                        >
                            <div className="flex items-center">
                                <IconAward className="text-lg text-yellow-400" />
                                <p className="text-gray-600 ml-2">Intros</p>
                            </div>
                            <p className="text-xl font-semibold ml-2">{snapshot.intros}</p>
                        </div>
                        <div
                            className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleCategoryClick("First Classes")}
                        >
                            <div className="flex items-center">
                                <IconAirplay className="text-lg text-blue-400" />
                                <p className="text-gray-600 ml-2">First Classes</p>
                            </div>
                            <p className="text-xl font-semibold ml-2">{snapshot.firstClasses}</p>
                        </div>
                        <div
                            className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleCategoryClick("Enrollments")}
                        >
                            <div className="flex items-center">
                                <IconUsers className="text-lg text-green-400" />
                                <p className="text-gray-600 ml-2">Enrollments</p>
                            </div>
                            <p className="text-xl font-semibold ml-2">{snapshot.enrollments}</p>
                        </div>
                        <div
                            className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleCategoryClick("Withdrawals")}
                        >
                            <div className="flex items-center">
                                <IconArrowBackward className="text-lg text-red-400" />
                                <p className="text-gray-600 ml-2">Withdrawals</p>
                            </div>
                            <p className="text-xl font-semibold ml-2">{snapshot.withdrawls}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No data available.</p>
            )}
            <StudentDetailsModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                students={students}
                prospects={prospects}
                category={selectedCategory}
            />
        </div>
    );
};

export default Snapshot;
