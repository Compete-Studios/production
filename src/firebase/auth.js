import { arrayUnion, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';

export const login = async (userName, password) => {
    const docRef = doc(db, 'users', userName);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return { error: 'No user with that username' };
    }
    const email = docSnap.data().email;

    if (!email) {
        return { error: 'No user with that username' };
    } else {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);         
            localStorage.setItem('isMaster', 'false');
            // Check if the display name is not set
            if (!userCredential.user.displayName) {
                // Set display name using updateProfile
                await updateProfile(userCredential.user, {
                    displayName: userName,
                });
            }

            if (!userCredential.user.photoURL) {
                // Set display name using updateProfile
                await updateProfile(userCredential.user, {
                    photoURL: docSnap.data().studioID[0],
                });
            }

            // If the sign-in is successful, you can return the userCredential or user data here
            return docSnap.data().studioID[0];
        } catch (error) {
            // If an error occurs during sign-in, catch it and return the error message
            return {
                error: error.message === 'Firebase: Error (auth/wrong-password).' ? 'Incorrect Password' : error.message,
            };
        }
    }
};


export const logout = async () => {
    try {
        await signOut(auth);
        window.location.reload();
        return true;
    } catch (error) {
        return error.message;
    }
};

// export const seedDatabase = async () => {
//     const tables = [
//         'StudioFiles',
//         'StudioOptions',
//         'StudioPasswordUpdateRequest',
//         'StudioPayment',
//         'StudioPaymentCards',
//         'StudioPaymentSchedules',
//         'Studios',
//         'Tickets',
//         'TextLogs',
//         'TicketResponses',
//         'Triggers',
//         'UploadedStudioImages',
//         'LatePayments',
//         'UserForms',
//         'WaitingListMembers',
//         'LatePaymentPipelineSteps',
//         'WaitingLists',
//         'Ranks',
//         'PasswordResetRequests',
//         'StudentRanks',
//         'MasterStudioRoster',
//         'ProspectBillingAccounts',
//         'Attendance',
//         'Waivers',
//         'BillingAccounts',
//         'SignedWaivers',
//         'Invoices',
//         'Class',
//         'ClassRoll',
//         'ClassSchedules',
//         'CustomBarcode',
//         'DelinquentAccountsHistory',
//         'StudentsInNumber',
//         'Performances',
//         'EmailAttachments',
//         'Numbers',
//         'EmailingListMembers',
//         'EmailingLists',
//         'EmailLogs',
//         'EventAttendee',
//         'Events',
//         'InternalPayments',
//         'LateFees',
//         'MarketingMethods',
//         'Logs',
//         'Newsletter',
//         'NewsletterLogs',
//         'Notifications',
//         'DailySchedule',
//         'NPSCampaigns',
//         'NPSResponses',
//         'DailyScheduleStudentPipeline',
//         'PaymentCards',
//         'DailyScheduleProspectPipeline',
//         'PaymentSchedules',
//         'StudentPasswordResetRequests',
//         'PipelineSteps',
//         'ProgramRoll',
//         'Programs',
//         'ProspectClassRoll',
//         'ProspectPipelineStatus',
//         'FormsPageLoad',
//         'ProspectProgramRoll',
//         'FormSubmitHistory',
//         'Prospects',
//         'PaymentNotes',
//         'WaitingListStudents',
//         'ProspectAttendance',
//         'Rooms',
//         'Staff',
//         'StaffClasses',
//         'StaffPermissions',
//         'StudentPipelineStatus',
//         'ExceptionLogs',
//         'StudentPipelineSteps',
//         'StudentProgramRoll',
//         'Students',
//         'StudioBillingInfo',
//         'PaymentScheduleNotes',
//     ];

//     try {
//         for (let i = 0; i < tables.length; i++) {

//             const res = await fetch(`http://localhost:3333/api/crud/getAllFromTable/${tables[i]}`);
//             const data = await res.json();
//             console.log(tables[i], data);

//         }
//         return true;
//     } catch (error) {
//         console.log(error);
//         return error.message;
//     }
// };

// export const getAllFromTable = async (route, table, parameter) => {
//     try {
//         const res = await fetch(`http://localhost:3333/api/crud/${route}/${table}/${parameter}`);
//         const data = await res.json();
//         return data.recordset;
//     } catch (error) {
//         return error.message;
//     }
// };

export const seedStudioInfo = async (studioID, data) => {
    try {
        const docRef = doc(db, 'studios', studioID);
        await setDoc(docRef, data);
        return true;
    } catch (error) {
        return error.message;
    }
};

export const addTable = async (table, data) => {
    try {
        const docRef = doc(db, 'studios', 'tables', table);
        await setDoc(docRef, data);
        return true;
    } catch (error) {
        return error.message;
    }
};
