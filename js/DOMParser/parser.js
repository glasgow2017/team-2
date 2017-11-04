/**
 * Created by bozhidar on 04.11.17.
 *
 * Here there are methods used to parse the dome and add alt text
 */
var tag_category = {
    "HEADER": "HEADER",
    "FOOTER": "FOOTER",
    "P" : "TEXT",
    "IMG" : "IMAGE"
};

function start() {
    forwardPropagation($('body'));
    backPropagation($('body'));
}

/**
 * Iterate through the elements and set their children nodes.
 *
 * @param element
 */
function forwardPropagation(element) {
    var alt = getChildrenList(element);
    setAttr(element, 'nested', alt);
    $(element).children().each(function () {
        forwardPropagation(this);
    });
}

function backPropagation(element) {
    //if there are no children propagate
    var childrenDescriptions = new Map();
    if($(element).children().length === 0) {
        setAttr(element, 'category', "EMPTY"); //TODO: sophisticate
        childrenDescriptions.set(element.tagName, 1);
    } else {
        $(element).children().each(function () {
            childrenDescriptions = combineMaps(childrenDescriptions, backPropagation(this));
        });
        //console.log(element, childrenDescriptions);
        if(childrenDescriptions.size === 1) {
            setAttr(element, 'category', getCategory(childrenDescriptions.keys().next().value) + "_CONTAINER");
        } else {
            setAttr(element, 'category', getCategory(element.tagName));
        }
    }

    return childrenDescriptions;
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

    return result.substr(0, result.length - 1);
}

function getCategory(tagName) {
    if (tag_category[tagName] !== undefined) {
        return tag_category[tagName];
    } else return "CONTAINER";
}

/**
 * Combines 2 maps so that they do not have repeating elements.
 *
 * @param map1
 * @param map2
 * @returns {*}
 */
function combineMaps(map1, map2) {
    console.log(map1, map2);for (var [key, value] of map2) {
        if (map1.has(key)) {
            map1.set(key, map1.get(key) + value);
        } else map1.set(key, value);
    }

    //clean non-needed tags
    map1.delete("SCRIPT");
    map1.delete("NOSCRIPT");

    return map1;
}

function buildRole(map) {
    var result = "";
    if (map.size > 0) {
        for (var [key, value] of map) {
            result += (value + " " + key + ", ");
        }
    }
    return result;
}


/**
 * Sets the alt of a HTML element.
 *
 * @param element
 * @param alt_text
 */
function setAttr(element, attr, alt_text) {
    $(element).attr(attr, alt_text);
}

/**
 * Where we combine keywords into something more useful
 * @param keywords Keyword objects to combine
 * @returns {Array.<*>}
 */
function keywordReduction(keywords) {
    let limit = 10;
    keywords = [];
    keywords.sort(Keyword.compareTo);
    return keywords.slice(0, limit);
}

/**
 * Converts google keyword responses to Keyword objects
 * @param responses from google API
 * @returns {Array}
 */
function keywordsFromGoogle(responses) {
    const keywords = [];
    for (let response of responses) {
        keywords.push(new ImgKeyword(response.description, response.score));
    }
    return keywords;
}