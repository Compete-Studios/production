import fetchData from './fetchdata';

export const getAllSchedules = async (suid) => {
    try {
        const response = await fetchData(`psall/listRecurringPayments/${suid}`, 'get');
        return response.Response
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllSchedulesByStatus = async (suid, status) => {
    try {
        const response = await fetchData(`psall/listRecurringPayments/${suid}/${status}`, 'get');
        return response.Response
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const listAllCustomers = async (suid) => {
    try {
        const response = await fetchData(`psall/listCustomers/${suid}`, 'get');   
        return response
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const handleGetPayment = async (suid, paymentId) => {
    try {
        const response = await fetchData(`psall/getPayment/${suid}/${paymentId}`, 'get');
        return response.Response
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPaymentsForCustomer = async (suid, customerId) => {
    try {
        const response = await fetchData(`psall/listofPayments/${suid}/${customerId}`, 'get');
        return response.Response
    } catch (error) {
        console.error(error);
        throw error;
    }
};


