function Navigator() {
    var displayableDivs = [];

    var parsePage = function() {
        var pageDivs = $("div").get();

        for (var div in pageDivs) {
            if (pageDivs.hasOwnProperty(div) && div.hasAttr("role")) {
                // Add div to list of displayable divs
                displayableDivs.push(div);
                console.log("Displayable Div: " + div);
            }
        }
    }
}

$.fn.hasAttr = function(name) {
    return this.attr(name) !== undefined || this.attr(name) !== false;
};