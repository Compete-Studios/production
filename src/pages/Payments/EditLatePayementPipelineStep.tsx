import { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { addAStudentPipelineStep, getUploadedStudioImages, updateStudentPipelineStep } from '../../functions/api';
import { showErrorMessage, showMessage } from '../../functions/shared';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditLatePaymentPipelineStep() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Edit Pipeline Step'));
    });
    const { suid, latePayementPipeline, update, setUpdate }: any = UserAuth();
    const [pipelineStepName, setPipelineStepName] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [smsDefaultText, setSmsDefaultText] = useState<string>('');
    const [emailDefaultText, setEmailDefaultText] = useState<string>('');
    const [emailSubject, setEmailSubject] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [images, setImages] = useState<any>([]);
    const [value, setValue] = useState<string>('');

    const { id, stud } = useParams<any>();

    useEffect(() => {
        if (parseInt(stud ?? '') !== parseInt(suid)) {
            alert('Match');
        }
        getUploadedStudioImages(suid).then((res) => {
            setImages(res.recordset);
        });
        if (latePayementPipeline.find((step: any) => parseInt(step.PaymentPipelineStepId) === parseInt(id))) {
            const step = latePayementPipeline.find((step: any) => parseInt(step.PaymentPipelineStepId) === parseInt(id));
            console.log(step);
            setPipelineStepName(step.PipelineStepName);
            setNotes(step.Description);
            setSmsDefaultText(step.DefaultSMSText);
            setEmailSubject(step.DefaultEmailSubject);
            setValue(step.DefaultEmailText);
        }
    }, [suid]);

    const handlePipelineStepNameChange = (e: any) => {
        setPipelineStepName(e.target.value);
    };

    const handleNotesChange = (e: any) => {
        setNotes(e.target.value);
    };

    const handleSmsDefaultTextChange = (e: any) => {
        setSmsDefaultText(e.target.value);
    };

    const handleEmailDefaultTextChange = (e: any) => {
        setEmailDefaultText(e.target.value);
    };

    const handleCopyImageURL = (url: any) => {
        navigator.clipboard.writeText(url);
        showMessage('URL Successfully Copied!');
    };

    const navigate = useNavigate();

    const data = {
        studioId: suid,
        pipelineStepId: id,
        stepName: pipelineStepName,
        description: notes,
        DefaultEmailSubject: emailSubject,
        DefaultEmailText: value,
        DefaultSMSText: smsDefaultText,
    };

    const handleSubmit = () => {
        setIsLoading(true);
        // Simulating submission by logging the form values after 1 second
        updateStudentPipelineStep(data).then((res) => {
            if (res) {
                showMessage('Pipeline Step Added Successfully!');
            } else {
                showErrorMessage('An Error Occurred. Please try again.');
            }
            setUpdate(!update);
        });
        setTimeout(() => {
            console.log(data);
            setIsLoading(false);
            navigate('/students/student-pipeline');
        }, 1000);
    };

    return (
        <>
            <div className="panel max-w-5xl mx-auto mt-4">
                <div>
                    <h1 className="font-semibold text-lg uppercase">
                        Edit Pipeline Step
                        <span className="font-bold text-primary"> {pipelineStepName}</span>
                        
                    </h1>
                    <p>Please fill out the form below to add a new pipeline step.</p>
                </div>
                <div className="mt-4 ">
                    <div>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="pipelineStepName">Pipeline Step Name</label>
                                <input type="text" id="pipelineStepName" name="pipelineStepName" className="form-input" value={pipelineStepName} onChange={handlePipelineStepNameChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="notes">Notes</label>
                                <textarea id="notes" name="notes" rows={3} className="form-input" value={notes} onChange={handleNotesChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="smsDefaultText">SMS Default Text</label>
                                <textarea id="smsDefaultText" name="smsDefaultText" className="form-input" rows={3} value={smsDefaultText} onChange={handleSmsDefaultTextChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="pipelineStepName">Email Default Subject</label>
                                <input type="text" id="emailSubject" name="emailSubject" className="form-input" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
                            </div>
                            <div className="mb-4 w-full ">
                                <label htmlFor="emailDefaultText">Email Default Text</label>
                                <div className="">
                                    <ReactQuill theme="snow" value={value} onChange={setValue} />
                                </div>
                            </div>
                            <div className="flex">
                                <button onClick={handleSubmit} disabled={isLoading} className="btn btn-primary ml-auto">
                                    {isLoading ? 'Submitting...' : 'Update Step'}
                                </button>
                            </div>
                        </div>
                        {/* Images */}
                        {/* <div className="px-4 py-5 sm:p-6">
                            <div className="mb-4">
                                <label htmlFor="pipelineStepName">Images</label>
                                <p>Select an Image to Copy the URL and Add it to your Email</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {images.map((image: any) => (
                                        <button key={image.ImageId} onClick={() => handleCopyImageURL(`https://competestudio.com${image.ImageURL.slice(1)}`)}>
                                            <img src={`https://competestudio.com${image.ImageURL.slice(1)}`} alt={image.ImageName} className="w-full h-32 object-cover rounded-md" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
}
