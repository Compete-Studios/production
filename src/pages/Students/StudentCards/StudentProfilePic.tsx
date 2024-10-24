import React, { useRef, useState } from 'react';
import IconUser from '../../../components/Icon/IconUser';
import Tippy from '@tippyjs/react';
import IconSave from '../../../components/Icon/IconSave';
import { uploadProfilePic } from '../../../firebase/firebaseFunctions';

export default function StudentProfilePic({ student, setStudent }: any) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [profilePic, setProfilePic] = useState('');
    const [created, setCreated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tempPic, setTempPic] = useState('');

    const createThumbnail = (imageFile: any, maxSize: any) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const img: any = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxSize) {
                            height *= maxSize / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width *= maxSize / height;
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx: any = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob: any) => {
                        resolve(new File([blob], imageFile.name, { type: imageFile.type }));
                    }, imageFile.type);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(imageFile);
        });
    };

    const handleFileUpload = async (event: any) => {
        if (event.target.files.length > 0) {
            const imageFile = event.target.files[0];
            const thumbnail: any = await createThumbnail(imageFile, 400);
            setTempPic(URL.createObjectURL(thumbnail));
            setProfilePic(thumbnail);
            setCreated(true);
        }
    };

    const saveImage = async () => {
        // Save image to server
        setLoading(true);
        if (!student?.Student_id) {
            setLoading(false);
            return;
        }
        try {
            // Save image to server
            const resURL = await uploadProfilePic(profilePic, student?.Student_id, 'student');
            setStudent({ ...student, ProfilePicUrl: resURL });
            setLoading(false);
            setCreated(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <div>
            {created ? (
                <>
                    <div className="flex items-center p-3.5 rounded-t-lg text-white bg-info">
                        <span className="text-white w-6 h-6 mr-2 ">
                            <IconSave />
                        </span>
                        <span>Picture is ready to upload</span>
                        <button type="button" className="btn btn-sm bg-white text-black ml-auto" onClick={saveImage}>
                            Save Image
                        </button>
                    </div>
                    <div className="relative">
                        <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} ref={fileInputRef} />
                        <img className="w-full h-64 object-cover object-center  " src={tempPic} alt="Profile" />
                        <button className="absolute top-0 right-0 p-1 m-1 bg-info shadow rounded-full text-white">
                            <Tippy content="Take New Profile Picture">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z" />
                                    <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
                                </svg>
                            </Tippy>
                        </button>
                        <button
                            className="absolute top-8 right-0 p-1 m-1 bg-primary rounded-full text-white"
                            onClick={() => {
                                if (fileInputRef.current) {
                                    fileInputRef.current.click();
                                }
                            }}
                        >
                            <Tippy content="Upload New Profile Picture">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                                    <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54L1 12.5v-9a.5.5 0 0 1 .5-.5z" />
                                </svg>
                            </Tippy>
                        </button>
                    </div>
                </>
            ) : student?.ProfilePicUrl ? (
                <div className="relative">
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} ref={fileInputRef} />
                    <img className="w-full aspect-square sm:h-64 object-cover object-center rounded-lg  lg:rounded-t-lg lg:rounded-none shadow" src={student?.ProfilePicUrl} alt="Profile" />
                    <button className="absolute top-0 right-0 p-1 m-1 bg-info shadow rounded-full text-white">
                        <Tippy content="Take New Profile Picture">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z" />
                                <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
                            </svg>
                        </Tippy>
                    </button>
                    <button
                        className="absolute top-8 right-0 p-1 m-1 bg-primary rounded-full text-white"
                        onClick={() => {
                            if (fileInputRef.current) {
                                fileInputRef.current.click();
                            }
                        }}
                    >
                        <Tippy content="Upload New Profile Picture">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                                <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54L1 12.5v-9a.5.5 0 0 1 .5-.5z" />
                            </svg>
                        </Tippy>
                    </button>
                </div>
            ) : (
                <>
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} ref={fileInputRef} />
                    <div className="w-full">
                        <div className="relative flex items-center justify-center p-4 bg-primary-light/20 rounded-t-lg">
                            <IconUser className="w-20 h-20 text-zinc-500" />
                            <div className="absolute right-2 bottom-2 flex items-center gap-2">
                                <Tippy content="Take Profile Picture">
                                    <button>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z" />
                                            <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
                                        </svg>
                                    </button>
                                </Tippy>
                                <Tippy content="Upload Profile Picture">
                                    <button
                                        onClick={() => {
                                            if (fileInputRef.current) {
                                                fileInputRef.current.click();
                                            }
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                                            <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54L1 12.5v-9a.5.5 0 0 1 .5-.5z" />
                                        </svg>
                                    </button>
                                </Tippy>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
