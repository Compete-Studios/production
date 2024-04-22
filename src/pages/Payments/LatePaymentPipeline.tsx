import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrash from '../../components/Icon/IconTrash';
import { UserAuth } from '../../context/AuthContext';
import IconUsers from '../../components/Icon/IconUsers';
import IconEdit from '../../components/Icon/IconEdit';
import IconPlus from '../../components/Icon/IconPlus';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Link } from 'react-router-dom';
import { showWarningMessage } from '../../functions/shared';
import { deleteLatePaymentPipelineStep } from '../../functions/api';

export default function LatePaymentPipeline() {
    const { latePayementPipeline, update, setUpdate, suid } :any = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Late Payment Pipeline'));
    });

    const handleDeleteStep = (prosid: any) => {
        showWarningMessage('Are you sure you want to delete this late pipeline step?', 'Remove Pipeline Step', 'Your Pipeline Step has been removed successfully')
            .then(async (confirmed: boolean) => {
                if (confirmed) {
                    const response = await deleteLatePaymentPipelineStep(prosid);
                    console.log(response);
                    if (response.status === 200) {
                        setUpdate(!update);
                    }
                } else {
                    // User canceled the action
                    console.log('User canceled');
                }
            })
            .catch((error) => {
                // Handle error if any
                console.error('Error:', error);
            });
    };

    console.log(latePayementPipeline)

    return (
        <div className="panel px-0 pb-0 border-white-light dark:border-[#1b2e4b]">
            <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                {/* <div className="flex items-center gap-2">
                    <div className="">
                        <input type="text" className="form-input w-auto" placeholder="Search..." />
                    </div>
                </div> */}
                <h2 className="text-xl">Late Payment Pipeline</h2>

                <div className="gap-2 ltr:ml-auto rtl:mr-auto">
                    <Link to="/payments/late-payment-pipeline/add-new-pipeline-step" type="button" className="btn btn-primary gap-2 ltr:ml-auto rtl:mr-auto">
                        <IconPlus />
                        Add a Pipeline Step
                    </Link>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>Pipeline Step</th>
                            <th>Payments In Step</th>

                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {latePayementPipeline?.map((data: any) => {
                            return (
                                <tr key={data.PlacementOrdinal} className={`${data?.thisPipelineStepNeedsContact && 'bg-cs'}`}>
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
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
