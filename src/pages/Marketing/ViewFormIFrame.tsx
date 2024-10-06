import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import { showMessage } from '../../functions/shared';
import { REACT_BASE_URL } from '../../constants';
import IconX from '../../components/Icon/IconX';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import IconCopy from '../../components/Icon/IconCopy';
import IconPencil from '../../components/Icon/IconPencil';
import Tippy from '@tippyjs/react';

export default function ViewFormIFrame({ formList }: any) {
    const [modal2, setModal2] = useState(false);
    const [message2, setMessage2] = useState<any>('');
    const [howManyTrue, setHowManyTrue] = useState(0);

    useEffect(() => {
        // Count the number of true fields
        const howManyTrueInit = Object.values(formList.formInfo).filter((x) => x === true).length;

        let height = 200;
        let smlHeight = 200;

        // Check specific field pairs and add height if both fields in the pair are true
        const fields = formList.formInfo;

        // Add height for specific field pairs
        if (fields.Email || fields.Phone) {
            height += 60;
        }
        if (fields.Name || fields.LastName) {
            height += 60;
        }
        if (fields.City || fields.State || fields.Zip) {
            height += 60;
        }
        if (fields.Address) {
            height += 60;
        }
        if (fields.Notes) {
            height += 120;
        }
        if (fields.ParentName || fields.Age) {
            height += 60;
        }
        if (fields.City || fields.State || fields.Zip) {
            height += 60;
        }
        if (fields.FormDescription) {
            height += 60;
        }
        if (fields.AdditionalInfo) {
            height += 120;
        }
        if (fields.FriendlyName) {
            height += 60;
        }

        // Add height for specific field pairs
        if (fields.Email) {
            smlHeight += 62;
        }
        if (fields.Phone) {
            smlHeight += 62;
        }
        if (fields.Name) {
            smlHeight += 62;
        }
        if (fields.LastName) {
            smlHeight += 62;
        }
        if (fields.City) {
            smlHeight += 62;
        }
        if (fields.State) {
            smlHeight += 62;
        }
        if (fields.Zip) {
            smlHeight += 62;
        }
        if (fields.Address) {
            smlHeight += 62;
        }
        if (fields.Notes) {
            smlHeight += 125;
        }
        if (fields.ParentName) {
            smlHeight += 62;
        }
        if (fields.Age) {
            smlHeight += 62;
        }
        if (fields.City) {
            smlHeight += 62;
        }
        if (fields.State) {
            smlHeight += 62;
        }
        if (fields.Zip) {
            smlHeight += 62;
        }
        if (fields.FormDescription) {
            smlHeight += 62;
        }
        if (fields.AdditionalInfo) {
            smlHeight += 125;
        }
        if (fields.FriendlyName) {
            smlHeight += 62;
        }

        const additionalHeight = formList.heightOption.name === 'Short' ? 0 : formList.heightOption.name === 'Medium' ? 100 : formList.heightOption.name === 'Tall' ? 200 : 300;

        height += additionalHeight;
        smlHeight += additionalHeight;

        // // // Optionally, you can also add height based on the number of true fields
        // // // For example, if you want to add 40px for each field beyond a certain count
        // // // This is just an example and you can adjust as needed
        // // height += (howManyTrueInit * 35);

        // // Create the iframe with calculated height
        // const iFrame = `<iframe src="${REACT_BASE_URL}form/${formList.id}" style="border-style: none; width: 100%; height: ${height}px;">Loading…</iframe>`;

        const newiFrame = `<style>
  .responsive-iframe {
    width: 100%;
    border-style: none;
    height: ${height}px; /* Default height for larger screens */
  }

  /* Media query for smaller screens */
  @media (max-width: 640px) {
    .responsive-iframe {
      height: ${smlHeight}px; /* Height for medium screens */
    }
  }

  
</style>

<iframe src="${REACT_BASE_URL}form/${formList.id}" class="responsive-iframe">Loading…</iframe>`;

        setHowManyTrue(howManyTrueInit);
        setMessage2(newiFrame);
    }, [formList]);

    const copyToClipboard = (text: any) => {
        navigator.clipboard.writeText(text);
        showMessage('Copied successfully!');
    };

    const copyNewFromToClipboard = (id: any) => {
        const iFrame = `<iframe src="${REACT_BASE_URL}/form/${id}" width="100%" height="100%" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`;
        navigator.clipboard.writeText(iFrame);
        showMessage('Copied successfully!');
    };

    return (
        <div className="">
            <div className="flex items-center justify-center">
                <button type="button" onClick={() => setModal2(true)} className="btn btn-sm btn-secondary hover:bg-indigo-800 gap-1">
                    View Code
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-code-slash" viewBox="0 0 16 16">
                        <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0" />
                    </svg>{' '}
                </button>
            </div>
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
                                <Dialog.Panel as="div" className="panel bg-zinc-100 border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <div>
                                            <h5 className="font-bold text-lg">iFrame Code for you Website</h5>
                                            <p className="text-sm text-gray-500">Copy and paste the code below to embed the form in your website.</p>
                                        </div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal2(false)}>
                                            <IconX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="p-4 bg-white border rounded-lg">{message2}</div>
                                        </form>
                                        <div className="flex justify-end items-center mt-8">
                                            <CopyToClipboard
                                                text={message2}
                                                onCopy={(text, result) => {
                                                    if (result) {
                                                        showMessage('Copied successfully!');
                                                        setModal2(false);
                                                    }
                                                }}
                                            >
                                                <button type="button" className="btn btn-dark gap-1 w-full" data-clipboard-target="#message2">
                                                    <IconCopy />
                                                    Copy Code
                                                </button>
                                            </CopyToClipboard>
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
