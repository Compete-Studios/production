import React, { useState } from 'react';
import IconTrash from '../../../components/Icon/IconTrash';
import IconCircleCheck from '../../../components/Icon/IconCircleCheck';

export default function Image() {
    const [mainImage, setMainImage] = useState(null);
    const [displayEditImageButtons, setDisplayEditImageButtons] = useState(false);
    const [ width, setWidth ] = useState(0);

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        const logoasURL: any = URL.createObjectURL(file);
        setMainImage(logoasURL);
    };

    return (
        <div>
            {mainImage ? (
                <div onMouseOver={() => setDisplayEditImageButtons(true)} onMouseLeave={() => setDisplayEditImageButtons(false)}>
                    <label htmlFor="fileInput" className="cursor-pointer">
                        <img src={mainImage} alt="Main Image" className={`w-full h-96 object-cover rounded-lg shadow-lg cursor-pointer`}  />
                        <input type="file" id="fileInput" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageChange(e)} />
                    </label>
                    <div className="flex">
                        {displayEditImageButtons && (
                            <div className="ml-auto">
                                <div className='flex items-center gap-2'>
                                    Width:
                                    
                                    <button className="flex items-center text-red-500"
                                    onClick={() => setWidth(0)}
                                    >
                                        {width === 0 ? <IconCircleCheck className="w-6 h-6 cursor-pointer" /> : null}100%</button>
                                    <button className="flex items-center  text-red-500"
                                    onClick={() => setWidth(1)}
                                    >
                                    {width === 1 ? <IconCircleCheck className="w-6 h-6 cursor-pointer" /> : null}50%</button>
                                </div>

                                <button className="flex items-center gap-1 text-red-500 " onClick={() => setMainImage(null)}>
                                    <IconTrash className="w-6 h-6 cursor-pointer " /> Remove
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <label htmlFor="fileInput">
                    <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 16 16">
                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z" />
                        </svg>

                        <span className="mt-2 block text-sm font-semibold text-gray-900">Image</span>
                    </div>
                    <input type="file" id="fileInput" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
            )}
        </div>
    );
}
