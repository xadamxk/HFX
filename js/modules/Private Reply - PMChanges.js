var debug = false;
var quoteStripping = false;
var prettyPMs = false;
var signatureEnable = false;
var signatureText = "";
var salutationEnable = false;
var salutationText = "";
var trackingLinks = false;
getPMChanges();

// Set vars equal to saved settings
function getPMChanges() {
    chrome.storage.sync.get("PMChanges", function (data) {
        if (!chrome.runtime.error) {
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        switch (key) {
                            case "PMChangesQuoteStripping": if (value) { quoteStripping = value }
                                break;
                            case "PMChangesPrettyPMs": if (value) { prettyPMs = value }
                                break;
                            case "PMChangesSalutationEnable": if (value) { salutationEnable = value }
                                break;
                            case "PMChangesSalutationText": if (salutationEnable) { salutationText = value }
                                break;
                            case "PMChangesSignatureEnable": if (value) { signatureEnable = value }
                                break;
                            case "PMChangesSignatureText": if (signatureEnable) { signatureText = value }
                                break;
                            case "PMChangesTrackingLinksEnable": if (value) { trackingLinks = value }
                                break;
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })

            });
            injectPMChanges();
        }
    });
}
function injectPMChanges() {
    if (location.href.includes("/private.php?action=send")) {
        if (quoteStripping) { stripQuotes() }
        if (salutationEnable) { pmSalutation() }
        if (signatureEnable) { pmSignature() }
    }
    else if (location.href.includes("/private.php?action=tracking")) {
        if (trackingLinks) { messageTracking() }
    }
    else if (location.href.includes("/private.php?action=read&pmid=")) {
        if (prettyPMs) { injectPrettyPMs() }
    }
}

function injectPrettyPMs() {
    var finalArray;
    finalArray = parsePMPretty();
    //debugPrint(finalArray);
    prettyPMDisplay(finalArray);
}

function prettyPMDisplay(finalArray) {
    var tempHTML, bubbleList = [], i, user;
    user = getUser();
    bubbleList.push('<table class="fixed" border="0" width=95% align="center" cellpadding="3">');
    bubbleList.push('<col width=50%>');
    bubbleList.push('<col width=50%>');
    for (i = 0; i < finalArray.length; i++) {
        bubbleList.push('<tr>');
        if (finalArray[i][0] == user) {
            if (finalArray[i][1] == 1) {
                bubbleList.push('<td></td><td><div class="pm_bubble_right_unread" width="49%" align="right"><b>' + finalArray[i][0] + ' Wrote:</b><br>' + finalArray[i][2].join('\n') + '</div></td>');
            } else {
                bubbleList.push('<td></td><td><div class="pm_bubble_right_read" width="49%" align="right"><b>' + finalArray[i][0] + ' Wrote:</b><br>' + finalArray[i][2].join('\n') + '</div></td>');
            }
        } else {
            if (finalArray[i][1] == 1) {
                bubbleList.push('<td><div class="pm_bubble_left_unread" width=45%><b>' + finalArray[i][0] + ' Wrote:</b><br>' + finalArray[i][2].join('\n') + '</div></td><td></td>');
            } else {
                bubbleList.push('<td><div class="pm_bubble_left_read" width="45%"><b>' + finalArray[i][0] + ' Wrote:</b><br>' + finalArray[i][2].join('\n') + '</div></td><td></td>');
            }
        }
        bubbleList.push('</tr>');
    }
    // Append changes
    $("#pid_").append(bubbleList.join(''));
    // PM Bubble CSS
    var pm_bubble_right_unread = {
        "border-radius": "5px",
        "border": "1px solid black",
        "width": "98%",
        "padding": "5px",
        "text-align": "left",
        "float": "right",
        "background-color": "#A3E3A3",
        "color": "#000000"
    }
    var pm_bubble_right_read = {
        "border-radius": "5px",
        "border": "1px solid black",
        "width": "98%",
        "padding": "5px",
        "text-align": "left",
        "float": "right",
        "background-color": "#A3AAA3",
        "color": "#333333"
    }
    var pm_bubble_left_unread = {
        "border-radius": "5px",
        "border": "1px solid black",
        "width": "98%",
        "padding": "5px",
        "float": "left",
        "background-color": "#E3A3A3",
        "color": "#000000"
    }
    var pm_bubble_left_read = {
        "border-radius": "5px",
        "border": "1px solid black",
        "width": "98%",
        "padding": "5px",
        "float": "left",
        "background-color": "#AAA3A3",
        "color": "#333333"
    }
    // Right - Unread
    $(".pm_bubble_right_unread").css(pm_bubble_right_unread);
    // Right - Read
    $(".pm_bubble_right_read").css(pm_bubble_right_read);
    // Left - Unread
    $(".pm_bubble_left_unread").css(pm_bubble_left_unread);
    // Left - Read
    $(".pm_bubble_left_read").css(pm_bubble_left_read);
}

