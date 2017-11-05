var MAIN = "main";
var NAVIGATION = "navigation";
var SEARCH = "search";
var FORM = "form";
var CONTENTINFO = "contentinfo";
var COMPLEMENTARY = "complementary";
var BANNER = "banner";

var currentDisplayElements = [];
var currentView = $("body");
var parentView = undefined;

var isListening = false;

responsiveVoice.cancel();
responsiveVoice.init();
readPageDescription();
processTopLevel();
readOutElementList(currentDisplayElements);

function readPageDescription() {
    if (currentView.is("[role_info]")) {
        //console.log("attempting to speak");
        responsiveVoice.speak("This page is about " + $("body").attr("role_info"));
    } else {
        responsiveVoice.speak("Team 2 is awesome, but this page is not being helpful...");
    }
}

function processTopLevel() {
    var pageDivs = $("body").find("[role]");
    //console.log(pageDivs.length);

    for (var i = 0; i < pageDivs.length; i++) {
        var divRole = $(pageDivs[i]).attr("role");
        if (divRole == SEARCH || divRole == FORM || divRole == CONTENTINFO || divRole == COMPLEMENTARY ||
            divRole == BANNER || divRole == MAIN || divRole == NAVIGATION) {
            // Add div to list of displayable divs
            currentDisplayElements.push(pageDivs[i]);
            //console.log("Displayable Div: " + pageDivs[i]);
        }
    }

}

function readOutElementList(list) {
    // Prepare event listening
    isListening = true;
    console.log("Are we listening now? " + isListening);

    // Read out elements
    console.log(parentView);
    if (parentView != undefined) {
        // Read out back button
        readBackInfo();
    }

    // TODO: Use nested things & categories
    responsiveVoice.speak("There are " + list.length + " options in this list.");
    for (var i = 0; i < list.length; i++) {
        console.log("Are we listening now? " + isListening);
        readElementInfo(list[i], i + 1);
    }
}

function readElementInfo(element, index) {
    // Read info
    var jElement = $(element);
    responsiveVoice.speak("To enter the " + jElement.attr("role") + " element, which is about " + jElement.attr("role_info") + ", press " + index);
}

function readBackInfo() {
    var jParentView = $(parentView);
    responsiveVoice.speak("To go back to the " + jParentView.attr("role") + " element, which is about " + jParentView.attr("role_info") + ", press " + 0);
    console.log("Are we listening now? " + isListening);
}

function enterNewElement(newElement) {
    responsiveVoice.cancel();
    parentView = currentView;
    currentView = newElement;
    //console.log("New Parent View: " + parentView);
    //console.log("New Current View: " + currentView);

    responsiveVoice.speak("You have now entered the " + $(currentView).attr("role") + " element.");
    if ($(currentView).has("[role]")) {
        console.log("This next thing is a directory!");
        currentDisplayElements = getElements(newElement);
        readOutElementList(currentDisplayElements);
    } else {
        console.log("This next thing is NOT a directory!");
        currentDisplayElements = null;
        readElement(currentView);
    }
}

function readElement(element) {
    responsiveVoice.speak("The " + element.attr("role") + " section");
    responsiveVoice.speak(element.val());
}

function getElements(selectedElement) {
    console.log("Number of role children: " +$(selectedElement).children("[role]").length);
    return $(selectedElement).children("[role]");
}

function goBack() {
    responsiveVoice.cancel();

    currentView = parentView;
    console.log($(currentView).children("[role]"))
    if ($(currentView).is('body')) {
        parentView = undefined;
    } else {
        parentView = $(currentView).parent();
    }

    responsiveVoice.speak("You are back in the " + $(currentView).attr("role") + " element.");

    console.log(currentView);
    currentDisplayElements = getElements(currentView);
    readOutElementList((currentDisplayElements));
}

window.onkeyup = function(e) {
    if (isListening) {
        var key = e.keyCode ? e.keyCode : e.which;

        // Back option
        console.log("Pressed keycode: " + key);
        if (key === 48 && parentView !== undefined) {
            // Go back
            isListening = false;
            goBack();
        }

        for (var i = 0; i < currentDisplayElements.length; i++) {
            if (49 + i === key) {
                isListening = false;
                enterNewElement(currentDisplayElements[i]);
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
