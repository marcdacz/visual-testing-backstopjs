const args = require('yargs').argv;
const s3Methods = require('./s3Methods');

if (args.downloadRefPics) {
    s3Methods.downloadRefPics();
}

if (args.forceDownloadRefPics) {
    s3Methods.downloadRefPics(true);
}

if (args.uploadRefPics) {
    s3Methods.uploadRefPics();
}


