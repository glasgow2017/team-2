/**
 * Created by bozhidar on 04.11.17.
 *
 * Here there are methods used to parse the dome and add alt text
 */

//databases fot the tags and sections
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
    "VIDEO": "VIDEO",
    "TABLE": "TABLE",
    "TR": "ROW",
    "TD": "CELL",
    "NOSCRIPT": "EMPTY",
    "SCRIPT": "EMPTY",

};

const keyword_role = {
    "menu" : "MENU",
    "nav" : "MENU",
    "header": "HEADER",
    "footer": "FOOTER",
};

/**
 * Main method that parses the DOM
 */
function generateRoles() {
    const body = $('body');
    
    //create the roles of the elements
    backPropagation(body);
    //correct the roles of the input forms
    inputFormCategories(body);
    //make the nested attribute
    forwardPropagation(body);
    //correct some of the roles
    correctRoles(body);
    //make a new nesting attribute change based on the updated roles
    forwardPropagation(body);

    emptyBackPropagation(body);
    //if there is already provided alt, use it
    transformAltToInfo(body);
}


/**
 * Transforms an existing alt attribute to role-info.
 *
 * @param element
 */
function transformAltToInfo(element) {
    if ($(element).attr('alt') !== undefined) {
        const alt = $(element).attr('alt').length;
        if (alt > 0) {
            setAttr(element, 'role_info', $(element).attr('alt'));
        }
    }
    doForChildren(element, transformAltToInfo);
}

/**
 * Iterate through the elements and set their children nodes.
 *
 * @param element
 */
function forwardPropagation(element) {
    const alt = getChildrenList(element);
    setAttr(element, 'nested', alt);
    //Do it for all children
    doForChildren(element, forwardPropagation);
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
        //Count all the children
        $(element).children().each(function () {
            childrenDescriptions = mergeMaps(childrenDescriptions, backPropagation(this));
        });

        //Form smart roles (IMAGE SECTION) or normal roles
        if(childrenDescriptions.size === 1 && childrenDescriptions.values().next().value !== 1) {
            setAttr(element, 'role', getRole(childrenDescriptions.keys().next().value, "SECTION") + " SECTION");
        } else {
            setAttr(element, 'role', getRole(element.tagName, "SECTION"));
        }
    }

    return childrenDescriptions;
}

/**
 * Special method for eliminating empty elements.
 *
 * @param element
 * @returns {Map}
 */
