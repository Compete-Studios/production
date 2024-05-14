import { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { getRanksByStudioId, getUserFormsByStudioId } from '../../functions/api';
import { showMessage } from '../../functions/shared';
import { Loader } from '@mantine/core';
import { REACT_BASE_URL } from '../../constants';

export default function CaptureForms() {
    const { suid, fbForms }: any = UserAuth();
    const [loading, setLoading] = useState(true);
    const [forms, setForms] = useState([]);

    useEffect(() => {
        setLoading(true);
        try {
            getUserFormsByStudioId(suid).then((data) => {
                setForms(data.recordset);
                setLoading(false);
            });
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [suid]);

    const copyToClipboard = (text: any) => {
        navigator.clipboard.writeText(text);
        showMessage('Copied successfully!');
    };

    const copyNewFromToClipboard = (id: any) => {
        const iFrame = `<iframe src="${REACT_BASE_URL}/form/${id}" width="100%" height="100%" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`;
        navigator.clipboard.writeText(iFrame);
        showMessage('Copied successfully!');
    };

    const handlePreview = (id: any) => {
        window.open(`${REACT_BASE_URL}/form/${id}`, '_blank');
    };

    return (
        <>
            {forms?.length > 0 ? (
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-base font-semibold leading-6 text-gray-900">Capture Forms</h1>
                            <p className="text-sm text-gray-700">Here&apos;s a list of all your forms</p>
                        </div>

                        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                            <Link to="/marketing/create-capture-form" type="button" className="btn btn-primary">
                                Create a New Form
                            </Link>
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center h-96">
                            <Loader color="blue" />;
                        </div>
                    ) : (
                        <div className="mt-8 flow-root">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col">Form Name</th>
                                                    <th scope="col">Get The Code</th>

                                                    <th scope="col">
                                                        <span>View Performance Stats</span>
                                                    </th>
                                                    <th scope="col">
                                                        <span className="sr-only">Delete</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {fbForms?.map((list: any) => (
                                                    <tr key={list.id}>
                                                        <td>{list.formName}</td>
                                                        <td>
                                                            <button className="text-primary hover:text-primary/70" onClick={() => copyNewFromToClipboard(list.id)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-code-slash" viewBox="0 0 16 16">
                                                                    <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0" />
                                                                </svg>
                                                            </button>
                                                        </td>

                                                        <td>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bar-chart-line" viewBox="0 0 16 16">
                                                                <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z" />
                                                            </svg>
                                                        </td>
                                                        <td className="flex items-center justify-end gap-2">
                                                            <button className="text-com hover:text-indigo-900" onClick={() => handlePreview(list.id)}>
                                                                Preview
                                                            </button>
                                                            <button className="text-com hover:text-indigo-900">Edit</button>
                                                            <a href="#" className="text-alert hover:text-alerthover">
                                                                Delete
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {forms?.map((list: any) => (
                                                    <tr key={list.FormId}>
                                                        <td>{list.FriendlyName}</td>
                                                        <td>
                                                            <button className="text-primary hover:text-primary/70" onClick={() => copyToClipboard(list.IFrameHTML)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-code-slash" viewBox="0 0 16 16">
                                                                    <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0" />
                                                                </svg>
                                                            </button>
                                                        </td>

                                                        <td colSpan={2} className='text-danger text-right'>
                                                           Please update this form to the new version by clicking on the edit button
                                                           <button className="text-info hover:text-indigo-900 ml-2"> Edit Here</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-center h-96">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-700">You have not added any student pipeline steps yet</h1>
                        <div className="mt-4">
                            <Link
                                to="/advanced/capture-forms/create-form"
                                type="button"
                                className="rounded-sm bg-com px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-comhover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-com flex items-center justify-center"
                            >
                                Create a New Form
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
