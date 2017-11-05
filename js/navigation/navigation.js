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

    /**
     * Reads out the description of the page as a whole.
     */
    function readPageDescription() {
        if (currentView.is("[role_info]")) {
            //console.log("attempting to speak");
            responsiveVoice.speak("This page is about " + $("body").attr("role_info"));
        } else {
            responsiveVoice.speak("Team 2 is awesome, but this page is not being helpful...");
        }
    }

    /**
     * Reads out the information contained in a list of elements.
     * @param list The list of elements to read out.
     */
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

    /**
     * Reads out the information for a particular element
     * @param element The element to read out.
     * @param index The selection index for an element
     */
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

    /**
     * Read out the line to inform the user how to go back.
     */
    function readBackInfo() {
        responsiveVoice.speak("To go back, press 0");
    }

    /**
     * Read the user the information on how to restart the message
     */
    function readRestartInfo() {
        responsiveVoice.speak("To restart this message, press r");
    }

    /**
     * Enters into a new element with a certain parent.
     * @param newElement The view or element to go into and see
     * @param newParent The parent of the new element
     */
    function enterNewElement(newElement, newParent) {
        responsiveVoice.cancel();
        parentView = newParent;
        currentView = newElement;
        //console.log("New Parent View: " + parentView);
        //console.log("New Current View: " + currentView);
        responsiveVoice.speak("The " + $(currentView).attr("role") + " element.");
        if ($(currentView).attr("role").indexOf("CONTAINER") >= 0 || $(currentView).attr("role").indexOf("MENU") >= 0 ||
            $(currentView).attr("role").indexOf("HEADER")) {
            console.log("This next thing is a directory!");
            currentDisplayElements = getElements(newElement);
            readOutElementList(currentDisplayElements);
        } else {
            console.log("This next thing is NOT a directory!");
            currentDisplayElements = null;
            readElement(currentView);
        }

    }

    /**
     * Gives a more detailed expose of a particular element. Or in the case of forms, allows a user to input.
     * @param element
     */
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
            case "IMAGE":
                break;
            case "FORM":
                processForm(element);
                break;
        }

        isListening = false;
        goBack();
    }

    /**
     * Processes a form, allowing the user to input where necessary.
     * @param element The form element to process.
     */
    function processForm(element) {
        // List out items
        var children = getElements(element);

        for (var child in children) {
            switch($(child).attr("role")) {
                case "DROPDOWN":
                    processDropDown();
                    break;
                default: // Should be something INPUT

            }
        }
    }

    /**
     * Returns the valid child elements of this object
     * @param selectedElement The object to get the children for
     * @returns {*|jQuery} List of valid children
     */
    function getElements(selectedElement) {
        if (parseNested($(selectedElement).attr("nested")) === 1) {
            // No need to view this element, skip to next element
            return getElements($(selectedElement).children("[role][role!='EMPTY']")[0]);
        } else {
            return $(selectedElement).children("[role][role!='EMPTY']");
        }
    }

    /**
     * Goes back a level.
     */
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

    /**
     * Listens for keypresses
     * @param e The key event.
     */
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

    /**
     * Parses a "nested" attribute value to get the number of nested elements
     * @param line The value of the "nested" attribute
     * @returns {number} The total number of nested elements.
     */
    function parseNested(line) {
        var total = 0;
        var splitLine = line.split(",");

        for (var i = 0; i < splitLine.length; i++) {
            total += parseInt(splitLine[i].split(" ")[0]);
        }

        return total;
    }
}