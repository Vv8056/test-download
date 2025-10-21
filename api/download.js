// const axios = require('axios');

// module.exports = async function handler(req, res) {

//    // Set CORS headers for all responses
//   res.setHeader('Access-Control-Allow-Origin', '*'); // allow all domains
//   res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   // Handle preflight OPTIONS request
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }
  
//   // Only allow POST requests
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed. Use POST.' });
//   }

//   const { instaUrl } = req.body;

//   if (!instaUrl || !instaUrl.startsWith('http')) {
//     return res.status(400).json({ error: 'Please provide a valid Instagram URL.' });
//   }

//   const endpoint = 'https://instasaved.net/en/ajax/saver';
//   const payload = {
//     type: 'post',
//     username: 'reel',
//     origin_value: instaUrl,
//   };

//   try {
//     const response = await axios.post(endpoint, payload, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       }
//     });

//     const data = response.data;

//     // Return the response JSON to the client
//     res.status(200).json({ success: true, data });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.response?.data || error.message,
//     });
//   }
// };


const axios = require('axios');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all domains
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight OPTIONS request
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { instaUrl } = req.body;

  if (!instaUrl || !instaUrl.startsWith('http')) {
    return res.status(400).json({ error: 'Please provide a valid Instagram URL.' });
  }

  const endpoint = 'https://instasaved.net/en/ajax/saver';
  const payload = {
    type: 'post',
    username: 'reel',
    origin_value: instaUrl,
  };

  try {
    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
      },
      timeout: 15000, // 15s timeout
    });

    const data = response.data;

    // Check if Instasaved returned links
    if (!data || Object.keys(data).length === 0) {
      return res.status(502).json({ success: false, error: 'No data returned from Instasaved.' });
    }

    // Return JSON response
    res.status(200).json({ success: true, data });

  } catch (error) {
    console.error('Error fetching video:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};
