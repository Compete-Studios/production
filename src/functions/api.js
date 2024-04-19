import fetchData from './fetchdata';

export const addNewStudent = async (formData) => {
    try {
        const response = await fetchData('student-access/addStudent', 'post', formData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addStudentToPrograms = async (studentId, programIds) => {
    const data = {
        studentId,
        programIds,
    };

    try {
        const response = await fetchData('student-access/addStudentToPrograms', 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addStudentToClasses = async (studentId, classIDs) => {
    const data = {
        studentId,
        classIDs,
    };
    try {
        const response = await fetchData('student-access/addStudentToClasses', 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addStudentToClass = async (studentId, classId) => {
    try {
        const response = await fetchData(`student-access/addStudentToClass/${studentId}/${classId}`, 'post');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const dropStudentFromClass = async (studentId, classId) => {
    try {
        const response = await fetchData(`class-access/dropStudentFromClass/${classId}/${studentId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addStudentToWaitingLists = async (studentId, waitingListIds) => {
    const data = {
        studentId,
        waitingListIds,
    };
    try {
        const response = await fetchData('marketing-access/addStudentToWaitingLists', 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentInfo = async (studentId) => {
    try {
        const response = await fetchData(`student-access/getStudentInfo/${studentId}`, 'get');
        return response.recordset[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getProgramsByStudentId = async (studentId) => {
    try {
        const response = await fetchData(`class-access/getProgramsByStudentId/${studentId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getClassesByStudentId = async (studentId) => {
    try {
        const response = await fetchData(`student-access/getClassesByStudentId/${studentId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getWaitingListsByStudentId = async (studentId) => {
    try {
        const response = await fetchData(`marketing-access/getWaitingListsByStudentId/${studentId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentBillingAccounts = async (studentId) => {
    try {
        const response = await fetchData(`billing-account-access/getStudentBillingAccounts/${studentId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPaysimpleCustomerIdFromStudentId = async (customerID, studioID) => {
    try {
        const response = await fetchData(`paysimple-helper/getCustomerInfo/${customerID}/${studioID}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPayments = async (studioId, startDate, endDate, status) => {
    try {
        const queryString = new URLSearchParams({
            studioId,
            startDate,
            endDate,
            status,
        }).toString();
        const url = `paysimple-helper/searchPayments?${queryString}`;
        const response = await fetchData(url, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPaymentSchedule = async (studentId) => {
    try {
        const response = await fetchData(`payment-schedules/getPaymentSchedule/${studentId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPaymentScheduleByID = async (id, suid) => {
    try {
        const response = await fetchData(`paysimple-helper/getPaymentSchedule/${id}/${suid}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPaymentSchedulesForCustomer = async (customerID, studioID) => {
    try {
        const response = await fetchData(`paysimple-helper/getPaymentSchedulesForCustomer/${customerID}/${studioID}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const searchStudents = async (queryParams) => {
    try {
        const response = await fetchData(`student-access/searchStudents`, 'post', queryParams);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const searchByValue = async (queryParams) => {
    try {
        const response = await fetchData(`student-access/searchByValue`, 'post', queryParams);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const searchProspectsByValue = async (queryParams) => {
    console.log(queryParams);
    try {
        const response = await fetchData(`student-access/searchProspectsByValue`, 'post', queryParams);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPaymentPipelineStepsByStudioId = async (studioId) => {
    try {
        const response = await fetchData(`student-access/getPaymentPipelineStepsByStudioId/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getInvoicesByStudioId = async (studioId, startDate, endDate) => {
    try {
        const response = await fetchData(`invoice-access/getInvoicesByStudioId/${studioId}/${startDate}/${endDate}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getProspectInvoicesByStudioId = async (studioId, startDate, endDate) => {
    try {
        const response = await fetchData(`invoice-access/getProspectInvoicesByStudioId/${studioId}/${startDate}/${endDate}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentIntrosByStudioId = async (studioId) => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    try {
        const response = await fetchData(`student-access/getStudentIntros/${studioId}/${month}/${year}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStaffByStudioId = async (studioId, activity) => {
    try {
        const response = await fetchData(`staff-access/getStaffByStudioId/${studioId}/${activity}`, 'get');
        return response.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addStaffMember = async (formData) => {
    try {
        const response = await fetchData(`staff-access/addStaffMember`, 'post', formData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const loadStudioRooms = async (studioId) => {
    try {
        const response = await fetchData(`class-access/getRoomsByStudioId/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getProgramsByStudioID = async (studioId) => {
    try {
        const response = await fetchData(`class-access/getProgramsByStudioId/${studioId}`, 'get');
        return response.result.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getRanksByStudioId = async (id) => {
    try {
        const response = await fetchData(`ranks/getRanksByStudioId/${id}`, 'get');
        return response.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addProspect = async (prospect) => {
    try {
        const response = await fetchData(`marketing-access/addProspect`, 'post', prospect);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const searchProspects = async (queryParams) => {
    try {
        const queryString = new URLSearchParams(queryParams).toString();
        const response = await fetchData(`marketing-access/searchProspects?${queryString}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentsInScheduleByPipelineStep = async (data) => {
    try {
        const response = await fetchData(`daily-schedule-tools/getStudentsInScheduleByPipelineStep/${data.ScheduleId}/${data.studioId}/${data.nextContactDate}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getUserFormsByStudioId = async (studioId) => {
    try {
        const response = await fetchData(`forms/getUserFormsByStudioId/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getDefaultCreditCardInfo = async (studioId, customerId) => {
    try {
        const response = await fetchData(`paysimple-helper/getDefaultCreditCard/${customerId}/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllCustomerCreditCards = async (studioId, customerId) => {
    try {
        const response = await fetchData(`paysimple-helper/getAllCustomerCreditCards/${customerId}/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudioOptions = async (studioId) => {
    try {
        const response = await fetchData(`studio-access/getStudioOptions/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentsByPipelineStep = async (studioId, pipelineStepId) => {
    try {
        const response = await fetchData(`marketing-access/getStudentsByPipelineStep/${pipelineStepId}/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getEmailLogsByStudentEmail = async (data) => {
    try {
        const queryString = new URLSearchParams({ data }).toString();
        const response = await fetchData(`email/getEmailLogsByStudentEmail?${queryString}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudioStatsByStudioID = async (studioId) => {
    const currentMonthNumber = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    try {
        const response = await fetchData(`studio-access/getStudioStats/${studioId}/${currentMonthNumber}/${currentYear}`, 'get');
        return response.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getRankByStudentId = async (studentId) => {
    try {
        const response = await fetchData(`ranks/getRankByStudentId/${studentId}`, 'get');
        return response?.recordset[0]?.Name;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentsByRankId = async (rankId) => {
    try {
        const response = await fetchData(`ranks/getStudentsByRankId/${rankId}`, 'get');
        return response.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getUploadedStudioImages = async (studioId) => {
    try {
        const response = await fetchData(`studio-access/getUploadedStudioImages/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentsByClassId = async (classId) => {
    console.log(classId);
    try {
        const response = await fetchData(`class-access/getStudentsByClassId/${classId}`, 'get');
        console.log(response);
        return response.recordset;
    } catch (error) {
        console.error(error);
        return { status: 400 };
    }
};

export const getTextMessageThread = async (studioId, toNumber, fromNumber) => {
    const query = new URLSearchParams({
        studioId,
        toNumber,
        fromNumber,
    }).toString();
    try {
        const response = await fetchData(`text-helper/getTextMessageThread?${query}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const sendAText = async (data) => {   
    try {
        const response = await fetchData(`text-helper/sendSMS`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addAClass = async (data) => {
    try {
        const response = await fetchData(`class-access/addClass`, 'post', data);
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        return { status: 400 };
    }
};

export const addClassAndSchedule = async (data) => {
    try {
        const response = await fetchData(`class-access/addClassAndSchedule`, 'post', data);
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        return { status: 400 };
    }
};

export const getTheClassScheduleByClassId = async (classId) => {
    try {
        const response = await fetchData(`class-access/getClassScheduleByClassId/${classId}`, 'get');
        return response.recordset[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getClassByClassId = async (classId) => {
    try {
        const response = await fetchData(`class-access/getClassByClassId/${classId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addRoom = async (data) => {
    try {
        const response = await fetchData(`class-access/addRoom`, 'post', data);
        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const editRoom = async (data) => {
    try {
        const response = await fetchData(`class-access/updateRoom`, 'post', data);
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const dropRoom = async (roomId) => {
    try {
        const response = await fetchData(`class-access/dropRoom/${roomId}`, 'delete');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addWaitingList = async (data) => {
    try {
        const response = await fetchData(`marketing-access/addWaitingList`, 'post', data);
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addProgram = async (data) => {
    try {
        const response = await fetchData(`class-access/addProgram`, 'post', data);
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addRank = async (data) => {
    try {
        const response = await fetchData(`ranks/addRank`, 'post', data);
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addMarketingMethod = async (data) => {
    try {
        const response = await fetchData(`marketing-access/addMarketingMethod`, 'post', data);
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateMarketingMethod = async (data) => {
    try {
        const response = await fetchData(`marketing-access/updateMarketingMethod`, 'post', data);
        console.log(response);
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const dropMarketingMethod = async (methodId) => {
    try {
        const response = await fetchData(`marketing-access/dropMarketingMethod/${methodId}`, 'delete');
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addAStudentPipelineStep = async (data) => {
    try {
        const response = await fetchData(`marketing-access/addStudentPipelineStep`, 'post', data);
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addAProspectPipelineStep = async (data) => {
    try {
        const response = await fetchData(`marketing-access/addPipelineStep`, 'post', data);
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteStudentPipelineStep = async (pipelineStepId) => {
    try {
        const response = await fetchData(`marketing-access/deleteStudentPipelineStep/${pipelineStepId}`, 'post');
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addLatePaymentPiplelineStep = async (data) => {
    try {
        const response = await fetchData(`late-payment-pipeline/addLatePaymentPipelineStep`, 'post', data);
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateStudent = async (data) => {
    try {
        const response = await fetchData(`student-access/editStudent`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateStaffActivity = async (staffId, activityLevel) => {
    try {
        const response = await fetchData(`staff-access/updateStaffActivity/${staffId}/${activityLevel}`, 'post');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const dropStudent = async (studentData) => {
    try {
        const response = await fetchData(`student-access/updateStudentActivity/`, 'post', studentData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateStudioInDB = async (studioId, studioData) => {
    try {
        const response = await fetchData(`studio-access/updateStudio/${studioId}`, 'post', studioData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateClassByClassId = async (classData) => {
    try {
        const response = await fetchData(`class-access/updateClassByClassId`, 'post', classData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStaffClassesByStaffId = async (staffId) => {
    try {
        const response = await fetchData(`staff-access/getStaffClassesByStaffId/${staffId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateStudentPipelineStep = async (data) => {
    try {
        const response = await fetchData(`marketing-access/updateStudentPipelineStep`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getProspectsByClassId = async (classId) => {
    console.log(classId);
    try {
        const response = await fetchData(`class-access/getProspectsByClassId/${classId}`, 'get');
        return response.recordset;
    } catch (error) {
        console.error(error);
        return { status: 400 };
    }
};

export const addProspectToClasses = (prospectId, classIDs) => {
    const data = {
        prospectId,
        classIDs,
    };
    try {
        const response = fetchData(`class-access/addProspectToClasses`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addProspectToWaitingLists = async (prospectId, waitingListIds) => {
    const data = {
        prospectId,
        waitingListIds,
    };
    try {
        const response = await fetchData('marketing-access/addProspectToWaitingLists', 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addStudentToProgram = async (programId, studentId) => {
    try {
        const response = await fetchData(`class-access/addStudentToProgram/${programId}/${studentId}`, 'post');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const dropStudentFromProgram = async (programId, studentId) => {
    try {
        const response = await fetchData(`class-access/dropStudentFromProgram/${programId}/${studentId}`, 'delete');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addProspectToClass = async (classId, prospectId) => {
    try {
        const response = await fetchData(`class-access/addProspectToClass/${classId}/${prospectId}`, 'post');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addProspectToProgram = async (programId, prospectId) => {
    try {
        const response = await fetchData(`class-access/addProspectToProgram/${programId}/${prospectId}`, 'post');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addProspectToPrograms = async (prospectId, programIds) => {
    const data = {
        prospectId,
        programIds,
    };
    try {
        const response = await fetchData('class-access/addProspectToPrograms', 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getProspectsByPipelineStep = async (pipelineStepId, studioId) => {
    try {
        const response = await fetchData(`marketing-access/getProspectsByPipelineStep/${pipelineStepId}/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateStudentNotes = async (studentId, notes) => {
    try {
        const response = await fetchData(`student-access/updateStudentNotes/${studentId}`, 'post', { notes });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const dropClassByClassID = async (classId) => {
    try {
        const response = await fetchData(`class-access/dropClass/${classId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStaffByClassId = async (classId) => {
    try {
        const response = await fetchData(`staff-access/getStaffByClassId/${classId}`, 'get');
        return response.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentCustomBarcodeId = async (studentId, studioId) => {
    try {
        const response = await fetchData(`student-access/getStudentCustomBarcodeId/${studentId}/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createNewInvoice = async (data) => {
    try {
        const response = await fetchData(`invoice-access/addInvoice`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const addBillingAccount = async (data) => {
    try {
        const response = await fetchData(`billing-account-access/addBillingAccount`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};