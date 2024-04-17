import { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import Select from 'react-select';

const studentInfoInit = {
  fName: '',
  lName: '',
  contact1: '',
  contact2: '',
  phone: '',
  phone2: '',
  email: '',
  address: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  birthdate: '2022-07-05',
  marketingMethod: '',
  notes: '',
  nextContactDate: new Date().toISOString().split('T')[0],
  currentPipelineStatus: '',
  firstClassDate: new Date().toISOString().split('T')[0],
  originalContactDate: new Date().toISOString().split('T')[0],
  introDate: new Date().toISOString().split('T')[0],
};

export default function AddStudent() {
    const { waitingLists, prospectPipelineSteps, programs, classes } = UserAuth();
    const [studentInfo, setStudentInfo] = useState(studentInfoInit);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const newPrograms = programs?.map((program: any) => {
            return { value: program.ProgramId, label: program.Name };
        });
        setOptions(newPrograms);
    }, [programs]);

    const handleSelectClass = (e: any, item: any) => {
        e.preventDefault();
        if (selectedClasses.includes(item)) {
            setSelectedClasses(selectedClasses.filter((i) => i !== item));
        } else {
            setSelectedClasses([...selectedClasses, item]);
        }
    };

    const handleDeselctClass = (e, item) => {
        e.preventDefault();
        setSelectedClasses(selectedClasses.filter((i) => i !== item));
    };
    return (
        <div>
            <div className="panel max-w-5xl mx-auto">
                <div className="mb-5">
                    <h5 className="font-semibold text-lg mb-4">Student Info</h5>
                    <p>Use this option to add a new student to the system. </p>
                </div>
                <div className="mb-5">
                    <form>
                        <div className="mb-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="sm:col-span-2">
                                <label htmlFor="first">First Name</label>
                                <input id="first" type="text" placeholder="First Name" className="form-input" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="last">Last Name</label>
                                <input id="last" type="text" placeholder="Last Name" className="form-input" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="parentName">Parent Name</label>
                                <input id="parentName" type="text" placeholder="Parent Name" className="form-input" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="phone">Phone</label>
                                <input id="phone" type="text" placeholder="Phone" className="form-input" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="email">Email</label>
                                <input id="email" type="text" placeholder="Email" className="form-input" />
                            </div>
                            <div className="sm:col-span-4">
                                <label htmlFor="address">Address</label>
                                <input id="address" type="text" placeholder="Address" className="form-input" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="city">City</label>
                                <input id="city" type="text" placeholder="City" className="form-input" />
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="state">State</label>
                                <input id="state" type="text" placeholder="State" className="form-input" />
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="zip">Zip</label>
                                <input id="zip" type="text" placeholder="Zip" className="form-input" />
                            </div>
                            <div className="sm:col-span-full">
                                <label htmlFor="contactMethod">Contact Method</label>
                                <input id="contactMethod" type="text" placeholder="Contact Method" className="form-input" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="entryDate">Contact Date</label>
                                <input id="entryDate" type="text" placeholder="Contact Date" className="form-input" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="introDate">Intro Date</label>
                                <input id="introDate" type="text" placeholder="Intro Date" className="form-input" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="firstClassDate">First Class Date</label>
                                <input id="firstClassDate" type="text" placeholder="First Class Date" className="form-input" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="nextContactDate">Next Contact Date</label>
                                <input id="nextContactDate" type="text" placeholder="Next Contact Date" className="form-input" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="birthdate">Birthdate</label>
                                <input id="birthdate" type="text" placeholder="Birthdate" className="form-input" />
                            </div>
                            <div className="sm:col-span-full">
                                <label htmlFor="notes">Notes</label>
                                <textarea id="notes" rows={4} placeholder="Notes" className="form-textarea" />
                            </div>
                            <div className="sm:col-span-2 sm:row-span-2">
                                <label htmlFor="waitingList">Waiting List</label>
                                {waitingLists?.map((list) => (
                                    <label key={list.WaitingListId} className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="form-checkbox" />
                                        <span className=" text-white-dark">{list.Title}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="pipelineStatus">Pipeline Status</label>
                                <select id="pipelineStatus" className="form-select text-white-dark">
                                    {prospectPipelineSteps?.map((step) => (
                                        <option key={step.PipelineStepId} value={step.PipelineStepId}>
                                            {step.StepName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="pipelineStatus">Programs</label>
                                <Select placeholder="Select an option" options={options} isMulti isSearchable={false}/>
                           
                            </div>
                            <div className="sm:col-span-full">
                                <label htmlFor="classes">Classes</label>
                                <div className="col-span-full flex items-center border p-4 bg-primary/20 rounded-md border-com">
                                    <div className="p-4 w-full h-72 overflow-y-auto  grow rounded-md border border-com mt-1 bg-white">
                                        {classes &&
                                            classes?.map((item) => (
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
                                        {selectedClasses?.map((item) => (
                                                <>
                                                    <div
                                                        key={item.ClassId}
                                                        className="text-xs cursor-pointer text-primary hover:text-primary/80 font-bold border-b w-full p-2"
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
                        <button type="button" className="btn btn-primary">
                            Add Student
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
