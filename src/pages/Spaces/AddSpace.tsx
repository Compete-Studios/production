import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { states } from '../../assets/js/states';
import amenities from '../../assets/json/amenities.json';

// import ProfitViewAndRecs from "../components/ProfitViewAndRecs";
import { UserAuth } from '../../context/AuthContext';
import EditPrices from './components/EditPrices';
import { publishSpace } from '../../functions/spaces';
import IconSearch from '../../components/Icon/IconSearch';
import IconPlus from '../../components/Icon/IconPlus';
import IconX from '../../components/Icon/IconX';
import IconPlusCircle from '../../components/Icon/IconPlusCircle';
import { showErrorMessage, showWarningMessage } from '../../functions/shared';

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}

export default function AddSpace() {
    const { suid, studioInfo, update, setUpdate }: any = UserAuth();
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermValid, setSearchTermValid] = useState(true);
    const [prices, setPrices] = useState({});
    const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedAmenities, setSelectedAmenities] = useState<any[]>([]);
    const [requiresSecurityDeposit, setRequiresSecurityDeposit] = useState(false);
    const [title, setTitle] = useState('');
    const [requiresMeeting, setRequiresMeeting] = useState(false);
    const [minPeriond, setMinPeriod] = useState(false);
    const [minValue, setMinValue] = useState(1);
    const [minimumPeriod, setMinimumPeriod] = useState('months');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [description, setDescription] = useState('');
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [sqft, setSqft] = useState('');
    const [capacity, setCapacity] = useState('');
    const [licenseName, setLicenseName] = useState('');
    const [licenses, setLicenses] = useState<any[]>([]);
    const [faqQuestion, setFaqQuestion] = useState('');
    const [faqAnswer, setFaqAnswer] = useState('');
    const [faqs, setFaqs] = useState<any[]>([]);
    const [allowContact, setAllowContact] = useState(true);

    const handleDeletePhoto = (index: any) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);
    };

    const handleSelectAsMain = (index: any) => {
        const updatedFiles = [...selectedFiles];
        const mainPhoto = updatedFiles.splice(index, 1);
        updatedFiles.unshift(mainPhoto[0]);
        setSelectedFiles(updatedFiles);
    };

    const suggestedAmenities = Object.values(amenities)[1];
    const amenitiesList = Object.values(amenities)[0];
    const [filteredResults, setFilteredResults] = useState(amenitiesList);

    useEffect(() => {
        const results = amenitiesList.filter((amenity) => amenity.value.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredResults(results);
        setSearchTermValid(results.length > 0 || searchTerm === '');
    }, [amenitiesList, searchTerm]);

    const handleClearSearch = (amenity: any) => {
        setSelectedAmenities([...selectedAmenities, amenity]);
        setSearchTerm('');
        setFilteredResults(filteredResults.filter((a) => a !== amenity));
    };

    const handleClearSearchAdded = () => {
        setSelectedAmenities([...selectedAmenities, { value: searchTerm }]);
        setSearchTerm('');
    };

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
        const files = event.target.files;
        const newFilesArray: any[] = [];

        // Convert the FileList to an array and append it to the existing selectedFile array
        for (let i = 0; i < files.length; i++) {
            const thumbnail = await createThumbnail(files[i], 700); // Specify your desired max size for the thumbnail
            newFilesArray.push(thumbnail);
        }

        // Update the state to include the new photos
        setSelectedFiles((prevSelectedFiles: any) => [...prevSelectedFiles, ...newFilesArray]);
    };

    const spaceDetails = {
        title,
        description,
        requiresMeeting,
        address,
        city,
        state,
        email: studioInfo?.Contact_Email,
        allowContact,
        faqs,
        licenses,
        zip,
        selectedStartDate,
        sqft,
        capacity,
        prices,
        minValue,
        hasMin: minPeriond,
        minimumPeriod,
        isAvailable: "pending",
        amenities: selectedAmenities.map((amenity) => amenity.value),
    };

    const navigate = useNavigate();

    const handlePostSpace = async () => {
        setUploading(true);
        if (!title || !description || !address || !city || !state || !zip || !selectedFiles || selectedFiles.length < 3) {
            switch (true) {
                case !title:
                    showErrorMessage('Please enter a title for your space');
                    break;
                case !description:
                    showErrorMessage('Please enter a description for your space');
                    break;
                case !address:
                    showErrorMessage('Please enter an address for your space');
                    break;
                case !city:
                    showErrorMessage('Please enter a city for your space');
                    break;
                case !state:
                    showErrorMessage('Please enter a state for your space');
                    break;
                case !zip:
                    showErrorMessage('Please enter a zip code for your space');
                    break;
                case !selectedFiles || selectedFiles.length < 3:
                    showErrorMessage('Please upload at least 3 photos of your space');
                    break;
                default:
                    showErrorMessage('Please fill out all required fields and upload at least 3 photos');
                    break;
            }
            setUploading(false);
            return;
        } else {
            await publishSpace(suid, spaceDetails, selectedFiles).then((res) => {
                console.log(res, 'res');
                if (res.status === 'success') {
                    setUploading(false);
                    setUpdate(!update)
                    navigate(`/space-sharing/space/${res.id}`);
                } else {
                    setUploading(false);
                }
            });
        }
    };
    return (
        <>
            {uploading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="text-2xl font-bold text-gray-900 mt-4">Creating Space...</div>
                </div>
            ) : (
                <div className="relative">
                    <div className="md:flex md:items-center md:justify-between bg-zinc-800 py-6 px-6 z-50 max-w-full mx-auto shadow sticky top-12">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-xl font-bold leading-7 text-white  sm:tracking-tight">Unsaved Draft</h2>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            <Link
                                className="inline-flex items-center rounded-sm bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200"
                                to="/space-sharing/space-list"
                            >
                                Discard
                            </Link>
                            <button
                                type="button"
                                className="ml-3 inline-flex items-center rounded-sm bg-emerald-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700"
                                onClick={handlePostSpace}
                            >
                                Publish
                            </button>
                        </div>
                    </div>
                    <div className="max-w-6xl mx-auto sm:px-4 pb-96 mt-6 grid md:grid-cols-5 grid-cols-1 md:gap-6 gap-2">
                        <div className="md:col-span-3">
                            <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:col-span-3 min-h-[425px]">
                                <div className="px-4 py-5 sm:px-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                                            Title for your Space
                                        </label>
                                        <div className="">
                                            <input
                                                type="text"
                                                name="title"
                                                id="title"
                                                className="block w-full rounded-xl border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm form-input sm:leading-6 h-12"
                                                placeholder="Title of your space"
                                                onChange={(e) => {
                                                    setTitle(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div>
                                        <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                                            Description
                                        </label>

                                        <textarea
                                            id="comment"
                                            name="comment"
                                            rows={10}
                                            className="block w-full rounded-xl border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 form-textarea"
                                            placeholder="Description of your space"
                                            onChange={(e) => {
                                                setDescription(e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-200 overflow-hidden rounded-xl bg-white shadow shadow-zinc-400 md:col-span-2  min-h-[425px]">
                            <div className="px-4 py-5 sm:px-6">
                                <div className="flex justify-content space-between">
                                    <div className="flex text-left text-sm font-medium text-gray-900">Amenities</div>
                                    <Menu as="div" className="relative inline-block text-left text-xs ml-auto">
                                        <div>
                                            <Menu.Button className="flex items-center text-stone-700 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-gray-100">
                                                <span className="sr-only">Open options</span>
                                                See Suggestions
                                            </Menu.Button>
                                        </div>

                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="py-1">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                className={classNames(
                                                                    active ? 'bg-gray-100 text-gray-900' : 'text-emerald-700',
                                                                    'block px-2 py-2 text-xs items-center font-medium w-full'
                                                                )}
                                                                onClick={() => {
                                                                    setSelectedAmenities(suggestedAmenities);
                                                                }}
                                                            >
                                                                Add All
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                    {suggestedAmenities
                                                        ?.filter((amenity) => !selectedAmenities.includes(amenity))
                                                        .map((amenity, index) => (
                                                            <Menu.Item key={index}>
                                                                {({ active }) => (
                                                                    <button
                                                                        className={classNames(
                                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                            'block px-2 py-2 text-xs flex items-center w-full'
                                                                        )}
                                                                        onClick={() => {
                                                                            if (selectedAmenities.includes(amenity)) {
                                                                                setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
                                                                            } else {
                                                                                handleClearSearch(amenity);
                                                                            }
                                                                        }}
                                                                    >
                                                                        <IconPlusCircle className="h-4 flex mr-1 text-stone-700" />
                                                                        {amenity?.value}
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        ))}
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                                <div className="min-w-0 flex-1 mt-2">
                                    <div className="flex gap-x-4">
                                        <div className="min-w-0 flex-1">
                                            <label htmlFor="search" className="sr-only">
                                                Search
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <IconSearch className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="search"
                                                    name="search"
                                                    id="search"
                                                    className="block w-full rounded-xl border py-1.5 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                                                    placeholder="Search"
                                                    autoComplete="off"
                                                    value={searchTerm}
                                                    onChange={(e) => {
                                                        setSearchTerm(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Directory list */}
                                <div className="bg-blue flex-1 overflow-y-auto z-0" aria-label="Amenities">
                                    {searchTerm.trim() === '' ? (
                                        <p className="text-xs text-gray-500">The more amenities you list the more lead results you will get</p>
                                    ) : (
                                        <>
                                            {searchTermValid ? (
                                                <>
                                                    {filteredResults
                                                        ?.slice(0, 4)
                                                        .filter((amenity) => !selectedAmenities.includes(amenity))
                                                        .map((amenity, index) => (
                                                            <div className="relative flex items-end px-6" key={index}>
                                                                <button
                                                                    className={`flex flex-1 items-center justify-between truncate whitespace-pre-line rounded-md border border-2 p-2 border-zinc-900 bg-white mt-1 text-xs text-left ${
                                                                        selectedAmenities.includes(amenity) ? 'bg-zinc-900 text-white' : 'bg-gray-50 text-gray-900 '
                                                                    }`}
                                                                    onClick={() => {
                                                                        if (selectedAmenities.includes(amenity)) {
                                                                            setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
                                                                        } else {
                                                                            handleClearSearch(amenity);
                                                                        }
                                                                    }}
                                                                >
                                                                    {amenity.value}
                                                                </button>
                                                            </div>
                                                        ))}
                                                </>
                                            ) : (
                                                <div className="relative flex items-start px-2">
                                                    <button
                                                        className={`flex flex-1 items-center justify-between truncate whitespace-pre-line rounded-md border border-2 p-2 border-zinc-900 bg-white mt-1 text-xs ${
                                                            selectedAmenities.includes(searchTerm) ? 'bg-zinc-900 text-white' : 'bg-gray-50 text-gray-900 '
                                                        }`}
                                                        onClick={() => {
                                                            if (selectedAmenities.includes(searchTerm)) {
                                                                setSelectedAmenities(selectedAmenities.filter((a) => a !== searchTerm));
                                                            } else {
                                                                handleClearSearchAdded();
                                                            }
                                                        }}
                                                    >
                                                        <span className="flex text-left mr-auto">{searchTerm}</span>
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="w-auto flex-shrink-0  xl:order-first xl:flex xl:flex-col overflow-y-auto ">
                                    <div className="mt-4">
                                        <h2 className="block text-sm font-medium leading-6 text-gray-900 mb-2">Selected Amenities:</h2>
                                    </div>
                                    <nav className="bg-blue flex-1 overflow-y-auto z-0" aria-label="Directory">
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {selectedAmenities?.map((amenity, index) => (
                                                <div key={index} className="relative flex items-start">
                                                    <button
                                                        type="button"
                                                        className="flex mr-1 items-center justify-between truncate whitespace-pre-line rounded-md border border-2 p-2 border-zinc-900 bg-white mt-1 text-xs text-left bg-gray-50 text-gray-900"
                                                        onClick={() => {
                                                            if (selectedAmenities.includes(amenity)) {
                                                                setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
                                                            } else {
                                                                handleClearSearch(amenity);
                                                            }
                                                        }}
                                                    >
                                                        {amenity.value} <IconX className="text-red-500 hover:text-red-700 ml-2" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </div>
                        <div className=" overflow-hidden rounded-xl bg-white shadow shadow-zinc-400 md:col-span-3 ">
                            <div className="px-4 py-5 sm:p-6 ">
                                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                                    Photos of your Space
                                </label>
                                <p className="text-sm text-gray-500">
                                    *Please upload at least 3 photos of this space. Do not include any photos from outside the space. Photos should be of the actual space you are listing.
                                </p>
                                {selectedFiles && selectedFiles.length > 0 ? (
                                    <div className="grid md:grid-cols-4 grid-cols-2 gap-1 mb-4 mt-2">
                                        {selectedFiles && selectedFiles.length > 0 && (
                                            <img className="w-full h-64 object-cover object-center border-zinc-900 border-4 rounded-xl" src={URL.createObjectURL(selectedFiles[0])} alt="Preview" />
                                        )}

                                        {selectedFiles.slice(1).map((file, index) => (
                                            <div key={index} className="relative">
                                                <img className="w-full h-64 object-cover object-center rounded-xl" key={file.name} src={URL.createObjectURL(file)} alt="Preview" />
                                                {/* Add delete button */}
                                                <button className="absolute top-0 right-0 p-1 m-1 bg-red-500 rounded-full text-white" onClick={() => handleDeletePhoto(index + 1)}>
                                                    <IconX />
                                                </button>
                                                <button
                                                    className="absolute bottom-2 right-2 bg-gray-900 hover:bg-gray-700 rounded-full text-white px-4 pb-1"
                                                    onClick={() => handleSelectAsMain(index + 1)}
                                                >
                                                    <span className="text-white text-xs font-bold">Select as Main Photo</span>
                                                </button>
                                            </div>
                                        ))}
                                        <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} ref={fileInputRef} multiple />
                                        <button
                                            type="button"
                                            className="relative block w-full h-64 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                                            onClick={() => {
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.click();
                                                }
                                            }}
                                        >
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span className="mt-2 block text-sm font-semibold text-gray-900">Add More Photos</span>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} ref={fileInputRef} multiple />
                                        <button
                                            type="button"
                                            className="mt-2 relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                                            onClick={() => {
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.click();
                                                }
                                            }}
                                        >
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span className="mt-2 block text-sm font-semibold text-gray-900">Upload Photos of your Space</span>
                                            <p className="text-xs text-gray-500 text-center">PNG, JPG, GIF up to 10MB</p>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-4 md:row-span-2 ">
                            <div className="rounded-xl bg-white shadow shadow-zinc-400 md:col-span-3 grid grid-cols-5 gap-3 p-4">
                                <div className=" bg-white col-span-5 w-full ">
                                    <div className="flex items-center col-span-2 text-sm font-medium leading-6 text-gray-900">Space Address</div>
                                    <div>
                                        <input
                                            type="text"
                                            id="address"
                                            name="rental-date"
                                            className="block w-full rounded-xl border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 h-12 form-input"
                                            onChange={(e) => {
                                                setAddress(e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className=" bg-white w-full col-span-2">
                                    <div className="flex items-center text-sm font-medium leading-6 text-gray-900">City</div>
                                    <div>
                                        <input
                                            type="text"
                                            id="address"
                                            name="rental-date"
                                            className="block w-full rounded-xl border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 h-12 form-input"
                                            onChange={(e) => {
                                                setCity(e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className=" bg-white ">
                                    <div className="flex items-center col-span-2 text-sm font-medium leading-6 text-gray-900">State</div>
                                    <select
                                        id="space-type"
                                        name="space-type"
                                        className="block w-full rounded-xl border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:max-w-xs sm:text-sm sm:leading-6 h-12 form-select"
                                        value={JSON.stringify(state)} // Convert the spaceType object to a JSON string
                                        onChange={(e) => setState(JSON.parse(e.target.value))} // Parse the JSON string back to an object when the selection changes
                                    >
                                        {states?.map((state) => (
                                            <option
                                                key={state.abbreviation}
                                                value={JSON.stringify(state.abbreviation)} // Convert the object to a JSON string as the option value
                                            >
                                                {state.abbreviation}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className=" bg-white col-span-2">
                                    <div className="flex items-center  text-sm font-medium leading-6 text-gray-900">Zip Code</div>
                                    <div>
                                        <input
                                            type="text"
                                            id="zip"
                                            name="zip"
                                            className="block w-full rounded-xl border py-1.5 text-gray-900 shadow-sm form-input ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 h-12"
                                            onChange={(e) => {
                                                setZip(e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-200 overflow-hidden rounded-xl shadow-zinc-400 bg-white shadow col-span-3 h-auto">
                                <div className="px-4 py-5 sm:px-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                                            Does your space have any special licenses or permits?
                                        </label>
                                        <p className="text-xs text-gray-500">*Permits may include something like a commmercial kitchen permit, a liquor license, or a business license.</p>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="license"
                                                id="license"
                                                className="block w-full rounded-xl border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 h-12 form-input"
                                                value={licenseName}
                                                placeholder="Name of License or Permit"
                                                onChange={(e) => {
                                                    setLicenseName(e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div className="flex">
                                            <button
                                                className="mt-4 ml-auto inline-flex items-center rounded-sm bg-emerald-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700"
                                                onClick={() => {
                                                    setLicenses([...licenses, licenseName]);
                                                    setLicenseName('');
                                                }}
                                            >
                                                <IconPlus />
                                                Add License or Permit
                                            </button>
                                        </div>
                                        {licenses.length > 0 && (
                                            <div className="mt-4">
                                                <h2 className="block text-sm font-medium leading-6 text-gray-900 mb-2">Licenses and Permits:</h2>
                                                <div className="w-full">
                                                    {licenses.map((license, index) => (
                                                        <div key={index} className="relative flex items-start">
                                                            <div className="flex w-full items-center justify-between truncate whitespace-pre-line rounded-md border p-2 border-zinc-900  mt-1 text-sm text-left bg-gray-50 text-gray-900 font-bold ">
                                                                {license}
                                                                <button
                                                                    onClick={() => {
                                                                        setLicenses(licenses.filter((l) => l !== license));
                                                                    }}
                                                                >
                                                                    <IconX className="cursor-pointer hover:text-red-500" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200 overflow-hidden rounded-xl shadow-zinc-400 bg-white shadow col-span-3 h-auto">
                                <div className="px-4 py-5 sm:px-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                                            FAQs or Special Instructions
                                        </label>
                                        <p className="text-xs text-gray-500">*You can include any special instructions or frequently asked questions about your space here.</p>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="faqQuestion"
                                                id="faqQuestion"
                                                className="block w-full rounded-xl border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 h-12 form-input"
                                                value={faqQuestion}
                                                placeholder="Question"
                                                onChange={(e) => {
                                                    setFaqQuestion(e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <textarea
                                                rows={4}
                                                name="faqanser"
                                                id="faqanser"
                                                className="block w-full rounded-xl border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 form-textarea"
                                                placeholder="Answer"
                                                value={faqAnswer}
                                                onChange={(e) => {
                                                    setFaqAnswer(e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div className="flex">
                                            <button
                                                className="mt-4 ml-auto inline-flex items-center rounded-sm bg-emerald-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700"
                                                onClick={() => {
                                                    if (faqQuestion.trim() === '' || faqAnswer.trim() === '') {
                                                        return;
                                                    } else {
                                                        setFaqs([...faqs, { question: faqQuestion, answer: faqAnswer }]);
                                                        setFaqQuestion('');
                                                        setFaqAnswer('');
                                                    }
                                                }}
                                            >
                                                <IconPlus />
                                                Add FAQ
                                            </button>
                                        </div>
                                        {faqs.length > 0 && (
                                            <div className="mt-4">
                                                <h2 className="block text-sm font-medium leading-6 text-gray-900 mb-2">FAQs:</h2>
                                                <div className="w-full">
                                                    {faqs.map((faq, index) => (
                                                        <div key={index} className="relative flex items-start">
                                                            <div className="flex w-full items-center justify-between truncate whitespace-pre-line rounded-md border p-2 border-zinc-900  mt-1 text-sm text-left bg-gray-50 text-gray-900 relative">
                                                                <button
                                                                    onClick={() => {
                                                                        setFaqs(faqs.filter((f) => f !== faq));
                                                                    }}
                                                                >
                                                                    <IconX className="cursor-pointer hover:text-red-500 absolute right-2 top-2" />
                                                                </button>
                                                                <div className="mr-4">
                                                                    <p className="font-bold">{faq.question}</p>

                                                                    <p>{faq.answer}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-xl shadow-zinc-400 bg-white shadow md:col-span-3 grid sm:grid-cols-2 grid-cols-1 gap-3 p-4">
                            <div className="sm:col-span-2 bg-white">
                                <div className="flex items-center  text-sm font-medium leading-6 text-gray-900">When is the space available?</div>
                                <div>
                                    <input
                                        type="date"
                                        id="rental-date"
                                        name="rental-date"
                                        value={selectedStartDate}
                                        min={new Date().toISOString().slice(0, 10)}
                                        max={new Date().getFullYear() + 1 + '-12-31'}
                                        className="block w-full rounded-xl border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 h-12 form-input"
                                        onChange={(event) => setSelectedStartDate(event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="bg-white sm:col-span-2">
                                <div className="flex items-center col-span-2 text-sm font-medium leading-6 text-gray-900">Space Square Footage</div>
                                <div>
                                    <div className="relative rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            name="sqFeet"
                                            id="sqFeet"
                                            className="block w-full rounded-xl border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 h-12 form-input"
                                            aria-describedby="price-currency"
                                            onChange={(e) => {
                                                setSqft(e.target.value);
                                            }}
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <span className="text-gray-500 sm:text-sm" id="price-currency">
                                                sqft
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white sm:col-span-2">
                                <div className="flex items-center col-span-2 text-sm font-medium leading-6 text-gray-900">Space Capacity</div>
                                <div>
                                    <div className="relative rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            name="capacity"
                                            id="capacity"
                                            className="block w-full rounded-xl border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 h-12 form-input"
                                            aria-describedby="price-currency"
                                            onChange={(e) => {
                                                setCapacity(e.target.value);
                                            }}
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <span className="text-gray-500 sm:text-sm" id="price-currency">
                                                People
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white sm:col-span-6 pt-4">
                                <div>
                                    <label className="text-base font-semibold text-gray-900">Do you require an in person meeting before rental?</label>
                                    <p className="text-sm text-gray-500">
                                        If you require an in person meeting before rental, you will be notified when a renter requests to book your space. You will have 24 hours to respond to the
                                        request. If you do not respond within 24 hours, the request will be cancelled.
                                    </p>
                                    <fieldset className="mt-4">
                                        <legend className="sr-only">Notification method</legend>
                                        <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                            <div className="flex items-center">
                                                <input
                                                    id="yes"
                                                    name="meeting-method"
                                                    type="radio"
                                                    checked={requiresMeeting}
                                                    className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                                                    onChange={() => setRequiresMeeting(true)}
                                                />
                                                <label htmlFor="yes" className="ml-3 block text-sm font-medium leading-6 text-gray-900 mb-2">
                                                    Yes
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    id="no"
                                                    name="meeting-method"
                                                    type="radio"
                                                    checked={!requiresMeeting}
                                                    className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                                                    onChange={() => setRequiresMeeting(false)}
                                                />
                                                <label htmlFor="no" className="ml-3 block text-sm font-medium leading-6 text-gray-900 mb-2">
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                            <div className="bg-white sm:col-span-6 pt-4">
                                <div>
                                    <div className="mt-4">
                                        <label className="text-base font-semibold text-gray-900">Do you have a minimum rental period?</label>
                                        <p className="text-sm text-gray-500">If you have a minimum rental period, users will not be able to book your space for less than the specified time.</p>
                                        <fieldset className="mt-4">
                                            <legend className="sr-only">Notification method</legend>
                                            <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                                <div className="flex items-center">
                                                    <input
                                                        id="yes-min"
                                                        name="notification-method"
                                                        type="radio"
                                                        checked={minPeriond}
                                                        className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                                                        onChange={() => setMinPeriod(true)}
                                                    />
                                                    <label htmlFor="yes" className="ml-3 block text-sm font-medium leading-6 text-gray-900 mb-2">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        id="no-min"
                                                        name="notification-method"
                                                        type="radio"
                                                        checked={!minPeriond}
                                                        className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                                                        onChange={() => setMinPeriod(false)}
                                                    />
                                                    <label htmlFor="no" className="ml-3 block text-sm font-medium leading-6 text-gray-900 mb-2">
                                                        No
                                                    </label>
                                                </div>
                                                {minPeriond && (
                                                    <div className="relative sm:w-1/2 xl:w-1/4 w-full mt-2 rounded-md shadow-sm">
                                                        <input
                                                            type="text"
                                                            name="price"
                                                            id="period-value"
                                                            className="block w-full rounded-xl border py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600  h-12 sm:text-3xl font-bold sm:leading-6"
                                                            placeholder="0"
                                                            onChange={(e: any) => setMinValue(e.target.value)}
                                                        />
                                                        <div className="absolute inset-y-0 right-0 flex items-center">
                                                            <label htmlFor="currency" className="sr-only">
                                                                Period
                                                            </label>
                                                            <select
                                                                id="period"
                                                                name="period"
                                                                className="h-full rounded-xl border bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm"
                                                                onChange={(e: any) => setMinimumPeriod(e.target.value)}
                                                            >
                                                                <option value="months">Months</option>
                                                                <option value="days">Days</option>
                                                                <option value="hours">Hours</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white sm:col-span-6 pt-4">
                                <div>
                                    <div className="mt-4">
                                        <label className="text-base font-semibold text-gray-900">Do you require a security deposit?</label>
                                        <p className="text-sm text-gray-500">If you require a security deposit, users will be required to pay the deposit before booking your space.</p>
                                        <fieldset className="mt-4">
                                            <legend className="sr-only">Notification method</legend>
                                            <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                                <div className="flex items-center">
                                                    <input
                                                        id="yes-sec"
                                                        name="security-deposit"
                                                        type="radio"
                                                        checked={requiresSecurityDeposit}
                                                        className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                                                        onChange={() => setRequiresSecurityDeposit(true)}
                                                    />
                                                    <label htmlFor="yes-sec" className="ml-3 block text-sm font-medium leading-6 text-gray-900 mb-2">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        id="no-sec"
                                                        name="security-deposit"
                                                        type="radio"
                                                        checked={!requiresSecurityDeposit}
                                                        className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-600 cursfirebor-pointer"
                                                        onChange={() => setRequiresSecurityDeposit(false)}
                                                    />
                                                    <label htmlFor="no-sec" className="ml-3 block text-sm font-medium leading-6 text-gray-900 mb-2">
                                                        No
                                                    </label>
                                                </div>
                                                {requiresSecurityDeposit && (
                                                    <div className="relative sm:w-1/2 xl:w-1/4 w-full mt-2 rounded-md shadow-sm">
                                                        <input
                                                            type="text"
                                                            name="price"
                                                            id="period-value"
                                                            className="block w-full rounded-xl border py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600  h-12 sm:text-3xl font-bold sm:leading-6 form-input"
                                                            placeholder="0"
                                                            onChange={(e: any) => setMinValue(e.target.value)}
                                                        />
                                                        <div className="absolute inset-y-0 right-0 flex items-center">
                                                            <label htmlFor="currency" className="sr-only">
                                                                Period
                                                            </label>
                                                            <select
                                                                id="period"
                                                                name="period"
                                                                className="h-full rounded-xl border bg-transparent form-select py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm"
                                                                onChange={(e) => setMinimumPeriod(e.target.value)}
                                                            >
                                                                <option value="months">Months</option>
                                                                <option value="days">Days</option>
                                                                <option value="hours">Hours</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-full">
                            <EditPrices prices={prices} setPrices={setPrices} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
