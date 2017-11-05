function startNav() {

    var MAIN = "main";
    var NAVIGATION = "navigation";
    var SEARCH = "search";
    var FORM = "form";
    var CONTENTINFO = "contentinfo";
    var COMPLEMENTARY = "complementary";
    var BANNER = "banner";

    var NAV_VOICE = "UK English Female";
    var CONTENT_VOICE = "UK English Male";

    var currentDisplayElements = [];
    var currentView = $("body");
    var parentView = undefined;

    var isListening = false;

    responsiveVoice.cancel();
    responsiveVoice.init();
    readPageDescription();
    currentDisplayElements = getElements(currentView);
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
        responsiveVoice.speak("There's " + $(currentView).attr("nested") + " in this container.");
        for (var i = 0; i < list.length; i++) {
            console.log("Are we listening now? " + isListening);
            readElementInfo(list[i], i + 1);
        }


        console.log(parentView);
        if (parentView !== undefined) {
            // Read out back button
            readBackInfo();
        }
    }

    function readElementInfo(element, index) {
        // Read info
        var jElement = $(element);
        switch(jElement.attr("role")) {
            case "LINK":
                // Read links out to be pressed
                responsiveVoice.speak(index + ", a link to " + jElement.attr("role_info"));
                break;
            default:
                responsiveVoice.speak(index + ", the" + jElement.attr("role") + " element, which is about " + jElement.attr("role_info"));
        }
    }

    function readBackInfo() {
        responsiveVoice.speak("To go back, press 0");
    }

    function readRestartInfo() {
        responsiveVoice.speak("To restart this message, press r");
    }

    function enterNewElement(newElement, newParent) {
        responsiveVoice.cancel();
        parentView = newParent;
        currentView = newElement;
        //console.log("New Parent View: " + parentView);
        //console.log("New Current View: " + currentView);
        responsiveVoice.speak("The " + $(currentView).attr("role") + " element.");
        if ($(currentView).attr("role").indexOf("CONTAINER") >= 0 || $(currentView).attr("role").indexOf("MENU") >= 0) {
            console.log("This next thing is a directory!");
            currentDisplayElements = getElements(newElement);
            readOutElementList(currentDisplayElements);
        } else {
            console.log("This next thing is NOT a directory!");
            currentDisplayElements = null;
            readElement(currentView);
        }

    }

    // TODO: Add support for input elements (Forms, buttons)
    function readElement(element) {
        var jElement = $(element);
        // Allow going back.
        isListening = true;
        currentDisplayElements = undefined;

        // Depending on type, read differently
        switch(jElement.attr("role")) {
            case "TEXT":
                responsiveVoice.speak(jElement.text(), CONTENT_VOICE);
                break;
            case "HEADER":
                break;
            case "IMAGE":
                break;
            case "FORM":
                processForm(element);
                break;
        }

        isListening = false;
        goBack();
    }

    function processForm(element) {
        // List out items

    }

    function getElements(selectedElement) {
        if (parseNested($(selectedElement).attr("nested")) === 1) {
            // No need to view this element, skip to next element
            return getElements($(selectedElement).children("[role][role!='EMPTY']")[0]);
        } else {
            return $(selectedElement).children("[role][role!='EMPTY']");
        }
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

    window.onkeyup = function (e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if (isListening) {

            // Back option
            console.log("Pressed keycode: " + key);
            if (key === 48 && parentView !== undefined) {
                // Go back
                isListening = false;
                goBack();
            }

            if (currentDisplayElements !== undefined) {
                for (var i = 0; i < currentDisplayElements.length; i++) {
                    if (49 + i === key) {
                        isListening = false;
                        enterNewElement(currentDisplayElements[i], currentView);
                        break;
                    }
                }
            }
        }

        // r to restart speech
        if (key === 82) {
            responsiveVoice.cancel();
            enterNewElement(currentView, parentView);
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
}