function parsePMPretty() {
    var tempArray = [], originalAuthor, authorList = [], i, docSplit, newAuthor, finalArray = [], tempvar, quoteLink;
    docSplit = document.getElementsByClassName("post_body")[0].innerHTML;
    docSplit = trimString(docSplit);
    docSplit = replaceAll(docSplit, ">", ">\n");
    docSplit = replaceAll(docSplit, "</blockquote>", "\n</blockquote>");
    docSplit = docSplit.split('\n');

    //debugPrint(docSplit);

    originalAuthor = getThreadOP(document.getElementsByClassName("post_author")[0].innerHTML).split(']')[1].split('[')[0];
    tempArray[tempArray.length] = [originalAuthor, 1, []];
    authorList.push(originalAuthor);
    //debugPrint("Current status of temparray: "+tempArray);

    for (i = 0; i < docSplit.length; i++) {
        if (docSplit[i].indexOf("Wrote:</cite>") != -1 && docSplit[i - 1].indexOf("<cite>") != -1) {
            newAuthor = docSplit[i].split(" Wrote:")[0];
            if (tempArray.length == 1 && tempArray[0][2].length > 0) {
                tempvar = tempArray.pop();
                finalArray.push(tempvar);
                tempArray.push([originalAuthor, 1, []]);
            }
            tempArray.push([newAuthor, 0, []]);
            authorList.push(newAuthor);
        } else if (docSplit[i].indexOf("Quote:</cite>") != -1 && docSplit[i - 1].indexOf("<cite>") != -1) {
            newAuthor = 'Unattributed Quote';
            if (tempArray.length == 1 && tempArray[0][2].length > 0) {
                tempvar = tempArray.pop();
                finalArray.push(tempvar);
                tempArray.push([originalAuthor, 1, []]);
            }
            tempArray.push([newAuthor, 0, []]);
            authorList.push(newAuthor);
        } else if (docSplit[i].indexOf('hr style="width: 20%;background: #000') != -1) {
            tempvar = tempArray.pop();
            finalArray.push(tempvar);
            return finalArray;
        } else if (docSplit[i].indexOf("Wrote:") != -1) {
            if (docSplit.length >= 2) {
                if (docSplit[i - 2].indexOf('span') != -1) {
                    newAuthor = docSplit[i].split(' Wrote:')[0];
                    quoteLink = '/' + docSplit[i].split('="')[1].split('" ')[0].split('/')[3];
                    if (tempArray.length == 1 && tempArray[0][2].length > 0) {
                        tempvar = tempArray.pop();
                        finalArray.push(tempvar);
                        tempArray.push([originalAuthor, 1, []]);
                        tempArray.push([newAuthor, 1, ['<small><i>Quoted post from <a href="' + quoteLink + '">here</a></i></small>']]);
                    } else {
                        tempArray.push([newAuthor, 0, ['<small><i>Quoted post from <a href="' + quoteLink + '">here</a></i></small>']]);
                    }
                    authorList.push(newAuthor);
                } else {
                    tempArray[tempArray.length - 1][2].push(docSplit[i]);
                }
            } else {
                tempArray[tempArray.length - 1][2].push(docSplit[i]);
            }
        } else if (docSplit[i].indexOf("</blockquote>") != -1) {
            tempvar = tempArray.pop();
            authorList.pop();
            finalArray.push(tempvar);
        } else if (docSplit[i] != "" && docSplit[i].indexOf("<blockquote>") != 0 && docSplit[i].indexOf("<cite>") != 0 && docSplit[i].indexOf("<br>") != 0) {
            if (i >= 1) {
                if (docSplit[i - 1].indexOf("<span") != 0 || docSplit[i - 1].indexOf('style=') != -1) {
                    tempArray[tempArray.length - 1][2].push(docSplit[i]);
                }
            } else {
                tempArray[tempArray.length - 1][2].push(docSplit[i]);
            }
        }
    }
    tempvar = tempArray.pop();
    finalArray.push(tempvar);
    return finalArray;
}

