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
    var isListeningForSelection = false;

    responsiveVoice.cancel();
    responsiveVoice.init();
    readPageDescription();
    currentDisplayElements = getElements(currentView);
    readOutElementList(currentDisplayElements);
    //Adding some comments/

    /**
     * Reads out the description of the page as a whole.
     */
    function readPageDescription() {
        if (currentView.is("[role_info]")) {
            //console.log("attempting to speak");
            responsiveVoice.speak("This page is about " + $("body").attr("role_info"));
        }
    }

    /**
     * Reads out the information contained in a list of elements.
     * @param list The list of elements to read out.
     */
    function readOutElementList(list) {
        responsiveVoice.speak("The " + $(currentView).attr("role") + ".");
        // Prepare event listening
        isListening = true;
        //console.log("Are we listening now? " + isListening);

        // Read out elements
        responsiveVoice.speak("There's " + $(currentView).attr("nested") + " in this section.");
        for (var i = 0; i < list.length; i++) {
            readElementInfo(list[i], i + 1);
        }


        //console.log(parentView);
        if (parentView !== undefined) {
            // Read out back button
            readBackInfo();
        }
        readRestartInfo();
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
                responsiveVoice.speak(index + ", a link to " + jElement.text());
                break;
            case "BUTTON":
                // Read buttons label out to know what will happen
                responsiveVoice.speak(index + ", a button to " + jElement.attr("role_info"));
                break;
            default:
                responsiveVoice.speak(index + ", the " + jElement.attr("role") + " element, which is about " + jElement.attr("role_info"));
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
        currentDisplayElements = getElements(newElement);

        var roleAttr = $(currentView).attr("role");
        if (roleAttr.indexOf("SECTION") >= 0 || roleAttr.indexOf("MENU") >= 0 ||
            roleAttr.indexOf("HEADER") >= 0 || roleAttr.indexOf("LIST") >= 0) {
            console.log("This next thing is a directory!");
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
                responsiveVoice.speak("The " + $(currentView).attr("role") + ".");
                responsiveVoice.speak(jElement.text(), CONTENT_VOICE);
                isListening = false;
                goBack();
                break;
            case "IMAGE":
                responsiveVoice.speak("The " + $(currentView).attr("role") + ".");
                responsiveVoice.speak(jElement.attr("alt"), CONTENT_VOICE);
                isListening = false;
                goBack();
                break;
            case "FORM":
                processForm(element);
                isListening = false;
                goBack();
                break;
            case "DROPDOWN":
                processDropDown(element);
                isListening = false;
                goBack();
                break;
            case "BUTTON":
                processButton(element);
                isListening = false;
                goBack();
                break;
            case "LINK":
                var hrefAttr = $(element).attr("href");
                if (hrefAttr !== undefined && hrefAttr !== "") {
                    responsiveVoice.speak("Going to the " + jElement.text() + " page.");
                    window.location.href = hrefAttr;
                } else {
                    responsiveVoice.speak("Sorry but the link to " + jElement.text() + " is broken.");
                }
                break;
            default: // For now just assume it's some kind of input
                processInput(element);
                isListening = false;
                goBack();
        }
    }

    // TODO: Go to button
    function processButton(element) {

    }

    /**
     * Processes a form, allowing the user to input where necessary.
     * @param element The form element to process.
     */
    function processForm(element) {
        // List out items
        var children = getElements(element);
        currentDisplayElements = children;
        isListening = true;

        for (var i = 0; i < children.length; i++) {
            switch($(children[i]).attr("role")) {
                case "DROPDOWN":
                    responsiveVoice.speak("To select an item from the drop down, press " + i);
                    break;
                default: // Should be something INPUT
                    processInput(children[i]);
            }
        }
    }

    // TODO: Process various types of input
    function processInput(element) {
        var inputType = $(element).attr("role").split(" ")[0];

        switch(inputType) {
            case "TEXT":
            case "URL":
            case "SEARCH":
            case "EMAIL":

                // Textual input

        }
    }

    function processDropDown(dropdown) {
        // List items within the dropdown
        var children = $(dropdown).children("[role][role!='EMPTY']");

        isListeningForSelection = true;
        currentDisplayElements = children;

        responsiveVoice.speak("There are " + children.length + " items available for selection.");
        if ($(dropdown).val()) {
            responsiveVoice.speak("The currently selected element is " + $(dropdown).val());
        }

        // List out user options
        for (var i = 0; i < children.length; i++) {
            responsiveVoice("To select " + children[i].text() + ", press " + i);
        }

        readBackInfo();
        readRestartInfo();
    }

    function selectElement(selection) {
        $(currentView).val(selection);
        responsiveVoice($(selection).val() + " has been selected.");
        goBack();
    }

    /**
     * Returns the valid child elements of this object
     * @param selectedElement The object to get the children for
     * @returns {*|jQuery} List of valid children
     */
    function getElements(selectedElement) {
        // TODO: this is ok, but it breaks if the only child is not a directory. Need a way to truly collapse the DOM, so in the nested list itself there is the final element
        if ($(selectedElement).attr("nested") !== undefined && parseNested($(selectedElement).attr("nested")) === 1) {
            // No need to view this element, skip to next element
            currentView = $(selectedElement).children("[role][role!='EMPTY'][display!='hidden']")[0];
            return getElements(currentView);
        } else {
            return getChildren(selectedElement);
        }
    }

    function getChildren(element) {
        var children = $(element).children("[role][role!='EMPTY'][display!='hidden']");
        var finalVerified = [];

        for (var i = 0; i < children.length; i++) {
            if ($(children[i]).attr("nested") !== undefined && parseNested($(children[i]).attr("nested")) === 1) {
                finalVerified.push(getChildren(children[i])[0]);
            } else {
                finalVerified.push(children[i]);
            }
        }

        return finalVerified;
    }

    /**
     * Goes back a level.
     */
    function goBack() {
        responsiveVoice.cancel();

        currentView = parentView;
        if ($(currentView).is('body')) {
            parentView = undefined;
        } else {
            parentView = $(currentView).parent();
        }

        responsiveVoice.speak("You are back in the " + $(currentView).attr("role") + " element.");

        currentDisplayElements = getElements(currentView);
        readOutElementList((currentDisplayElements));
    }

    /**
     * Listens for key presses
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
        } else if (isListeningForSelection) {
            if (currentDisplayElements !== undefined) {
                for (var i = 0; i < currentDisplayElements.length; i++) {
                    if (49 + i === key) {
                        isListeningForSelection = false;
                        selectElement(currentDisplayElements[i]);
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