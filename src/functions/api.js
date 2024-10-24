import fetchData from './fetchdata';

export const getBirthdaysByStudioId = async (studioId, index) => {
    console.log('getBirthdaysByStudioId API', studioId, index);
    try {
        const response = await fetchData(`student-access/getBirthdaysByStudioId/${studioId}/${index}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentsByMonth = async (studioId, month) => {
    try {
        const response = await fetchData(`student-access/getBirthdaysByStudioId/${studioId}/${month}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getDNSReportForReport = async (studioId, date) => {
    try {
        const response = await fetchData(`studio-access/getDNSReport/${studioId}/${date}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

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

export const addStudentToClass = async (classData) => {
    try {
        const response = await fetchData(`student-access/addStudentToClass`, 'post', classData);
        return { response, status: 200 };
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

export const addStudentToAWaitingList = async (listData) => {
    try {
        const response = await fetchData('marketing-access/addStudentToWaitingList', 'post', listData);
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const dropStudentFromWaitingList = async (studentId, waitingListId) => {
    try {
        const response = await fetchData(`marketing-access/dropStudentFromWaitingList/${studentId}/${waitingListId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const deleteWaitingList = async (waitingListId) => {
    try {
        const response = await fetchData(`marketing-access/deleteWaitingList/${waitingListId}`, 'get');
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

export const getStudentsByProgramId = async (programId) => {
    try {
        const response = await fetchData(`class-access/getStudentsByProgramId/${programId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getProspectsByProgramId = async (programId) => {
    try {
        const response = await fetchData(`class-access/getProspectsByProgramId/${programId}`, 'get');
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

export const dropProspect = async (prospectId) => {
    try {
        const response = await fetchData(`marketing-access/dropProspect/${prospectId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const dropProspectFromWaitingList = async (prospectId, waitingListId) => {
    try {
        const response = await fetchData(`marketing-access/dropProspectFromWaitingList/${prospectId}/${waitingListId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const dropProspectFromProgram = async (prospectId, programId) => {
    try {
        const response = await fetchData(`class-access/dropProspectFromProgram/${programId}/${prospectId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const dropProspectFromClass = async (prospectId, classId) => {
    try {
        const response = await fetchData(`class-access/dropProspectFromClass/${classId}/${prospectId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getClassesByProspectId = async (prospectId) => {
    try {
        const response = await fetchData(`class-access/getClassesByProspectId/${prospectId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getWaitingListByProspectId = async (prospectId) => {
    try {
        const response = await fetchData(`class-access/getWaitingListByProspectId/${prospectId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getProgramsByProspectId = async (prospectId) => {
    try {
        const response = await fetchData(`class-access/getProgramsByProspectId/${prospectId}`, 'get');
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

export const updatePaySimpleCustomer = async (data) => {
    try {
        const response = await fetchData(`paysimple-helper/updateCustomer`, 'post', data);
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

export const searchByValues = async (queryParams) => {
    try {
        const response = await fetchData(`student-access/searchByValues`, 'post', queryParams);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const searchProspectsByValue = async (queryParams) => {
    try {
        const response = await fetchData(`student-access/searchProspectsByValue`, 'post', queryParams);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const searchProspectsByValues = async (queryParams) => {
    try {
        const response = await fetchData(`student-access/searchProspectsByValues`, 'post', queryParams);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const searchProspectsBySearchTerm = async (queryParams) => {
    try {
        const response = await fetchData(`student-access/searchProspectsBySearchTerm`, 'post', queryParams);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const searchProspectsByPhone = async (queryParams) => {
    try {
        const response = await fetchData(`student-access/searchProspectsByPhoneNumber`, 'post', queryParams);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const searchStudentsByPhone = async (queryParams) => {
    try {
        const response = await fetchData(`student-access/searchStudentsByPhone`, 'post', queryParams);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const searchStaffByPhone = async (queryParams) => {
    try {
        const response = await fetchData(`staff-access/searchStaffByPhone`, 'post', queryParams);
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

export const getPaymentPipelineStepById = async (pipelineStepId) => {
    try {
        const response = await fetchData(`late-payment-pipeline/getPaymentPipelineStep/${pipelineStepId}`, 'get');
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

export const getInvoiceById = async (invoiceId) => {
    try {
        const response = await fetchData(`invoice-access/getInvoice/${invoiceId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const markInvoiceAsPaid = async (invoiceId, paymentID) => {
    try {
        const response = await fetchData(`invoice-access/markInvoiceAsPaid/${invoiceId}/${paymentID}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteInvoice = async (invoiceId) => {
    try {
        const response = await fetchData(`invoice-access/deleteInvoice/${invoiceId}`, 'get');
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

export const addStaffToClass = async (staffId, classID) => {
    try {
        const response = await fetchData(`staff-access/addStaffToClass/${staffId}/${classID}`, 'get');
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addStaffToClasses = async (staffId, classIDs) => {
    const data = {
        staffId,
        classIDs,
    };
    try {
        const response = await fetchData('staff-access/addStaffToClasses', 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addStaffIDSToClass = async (classId, staffIds) => {
    const data = {
        classId,
        staffIds,
    };
    try {
        const response = await fetchData('staff-access/addStaffIDSToClass', 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateStaffIDStoClass = async (classId, staffIds) => {
    const data = {
        classId,
        staffIds,
    };
    try {
        const response = await fetchData('staff-access/updateStaffIDStoClass', 'post', data);
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

export const getRoomByRoomId = async (roomId) => {
    try {
        const response = await fetchData(`class-access/getRoomByRoomId/${roomId}`, 'get');
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

export const dropRank = async (rankId) => {
    try {
        const response = await fetchData(`ranks/dropRank/${rankId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateStudentRank = async (data) => {
    try {
        const response = await fetchData(`ranks/updateStudentsRank`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const dropStudentFromRank = async (studentId, rankId) => {
    console.log('dropStudentFromRank', studentId, rankId);
    try {
        const response = await fetchData(`ranks/dropStudentFromRank/${studentId}/${rankId}`, 'get');
        return response;
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
        const response = await fetchData(`daily-schedule-tools/getStudentsInScheduleByPipelineStep/${data.pipelineStepId}/${data.studioId}/${data.nextContactDate}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentsInScheduleByPipelineStepFromArrayOfSteps = async (data) => {
    try {
        const response = await fetchData(`daily-schedule-tools/getStudentsInScheduleByPipelineStepFromArrayOfSteps`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addPPStepToDailySchedule = async (data) => {
    try {
        const response = await fetchData(`daily-schedule-tools/addPPStepToDailySchedule`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const removePPStepFromDailySchedule = async (data) => {
    try {
        const response = await fetchData(`daily-schedule-tools/removePPStepFromDailySchedule`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const removeSPStepFromDailySchedule = async (data) => {
    try {
        const response = await fetchData(`daily-schedule-tools/removeSPStepFromDailySchedule`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addSPStepToDailySchedule = async (data) => {
    try {
        const response = await fetchData(`daily-schedule-tools/addSPStepToDailySchedule`, 'post', data);
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

export const getRankIDStudentId = async (studentId) => {
    try {
        const response = await fetchData(`ranks/getRankByStudentId/${studentId}`, 'get');
        return response?.recordset[0]?.RankId;
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
    try {
        const response = await fetchData(`class-access/getStudentsByClassId/${classId}`, 'get');
        return response.recordset;
    } catch (error) {
        console.error(error);
        return { status: 400 };
    }
};

export const getAttendanceByClassAndDate = async (classId, studentId, startDate, endDate) => {
    try {
        const response = await fetchData(`class-access/getAttendanceByClassAndDate/${classId}/${studentId}/${startDate}/${endDate}`, 'get');
        return response.recordset;
    } catch (error) {
        console.error(error);
        throw error;
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
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateAttendance = async (data) => {
    try {
        const response = await fetchData(`class-access/updateAttendance`, 'post', data);
        return response;
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
        const response = await fetchData(`class-access/dropRoom/${roomId}`, 'get');
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

export const dropProgram = async (programId) => {
    try {
        const response = await fetchData(`class-access/dropProgram/${programId}`, 'get');
        return response;
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
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const dropMarketingMethod = async (methodId) => {
    try {
        const response = await fetchData(`marketing-access/dropMarketingMethod/${methodId}`, 'get');
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
        const response = await fetchData(`marketing-access/deleteStudentPipelineStep/${pipelineStepId}`, 'get');
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
        const response = await fetchData(`staff-access/updateStaffActivity/${staffId}/${activityLevel}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateStaffMember = async (data) => {
    try {
        const response = await fetchData(`staff-access/updateStaffMember`, 'post', data);
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

export const updateStudioOptionsPicture = async (studioData) => {
    try {
        const response = await fetchData(`studio-access/updateStudioOptionsPicture`, 'post', studioData);
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

export const updateClassAndSchedule = async (data) => {
    try {
        const response = await fetchData(`class-access/updateClassAndSchedule`, 'post', data);
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const dropClassScheduleByScheduleId = async (scheduleId) => {
    try {
        const response = await fetchData(`class-access/dropClassScheduleByScheduleId/${scheduleId}`, 'get');
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

export const addProspectToWaitingList = async (listData) => {
    try {
        const response = await fetchData('marketing-access/addProspectToWaitingList', 'post', listData);
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addAStudentToProgram = async (programData) => {
    try {
        const response = await fetchData(`student-access/addStudentToProgram`, 'post', programData);
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const dropStudentFromProgram = async (programId, studentId) => {
    try {
        const response = await fetchData(`class-access/dropStudentFromProgram/${programId}/${studentId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const dropStudentFromBillingAccount = async (studentId, paysimpleCustomerId) => {
    try {
        const response = await fetchData(`billing-account-access/deleteBillingAccount/${paysimpleCustomerId}/${studentId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllStudensWithBarcode = async (studioId) => {
    try {
        const response = await fetchData(`student-access/getAllStudentsWithBarcode/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addProspectToClass = async (classId, prospectId) => {
    try {
        const response = await fetchData(`class-access/addProspectToClass/${classId}/${prospectId}`, 'get');
        return { response, status: 200 };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addProspectToProgram = async (programId, prospectId) => {
    try {
        const response = await fetchData(`class-access/addProspectToProgram/${programId}/${prospectId}`, 'get');
        return { response, status: 200 };
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

export const updateProspectPipelineStatus = async (data) => {
    try {
        const response = await fetchData(`marketing-access/updateProspectPipelineStatus`, 'post', data);
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

export const updateProspectNotes = async (noteData) => {
    try {
        const response = await fetchData(`marketing-access/updateProspectNotes`, 'post', noteData);
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

export const getStaffByStaffId = async (staffId) => {
    try {
        const response = await fetchData(`staff-access/getStaffByStaffId/${staffId}`, 'get');
        return response.recordset[0];
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

export const updateStudentPipelineStatus = async (data) => {
    try {
        const response = await fetchData(`student-access/updateStudentPipelineStatus`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentIdFromPaysimpleCustomerId = async (customerId) => {
    try {
        const response = await fetchData(`billing-account-access/getStudentIdFromPaysimpleCustomerId/${customerId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getNumberOfTextsSentByStudioHelper = async (textData) => {
    try {
        const response = await fetchData(`text-helper/getNumberOfTextsSentByStudio`, 'post', textData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getCountOfInactiveOrInactive = async (studioId, activity) => {
    try {
        const response = await fetchData(`studio-access/getCountOfInactiveOrInactive/${studioId}/${activity}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getCountOfActiveProspects = async (studioId) => {
    try {
        const response = await fetchData(`marketing-access/getProspectsInAPipeline/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentNameByPhone = async (phone, studioID) => {
    try {
        const response = await fetchData(`student-access/getStudentNameByPhone/${studioID}/${phone}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentsByNextContactDate = async (dateData) => {
    try {
        const response = await fetchData(`daily-schedule-tools/getStudentsByNextContactDate`, 'post', dateData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getProspectsByNextContactDate = async (dateData) => {
    try {
        const response = await fetchData(`daily-schedule-tools/getProspectsByNextContactDate`, 'post', dateData);
        return response.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getProspectsInScheduleByPipelineStep = async (data) => {
    try {
        const response = await fetchData(`daily-schedule-tools/getProspectsInScheduleByPipelineStep/${data.pipelineStepId}/${data.studioId}/${data.nextContactDate}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getProspectsInScheduleByPipelineStepFromArrayOfSteps = async (data) => {
    try {
        const response = await fetchData(`daily-schedule-tools/getProspectsInScheduleByPipelineStepFromArrayOfSteps`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getProspectById = async (prospectId) => {
    try {
        const response = await fetchData(`marketing-access/getProspect/${prospectId}`, 'get');
        return response.recordset[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateProspectPipelineStep = async (data) => {
    try {
        const response = await fetchData(`marketing-access/updatePipelineStep`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deletePipelineStep = async (pipelineStepId) => {
    try {
        const response = await fetchData(`marketing-access/deletePipelineStep/${pipelineStepId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteLatePaymentPipelineStep = async (pipelineStepId) => {
    try {
        const response = await fetchData(`late-payment-pipeline/deletePaymentPipelineStep/${pipelineStepId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAttendanceByClassIdDate = async (classId, date, type) => {
    try {
        const response = await fetchData(`studio-access/getAttendanceByClassIdDate/${classId}/${date}/${type}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getProspectAttendanceByClassIdDate = async (classId, date, type) => {
    try {
        const response = await fetchData(`studio-access/getProspectAttendanceByClassIdDate/${classId}/${date}/${type}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getWaiverByStudioId = async (studioId) => {
    try {
        const response = await fetchData(`waiver-access/getWaiverByStudioId/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateProspectByColumn = async (data) => {
    try {
        const response = await fetchData(`marketing-access/updateProspectByColumnname`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateStudentByColumn = async (data) => {
    try {
        const response = await fetchData(`student-access/updateStudentByColumnname`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getIncomingUnreadTextMessages = async (data) => {
    try {
        const response = await fetchData(`text-helper/getIncomingUnreadTextMessages`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addNewStudio = async (formData) => {
    try {
        const response = await fetchData('studio-access/addStudio', 'post', formData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateStudioOptions = async (studioId, formData) => {
    try {
        const response = await fetchData(`studio-access/updateStudioOptions/${studioId}`, 'post', formData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudioInfo = async (studioId) => {
    try {
        const response = await fetchData(`studio-access/getStudioInfo/${studioId}`, 'get');
        return response.recordset[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateStudioPaysimpleCredentials = async (formData) => {
    try {
        const response = await fetchData(`studio-access/updateStudioPaysimpleCredentials`, 'post', formData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateStudioActivity = async (studioId, activityLevel) => {
    try {
        const response = await fetchData(`studio-access/updateStudioActivity/${studioId}/${activityLevel}`, 'post');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getMasterStudios = async () => {
    try {
        const response = await fetchData('admin-tools/getMasterStudios', 'get');
        return response.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getSubStudiosForMaster = async (msId) => {
    try {
        const response = await fetchData(`admin-tools/getSubStudiosForMaster/${msId}`, 'get');
        return response.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const setStudioAsMaster = async (studioId) => {
    try {
        const response = await fetchData(`admin-tools/setStudioAsMaster/${studioId}`, 'post');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addStudioToItselfAsAMaster = async (msId) => {
    try {
        const response = await fetchData(`admin-tools/addStudioToItselfAsAMaster/${msId}`, 'post');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addStudioToMasterStudioRoster = async (msId, studioId) => {
    try {
        const response = await fetchData(`admin-tools/addStudioToMasterStudioRoster/${msId}/${studioId}`, 'post');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getUserFormInfo = async (formId) => {
    try {
        const response = await fetchData(`forms/getUserFormInfo/${formId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteForm = async (formId) => {
    try {
        const response = await fetchData(`forms/deleteForm/${formId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudioSnapShot = async (startDate, endDate, suid) => {
    try {
        const response = await fetchData(`reports/getStudioSnapshot/${startDate}/${endDate}/${suid}`, 'get');
        return response.recordset[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getFirstContactStudents = async (startDate, endDate, suid) => {
    try {
        const response = await fetchData(`reports/getFirstContactStudents/${startDate}/${endDate}/${suid}`, 'get');
        return response.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getFirstContactProspects = async (startDate, endDate, suid) => {
    try {
        const response = await fetchData(`reports/getFirstContactProspects/${startDate}/${endDate}/${suid}`, 'get');
        return response.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentIntros = async (startDate, endDate, suid) => {
    try {
        const response = await fetchData(`reports/getStudentIntros/${startDate}/${endDate}/${suid}`, 'get');
        return response.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getProspectIntros = async (startDate, endDate, suid) => {
    try {
        const response = await fetchData(`reports/getProspectIntros/${startDate}/${endDate}/${suid}`, 'get');
        return response.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentFirstClasses = async (startDate, endDate, suid) => {
    try {
        const response = await fetchData(`reports/getStudentFirstClasses/${startDate}/${endDate}/${suid}`, 'get');
        return response.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getProspectFirstClasses = async (startDate, endDate, suid) => {
    try {
        const response = await fetchData(`reports/getProspectFirstClasses/${startDate}/${endDate}/${suid}`, 'get');
        return response.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentEnrollments = async (startDate, endDate, suid) => {
    try {
        const response = await fetchData(`reports/getStudentEnrollments/${startDate}/${endDate}/${suid}`, 'get');
        return response.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentWithdrawals = async (startDate, endDate, suid) => {
    try {
        const response = await fetchData(`reports/getStudentWithdrawals/${startDate}/${endDate}/${suid}`, 'get');
        return response.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllActivePaymentSchedules = async (studioId) => {
    try {
        const response = await fetchData(`paysimple-helper/getAllActivePaymentSchedules/${studioId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const searchAll = async (searchData) => {
    try {
        const response = await fetchData(`student-access/searchStudentProspectsAndStaffByValues`, 'post', searchData);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getStudentsByBillingId = async (billingId) => {
    try {
        const response = await fetchData(`billing-account-access/getStudentsByBillingId/${billingId}`, 'get');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addCustomBarcodeId = async (data) => {
    try {
        const response = await fetchData(`student-access/addCustomBarcodeId`, 'post', data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateSteps = async (data) => {
    for (let i = 0; i < data.length; i++) {
        try {
            const response = await fetchData(`marketing-access/updatePipelineStepsOrder`, 'post', data[i]);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};


