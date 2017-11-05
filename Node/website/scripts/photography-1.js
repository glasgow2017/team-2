var lastImg = 258;
var firstImg = 208;
var currentImg = firstImg;
var imgsPath = "img/photography/"
var imgExtn = ".jpg"

window.onload = function() {
  preloadImgs();
  buildSpread();
}

/*Thumbnail Creation*/
function buildSpread() {
  for(i = firstImg; i <= lastImg; i++){
    buildThumb(imgsPath + i + imgExtn);
  }
  document.getElementById('thumbs').appendChild(document.createElement("br"));
}

function buildThumb(imgSrc) {
  var thumb = document.createElement("div");
  var content = document.createElement("img");
  content.id = "thumb";
  content.src = imgSrc;
  thumb.appendChild(content);

  var thumbsDiv = document.getElementById('thumbs');
  thumbsDiv.appendChild(thumb);
}

/*Image Preloading*/
var images = new Array();
function preloadImgs(){
  for(i = firstImg; i <= lastImg; i++){
    images[i - firstImg] = new Image();
    images[i - firstImg].src = imgsPath + i + imgExtn;
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
