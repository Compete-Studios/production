import fetchData from "./fetchdata";

export const getIncomingUnreadTextMessages = async (suid, phoneNumber) => {
    try {
        const response = await fetchData(`text-helper/getIncomingUnreadTextMessages/`);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getTextLogsByStudioId = async (data) => {
    try {
        const response = await fetchData(`text-helper/getTextLogsByStudioId`, "post", data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getTextLogsByStudioIdPhone = async (data) => {
    try {
        const response = await fetchData(`text-helper/getTextLogsByStudioIdAndPhone`, "post", data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};