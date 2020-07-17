var express = require("express");
var app = express();
const isbot = require("isbot");
const shortid = require("shortid"); //unique id generator
const DeviceDetector = require("device-detector-js");
var axios = require("axios").default;
var platform = require('platform'); //get platform inforamtion
var useragent = require("express-useragent"); //get user browser data
const Bowser = require("bowser"); //To detect browser,type,os
var moment = require("moment"); // require
//User agent middleware
app.use(useragent.express());
app.get("/", (req, res) => {
  let user = req.useragent;
  if (isbot(req.get["user-agent"]) == false) {
    //get bot ip adress
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") {
      ip = ip.substr(7);
    }

    //Get bot's country,city,region,language
    axios
      .get(`https://ipapi.co/${ip}/json`) //need ip to replace with ${ip} before deploying
      .then((response) => {
        res.json({
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
        });
      });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on ${port}`));