function stripQuotes() {
    // PM Quote Remover - updated by myself
    // Credit to Snorlax (http://userscripts-mirror.org/scripts/source/185414.user.js)

    // Determine proper selector
    if ($('#message_new').length) {
        textarea = $("#message_new");
    } else {
        textarea = $("#message");
    }
    
    var origMessage = textarea.val();
    // some crazy regex
    replace = textarea.val().replace(/^(\[quote=(?:(?!\[quote=)[\s\S]*?))\[quote=[\s\S]+\[\/quote\]\s*([\s\S]+?\[\/quote\]\s*)$/g, "$1$2\n\n");
    textarea.val(replace);
    $(".tborder tr:last td:last span")
        .append($('<input>').attr({ type: 'checkbox', name: 'options[loadMessage]', id: 'quoteStrip' }).addClass("checkbox loadMessage pmTextChange").prop('checked', true))
        .append($("<strong>").text("Strip Quotes: "))
        .append($('<label>').text("remove all quotes but the last.")
        .append("<br>"));
    $('#quoteStrip').on("click", function () {
        if ($(this).is(':checked')) {
            textarea.val(replace);
        }
        else {
            textarea.val(origMessage);
        }
    });
}

function pmSignature() {
    var sigStr = "";
    if (signatureText.includes("|||")) {
        sigStr = signatureText.replaceAll("|||", "\n");
    }
    else {
        sigStr = signatureText;
    }
    //console.log(sigStr);
    // Append option for signature
    $(".tborder tr:last td:last span")
        .append($('<input>').attr({ type: 'checkbox', name: 'options[enableSignature]', id: 'showSignature' }).addClass("checkbox enableSignature pmTextChange").prop('checked', true))
        .append($("<strong>").text("PM Signature: "))
        .append($('<label>').text("add predefined text to the end of your PMs.")
        .append("<br>"));
    // Determine proper selector
    var textarea;
    if ($('#message_new').length) {
        textarea = $("#message_new");
    } else {
        textarea = $("#message");
    }
    // Add new line on page load
    textarea.val(textarea.val() + "\n");
    // Add Signature by default
    textarea.val(textarea.val() + "\n" + sigStr);
    // Onclick Event
    $('#showSignature').on("click", function () {
        if ($("#showSignature").is(':checked')) {
            // get value & add it to message body
            textarea.val(textarea.val() + "\n" + sigStr);
        }
        else {
            // Remove if it exists
            var tempSig = textarea.val();
            if (tempSig.includes(sigStr)) {
                textarea.val(tempSig.replace(sigStr, ""));
                // All Hail StackOverflow (http://stackoverflow.com/a/5497333)
                var pos = textarea.val().lastIndexOf('\n');
                textarea.val(textarea.val().substring(0, pos) + textarea.val().substring(pos + 1));
            }
        }
    });
    // Update to fix bugs
    $('.pmTextChange').on("click", function () {
        //console.log($(this).attr("id"));
    });
}

function pmSalutation() {
    // Append option for salutation
    $(".tborder tr:last td:last span")
        .append($('<input>').attr({ type: 'checkbox', name: 'options[enableSalutation]', id: 'showSalutation' })
            .addClass("checkbox enableSalutation pmTextChange").prop('checked', true))
        .append($("<strong>").text("PM Salutation: "))
        .append($('<label>').text("add predefined text to the beginning of your PMs.")
        .append("<br>"));
    // Determine proper selector
    var textarea;
    if ($('#message_new').length) {
        textarea = $("#message_new");
    } else {
        textarea = $("#message");
    }
    // Add Salutation
    textarea.val(salutationText + "\n\n" + textarea.val());
    // Onclick Event
    $('#showSalutation').on("click", function () {
        if ($("#showSalutation").is(':checked')) {
            // get value & add it to message body
            textarea.val(salutationText + "\n\n" + textarea.val());
        }
        else {
            // Remove if it exists
            var tempSal = textarea.val();
            if (tempSal.includes(salutationText)) {
                textarea.val(tempSal.replace(salutationText, ""));
            }
        }
    });
}

function messageTracking() {
    // Read tbody
    var readTable = getTrackingTableBody('Read Messages');
    trackingTableLinks(readTable);
    // Unread tbody
    var unreadTable = getTrackingTableBody('Unread Messages');
    trackingTableLinks(unreadTable);
}

function trackingTableLinks(table) {
    table.find("tr").each(function (index) {
        var messageID;
        if ($(this).find(".checkbox").attr("name") !== undefined) {
            $(this).find("td:eq(1)").html('<a href="https://hackforums.net/private.php?action=read&pmid=' +
                                          (parseInt($(this).find(".checkbox").attr("name").replace(/\D/g, '')) + 1) + '">' +
                                          $(this).find("td:eq(1)").text() + '</a>');
        }
    });
}

function getTrackingTableBody(string) {
    return $("#content").find("strong:contains('" + string + "')").parent().parent().parent();
}

// ------------------------------ Functions ------------------------------
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function updatePMText(elementID) {
    switch (elementID) {
        case "quoteStrip": {
            // TODO: Use global variables for strings
        }
            break;
        case "showSalutation": "";
            break;
        case "showSignature": "";
            break;
    }
}

function replaceAll(str, find, replace) {
    /* I didn't write this, but it's damn useful */
    return str.replace(new RegExp(find, 'g'), replace);
}

function trimString (str) {
    /* Also didn't write this, but it's very useful and so elegant! */
    return (str.replace(/^\s\s*/, '')).replace(/\s\s*$/, '');
}

function getThreadOP(htmlCode) { // HOLDER2
    var infoHolder, uid, author, authorString, finalHTML, inc;

    if (htmlCode.indexOf('<div id="content">') != -1) {
        htmlCode = htmlCode.split('<div id="content">')[1];
    } else { }
    infoHolder = htmlCode.split('largetext">')[1].split('</span')[0];
    infoHolder = infoHolder.replace(" ", "").replace("<strong>", "").replace("</strong>", "");

    uid = infoHolder.split('uid=')[1].split('">')[0];

    author = infoHolder.replace("</a>", "");
    author = author.split(">");
    author = author[author.length - 1];

    authorString = "[url=http://www.hackforums.net/member.php?action=profile&uid=" + uid + "]" + author + "[/url]";

    return authorString;
}

function getUser() {
    return document.getElementById('panel').innerHTML.split('uid=')[1].split('">')[1].split('</a')[0];
}