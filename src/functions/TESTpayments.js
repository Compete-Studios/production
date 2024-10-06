import fetchData from './fetchdata';

let paysimpleRoutes = 'paysimple-helper';
if (window.location.hostname === 'localhost') {
    paysimpleRoutes = 'paysimple-test';
}

export const runPaymentForCustomer = async (paymentData) => {
    console.log('runPaymentForCustomer paymentData:', paymentData);
    try {
        const response = await fetchData(`${paysimpleRoutes}/runPayment`, 'post', paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const runPaymentForQuickPay = async (paymentData) => {
    try {
        const response = await fetchData(`${paysimpleRoutes}/runPaymentForQuickPay`, 'post', paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createNewPaySimpleCustomer = async (customerData) => {
    try {
        const response = await fetchData(`${paysimpleRoutes}/createNewCustomer`, 'post', customerData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getCustomerInfo = async (customerId, studioId) => {
    try {
        const response = await fetchData(`${paysimpleRoutes}/getCustomerInfo/${customerId}/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addCreditCardToCustomer = async (customerData) => {
    try {
        const response = await fetchData(`${paysimpleRoutes}/addCreditCardToCustomer`, 'post', customerData);
        return response;
    } catch (error) {
        throw error;
    }
};

export const addCreditCardToCustomerForQuickPay = async (customerData) => {
    try {
        const response = await fetchData(`${paysimpleRoutes}/addCreditCardToCustomerForQuickPay`, 'post', customerData);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getCreditCard = async (customerId, studioId) => {
    try {
        const response = await fetchData(`${paysimpleRoutes}/getCreditCard/${customerId}/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateCreditCard = async (cardData) => {
    try {
        const response = await fetchData(`${paysimpleRoutes}/updateCreditCard`, 'post', cardData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addBankAccountToCustomer = async (customerData) => {
    try {
        const response = await fetchData(`${paysimpleRoutes}/addBankAccountToCustomer`, 'post', customerData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getCustomerPayments = async (data) => {
    try {
        const response = await fetchData(`${paysimpleRoutes}/getCustomerPayments`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllCustomerPaymentAccounts = async (customerId, studioId) => {
    try {
        const response = await fetchData(`${paysimpleRoutes}/getAllCustomerPaymentAccounts/${customerId}/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createPaymentSchedule = async (paymentData) => {
    try {
        const response = await fetchData(`${paysimpleRoutes}/createPaymentSchedule`, 'post', paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updatePaymentSchedule = async (paymentData) => {
    try {
        const response = await fetchData(`${paysimpleRoutes}/updatePaymentSchedule`, 'post', paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPaymentByID = async (paymentId, suid) => {
    try {
        const response = await fetchData(`${paysimpleRoutes}/getPayment/${paymentId}/${suid}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const voidAPayment = async (paymentData) => {
    try {
        const response = await fetchData(`${paysimpleRoutes}/voidPayment`, 'post', paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllActivePaymentSchedules = async (studioId) => {
    try {
        const response = await fetchData(`${paysimpleRoutes}/getAllActivePaymentSchedules/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getLatePaymentsFromPaysimple = async (studioId) => {
    try {
        const response = await fetchData(`late-payment-pipeline/TESTgetLatePaymentsFromPaysimple/${studioId}`, 'get');
        console.log('TESTgetLatePaymentsFromPaysimple response:', response);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPaymentInfo = async (paymentId) => {
    try {
        const response = await fetchData(`late-payment-pipeline/getPaymentInfo/${paymentId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const suspendPaymentSchedule = async (data) => {
    try {
        const response = await fetchData(`payments/suspendPaymentSchedule`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const resumePaymentSchedule = async (data) => {
    try {
        const response = await fetchData(`${paysimpleRoutes}/resumePaymentSchedule`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const pausePaymentSchedule = async (data) => {
    try {
        const response = await fetchData(`${paysimpleRoutes}/pausePaymentSchedule`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
