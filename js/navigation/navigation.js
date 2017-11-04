
var displayableDivs = [];

function parsePage() {
    var pageDivs = $("div").get();

    for (var div in pageDivs) {
        if (pageDivs.hasOwnProperty(div) && $(div).is("[role]")) {
            // Add div to list of displayable divs
            displayableDivs.push(div);
            console.log("Displayable Div: " + div);
        }
    }

    return null;
}

parsePage();