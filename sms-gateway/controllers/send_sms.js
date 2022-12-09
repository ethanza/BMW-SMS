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
  } catch (error) {}
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
      // messageObject = {
      //     from: number,
      //     to: contact_number,
      //     body:`Dear Valued Client, this message serves to confirm your booking for Monday at ${time} with ${service_adviser}. Kindly ensure all valuables have been removed prior to check-in and note that we are a cashless site. Our complimentary shuttle service has been scaled down, operating various routes within the immediate area and surrounds. Please note the shuttle service commences at 8am sharp. All clients requiring urgent transportation are recommended to make use of alternate transport methods such as Uber to avoid unnecessary disappointments. BMW Century City look forward to welcoming you and thank you for your continued support. Warm Regards,`
      // };
      messageObject = {
        from: number,
        to: contact_number,
        body: `Dear Valued Client, this message serves to confirm your booking at ${time} tomorrow with ${service_adviser}. Kindly ensure all valuables have been removed prior to check-in and note that we are a cashless site. Our complimentary shuttle service has been scaled down, operating various routes within the immediate area and surrounds. Please note the shuttle service commences at 8am sharp. All clients requiring urgent transportation are recommended to make use of alternate transport methods such as Uber to avoid unnecessary disappointments. BMW Century City look forward to welcoming you and thank you for your continued support. Warm Regards,`,
      };
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
    const sendWhen = new Date(Date.UTC(year, month, tomorrow, 4, 0, 0));

    const messageSend = await twilioClient.messages
      .create({
        from: "MGba88b9e788a7a4d255f389c177bc89c8",
        body: `Dear Valued Client, a friendly reminder of your booking today at ${time} with ${service_adviser}. Kindly ensure all valuables have been removed prior to check-in and note that we are a cashless site. Our complimentary shuttle service has been scaled down, operating various routes within the immediate area and surrounds. Please note the shuttle service commences at 8am sharp. All clients requiring urgent transportation are recommended to make use of alternate transport methods such as Uber to avoid unnecessary disappointments. BMW Century City look forward to welcoming you and thank you for your continued support. Warm Regards,`,
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
  } catch (error) {}
};

