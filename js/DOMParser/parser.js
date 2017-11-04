/**
 * Created by bozhidar on 04.11.17.
 *
 * Here there are methods used to parse the dome and add alt text
 */
const tag_role = {
    "HEADER": "HEADER",
    "FOOTER": "FOOTER",
    "P": "TEXT",
    "H1": "TEXT",
    "H2": "TEXT",
    "H3": "TEXT",
    "H4": "TEXT",
    "H5": "TEXT",
    "H6": "TEXT",
    "A": "LINK",
    "IMG": "IMAGE",
    "NAV": "MENU",
    "BODY": "DOCUMENT",
    "BUTTON": "BUTTON",
    "FORM": "FORM"
};

const keyword_role = {
    "menu" : "MENU",
    "nav" : "MENU",
    "header": "HEADER",
    "footer": "FOOTER",
};


function start() {
    backPropagation($('body'));
    forwardPropagation($('body'));
    correctCategories($('body'));
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
 * Back propagation for figuring the role of the element.
 * @param element
 * @returns {Map}
 */
function backPropagation(element) {
    let childrenDescriptions = new Map();
    if($(element).children().length === 0) {
        //Set the role of the element (def = EMPTY)
        setAttr(element, 'role', getRole(element.tagName, "EMPTY"));
        childrenDescriptions.set(element.tagName, 1);
    } else {
        $(element).children().each(function () {
            childrenDescriptions = mergeMaps(childrenDescriptions, backPropagation(this));
        });
        if(childrenDescriptions.size === 1 && childrenDescriptions.values().next().value !== 1) {
            setAttr(element, 'role', getRole(childrenDescriptions.keys().next().value, "CONTAINER") + " CONTAINER");
        } else {
            setAttr(element, 'role', getRole(element.tagName, "CONTAINER"));
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
        const role = $(this).attr('role');
        if (map.has(role)) {
            map.set(role, Number(map.get(role)) + 1);
        } else map.set(role, 1);
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
 * Get role of an element.
 *
 * @param tagName
 * @param def is the default returned role
 * @returns {*}
 */
function getRole(tagName, def) {
    //If we have element passed search through the keywords and on first occurrence return it.
    if (tag_role[tagName] !== undefined) {
        return tag_role[tagName];
    } else return def;
}

/**
 * Corrects some special categories.
 *
 * @param element
 * @returns {*}
 */
function correctCategories(element) {
    if (element.tagName === "SCRIPT") {
        setAttr(element, 'role', "EMPTY");
        return;
    }
    if ($(element).attr('nested') === "EMPTY" && $(element).text().length > 0) {
        setAttr(element, 'role', "TEXT");
        return;
    }
    if ($(element).attr('nested') === "EMPTY" && $(element).text() === "" && $(element).attr('role') !== "IMAGE") {
        setAttr(element, 'role', "EMPTY");
        return;
    }
    for (let word in keyword_role) {
        const infer = inferRoleFromAttributes(element, word);
        if (infer !== undefined) {
            setAttr(element, 'role', infer);
            return infer;
        }
    }
    $(element).children().each(function () {
        correctCategories(this);
    })
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
 * Infer the role of an element from the content of its attributes and a given keyword.
 *
 * @param element
 * @param keyword
 * @returns {*}
 */
function inferRoleFromAttributes(element, keyword) {
    const attributes = element.attributes;
    //If it has attributes
    if (attributes !== undefined) {
        //Iterate
        for (let i = 0; i < attributes.length; i++) {
            //If the attribute contains this word return the word's role
            if (attributes[i].value.indexOf(keyword) > -1) {
                return keyword_role[keyword];
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