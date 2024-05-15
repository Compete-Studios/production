import fetchData from "./fetchdata";

export const runPaymentForCustomer = async (paymentData) => {
    try {
        const response = await fetchData(`paysimple-helper/runPayment`, 'post',  paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addInternalPayment = async (paymentData) => {
    try {
        const response = await fetchData(`payments/addInternalPayment`, 'post',  paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createNewPaySimpleCustomer = async (customerData) => {
    try {
        const response = await fetchData(`paysimple-helper/createNewCustomer`, 'post',  customerData);
        console.log(response, 'response');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addCreditCardToCustomer = async (customerData) => {
    try {
        const response = await fetchData(`paysimple-helper/addCreditCardToCustomer`, 'post',  customerData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addBankAccountToCustomer = async (customerData) => {
    try {
        const response = await fetchData(`paysimple-helper/addBankAccountToCustomer`, 'post',  customerData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllCustomerPaymentAccounts = async (customerId, studioId) => {
    try {
        const response = await fetchData(`paysimple-helper/getAllCustomerPaymentAccounts/${customerId}/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createPaymentSchedule = async (paymentData) => {
    try {
        const response = await fetchData(`paysimple-helper/createPaymentSchedule`, 'post',  paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPaymentByID = async (paymentId, suid) => {
    try {
        const response = await fetchData(`paysimple-helper/getPayment/${paymentId}/${suid}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const voidAPayment = async (paymentData) => {
    try {
        const response = await fetchData(`paysimple-helper/voidPayment`, 'post',  paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPaymentsByPipelineStep = async (pipelineStepId, studioID) => {
    try {
        const response = await fetchData(`late-payment-pipeline/getPaymentsByPipelineStep/${pipelineStepId}/${studioID}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getLatePayment = async (paymentId) => {
    try {
        const response = await fetchData(`late-payment-pipeline/getLatePayment/${paymentId}`, 'get');
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

export const getPaymentNotes = async (paymentId) => {
    try {
        const response = await fetchData(`payments/getPaymentNotes/${paymentId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const addPaymentNotes = async (paymentId, notes) => {
    const paymentData = {
        paymentId: paymentId,
        notes: notes
    }
    console.log(paymentData);
    try {
        const response = await fetchData(`payments/addPaymentNotes`, 'post',  paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const ignorePayment = async (paymentId) => {
    try {
        const response = await fetchData(`late-payment-pipeline/ignorePayment/${paymentId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getCustomerPayments = async (data) => {
    try {
        const response = await fetchData(`paysimple-helper/getCustomerPayments`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}