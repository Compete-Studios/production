import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";
import { UserAuth } from "../../context/AuthContext";
import StudentDetailsModal from "../../pages/Apps/StudentDetailsModal";
import IconPhone from "../../components/Icon/IconPhone";
import IconAward from "../../components/Icon/IconAward";
import IconAirplay from "../../components/Icon/IconAirplay";
import IconUsers from "../../components/Icon/IconUsers";
import IconArrowBackward from "../../components/Icon/IconArrowBackward";
import {
    getFirstContactStudents,
    getFirstContactProspects,
    getStudentIntros,
    getProspectIntros,
    getStudentFirstClasses,
    getProspectFirstClasses,
    getStudentEnrollments,
    getStudentWithdrawals
} from "../../functions/api";

const categories = [
    { name: "First Contacts", key: "firstContacts", icon: IconPhone, apiFunc: getFirstContactStudents, prospectFunc: getFirstContactProspects, color: "purple-400" },
    { name: "Intros", key: "intros", icon: IconAward, apiFunc: getStudentIntros, prospectFunc: getProspectIntros, color: "yellow-400" },
    { name: "First Classes", key: "firstClasses", icon: IconAirplay, apiFunc: getStudentFirstClasses, prospectFunc: getProspectFirstClasses, color: "blue-400" },
    { name: "Enrollments", key: "enrollments", icon: IconUsers, apiFunc: getStudentEnrollments, color: "green-400" },
    { name: "Withdrawals", key: "withdrawals", icon: IconArrowBackward, apiFunc: getStudentWithdrawals, color: "red-400" }
];

const Snapshot = () => {
    const { suid }: any = UserAuth();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [students, setStudents] = useState([]);
    const [prospects, setProspects] = useState([]);
    const [snapshotData, setSnapshotData] = useState<{ [key: string]: any }>({
        firstContacts: [],
        intros: [],
        firstClasses: [],
        enrollments: [],
        withdrawals: []
    });

    const currentDate = new Date();
    const [startDate, setStartDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
    const [endDate, setEndDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));

    useEffect(() => {
        dispatch(setPageTitle('Snapshot'));
        handleDateChange();
    }, [dispatch]);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    const getSnapshot = useCallback(async () => {
        setLoading(true);
        console.log("Getting snapshot data...");
        try {
            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = formatDate(endDate);
            const data = {
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                studioId: suid
            }
            console.log("Data: ", data);
            const [firstContacts, intros, firstClasses, enrollments, withdrawals] = await Promise.all([
                getFirstContactStudents(data),
                getStudentIntros(data),
                getStudentFirstClasses(data),
                getStudentEnrollments(data),
                getStudentWithdrawals(data)
            ]);

            setSnapshotData({ firstContacts, intros, firstClasses, enrollments, withdrawals });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, suid]);

    const handleDateChange = () => {
        getSnapshot();
    };

    const handleCategoryClick = async (category: any) => {
        setLoading(true);
        try {
            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = formatDate(endDate);
            const studentData = await category.apiFunc(formattedStartDate, formattedEndDate, suid);
            const prospectData = category.prospectFunc ? await category.prospectFunc(formattedStartDate, formattedEndDate, suid) : [];

            setStudents(studentData);
            setProspects(prospectData);
            setSelectedCategory(category.name);
            setIsModalOpen(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex bg-white">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">Studio Snapshot</h2>
                    <p className="text-muted-foreground">
                        A look at your most important stats. Click on any category to see more details.
                    </p>
                </div>
            </div>
            <div className="flex items-end gap-x-2">
                <div className="grid gap-2">
                    <span className="text-sm text-gray-500 font-medium">From:</span>
                    <div className="mt-2">
                        <input
                            type="date"
                            id="start-date"
                            className="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                            value={startDate.toISOString().split('T')[0]}
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
                            value={endDate.toISOString().split('T')[0]}
                            onChange={(e) => setEndDate(new Date(e.target.value))}
                        />
                    </div>
                </div>
                <div className="flex justify-end">
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
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.name}
                            className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleCategoryClick(category)}
                        >
                            <div className="flex items-center">
                                {React.createElement(category.icon, { className: `text-lg text-${category.color}` })}
                                <p className="text-gray-600 ml-2">{category.name}</p>
                            </div>
                            <p className="text-xl font-semibold ml-2">
                                {snapshotData[category.key]?.length || 0}
                            </p>
                        </div>
                    ))}
                </div>
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
