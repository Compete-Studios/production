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