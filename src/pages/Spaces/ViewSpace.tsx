import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSpaceData } from '../../functions/spaces';
import IconMapPin from '../../components/Icon/IconMapPin';
import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import IconShare from '../../components/Icon/IconShare';
import EmblaCarousel from './components/EmblaCarousel';
import IconCircleCheck from '../../components/Icon/IconCircleCheck';

const OPTIONS = { loop: true };

const spaceInit = {
    minimumPeriod: 'months',
    licenses: [],
    prices: {},
    isAvailable: 'active',
    capacity: '50',
    photos: [
        'https://firebasestorage.googleapis.com/v0/b/compete-f8fc5.appspot.com/o/spaces%2FlxRnrYUWtPrUgMGS%2F0?alt=media&token=cc6b909e-9741-46e6-adfb-1324a1c4decf',
        'https://firebasestorage.googleapis.com/v0/b/compete-f8fc5.appspot.com/o/spaces%2FlxRnrYUWtPrUgMGS%2F1?alt=media&token=001ee5d3-27e6-4a9b-a2e1-9728a656c305',
        'https://firebasestorage.googleapis.com/v0/b/compete-f8fc5.appspot.com/o/spaces%2FlxRnrYUWtPrUgMGS%2F2?alt=media&token=54e52864-9529-4d1a-ac62-547b4de2f073',
    ],
    state: 'CO',
    mainPhoto: 'https://firebasestorage.googleapis.com/v0/b/compete-f8fc5.appspot.com/o/spaces%2FlxRnrYUWtPrUgMGS%2F0?alt=media&token=cc6b909e-9741-46e6-adfb-1324a1c4decf',
    hasMin: false,
    description:
        "The Granbury Cabins at Windy Ridge is a boutique retreat featuring a collection of farmhouse style cabins. Set on our wooded 10 acre property, guests are encouraged to enjoy the slow pace and simple pleasures of living in the country. Head down our dirt drive and let your worries slip away. Breathe in the fresh air, enjoy coffee on the porch, and settle in to relax for a while. We love Dilly Dally for its private hot tub, stone shower, and quirky touches like custom light switches. The space Dilly Dally features and amenities: The cabin has an open floor plan. When you walk in the front door you will see the sitting area and bed. To the right of the front door is an offset space that contains the dining and kitchen areas. There is a small staircase leading to a tiny reading loft containing a daybed. Kitchenette with infrared double burner cooktop (no oven), dishes, cookware, microwave, refrigerator, toaster. Coffee maker with grounds, filters, creamer, and sugar provided along with assorted teas. Bathroom has custom stone shower and rainfall shower head. Private hot tub, large back deck, charcoal grill, and fire pit. TV with DVD player. Cozy sitting area with gas fireplace. Adjustable A/C and heat. Eco-friendly shampoo, conditioner, soap and lotion. Guest access Guests are welcome to roam around our 10 acres, make sure to bring your boots and bug spray! There is a rustic hiking trail and beautiful overlook from the highest peak on the property. The cabin has a fire pit and grill next to the house which guests may use if they bring firewood, charcoal, etc. Other things to note We supply amenities including toilet paper, sheets, and towels. Please keep in mind that this is a rustic retreat so there isn't WIFI and some cell providers have spotty service. We do have a Blu-Ray player and since there is no cable we recommend bringing some DVDs if you would like to watch something during your stay. We hope that you enjoy your time away from the hustle and bustle of your day to day life! We do have several other unique lodging options on our property. If Dilly Dally isn’t available for your desired dates please check out our other listings. No photography or filming for professional/commercial purposes is allowed without prior approval and requires additional fees. Please send a message before booking for more information.",
    title: 'Dilly Dally Cabin - rustic retreat with hot tub',
    address: '11355 Sarazen Grove',
    zip: '80921',
    createdAt: {
        seconds: 1719514008,
        nanoseconds: 344000000,
    },
    selectedStartDate: '2024-06-27',
    requiresMeeting: false,
    sqft: '500',
    amenities: ['Seating', 'Sound system', 'A/V equipment', 'Lighting', 'Climate control', 'Restrooms', 'Parking', 'Accessibility', 'Kitchen facilities', 'Storage space'],
    id: 'lxRnrYUWtPrUgMGS',
    faqs: [],
    minValue: 1,
    allowContact: true,
    email: 'office@springsdance.com',
    userID: '32',
    city: 'Colorado Springs',
};

