import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';
import { REACT_API_BASE_URL } from '../constants';

const UserContext = createContext();

export default function AuthContextProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [suid, setSuid] = useState('');
    const [classes, setClasses] = useState([]);
    const [staff, setStaff] = useState([]);
    const [students, setStudents] = useState([]);
    const [prospects, setProspects] = useState([]);
    const [pipelineSteps, setPipelineSteps] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [waitingLists, setWaitingLists] = useState([]);
    const [prospectPipelineSteps, setProspectPipelineSteps] = useState([]);
    const [marketingSources, setMarketingSources] = useState([]);
    const [searchedStudentsAndProspects, setSearchedStudentsAndProspects] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    const [studentIntros, setStudentIntros] = useState([]);
    const [prospectIntros, setProspectIntros] = useState([]);
    const [dailySchedule, setDailySchedule] = useState([]);

    const [update, setUpdate] = useState(false);

    const getStuff = async () => {
        console.log('getStuff');
    };

    const fetchData = async (url, setter) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data)
            setter(data.recordset);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setShowLoading(true);
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        getStuff();
        Promise.all([
            fetchData(`${REACT_API_BASE_URL}/studio-access/getClassesByStudioId/${suid}`, setClasses),
            fetchData(`${REACT_API_BASE_URL}/staff-access/getStaffByStudioId/${suid}/1`, setStaff),
            fetchData(`${REACT_API_BASE_URL}/studio-access/getStudentsByStudioId/${suid}/1`, setStudents),
            fetchData(`${REACT_API_BASE_URL}/marketing-access/getStudentPipelineStepsByStudioId/${suid}`, setPipelineSteps),
            fetchData(`${REACT_API_BASE_URL}/class-access/getProgramsByStudioId/${suid}`, setPrograms),
            fetchData(`${REACT_API_BASE_URL}/marketing-access/getWaitingListsByStudioId/${suid}`, setWaitingLists),
            fetchData(`${REACT_API_BASE_URL}/marketing-access/getPipelineStepsByStudioId/${suid}`, setProspectPipelineSteps),
            fetchData(`${REACT_API_BASE_URL}/marketing-access/getMarketingMethodsByStudioId/${suid}`, setMarketingSources),
            fetchData(`${REACT_API_BASE_URL}/student-access/getStudentIntros/${suid}/${month}/${year}`, setStudentIntros),
            fetchData(`${REACT_API_BASE_URL}/student-access/getProspectIntros/${suid}/${month}/${year}`, setProspectIntros),
            fetchData(`${REACT_API_BASE_URL}/daily-schedule-tools/getStudentsByNextContactDate/${suid}`, setDailySchedule),
        ]).then(() => {
            setShowLoading(false);
        });
    }, [suid, update]);

    useEffect(() => {
        const storedLoggedIn = localStorage.getItem('isLoggedIn');
        const storedSuid = localStorage.getItem('suid');
        if (storedLoggedIn) {
            setIsLoggedIn(true);
        }
        if (storedSuid) {
            setSuid(storedSuid);
        }

        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setIsLoggedIn(true);
                console.log(currentUser.photoURL);
                setSuid(currentUser.photoURL);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('suid', currentUser.photoURL);
            } else {
                setIsLoggedIn(false);
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('suid');
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                suid,
                classes,
                update,
                setUpdate,
                staff,
                students,
                prospects,
                pipelineSteps,
                programs,
                waitingLists,
                prospectPipelineSteps,
                marketingSources,
                searchedStudentsAndProspects,
                setSearchedStudentsAndProspects,
                showLoading,
                studentIntros,
                prospectIntros,
                dailySchedule
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const UserAuth = () => {
    return useContext(UserContext);
};
