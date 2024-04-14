import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';

const UserContext = createContext();

const API_BASE_URL = 'http://localhost:3333/api';
// const API_BASE_URL = 'https://amazing-dubinsky.209-59-154-172.plesk.page/api'

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

    const [update, setUpdate] = useState(false);

    const getStuff = async () => {
        console.log('getStuff');
    };

    const getClassesByStudioID = async (studioId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/studio-access/getClassesByStudioId/${studioId}`);
            const data = await response.json();
            setClasses(data.recordset);

            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const getStaffByStudioID = async (studioId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/staff-access/getStaffByStudioId/${studioId}/1`);
            const data = await response.json();
            setStaff(data.recordset);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const getActiveStudentsByStudioId = async (studioId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/studio-access/getStudentsByStudioId/${studioId}/1`);
            const data = await response.json();
            setStudents(data.recordset);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const getAllProspectsByStudioId = async (studioId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/marketing-access/getProspectsByStudioId/${studioId}`);
            const data = await response.json();
            setProspects(data.recordset);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const getStudentPipelineStepsByStudioId = async (studioId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/marketing-access/getStudentPipelineStepsByStudioId/${studioId}`);
            const data = await response.json();
            setPipelineSteps(data.recordset);
        } catch (error) {
            console.error(error);
        }
    };

    const getProgramsByStudioID = async (studioId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/class-access/getProgramsByStudioId/${studioId}`);
            const data = await response.json();
            setPrograms(data.result.recordset);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const getWaitingListsByStudioID = async (studioId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/marketing-access/getWaitingListsByStudioId/${studioId}`);
            const data = await response.json();
            setWaitingLists(data.recordset);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const getProspectPipelineStepsByStudioId = async (studioId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/marketing-access/getPipelineStepsByStudioId/${studioId}`);
            const data = await response.json();
            setProspectPipelineSteps(data.recordset);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getStuff();
        getClassesByStudioID(suid);
        getStaffByStudioID(suid);
        getActiveStudentsByStudioId(suid);
        getAllProspectsByStudioId(suid);
        getStudentPipelineStepsByStudioId(suid);
        getProgramsByStudioID(suid);
        getWaitingListsByStudioID(suid);
        getProspectPipelineStepsByStudioId(suid);
    }, [suid, update]);

    useEffect(() => {
        // Check if user is logged in from browser storage
        const storedLoggedIn = localStorage.getItem('isLoggedIn');
        const storedSuid = localStorage.getItem('suid');
        if (storedLoggedIn) {
            setIsLoggedIn(true);
        }
        if (storedSuid) {
            setSuid(storedSuid);
        }

        // Listen for authentication state changes
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
            unsubscribe(); // Clean up the onAuthStateChanged listener
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
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const UserAuth = () => {
    return useContext(UserContext);
};
