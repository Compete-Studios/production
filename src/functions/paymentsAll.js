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

export const getCustomer = async (suid, customerId) => {
    try {
        const response = await fetchData(`psall/getCustomer/${suid}/${customerId}`, 'get');
        return response.Response
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const listAccountsForCustomer = async (suid, customerId) => {
    try {
        const response = await fetchData(`psall/listAccountsForCustomer/${suid}/${customerId}`, 'get');
        return response.Response
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const listCustomerRecurringPayments = async (suid, customerId) => {
    try {
        const response = await fetchData(`psall/listCustomerRecurringPayments/${suid}/${customerId}`, 'get');
        return response.Response
    } catch (error) {
        console.error(error);
        throw error;
    }
}


