import { Dialog, Transition } from '@headlessui/react';
import Tippy from '@tippyjs/react';
import { useState, Fragment, useEffect } from 'react';
import IconX from '../../components/Icon/IconX';
import zapierscreenshot from '../../assets/zapierscreenshot.png';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { showMessage } from '../../functions/shared';
import IconCopy from '../../components/Icon/IconCopy';
import IconEdit from '../../components/Icon/IconEdit';
import { UserAuth } from '../../context/AuthContext';
import { REACT_API_BASE_URL } from '../../constants';

export default function ZapierModal({ pipeline }: any) {
    const {suid }: any = UserAuth();
    const [modal2, setModal2] = useState(false);
    const [message1, setMessage1] = useState<any>('');

    useEffect(() => {
        const id = parseInt(suid) * 123456;
        setMessage1(`${REACT_API_BASE_URL}/${id}/${pipeline.PipelineStepId}`);
    }, [pipeline]);



    return (
        <div>
            <Tippy content="Zapier">
                <button onClick={() => setModal2(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" preserveAspectRatio="xMidYMid" viewBox="0 0 256 256" id="zapier">
                        <path
                            fill="#FF4A00"
                            d="M159.999 128.056a76.55 76.55 0 0 1-4.915 27.024 76.745 76.745 0 0 1-27.032 4.923h-.108c-9.508-.012-18.618-1.75-27.024-4.919A76.557 76.557 0 0 1 96 128.056v-.112a76.598 76.598 0 0 1 4.91-27.02A76.492 76.492 0 0 1 127.945 96h.108a76.475 76.475 0 0 1 27.032 4.923 76.51 76.51 0 0 1 4.915 27.02v.112zm94.223-21.389h-74.716l52.829-52.833a128.518 128.518 0 0 0-13.828-16.349v-.004a129 129 0 0 0-16.345-13.816l-52.833 52.833V1.782A128.606 128.606 0 0 0 128.064 0h-.132c-7.248.004-14.347.62-21.265 1.782v74.716L53.834 23.665A127.82 127.82 0 0 0 37.497 37.49l-.028.02A128.803 128.803 0 0 0 23.66 53.834l52.837 52.833H1.782S0 120.7 0 127.956v.088c0 7.256.615 14.367 1.782 21.289h74.716l-52.837 52.833a128.91 128.91 0 0 0 30.173 30.173l52.833-52.837v74.72a129.3 129.3 0 0 0 21.24 1.778h.181a129.15 129.15 0 0 0 21.24-1.778v-74.72l52.838 52.837a128.994 128.994 0 0 0 16.341-13.82l.012-.012a129.245 129.245 0 0 0 13.816-16.341l-52.837-52.833h74.724c1.163-6.91 1.77-14 1.778-21.24v-.186c-.008-7.24-.615-14.33-1.778-21.24z"
                        ></path>
                    </svg>
                </button>
            </Tippy>

            <Transition appear show={modal2} as={Fragment}>
                <Dialog as="div" open={modal2} onClose={() => setModal2(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-3xl my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-bold text-lg">Zapier Link for Facebook Forms: {pipeline?.StepName}</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal2(false)}>
                                            <IconX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <p>
                                            Use this link in the POST in Webhooks by Zapier to connect Facebook forms to Zapier. This will allow you to send the data from Facebook forms to your
                                            prospect Pipeline <span className="text-primary font-semibold">{pipeline?.StepName}</span>
                                        </p>
                                        <form className='flex items-center gap-2 mt-4'>
                                            <input type="text" value={message1} className="form-input" onChange={(e) => setMessage1(e.target.value)} />
                                            <div className="sm:flex space-y-2 sm:space-y-0 sm:space-x-2 rtl:space-x-reverse ">
                                                <CopyToClipboard
                                                    text={message1}
                                                    onCopy={(text, result) => {
                                                        if (result) {
                                                            showMessage("Copied to clipboard");
                                                        }
                                                    }}
                                                >
                                                    <button type="button" className="btn btn-info gap-1 whitespace-nowrap">
                                                        <IconCopy  />
                                                        Copy Zapier Webhook
                                                    </button>
                                                </CopyToClipboard>
                                            </div>
                                        </form>
                                        <p className="mt-4">Your Zap WShould like this:</p>
                                        <img src={zapierscreenshot} alt="zapier screenshot" className="w-full" />
                                        <p className="mt-4 text-center">If you need help setting up the Zapier, please contact the support team</p>
                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setModal2(false)}>
                                                Discard
                                            </button>
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setModal2(false)}>
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
