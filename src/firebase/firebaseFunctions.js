import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from './firebase';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { login, logout } from './auth';
import { updateStudentByColumn, updateStudioOptionsPicture } from '../functions/api';

const generateRandomID = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomID = '';

    for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomID += characters.charAt(randomIndex);
    }
    return randomID;
};

export const saveFromToFirebase = async (data, id) => {
    try {
        const docRef = collection(db, 'forms');
        await addDoc(docRef, data);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const getFormFromFirebase = async (id) => {
    try {
        const docRef = doc(db, 'forms', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const getAllFormSubmissions = async (id) => {
    try {
        const docRef = collection(db, 'forms', id, 'stats');
        const querySnapshot = await getDocs(docRef);
        const forms = [];
        querySnapshot.forEach((doc) => {
            const docWithId = { ...doc.data(), id: doc.id };
            forms.push(docWithId);
        });
        return forms;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const deleteFormFromFirebase = async (id) => {
    try {
        const docRef = doc(db, 'forms', id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const getFormsFromFirebase = async (id) => {
    try {
        const docRef = doc(db, 'forms', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const createEvent = async (data, suid) => {
    const did = generateRandomID();
    try {
        const docRef = doc(db, 'events', suid, 'calandar', did);
        const docToSave = { ...data, did };
        await setDoc(docRef, docToSave);
        return true;
    } catch (error) {
        return error.message;
    }
};

export const deleteEvent = async (id, suid) => {
    try {
        const docRef = doc(db, 'events', suid, 'calandar', id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        return error.message;
    }
};

export const updateEvent = async (id, data, suid) => {
    try {
        const docRef = doc(db, 'events', suid, 'calandar', id);
        await updateDoc(docRef, data);
        return true;
    } catch (error) {
        return error.message;
    }
};

export const getForm = async (id) => {
    try {
        const docRef = doc(db, 'forms', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return {};
        }
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const updateForm = async (id, data) => {
    try {
        const docRef = doc(db, 'forms', id);
        await updateDoc(docRef, data);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const getWebsiteCount = async (id) => {
    const month = new Date().toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = new Date().getFullYear();
    const date = `${month}${year}`;
    const idToString = id.toString() + date;
    const docRef = doc(db, 'webstats', idToString);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { count: docSnap.data().count, status: 200 };
    } else {
        return { status: 404 };
    }
};

export const storeReportToFirebase = async (data) => {
    try {
        const docRef = collection(db, 'issues');
        await addDoc(docRef, data);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const getReportsFromFirebase = async () => {
    try {
        const docRef = collection(db, 'issues');
        const querySnapshot = await getDocs(docRef);
        const reports = [];
        querySnapshot.forEach((doc) => {
            const docWithId = { ...doc.data(), id: doc.id };
            reports.push(docWithId);
        });
        return reports;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const updateReport = async (reportId, reportData) => {
    const idString = reportId.toString();
    const docRef = doc(db, 'issues', idString);
    await updateDoc(docRef, reportData);
};

export const getSprint = async (id) => {
    try {
        const docRef = doc(db, 'sprints', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().cards;
        } else {
            return {};
        }
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const updateSprint = async (id, data) => {
    try {
        const docRef = doc(db, 'sprints', id);
        await updateDoc(docRef, { cards: data });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const updateAllUsers = async () => {
    const collectionRef = collection(db, 'users'); // Reference to your collection

    try {
        // Step 1: Fetch all documents in the collection
        const querySnapshot = await getDocs(collectionRef);

        // Step 2: Loop through each document and update it
        const updatePromises = querySnapshot.docs.map(async (document) => {
            const docRef = doc(db, 'users', document.id);

            // Update with your desired changes
            await updateDoc(docRef, {
                // Add your field updates here
                newUpdate: true,
            });
        });

        // Step 3: Wait for all updates to complete
        await Promise.all(updatePromises);
        console.log('All documents updated successfully!');
    } catch (error) {
        console.error('Error updating documents: ', error);
    }
};

export const updateUserNew = async (id) => {
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, { newUpdate: false });
};

// export const updateStudio = async (studioId, studioData) => {
//     const idString = studioId.toString();
//     const docRef = doc(db, 'studios', idString);
//     await setDoc(docRef, studioData, { merge: true });
// };

// export const copyDocAndCreateNew = async () => {
//     const docRef = doc(db, 'studios', '534');
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//         const data = docSnap.data();
//         const docRef2 = doc(db, 'studios', '525');
//         await setDoc(docRef2, data);
//         return true;
//     } else {
//         return false;
//     }
// };

export const addMessage = async (message, uid) => {
    const docRef = collection(db, 'messages', uid, 'notifications');
    await addDoc(docRef, message);
};

export const listenForMessages = async (uid, callback) => {
    const docRef = collection(db, 'messages', uid, 'notifications');
    const unsubscribe = onSnapshot(docRef, (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
            const docWithId = { ...doc.data(), id: doc.id };
            messages.push(docWithId);
        });
        callback(messages);
    });

    return unsubscribe;
};

export const deleteMessage = async (uid, messageId) => {
    console.log('deleting message', uid, messageId);
    const docRef = doc(db, 'messages', uid, 'notifications', messageId);
    const res = await deleteDoc(docRef);
    console.log('res', res);
};

const uploadImage = async (file, id) => {
    const storageRef = ref(storage, `profilePics/${id}`);
    await uploadBytes(storageRef, file)
        .then((snapshot) => {
            console.log('Uploaded a blob or file!', snapshot);
        })
        .catch((error) => {
            console.error('Error uploading file: ', error);
        });
    const url = await getDownloadURL(storageRef);
    return url;
};

export const createLandingPagePreview = async (data, image) => {
    try {
        const docRef = collection(db, 'landingPagePreviews');
        const docID = await addDoc(docRef, data);
        return docID.id;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const logoutForAdmin = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('monthlyEmailLimit');
        localStorage.removeItem('numberOfEmails');
        localStorage.removeItem('numberOfTexts');
        localStorage.removeItem('activeStudents');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('suid');
        return true;
    } catch (error) {
        return error.message;
    }
};

export const updateStudioIDForAdmimMimic = async (studioID, id) => {
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, { tempID: studioID });
};

export const updateAttendanceForStudent = async (attendance, suid, classID) => {
    const refDocLabel = suid + classID;
    const docRef2 = doc(db, 'attendance', refDocLabel);
    const res = await setDoc(docRef2, { [attendance.splicesonlyfirst6]: attendance.checks }, { merge: true });
    return res;
};

export const updateAttendanceForBarcode = async (attendance, suid, classID, arrVar) => {
    console.log('arrVar', arrVar);
    const refDocLabel = suid + classID;
    const docRef2 = doc(db, 'attendance', refDocLabel);
    const res = await setDoc(docRef2, { [arrVar]: arrayUnion(attendance) }, { merge: true });
    return res;
};

export const getAttendanceByClassFB = async (suid, classID) => {
    const refDocLabel = suid + classID;
    const docRef = doc(db, 'attendance', refDocLabel);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return {};
    }
};

export const uploadProfilePic = async (file, id, type) => {
    const storeID = id.toString() + type;
    const storageRef = ref(storage, `profilePics/${storeID}`);
    await uploadBytes(storageRef, file)
        .then((snapshot) => {
            console.log('Uploaded a blob or file!', snapshot);
        })
        .catch((error) => {
            console.error('Error uploading file: ', error);
        });
    const url = await getDownloadURL(storageRef);
    const data = {
        studentId: id,
        columnName: 'ProfilePicUrl',
        value: url,
        studioId: id,
    };
    if (type === 'student') {
        await updateStudentByColumn(data);
    } else if (type === 'studio') {
        await updateStudioOptionsPicture(data);
    } else {
        console.log('error');
    }
    return url;
};

export const deleteImage = async (id, type) => {
    const storeID = id.toString() + type;
    const storageRef = ref(storage, `profilePics/${storeID}`);
    await deleteObject(storageRef);
    const data = {
        studentId: id,
        columnName: 'ProfilePicUrl',
        value: '',
        studioId: id,
    };
    if (type === 'student') {
        await updateStudentByColumn(data);
    } else if (type === 'studio') {
        await updateStudioOptionsPicture(data);
    } else {
        console.log('error');
    }
};
