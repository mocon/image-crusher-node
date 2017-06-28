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
        Key: key
    };

    s3.getObject(params, (err, data) => {
        if (err) {
            const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
            console.log(message, err);
            callback(message);
        } else {
            function crush(buffer) {
                console.log('Attempting to crush file.');
                imagemin.buffer(buffer, {
                    plugins: [
                        imageminJpegtran(),
                        imageminPngquant({ quality: '65-80' })
                    ]
                }).then(file => {
                    const crushedFile = {
                        Body: file,
                        Bucket: params.Bucket,
                        Key: params.Key
                    };

                    console.log('Attempting to save crushed file.', 'crushedFile:', crushedFile);

                    s3.putObject(crushedFile, function(err, data) {
                        (err) ? console.log('There was an error during s3.putObject', err, err.stack) : console.log('s3.putObject successful', 'data:', data);
                    });
                }).catch(err => {
                    console.log('There was an error while crushing the file.', 'Error:', err);
                });
            }

            if (data.ContentType === 'image/jpg' || data.ContentType === 'image/png') {
                console.log('File is a jpg or png, attempting to crush.', 'data:', data);
                crush(data.Body); // buffer of file
            }

            callback(null, data.ContentType);
        }
    });
};
