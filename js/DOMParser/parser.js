/**
 * Created by bozhidar on 04.11.17.
 *
 * Here there are methods used to parse the dome and add alt text
 */

// TODO: Make containers that have nothing in them EMPTY, not CONTAINERs
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
    "FORM": "FORM",
    "UL": "LIST",
    "OL": "LIST",
    "LI": "LIST ITEM",
    "INPUT": "INPUT",
    "SELECT": "DROPDOWN",
    "OPTION": "OPTION",
};

const keyword_role = {
    "menu" : "MENU",
    "nav" : "MENU",
    "header": "HEADER",
    "footer": "FOOTER",
};


function generateRoles() {
    const body = $('body');
    backPropagation(body);
    inputFormCategories(body);
    forwardPropagation(body);
    correctCategories(body);
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
            result += (value + " " + key + (value > 1 ? "S" : "") + ",");
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
    //Replace special tags
    if (["SCRIPT","FORM","SELECT"].indexOf(element.tagName) > -1) {
        setAttr(element, 'role', tag_role[element.tagName]);
        return;
    }
    if ($(element).attr('nested') === "EMPTY" && $(element).text().length > 0) {
        setAttr(element, 'role', "TEXT");
        return;
    }
    console.log(element);
    console.log(element.attributes);
    if ($(element).attr('nested') === "EMPTY" && $(element).text().length === 0 && $(element).attr('role') === "TEXT") {
        setAttr(element, 'role', "EMPTY");
        return;
    }

    for (let word in keyword_role) {
        const infer = inferRoleFromAttributes(element, word);
        if (infer !== undefined) {
            setAttr(element, 'role', infer);
        }
    }
    $(element).children().each(function () {
        correctCategories(this);
    })
}

/**
 * Create
 * @param element
 */
function inputFormCategories(element) {
    $(element).find('input').each(function () {
        const type = $(this).attr('type');
        setAttr(this, 'role', type.toUpperCase() + " INPUT");
        //Add label info
        if (this.id !== undefined && this.id.length > 0) {
            var info = $('label[for=' + this.id + ']').html();
            setAttr(this, 'role-info', info);
        }
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
    map.delete("LABEL");

    return map;
}

function getLabelsFromGoogle(base64Image) {
    let dfr = jQuery.Deferred();
    //todo; take me out
    let promise = makeRequest("AIzaSyByjaob_PYpShiOhTVv6ojGS1Igf39s8Yc");

    promise.done(function (response) {
        let out = response.responses[0];

        let logoAnnotations = out.logoAnnotations;
        if (logoAnnotations === undefined || logoAnnotations === null) {
            //do something
        }

        let labelAnnotations = out.labelAnnotations;
        if (labelAnnotations === undefined || labelAnnotations === null){
            //do something
        } else {
            out = keywordsFromGoogle();
        }

        let textAnnotations = out.textAnnotations;
        if (textAnnotations === undefined || textAnnotations === null){
            //do something
        }

        out = keywordsFromGoogle(response.responses[0].labelAnnotations);
        dfr.resolve(out);
    });
    return dfr;
}

/**
 *
 * @param {HTMLElement} element
 * @return {Promise} promise
 */
function buildRoleInfo(element) {
    //Handle images
    let dfd = jQuery.Deferred();
    if (element.nodeName === "IMG") { //$(element).attr('role') === 'IMAGE'/'TEXT'
        toDataURL(element).then(function(base64img){
            getLabelsFromGoogle(base64img).then(function(keywords) {
                element.setAttribute("role_info", keywords.join(","));
                dfd.resolve(keywords);
            });
        });
    } else if ($(element).attr('role') === 'TEXT') {

    } else {
        let keywordPromises = [];
        for (let child of element.children) {
            let promise = buildRoleInfo(child);
            keywordPromises.push(promise);
        }
        $.when.apply($, keywordPromises).done(function() {
            // do things that need to wait until ALL gets are done
            // debugger;
            // console.log(a, b, c);
            // keywordReduction(keywords);
            // element.setAttribute("role_info", keywords.join(","));
            let keywords = [];
            if (arguments.length > 0) {
                for (let i = 0; i < arguments.length; i++) {
                    for (let img = 0; img < arguments[i].length; img ++) {
                        keywords.push(arguments[i][img]);
                    }
                    // debugger;
                }
            }
            dfd.resolve(keywords);
        });
    }
    return dfd.promise();
}

function toDataURL(element) {
    let dfd = $.Deferred();
    dfd.resolve("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");
    //TODO: Add proper logic
    return dfd;
}

function buildAllRoleInfo() {
    buildRoleInfo($('body')[0]).then();
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
    //TODO: make me accept logos and text detection too
    const keywords = [];
    for (let response of responses) {
        keywords.push(new ImgKeyword(response.description, response.score));
    }
    return keywords;
}