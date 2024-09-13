import React, { useState, useEffect } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { getAllStudensWithBarcode } from '../../functions/api';
import StudentSlider from './StudentSlider';

export default function StudentCheckIn() {
    const { suid }: any = UserAuth();
    const [barcode, setBarcode] = useState('');
    const [students, setStudents] = useState<any>([]);
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [studentID, setStudentID] = useState('');

    // Handle barcode scan
    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            setBarcode(e.target.value);
        }
    };

    const handleBarcode = (e: any) => {
        setBarcode(e.target.value);
    };

    useEffect(() => {
        if (!suid) {
            window.location.href = '/';
        }
    }, []);

    // Automatically focus the input field when the component mounts
    useEffect(() => {
        const input: any = document.getElementById('barcode-input');
        input.focus();
    }, []);

    const handleGetStuents = async () => {
        const res = await getAllStudensWithBarcode(suid);
        setStudents(res.recordset);
    };

    useEffect(() => {
        handleGetStuents();
    }, []);

    useEffect(() => {
        if (barcode.length > 3) {
            const student = students.find((student: any) => student.Barcode === barcode);
            if (student) {
                setStudent(student);
                setLoading(true);
                setStudentID(student.StudentId);
            } else {
                setStudent(null);
            }
        } else if (barcode.toString() === '1') {
            setStudent(null);
        } else {
            setStudent(null);
        }
    }, [barcode]);

    useEffect(() => {
        if (student) {
            setLoading(false);
            setOpen(true);
        }
    }, [student]);

    return (
        <>
            {loading ? (
                <div className="screen_loader flex items-center justify-center bg-[#fafafa] dark:bg-[#060818] z-[60] place-content-center animate__animated p-24">
                    <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#2A9D8F">
                        <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                            <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="-360 67 67" dur="2.5s" repeatCount="indefinite" />
                        </path>
                        <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                            <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="360 67 67" dur="8s" repeatCount="indefinite" />
                        </path>
                    </svg>
                </div>
            ) : (
                <div className="flex items-center justify-center h-screen bg-zinc-100">
                <div className="-mt-24">
                    <h1 className="text-2xl font-semibold text-gray-800 text-center ">Student Check-in</h1>
                    <p className="text-center text-gray-500 mb-12">Please enter your student code to check-in</p>
                    <div>
                        
                        <input id="barcode-input" type="text" className="form-input h-12 text-xl" placeholder="Student Code" value={barcode} onKeyDown={handleKeyPress} onChange={handleBarcode} autoComplete='off'/>
                    </div>
                    <StudentSlider open={open} setOpen={setOpen} studentID={studentID} setBarcode={setBarcode}/>
                </div>
                </div>
            )}
        </>
    );
}
