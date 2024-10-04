import fetchData from './fetchdata';

export const getLatePaymentCount = async (suid) => {
    try {
        const response = await fetchData(`manual/getLatePaymentCount/${suid}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getNumberOfStudentBirthDays = async (suid) => {
    try {
        const response = await fetchData(`manual/getNumberOfStudentBirthDays/${suid}`, 'get');
        return response[0].count;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getNumberOfStudentsWithoutPaymentSchedules = async (suid) => {
    try {
        const response = await fetchData(`manual/getNumberOfStudentsWithoutPaymentSchedules/${suid}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentIdFromBillingId = async (billingId) => {
    try {
        const response = await fetchData(`manual/getStudentIdFromBillingId/${billingId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateLatePaymentSteps = async (steps) => {
    const stepData = {
        steps: steps,
    };
    try {
        const response = await fetchData(`manual/updateLatePipelineSteps`, 'post', stepData);
        return { response: response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateProspectPipelineSteps = async (steps) => {
    const stepData = {
        steps: steps,
    };
    try {
        const response = await fetchData(`manual/updateProspectPipelineSteps`, 'post', stepData);
        return { response: response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateStudentPipelineSteps = async (steps) => {
    const stepData = {
        steps: steps,
    };
    try {
        const response = await fetchData(`manual/updateStudenttPipelineSteps`, 'post', stepData);
        return { response: response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};



