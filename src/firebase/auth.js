import { addDoc, arrayUnion, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { createUserWithEmailAndPassword, sendSignInLinkToEmail, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import fetchData from '../functions/fetchdata';

export const login = async (userName, password) => {
    const docRef = doc(db, 'users', userName);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return { error: 'No user with that username' };
    }
    const email = docSnap.data().email;
    const suid = docSnap.data().studioID[0];

    if (!email) {
        return { error: 'No user with that username' };
    } else {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            await updateProfile(userCredential.user, {
                displayName: userName,
            });

            await updateProfile(userCredential.user, {
                photoURL: docSnap.data().studioID[0],
            });
            window.location.reload();
            // If the sign-in is successful, you can return the userCredential or user data here
            return docSnap.data().studioID[0];
        } catch (error) {
            // If an error occurs during sign-in, catch it and return the error message
            if (error.code === 'auth/user-not-found') {
                console.log('User not found');
                console.log(email, password, suid);
                const studio = await createStudioWithData(email, password, suid);
                return studio;
            }
            return {
                error: error.message === 'Firebase: Error (auth/wrong-password).' ? 'Incorrect Password' : error.message,
            };
        }
    }
};

const createStudioWithData = async (email, password, suid) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Set display name using updateProfile
        await updateProfile(user, {
            displayName: suid,
            photoURL: suid,
        });

        return suid;
    } catch (error) {
        return {
            error: error.message,
        };
    }
};

export const resetPassword = async (email, newPassword) => {
    try {
        const user = auth.currentUser;
        const response = await user.updatePassword(user, newPassword);
        return response;
    } catch (error) {
        return error.message;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('monthlyEmailLimit');
        localStorage.removeItem('numberOfEmails');
        localStorage.removeItem('numberOfTexts');
        localStorage.removeItem('activeStudents');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('suid');
        window.location.reload();
        return true;
    } catch (error) {
        return error.message;
    }
};

export const createEvent = async (data, suid) => {
    try {
        const docRef = doc(db, suid, data.eventID);
        await setDoc(docRef, data);
        return true;
    } catch (error) {
        return error.message;
    }
};

export const createUser = async (email, password, userData) => {
    try {
        // Check if the desiredUsername already exists in userTable
        const userTableRef = doc(db, 'users', userData.desired_UserName);

        const existingUsernames = await getDoc(userTableRef);

        if (existingUsernames.exists()) {
            // Username already exists, ask the user to pick a new one or handle it as needed
            return {
                error: 'Username already exists. Please choose a different one.',
            };
        } else {
            // Send a request to your API
            const response = await await fetchData(`studio-access/addStudio`, 'post', userData);
            console.log(response);

            if (response.NewStudioId) {
                // Create a new user
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                // Set display name using updateProfile
                await updateProfile(user, {
                    displayName: userData.desired_UserName,
                    photoURL: response.NewStudioId.toString(),
                });

                const userRef = doc(db, 'studios', response.NewStudioId.toString());

                // Set user data in the users collection
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    Studio_Id: response.NewStudioId,
                    Constact_Address: userData.contact_Address,
                    Contact_City: userData.contact_City,
                    Contact_Email: userData.contact_Email,
                    Contact_Name: userData.contact_Name,
                    Contact_Number: userData.contact_Number,
                    Contact_State: userData.contact_State,
                    Contact_Zip: userData.contact_Zip,
                    Desired_Pswd: userData.desired_Pswd,
                    Desired_UserName: userData.desired_UserName,
                    Is_Activated: userData.is_Activated,
                    Method_of_Contact: userData.method_of_Contact,
                    PaysimpleCustomerId: userData.paysimpleCustomerId,
                    Role: userData.role,
                    Salt: userData.salt,
                    Studio_Name: userData.studio_Name,
                    User_Role: userData.userRole,
                });

                await setDoc(
                    doc(db, 'users', userData.desired_UserName),
                    {
                        uid: user.uid,
                        username: userData.desired_UserName,
                        name: userData.contact_Name,
                        email: user.email,
                        studioID: arrayUnion(response.NewStudioId),
                    },
                    { merge: true }
                );

                return { ...userData, status: 'success', response };
            } else {
                return { error: response.error };
            }
        }
    } catch (error) {
        console.log(error);
        return { error: error.message };
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
