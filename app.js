var fs = require('fs');
var request = require('request');
var util = require('util');


// Read Config
fs.readFile('config.json', 'utf8', function (err, data) {
  var config = JSON.parse(data);
  console.log("Reading: " + config.url);

  if (err) throw err;
  // Fetch JSON contact list from dmr-marc
  request(config.url, function (error, response, body) {
    if (error) {
      console.log("ERROR: ", JSON.stringify(error));
      console.log("Exit");
    } else {
      console.log("Response status code:", JSON.stringify(response.statusCode));
      var result = JSON.parse(body);
      if (result && result.users) {
        console.log("Writing: " + config.outFileName);
        var wstream = fs.createWriteStream(config.outFileName);
        // Write header:
        wstream.write('"No.","Radio ID","Callsign","Name","City","State","County","Remarks","Call Type","Call Alert"\r\n');
        var index = 0;
        result.users.forEach(user => {
          index += 1;
          // {"country":"United States","callsign":"WD6AYE","name":"Michael J","radio_id":"3116173","surname":"Glauser","state":"Idaho","city":"Coeur D Alene","remarks":"DMR"}
          // "No.","Radio ID","Callsign","Name","City","State","County","Remarks","Call Type","Call Alert"
          var line = util.format('"%d","%s","","%s %s","%s","%s","","","Private Call","None"\r\n', index, user.radio_id, user.callsign, user.name, user.city, user.state);
          wstream.write(line);
        });
        wstream.end();
        console.log("Done.");
      }
    }
  });
});
