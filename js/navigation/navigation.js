var MAIN = "main";
var NAVIGATION = "navigation";
var SEARCH = "search";
var FORM = "form";
var CONTENTINFO = "contentinfo";
var COMPLEMENTARY = "complementary";
var BANNER = "banner";

var currentDisplayElements = [];
var currentView = $(document);
var parentView = undefined;

var isListening = false;

processTopLevel();
readOutElementList(currentDisplayElements);

function processTopLevel() {
    var pageDivs = $("body").children();
    var foundMain = false;
    var foundNav = false;

    for (var div in pageDivs) {
        if (pageDivs.hasOwnProperty(div) && $(div).is("[role]")) {
            var divRole = div.attr("role");
            if (divRole === SEARCH || divRole === FORM || divRole === CONTENTINFO || divRole === COMPLEMENTARY ||
            divRole === BANNER || divRole === MAIN || divRole === NAVIGATION) {
                // Add div to list of displayable divs
                currentDisplayElements.push(div);
                console.log("Displayable Div: " + div);
            }
        }
    }
}

function readOutElementList(list) {
    // Prepare event listening
    isListening = true;

    // Read out elements
    if (currentView !== $(document)) {
        // Read out back button
        readBackInfo();
    }
    for (var i = 0; i < list.length; i++) {
        readElementInfo(list[i], i + 1);
    }
}

function readElementInfo(element, index) {
    // Read info
    responsiveVoice.speak("To enter the " + element.attr("role") + "element, which is about " + element.attr("role_info") + ", press " + index);
}

function readBackInfo() {
    responsiveVoice.speak("To go back to the " + parentView.attr("role") + "element, which is about " + parentView.attr("role_info") + ", press " + 0);
}

function enterNewElement(newElement) {
    parentView = currentView;
    currentView = newElement;

    if (currentView )
    currentDisplayElements = getElements(newElement);
}

function getElements(selectedElement) {
    return $(selectedElement).children();
}

window.onkeyup = function(e) {
    if (isListening) {
        var key = e.keyCode ? e.keyCode : e.which;

        for (var i = 0; i < currentDisplayElements.length; i++) {
            if (48 + i === key) {
                enterNewElement(currentDisplayElements[i]);
                isListening = false;
                break;
            }
        }
    }
};
