import { useRef, useState } from 'react';
import { deleteImage, uploadProfilePic } from '../../firebase/firebaseFunctions';
import IconSave from '../../components/Icon/IconSave';
import Tippy from '@tippyjs/react';
import IconUser from '../../components/Icon/IconUser';
import { UserAuth } from '../../context/AuthContext';
import IconX from '../../components/Icon/IconX';

export default function StudioProfilePic() {
    const { studioOptions, setStudioOptions }: any = UserAuth();
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
        if (!studioOptions?.StudioId) {
            setLoading(false);
            return;
        }
        try {
            // Save image to server
            const resURL = await uploadProfilePic(profilePic, studioOptions?.StudioId, 'studio');
            setStudioOptions({ ...studioOptions, Image1Url: resURL });
            setLoading(false);
            setCreated(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleDeleteProfilePic = async () => {
        // Delete image from server
        setLoading(true);
        if (!studioOptions?.StudioId) {
            setLoading(false);
            return;
        }
        try {
            // Delete image from server
            await deleteImage(studioOptions?.StudioId, 'studio');
            setStudioOptions({ ...studioOptions, Image1Url: '' });
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <div>
            {created ? (
                <div className="block w-full">
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
                        <img className="w-full h-64 object-cover object-center" src={tempPic} alt="Profile" />
                        <button
                            className="absolute top-2 right-0 p-1 m-1 bg-primary rounded-full text-white"
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
                </div>
            ) : studioOptions?.Image1Url ? (
                <div className="relative">
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} ref={fileInputRef} />
                    <img className="w-full h-64 object-cover object-center rounded-lg  lg:rounded-t-lg lg:rounded-none shadow" src={studioOptions?.Image1Url} alt="Profile" />

                    <button
                        className="absolute -top-3 -right-3  p-1 m-1 bg-primary rounded-full text-white"
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
                    <button
                        className="absolute top-4 -right-3 p-1 m-1 bg-danger rounded-full text-white"
                        onClick={() => {
                            handleDeleteProfilePic();
                        }}
                    >
                        <Tippy content="Delete Profile Picture">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
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
