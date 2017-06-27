const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

const TEMP_SAMPLE_IMAGE = '/Users/myles/Documents/Repos/image-crusher-node/images/originals/sample.png';

(function() {
    const imagePath = TEMP_SAMPLE_IMAGE; // Path to the image
    const imageExtension = imagePath.substr(imagePath.length - 3);

    function crush(path) {
        imagemin([ path ], 'images/crushed', { // Where to save crushed file
            plugins: [
                imageminJpegtran(),
                imageminPngquant({ quality: '65-80' })
            ]
        }).then(file => {
            console.log(file);
        }).catch(err => {
            console.log('Error:', err);
        });
    }

    (imageExtension === 'jpg' || imageExtension === 'png')
        ? crush(imagePath)
        : console.log("File is not of type '.jpg' or '.png'.");
}());
