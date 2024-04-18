import { arrayUnion, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

export async function fetchFromAPI(endpointURL, opts) {
    const { method, body } = { method: 'POST', body: null, ...opts };
    // const API = 'https://quirky-curie.209-59-154-172.plesk.page/api'
    const API = 'http://localhost:3333/api';

    const user = auth.currentUser;
    const token = user && (await user.getIdToken());

    const res = await fetch(`${API}/${endpointURL}`, {
        method,
        ...(body && { body: JSON.stringify(body) }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    return res.json();
}

export const convertPhone = (phone) => {
    if (phone) {
        let phoneArr = phone.split('');
        phoneArr.splice(3, 0, '-');
        phoneArr.splice(7, 0, '-');
        return phoneArr.join('');
    } else {
        return '';
    }
};

export const formatDate = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toISOString().substr(0, 10);
    return formattedDate;
};

export const constFormateDateMMDDYYYY = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toISOString().substr(0, 10);
    const [year, month, day] = formattedDate.split('-');
    return `${month}-${day}-${year}`;
};

// export const createUsersFromLargeJSON = (json) => {
//   try {
//     json.forEach(async (user) => {
//       await setDoc(doc(db, "studios", user.Studio_Id.toString()), {
//         ...user,
//         loggedIn: false,
//       });
//       await setDoc(
//         doc(db, "users", user.Desired_UserName),
//         {
//           email: user.Contact_Email,
//           studioID: arrayUnion(user.Studio_Id.toString()),
//           name: user.Contact_Name,
//         },
//         { merge: true }
//       );
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
