import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { REACT_API_BASE_URL } from '../constants';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

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

    const [update, setUpdate] = useState(false);

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

    const getStudioInfo = async (suid: any) => {
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

    const updateStudioLatePaymentPipeline = async (studioID: any) => {
        try {
            const response = await fetchFromAPI(`late-payment-pipeline/addLatePaymentsFromPaysimpleToCompeteD/${studioID}`, {
                method: 'POST',
            });
            return response;
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

    // const getMasterStudioNumbers = async (id: any) => {
    //     try {
    //         const response = await fetchFromAPI(`admin-tools/getMasterStudioRosterById/${id}`, {
    //             method: 'GET',
    //         });
    //         const masters: any = [];

    //         for (let i = 0; i < response.recordset.length; i++) {
    //             const master = response.recordset[i];
    //             const masterInfo = await getStudioNameById(master.StudioId);
    //             masters.push({
    //                 studioID: response.recordset[i].StudioId,
    //                 studioName: masterInfo.Studio_Name,
    //                 userName: masterInfo.Desired_UserName,
    //             });
    //         }
    //         setMasters(masters);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    useEffect(() => {
        setShowLoading(true);
        getData();
        getSCHDATA();
        setShowLoading(false);
    }, [suid, update]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
          if (currentUser) {
            setIsLoggedIn(true);
            console.log("It ran again", currentUser.photoURL);
            setSuid(currentUser.photoURL);
            getStudioInfo(currentUser.photoURL);
          } else {
            setIsLoggedIn(false);
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
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const UserAuth = () => {
    return useContext(UserContext);
};
