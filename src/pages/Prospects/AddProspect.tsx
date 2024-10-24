import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import 'swiper/css';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { addProspect, addProspectToClasses, addProspectToPrograms, addProspectToWaitingLists, getProspectById } from '../../functions/api';
import { useNavigate } from 'react-router-dom';
import { constFormateDateMMDDYYYY, formatDate, hashTheID, showMessage } from '../../functions/shared';

interface ProspectData {
    studioId: string;
    fName: string;
    lName: string;
    phone: string;
    email: string;
    contactMethod: number;
    address: string;
    city: string;
    state: string;
    zip: string;
    notes: string;
    entryDate: string;
    currentPipelineStatus: string;
    firstClassDate: string;
    nextContactDate: string;
    age: string;
    parentName: string;
    introDate: string;
    birthdate: string;
}

const prospectInfoInit: any = {
    studioId: '',
    fName: '',
    lName: '',
    phone: '',
    email: '',
    contactMethod: 1,
    address: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
    entryDate: constFormateDateMMDDYYYY(new Date()),
    currentPipelineStatus: '',
    firstClassDate: null,
    nextContactDate: null,
    age: '',
    parentName: '',
    introDate: null,
    birthdate: null,
};

export default function AddProspect() {
    const { waitingLists, prospectPipelineSteps, programs, classes, suid, marketingSources }: any = UserAuth();
    const [prospectInfo, setProspectInfo] = useState<ProspectData>(prospectInfoInit);
    const [selectedClasses, setSelectedClasses] = useState<any>([]);
    const [options, setOptions] = useState<any>([]);
    const [waitingListIDs, setWaitingListIDs] = useState<any>([]);
    const [programIds, setProgramIds] = useState<any>([]);

    const updatedPPSteps = prospectPipelineSteps? [
        { StepName: 'No Status', PipelineStepId: 0 },
        ...prospectPipelineSteps,
    ] : [];

    const navigate = useNavigate();
    const { uid } = useParams<{ uid: string }>();

    const unHashTheID = (id: any) => {
        return parseInt(id) / 123456789;
    };

    useEffect(() => {
        const getProspectInfo = async () => {
            if (uid) {
                try {
                    const prospectId = unHashTheID(uid);
                    console.log('Unhashed ID:', prospectId);
                    const info = await getProspectById(prospectId);
                    console.log('Fetched Prospect Info:', info);
                    setProspectInfo((prev) => ({
                        ...prev,
                        fName: info.FName || prev.fName,
                        lName: info.LName || prev.lName,
                        phone: info.Phone || prev.phone,
                        email: info.Email || prev.email,
                        address: info.Address || prev.address,
                        city: info.City || prev.city,
                        state: info.State || prev.state,
                        zip: info.Zip || prev.zip,
                        notes: info.Notes || prev.notes,
                        parentName: info.ParentName || prev.parentName,
                        birthdate: info.Birthdate || prev.birthdate,
                        currentPipelineStatus: info.PipelineStatus || prev.currentPipelineStatus,
                        entryDate: info.EntryDate || prev.entryDate,
                        introDate: info.IntroDate || prev.introDate,
                        firstClassDate: info.FirstClassDate || prev.firstClassDate,
                        nextContactDate: info.NextContactDate || prev.nextContactDate,
                       
                    }));
                    console.log('Updated Prospect Info:', prospectInfo);
                } catch (error) {
                    console.error('Error fetching prospect info:', error);
                }
            }
        };

        getProspectInfo();
    }, [uid]);


    useEffect(() => {
        const newPrograms = programs?.map((program: any) => {
            return { value: program.ProgramId, label: program.Name };
        });
        setOptions(newPrograms);
    }, [programs]);

    useEffect(() => {
        setProspectInfo((prev) => ({ ...prev, studioId: suid }));
        console.log('SUID:', suid);
    }, [suid]);

    const handleSelectClass = (e: any, item: any) => {
        e.preventDefault();
        if (selectedClasses.includes(item)) {
            setSelectedClasses(selectedClasses.filter((i: any) => i !== item));
        } else {
            setSelectedClasses([...selectedClasses, item]);
        }
    };

    const handleDeselctClass = (e: any, item: any) => {
        e.preventDefault();
        setSelectedClasses(selectedClasses.filter((i: any) => i !== item));
    };

    const handleAddProspect = async (e: any) => {
        e.preventDefault();

        const prospectInfoData = {
            studioId: suid,
            fName: prospectInfo.fName,
            lName: prospectInfo.lName,
            phone: prospectInfo.phone,
            email: prospectInfo.email,
            contactMethod: prospectInfo.contactMethod,
            address: prospectInfo.address,
            city: prospectInfo.city,
            state: prospectInfo.state,
            zip: prospectInfo.zip,
            notes: prospectInfo.notes,
            entryDate: prospectInfo.entryDate ? formatDate(prospectInfo.entryDate) : constFormateDateMMDDYYYY(new Date()),
            currentPipelineStatus: prospectInfo.currentPipelineStatus,
            firstClassDate: prospectInfo.firstClassDate ? formatDate(prospectInfo.firstClassDate) : null,
            nextContactDate: prospectInfo.nextContactDate ? formatDate(prospectInfo.nextContactDate) : null,
            age: prospectInfo.age,
            parentName: prospectInfo.parentName,
            introDate: prospectInfo.introDate ? formatDate(prospectInfo.introDate) : null,
            birthdate: prospectInfo.birthdate ? formatDate(prospectInfo.birthdate) : null,
        };

        const classIDS = selectedClasses?.map((item: any) => item.ClassId);  
        
        let prosID = '';
     
        await addProspect(prospectInfoData).then((res) => {
            console.log('Prospect added:', res.output.NewProspectId);
            addProspectToClasses(res.output.NewProspectId, classIDS);
            addProspectToWaitingLists(res.output.NewProspectId, waitingListIDs);
            addProspectToPrograms(res.output.NewProspectId, programIds);
            prosID = res.output.NewProspectId;
        });
        showMessage('Prospect added successfully', 'success');
        navigate(`/prospects/view-prospect/${hashTheID(prosID)}/${hashTheID(suid)}`);
    };

    useEffect(() => {
        const prospectAge: any = new Date().getFullYear() - new Date(prospectInfo.birthdate).getFullYear();
        setProspectInfo((prev) => ({ ...prev, age: prospectAge }));
    }, [prospectInfo.birthdate]);
 

    const handleToggleWaitingList = (id: any) => {
        if (waitingListIDs.includes(id)) {
            setWaitingListIDs(waitingListIDs.filter((i: any) => i !== id));
        } else {
            setWaitingListIDs([...waitingListIDs, id]);
        }
    };

    return (
        <div>
            <div className="panel max-w-5xl mx-auto bg-gray-100">
                <div className="mb-5">
                    <h5 className="font-semibold text-lg mb-4">Prospect Info</h5>
                    <p>Use this option to add a new prospect to the system. </p>
                </div>
                <div className="mb-5">
                    <form>
                        <div className="mb-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="sm:col-span-2">
                                <label htmlFor="first">First Name</label>
                                <input
                                    id="first"
                                    type="text"
                                    placeholder="First Name"
                                    className="form-input"
                                    value={prospectInfo.fName}
                                    onChange={(e) => setProspectInfo({ ...prospectInfo, fName: e.target.value })}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="last">Last Name</label>
                                <input
                                    id="last"
                                    type="text"
                                    placeholder="Last Name"
                                    className="form-input"
                                    value={prospectInfo.lName}
                                    onChange={(e) => setProspectInfo({ ...prospectInfo, lName: e.target.value })}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="parentName">Parent Name</label>
                                <input
                                    id="parentName"
                                    type="text"
                                    placeholder="Parent Name"
                                    className="form-input"
                                    value={prospectInfo.parentName}
                                    onChange={(e) => setProspectInfo({ ...prospectInfo, parentName: e.target.value })}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="phone">Phone</label>
                                <input
                                    id="phone"
                                    type="text"
                                    placeholder="Phone"
                                    className="form-input"
                                    value={prospectInfo.phone}
                                    onChange={(e) => setProspectInfo({ ...prospectInfo, phone: e.target.value })}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="text"
                                    placeholder="Email"
                                    className="form-input"
                                    value={prospectInfo.email}
                                    onChange={(e) => setProspectInfo({ ...prospectInfo, email: e.target.value })}
                                />
                            </div>
                            <div className="sm:col-span-4">
                                <label htmlFor="address">Address</label>
                                <input
                                    id="address"
                                    type="text"
                                    placeholder="Address"
                                    className="form-input"
                                    value={prospectInfo.address}
                                    onChange={(e) => setProspectInfo({ ...prospectInfo, address: e.target.value })}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="city">City</label>
                                <input
                                    id="city"
                                    type="text"
                                    placeholder="City"
                                    className="form-input"
                                    value={prospectInfo.city}
                                    onChange={(e) => setProspectInfo({ ...prospectInfo, city: e.target.value })}
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="state">State</label>
                                <input
                                    id="state"
                                    type="text"
                                    placeholder="State"
                                    className="form-input"
                                    value={prospectInfo.state}
                                    onChange={(e) => setProspectInfo({ ...prospectInfo, state: e.target.value })}
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="zip">Zip</label>
                                <input
                                    id="zip"
                                    type="text"
                                    placeholder="Zip"
                                    className="form-input"
                                    value={prospectInfo.zip}
                                    onChange={(e) => setProspectInfo({ ...prospectInfo, zip: e.target.value })}
                                />
                            </div>

                            <div className="sm:col-span-full">
                                <label htmlFor="contactMethod">Contact Method</label>
                                <select
                                    id="marketingMethod"
                                    className="form-select"
                                    value={prospectInfo.contactMethod}
                                    onChange={(e: any) => setProspectInfo({ ...prospectInfo, contactMethod: parseInt(e.target.value) })}
                                >
                                    {marketingSources?.map((source: any) => (
                                        <option key={source.MethodId} value={source.MethodId}>
                                            {source.Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="entryDate">Entry Date</label>
                                <Flatpickr
                                    options={{ dateFormat: 'm-d-Y', position: 'auto right', allowInput: true  }}
                                    className="form-input"
                                    value={prospectInfo.entryDate}
                                    onChange={(date: any) => setProspectInfo({ ...prospectInfo, entryDate: date })}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="introDate">Intro Date</label>
                                <Flatpickr
                                    value={prospectInfo.introDate}
                                    options={{ dateFormat: 'm-d-Y', position: 'auto right', allowInput: true  }}
                                    className="form-input"
                                    onChange={(date: any) => setProspectInfo({ ...prospectInfo, introDate: date })}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="firstClassDate">First Class Date</label>
                                <Flatpickr
                                    value={prospectInfo.firstClassDate}
                                    options={{ dateFormat: 'm-d-Y', position: 'auto right', allowInput: true }}
                                    className="form-input"
                                    onChange={(date: any) => setProspectInfo({ ...prospectInfo, firstClassDate: date })}
                                    
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="nextContactDate">Next Contact Date</label>
                                <Flatpickr
                                    value={prospectInfo.nextContactDate}
                                    options={{ dateFormat: 'm-d-Y', position: 'auto right', allowInput: true  }}
                                    className="form-input"
                                    onChange={(date: any) => setProspectInfo({ ...prospectInfo, nextContactDate: date })}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="birthdate">Birthdate</label>
                                <Flatpickr
                                    value={prospectInfo.birthdate}
                                    options={{ dateFormat: 'm-d-Y', position: 'auto right', allowInput: true  }}
                                    className="form-input"
                                    onChange={(date: any) => setProspectInfo({ ...prospectInfo, birthdate: date })}
                                />
                            </div>
                            <div className="sm:col-span-full">
                                <label htmlFor="notes">Notes</label>
                                <textarea
                                    id="notes"
                                    rows={4}
                                    placeholder="Notes"
                                    className="form-textarea"
                                    value={prospectInfo.notes}
                                    onChange={(e) => setProspectInfo({ ...prospectInfo, notes: e.target.value })}
                                />
                            </div>
                            <div className="sm:col-span-2 sm:row-span-2">
                                <label htmlFor="waitingList">Waiting List</label>
                                {waitingLists?.map((list: any) => (
                                    <label key={list.WaitingListId} className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={waitingListIDs.includes(list.WaitingListId)}
                                            className="form-checkbox bg-white dark:bg-[#1b2e4b]"
                                            onClick={() => handleToggleWaitingList(list.WaitingListId)}
                                        />
                                        <span className=" text-white-dark">{list.Title}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="pipelineStatus">Pipeline Status</label>
                                <select
                                    id="pipelineStatus"
                                    className="form-select"
                                    value={prospectInfo.currentPipelineStatus}
                                    onChange={(e) => setProspectInfo({ ...prospectInfo, currentPipelineStatus: e.target.value })}
                                >
                                    {updatedPPSteps?.map((step: any) => (
                                        <option key={step.PipelineStepId} value={step.PipelineStepId}>
                                            {step.StepName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="pipelineStatus">Programs</label>
                                <Select
                                    placeholder="Select programs"
                                    options={options}
                                    isMulti
                                    isSearchable={false}
                                    onChange={(e) => {
                                        const programIds: any = e?.map((item: any) => item.value);
                                        setProgramIds(programIds);
                                    }}
                                />
                            </div>
                            <div className="sm:col-span-full">
                                <label htmlFor="classes">Classes</label>
                                <div className="col-span-full flex items-center border p-4 bg-primary/20 rounded-md border-com">
                                    <div className="p-4 w-full h-72 overflow-y-auto  grow rounded-md border border-com mt-1 bg-white">
                                        {classes &&
                                            classes?.map((item: any) => (
                                                <>
                                                    {!selectedClasses?.includes(item) && (
                                                        <>
                                                            <div key={item.ClassId} className="text-xs cursor-pointer border-b w-full p-2" onClick={(e) => handleSelectClass(e, item)}>
                                                                <span className="text-zinc-500 hover:text-zinc-900">{item.Name}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            ))}
                                    </div>
                                    <div className="text-center grow-0 flex items-center justify-center w-auto px-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                                            <path
                                                fill-rule="evenodd"
                                                d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"
                                            />
                                        </svg>
                                    </div>
                                    <div className="p-4 w-full h-72 overflow-y-auto grow rounded-md border border-com mt-1 bg-white">
                                        {selectedClasses?.map((item: any) => (
                                            <>
                                                <div
                                                    key={item.ClassId}
                                                    className="text-xs cursor-pointer text-com hover:text-comhover font-bold border-b w-full p-2"
                                                    onClick={(e) => {
                                                        handleDeselctClass(e, item);
                                                    }}
                                                >
                                                    <div className="mr-1 inline-block shrink-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                            <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                                                        </svg>
                                                    </div>
                                                    {item.Name}
                                                </div>
                                            </>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleAddProspect}>
                            Add Prospect
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
