import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { REACT_API_BASE_URL } from '../constants';
import { doc, getDoc } from 'firebase/firestore';

const UserContext = createContext();

export default function AuthContextProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [suid, setSuid] = useState('');
    const [classes, setClasses] = useState([]);
    const [staff, setStaff] = useState([]);
    const [pipelineSteps, setPipelineSteps] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [waitingLists, setWaitingLists] = useState([]);
    const [prospectPipelineSteps, setProspectPipelineSteps] = useState([]);
    const [marketingSources, setMarketingSources] = useState([]);
    const [searchedStudentsAndProspects, setSearchedStudentsAndProspects] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    const [prospectIntros, setProspectIntros] = useState([]);
    const [scheduleID, setScheduleID] = useState('');
    const [studioInfo, setStudioInfo] = useState({});
    const [latePayementPipeline, setLatePayementPipeline] = useState([]);

    const [update, setUpdate] = useState(false);

    const fetchData = async (url, setter) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setter(data.recordset);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const getData = async () => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        fetchData(`${REACT_API_BASE_URL}/studio-access/getClassesByStudioId/${suid}`, setClasses);
        fetchData(`${REACT_API_BASE_URL}/staff-access/getStaffByStudioId/${suid}/1`, setStaff);
        fetchData(`${REACT_API_BASE_URL}/marketing-access/getStudentPipelineStepsByStudioId/${suid}`, setPipelineSteps);
        fetchData(`${REACT_API_BASE_URL}/class-access/getProgramsByStudioId/${suid}`, setPrograms);
        fetchData(`${REACT_API_BASE_URL}/marketing-access/getWaitingListsByStudioId/${suid}`, setWaitingLists);
        fetchData(`${REACT_API_BASE_URL}/marketing-access/getPipelineStepsByStudioId/${suid}`, setProspectPipelineSteps);
        fetchData(`${REACT_API_BASE_URL}/marketing-access/getMarketingMethodsByStudioId/${suid}`, setMarketingSources);
        fetchData(`${REACT_API_BASE_URL}/student-access/getProspectIntros/${suid}/${month}/${year}`, setProspectIntros);
        fetchData(`${REACT_API_BASE_URL}/student-access/getPaymentPipelineStepsByStudioId/${suid}`, setLatePayementPipeline);
    };

    const getSCHDATA = async () => {
        const response = await fetch(`${REACT_API_BASE_URL}/daily-schedule-tools/getDailyScheduleByStudioId/${suid}`);
        const data = await response.json();
        if (data) {
            setScheduleID(data);
        } else {
            console.error('No response');
        }
    };

    const getStudioInfo = async (suid) => {
        try {
            const docRef = doc(db, 'studios', suid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setStudioInfo(docSnap.data());
            } else {
                // doc.data() will be undefined in this case
                console.log('No such document!');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setShowLoading(true);
        getData();
        getSCHDATA();
        setShowLoading(false);
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
                setSuid(currentUser.photoURL);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('suid', currentUser.photoURL);
                getStudioInfo(currentUser.photoURL);
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
                pipelineSteps,
                programs,
                waitingLists,
                prospectPipelineSteps,
                marketingSources,
                searchedStudentsAndProspects,
                setSearchedStudentsAndProspects,
                showLoading,
                prospectIntros,
                studioInfo,
                scheduleID,
                latePayementPipeline
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const UserAuth = () => {
    return useContext(UserContext);
};