function emptyBackPropagation(element) {
    let childrenDescriptions = new Map();
    if($(element).children().length === 0) {
        //Set the role of the element (def = EMPTY)
        setAttr(element, 'role', getRole(element.tagName, "EMPTY"));
        childrenDescriptions.set(getRole(element.tagName, "EMPTY"), 1);
    } else {
        //Count all the children
        $(element).children().each(function () {
            childrenDescriptions = mergeMaps(childrenDescriptions, emptyBackPropagation(this));
        });

        //Form smart roles (IMAGE SECTION) or normal roles
        if(childrenDescriptions.size === 1 && childrenDescriptions.keys().next().value === "EMPTY" || childrenDescriptions.size === 0) {
            setAttr(element, 'role', "EMPTY");
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
 * Get role of an element from the database.
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
 * Corrects some special cases for roles.
 *
 * @param element
 * @returns {*}
 */
function correctRoles(element) {
    //console.log(element);
    //Replace special tags
    if (["SCRIPT","FORM","SELECT","NOSCRIPT","OPTION", "IFRAME", "LABEL"].indexOf(element.tagName) > -1) {
        setAttr(element, 'role', tag_role[element.tagName]);
        doForChildren(element, correctRoles);
        return;
    }

    //Remove span elements
    $(element).find("span").each(function(index) {
        const text = $(this).html();//get span content
        $(this).replaceWith(text);//replace all span with just content
    });

    //If element does not have any children but has meaningful text (<div>text</div>)
    if ($(element).attr('nested') === "EMPTY" && $(element).text().trim().length > 0) {
        setAttr(element, 'role', "TEXT");
        doForChildren(element, correctRoles);
        return;
    }
    //If elements does not have any children and no meaningful text make them empty
    if ($(element).attr('nested') === "EMPTY" && $(element).text().trim().length === 0 && $(element).attr('role') !== "IMAGE") {
        setAttr(element, 'role', "EMPTY");
        doForChildren(element, correctRoles);
        return;
    }

    //If any of the above cases then run the keyword search
    for (let word in keyword_role) {
        const infer = inferRoleFromAttributes(element, word);
        if (infer !== undefined) {
            setAttr(element, 'role', infer);
        }
    }

    doForChildren(element, correctRoles);
}

/**
 * Create roles for inputs.
 *
 * @param element
 */
function inputFormCategories(element) {
    $(element).find('input').each(function () {
        const type = $(this).attr('type');
        if (type !== undefined) {
            setAttr(this, 'role', type.toUpperCase() + " INPUT");
            //Add label info
            if (this.id !== undefined && this.id.length > 0) {
                var info = $('label[for=' + this.id + ']').html();
                setAttr(this, 'role_info', info);
            }
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
 * Returns all elements with a particular role, useful for searches.
 *
 * @param element
 * @param searchString
 * @returns {*|jQuery|HTMLElement}
 */
function returnSearchElement(element, searchString) {
    return $(element[0].tagName.toLowerCase() + ' [role="' + searchString.toUpperCase() + '"]');
}

/**
 * Helping method that executes a function on all children of an element.
 * @param element
 * @param f
 */
function doForChildren(element, f) {
    if ($(element).children().length > 0) {
        $(element).children().each(function() {f(this)});
    }
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
    map.delete("IFRAME");

    return map;
}

function getLabelsFromGoogle(base64Image) {
    let dfr = jQuery.Deferred();

    let promise = makeRequest("AIzaSyByjaob_PYpShiOhTVv6ojGS1Igf39s8Yc", base64Image);

    promise.done(function (response) {
        let out = response.responses[0];

        let labelAnnotations = out.labelAnnotations;

        out = keywordsFromGoogle(out.labelAnnotations);

        /**
         * come back later when you work
         *
        let logoAnnotations = out.logoAnnotations;
        if (logoAnnotations === undefined || logoAnnotations === null) {
            //do something
        }

        let textAnnotations = out.textAnnotations;
        if (textAnnotations === undefined || textAnnotations === null){
            //do something
        }
        */
        dfr.resolve(out);
    });
    return dfr;
}

function keywordsFromNLP(response) {
    return new TextKeyword("word", 5, 10);
}

function sendToNLPServer(text) {
    let dfr = $.Deferred();
    $.ajax({
        type: 'POST',
        beforeSend: function(request) {
            request.setRequestHeader("Content-Type", "application/json");
        },
        url: "http://34.241.43.16:8043/text",
        data: JSON.stringify({
            text: text
        }),
        contentType: "application/json",
        dataType: 'text',
        timeout: 3000
    }).done(function (response) {
        dfr.resolve(response);
    }).fail(function (response) {
        console.log(response);
    });
    return dfr;
}

/**
 * Can't believe I just used this code
 * @param ms
 */
function wait(ms){
    let start = new Date().getTime();
    let end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
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
                element.setAttribute("role_info", keywordReduction(keywords).join(","));
                dfd.resolve(keywords);
            });
        });
    } else if ($(element).attr('role') === 'TEXT') {
        const text = $(element).text();
        sendToNLPServer(text).then(function(response) {
            let keywords = keywordsFromNLP(response);
            element.setAttribute("role_info", keywordReduction(keywords).join(","));
            dfd.resolve(keywords);
        });

        // The NLP server doesn't like too many requests in a short period of time, so we have to block this thread for
        // a while to make sure that the responses arrive
        wait(550);
    } else {
        let keywordPromises = [];
        for (let child of element.children) {
            let promise = buildRoleInfo(child);
            keywordPromises.push(promise);
        }
        $.when.apply($, keywordPromises).done(function() {
            let keywords = [];
            if (arguments.length > 0) {
                for (let i = 0; i < arguments.length; i++) {
                    for (let img = 0; img < arguments[i].length; img ++) {
                        keywords.push(arguments[i][img]);
                    }
                }
            }
            element.setAttribute("role_info", keywordReduction(keywords).join(","));
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
    let limit = 5;
    keywords = [];
    //sort by word to merge identical labels
    keywords.sort(function (a, b) {
        if (! (a instanceof Keyword)) {
            if (!(a instanceof Keyword)) {
                throw "Illegal argument"
            }
            if (!(b instanceof Keyword)) {
                throw "Illegal argument"
            }
        }
        if (a.getWord() > b.getWord()) return -1;
        if (a.getWord() < b.getWord()) return 1;
        return 0;
    });
    //merge identical labels
    let newKeywords = [];
    for (let i = 0; i<keywords.length; i++) {
        if (newKeywords.length === 0) {
            newKeywords.push(keywords[i]);
        } else if (newKeywords[newKeywords.length-1].word === keywords[i].word) {
            newKeywords[newKeywords.length-1].rating += keywords[i].rating;
        } else {
            newKeywords.push(keywords[i]);
        }
    }
    keywords = newKeywords;
    //sort by proper metric
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