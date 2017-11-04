var MAIN = "main";
var NAVIGATION = "navigation";
var SEARCH = "search";
var FORM = "form";
var CONTENTINFO = "contentinfo";
var COMPLEMENTARY = "complementary";
var BANNER = "banner";

var currentDisplayElements = [];
var currentView = $(document);

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

function getElements(selectedElement) {
    return $(selectedElement).children();
}

function readOutElementList(list) {
    for (var element in list) {
        readElementInfo(element);
    }
}

function readElementInfo(element) {
    // Read info
}


