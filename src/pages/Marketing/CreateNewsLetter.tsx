import React, { useEffect, useState } from 'react';
import { UserAuth } from '../../context/AuthContext';
import Hashids from 'hashids';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link, useParams } from 'react-router-dom';
import { getProspectsByClassId, getStaffByClassId, getStudentsByClassId } from '../../functions/api';
import PreviewNewsLetter from './PreviewNewsLetter';

export default function CreateNewsLetter() {
    const { studioOptions, staff, classes, suid, students, emailList }: any = UserAuth();
    const hashids = new Hashids();
    const [value, setValue] = useState<any>('');
    const [emailData, setEmailData] = useState({
        level: 'readonly',
        listName: 'temporary',
        newsLetterTitle: '',
        type: 1,
        listDescription: 'temporary',
        from: '',
        subject: '',
    });
    const [studentRoster, setStudentRoster] = useState<any>([]);
    const [prospectRoster, setProspectRoster] = useState<any>([]);
    const [classID, setClassID] = useState<any>(0);
    const [classInfo, setClassInfo] = useState<any>({});
    const [listOfNewMembers, setListOfNewMembers] = useState<any>([]);
    const [studentsChecked, setStudentsChecked] = useState<any>(true);
    const [prospectsChecked, setProspectsChecked] = useState<any>(false);
    const [staffChecked, setStaffChecked] = useState<any>(false);
    const [classStaff, setClassStaff] = useState<any>([]);

    const { id, type } = useParams<any>();

    const handleGetClassStaff = async (clsID: any) => {
        try {
            const res = await getStaffByClassId(clsID);
            if (res) {
                const activeStaff = staff.filter((d: any) => res.map((d: any) => d.StaffId[0]).includes(d.StaffId));
                setClassStaff(activeStaff);
            } else {
                setClassStaff([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setEmailData({ ...emailData, from: studioOptions?.EmailFromAddress });
    }, []);

    useEffect(() => {
        if (type === 'class') {
            const classId: any = hashids.decode(id ?? '');
            const classAsNumber = parseInt(classId[0]);
            const classData = classes.find((c: any) => c.ClassId === classAsNumber);
            setClassInfo(classData);
            setClassID(classAsNumber);
            handleGetClassStaff(classAsNumber);
        } else if (type === 'students') {
            setClassID(0);
        } else if (type === 'search') {
            setClassID(0);
            console.log(emailList);
        }
    }, []);

    useEffect(() => {
        try {
            if (classID > 0) {
                getStudentsByClassId(classID).then((res) => {
                    setStudentRoster(res);
                });
                getProspectsByClassId(classID).then((res) => {
                    setProspectRoster(res);
                });
            } else {
                setStudentRoster([]);
            }
        } catch (error) {
            console.error(error);
        }
    }, [classID]);

    useEffect(() => {
        if (type === 'class') {
            if (studentsChecked && prospectsChecked && staffChecked) {
                setListOfNewMembers([...studentRoster, ...prospectRoster, ...classStaff]);
            } else if (studentsChecked && prospectsChecked) {
                setListOfNewMembers([...studentRoster, ...prospectRoster]);
            } else if (studentsChecked && staffChecked) {
                setListOfNewMembers([...studentRoster, ...classStaff]);
            } else if (prospectsChecked && staffChecked) {
                setListOfNewMembers([...prospectRoster, ...classStaff]);
            } else if (studentsChecked) {
                setListOfNewMembers([...studentRoster]);
            } else if (prospectsChecked) {
                setListOfNewMembers([...prospectRoster]);
            } else if (staffChecked) {
                setListOfNewMembers([...classStaff]);
            } else {
                setListOfNewMembers([]);
            }
        } else if (type === 'search') {
            setListOfNewMembers(emailList);
        } else {
            setListOfNewMembers(students);
        }
    }, [studentsChecked, prospectsChecked, staffChecked, studentRoster, prospectRoster, classStaff]);

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/classes/view-classes" className="text-primary hover:underline">
                        View Classes
                    </Link>
                </li>
                <li>
                    <Link to={`/classes/view-roster/${classID}/${suid}`} className="text-primary hover:underline before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        {type === 'class' ? classInfo?.Name : 'Emails'}
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Send Email To Class</span>
                </li>
            </ul>
            <h1 className="text-2xl font-semibold mt-4 ">
                {type === 'class' ? (
                    <>
                        Email Class: <span className="font-bold">{classInfo?.Name}</span>
                    </>
                ) : (
                    'Create Email Newsletter'
                )}
            </h1>
            <p className="text-sm text-gray-500">
                In just a couple steps you can create an email newsletter to send out to your list of recipients. You should give this newsletter a unique name so you can track it later. First, give
                this newsletter a title that describes it so you can refer to it later (Something like "Monthly Newsletter," or "Calendar Reminders"). Next, you'll need a subject line for the email
                that is sent out. Make sure it's something catchy to ensure your email gets opened.
            </p>
            {type === 'class' && (
                <form className="py-8">
                    <h3 className="text-lg font-semibold  mb-3">Select Recipients</h3>
                    <div>
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="form-checkbox" checked={studentsChecked} onChange={() => setStudentsChecked(!studentsChecked)} disabled={studentRoster?.length < 1} />
                            <span className=" text-white-dark">Students</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="form-checkbox" checked={prospectsChecked} onChange={() => setProspectsChecked(!prospectsChecked)} disabled={prospectRoster?.length < 1} />
                            <span className=" text-white-dark">Prospects</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="form-checkbox" checked={staffChecked} onChange={() => setStaffChecked(!staffChecked)} disabled={classStaff?.length < 1} />
                            <span className=" text-white-dark">Staff</span>
                        </label>
                    </div>
                </form>
            )}

            <form className="panel mt-4">
                <h2 className="text-2xl font-semibold mb-4">Email Details</h2>
                <div className="mb-4">
                    <label htmlFor="newsletterTitle">Newsletter Title</label>
                    <input type="text" name="newsletterTitle" id="newsletterTitle" className="form-input" onChange={(e) => setEmailData({ ...emailData, newsLetterTitle: e.target.value })} />
                </div>
                <div className="mb-4">
                    <label htmlFor="newsletterSubject">Newsletter Subject</label>
                    <input type="text" name="newsletterSubject" id="newsletterSubject" className="form-input" onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} />
                </div>
                <div className="mb-4">
                    <label htmlFor="fromEmail">From Email</label>
                    <select id="acno" name="fromEmail" className="form-select flex-1" onChange={(e) => setEmailData({ ...emailData, from: e.target.value })}>
                        <option value="" disabled>
                            Select Email
                        </option>
                        <option value={studioOptions?.EmailFromAddress}>{studioOptions?.EmailFromAddress}</option>
                        <option value={studioOptions?.EmailFromAddress2}>{studioOptions?.EmailFromAddress2}</option>
                        <option value={studioOptions?.EmailFromAddress3}>{studioOptions?.EmailFromAddress3}</option>
                    </select>
                </div>
                <div className="mb-4 h-fit">
                    <label htmlFor="newsletterContent">Newsletter Content</label>
                    <ReactQuill theme="snow" value={value} onChange={setValue} />
                </div>
                <div className="ml-auto">
                    <PreviewNewsLetter emailData={emailData} htmlValue={value} listOfNewMembers={listOfNewMembers} />
                </div>
            </form>
        </div>
    );
}
