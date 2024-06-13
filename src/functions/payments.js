import fetchData from "./fetchdata";

export const runPaymentForCustomer = async (paymentData) => {
    try {
        const response = await fetchData(`paysimple-routes/runPayment`, 'post',  paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// ****FOR TESTING****
// export const runPaymentForCustomer = async (paymentData) => {
//     try {
//         const response = await fetchData(`paysimple-test/runPayment`, 'post', paymentData);
//         return response;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

export const createNewPaySimpleCustomer = async (customerData) => {
    try {
        const response = await fetchData(`paysimple-routes/createNewCustomer`, 'post', customerData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// ****FOR TESTING****
// export const createNewPaySimpleCustomer = async (customerData) => {
//     try {
//         const response = await fetchData(`paysimple-test/createNewCustomer`, 'post', customerData);
//         return response;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

export const addCreditCardToCustomer = async (customerData) => {
    try {
        const response = await fetchData(`paysimple-routes/addCreditCardToCustomer`, 'post', customerData);
        return response;
    } catch (error) {
        throw error;  
    }
};

// ****FOR TESTING****
// export const addCreditCardToCustomer = async (customerData) => {
//     try {
//         const response = await fetchData(`paysimple-test/addCreditCardToCustomer`, 'post', customerData);
//         return response;
//     } catch (error) {
//         throw error;
//     }
// };


export const addBankAccountToCustomer = async (customerData) => {
    try {
        const response = await fetchData(`paysimple-routes/addBankAccountToCustomer`, 'post',  customerData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// ****FOR TESTING****
// export const addBankAccountToCustomer = async (customerData) => {
//     try {
//         const response = await fetchData(`paysimple-test/addBankAccountToCustomer`, 'post', customerData);
//         return response;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

export const getCustomerPayments = async (data) => {
    try {
        const response = await fetchData(`paysimple-routes/getCustomerPayments`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// ****FOR TESTING****
// export const getCustomerPayments = async (data) => {
//     try {
//         const response = await fetchData(`paysimple-test/getCustomerPayments`, 'post', data);
//         return response;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

export const getAllCustomerPaymentAccounts = async (customerId, studioId) => {
    try {
        const response = await fetchData(`paysimple-routes/getAllCustomerPaymentAccounts/${customerId}/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// ****FOR TESTING****
// export const getAllCustomerPaymentAccounts = async (customerId, studioId) => {
//     try {
//         const response = await fetchData(`paysimple-test/getAllCustomerPaymentAccounts/${customerId}/${studioId}`, 'get');
//         return response;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

export const createPaymentSchedule = async (paymentData) => {
    try {
        const response = await fetchData(`paysimple-routes/createPaymentSchedule`, 'post',  paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// ****FOR TESTING****
// export const createPaymentSchedule = async (paymentData) => {
//     try {
//         const response = await fetchData(`paysimple-test/createPaymentSchedule`, 'post', paymentData);
//         return response;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

export const getPaymentByID = async (paymentId, suid) => {
    try {
        const response = await fetchData(`paysimple-routes/getPayment/${paymentId}/${suid}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// ****FOR TESTING****
// export const getPaymentByID = async (paymentId, suid) => {
//     try {
//         const response = await fetchData(`paysimple-test/getPayment/${paymentId}/${suid}`, 'get');
//         return response;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };


export const voidAPayment = async (paymentData) => {
    try {
        const response = await fetchData(`paysimple-routes/voidPayment`, 'post',  paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// ****FOR TESTING****
// export const voidAPayment = async (paymentData) => {
//     try {
//         const response = await fetchData(`paysimple-test/voidPayment`, 'post', paymentData);
//         return response;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

export const addInternalPayment = async (paymentData) => {
    try {
        const response = await fetchData(`payments/addInternalPayment`, 'post', paymentData);
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
    try {
        const response = await fetchData(`payments/addPaymentNotes`, 'post',  paymentData);
        console.log('AddPaymentNote response:', response);  
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

export const getInternalPaymentsByStudentId = async (studentId) => {
    try {
        const response = await fetchData(`payments/getInternalPaymentsByStudentId/${studentId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteInternalPayment = async (paymentId) => {
    try {
        const response = await fetchData(`payments/deleteInternalPayment/${paymentId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateLatePaymentDateStepID = async (paymentData) => {
    try {
        const response = await fetchData(`late-payment-pipeline/updateLatePaymentDateStepID`, 'post', paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}