export const getIncomingUnreadTextMessages = async (suid, phoneNumber) => {
    try {
        const response = await fetchData(`text-helper/getIncomingUnreadTextMessages/`);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};