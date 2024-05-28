import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrash from '../../components/Icon/IconTrash';
import { UserAuth } from '../../context/AuthContext';
import IconPlus from '../../components/Icon/IconPlus';
import IconUsers from '../../components/Icon/IconUsers';
import IconEdit from '../../components/Icon/IconEdit';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import EditProspectPipelineStep from './EditProspectPipelineStep';
import { deletePipelineStep } from '../../functions/api';
import { showWarningMessage } from '../../functions/shared';
import IconMenuUsers from '../../components/Icon/Menu/IconMenuUsers';

export default function ProspectPipeline() {
    const { prospectPipelineSteps, suid, update, setUpdate }: any = UserAuth();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Prospect Pipeline'));
    });

    const handleDeleteStep = (prosid: any) => {
        showWarningMessage('Are you sure you want to delete this pipeline step?', 'Remove Pipeline Step', 'Your Pipeline Step has been removed successfully')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    deletePipelineStep(prosid).then((response) => {
                        if (response) {
                            setUpdate(!update);
                        }
                    });
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
                <h2 className="text-xl">Prospect Pipline</h2>

                <div className="gap-2 ltr:ml-auto rtl:mr-auto">
                    <Link to="/prospects/add-new-pipeline-step" type="button" className="btn btn-primary gap-2 ltr:ml-auto rtl:mr-auto">
                        <IconPlus />
                        Add a Pipeline Step
                    </Link>
                </div>
            </div>
            <div className="table-responsive">
                <table className="">
                    <thead className="">
                        <tr>
                            <th>Pipeline Step</th>
                            <th>Prospects In Step</th>

                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prospectPipelineSteps?.map((data: any) => {
                            return (
                                <tr key={data.PlacementOrdinal} className={`${data?.thisPipelineStepNeedsContact && 'bg-cs'}`}>
                                    <td>
                                        <div className="whitespace-nowrap">{data.StepName}</div>
                                    </td>
                                    <td>{data.numberOfProspectsInStep}</td>

                                    <td className="text-center gap-x-4 flex items-center justify-center">
                                        <div>
                                            <Tippy content="View Roster">
                                                <Link to={`/prospects/view-prospects-in-pipeline/${data.PipelineStepId}/${suid}`} type="button">
                                                    <IconMenuUsers className="w-5 h-5 text-warning hover:text-orange-800" />
                                                </Link>
                                            </Tippy>
                                        </div>
                                        <div>
                                        <Tippy content="Zapier">
                                            <button>
                                                <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' preserveAspectRatio="xMidYMid" viewBox="0 0 256 256" id="zapier">
                                                    <path
                                                        fill="#FF4A00"
                                                        d="M159.999 128.056a76.55 76.55 0 0 1-4.915 27.024 76.745 76.745 0 0 1-27.032 4.923h-.108c-9.508-.012-18.618-1.75-27.024-4.919A76.557 76.557 0 0 1 96 128.056v-.112a76.598 76.598 0 0 1 4.91-27.02A76.492 76.492 0 0 1 127.945 96h.108a76.475 76.475 0 0 1 27.032 4.923 76.51 76.51 0 0 1 4.915 27.02v.112zm94.223-21.389h-74.716l52.829-52.833a128.518 128.518 0 0 0-13.828-16.349v-.004a129 129 0 0 0-16.345-13.816l-52.833 52.833V1.782A128.606 128.606 0 0 0 128.064 0h-.132c-7.248.004-14.347.62-21.265 1.782v74.716L53.834 23.665A127.82 127.82 0 0 0 37.497 37.49l-.028.02A128.803 128.803 0 0 0 23.66 53.834l52.837 52.833H1.782S0 120.7 0 127.956v.088c0 7.256.615 14.367 1.782 21.289h74.716l-52.837 52.833a128.91 128.91 0 0 0 30.173 30.173l52.833-52.837v74.72a129.3 129.3 0 0 0 21.24 1.778h.181a129.15 129.15 0 0 0 21.24-1.778v-74.72l52.838 52.837a128.994 128.994 0 0 0 16.341-13.82l.012-.012a129.245 129.245 0 0 0 13.816-16.341l-52.837-52.833h74.724c1.163-6.91 1.77-14 1.778-21.24v-.186c-.008-7.24-.615-14.33-1.778-21.24z"
                                                    ></path>
                                                </svg>
                                            </button>
                                        </Tippy>
                                        </div>
                                        <div>
                                            <EditProspectPipelineStep data={data} />
                                        </div>
                                        <div>
                                            <Tippy content="Delete Step">
                                                <button type="button" onClick={() => handleDeleteStep(data.PipelineStepId)}>
                                                    <IconTrash className="w-5 h-5 text-danger hover:text-red-800" />
                                                </button>
                                            </Tippy>
                                        </div>
                                        
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {prospectPipelineSteps?.length === 0 && (
                <div className="flex items-center justify-center h-40">
                    <div className="text-center">
                        <p className="text-lg text-danger">No Prospect Pipeline steps found</p>
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
