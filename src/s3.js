import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY
});

export default function upload(file) {
    const params = {
        Bucket: process.env.REACT_APP_BUCKET,
        Key: 'test.pdf', // File name you want to save as in S3
        Body: file[0]
    };

    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

/*
**
* {
*   Response: {
*     bucket: "your-bucket-name",
*     key: "photos/image.jpg",
*     location: "https://your-bucket.s3.amazonaws.com/photos/image.jpg"
*   }
* }
*/

