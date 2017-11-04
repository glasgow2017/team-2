/**
 * Created by bozhidar on 04.11.17.
 *
 * Here there are methods used to parse the dome and add alt text
 */

/**
 * Sets the alt of a HTML element.
 *
 * @param element
 * @param alt_text
 */
function setAlt(element, alt_text) {
    $(element).attr('alt', alt_text);
}


/**
 * Gets the children list of an element and converts it ot a list.
 * This list is then returned (condensed, meaning if we have 3 images we get "3 img" as description.
 *
 * @param element
 * @returns {string}
 */
function getChildrenList(element) {
    var map = new Map();
    $(element).children().each(function () {
        var tag_name = this.tagName;
        if (map.has(tag_name)) {
            map.set(tag_name, Number(map.get(tag_name)) + 1);
        } else map.set(tag_name, 1);
    });

    var result = "empty";
    if (map.size > 0) {
        result = "";
        for (var [key, value] of map) {
            result += (value + " " + key + ", ");
        }
    }


    //Add the break symbol that is the boundary between the children count and their description.
    result += ";";

    return result;
}

/**
 * Iterate through the elements.
 *
 * @param element
 */
function forwardPropagation(element) {
    var alt = getChildrenList(element);
    setAlt(element, alt);
    $(element).children().each(function () {
        forwardPropagation(this);
    });
}