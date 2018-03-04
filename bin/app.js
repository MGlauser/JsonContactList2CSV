var fs = require('fs');
var request = require('request');
var util = require('util');
var outFileName = 'contactList.csv';

request('http://www.dmr-marc.net/cgi-bin/trbo-database/datadump.cgi?table=users&format=json', function (error, response, body) {
  if (error) {
    console.log("ERROR: ", JSON.stringify(error));
    console.log("Exit");
  }else{
    console.log("Response status code:", JSON.stringify(response.statusCode));
    var result = JSON.parse(body);
    if (result && result.users) {
      var wstream = fs.createWriteStream(outFileName);
      var index = 0;
      result.users.forEach(user => {
        index += 1;
        // {"country":"United States","callsign":"WD6AYE","name":"Michael J","radio_id":"3116173","surname":"Glauser","state":"Idaho","city":"Coeur D Alene","remarks":"DMR"}
        var line = util.format('%d,%s,,%s %s,%s,%s,,"Private Call","None"\n', index, user.radio_id, user.callsign, user.name, user.city, user.state);
        wstream.write(line);
      });
      wstream.end();
      console.log("Written: ", outFileName);
    }
  }
});
