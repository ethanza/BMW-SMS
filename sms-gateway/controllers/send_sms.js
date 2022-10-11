const { accountSid, authToken, number } = require('../config/config')
const twilioClient = require('twilio')(accountSid, authToken);
// const readXlsxFile = require('read-excel-file/node');
const xlsx = require('xlsx');
const { default: readXlsxFile } = require('read-excel-file/node');
const messages = [];

const upload = async (req, res) => {
    try {
        // uploadFile(req, res);
        if (req?.file?.buffer == undefined) {
            return res.status(400).send({ message: 'Please upload file!' });
        }
        // readFile(req.file.filename);
        const file = req.file.buffer;
        await createMessage(file);
    } catch (error) {

    }
    return res.status(200).send({ message: 'sucessfully sent messages!', messages });
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

const createMessage = async (file) => {

    const workbook = xlsx.read(file);
    const sheet_name_list = workbook.SheetNames;
    const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    let service_adviser = '';
    let contact_number = '';
    let time = '';

    if (xlData) {
        for (let i = 2; i < xlData.length; i++) {
            service_adviser = xlData[i].__EMPTY_10;
            contact_number = xlData[i].__EMPTY_2;
            time = xlData[i].__EMPTY_9;

            messageObject = {
                from: number,
                to: contact_number,
                body: `Dear Valued Client, thank you for booking your vehicle in at SMG Century City. Your vehicle is booked for tomorrow at ${time} with ${service_adviser}. To adhere to the current social distancing measures, we request that you please remain in your vehicle upon arrival until one of our SMG representatives assists you. Please ensure all valuables have been removed from your vehicle as well as all discarded masks and tissues prior to check-in and kindly note we are a cashless site. Our Shuttle Service is operational should you not be able to make arrangements for your own transportation. We look forward to welcoming you to the dealership. Stay Safe, Stay Healthy, Stay Sanitized`
            };
            console.log(messageObject);
            messages.push(messageObject);
            console.log(twilioClient);
            sendMessageViaSMS(messageObject);
        }
    }
}

const sendMessageViaWhatsapp = (message) => {
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

const sendMessageViaSMS = (message) => {
    twilioClient.messages
        .create({
            body: message.body,
            to: `+${message.to}`,
            from: number
        }).then(message => {
            res.status(200).send({
                message: res.json(JSON.stringify(message))
            });
        });
}

module.exports = { upload };