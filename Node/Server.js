var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
MeaningCloudAPIKey = "";
fs.readFile("MeaningCloudAPIKey",function(err,data){
  if (err === null){
    MeaningCloudAPIKey = data;
  }
  else {
    console.log(err+"exiting...")
    process.exit(0);
  }
});

TopicExtraction = function(req,res){
  data  = ApiQUery(req.body.text);
  res.send(data);
}

ApiQUery = function(text){
  query = "https://api.meaningcloud.com/topics-2.0?key="+
  MeaningCloudAPIKey+
  "&of=json&lang=en&ilang=en&txt="+
  text+
  "&tt=a&uw=y";

  return http.get(query);
}

app = express();

app.use(bodyParser.json());

app.route('/text')
  .put(TopicExtraction);

app.listen(8042);
