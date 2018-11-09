// Credentials and S3 Details
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const BUCKET = process.env.BUCKET;

// Import the Amazon S3 service client
const S3 = require('aws-sdk/clients/s3');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const md5File = require('md5-file');
const rootDir = path.resolve(__dirname, '..');
const refPicsDir = `${rootDir}/reference_images/`;
const checkSumFile = `${refPicsDir}/checkSumFile.json`;

let s3;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const connectToS3 = () => {
    s3 = new S3({
        apiVersion: '2006-03-01',
        region: 'ap-southeast-2',
        credentials: {
            "accessKeyId": ACCESS_KEY_ID,
            "secretAccessKey": SECRET_ACCESS_KEY
        }
    });
};

const createFolderStructure = (key) => {
    let folder = `${key.substring(0, key.lastIndexOf('/'))}`;
    if (!fs.existsSync(folder)) {
        console.log(`Create folder: "${folder}"`);
        mkdirp.sync(folder);
    }
};

const getAllS3Objects = () => {
    return new Promise((resolve, reject) => {
        s3.listObjects({ Bucket: BUCKET }, (err, data) => {
            resolve(data.Contents);
        });
    });
};

const getObject = (key) => {
    return new Promise((resolve, reject) => {
        if (key.indexOf('.png') > 0) {
            createFolderStructure(key);
            s3.getObject({ Bucket: BUCKET, Key: key })
                .createReadStream()
                .pipe(fs.createWriteStream(key));
            resolve();
        }
    });
};

const putObject = (filePath, key) => {
    return new Promise((resolve, reject) => {
        if (key.indexOf('.png') > 0) {
            s3.putObject({
                Bucket: BUCKET,
                Key: key,
                Body: fs.createReadStream(filePath)
            }, (err, data) => {
                if (err) {
                    reject();
                } else {
                    resolve(data.ETag);
                }
            });
        }
    });
};

const getLocalRefPicsChecksum = (dir, result = []) => {
    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.resolve(dir, file);
        const fileStats = { file, path: filePath };

        if (fs.statSync(filePath).isDirectory()) {
            return getLocalRefPicsChecksum(filePath, result)
        }

        if (file.indexOf('.png') > 0) {
            fileStats.checksum = `"${md5File.sync(filePath)}"`;

            let refPicFileName = filePath.replace(rootDir, '');
            let refPicKey = refPicFileName.replace(/\\/g, '/').substr(1);;

            fileStats.key = refPicKey;
            result.push(fileStats);
        }
    });

    fs.writeFileSync(checkSumFile, JSON.stringify(result));
};

const downloadRefPics = async (forceDownload = false) => {
    console.log('DOWNLOADING REFERENCE PICTURES TO S3...');
    connectToS3();
    getLocalRefPicsChecksum(refPicsDir);
    let localRefPicsList = require(checkSumFile);
    let s3RefPicsList = await getAllS3Objects();
    let newRefPicsList = [];
    for (let refPic of s3RefPicsList) {
        let localRefPics = localRefPicsList.filter((item) => item.key === refPic.Key);
        if (localRefPics.length > 0) { // UPDATED ITEM IN S3
            let localRefPic = localRefPics[0];
            if (localRefPic.checksum != refPic.ETag) {
                newRefPicsList.push(refPic);
            }
        } else { // NEW ITEM NOT IN LOCAL
            newRefPicsList.push(refPic);
        }
    }

    if (newRefPicsList.length > 0) {
        console.log(newRefPicsList.map((item) => item.Key));
        if (forceDownload) {
            await downloadNewRefPics(newRefPicsList);
            rl.close();
        } else {
            rl.question('Are you sure you want to download reference pictures? ', async (answer) => {
                if (answer.match(/^y(es)?$/i)) {
                    await downloadNewRefPics(newRefPicsList);
                }
                rl.close();
            });
        }
    } else {
        rl.close();
    }
};

const downloadNewRefPics = async (newRefPicsList) => {
    for (let newRefPic of newRefPicsList) {
        console.log(`Downloading ${newRefPic.Key}`)
        await getObject(newRefPic.Key);
    }
}

const uploadRefPics = async () => {
    console.log('UPLOADING REFERENCE PICTURES TO S3...');
    connectToS3();
    getLocalRefPicsChecksum(refPicsDir);
    let localRefPicsList = require(checkSumFile);
    let s3RefPicsList = await getAllS3Objects();
    let newRefPicsList = [];
    for (let refPic of localRefPicsList) {
        let s3RefPics = s3RefPicsList.filter((item) => item.Key === refPic.key);
        if (s3RefPics.length > 0) { // UPDATED ITEM IN LOCAL
            let s3RefPic = s3RefPics[0];
            if (s3RefPic.ETag != refPic.checksum) {
                newRefPicsList.push(refPic);
            }
        } else { // NEW ITEM NOT IN S3
            newRefPicsList.push(refPic);
        }
    }

    if (newRefPicsList.length > 0) {
        console.log(newRefPicsList.map((item) => item.path));
        rl.question('Are you sure you want to upload reference pictures? ', async (answer) => {
            if (answer.match(/^y(es)?$/i)) {
                for (let newRefPic of newRefPicsList) {
                    console.log(`Uploading ${newRefPic.key}`)
                    await putObject(newRefPic.path, newRefPic.key);
                }
            }
            rl.close();
        });
    } else {
        rl.close();
    }
};

module.exports = {
    downloadRefPics,
    uploadRefPics
};
