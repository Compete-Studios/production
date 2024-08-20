import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { REACT_API_BASE_URL } from '../constants';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import blanklogo from '../assets/blanklogo.png';

const UserContext: any = createContext<any>(null);

export default function AuthContextProvider({ children }: any) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [suid, setSuid] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [classes, setClasses] = useState([]);
    const [staff, setStaff] = useState([]);
    const [pipelineSteps, setPipelineSteps] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [waitingLists, setWaitingLists] = useState([]);
    const [prospectPipelineSteps, setProspectPipelineSteps] = useState([]);
    const [marketingSources, setMarketingSources] = useState([]);
    const [searchedStudentsAndProspects, setSearchedStudentsAndProspects] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [globalLoading, setGlobalLoading] = useState(true);
    const [prospectIntros, setProspectIntros] = useState([]);
    const [scheduleID, setScheduleID] = useState('');
    const [studioInfo, setStudioInfo] = useState({});
    const [latePayementPipeline, setLatePayementPipeline] = useState([]);
    const [studioOptions, setStudioOptions] = useState<any>([]);
    const [masters, setMasters] = useState([]);
    const [logo, setLogo] = useState(blanklogo);
    const [isMaster, setIsMaster] = useState(false);
    const [selectedSuid, setSelectedSuid] = useState<any>(null);
    const [students, setStudents] = useState<any>([]);
    const [fbForms, setFBForms] = useState<any>([]);
    const [masterStudio, setMasterStudio] = useState<any>(null);
    const [layout, setLayout] = useState<any>({});
    const [spaces, setSpaces] = useState<any>([]);
    const [update, setUpdate] = useState(false);
    const [inactiveStudents, setInactiveStudents] = useState<any>([]);
    const [emailList, setEmailList] = useState<any>([]);
    const [events, setEvents] = useState<any>([]);
    const [dailySchedule, setDailySchedule] = useState<any>(null);
    const [toActivate, setToActivate] = useState<any>({
        status: false,
        prospect: null,
    });

    const getAllSpaces = async (uid: any) => {
        const spacesRef = collection(db, 'spaces');
        const uidToString = uid.toString();
        const q = query(spacesRef, where('userID', '==', uidToString));
        const querySnapshot = await getDocs(q);
        let spacesArray: any[] = [];
        querySnapshot.forEach((doc) => {
            spacesArray.push({ ...doc.data(), id: doc.id });
        });
        setSpaces(spacesArray);
    };

    const getEvents = async (collectionTitle: any) => {};

    const fetchData = async (url: any, setter: any) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setter(data.recordset);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const fetchRecordSet = async (url: any, setter: any) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setter(data.recordset[0]);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const fetchFromAPI = async (endpointURL: any, opts: any) => {
        const { method, body }: any = { method: 'POST', body: null, ...opts };

        const user = auth.currentUser;
        const token = user && (await user.getIdToken());

        const res = await fetch(`${REACT_API_BASE_URL}/${endpointURL}`, {
            method,
            ...(body && { body: JSON.stringify(body) }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        return res.json();
    };

    const handleGetEvents = async (id: any) => {
        const collectionTitle = 'events' + id;
        try {
            const docRef = collection(db, collectionTitle);
            const querySnapshot = await getDocs(docRef);
            const fetchedEvents = [];
            querySnapshot.forEach((doc) => {
                const docWithId = { ...doc.data(), id: doc.id };
                fetchedEvents.push(docWithId);
            });
            return events;
        } catch (error: any) {
            return error.message;
        }
    };

    const getData = async () => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        setFetchLoading(true);
        const classRes = await fetchData(`${REACT_API_BASE_URL}/studio-access/getClassesByStudioId/${suid}`, setClasses);
        const staffRes = await fetchData(`${REACT_API_BASE_URL}/staff-access/getStaffByStudioId/${suid}/1`, setStaff);
        const pipeLineRes = await fetchData(`${REACT_API_BASE_URL}/marketing-access/getStudentPipelineStepsByStudioId/${suid}`, setPipelineSteps);
        const programRes = await fetchData(`${REACT_API_BASE_URL}/class-access/getProgramsByStudioId/${suid}`, setPrograms);
        const waitingListRes = await fetchData(`${REACT_API_BASE_URL}/marketing-access/getWaitingListsByStudioId/${suid}`, setWaitingLists);
        const studPipesRes = await fetchData(`${REACT_API_BASE_URL}/marketing-access/getPipelineStepsByStudioId/${suid}`, setProspectPipelineSteps);
        const marketingRes = await fetchData(`${REACT_API_BASE_URL}/marketing-access/getMarketingMethodsByStudioId/${suid}`, setMarketingSources);
        const introRes = await fetchData(`${REACT_API_BASE_URL}/student-access/getProspectIntros/${suid}/${month}/${year}`, setProspectIntros);
        const paymentsRes = await fetchData(`${REACT_API_BASE_URL}/student-access/getPaymentPipelineStepsByStudioId/${suid}`, setLatePayementPipeline);
        const studioRes = await fetchData(`${REACT_API_BASE_URL}/studio-access/getStudentsByStudioId/${suid}/1`, setStudents);
        const optionsRes = await fetchRecordSet(`${REACT_API_BASE_URL}/studio-access/getStudioOptions/${suid}`, setStudioOptions);
        const studioScheduleOptions = await fetchRecordSet(`${REACT_API_BASE_URL}/daily-schedule-tools/getDailyScheduleByStudioId/${suid}`, setDailySchedule);
        getAllSpaces(suid);
        handleGetEvents(suid);

        if (classRes && staffRes && pipeLineRes && programRes && waitingListRes && studPipesRes && marketingRes && introRes && paymentsRes && studioRes && optionsRes && studioScheduleOptions) {
            setFetchLoading(false);
        } else {
            console.error('No response');
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        if (dailySchedule) {
        setScheduleID(dailySchedule.ScheduleId);
        }
    }, [dailySchedule]);

    // const getSCHDATA = async () => {
    //     setGlobalLoading(true);
    //     const response = await fetch(`${REACT_API_BASE_URL}/daily-schedule-tools/getDailyScheduleByStudioId/${suid}`);
    //     const data = await response.json();
    //     if (data) {
    //         setScheduleID(data);
    //         setGlobalLoading(false);
    //     } else {
    //         console.error('No response');
    //         setGlobalLoading(false);
    //     }
    // };

    const getStudioInfo = async (suid: any, main: any) => {
        try {
            const docSnap = await fetchRecordSet(`${REACT_API_BASE_URL}/studio-access/getStudioInfo/${suid}`, setStudioInfo);
            let mainSnap = docSnap.recordset[0];
            const mstrstudioResponse = await fetchRecordSet(`${REACT_API_BASE_URL}/studio-access/getStudioInfo/${main}`, setMasterStudio);
            const mstr = mstrstudioResponse.recordset[0];

            if (main !== suid) {
                mainSnap = await fetchRecordSet(`${REACT_API_BASE_URL}/studio-access/getStudioInfo/${suid}`, setStudioInfo);
            }

            if (mainSnap) {
                if (mstr.MasterStudio === 1) {
                    setIsMaster(true);
                    getMasterStudioNumbers(main);
                } else {
                    setIsMaster(false);
                }
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getStudioNameById = async (id: any) => {
        try {
            const response = await fetchFromAPI(`studio-access/getStudioInfo/${id}`, {
                method: 'GET',
            });
            return response.recordset[0];
        } catch (error) {
            console.error(error);
        }
    };

    const getMasterStudioNumbers = async (id: any) => {
        try {
            const response = await fetchFromAPI(`admin-tools/getMasterStudioRosterById/${id}`, {
                method: 'GET',
            });
            const masters: any = [];

            for (let i = 0; i < response.recordset.length; i++) {
                const master = response.recordset[i];
                const masterInfo = await getStudioNameById(master.StudioId);
                masters.push({
                    studioID: response.recordset[i].StudioId,
                    studioName: masterInfo.Studio_Name,
                    userName: masterInfo.Desired_UserName,
                });
            }
            setMasters(masters);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getData();
    }, [suid, update]);

    useEffect(() => {
        if (fetchLoading === false && globalLoading === false) {
            setShowLoading(false);
        } else {
            setShowLoading(true);
        }
    }, [fetchLoading, globalLoading]);

    useEffect(() => {
        // const suid = localStorage.getItem('suid');
        // console.log('It ran', suid);
        const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
            if (currentUser) {
                setIsLoggedIn(true);
                console.log('It ran again', selectedSuid);
                const adminPrivileges = currentUser.email === 'info@competestudio.pro' ? true : currentUser.email === 'info1@competestudio.com' ? true : false;
                setIsAdmin(adminPrivileges);
                setSuid(selectedSuid ? selectedSuid : currentUser.photoURL);
                getStudioInfo(selectedSuid ? selectedSuid : currentUser.photoURL, currentUser.photoURL);
            } else {
                setIsLoggedIn(false);
                setSuid('');
            }
        });
        return () => {
            unsubscribe(); // Clean up the onAuthStateChanged listener
        };
    }, [selectedSuid]);

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
                setStudioInfo,
                scheduleID,
                latePayementPipeline,
                studioOptions,
                isMaster,
                masters,
                selectedSuid,
                setSelectedSuid,
                students,
                fbForms,
                toActivate,
                setToActivate,
                layout,
                setLayout,
                logo,
                setLogo,
                isAdmin,
                inactiveStudents,
                emailList,
                setEmailList,
                spaces,
                events,
                setEvents,
                setShowLoading,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const UserAuth = () => {
    return useContext(UserContext);
};
