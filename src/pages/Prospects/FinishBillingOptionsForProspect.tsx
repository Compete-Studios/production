import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import { hashTheID } from '../../functions/shared';
import AddCardModal from '../Students/AddCardModal';
import AddBankModal from '../Students/AddBankModal';
import { getAllCustomerPaymentAccounts } from '../../functions/payments';
import { getProspectById, getProspectBillingAccount } from '../../functions/api';

export default function FinishedBillingOptionsForProspect() {
    const { suid }: any = UserAuth();
    const [prospectId, setProspectId] = useState<number>(0);
    const [update, setUpdate] = useState<boolean>(false);
    const [prospectInfo, setProspectInfo] = useState<any>({});
    const [customerID, setCustomerID] = useState<number>(0);
    const [bankAccounts, setBankAccounts] = useState<any>([]);
    const [cards, setCards] = useState<any>([]);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const parsedId: number = parseInt(id ?? '');
        const parsedSuid = parseInt(suid);
        if (!isNaN(parsedId) && !isNaN(parsedSuid)) {
            const newID: number = parsedId / parsedSuid;
            setProspectId(newID);
            getProspectById(newID).then((res) => {
                setProspectInfo(res);
            });
            getProspectBillingAccount(newID).then((res) => {
                if (res.recordset.length === 0) {
                    navigate(`/prospects/add-billing-account/${id}`);
                } else {
                    console.log('get Prospect Billing Res: ', res);
                    setCustomerID(res?.recordset[0]?.PaysimpleCustomerId);
                    getAllCustomerPaymentAccounts(customerID, suid).then((response) => {
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
                        {prospectInfo?.First_Name} {prospectInfo?.Last_Name}
                    </span>{' '}
                </p>
            </div>
            <div className="sm:flex space-y-4 sm:space-y-0 gap-4">
                <div className="w-full">
                    <AddCardModal student={prospectInfo} paySimpleID={customerID} cards={cards} update={update} setUpdate={setUpdate} />
                </div>
                <div className="w-full">
                    <AddBankModal student={prospectInfo} paySimpleID={customerID} bankAccounts={bankAccounts} update={update} setUpdate={setUpdate} />
                </div>
            </div>
            <Link to={`/prospects/view-prospect/${hashTheID(prospectId)}/${hashTheID(suid)}`} className="block text-center text-primary font-semibold">
                Go To Prospect's Info
            </Link>
        </div>
    );
}
