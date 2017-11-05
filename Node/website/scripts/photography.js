var imgList = ["A yellow house at the end of the street", "clouds in a blue sky", "Terraced houses on a blue sky day", "A close up image of pine needles", "An image of Keep calm and love canada",
"man with a crazy face"];
var currentImg = imgList[0];

var imgsPath = "img/testing/"

var imgExtn = ".jpg"



window.onload = function() {

  preloadImgs();

  buildSpread();

}



/*Thumbnail Creation*/

function buildSpread() {

  for(var i = 0; i < imgList.length; i++){

    buildThumb(imgsPath + imgList[i] + imgExtn, imgList[i]);

  }

  document.getElementById('thumbs').appendChild(document.createElement("br"));

}



function buildThumb(imgSrc, imgName) {

  var thumb = document.createElement("div");

  var content = document.createElement("img");

  content.id = "thumb";

  content.src = imgSrc;

  content.alt = imgName;

  thumb.appendChild(content);



  var thumbsDiv = document.getElementById('thumbs');

  thumbsDiv.appendChild(thumb);

}



/*Image Preloading*/

var images = new Array();

function preloadImgs(){

  for(var i = 0; i < imgList.length; i++){

    images[i] = new Image();

    images[i].src = imgsPath + imgList[i] + imgExtn;

  }

  console.log("Images preloaded.");

}



/*Page Turning + Full Screen Functions*/

/*Key Stroke Detecting*/

document.onkeydown = function(evt) {

    var key = evt.keyCode;

    if(key == 37){

        GoLeft();

    } else if (key == 39){

        GoRight();

    } else if (key == 70) {

        if ((document.fullScreenElement && document.fullScreenElement !== null) ||

       (!document.mozFullScreen && !document.webkitIsFullScreen)) {

         FullScreen();

       } else {

         ExitFullScreen();

       }

   } else if (key == 27) {

      ExitFullScreen();

   }

}



/*On Button Press*/

function GoLeft() {

  currentImg--;

  if (currentImg < firstImg) {

    currentImg = lastImg;

  }



  document.getElementById('view').src = imgsPath + currentImg + imgExtn;

}



function GoRight() {

  currentImg++;

  if (currentImg > lastImg) {

    currentImg = firstImg;

  }



  document.getElementById('view').src = imgsPath + currentImg + imgExtn;

}



function FullScreen() {

  document.getElementById('view').src = imgsPath + currentImg + imgExtn;

  var elem = document.getElementById('view');

  elem.style.visibility = "visible";

  if (elem.requestFullscreen) {

    elem.requestFullscreen();

  } else if (elem.msRequestFullscreen) {

    elem.msRequestFullscreen();

  } else if (elem.mozRequestFullScreen) {

    elem.mozRequestFullScreen();

  } else if (elem.webkitRequestFullscreen) {

    elem.webkitRequestFullscreen();

  }

}



function ExitFullScreen() {

  if (document.cancelFullScreen) {

      document.cancelFullScreen();

    } else if (document.mozCancelFullScreen) {

      document.mozCancelFullScreen();

    } else if (document.webkitCancelFullScreen) {

      document.webkitCancelFullScreen();

    }

  document.getElementById('view').style.visibility = "hidden";

}
