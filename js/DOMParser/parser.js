/**
 * Created by bozhidar on 04.11.17.
 *
 * Here there are methods used to parse the dome and add alt text
 */
const tag_category = {
    "HEADER": "HEADER",
    "FOOTER": "FOOTER",
    "P": "TEXT",
    "H1": "HEADING",
    "H2": "HEADING",
    "H3": "HEADING",
    "H4": "HEADING",
    "H5": "HEADING",
    "H6": "HEADING",
    "A": "LINK",
    "IMG": "IMAGE",
    "NAV": "MENU",
    "BODY": "DOCUMENT",
    "BUTTON": "BUTTON",

    };

const keyword_category = {
    "menu" : "MENU",
    "nav" : "MENU"
};


function start() {
    backPropagation($('body'));
    forwardPropagation($('body'));
}

/**
 * Iterate through the elements and set their children nodes.
 *
 * @param element
 */
function forwardPropagation(element) {
    const alt = getChildrenList(element);
    setAttr(element, 'nested', alt);
    $(element).children().each(function () {
        forwardPropagation(this);
    });
}

/**
 * Back propagation for figuring the category of the element.
 * @param element
 * @returns {Map}
 */
function backPropagation(element) {
    let childrenDescriptions = new Map();
    if($(element).children().length === 0) {
        //Set the category of the element (def = EMPTY)
        setAttr(element, 'category', getCategory(element, element.tagName, "EMPTY"));
        childrenDescriptions.set(element.tagName, 1);
    } else {
        $(element).children().each(function () {
            childrenDescriptions = mergeMaps(childrenDescriptions, backPropagation(this));
        });
        if(childrenDescriptions.size === 1 && childrenDescriptions.values().next().value !== 1) {
            setAttr(element, 'category', getCategory(undefined, childrenDescriptions.keys().next().value, "CONTAINER") + "_CONTAINER");
        } else {
            setAttr(element, 'category', getCategory(element, element.tagName, "CONTAINER"));
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
    const map = new Map();
    $(element).children().each(function () {
        const category = $(this).attr('category');
        if (map.has(category)) {
            map.set(category, Number(map.get(category)) + 1);
        } else map.set(category, 1);
    });

    //Clear unwanted tags
    clearMap(map);

    //Build result string
    let result = "EMPTY,";
    if (map.size > 0) {
        result = "";
        for (let [key, value] of map) {
            result += (value + " " + key + ",");
        }
    }

    return result.substr(0, result.length - 1);
}

/**
 * Get category of an element.
 *
 * @param tagName
 * @param def is the default returned category
 * @returns {*}
 */
function getCategory(element, tagName, def) {
    //If we have element passed search through the keywords and on first occurrence return it.
    if (element !== undefined) {
        for (let word in keyword_category) {
            const infer = inferCategoryFromAttributes(element, word);
            if (infer !== undefined) return infer;
        }
    }
    if (tag_category[tagName] !== undefined) {
        return tag_category[tagName];
    } else return def;
}

/**
 * Combines 2 maps so that they do not have repeating elements.
 *
 * @param map1
 * @param map2
 * @returns {*}
 */
function mergeMaps(map1, map2) {
    for (var [key, value] of map2) {
        if (map1.has(key)) {
            map1.set(key, map1.get(key) + value);
        } else map1.set(key, value);
    }

    //clean non-needed tags
    clearMap(map1);

    return map1;
}

/**
 * Infer the category of an element from the content of its attributes and a given keyword.
 *
 * @param element
 * @param keyword
 * @returns {*}
 */
function inferCategoryFromAttributes(element, keyword) {
    const attributes = element.attributes;
    //If it has attributes
    if (attributes !== undefined) {
        //Iterate
        for (let i = 0; i < attributes.length; i++) {
            //If the attribute contains this word return the word's category
            if (attributes[i].value.indexOf(keyword) > -1) {
                return keyword_category[keyword];
            }
        }
    }
    return undefined;
}

/**
 * Clears the map of unwanted tags.
 *
 * @param map
 * @returns {*}
 */
function clearMap(map) {
    map.delete("SCRIPT");
    map.delete("NOSCRIPT");
    map.delete("svg");
    map.delete("BR");
    map.delete("EMPTY");

    return map;
}

/**
 *
 * @param {HTMLElement} element
 */
function buildRoleInfo(element) {
    //Handle images
    if (element.nodeName === "IMG") {
        let keywords = [new ImgKeyword("keyword 1", 0.8), new ImgKeyword("keyword 2", 0.4)];
        element.setAttribute("role_info", keywords.join(","));
        return keywords;
    //TODO: Handle text
    } else if (element.nodeName === "") {

    } else {
        let keywords = [];
        for (let child of element.children) {
            keywords.push(buildRoleInfo(child));
        }
        keywords = keywordReduction(keywords);
        element.setAttribute("role_info", keywords.join(","))
    }
}

function buildAllRoleInfo() {
    buildRoleInfo($('body'));
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