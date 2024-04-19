import React, { useEffect, useState } from 'react';
import IconMenu from '../../../components/Icon/IconMenu';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { sendIndividualEmail } from '../../../functions/emails';
import { UserAuth } from '../../../context/AuthContext';

const emailDataInit = {
    to: '',
    from: '',
    subject: '',
    html: 'test',
    deliverytime: null,
};

export default function SendMail({ defaultEMail, studioOptions, student, setShowActionModal }: any) {
    const { suid } = UserAuth();
    const [emailData, setEmailData] = useState(emailDataInit);

    useEffect(() => {
        if (defaultEMail) {
            setEmailData({ ...emailData, html: defaultEMail?.DefaultEmailText, subject: defaultEMail?.DefaultEmailSubject, to: student?.email, from: studioOptions?.EmailFromAddress });
        }
    }, [defaultEMail]);

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setEmailData({ ...emailData, [id]: value });
    };

    const handleSendEmail = () => {
        console.log(emailData);
        const data = {
            studioId: suid,
            email: emailData,
        };
        // sendIndividualEmail(data).then((res) => {
        //     console.log(res);
        // });
    };

    return (
        <div>
            <div className="relative">
                <form className="p-6 grid gap-6">
                    <select 
                    id="acno" 
                    name="acno" 
                    className="form-select flex-1" 
                    value={emailData.from}
                    onChange={(e) => setEmailData({ ...emailData, from: e.target.value })}>
                        <option value="" disabled>Select Email</option>
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
                        <ReactQuill theme="snow" value={emailData.html} style={{ minHeight: '200px' }} />
                    </div>

                    <div>
                        <input
                            type="file"
                            className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file:ml-5 file:text-white file:hover:bg-primary"
                            multiple
                            accept="image/*,.zip,.pdf,.xls,.xlsx,.txt.doc,.docx"
                            required
                        />
                    </div>
                    <div className="flex items-center ltr:ml-auto rtl:mr-auto mt-8">
                        <button type="button" className="btn btn-outline-danger ltr:mr-3 rtl:ml-3"
                        onClick={() => setShowActionModal(false)}

                        >
                            Close
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSendEmail}>
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
