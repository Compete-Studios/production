import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrash from '../../components/Icon/IconTrash';
import { UserAuth } from '../../context/AuthContext';
import IconUsers from '../../components/Icon/IconUsers';
import IconEdit from '../../components/Icon/IconEdit';
import IconPlus from '../../components/Icon/IconPlus';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Link } from 'react-router-dom';
import { showWarningMessage } from '../../functions/shared';
import { getPaymentPipelineStepsByStudioId, deleteLatePaymentPipelineStep } from '../../functions/api';
import { addLatePayment, getLatePaymentsFromPaysimple, TESTgetLatePaymentsFromPaysimple } from '../../functions/payments';
import { formatDate } from '@fullcalendar/core';
import ReorderSteps from '../Students/components/ReorderSteps';

interface PipelineStep {
    PaymentPipelineStepId: number;
    StudioId: number;
    PipelineStepName: string;
    thisPipelineStepNeedsContact?: boolean; 
    numberOfPaymentsInStep?: number;
}

interface PipelineResponse {
    recordset: PipelineStep[];
    recordsets: any[];
    output: any;
    rowsAffected: number[];
    returnValue: number;
}

export default function LatePaymentPipeline() {
    const { latePayementPipeline, update, setUpdate, suid }: any = UserAuth();
    const [pipeline, setPipeline] = useState<PipelineStep[]>([]);
    const [fetching, setFetching] = useState<boolean>(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Late Payment Pipeline'));

        // Initialize pipeline state with latePayementPipeline if it's available
        if (latePayementPipeline.length > 0) {
            setPipeline(latePayementPipeline);

            //Check when the last time we fetched new late payments was
            //If >15 minutes, fetch new late payments
            const lastRun: any = localStorage.getItem('lastAddNewLatePaymentsRun');
            const fifteenMinutes = 15 * 60 * 1000;
            const now: any = new Date().getTime();

            if (!lastRun || now - lastRun >= fifteenMinutes) {
                addNewLatePayments();
                localStorage.setItem('lastAddNewLatePaymentsRun', now);
            }
            
        }
    }, []);

    const handleDeleteStep = (prosid: any) => {
        showWarningMessage('Are you sure you want to delete this late pipeline step?', 'Remove Pipeline Step', 'Your Pipeline Step has been removed successfully')
            .then(async (confirmed: boolean) => {
                if (confirmed) {
                    const response = await deleteLatePaymentPipelineStep(prosid);
                    if (response.status === 200) {
                        setUpdate(!update);
                    }
                } else {
                    console.log('User canceled');
                }
            })
            .catch((error: Error) => {
                console.error('Error:', error);
            });
    };

    const addNewLatePayments = async () => {
        setFetching(true);
        try {
            const newPayments = await getLatePaymentsFromPaysimple(suid);
            //Make sure studioId is an int before proceeding
            const stId = parseInt(suid, 10);
            //Construct the payment object and add it to our db
            if (newPayments.Response && newPayments.Response.length > 0) {
                for (const payment of newPayments.Response) {
                    let paymentDate = new Date(payment.PaymentDate);
                    const paymentData = {
                        studioId: stId,
                        paysimpleTransactionId: payment.Id,
                        retriedTransactionId: 0,
                        ignoreThisPayment: false,
                        paysimpleCustomerId: payment.CustomerId,
                        customerName: payment.CustomerFirstName + ' ' + payment.CustomerLastName,
                        amount: payment.Amount,
                        date: formatDate(paymentDate),
                        notes: '',
                        nextContactDate: '',
                    };
                    
                    try {
                        await addLatePayment(paymentData);
                    } catch (error) {
                    console.error(error);
                    }
                }
            }
            // Refetch the late payment pipeline with the updated payments
            const pipelineRes: PipelineResponse = await getPaymentPipelineStepsByStudioId(suid);
            if (Array.isArray(pipelineRes.recordset)) {
                //Update the local LPP
                setPipeline(pipelineRes.recordset);
                //update the global LPP
                setUpdate(!update);

            } else {
                console.error("Error: pipelineRes does not contain a valid recordset array", pipelineRes);
            }
        } catch (error) {
            console.error(error);
        }
        finally {
            setFetching(false);
        }
    };

    return (
        <div className="panel px-0 pb-0 border-white-light dark:border-[#1b2e4b]">
            <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                <h2 className="text-xl">Late Payment Pipeline</h2>

                <div className="gap-2 ltr:ml-auto rtl:mr-auto flex items-center">
                    <ReorderSteps type={3} />
                    <Link to="/payments/late-payment-pipeline/add-new-pipeline-step" type="button" className="btn btn-primary gap-2 ltr:ml-auto rtl:mr-auto">
                        <IconPlus />
                        Add a Pipeline Step
                    </Link>
                </div>
            </div>

            {/* Display the fetching message when addNewLatePayments is running */}
            {fetching && (
                <div className="px-5 py-2 text-info">
                    Checking for new failed payments...
                    <div className="spinner-border animate-spin inline-block w-4 h-4 border-4 rounded-full border-t-transparent mr-2"></div>
                </div>
            )}

            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Pipeline Step</th>
                            <th>Payments In Step</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pipeline.map((data) => (
                            <tr key={data.PaymentPipelineStepId} className={`${data?.thisPipelineStepNeedsContact && 'bg-cs'}`}>
                                <td>
                                    <div className="whitespace-nowrap">{data.PipelineStepName}</div>
                                </td>
                                <td>{data.numberOfPaymentsInStep}</td>
                                <td className="text-center gap-x-4 flex items-center justify-center">
                                    <Tippy content="View Payments">
                                        <Link to={`/payments/late-payment-pipeline/view-payments/${data.PaymentPipelineStepId}/${suid}`} type="button">
                                            <IconDollarSignCircle className="w-5 h-5 text-info hover:text-blue-900" />
                                        </Link>
                                    </Tippy>
                                    <Tippy content="Edit Step">
                                        <Link to={`/payments/late-payment-pipeline/edit-late-pipeline-step/${data.PaymentPipelineStepId}/${suid}`} type="button">
                                            <IconEdit className="w-5 h-5 text-primary" />
                                        </Link>
                                    </Tippy>
                                    <Tippy content="Delete Step">
                                        <button type="button" onClick={() => handleDeleteStep(data.PaymentPipelineStepId)}>
                                            <IconTrash className="w-5 h-5 text-danger hover:text-red-800" />
                                        </button>
                                    </Tippy>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {pipeline.length === 0 && (
                <div className="flex items-center justify-center h-40">
                    <div>
                        <p className="text-lg text-danger">No Late Payment Pipeline steps found</p>
                        <button className="text-info gap-2 mt-2 w-full flex items-center justify-center">
                            Start With Default Steps
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
