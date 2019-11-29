import AWS from 'aws-sdk'
import { lookup } from "mime-types"

const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY
})

function upload(files, dir) {
    const links = []
    console.log(files)

    files.forEach(file => {
        if (typeof file !== "string") {
            const name = dir + '/' + file.name
            const params = {
                Bucket: process.env.REACT_APP_BUCKET,
                Key: name,
                Body: file
            }

            links.push(name)
            console.log(name)

            s3.upload(params, (err, data) => {
                if (err) throw err
                console.log(`File uploaded successfully: ${data.Location}`)
                return data.Location
            })
        }
        return file

    })

    return links
} 

function download(dir) {
    console.log(dir)
    const param = {
        Bucket: process.env.REACT_APP_BUCKET,
        Key : dir
    }

    const splitDir = dir.split("/")
    const fileName = splitDir[splitDir.length - 1]
    return s3.getObject(param, (err, data) => {
        if (err) throw err
        return new File(data.Body, fileName, { type: lookup(fileName) })
    })
}


export { upload, download }
export default upload

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
