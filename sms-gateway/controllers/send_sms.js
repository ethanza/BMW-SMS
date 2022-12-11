const { accountSid, authToken, number } = require("../config/config");
const twilioClient = require("twilio")(accountSid, authToken);
// const readXlsxFile = require('read-excel-file/node');
const xlsx = require("xlsx");
const { default: readXlsxFile } = require("read-excel-file/node");
const messages = [];


const upload = async (req, res) => {
  try {
    // uploadFile(req, res);
    if (req?.file?.buffer == undefined) {
      return res.status(400).send({ message: "Please upload file!" });
    }
    // readFile(req.file.filename);
    const file = req.file.buffer;
    await createMessage(file);
  } catch (error) { }
  return res
    .status(200)
    .send({ message: "sucessfully sent messages!", messages });
};

const createMessage = async (file) => {
  const workbook = xlsx.read(file);
  const sheet_name_list = workbook.SheetNames;
  const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  let service_adviser = "";
  let contact_number = "";
  let time = "";

  if (xlData) {
    for (let i = 2; i < xlData.length; i++) {
      service_adviser = xlData[i].__EMPTY_10;
      contact_number = xlData[i].__EMPTY_2;
      time = formatTime(xlData[i].__EMPTY_9);
      messageObject = {
        from: number,
        to: contact_number,
        body: `Dear Valued Client, this message serves to confirm your booking for Monday at ${time} with ${service_adviser}. Kindly ensure all valuables have been removed prior to check-in and note that we are a cashless site. Our complimentary shuttle service has been scaled down, operating various routes within the immediate area and surrounds. Please note the shuttle service commences at 8am sharp. All clients requiring urgent transportation are recommended to make use of alternate transport methods such as Uber to avoid unnecessary disappointments. We kindly request that your vehicle be sufficiently fuelled for testing purposes. BMW Century City look forward to welcoming you and thank you for your continued support.`,
      };
      //  messageObject = {
      //     from: number,
      //    to: contact_number,
      //    body: `Dear Valued Client, this message serves to confirm your booking at ${time} tomorrow with ${service_adviser}. Kindly ensure all valuables have been removed prior to check-in and note that we are a cashless site. Our complimentary shuttle service has been scaled down, operating various routes within the immediate area and surrounds. Please note the shuttle service commences at 8am sharp. All clients requiring urgent transportation are recommended to make use of alternate transport methods such as Uber to avoid unnecessary disappointments. We kindly request that your vehicle be sufficiently fuelled for testing purposes. BMW Century City look forward to welcoming you and thank you for your continued support.`,
      //   };
      messages.push(messageObject);
      sendMessageViaWhatsapp(messageObject);
      sendScheduledMessageViaWhatsapp({
        service_adviser,
        contact_number,
        time,
      });
    }
  }
};

const sendMessageViaWhatsapp = (message) => {
  twilioClient.messages
    .create({
      body: message.body,
      from: `whatsapp:+${message.from}`,
      to: `whatsapp:+27${message.to}`,
    })
    .then((message) => {
      res.status(200).send({
        message: res.json(JSON.stringify(message)),
      });
    });
};

const sendMessageViaSMS = (message) => {
  twilioClient.messages
    .create({
      body: message.body,
      to: `+27${message.to}`,
      from: number,
    })
    .then((message) => {
      res.status(200).send({
        message: res.json(JSON.stringify(message)),
      });
    });
};

async function sendScheduledMessageViaWhatsapp(message) {
  try {
    const { service_adviser, time, contact_number } = message;

    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const tomorrow = new Date().getDate() + 1;
    const monday = new Date().getDate() + 3;

    // const sendWhen = new Date(Date.UTC(year, month, tomorrow, 4, 0, 0));
    const sendWhen = new Date(Date.UTC(year, month, monday, 4, 0, 0));

    const messageSend = await twilioClient.messages
      .create({
        from: "MGba88b9e788a7a4d255f389c177bc89c8",
        body: `Dear Valued Client, a friendly reminder of your booking today at ${time} with ${service_adviser}. Kindly ensure all valuables have been removed prior to check-in and note that we are a cashless site. Our complimentary shuttle service has been scaled down, operating various routes within the immediate area and surrounds. Please note the shuttle service commences at 8am sharp. All clients requiring urgent transportation are recommended to make use of alternate transport methods such as Uber to avoid unnecessary disappointments. We kindly request that your vehicle is sufficiently fuelled for testing purposes. BMW Century City look forward to welcoming you and thank you for your continued support. Warm Regards,`,
        sendAt: sendWhen.toISOString(),
        scheduleType: "fixed",
        to: `whatsapp:+27${contact_number}`,
      })
      .then((message) => {
        console.log(message);
      });
  } catch (error) {
    console.log(error);
  }
}

const formatTime = (data) => {
  try {
    let timestamp = parseFloat(data);
    if (isNaN(timestamp)) {
      return;
    }
    let stringTime = timestamp.toString();
    stringTime = stringTime.replace(",", ":");
    stringTime = stringTime.replace(".", ":");

    if (
      stringTime.substring(2).length > 0 &&
      stringTime.substring(2).length < 2
    ) {
      stringTime = stringTime.substring(0, 2) + stringTime.substring(2) + "0";
    }
    return stringTime;
  } catch (error) { }
};

module.exports = { upload };
