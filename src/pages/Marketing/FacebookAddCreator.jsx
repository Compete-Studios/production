import React, { useState } from 'react';
import axios from 'axios';

const CreateFacebookAd = () => {
  const [adDetails, setAdDetails] = useState({
    adName: '',
    adCreative: '',
    targeting: '',
    budget: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdDetails({ ...adDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
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
            access_token: 'your_access_token'
          }
        }
      );
      console.log('Ad created successfully:', response.data);
      // Reset form after successful submission
      setAdDetails({
        adName: '',
        adCreative: '',
        targeting: '',
        budget: ''
      });
    } catch (error) {
      console.error('Error creating ad:', error);
      // Handle error, show error message to user, etc.
    }
  };

  return (
    <div>
      <h2>Create Facebook Ad</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ad Name:</label>
          <input
            type="text"
            name="adName"
            value={adDetails.adName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Ad Creative:</label>
          <textarea
            name="adCreative"
            value={adDetails.adCreative}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label>Targeting:</label>
          <input
            type="text"
            name="targeting"
            value={adDetails.targeting}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Budget:</label>
          <input
            type="number"
            name="budget"
            value={adDetails.budget}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create Ad</button>
      </form>
    </div>
  );
};

export default CreateFacebookAd;
