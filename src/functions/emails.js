import fetchData from './fetchdata';

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

export const getNumberOfEmailsSentByStudio = async (data) => {
    try {
        const response = await fetchData(`email/getNumberOfEmailsSentByStudio`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getMonthlyLimit = async (studioId) => {
    try {
        const response = await fetchData(`email/getMonthlyLimit/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getEmailLogsByStudioId = async (data) => {
    console.log(data);
    try {
        const response = await fetchData(`email/getEmailLogsByStudioId`, 'get', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllEmailLogsByStudioId = async (data) => {
    try {
        const response = await fetchData(`email/getAllEmailLogsByStudioId`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
