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
