import fetchData from "./fetchdata";

export const sendIndividualEmail = async (emailData) => {
    try {
        const response = await fetchData(`student-access/sendEmail`, 'post', emailData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getTextLogsByStudioIdAndPhoneNumber = async (suid, phoneNumber) => {
    try {
        const response = await fetchData(`text-helper/getTextLogsByStudioIdAndPhoneNumber/${phoneNumber}/${suid}`);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};