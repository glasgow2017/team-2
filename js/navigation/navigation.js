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

responsiveVoice.cancel();
responsiveVoice.init();
console.log("Hello");
readPageDescription();
processTopLevel();
readOutElementList(currentDisplayElements);

function readPageDescription() {
    if ($("body").is("[role_info]")) {
        console.log("attempting to speak");
        responsiveVoice.speak("This page is about " + $("body").attr("role_info"));
    } else {
        responsiveVoice.speak("Team 2 is awesome, but this page is not being helpful...");
    }
}

function processTopLevel() {
    var pageDivs = $("body").find("[role]");
    console.log(pageDivs.length);

    for (var i = 0; i < pageDivs.length; i++) {
        var divRole = $(pageDivs[i]).attr("role");
        console.log("Div: " + pageDivs[i]);
        console.log("Div Role: " + divRole);
        if (divRole == SEARCH || divRole == FORM || divRole == CONTENTINFO || divRole == COMPLEMENTARY ||
            divRole == BANNER || divRole == MAIN || divRole == NAVIGATION) {
            // Add div to list of displayable divs
            currentDisplayElements.push(pageDivs[i]);
            console.log("Displayable Div: " + pageDivs[i]);
        }
    }

}

function readOutElementList(list) {
    // Prepare event listening
    isListening = true;

    // Read out elements
    if (parentView != null) {
        // Read out back button
        readBackInfo();
    }

    // TODO: Use nested things & categories
    responsiveVoice.speak("There are " + list.length + " options in this list.");
    for (var i = 0; i < list.length; i++) {
        readElementInfo(list[i], i + 1);
    }
}

function readElementInfo(element, index) {
    // Read info
    var jElement = $(element);
    responsiveVoice.speak("To enter the " + jElement.attr("role") + " element, which is about " + jElement.attr("role_info") + ", press " + index);
}

function readBackInfo() {
    responsiveVoice.speak("To go back to the " + parentView.attr("role") + " element, which is about " + parentView.attr("role_info") + ", press " + 0);
}

function enterNewElement(newElement) {
    responsiveVoice.cancel();
    parentView = currentView;
    currentView = newElement;

    responsiveVoice.speak("You have now entered the " + $(currentView).attr("role") + " element.");
    if (currentView.hasChildNodes()) {
        currentDisplayElements = getElements(newElement);
        readOutElementList(currentDisplayElements);
    } else {
        currentDisplayElements = null;
        readElement(currentView);
    }
}

function readElement(element) {
    responsiveVoice.speak("The " + element.attr("role") + " section");
    responsiveVoice.speak(element.val());
}

function getElements(selectedElement) {
    return $(selectedElement).children();
}

function goBack() {
    currentView = parentView;
}

window.onkeyup = function(e) {
    if (isListening) {
        var key = e.keyCode ? e.keyCode : e.which;

        // Back option
        if (key === 48) {
            // Go back
            goBack();
        }

        for (var i = 0; i < currentDisplayElements.length; i++) {
            if (49 + i === key) {
                enterNewElement(currentDisplayElements[i]);
                isListening = false;
                break;
            }
        }
    }
};

function parseNested(line) {
    var total = 0;
    var splitLine = line.split(",");

    for (var i = 0; i < splitLine.length; i++) {
        total += parseInt(splitLine[i].split(" ")[0]);
    }

    return total;
}
