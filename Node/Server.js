var https = require("https");
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
  console.log("\n\n\n\n"+req.body.text+"\n\n\n\n\n");

  var data  = ApiQUery(req.body.text);
  var i= 0;
    var retdata = [];
    if (data.entity_list === null){
      res.status(404).send("unknown data");
    }
    for (var element of data.entity_list){
      if (element.semtheme_list !== null) {
        for(var theme of element.semtheme_list){
          retdata.push({});
          retdata[i].name = theme.type.split(">").slice(-1).pop();
          retdata[i].relevance = element.relevance;
          i++;
        }

      }
    }
    var parsed = TopicParsing(retdata);
    //li.push(garlic) //the count was left in but the garlic will drive it off
  res.send(parsed);
}

TopicParsing = function(topics){
  var li = [];
  var k = 0;
  for(var topic of topics){
    var spot = listCheck(li,topic.name);
    if ( spot >= 0) {
      li[spot].count++;
      if (li[spot].relevance < topic.relevance) {
        li[spot].relevance = topic.relevance;
      }
    }
    else {
      li.push({});
      li[k].name = topic.name;
      li[k].count = 1;
      li[k].relevance = topic.relevance;
      k++;
    }
  }
  maxCount = findMaxCount(li);
  for(var element of li){
    element.relevance =  element.relevance / (maxCount+1 - element.count) / 100;
  }
  return li;
}

findMaxCount = function(li){
  var max = {count:"-10000",name:"unknown",relevance:"0"};
  for(var element of li){
    if (element.count > max.count) {
      max = element;
    }
  }
  return max.count;
}

listCheck = function(list, name){
  for (var j = 0; j < list.length; j++) {
    if (list[j].name === name) {
      return j;
    }
  }
  return -1;
}


ApiQUery = function(text){
  query = "https://api.meaningcloud.com/topics-2.0?key="+
  MeaningCloudAPIKey+
  "&of=json&lang=en&ilang=en&txt="+
  text+
  "&tt=a&uw=y";

  var result = https.get(query)
  console.log(result);
  return result;
}

app = express();

app.use(bodyParser.json());

app.route('/text')
  .get(function(req,res){res.send("hello");})
  .post(TopicExtraction);

app.listen(8042);