const cancel = () => {
  const ids = [
    "SM57b6f37f305c9126477cba2d437bf317",
    "SM66b538eef7120e41ffe927b068d92c23",
    "SM403fcd45dbe584be3f626032eb1fa751",
    "SMe670af320a7f0e9b7e14039235a3891c",
    "SM16ba14837b812c19a2c984da8a9988fd",
    "SMea55b0538f0b9f25481b89da353d2792",
    "SM9d206ab79df4bc14ac7458430d79fcef",
    "SM68050dffd8aa1e97e1fde6278e3e1947",
    "SMab739e3e750581b2ecc014afc5334586",
    "SM757bf717bf8b57be4f652fb28b5adf29",
    "SMe7a3f191cb66cc7b9d688919a15d27ae",
    "SM4c5582bb16d0e8039a15010b43c32727",
    "SM5871cbeece1ad4a6248141822fb57f29",
    "SM4ef6fd32d856d2b4f2f88bea9527fa8a",
    "SMd7cd7935869c71474a4b62af75a14b35",
    "SMf1c68a70f39090a81b0056dd9f71b1ae",
    "SM7d5d4f3c6d0825e034e7050505f50e44",
    "SM8c29bcb196eccba9e4ed33bc1ee13a84",
    "SM3846ea0a33d3cf986321a30e68544028",
    "SM2a53474b2e24648cdf990baacdbe4ef8",
    "SM8c415570b7a57d5007eaa526d1526e66",
    "SM7a2ecd551c890d2216f9913a35998f78",
    "SM2f40490f0422c07d69ea9acd4ef38194",
    "SM34ce44036f7aa1dec9b06950a134271f",
    "SM1334bbb0b289c4d8712af79234f4a06b",
    "SM9c1d3970d948a294636fe4256e86a67b",
    "SMc1a1ab597fe6730581f2c5b6c421dbbd",
    "SMb040555eaab9164e08b1f18693e07a93",
    "SM983590f88fc5b922d50ca924b2ca8cde",
    "SM04f5a6ebfbe74424e83d3323a72c3ae7",
    "SM93b5c1daa1a4e093864178ab070c3d35",
    "SM25bff4e105a78a1e7623ef2191b700ea",
    "SM649eafbeae29777c1e017a834b60a824",
    "SMd5264c6cdd8f8d206c309e256c02272d",
    "SM6a057c9357d9a82bf6529f5522a9bdc5",
    "SM20593aa2f05895095f335e5cc75403f8",
    "SM5a5e618f7d43afbbb0d39192284c8ab0",
    "SM9327153808b7af72c41dbe6675f26dd5",
    "SM431c0efa6cd836772e7180648e87318f",
    "SM1e265d9da8d064d27add3216bd0aa03e",
    "SMabc6a3101d11c1f6409234ef702152b7",
    "SM7dacd2bca3737ed9abc22a0dc70d8b9f",
    "SM65d1b56979704376c455934b7a9aa7f5",
    "SMf66f6d5e303efd9adf5f887055ce4c8c",
    "SM612691c7fa0edbebaf832d0187ef099a",
    "SM4cf0edd763551479b9e0dd50cf77681a",
    "SMeeec37be70329dd86300be812d39f706",
    "SM9eb80a6800497a68a9233e916ad61d4a",
    "SM61846b15111cc047a74ea95468911496",
    "SM7e489f1736d35a4652dab327630c879d",
    "SM97e70e5482dc51cc01c9a23ac8b5bcf7",
    "SMfb10c9c5c10c7556962c254b4af2b0b7",
    "SM43420cf8bf59dd18137e945a3ef46929",
    "SM58c5316753dcd8308074aaa3fabf7e57",
    "SM15680d3c5d406f5fc931b01c8fa01bb5",
    "SM2947b7ceaf99012cd3df50e518d88228",
    "SM6012325cf0af0283bf15493ffa4cb069",
    "SMdb592439aef836ec15ec831667de2b3f",
    "SMc5f44bb33e4c6142404466c590d06fde",
    "SMf91829177779b762569b8b446b5674aa",
    "SMfceea0e437bfb67046d86148f7eaeb55",
    "SM933137d217b705521e55b8529e9ce147",
    "SM5ae6ffb04db546d85ce547999a27ebff",
    "SMe4616a7ec5bea202dcaad1c94008673b",
    "SM20724088b8698790358aff914166022a",
    "SM0ffd349a232ad45ae0ce07f3424a4e32",
    "SM1819cd5ec6b3e40f36a58299b494f77a",
    "SMcbf25130bb69956d9476b7a2f5cab8be",
    "SM7dd0a8ddf93573905ff64f14e75f0330",
    "SM353de4bd1d69de786d75766c166cb843",
    "SM67b1e7023ec9ce4f58b0caba15b81add",
    "SM6eea2a4522dff91849efa24bb71fdf98",
    "SM7a2d801611ddc2365e9121e784b405aa",
    "SM37162ceca7aadc1ff476ec64349435b3",
    "SM4f606f49526fd23b2798031bf65e1958",
    "SM127c399a9ad5a4c604a8e130cb525dcf",
    "SMc5e620fa6eb3b40c032e7d1e6c952f7d",
    "SM91d9697acc699a7195e840c04c74327d",
    "SM1e94bd10dd43991da2f9f92e005bc806",
    "SMe44b42b4eb194edb96dcef96441a8959",
    "SM4a6c17c048ba890d0e55cc403e93c0dc",
    "SMcd7ba694bee4a5ae66a287bc08ea24e3",
    "SM76d54fc96f73f3d8092928f74f7e686c",
    "SM47ae4364367d34b9db8acbed5af1a378",
    "SMbb09ccab47c3f38ec9b3584dc89d9fde",
    "SMa6470390f895c13a77d3a1dde4d2a840",
    "SM8fb7b709b59cc7153d7a061b6d571950",
    "SM1613cdfb82e1153192d7c759b28cf72a",
    "SMac62148d58c6b69b3655ecb635dc8504",
    "SM06c5a2abc65d1a86b4a4434006532173",
    "SM795201cf2595509e31e4482a911f4b22",
    "SMf2330e55c8e10dcc5a4e032f1676f845",
    "SM0e0c525af748b8a33fbb8928cacd6f8b",
    "SMa8b24703bef5818b9229b4f5d234a54a",
    "SMbf53d32a6e68ffdc1b8b37161a8f419b",
    "SMcf1a5038d0e19d3c63efbde1188c043c",
    "SM21d35e5c2bd64b3fffc4e07abdbdfec2",
    "SM08d45c0e761e3e702e0e635e0601c637",
    "SMbcbb4094b45c4258078667632e1fa6a3",
    "SMa6997a10f93298d286f37d88884a98d0",
    "SM1809e5126d99bd7e39e75f69e13d44e0",
    "SM057b067fad7ea57fe8127cea657f7f1b",
    "SM4eef67f8a6d84daaea5e6c5350e4939f",
    "SM05dd41c9f80369808f7ea2374f512fc9",
    "SMacab9c28f7f15864ede03310ff404d58",
    "SM2ef3431cd79b14f3efb826026169a251",
    "SM168ab31cbb27e434f5f832ee286c238c",
    "SMea1a75ae0348a8e475ade16a15198dcf",
    "SMe3707117d2b4c689895eaef260f88fc1",
    "SMf263d6247859e986bf54b3e56c98ba6b",
    "SM8e24daf3e6b4f41047ee07ef061e6385",
    "SMa22141a202b6eaeb4e92108ce56b413d",
    "SM48a9c375cf20f50778f6c0ca7fa1f7e7",
    "SMf22fac6d43c8c0d2b960f5b5fca44dd0",
    "SM19ad7d0dd34ae160caf94053c9de87e3",
    "SM940284c0913e01aa48ccd69fa937970a",
    "SM17aeb3de5cbc185f1784dbf66497473c",
    "SMfe9e429bf9d9d86e02785db86f95b207",
    "SM0b5aadcfb9690457dfede4cee7b57950",
    "SM916cf459f5bb81ab475607f00b3a1c2a",
    "SM986fa645cb774b06dbfb247c6ab01fb7",
    "SM5f8c810d28d8233b35b87bab5050b50d",
    "SM5e3b77fd181755de0b43de9fff8d04fe",
    "SM3cd6108d6f372a989a103ef70a9da713",
    "SM95ab2ecc5f8278a02ea00023bf4438d8",
    "SMee485f8c13c463f06d3399006a48a5a0",
    "SM1208f965b2e5099d20eab64a4e03d836",
    "SMdd93423cbcb9b3ddf67f1b83c40f6b7a",
    "SM20d6164dece77beadabb44b4258b941c",
    "SMefa53babf8e722ff7c230a0d92a8bef4",
    "SM3e8ce227b3171db4410362c0f8c6d324",
    "SM08689b315f8657a5aa20617038c8127d",
    "SMb4f36904db49bbbd87df5064bcf77787",
    "SM566f71d21b71b114054eb6d2ea051b9d",
    "SMae16d91d317d283f9237b0d2f97afe51",
    "SM33dcc4282e4f3a6399d9ec71e263498a",
    "SMeeafd4bae10cec7e98e3be5bee98645d",
    "SM195f6b09fd5edc93ec5237995e4733b8",
    "SM6f6adfd6698340bafa6dd0b234ac7087",
    "SM7195ae2d97140bc3b971c0c6165c6152",
    "SMd3a717b15e1658b8f1329eb2da43bbac",
    "SM48528529ebb88a9b3402b2d5f466bff7",
    "SMca49a567622e731b6a981c8a25d1a73d",
    "SM714d0af566ea89b66b63cd3a761685a8",
    "SMfc156c3f240f07f30d2aa822f48d301a",
    "SM696774d82a08ef759edd40e95e2b92da",
    "SM512dec5a4945812c3e7d3da292c1bf88",
    "SM6d9a300c874fe81f553d1f721e3187bd",
    "SM2498ceade0da04a58c87db9fa9bc71ed",
    "SM76df939015cb67f274531ca11a836f83",
    "SMf526fd331254a63c3b66757b4ae150fa",
    "SM32f9092dbf94803653c8ef8f4c6e97b4",
    "SMf4eff4f98f7f66dcf1f423628e6297a3",
    "SM0ad7b04409c3fab199acc8c86d716b61",
    "SM24603170b29eae859eefb1c73dcd53e3",
    "SMf316abdea16fc351536f826c0f028caf",
    "SMc0f33aa3a1e926e77ec58bc8e86ffb7f",
    "SMf96940bb446444223b2c6840063c6435",
    "SMc4235a6cd6973f2562419a215525ab92",
    "SM470cecdf777940fda37e441689cebf8a",
    "SMb050c784d92de392470035d0b3e57174",
    "SMefdbff05b2385a91d863da8c5efaa297",
    "SM1686d65e06ea317216eafd3404878c52",
    "SM4ba8b8b097d113438e770728847b406d",
    "SM5007eb8226e256668d8a59d6aed40516",
    "SMb1140ead83a6dc98f39fda4ad22821fb",
    "SM78c85273a28124e7668eed7a202e72cf",
    "SM1b7f9fb3c34226c69d0829c8ea0d8cd0",
    "SM37584674bef38b9fd0eca4415f4d7d81",
    "SMf612c467be06c605375e0c657d94f4ad",
    "SMb50d9fd44522192d474db9d3859986e4",
    "SMcf7747896c0bf49fd1757e44c29fc2ea",
    "SMec8ab57b0f216facff82173fd1cd7cb9",
    "SM02b9465e5ba3d5bff158c9f34ed46fc8",
    "SMe53fea081d56ec72cb8d520fd96d9410",
    "SMaff1b9c2cc7594cc1fadb049c904e5c8",
    "SM86b1111879e86e0a63f9242e05687964",
    "SM4db34987609d8ca693c2df738354f608",
    "SMdff3ecb3a9a5b1169f3aed5622eb0881",
    "SM8ccf06d29f36b0a285188ece5a080290",
    "SM6908400af9850b06e26765db2f409360",
    "SMff6a383389ac1226cd95cd36c8dd862a",
    "SMecf39cb3be6ba3670b436d8f43fef37a",
    "SM50762eacd7ffb1166d491bce4e85aa53",
  ];
  for (let index = 0; index < ids.length; index++) {
    twilioClient
      .messages(ids[index])
      .update({ status: "canceled" })
      .then((message) => {
        console.log(message);
        res.status(200).send({
          message: res.json(JSON.stringify(message)),
        });
      });
  }
};
module.exports = { upload, cancel };
