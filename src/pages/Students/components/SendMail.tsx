import React, { useEffect, useState } from 'react';
import IconMenu from '../../../components/Icon/IconMenu';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { sendIndividualEmail } from '../../../functions/emails';
import { UserAuth } from '../../../context/AuthContext';
import { showErrorMessage, showMessage } from '../../../functions/shared';

const emailDataInit = {
    to: '',
    from: '',
    subject: '',
    html: '',
    deliverytime: null,
};

export default function SendMail({ pipeline, studioOptions, student, setShowActionModal, setDefaultTab, isPrpospect = false }: any) {
    const { suid }: any = UserAuth();
    const [emailData, setEmailData] = useState<any>(emailDataInit);
    const [emailHtml, setEmailHtml] = useState<any>('');

    console.log(student, 'student');

    useEffect(() => {
        if (pipeline) {
            setEmailData({ ...emailData, subject: pipeline?.DefaultEmailSubject, to: isPrpospect ? student?.Email : student?.email, from: studioOptions?.EmailFromAddress });
            setEmailHtml(pipeline?.DefaultEmailText);
        } else if (student) {
            setEmailData({ ...emailData, to: student?.email, from: studioOptions?.EmailFromAddress });
        }
    }, [pipeline]);

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setEmailData({ ...emailData, [id]: value });
    };

    const handleSendEmail = (e: any) => {
        e.preventDefault();
        const data = {
            studioId: suid,
            email: {
                to: emailData.to,
                from: emailData.from,
                subject: emailData.subject,
                html: emailHtml,
                deliverytime: null,
            },
        };
        sendIndividualEmail(data).then((res) => {
            console.log(res);
            if (res.status === 200) {
                showMessage('Email Sent Successfully');
                setShowActionModal(false);
                setDefaultTab(2);
            } else {
                showErrorMessage('Email Failed to Send, Please Try Again');
            }
        });
    };

    return (
        <form className="p-6 grid gap-6 h-full flex-col relative">
            <select id="acno" name="acno" className="form-select flex-1" value={emailData.from} onChange={(e) => setEmailData({ ...emailData, from: e.target.value })}>
                <option value="" disabled>
                    Select Email
                </option>
                <option value={studioOptions?.EmailFromAddress}>{studioOptions?.EmailFromAddress}</option>
                <option value={studioOptions?.EmailFromAddress2}>{studioOptions?.EmailFromAddress2}</option>
                <option value={studioOptions?.EmailFromAddress3}>{studioOptions?.EmailFromAddress3}</option>
            </select>
            <div>
                <input id="to" type="text" className="form-input" placeholder="Enter To" defaultValue={emailData.to} onChange={changeValue} />
            </div>

            <div>
                <input id="title" type="text" className="form-input" placeholder="Enter Subject" value={emailData.subject} onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} />
            </div>

            <div className="h-fit">
                <ReactQuill theme="snow" value={emailHtml} style={{ minHeight: '200px' }} onChange={setEmailHtml} />
            </div>

            <div>
                <input
                    type="file"
                    className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file:ml-5 file:text-white file:hover:bg-primary"
                    multiple
                    accept="image/*,.zip,.pdf,.xls,.xlsx,.txt.doc,.docx"
                />
            </div>

            {/* Action buttons */}
            <div className="flex-shrink-0 px-4 py-5 sm:px-6 mt-auto">
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => setShowActionModal(false)}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" onClick={(e) => handleSendEmail(e)}>
                        Send
                    </button>
                </div>
            </div>
        </form>
    );
}
