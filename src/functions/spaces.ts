import { arrayUnion, collection, doc, getDoc, getDocs, increment, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { sendEmailVerification } from 'firebase/auth';
import { auth, db, storage } from '../firebase/firebase';

export const generateRandomID = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomID = '';

    for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomID += characters.charAt(randomIndex);
    }
    return randomID;
};

export const finishSetUp = async (id, data) => {
    try {
        const userRef = doc(db, 'users', id);
        await updateDoc(userRef, {
            ...data,
            accountUpdated: true,
        });
        return { status: 'success' };
    } catch (error) {
        console.log(error);
        return error;
    }
};

const finishSetUpWithProfilePic = async (id, data, url) => {
    try {
        const userRef = doc(db, 'users', id);
        await updateDoc(userRef, {
            ...data,
            accountUpdated: true,
            profilePic: url,
        });
        return { status: 'success' };
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const uploadImage = async (id, data, file) => {
    const storageRef = ref(storage, `profilePics/${id}`);
    await uploadBytes(storageRef, file)
        .then((snapshot) => {
            console.log('Uploaded a blob or file!', snapshot);
        })
        .catch((error) => {
            console.error('Error uploading file: ', error);
        });
    const url = await getDownloadURL(storageRef);
    await finishSetUpWithProfilePic(id, data, url);
    return url;
};

export const verifyUserEmail = async (id) => {
    await sendEmailVerification(auth.currentUser)
        .then(() => {
            console.log('Email verification sent!');
            return { status: 'success' };
        })
        .catch((error) => {
            console.log(error);
        });
};

export const uploadMultipleImagesAndReturnArray = async (files: any, id: any) => {
    let urls = [];
    for (let i = 0; i < files.length; i++) {
        const storageRef = ref(storage, `spaces/${id}/${i}`);
        await uploadBytes(storageRef, files[i])
            .then((snapshot) => {
                console.log('Uploaded a blob or file!', snapshot);
            })
            .catch((error) => {
                console.error('Error uploading file: ', error);
            });
        const url = await getDownloadURL(storageRef);
        urls.push(url);
    }
    return urls;
};

export const publishSpace = async (id: any, data: any, files: any) => {
    const postID = generateRandomID();
    const idToString = id.toString();
    const photos = await uploadMultipleImagesAndReturnArray(files, postID);
    const spaceRef = doc(db,"spaces", postID);
    await setDoc(spaceRef, {
        ...data,
        photos: photos,
        mainPhoto: photos[0],
        id: postID,
        createdAt: new Date(),
        userID: id,
    });
    const userRef = doc(db, "studioDB", idToString, "spaceInfo", "stats");
    await setDoc(userRef, {
        spaces: arrayUnion(postID),
        writes: increment(1),
    }, { merge: true });

    return { status: 'success', id: postID };
};

export const getSpaceData = async (id: any) => {
    const spaceRef = doc(db, 'spaces', id);
    const spaceData = await getDoc(spaceRef);
    if (spaceData.exists()) {
        return spaceData.data();
    } else {
        return null;
    }
};

export const updateLocationLink = async (id, link, spaceIDS, name) => {
    const spaceRef = doc(db, 'locations', link);

    const locationData = await getDoc(spaceRef);

    if (locationData.exists()) {
        return { status: 'error', message: 'Link already in use' };
    } else {
        await setDoc(spaceRef, {
            locationLink: link,
            name: name,
            spaces: spaceIDS,
            userID: id,
        });
        await updateDoc(doc(db, 'users', id), {
            linkConfigured: true,
            link: link,
        });
        return { status: 'success' };
    }
};

export const updateUser = async (id, data) => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, {
        ...data,
        lastUpdated: new Date(),
    });
    return { status: 'success' };
};

export const updateUsersMeta = async (id, data) => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, {
        meta: data,
        linkConfigured: true,
        lastUpdated: new Date(),
    });
    return { status: 'success' };
};

export const createBooking = async (data, userID) => {
    const bookingID = generateRandomID();
    const bookingRef = doc(db, 'bookings', bookingID);
    const spaceRef = doc(db, 'spaces', data.spaceID);
    const userRef = doc(db, 'users', userID);

    await setDoc(bookingRef, {
        ...data,
        createdAt: new Date(),
        id: bookingID,
        providerSigned: false,
        renterSigned: false,
    });
    await updateDoc(spaceRef, {
        bookings: arrayUnion(bookingID),
    });
    await updateDoc(userRef, {
        bookingsCreated: increment(1),
    });

    return { status: 'success' };
};

export const getBookings = async (id) => {
    const bookingRef = doc(db, 'bookings', id);
    const bookingData = await getDoc(bookingRef);
    if (bookingData.exists()) {
        return bookingData.data();
    } else {
        return [];
    }
};

export const getAllBookings = async (spaceID) => {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('spaceID', '==', spaceID));
    const querySnapshot = await getDocs(q);
    let bookingsArray = [];
    querySnapshot.forEach((doc) => {
        bookingsArray.push({ ...doc.data(), id: doc.id });
    });
    return bookingsArray;
};

export const updateBooking = async (id, data, userID) => {
    const bookingRef = doc(db, 'bookings', id);
    const userRef = doc(db, 'users', userID);
    await updateDoc(bookingRef, {
        ...data,
        lastUpdated: new Date(),
    });
    await updateDoc(userRef, {
        lastUpdated: new Date(),
    });
    return { status: 'success' };
};
