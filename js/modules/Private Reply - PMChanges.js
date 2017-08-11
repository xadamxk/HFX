var debug = false;
var quoteStripping = false;
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
}

function stripQuotes() {
    // PM Quote Remover - updated by myself
    // Credit to Snorlax (http://userscripts-mirror.org/scripts/source/185414.user.js)
    textarea = $("#message_new");
    var origMessage = textarea.val();
    // 
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
    // Add new line on page load
    $("#message_new").val($("#message_new").val() + "\n");
    // Add Signature by default
    $("#message_new").val($("#message_new").val() + "\n" + sigStr);
    // Onclick Event
    $('#showSignature').on("click", function () {
        if ($("#showSignature").is(':checked')) {
            // get value & add it to message body
            $("#message_new").val($("#message_new").val() + "\n" + sigStr);
        }
        else {
            // Remove if it exists
            var tempSig = $("#message_new").val();
            if (tempSig.includes(sigStr)) {
                $("#message_new").val(tempSig.replace(sigStr, ""));
                // All Hail StackOverflow (http://stackoverflow.com/a/5497333)
                var pos = $("#message_new").val().lastIndexOf('\n');
                $("#message_new").val($("#message_new").val().substring(0, pos) + $("#message_new").val().substring(pos + 1));
            }
        }
    });
    // Update to fix bugs
    $('.pmTextChange').on("click", function () {
        console.log($(this).attr("id"));
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
    // Add Salutation
    $("#message_new").val(salutationText + "\n\n" + $("#message_new").val());
    // Onclick Event
    $('#showSalutation').on("click", function () {
        if ($("#showSalutation").is(':checked')) {
            // get value & add it to message body
            $("#message_new").val(salutationText + "\n\n" + $("#message_new").val());
        }
        else {
            // Remove if it exists
            var tempSal = $("#message_new").val();
            if (tempSal.includes(salutationText)) {
                $("#message_new").val(tempSal.replace(salutationText, ""));
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
    return $(".quick_keys").find("strong:contains('" + string + "')").parent().parent().parent();
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