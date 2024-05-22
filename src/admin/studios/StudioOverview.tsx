import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import 'tippy.js/dist/tippy.css';
import IconUser from '../../components/Icon/IconUser';
import IconTrash from '../../components/Icon/IconTrash';
import IconMail from '../../components/Icon/IconMail';
import IconMessage from '../../components/Icon/IconMessage';
import IconDollarSign from '../../components/Icon/IconDollarSign';
import IconFile from '../../components/Icon/IconFile';
import IconChecks from '../../components/Icon/IconChecks';
import IconRefresh from '../../components/Icon/IconRefresh';
import PaysimpleIntegration from './PaysimpleIntegration';
import EmailSetup from './EmailSetup';
import TextMessageSetup from './TextMessageSetup';
import StudioInfo from './StudioInfo';
import StudioLimits from './StudioLimits';
import BulkUpload from './BulkUpload';
import { showMessage, showErrorMessage } from '../../functions/shared';
import { getStudioInfo, updateStudioActivity } from '../../functions/api';


const StudioOverview = () => {
    const suid = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [studio, setStudio] = useState<any>({});

    useEffect(() => {
        if (suid.id) {
            getInfo(suid.id);
        }
    }, [suid.id]);

    const getInfo = async (studioId: string) => {
        try {
            const response = await getStudioInfo(studioId);
            setStudio(response);
        } catch (error) {
            console.log('Error fetching studio info:', error);
        }
    };

    const handleDeactivate = async () => {
        try{
            await updateStudioActivity(suid.id, 0);
            showMessage('Studio successfully deactivated. Their login privileges are suspended and they will no longer appear on the list of active studios. Please note that this did NOT change any payments or arrangements with Mailgun or Plivo.');
        }catch(error){
            console.error('Failed to deactivate studio:', error);
            showErrorMessage(`Failed to deactivate studio. Error: ${(error as Error).message}`);
        }
    };

    const handleReactivate = async () => {
        try {
            await updateStudioActivity(suid.id, 1);
            showMessage('Studio successfully reactivated. Their login privileges are restored. Please note that this did NOT change any payments or arrangements with Mailgun or Plivo.');
        } catch (error) {
            console.error('Failed to deactivate studio:', error);
            showErrorMessage(`Failed to deactivate studio. Error: ${(error as Error).message}`);
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Studio Info'));
    });

    const scrollToBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        scrollTop();
    }, []);

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/admin/studios" className="text-primary hover:underline">
                            All Studios
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>{studio?.Studio_Name ?? 'Studio Overview'}</span>
                    </li>
                </ul>
                <div className="sm:flex sm:items-center space-y-4 mt-4 sm:space-y-0 sm:mt-0 gap-x-2">
                    {studio && studio.Is_activated === 1 ? (
                        <button className="btn btn-danger gap-x-1 w-full sm:w-auto" onClick={handleDeactivate}>
                            <IconTrash className="w-5 h-5" /> Deactivate Studio
                        </button>
                    ) : (
                        <>
                            <div className="text-lg text-red-500 font-semibold">
                                This studio is not active.
                            </div>
                            <button className="btn btn-primary gap-x-1 w-full sm:w-auto" onClick={handleReactivate}>
                                <IconRefresh className="w-5 h-5" /> Reactivate Studio
                            </button>
                        </>

                    )}
                </div>
            </div>
            <Tab.Group>
                <Tab.List className="flex flex-wrap">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${selected ? 'text-info !outline-none before:!w-full' : ''
                                    } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                            >
                                <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                Studio Info
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${selected ? 'text-info !outline-none before:!w-full' : ''
                                    } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                            >
                                <IconChecks className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                Studio Limits
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${selected ? 'text-info !outline-none before:!w-full' : ''
                                    } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                            >
                                <IconDollarSign className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                Paysimple Integration
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${selected ? 'text-info !outline-none before:!w-full' : ''
                                    } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                            >
                                <IconMail className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                Email Setup
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${selected ? 'text-info !outline-none before:!w-full' : ''
                                    } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                            >
                                <IconMessage className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                Text Message Setup
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${selected ? 'text-info !outline-none before:!w-full' : ''
                                    } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-info before:transition-all before:duration-700 hover:text-info hover:before:w-full`}
                            >
                                <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                Bulk Upload
                            </button>
                        )}
                    </Tab>
                    
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel>
                        <div className="pt-5">
                            <StudioInfo studioId={suid.id || ''} />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="pt-5">
                            <StudioLimits studioId={suid.id || ''} />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="pt-5">
                            <PaysimpleIntegration studioId={suid.id || ''} />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="pt-5">
                            <EmailSetup studioId={suid.id || ''} />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="pt-5">
                            <TextMessageSetup studioId={suid.id || ''} />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="pt-5">
                            <BulkUpload studioId={suid.id || ''} />
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default StudioOverview;