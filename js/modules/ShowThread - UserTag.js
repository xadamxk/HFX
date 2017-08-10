var debug = false;
var enableUserTags = false;
enableUserTag();

function enableUserTag() {
    chrome.storage.sync.get("UserTag", function (data) {
        if (!chrome.runtime.error) {
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        switch (key) {
                            case "UserTagEnable": if (value) { enableUserTags = value }
                                break;
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })

            });
            // Run function
            if (enableUserTags)
                injectUserTag();
        }
    });
}

// called on ThreadView
function injectUserTag() {
    // Scan for existing tag data
    scanUserTag();

    // Append New Post Button
    $("#quick_reply_submit").after($("<input>").attr({
        "type": "button",
        "class": "button",
        "value": "Post Reply",
        "tabindex": "2",
        "id": "newPostButton"
    }));

    // Hide Post Button
    $("#quick_reply_submit").hide();
    
    // Append checkbox to enable UserTag
    $("#quickreply_e tr:eq(0) td:eq(0) span:eq(0)")
        .append($("<label>")
                .append("<br>")
                .append($("<input>").attr("type", "checkbox").attr("id", "enableMentions"))
                .append(" ")
                .append($("<strong>").text("Notify Mentioned Users")));
    // Check 'Enable Mentions' by default
    //$("#enableMentions").prop('checked', true);
    // Event for New Post Button Click
    $("#newPostButton").click(function () {
        // Check character count > 25
        if ($("#message").val().length > 25) {
            // Check for mentions
            if ($("#enableMentions").prop('checked')) {
                // Get up to first 5 mentioned usernames
                var quotedNameList = getQuoteMentions($("#message").val());
                // Remove duplicates from name list
                quotedNameList = removeDuplicateNames(quotedNameList); 
                // Get post body?
                var threadTitle = $(".navigation").find(".active").text();
                // Store locally
                chrome.storage.local.set({ "UserTagNameList": quotedNameList, "UserTagThreadTitle": threadTitle }, function () {
                    // Call original method to make post
                    $("#quick_reply_submit").click();
                    window.location.reload(true);
                });
            } else {
                // Make post
                $("#quick_reply_submit").click();
            }
        } else {
            window.alert("This message is too short.\nPlease enter a message longer than 25 characters.");
        }
    });

}

// called on threadview
function scanUserTag() {
    var blacklistedUserList = ["Omniscient", "Eagle 95", "King of Hearts", "Skorp", "Minimalist", "Maxim"];
    // Check memory for queued tag
    chrome.storage.local.get(["UserTagNameList", "UserTagThreadTitle"], function (result) {
        // Exit if keys not found
        if ((result.UserTagNameList === undefined || result.UserTagThreadTitle === undefined) & debug) {
            console.log("UserTagging: No previous data.");
            return;
        }
        // Get most recent post link
        var postLink = "";
        $(".smalltext > strong > a").each(function (index) {
            postLink = $(this).attr("href");
            postLink = postLink.replace("showthread.php?tid=", "");
        });
        // PM users
        var myPostKey = document.getElementsByTagName('head')[0].innerHTML.split('my_post_key = "')[1].split('";')[0];
        var recipientString = "";
        var tempThreadTitle = result.UserTagThreadTitle;
        var threadTitleCharLimit = 29;
        if (tempThreadTitle.length > threadTitleCharLimit) {
            tempThreadTitle = tempThreadTitle.substring(0, threadTitleCharLimit);
            tempThreadTitle = tempThreadTitle + "..";
        }
        var subjectString = "Mention: '" + tempThreadTitle + "' at: " + postLink;
        var messageString = "You've been mentioned in the following thread: [list]"+
            "[url=https://hackforums.net/showthread.php?tid=" + postLink + "]" +
            tempThreadTitle + "[/url][/list]\n\n[size=xx-small]" +
            "Message provided by Chrome Extension: HFX[/size]";
        // Filter blacklisted users
        var tempUsernameList = result.UserTagNameList;
        for (index1 = 0; index1 < tempUsernameList.length; index1++) {
            for (index2 = 0; index2 < blacklistedUserList.length; index2++) {
                if (tempUsernameList[index1] == blacklistedUserList[index2]) {
                    tempUsernameList.splice(index1,1);
                }
            }
        }
        // Limit 5 to Recipient List
        for (i = 0; i < tempUsernameList.length; i++) {
            // Only keep first 5 for PM
            if (i < 5)
                tempUsernameList[i] = tempUsernameList[i];
            else
                tempUsernameList.splice(i,1);
        }
        // Format Recipient List
        recipientString = tempUsernameList.join(",");
        //// Send PM
        $.ajax({
            method: "POST",
            url: "https://hackforums.net/private.php",
            data: {
                my_post_key: myPostKey,
                to: recipientString,
                subject: subjectString,
                message: messageString,
                'options[savecopy]': "1",
                'options[readreceipt]': "1",
                action: "do_send",
                submit: "Send Message"
            }
        })
            .done(function (msg) {
                // Clear from memory
                chrome.storage.local.remove(["UserTagNameList", "UserTagThreadTitle"], function (result) {
                    // Key was removed
                    if (debug)
                        console.log("Previous info was removed.");
                })
            })
            .fail(function (msg) {
                if (debug)
                    console.log("Failed to remove previous queue.");
            });
    });
}

function getQuoteMentions(textInput) {
    // Get list of usernames that are quoted in post
    var usernameList = [];
    if (textInput.includes("[quote='")) {
        var quoteArray = textInput.split("[quote='");
        var loopIndex = 0;
        for (i = 0; i < quoteArray.length; i++) {
            if (i > 0) {
                var tempUsername = quoteArray[i].substring(0, quoteArray[i].indexOf("'"));
                usernameList.push(tempUsername);
            }
        }
    }
    return usernameList;
}

function removeDuplicateNames(namesList) {
    // Thank you stackoverflow: https://stackoverflow.com/a/9229932
    uniqueNames = [];
    $.each(namesList, function (i, el) {
        if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
    });
    return uniqueNames;
}