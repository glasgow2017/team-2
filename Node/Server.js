var http = require("http");
var express = require("express");
var body-parser = require("body-parser");
var fs = require("fs");
MeaningCloudAPIKey = "";
fs.readFile("MeaningCloudAPIKey",function(err,data){
  if (err != null){
    MeaningCloudAPIKey = data;
  }
  else {
    exit(0);
  }
};);

app = express();

app.use(body-parser.json());

app.route('/text')
  .put(TopicExtraction);

app.listen(8042);

TopicExtraction(req,res){

}
