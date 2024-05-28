import React, { useState } from 'react';
import axios from 'axios';
import IconFacebook from '../../components/Icon/IconFacebook';
import IconPlus from '../../components/Icon/IconPlus';
import IconChartSquare from '../../components/Icon/IconChartSquare';
import IconNotesEdit from '../../components/Icon/IconNotesEdit';

const CreateFacebookAd = () => {
    const [activeTab4, setActiveTab4] = useState<any>(1);
    const [adDetails, setAdDetails] = useState({
        adName: '',
        adCreative: '',
        targeting: '',
        budget: '',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setAdDetails({ ...adDetails, [name]: value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'https://graph.facebook.com/v12.0/act_<your_ad_account_id>/ads',
                {
                    name: adDetails.adName,
                    creative: adDetails.adCreative,
                    targeting: adDetails.targeting,
                    daily_budget: adDetails.budget,
                    // Other ad parameters...
                },
                {
                    params: {
                        access_token: 'your_access_token',
                    },
                }
            );
            console.log('Ad created successfully:', response.data);
            // Reset form after successful submission
            setAdDetails({
                adName: '',
                adCreative: '',
                targeting: '',
                budget: '',
            });
        } catch (error) {
            console.error('Error creating ad:', error);
            // Handle error, show error message to user, etc.
        }
    };

    const accountAdID = 'act_<your_ad_account_id>';
    const pageID = 'your_page_id';

    //STEP 1 - Create a campaign
    const createFacebookCampaign = async () => {
        const campaignData = {
            access_token: 'your_access_token',
            buying_type: 'AUCTION',
            name: 'My Campaign',
            objective: 'OUTCOME_LEADS',
            special_ad_categories: ['NONE'],
            status: 'PAUSED',
        };
        try {
            const response = await axios.post(`https://graph.facebook.com/v20.0/${accountAdID}/campaigns`, campaignData);
            console.log('Campaign created successfully:', response.data);
        } catch (error) {
            console.error('Error creating campaign:', error);
        }
    };

    //returns {
    //   "id": "YOUR_CAMPAIGN_ID"
    // }

    //STEP 2 - Create an ad set
    const createAdSet = async () => {
        const adSetData = {
            access_token: 'your_access_token',
            bid_amount: '100',
            billing_event: 'IMPRESSIONS',
            campaign_id: 'your_campaign_id',
            daily_budget: '1000',
            name: 'YOUR_LEADADS_ADSET_NAME',
            optimization_goal: 'LEAD_GENERATION',
            destination_type: 'ON_AD',
            promoted_object: 'YOUR_PAGE_ID',
            status: 'PAUSED',
            targeting: {
                age_max: 65,
                age_min: 18,
                genders: [1],
                countries: ['US'],
                cities: [{ key: '777934', radius: 10, distance_unit: 'mile' }],
                zips: ['10001'],
            },
        };
        try {
            const response = await axios.post(`https://graph.facebook.com/v20.0/${accountAdID}/adsets`, adSetData);
            console.log('Ad set created successfully:', response.data);
        } catch (error) {
            console.error('Error creating ad set:', error);
        }
    };

    // returns {
    //     "id": "YOUR_ADSET_ID"
    //   }

    //STEP 3 - Create a lead form
    const createALeadForm = async () => {
        const leadFormData = {
            access_token: 'your_page_access_token',
            name: 'YOUR_LEADADS_FORM_NAME',
            questions: [
                { type: 'FULL_NAME', key: 'question1' },
                { type: 'EMAIL', key: 'question2' },
                { type: 'PHONE', key: 'question3' },
                { type: 'CUSTOM', key: 'question4', label: 'Do you like rainbows?' },
                {
                    type: 'CUSTOM',
                    key: 'question5',
                    label: 'What is your favorite color?',
                    options: [
                        { value: 'Red', key: 'key1' },
                        { value: 'Green', key: 'key2' },
                        { value: 'Blue', key: 'key2' },
                    ],
                },
            ],
        };
        try {
            const response = await axios.post(`https://graph.facebook.com/v20.0/${pageID}/leadgen_forms`, leadFormData);
            console.log('Lead form created successfully:', response.data);
        } catch (error) {
            console.error('Error creating lead form:', error);
        }
    };

    // returns {
    //     "id": "leadgen_form_id",
    //   }

    //STEP 4 - Create an ad creative
    const createAdCreative = async () => {
        const creativeData = {
            access_token: 'YOUR_PAGE_ACCESS_TOKEN',
            object_story_spec: {
                link_data: {
                    call_to_action: {
                        type: 'SIGN_UP',
                        value: {
                            lead_gen_form_id: 'YOUR_FORM_ID',
                        },
                    },
                    description: 'YOUR_AD_CREATIVE_DESCRIPTION',
                    image_hash: 'YOUR_IMAGE_HASH',
                    link: 'http://fb.me/',
                    message: 'YOUR_AD_CREATIVE_MESSAGE',
                },
                page_id: 'YOUR_PAGE_ID',
            },
        };
        try {
            const response = await axios.post(`https://graph.facebook.com/v20.0/${accountAdID}/adcreatives`, creativeData);
            console.log('Ad creative created successfully:', response.data);
        } catch (error) {
            console.error('Error creating ad creative:', error);
        }
    };

    // STEP 5 - Create an ad
    const createAd = async () => {
        const adData = {
            access_token: 'YOUR PAGE ACCESS TOKEN',
            name: 'YOUR_AD_NAME',
            adset_id: 'YOUR_ADSET_ID',
            creative: {
                creative_id: 'YOUR_CREATIVE_ID',
            },
            status: 'PAUSED',
        };
        try {
            const response = await axios.post(`https://graph.facebook.com/v20.0/${accountAdID}/ads`, adData);
            console.log('Ad created successfully:', response.data);
        } catch (error) {
            console.error('Error creating ad:', error);
        }
    };

    return (
        <div>
            <h2>Create Facebook Ad</h2>
            <div className="inline-block w-full">
                <div className="relative z-[1]">
                    <div
                        className={`${activeTab4 === 1 ? 'w-[15%]' : activeTab4 === 2 ? 'w-[48%]' : activeTab4 === 3 ? 'w-[81%]' : ''}
            bg-primary w-[15%] h-1 absolute ltr:left-0 rtl:right-0 top-[30px] m-auto -z-[1] transition-[width]`}
                    ></div>
                    <ul className="mb-5 grid grid-cols-4">
                        <li className="mx-auto ">
                            <div>
                                <button
                                    type="button"
                                    className={`${activeTab4 === 1 ? '!border-primary !bg-primary text-white' : ''}
                    border-[3px] border-[#f3f2ee] bg-white dark:bg-[#253b5c] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full`}
                                    onClick={() => setActiveTab4(1)}
                                >
                                    <IconPlus />
                                </button>
                                <span className={`${activeTab4 === 1 ? 'text-primary ' : ''} text-center block mt-2`}> Create a campaign</span>
                            </div>
                        </li>
                        <li className="mx-auto">
                            <button
                                type="button"
                                className={`${activeTab4 === 2 ? '!border-primary !bg-primary text-white' : ''}
                    border-[3px] border-[#f3f2ee] bg-white dark:bg-[#253b5c] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full`}
                                onClick={() => setActiveTab4(2)}
                            >
                                <IconChartSquare />
                            </button>
                            <span className={`${activeTab4 === 2 ? 'text-primary ' : ''} text-center block mt-2`}> Create an ad set</span>
                        </li>
                        <li className="mx-auto">
                            <button
                                type="button"
                                className={`${activeTab4 === 3 ? '!border-primary !bg-primary text-white' : ''}
                    border-[3px] border-[#f3f2ee] bg-white dark:bg-[#253b5c] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full`}
                                onClick={() => setActiveTab4(3)}
                            >
                                <IconNotesEdit />
                            </button>
                            <span className={`${activeTab4 === 3 ? 'text-primary ' : ''}text-center block mt-2`}>Create Lead Form</span>
                        </li>
                        <li className="mx-auto">
                            <button
                                type="button"
                                className={`${activeTab4 === 4 ? '!border-primary !bg-primary text-white' : ''}
                    border-[3px] border-[#f3f2ee] bg-white dark:bg-[#253b5c] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full`}
                                onClick={() => setActiveTab4(4)}
                            >
                                <IconFacebook />
                            </button>
                            <span className={`${activeTab4 === 4 ? 'text-primary ' : ''}text-center block mt-2`}>Finalize Ad</span>
                        </li>
                    </ul>
                </div>
                <div>
                    {activeTab4 === 1 && (
                        <div className="max-w-xl mx-auto">
                            <div className="panel">
                                <label>Campaign Name:</label>
                                <input type="text" placeholder="Campaign Name" className="form-input" />
                                <div className="flex justify-between mt-12">
                                    <button type="button" className={`btn btn-primary ${activeTab4 === 1 ? 'hidden' : ''}`} onClick={() => setActiveTab4(activeTab4 === 3 ? 2 : 1)}>
                                        Back
                                    </button>
                                    <button type="button" className="btn btn-primary ltr:ml-auto rtl:mr-auto" onClick={() => setActiveTab4(activeTab4 === 1 ? 2 : 3)}>
                                        {activeTab4 === 3 ? 'Finish' : 'Next'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab4 === 2 && (
                        <>
                            <div className="max-w-xl mx-auto">
                                <div className="panel space-y-4">
                                    <div>
                                        <label>Ad Set Name:</label>
                                        <input type="text" placeholder="New Leads Ad Set" className="form-input" />
                                    </div>
                                    <div>
                                        <label>Facebook Page:</label>
                                        <select className="form-select text-white-dark">
                                            <option value="page_id">Page 1</option>
                                            <option value="page_id">Page 2</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Daily Budget:</label>
                                        <div className="flex">
                                            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                $
                                            </div>
                                            <input type="text" placeholder="" className="form-input rounded-none" />
                                            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                .00
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label>Age Range:</label>
                                        <div className="flex items-center gap-4">
                                            <input type="text" placeholder="Min" className="form-input" />
                                            -
                                            <input type="text" placeholder="Max" className="form-input" />
                                        </div>
                                    </div>
                                    <div>
                                        <label>Gender:</label>
                                        <div>
                                            <label className="flex items-center cursor-pointer">
                                                <input type="radio" name="custom_radio2" className="form-radio" defaultChecked />
                                                <span className="text-white-dark">All</span>
                                            </label>
                                        </div>
                                        <div>
                                            <label className="flex items-center cursor-pointer">
                                                <input type="radio" name="custom_radio2" className="form-radio" />
                                                <span className="text-white-dark">Female</span>
                                            </label>
                                        </div>
                                        <div>
                                            <label className="flex items-center cursor-pointer">
                                                <input type="radio" name="custom_radio2" className="form-radio" />
                                                <span className="text-white-dark">Male</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <label>Location:</label>
                                        <input type="text" placeholder="Location" className="form-input" />
                                    </div>

                                    <div className="flex justify-between mt-12">
                                        <button type="button" className={`btn btn-primary ${activeTab4 === 1 ? 'hidden' : ''}`} onClick={() => setActiveTab4(activeTab4 === 3 ? 2 : 1)}>
                                            Back
                                        </button>
                                        <button type="button" className="btn btn-primary ltr:ml-auto rtl:mr-auto" onClick={() => setActiveTab4(activeTab4 === 1 ? 2 : 3)}>
                                            {activeTab4 === 3 ? 'Finish' : 'Next'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {activeTab4 === 3 && (
                    <>
                        <p className="mb-5">Try the keyboard navigation by clicking arrow left or right!</p>

                        <div className="grid grid-cols-4">
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label>Form Name:</label>
                                    <input type="text" name="adName" value={adDetails.adName} className="form-input" onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Ad Creative:</label>
                                    <textarea name="adCreative" value={adDetails.adCreative} rows={6} className="form-input" onChange={handleChange}></textarea>
                                </div>
                                <div>
                                    <label>Targeting:</label>
                                    <input type="text" name="targeting" className="form-input" value={adDetails.targeting} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Budget:</label>
                                    <input type="number" name="budget" value={adDetails.budget} className="form-input" onChange={handleChange} />
                                </div>
                                <button type="submit" className="btn btn-dark">
                                    Create Ad
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreateFacebookAd;
