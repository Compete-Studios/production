import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from './firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { login, logout } from './auth';

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
        console.log("Uploaded a blob or file!", snapshot);
      })
      .catch((error) => {
        console.error("Error uploading file: ", error);
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

export const updateStudioIDForAdmimMimic = async (studioID) => {  
    const docRef = doc(db, 'users', "competeAdmin");
    await updateDoc(docRef, {studioID: [studioID]});
    await logoutForAdmin();
    await login("competeAdmin", "9911competeADMIN!@#$");
};


