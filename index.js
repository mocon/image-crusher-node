const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

const imagePath = process.argv[2];
const imageExtension = imagePath.substr(imagePath.length - 3);

function crush(path) {
    imagemin([ path ], 'images/crushed', {
        plugins: [
            imageminJpegtran(),
            imageminPngquant({quality: '65-80'})
        ]
    }).then(file => {
        console.log(file);
    }).catch(err => {
        console.log('Error:', err);
    });
}

(imageExtension === 'jpg' || imageExtension === 'png') ? crush(imagePath) : console.log("File is not of type '.jpg' or '.png'.");
