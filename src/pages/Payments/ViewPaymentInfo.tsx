import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatDate, hashTheID, showErrorMessage, showMessage, showWarningMessage, unHashThePayID } from '../../functions/shared';
import { UserAuth } from '../../context/AuthContext';
import { getAllCustomerPaymentAccounts, getPaymentByID, voidAPayment } from '../../functions/payments';

import { getStudentIdFromPaysimpleCustomerId, getStudentInfo, getStudioOptions } from '../../functions/api';
import IconSend from '../../components/Icon/IconSend';
import { sendIndividualEmail } from '../../functions/emails';
import { REACT_BASE_URL } from '../../constants';

export default function ViewPaymentInfo() {
    const { suid, studioInfo }:any = UserAuth();
    const { payID, amyID }: any = useParams();
    

    

    
    const amount = parseInt(amyID) / 12;
    const unHashed = unHashThePayID(payID, suid, amount);   

    

    

    

    //customerPaymentAccount is an array of cards, find the card that matches payemntInfo.AccountId
   

   

    

    

  

    return (
        <>
           
        </>
    );
}
