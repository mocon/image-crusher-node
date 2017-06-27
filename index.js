const fs = require('fs');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.crushImages = function(event, context, callback) {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };

    s3.getObject(params, (err, data) => {
        if (err) {
            console.log(err);
            const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
            console.log(message);
            callback(message);
        } else {
            const imagePath = params.Key; // Path to the image
            console.log('data:', data); // Remove this

            function crush(path) {
                console.log(`Attempting to crush file ${path}.`);
                imagemin([ path ], {
                    plugins: [
                        imageminJpegtran(),
                        imageminPngquant({ quality: '65-80' })
                    ]
                }).then(file => {
                    console.log(`Attempting to save crushed file to ${params.Key}.`);

                    const crushedFile = {
                        Body: file.data,
                        Bucket: params.Bucket,
                        Key: params.Key
                    };

                    // Save crushed file to S3
                    s3.putObject(crushedFile, function(err, data) {
                        if (err) console.log(err, err.stack); // an error occurred
                        else console.log(data); // successful response
                    });

                    console.log(file);
                }).catch(err => {
                    console.log(`There was an error crushing file ${path}.`);
                    console.log('Error:', err);
                });
            }

            if (data.ContentType === 'image/jpg' || data.ContentType === 'image/png') {
                console.log('File is a jpg or png, attempting to crush.');
                crush(imagePath)
            }

            callback(null, data.ContentType);
        }
    });
}
