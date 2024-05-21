import { useState } from 'react';
import IconCircleCheck from '../../../components/Icon/IconCircleCheck';
import IconTrash from '../../../components/Icon/IconTrash';
import SimpleForm from '../LandingPageComponents/SimpleForm';

const features = [
    {
        name: 'Benifit One',
        description: "Description of benifit one and why it's important",
        icon: IconCircleCheck,
    },
    {
        name: 'Benifit Two',
        description: "Description of benifit two and why it's important",
        icon: IconCircleCheck,
    },
    {
        name: 'Benifit Three',
        description: "Description of benifit three and why it's important",
        icon: IconCircleCheck,
    },
];

export default function SimpleTemplate() {
    const [mainImage, setMainImage] = useState(null);
    const [displayEditImageButtons, setDisplayEditImageButtons] = useState(false);

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        const logoasURL: any = URL.createObjectURL(file);
        setMainImage(logoasURL);
    };

    return (
        <div className="py-12">
            <h1 className="text-3xl font-bold text-center">Main Headline</h1>
            <h3 className="text-lg font-semibold text-center">Sub Headline</h3>
            <div className="grid grid-cols-2 gap-4 py-12">
                {mainImage ? (
                    <div className="" onMouseOver={() => setDisplayEditImageButtons(true)} onMouseLeave={() => setDisplayEditImageButtons(false)}>
                        {displayEditImageButtons && <IconTrash className="w-6 h-6 text-red-500 cursor-pointer ml-auto" />}

                        <label htmlFor="fileInput" className="cursor-pointer">
                            <img src={mainImage} alt="Main Image" className="w-full h-96 object-cover rounded-lg shadow-lg cursor-pointer" />
                            <input type="file" id="fileInput" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageChange(e)} />
                        </label>
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

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-center">Description of Landing Page Info </h3>
                    <p className="text-center">Information paragraph</p>
                    <p className="text-center">Information second paragraph</p>
                    <p className="text-center font-semibold">123 Address, City, State, Zip</p>
                    <button type="button" className="btn-dark btn mx-auto">
                        Get Started
                    </button>
                </div>
                <div className="relative bg-white py-24 sm:py-32 col-span-full">
                    <div className="mx-auto max-w-md px-6 text-center sm:max-w-3xl lg:max-w-7xl lg:px-8">
                        <h2 className="text-lg font-semibold text-zinc-950">Benifits</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need to know about the information</p>
                        <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">Benifit Summary.</p>
                        <div className="mt-20">
                            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                                {features.map((feature) => (
                                    <div key={feature.name} className="pt-6">
                                        <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                                            <div className="-mt-6">
                                                <div>
                                                    <span className="inline-flex items-center justify-center rounded-xl bg-zinc-950 p-3 shadow-lg">
                                                        <feature.icon className="h-8 w-8 text-white" aria-hidden="true" />
                                                    </span>
                                                </div>
                                                <h3 className="mt-8 text-lg font-semibold leading-8 tracking-tight text-gray-900">{feature.name}</h3>
                                                <p className="mt-5 text-base leading-7 text-gray-600">{feature.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <section className="isolate overflow-hidden bg-white px-6 lg:px-8 col-span-full">
                    <div className="relative mx-auto max-w-2xl py-12 lg:max-w-4xl">
                        <div className="absolute left-1/2 top-0 -z-10 h-[50rem] w-[90rem] -translate-x-1/2 bg-[radial-gradient(50%_100%_at_top,theme(colors.indigo.100),white)] opacity-20 lg:left-36" />
                        <div className="absolute inset-y-0 right-1/2 -z-10 mr-12 w-[150vw] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-20 md:mr-0 lg:right-full lg:-mr-36 lg:origin-center" />
                        <figure className="grid grid-cols-1 items-center gap-x-6 gap-y-8 lg:gap-x-10">
                            <div className="relative col-span-2 lg:col-start-1 lg:row-start-2">
                                <svg viewBox="0 0 162 128" fill="none" aria-hidden="true" className="absolute -top-12 left-0 -z-10 h-32 stroke-gray-900/10">
                                    <path
                                        id="b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb"
                                        d="M65.5697 118.507L65.8918 118.89C68.9503 116.314 71.367 113.253 73.1386 109.71C74.9162 106.155 75.8027 102.28 75.8027 98.0919C75.8027 94.237 75.16 90.6155 73.8708 87.2314C72.5851 83.8565 70.8137 80.9533 68.553 78.5292C66.4529 76.1079 63.9476 74.2482 61.0407 72.9536C58.2795 71.4949 55.276 70.767 52.0386 70.767C48.9935 70.767 46.4686 71.1668 44.4872 71.9924L44.4799 71.9955L44.4726 71.9988C42.7101 72.7999 41.1035 73.6831 39.6544 74.6492C38.2407 75.5916 36.8279 76.455 35.4159 77.2394L35.4047 77.2457L35.3938 77.2525C34.2318 77.9787 32.6713 78.3634 30.6736 78.3634C29.0405 78.3634 27.5131 77.2868 26.1274 74.8257C24.7483 72.2185 24.0519 69.2166 24.0519 65.8071C24.0519 60.0311 25.3782 54.4081 28.0373 48.9335C30.703 43.4454 34.3114 38.345 38.8667 33.6325C43.5812 28.761 49.0045 24.5159 55.1389 20.8979C60.1667 18.0071 65.4966 15.6179 71.1291 13.7305C73.8626 12.8145 75.8027 10.2968 75.8027 7.38572C75.8027 3.6497 72.6341 0.62247 68.8814 1.1527C61.1635 2.2432 53.7398 4.41426 46.6119 7.66522C37.5369 11.6459 29.5729 17.0612 22.7236 23.9105C16.0322 30.6019 10.618 38.4859 6.47981 47.558L6.47976 47.558L6.47682 47.5647C2.4901 56.6544 0.5 66.6148 0.5 77.4391C0.5 84.2996 1.61702 90.7679 3.85425 96.8404L3.8558 96.8445C6.08991 102.749 9.12394 108.02 12.959 112.654L12.959 112.654L12.9646 112.661C16.8027 117.138 21.2829 120.739 26.4034 123.459L26.4033 123.459L26.4144 123.465C31.5505 126.033 37.0873 127.316 43.0178 127.316C47.5035 127.316 51.6783 126.595 55.5376 125.148L55.5376 125.148L55.5477 125.144C59.5516 123.542 63.0052 121.456 65.9019 118.881L65.5697 118.507Z"
                                    />
                                    <use href="#b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb" x={86} />
                                </svg>
                                <blockquote className="text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
                                    <p>Testimony social proof. You can update a direct quote from a customer here</p>
                                </blockquote>
                            </div>
                            <div className="col-end-1 w-16 lg:row-span-4 lg:w-72">
                                <img
                                    className="rounded-xl bg-indigo-50 lg:rounded-3xl"
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=576&h=576&q=80"
                                    alt=""
                                />
                            </div>
                            <figcaption className="text-base lg:col-start-1 lg:row-start-3">
                                <div className="font-semibold text-gray-900">Customer or Staff Name</div>
                                <div className="mt-1 text-gray-500">Customer Class, Title, or Info </div>
                            </figcaption>
                        </figure>
                    </div>
                </section>
                <div className="col-span-full max-w-2xl w-full mx-auto">
                    <SimpleForm />
                </div>
            </div>
        </div>
    );
}