export default function ViewSpace() {
    const { id } = useParams<{ id: string }>();
    const [space, setSpace] = useState<any>(spaceInit);
    const [currentSection, setCurrentSection] = useState('about');
    const [showFullDescription, setShowFullDescription] = useState(false);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };
    // const [space, setSpace] = useState<any>(null);

    // const handleGetData = async () => {
    //     const data = await getSpaceData(id);
    //     setSpace(data);
    // };

    // useEffect(() => {
    //     handleGetData();
    // }, [id]);

    const handleScrollToSection = (id: any) => {
        const element = document.getElementById(id);
        setCurrentSection(id);
        if (element) {
            const offset = element.offsetTop - 30; // Subtract 10 pixels for the margin
            window.scrollTo({
                top: offset,
                behavior: 'smooth',
            });
        }
    };

    console.log(space);

    return (
        <div className="grid sm:grid-cols-12 gap-4">
            <div className="sm:col-span-3">
                <img src={space.mainPhoto} alt={space.title} className="aspect-[14/13] w-full rounded-2xl object-cover" />
                <div className="font-bold text-2xl mt-4">{space?.title}</div>
                <div className="flex items-center gap-1 font-semibold text-lg">
                    <IconMapPin /> {space?.city}, {space?.state}
                </div>

                <div className={`mt-4 text-sm text-gray-500 flex items-center ${space?.hasMin ? 'justify-between' : ''}`}>
                    <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-4 w-4 mr-1" viewBox="0 0 16 16">
                            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                        </svg>
                        {space?.capacity} people
                    </div>
                    <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-4 w-4 mr-1 ml-5" viewBox="0 0 16 16">
                            <path d="M1 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5v-1H2v-1h4v-1H4v-1h2v-1H2v-1h4V9H4V8h2V7H2V6h4V2h1v4h1V4h1v2h1V2h1v4h1V4h1v2h1V2h1v4h1V1a1 1 0 0 0-1-1z" />
                        </svg>
                        {space?.sqft} sqft
                    </div>

                    {space?.hasMin && (
                        <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-4 w-4 mr-1 ml-5" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                            </svg>
                            {space?.minValue} {space?.minimumPeriod} min
                        </div>
                    )}
                </div>
            </div>
            <div className="sm:col-span-9">
                <div className="mt-3 flex flex-wrap">
                    <button
                        className={`${
                            currentSection === 'about' ? 'text-primary !outline-none before:!w-full' : ''
                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-primary before:transition-all before:duration-700 hover:text-primary hover:before:w-full`}
                        onClick={() => handleScrollToSection('about')}
                    >
                        About
                    </button>
                    <button
                        className={`${
                            currentSection === 'photos' ? 'text-primary !outline-none before:!w-full' : ''
                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-primary before:transition-all before:duration-700 hover:text-primary hover:before:w-full`}
                        onClick={() => handleScrollToSection('photos')}
                    >
                        Photos
                    </button>
                    <button
                        className={`${
                            currentSection === 'amenities' ? 'text-primary !outline-none before:!w-full' : ''
                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-primary before:transition-all before:duration-700 hover:text-primary hover:before:w-full`}
                        onClick={() => handleScrollToSection('amenities')}
                    >
                        Amenities
                    </button>
                    <button
                        className={`${
                            currentSection === 'availability' ? 'text-primary !outline-none before:!w-full' : ''
                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-primary before:transition-all before:duration-700 hover:text-primary hover:before:w-full`}
                        onClick={() => handleScrollToSection('availability')}
                    >
                        Availability
                    </button>
                    <button
                        className={`${
                            currentSection === 'licenses' ? 'text-primary !outline-none before:!w-full' : ''
                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-primary before:transition-all before:duration-700 hover:text-primary hover:before:w-full`}
                        onClick={() => handleScrollToSection('licenses')}
                    >
                        Licenses
                    </button>
                    <button
                        className={`${
                            currentSection === 'qanda' ? 'text-primary !outline-none before:!w-full' : ''
                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-primary before:transition-all before:duration-700 hover:text-primary hover:before:w-full`}
                        onClick={() => handleScrollToSection('qanda')}
                    >
                        Q&As
                    </button>
                    <button className="ml-auto btn btn-info gap-1">
                        <IconShare />
                        Share
                    </button>
                </div>
                <div id="about" className="mt-5">
                    <h2 className="font-bold text-xl">About</h2>
                    <p className={`mt-3 leading-8 text-lg ${showFullDescription ? '' : 'line-clamp-3'}`}>{space?.description}</p>
                    <div className="flex mt-2">
                        <button onClick={toggleDescription} className="ml-auto text-emerald-600 hover:text-primary">
                            {showFullDescription ? 'Read less' : 'Read more'}
                        </button>
                    </div>
                </div>
                <div id="photos" className="mt-5">                
                    <EmblaCarousel slides={space?.photos} options={OPTIONS} />
                </div>
                <div id="amenities" className="mt-5">
                    <h2 className="font-bold text-xl">Amenities</h2>
                    <div className="mt-3">
                    <div className="grid sm:grid-cols-4 grid-cols-2 gap-y-2 text-lg font-semibold">
              {" "}
              {space?.amenities?.map((amenity: any) => (
                <div key={amenity} className="flex items-center gap-x-1">
                  <IconCircleCheck className="h-5 w-5 text-primary shrink-0" />
                  {amenity}
                </div>
              ))}
            </div>
                    </div>
                </div>
                <div id="availability" className="mt-5">
                    <h2 className="font-bold text-xl">Availability</h2>
                    <div className="mt-3">
                        <div className="font-semibold">Available for rent</div>
                        <div className="text-success">Yes</div>
                    </div>
                </div>
                <div id="licenses" className="mt-5">
                    <h2 className="font-bold text-xl">Licenses</h2>
                    <div className="mt-3">
                        <ul>
                            {space?.licenses.map((license: any, index: any) => (
                                <li key={index}>{license}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div id="qanda" className="mt-5">
                    <h2 className="font-bold text-xl">Q&As</h2>
                    <div className="mt-3">
                        <ul>
                            {space?.faqs.map((faq: any, index: any) => (
                                <li key={index}>
                                    <div className="font-semibold">{faq.question}</div>
                                    <div>{faq.answer}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
