import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

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

export const updateStudio = async (studioId, studioData) => {
    const idString = studioId.toString();
    const docRef = doc(db, 'studios', idString);
    await setDoc(docRef, studioData, { merge: true });
};

export const copyDocAndCreateNew = async () => {
    const docRef = doc(db, 'studios', '534');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const docRef2 = doc(db, 'studios', '525');
        await setDoc(docRef2, data);
        return true;
    } else {
        return false;
    }
};
