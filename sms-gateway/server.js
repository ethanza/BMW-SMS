const express = require('express'); //Import the express dependency
const routes = require('./routes');
const app = express();              //Instantiate an express app, the main work horse of this server
const cors = require('cors');
app.use(express.json());
app.use('/', routes);
app.use(cors());
const port = 5001;                  //Save the port number where your server will be listening
global.__basedir = __dirname + '/';

//Idiomatic expression in express to route and respond to a client request
// app.get('/', (req, res) => {        //get requests to the root ("/") will route here
//     res.sendFile('index.html', { root: __dirname });      //server responds by sending the index.html file to the client's browser
//     //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
// });

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`);
});
