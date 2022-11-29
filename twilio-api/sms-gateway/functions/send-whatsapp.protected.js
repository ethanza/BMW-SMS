exports.handler = function (context, event, callback) {
    try {
        // debugger;
        console.log("contex", context, "event", event, "callback", callback)
        console.log(event?.file);
    } catch (error) {

    }

    // create(context, event, callback);
    const response = new Twilio.Response(200);
    return callback(null, response);
}

async function create(context, event, callback) {
    const twilioClient = context.getTwilioClient();

    const from = event.From;
    const to = event.To;
    const body = event.Body;

}