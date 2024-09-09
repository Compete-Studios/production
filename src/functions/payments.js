import fetchData from './fetchdata';

export const runPaymentForCustomer = async (paymentData) => {
    console.log('runPaymentForCustomer paymentData:', paymentData);
    try {
        const response = await fetchData(`paysimple-helper/runPayment`, 'post', paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const runPaymentForQuickPay = async (paymentData) => {
    try {
        const response = await fetchData(`paysimple-helper/runPaymentForQuickPay`, 'post', paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createNewPaySimpleCustomer = async (customerData) => {
    try {
        const response = await fetchData(`paysimple-helper/createNewCustomer`, 'post', customerData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addCreditCardToCustomer = async (customerData) => {
    try {
        const response = await fetchData(`paysimple-helper/addCreditCardToCustomer`, 'post', customerData);
        return response;
    } catch (error) {
        throw error;
    }
};

export const addCreditCardToCustomerForQuickPay = async (customerData) => {
    try {
        const response = await fetchData(`paysimple-helper/addCreditCardToCustomerForQuickPay`, 'post', customerData);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getCreditCard = async (customerId, studioId) => {
    try {
        const response = await fetchData(`paysimple-helper/getCreditCard/${customerId}/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateCreditCard = async (cardData) => {
    try {
        const response = await fetchData(`paysimple-routes/updateCreditCard`, 'post', cardData);
        return response;
    } catch (error) {
        console.error(error);
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
        const response = await fetchData(`paysimple-helper/addBankAccountToCustomer`, 'post', customerData);
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
        const response = await fetchData(`paysimple-helper/getCustomerPayments`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

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
        const response = await fetchData(`paysimple-helper/getAllCustomerPaymentAccounts/${customerId}/${studioId}`, 'get');
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
        const response = await fetchData(`paysimple-helper/createPaymentSchedule`, 'post', paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updatePaymentSchedule = async (paymentData) => {
    try {
        const response = await fetchData(`paysimple-helper/updatePaymentSchedule`, 'post', paymentData);
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
        const response = await fetchData(`paysimple-helper/getPayment/${paymentId}/${suid}`, 'get');
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
        const response = await fetchData(`paysimple-helper/voidPayment`, 'post', paymentData);
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

export const getAllActivePaymentSchedules = async (studioId) => {
    try {
        const response = await fetchData(`paysimple-test/getAllActivePaymentSchedules/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getInternalPaymentSchedulesByStudioId = async (studioId) => {
    // This gets all INTERNAL payment schedules (stored in our db, not Paysimple)
    try {
        const response = await fetchData(`payments/getInternalPaymentSchedulesByStudioId/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

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

export const getLatePaymentsFromPaysimple = async (studioId) => {
    try {
        const response = await fetchData(`late-payment-pipeline/getLatePaymentsFromPaysimple/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const TESTgetLatePaymentsFromPaysimple = async (studioId) => {
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

export const getPaymentNotes = async (paymentId) => {
    try {
        const response = await fetchData(`payments/getPaymentNotes/${paymentId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPaymentScheduleNote = async (paymentScheduleId) => {
    try {
        const response = await fetchData(`payments/getPaymentScheduleNote/${paymentScheduleId}`, 'get');
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
        const response = await fetchData(`paysimple-helper/resumePaymentSchedule`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const pausePaymentSchedule = async (data) => {
    try {
        const response = await fetchData(`paysimple-helper/pausePaymentSchedule`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addPaymentScheduleNote = async (paymentScheduleId, notes) => {
    const paymentData = {
        paymentScheduleId: paymentScheduleId,
        notes: notes,
    };
    try {
        const response = await fetchData(`payments/addPaymentScheduleNote`, 'post', paymentData);
        console.log('AddPaymentScheduleNote response:', response);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addPaymentNotes = async (paymentId, notes) => {
    const paymentData = {
        paymentId: paymentId,
        notes: notes,
    };
    try {
        const response = await fetchData(`payments/addPaymentNotes`, 'post', paymentData);
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
};

export const deleteInternalPayment = async (paymentId) => {
    try {
        const response = await fetchData(`payments/deleteInternalPayment/${paymentId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateLatePaymentDateStepID = async (paymentData) => {
    try {
        const response = await fetchData(`late-payment-pipeline/updateLatePaymentDateStepID`, 'post', paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const showAPaymentWasRetried = async (paymentData) => {
    try {
        const response = await fetchData(`late-payment-pipeline/showAPaymentWasRetried`, 'post', paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addLatePayment = async (paymentData) => {
    try {
        const response = await fetchData(`late-payment-pipeline/addLatePayment`, 'post', paymentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createPaysimpleWebhook = async (data) => {
    try {
        const response = await fetchData(`paysimple-routes/createWebhook`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const failedPaymentWebhookAuth = async () => {
    try {
        const response = await fetchData(`paysimple-routes/failedPaymentWebhookAuth`, 'post');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addWebhookToOurDB = async (data) => {
    try {
        const response = await fetchData(`payments/addWebhook`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudioIdFromPaysimpleCustomerId = async (customerId) => {
    try {
        const response = await fetchData(`billing-account-access/getStudioIdFromPaysimpleCustomerId/${customerId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Retry utility function
const retry = async (fn, retries = 3, delay = 1000) => {
    try {
        return await fn();
    } catch (error) {
        if (shouldRetry(error) && retries > 0) {
            console.warn(`Retrying... ${retries} attempts left`);
            await new Promise(res => setTimeout(res, delay + Math.random() * 500)); // Add jitter
            return retry(fn, retries - 1, delay * 2); // Exponential backoff with jitter
        } else {
            throw error;
        }
    }
};

// Determines if an error is retryable
const shouldRetry = (error) => {
    if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        return true;
    }

    if (error.response) {
        const status = error.response.status;
        if (status >= 500 && status < 600) { // Server errors
            return true;
        }
        if (status === 429) { // Too many requests
            return true;
        }
    }

    // Detecting SQL deadlock error codes (e.g., SQL Server's 1205)
    if (error.message && error.message.includes('deadlock')) {
        return true;
    }

    return false;
};


// export const addLatePayment = async (paymentData) => {
//     // Retry the request if it fails
//     return retry(async () => {
//         try {
//             const response = await fetchData(`late-payment-pipeline/addLatePayment`, 'post', paymentData);
//             return response;
//         } catch (error) {
//             console.error("Error in addLatePayment:", error);
//             throw error;
//         }
//     });
// };
