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
            {latePayementPipeline?.length === 0 && (
                <div className="flex items-center justify-center h-40">
                    <div>
                        <p className="text-lg text-danger">No Late Payment Pipeline steps found</p>
                        <button className="text-info gap-2 mt-2 w-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                <path
                                    fill-rule="evenodd"
                                    d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
                                />
                                <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                            </svg>
                            Start With Default Steps
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
