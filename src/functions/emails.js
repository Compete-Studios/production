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

export const getTextLogsByStudioIdAndPhoneNumber = async (textData) => { 
    try {
        const response = await fetchData(`text-helper/getTextLogsByStudioIdAndPhoneNumber`, 'post', textData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addTextLog = async (textData) => {
    try {
        const response = await fetchData(`text-helper/addTextLog`, 'post', textData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

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

export const sendEmailToClass = async (emailData) => {
    try {
        const response = await fetchData(`class-access/sendEmailToClass`, 'post', emailData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getNewsletterLogsByStudioId = async (data) => {
    try {
        const response = await fetchData(`email/getNewsletterLogsByStudioId`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getNewsletterDetails = async (id) => {
    try {
        const response = await fetchData(`email/getNewsletterDetails/${id}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getEmailLogsByNewsletterId = async (id) => {
    try {
        const response = await fetchData(`email/getEmailLogsByNewsletterId/${id}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getAllEmailingListsByStudioId = async (studioID) => {
    try {
        const response = await fetchData(`email/GetAllEmailingListsByStudioId/${studioID}`, 'get',);
        return response.lists;
    } catch (error) {
        console.error(error);
        throw error;
    }
};