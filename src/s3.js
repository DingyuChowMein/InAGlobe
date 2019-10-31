import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY
});



export default function upload(files, dir) {
    const links = [];
    console.log(files);

    files.forEach(function (f) {
        const name = dir + '/' + f.name;
        const params = {
            Bucket: process.env.REACT_APP_BUCKET,
            Key: name,
            Body: f
        };

        links.push(name);
        console.log(name);


        s3.upload(params, function (err, data) {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            return data.Location;
        });

    });

    return links
} ;

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

