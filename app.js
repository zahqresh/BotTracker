var express = require("express");
var app = express();
const isbot = require("isbot");
const mongoose = require('mongoose');
const shortid = require("shortid"); //unique id generator
const DeviceDetector = require("device-detector-js");
var axios = require("axios").default;
var platform = require('platform'); //get platform inforamtion
var useragent = require("express-useragent"); //get user browser data
const Bowser = require("bowser"); //To detect browser,type,os
var moment = require("moment"); // require
var db = require('./db');
//Connect database
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true},()=>{
  console.log('DB connected!');
});

//User agent middleware
app.use(useragent.express());
//when user visit the home page
// remove "/" and add any of your page to check for bots
app.get("/", (req, res) => {
  let user = req.useragent;
  if (isbot(req.get["user-agent"]) == true) {
    //get bot ip adress
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") {
      ip = ip.substr(7);
    }

    //Get bot's country,city,region,language
    axios
      .get(`https://ipapi.co/${ip}/json`) //need ip to replace with ${ip} before deploying
      .then((response) => {
        //Save data to the database
        new db({
          botId: shortid.generate(),
          date: moment().utc().format( "YYYY-MM-DD" ),
          ip: response.data.ip,
          country: response.data.country_name,
          region: response.data.region,
          city: response.data.city,
          languages: response.data.languages,
          type:platform.product,
          os: user.os,
          browser: user.platform,
        }).save()
        .then((doc)=>{
          console.log(platform);
          res.send(doc)
        })

      });

  }else{
      res.json({
          response:'This user is not a bot'
      });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on ${port}`));
