const config = {
    apiUrl: process.env.REACT_APP_API_URL,
    s3Bucket: 'https://' + process.env.REACT_APP_BUCKET + '.s3.amazonaws.com/'
    // locally -> REACT_APP_API_URL="http://localhost:5000"
    // apiUrl: 'https://inaglobe-api.herokuapp.com'
};

export default config;
