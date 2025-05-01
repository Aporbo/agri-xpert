const axios = require('axios');

// Call ML API to get crop/fertilizer recommendations based on soil input
const getMLRecommendation = async (soilInput) => {
  try {
    const response = await axios.post(process.env.ML_API_URL, soilInput);
    return response.data; // Expected: { crop: 'Wheat', fertilizer: 'Urea' }
  } catch (error) {
    console.error('[ML Service Error]', error.message);
    return {
      crop: 'N/A',
      fertilizer: 'N/A'
    };
  }
};

module.exports = { getMLRecommendation };
