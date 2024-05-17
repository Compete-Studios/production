import { useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { getStudioSnapShot } from "../../functions/api";
import IconPhone from "../../components/Icon/IconPhone";
import IconAward from "../../components/Icon/IconAward";
import IconAirplay from "../../components/Icon/IconAirplay";
import IconUsers from "../../components/Icon/IconUsers";
import IconArrowBackward from "../../components/Icon/IconArrowBackward";

const Snapshot = () => {
    const { suid }: any = UserAuth();
    const [loading, setLoading] = useState(true);
    const [snapshot, setSnapshot] = useState([]);

    // Initialize date with the current month's start and end dates for page load
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
    // Initialize date state with the current month's start and end dates for page load
    const [startDate, setStartDate] = useState(thisMonthStartDate);
    const [endDate, setEndDate] = useState(thisMonthEndDate);



    const getSnapshot = async (startDate: any, endDate: any, suid: any) => {
        setLoading(true);
        try {
            const snapshot = await getStudioSnapShot(startDate, endDate, suid);
            setSnapshot(snapshot);
        } catch (error) {
            console.log(error);
            setSnapshot([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = async () => {
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];
        await getSnapshot(formattedStartDate, formattedEndDate, suid);
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
                        A look at your most important stats
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-x-2">
                <div className="grid gap-2" >
                    <span className="text-sm text-gray-500 font-medium">From:</span>
                    <div className="mt-2">
                        <input
                            type="date"
                            id="date"
                            className="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                            value={startDate.toISOString().split("T")[0]}
                            onChange={(e) => setStartDate(new Date(e.target.value))}
                        />
                    </div>
                </div>
                <div className="grid gap-2" >
                    <span className="text-sm text-gray-500 font-medium">To:</span>
                    <div className="mt-2">
                        <input
                            type="date"
                            id="date
                            "
                            className="form-input py-2 ltr:pr-11 rtl:pl-11 peer"
                            value={endDate.toISOString().split("T")[0]}
                            onChange={(e) => setEndDate(new Date(e.target.value))}
                        />
                    </div>
                </div>
                <div className="flex justify-end pt-12">
                    <button
                        type="submit"
                        className="rounded-sm bg-com px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-comhover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-com flex items-center"
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
                        <div className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow" >
                            <div className="flex items-center">
                                <IconPhone className="text-lg text-purple-400" />
                                <p className="text-gray-600 ml-2">First Contacts</p>
                            </div>
                            <p className="text-xl font-semibold ml-2">{snapshot.firstContacts}</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <IconAward className="text-lg text-yellow-400" />
                                <p className="text-gray-600 ml-2">Intros</p>
                            </div>
                            <p className="text-xl font-semibold ml-2">{snapshot.intros}</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <IconAirplay className="text-lg text-blue-400" />
                                <p className="text-gray-600 ml-2">First Classes</p>
                            </div>
                            <p className="text-xl font-semibold ml-2">{snapshot.firstClasses}</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <IconUsers className="text-lg text-green-400" />
                                <p className="text-gray-600 ml-2">Enrollments</p>
                            </div>
                            <p className="text-xl font-semibold ml-2">{snapshot.enrollments}</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow">
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
        </div>
    );
};

export default Snapshot;