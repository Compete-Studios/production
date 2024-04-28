import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { REACT_API_BASE_URL } from '../constants';
import { doc, getDoc } from 'firebase/firestore';
import { formatForEmails } from '../functions/shared';
import { getMonthlyLimit, getNumberOfEmailsSentByStudio } from '../functions/emails';
import { getCountOfInactiveOrInactive, getNumberOfTextsSentByStudioHelper } from '../functions/api';

const MarketingContext: any = createContext<any>(null);

export default function MarketingContextProvider({ children }: any) {
    const [studioID, setStudioID] = useState('');

    const [loadingPropsects, setLoadingProspects] = useState(true);
    const [loadingActiveStudents, setLoadingActiveStudents] = useState(true);
    const [loadingEmails, setLoadingEmails] = useState(true);
    const [loadingEmailCount, setLoadingEmailCount] = useState(true);
    const [loadingTexts, setLoadingTexts] = useState(true);
    const [loadingTextCount, setLoadingTextCount] = useState(true);
    const [numberOfEmails, setNumberOfEmails] = useState(0);
    const [monthlyEmailLimit, setMonthlyEmailLimit] = useState(0);
    const [numberOfTexts, setNumberOfTexts] = useState(0);
    const [monthlyTextLimit, setMonthlyTextLimit] = useState(30000);
    const [numberOfActiveStudents, setNumberOfActiveStudents] = useState(0);
    const [numberOfInactiveStudents, setNumberOfInactiveStudents] = useState(0);

    const getAlltheEmails = async () => {
        const firstDateOfThisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const lastDateOfThisMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        const data = {
            studioId: studioID,
            startDate: formatForEmails(firstDateOfThisMonth),
            endDate: formatForEmails(lastDateOfThisMonth),
        };
        const response = await getNumberOfEmailsSentByStudio(data);
        if (response) {
            setNumberOfEmails(response.numberOfEmailsSent);
            setLoadingEmailCount(false);
        } else {
            setNumberOfEmails(0);
            setLoadingEmailCount(false);
        }
    };

    const getMonthlyEmailLimit = async () => {
        const response = await getMonthlyLimit(studioID);

        if (response) {
            setMonthlyEmailLimit(response?.limit?.recordset[0]?.MonthlyEmailVolume);
            setLoadingEmails(false);
        } else {
            setMonthlyEmailLimit(0);
            setLoadingEmails(false);
        }
    };

    useEffect(() => {
        getAlltheEmails();
        getMonthlyEmailLimit();
    }, [studioID]);

    const getTotalTexts = async () => {
        const firstDateOfThisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const lastDateOfThisMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        const data = {
            studioId: studioID,
            startDate: formatForEmails(firstDateOfThisMonth),
            endDate: formatForEmails(lastDateOfThisMonth),
        };
        const response = await getNumberOfTextsSentByStudioHelper(data);

        if (response) {
            setNumberOfTexts(response);
            setLoadingTexts(false);
        } else {
            setNumberOfTexts(0);
            setLoadingTexts(false);
        }
    };

    useEffect(() => {
        getTotalTexts();
    }, [studioID]);

    const getCountOfActiveStudents = async () => {
        const response = await getCountOfInactiveOrInactive(studioID, 1);
        if (response) {
            setNumberOfActiveStudents(response?.recordset[0]?.CountOfStudents);
            setLoadingActiveStudents(false);
        } else {
            setNumberOfActiveStudents(0);
        }
    };

    useEffect(() => {
        getCountOfActiveStudents();
    }, [studioID]);

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
    };

    useEffect(() => {
        const storedSuid = localStorage.getItem('suid');
        if (storedSuid) {
            setStudioID(storedSuid);
        }
    }, []);

    return (
        <MarketingContext.Provider
            value={{
                numberOfEmails,
                monthlyEmailLimit,
                numberOfTexts,
                monthlyTextLimit,
                numberOfActiveStudents,
                numberOfInactiveStudents,
                loadingPropsects,
                loadingActiveStudents,
                loadingEmails,
                loadingEmailCount,
                loadingTexts,
                loadingTextCount
            }}
        >
            {children}
        </MarketingContext.Provider>
    );
}

export const MarketingCon = () => {
    return useContext(MarketingContext);
};
