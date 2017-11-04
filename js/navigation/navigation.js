var MAIN = "main";
var NAVIGATION = "navigation";
var SEARCH = "search";
var FORM = "form";
var CONTENTINFO = "contentinfo";
var COMPLEMENTARY = "complementary";
var BANNER = "banner";

var displayableDivs = [];
var mainDiv;
var navDiv;
var landmarkDivs = [];
var currentView = $(document);

function processDisplayableDivs() {
    var pageDivs = $("div").get();
    var foundMain = false;
    var foundNav = false;

    for (var div in pageDivs) {
        if (pageDivs.hasOwnProperty(div) && $(div).is("[role]")) {
            // Add div to list of displayable divs
            displayableDivs.push(div);
            console.log("Displayable Div: " + div);

            var divRole = div.attr("role");
            if (divRole === MAIN) {
                mainDiv = div;
                foundMain = true;
            } else if (divRole === NAVIGATION) {
                navDiv = div;
                foundNav = true;
            } else if (divRole === SEARCH || divRole === FORM || divRole === CONTENTINFO || divRole === COMPLEMENTARY ||
                divRole === BANNER) {
                landmarkDivs.push(div);
            }
        }

        // If found two most important elements, start speaking
        if (foundMain && foundNav) {
            speakToUser();
        }
    }
}

function speakToUser() {
    // Overall page description (e.g. page title, company name)
    var overallDescription = "This page is mainly about ___.";

    // Nav
    var navigationSpeak = "To navigate to another page on this website, press 1";

    // Main

    for (var block in landmarkDivs) {

    }
}


