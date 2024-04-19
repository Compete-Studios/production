import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AddCardModal from './AddCardModal';
import { UserAuth } from '../../context/AuthContext';
import { getAllCustomerCreditCards, getPaysimpleCustomerIdFromStudentId, getStudentBillingAccounts, getStudentInfo } from '../../functions/api';
import AddBankModal from './AddBankModal';
import Swal from 'sweetalert2';
import { hashTheID } from '../../functions/shared';
import { getAllCustomerPaymentAccounts } from '../../functions/payments';

export default function FinishedAddingAccountOptions() {
    const { suid } = UserAuth();
    const [studentID, setStudentID] = useState<number>(0);
    const [studentInfo, setStudentInfo] = useState<any>({});
    const [customerID, setCustomerID] = useState<number>(0);
    const [bankAccounts, setBankAccounts] = useState<any>([]);
    const [cards, setCards] = useState<any>([]);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const showErrorMessage = (msg = '') => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: 'error',
            title: msg,
            padding: '10px 20px',
        });
    };

    

    

    useEffect(() => {
        const parsedId: number = parseInt(id ?? '');
        const parsedSuid = parseInt(suid);
        if (!isNaN(parsedId) && !isNaN(parsedSuid)) {
            const newID: number = parsedId / parsedSuid;
            setStudentID(newID);
            getStudentInfo(newID).then((res) => {
                setStudentInfo(res);
            });
            getStudentBillingAccounts(newID).then((res) => {
                if (res.recordset.length === 0) {
                    navigate(`/students/add-billing-account/${id}`);
                } else {
                    getPaysimpleCustomerIdFromStudentId(res.recordset[0].PaysimpleCustomerId, suid).then((res) => {
                        if (res.Response) {
                            setCustomerID(res?.Response?.Id);
                            console.log(res.Response?.Id);
                        } else {
                            showErrorMessage('Error getting Paysimple ID');
                        }
                    });
                    getAllCustomerPaymentAccounts(res.recordset[0]?.PaysimpleCustomerId, suid).then((response) => {
                        console.log(response?.Response);
                        if (response?.Response?.CreditCardAccounts?.length > 0) {
                            setCards(response?.Response?.CreditCardAccounts);
                        } else {
                            setCards(null);
                        }
                        if (response?.Response?.AchAccounts?.length > 0) {
                            setBankAccounts(response?.Response?.AchAccounts);
                        } else {
                            setBankAccounts(null);
                        }
                    });
                }
            });
        } else {
            console.log('Invalid ID');
        }
    }, [id, suid]);
    return (
        <div className="space-y-4">
            <div>
                <h5 className="font-semibold text-lg uppercase">Add Payment Methods</h5>
                <p>
                    Add a payment method for{' '}
                    <span className="font-bold text-primary">
                        {studentInfo?.First_Name} {studentInfo?.Last_Name}
                    </span>{' '}
                </p>
            </div>
            <AddCardModal student={studentInfo} paySimpleID={customerID} cards={cards} />
            <AddBankModal student={studentInfo} paySimpleID={customerID} bankAccounts={bankAccounts} />
            <Link to={`/students/view-student/${hashTheID(studentID)}/${hashTheID(suid)}`} className="block text-center text-primary font-semibold">
                Go To Students Info
            </Link>
        </div>
    );
}
