import { arrayUnion, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import Swal from 'sweetalert2';

export async function fetchFromAPI(endpointURL, opts) {
    const { method, body } = { method: 'POST', body: null, ...opts };

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

export const convertPhoneNumber = (phone) => {
    return phone?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
};

export const formatDate = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toISOString().substr(0, 10);
    return formattedDate;
};

export const formatDateForStudentEdit = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toISOString().substr(0, 10);
    return formattedDate;
};


export const hashTheID = (id) => {
    return parseInt(id) * 123456789;
};

export const unHashTheID = (id) => {
    return parseInt(id) / 123456789;
};

export const hashThePayID = (id, stud, amt) => {
    const floatedAmount = parseFloat(amt);
    const floatedStudent = parseFloat(stud);
    return (parseInt(id) + floatedStudent + floatedAmount) * 123456789;
};

export const unHashThePayID = (id, stud, amt) => {
    return parseInt(id) / 123456789 - parseInt(stud) - parseInt(amt);
};

export const constFormateDateMMDDYYYY = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toISOString().substr(0, 10);
    const [year, month, day] = formattedDate.split('-');
    return `${month}-${day}-${year}`;
};

export const formatForEmails = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toISOString().substr(0, 10);
    const [year, month, day] = formattedDate.split('-');
    return `${year}-${month}-${day}`;
};

export const constFormateDateForPaySimple = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toISOString().substr(0, 10);
    const [year, month, day] = formattedDate.split('-');
    return `${month}/${day}/${year}`;
};

export const showMessage = (msg = '', type = 'success') => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        customClass: { container: 'toast' },
    });
    toast.fire({
        icon: type,
        title: msg,
        padding: '10px 20px',
    });
};

export const showErrorMessage = (msg = '') => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        customClass: { container: 'toast' },
    });
    toast.fire({
        icon: 'error',
        title: msg,
        padding: '10px 20px',
    });
};

export const showWarningMessage = (msg = '', text = '', confirmed = '', title = 'Removed!') => {
    return new Promise((resolve, reject) => {
        const toast = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-info',
                cancelButton: 'btn btn-danger ltr:mr-3 rtl:ml-3',
                popup: 'sweet-alerts',
            },
            buttonsStyling: false,
        });
        toast
            .fire({
                icon: 'warning',
                title: msg,
                text: text,
                showCancelButton: true,
                confirmButtonText: `Yes ${text}`,
                cancelButtonText: 'No, cancel!',
                reverseButtons: true,
                padding: '2em',
            })
            .then((result) => {
                if (result.value) {
                    Swal.fire({ title: title, text: confirmed, icon: 'success', customClass: 'sweet-alerts' });
                    resolve(true);
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({ title: 'Cancelled', text: 'Your data is safe :)', icon: 'error', customClass: 'sweet-alerts' });
                    resolve(false);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};



export const statusCSS = (status) => {
    switch (status) {
        case 'Pending':
            return 'text-blue-800';
        case 'Chargeback':
            return 'text-red-800';
        case 'Posted':
            return 'text-success';
        case 'Authorized':
            return 'text-success';
        case 'Failed':
            return 'text-danger';
        case 'RefundSettled':
            return 'text-purple-800';
        case 'Returned':
            return ' text-orange-800';
        case 'Reversed':
            return ' text-red-800';
        case 'Reversensf':
            return ' text-red-800';
        case 'Reverseposted':
            return ' text-red-800';
        case 'Settled':
            return 'text-info';
        case 'Voided':
            return ' text-red-800';
        case 'Active':
            return ' text-success';
        case 'Suspended':
        case 'Expired':
            return ' text-warning';
        default:
            return 'text-gray-800';
    }
};

export const showCreationAlert = async (type) => {
    return new Promise((resolve, reject) => {
        const toast = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-secondary',
                cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
                popup: 'sweet-alerts',
            },
            buttonsStyling: false,
        });
        toast
            .fire({
                icon: 'question',
                title: 'Create Default Student Pipeline Steps?',
                text: 'You can always edit the steps later',
                showCancelButton: true,
                confirmButtonText: 'Create Steps',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true,
                padding: '2em',
            })
            .then((result) => {
                if (result.value) {
                    Swal.fire({ title: 'Steps Created', text: 'You can now begin adding students to steps', icon: 'success', customClass: 'sweet-alerts' });
                    resolve(true);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
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
