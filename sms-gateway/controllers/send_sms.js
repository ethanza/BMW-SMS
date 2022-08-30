const accountSid = 'AC5f7a34c940725f03533ac4de74cabd2c';
const authToken = 'e2cafc59d4c91cb983e3d2e628d382cd';
const twilioClient = require('twilio')(accountSid, authToken);
const uploadFile = require('../middelware/fileUpload');
const redXlsxFile = require('read-excel-file/node');
const { default: readXlsxFile } = require('read-excel-file/node');

const test = (req, res) => {
    debugger;
    twilioClient.messages
        .create({
            body: 'this is a test message',
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+27715359443'
        })
        .then(message => res.json(JSON.stringify(message)));
}

const test2 = async (req, res) => {
    try {
        // uploadFile(req, res);
        if (req.file == undefined) {
            return res.status(400).send({ message: 'Please upload file!' });
        }
        readFile(req.file.filename);
    } catch (error) {

    }
    return res.status(200).send({ message: 'sucessfully sent messages!' });
}

const readFile = (filename) => {

    let path = __basedir + 'public/resources/uploads/' + filename;

    let service_adviser;
    let contact_number;
    let time;
    let messageObject;

    readXlsxFile(path).then((rows) => {
        for (let index = 2; index < rows.length; index++) {
            let entry = rows[index];
            if (index === 2) {
                // service_adviser = entry.findIndex(getServiceAdvisor());
                // contact_number = entry.findIndex(getContactNumber());
                // time = entry.findIndex(getTime());
            } else {
                messageObject = {
                    from: '14155238886',
                    to: `${entry[3]}`,
                    body: `Dear Valued Client, thank you for booking your vehicle in at SMG Century City. Your vehicle is booked for tomorrow at ${entry[10]} with ${entry[11]}. To adhere to the current social distancing measures, we request that you please remain in your vehicle upon arrival until one of our SMG representatives assists you. Please ensure all valuables have been removed from your vehicle as well as all discarded masks and tissues prior to check-in and kindly note we are a cashless site. Our Shuttle Service is operational should you not be able to make arrangements for your own transportation. We look forward to welcoming you to the dealership. Stay Safe, Stay Healthy, Stay Sanitized`
                };
                sendMessage(messageObject);
                // sendScheduledMessage(messageObject);
            }
        }
    })
    // sendMessage(messageObject);

}

function getServiceAdvisor(lineItem) {
    return lineItem.toLower() === "service advisor";
}

function getContactNumber(lineItem) {
    return lineItem.toLower() === "contact number";
};
function getTime(lineItem) {
    return lineItem.toLower() === "time";
};

const sendMessage = (message) => {
    console.log(message);
    twilioClient.messages
        .create({
            body: message.body,
            from: `whatsapp:+${message.from}`,
            to: `whatsapp:+${message.to}`
        })
        .then(message => {
            res.status(200).send({
                message: res.json(JSON.stringify(message)),
            });
        });
}

const sendScheduledMessage = (message) => {
    console.log(message);
    twilioClient.messages
        .create({
            body: message.body,
            from: `whatsapp:+${message.from}`,
            to: `whatsapp:+${message.to}`,
            sendAt: new Date(Date.UTC(2022, 07, 29, 05, 30, 00)),
            scheduleType: 'fixed'
        })
        .then(message => {
            res.status(200).send({
                message: res.json(JSON.stringify(message)),
            });
        });
}

module.exports = { test2 };