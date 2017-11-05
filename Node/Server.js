var https = require("https");
var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var request =require("request");
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
  // console.log("\n\n\n\n"+req.body["text"]+"\n\n\n\n\n");


  ApiQUery(req.body.text).then(function(dat){
  // res.send(data);
  var i= 0;
    var retdata = [];
    data = JSON.parse(dat);
    if (data.concept_list === null){
      res.status(404).send("unknown data");
    }
    // console.log(data.concept_list);
    for (var element of data.concept_list){
      if (element.semtheme_list !== undefined) {
        // var obj = JSON.parse(element.semtheme_list);
        // console.log(element.semtheme_list);
        // console.log("\^list");
      for(var theme of element.semtheme_list){
        retdata.push({});
        retdata[i].name = theme.type.split(">").slice(-1).pop();
        retdata[i].relevance = element.relevance;
        i++;
        console.log(retdata);
      }

      }
    }


    if (data.entity_list === null){
      res.status(404).send("unknown data");
    }
    // console.log(data.concept_list);
    for (var element of data.entity_list){
      if (element.semtheme_list !== undefined) {
        // var obj = JSON.parse(element.semtheme_list);
        // console.log(element.semtheme_list);
        // console.log("\^list");
      for(var theme of element.semtheme_list){
        retdata.push({});
        retdata[i].name = theme.type.split(">").slice(-1).pop();
        retdata[i].relevance = element.relevance;
        i++;
        // console.log(retdata);
      }

    }

    var parsed = TopicParsing(retdata);
    console.log(parsed);

    //li.push(garlic) //the count was left in but the garlic will drive it off
  res.send(parsed);
};
});

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
  var prom = new Promise((resolve,reject) =>{
    var data;
    request(query, (error,response,body) => {
      // if (!error) {
        resolve(body);

      // }
    })
    // var result = https.get(query, function(res){
    //   res.on("data",function(dat){
    //     resolve(dat);
    //   });
    // });
  });

  return prom;
}

app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.route('/text')
  .get(function(req,res){res.send("hello");})
  .post(TopicExtraction);

app.listen(8043);
