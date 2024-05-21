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
    const [studioOptions, setStudioOptions] = useState<any>([]);
    const [masters, setMasters] = useState([]);
    const [logo, setLogo] = useState(blanklogo);
    const [isMaster, setIsMaster] = useState(false);
    const [selectedSuid, setSelectedSuid] = useState<any>('');
    const [students, setStudents] = useState<any>([]);
    const [fbForms, setFBForms] = useState<any>([]);
    const [layout, setLayout] = useState<any>({});
    const [update, setUpdate] = useState(false);
    const [toActivate, setToActivate] = useState<any>({
        status: false,
        prospect: null,
    });

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
        fetchData(`${REACT_API_BASE_URL}/studio-access/getStudentsByStudioId/${suid}/1`, setStudents);
        fetchRecordSet(`${REACT_API_BASE_URL}/studio-access/getStudioOptions/${suid}`, setStudioOptions);
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

    const getStudioInfo = async (suid: any, main: any) => {
        try {
            const docRef = doc(db, 'studios', suid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setStudioInfo(docSnap.data());
            } else {
                // doc.data() will be undefined in this case
                console.log('No such document!');
            }
            let mainSnap = null;
            if (main === suid) {
                mainSnap = docSnap;
            } else {
                const mainRef = doc(db, 'studios', main);
                mainSnap = await getDoc(mainRef);
            }
            if (mainSnap.exists()) {
                if (mainSnap.data().MasterStudio === 1) {
                    setIsMaster(true);
                    getMasterStudioNumbers(main);
                } else {
                    setIsMaster(false);
                }
            } else {
                // doc.data() will be undefined in this case
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

    const getFromsFromFirebaseWithStudioID = async (suid: any) => {
        const idToString = suid.toString();

        if (!idToString) {
            return;
        }
        try {
            const q = query(collection(db, 'forms'), where('studioID', '==', idToString));
            const querySnapshot = await getDocs(q);
            const forms: any = [];
            querySnapshot.forEach((doc: any) => {
                const dacData = {
                    id: doc.id,
                    ...doc.data(),
                };
                forms.push(dacData);
            });
            setFBForms(forms);
        } catch (error) {
            console.error('Error getting documents: ', error);
        }
    };

    useEffect(() => {
        setShowLoading(true);
        getData();
        getSCHDATA();
        setShowLoading(false);
        getFromsFromFirebaseWithStudioID(suid);
    }, [suid, update]);

    useEffect(() => {
        const suid = localStorage.getItem('suid');
        console.log('It ran', suid);
        const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
            if (currentUser) {
                setIsLoggedIn(true);
                console.log('It ran again', currentUser.photoURL);
                setSuid(suid ? suid : currentUser.photoURL);
                getStudioInfo(suid ? suid : currentUser.photoURL, currentUser.photoURL);
            } else {
                setIsLoggedIn(false);
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
                logo, setLogo
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const UserAuth = () => {
    return useContext(UserContext);
};
