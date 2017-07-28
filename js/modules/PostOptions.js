var debug = false;
var postOptionsPoTEnable = false;
var postOptionsPostsEnable = false;
var postOptionsThreadsEnable = false;
var pmChangesPMFromPostEnable = false;
getPostOptions();

// Set vars equal to saved settings
function getPostOptions() {
    chrome.storage.sync.get("PostOptions", function (data) {
        if (!chrome.runtime.error) {
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        switch (key) {
                            case "PostOptionsPoTEnable": if (value) { postOptionsPoTEnable = value }
                                break;
                            case "PostOptionsThreadsEnable": if (value) { postOptionsThreadsEnable = value }
                                break;
                            case "PostOptionsPostsEnable": if (value) { postOptionsPostsEnable = value }
                                break;
                            case "PMChangesPMFromPostEnable": if (value) { pmChangesPMFromPostEnable = value }
                                break;
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })

            });
            enablePostOptions();
        }
    });
}

function enablePostOptions() {
    // Get Thread ID
    var threadID = "";
    $("input[type=hidden]").each(function () {
        if ($(this).attr("name") == "tid") {
            threadID = $(this).attr("value");
        }
    });
    // Loop through each post
    $("#posts > table").each(function (index) {
        var usernameUID = $(this).find(".post_author > strong > span > a").attr('href').replace(/\D/g, '');
        var usernameName = $(this).find(".post_author > strong > span > a").text();
        // Posts on Thread
        if (postOptionsPoTEnable) {
            var potLinkConst = "showthread.php?tid=" + threadID + "&mode=single&uid=";
            // Append button
            $(this).find(".author_buttons").append($("<a>")
                .attr({ "title" : "Posts on Thread" , "href" : potLinkConst + usernameUID })
                .text("PoT")
                .css({ "cursor": "pointer", "margin-right": "5px" })
                .addClass("bitButton"));
        }
        // Threads
        if (postOptionsThreadsEnable) {
            const potLinkConst = "search.php?action=finduserthreads&uid=";
            // Append button
            $(this).find(".author_buttons").append($("<a>")
                .attr({ "title": "User's Threads", "href": potLinkConst + usernameUID })
                .text("Threads")
                .css({ "cursor": "pointer", "margin-right": "5px" })
                .addClass("bitButton"));
        }
        // Posts
        if (postOptionsPostsEnable) {
            const potLinkConst = "search.php?action=finduser&uid=";
            // Append button
            $(this).find(".author_buttons").append($("<a>")
                .attr({ "title": "User's Posts", "href": potLinkConst + usernameUID })
                .text("Posts")
                .css({ "cursor": "pointer", "margin-right": "5px" })
                .addClass("bitButton"));
        }
        // PM From Post
        if (pmChangesPMFromPostEnable) {
            var postLink;
            var myPostKey = document.getElementsByTagName('head')[0].innerHTML.split('my_post_key = "')[1].split('";')[0];
            var threadTitle = $(".navigation").find(".active").text();

            // TODO: Grab part of post text to include in PM body?

            if (threadTitle.length > 50) {
                threadTitle = threadTitle.substring(0, 50);
            }
            var newPMButton = $("<a>")
                .attr({
                    "title": "PM From Post", "href": "javascript:void(0);",
                    "onclick": "javascript:document.getElementById('HFXPMFromPost"+index+"').style.display = " +
                        "(document.getElementById('HFXPMFromPost" + index + "').style.display == 'block') ? 'none' : 'block'",
                    "class" : "HFXPMFromPost"
                })
                .text("Quick PM")
                .css({ "cursor": "pointer"})
                .addClass("bitButton");
            // Replace PM button
            $(this).find(".bitButton:eq(0)").replaceWith(newPMButton);

            // Get Post Link
            $(this).find(".smalltext > strong > a:eq(0)").each(function (index) {
                postLink = $(this).attr("href");
            });
            // HTML for PM Popup
            var formaction = '<div id="HFXPMFromPost' + index + '" style="display:none;"><form action="private.php" ' +
                'method="post" name="input" target="_blank"><input type="hidden" name="action" value="do_send" />';
            var formpmid = '<input type="hidden" name="pmid" value="" />';
            var formdo = '<input type="hidden" name="do" value="" />';
            var formicon = '<input type="hidden" name="icon" value="" />';
            var formmy_post_key = '<input type="hidden" name="my_post_key" value="' + myPostKey + '" />';
            var formuid = '<input type="hidden" name="uid" value="' + usernameName + '" />';
            var formto = '<strong>Recipients: </strong><input type="text" class="textbox" name="to" id="to" ' +
                ' tabindex="3" value="' + usernameName + '" readonly />';
            var formsubject = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Subject:</strong><input type="text" class="textbox" ' +
                ' name="subject" size="40" maxlength="85" tabindex="3" value="Regarding Your Post: ' + threadTitle + '"/><br />';
            var formsend = '<input type="submit" class="button" name="submit" value="Send Message" tabindex="9" accesskey="s" />' +
                '<input type="submit" class="button" name="saveasdraft" value="Save as Draft" tabindex="10" />' +
                '<input type="submit" class="button" name="preview" value="Preview" tabindex="11" />';
            var formmessage = '<textarea name="message" rows="7" cols="90" tabindex="3">' +
                '[size=x-small]Sent from [url=https://www.hackforums.net/' + postLink + ']your post[/url]. [/size]\n\n ' +
                ''+
                '</textarea><br />';
            var formchecks = '<div align="center"><input type="checkbox" class="checkbox" name="options[signature]" value="1" tabindex="5" checked="checked" />' +
                'Signature - <input type="checkbox" class="checkbox" name="options[savecopy]" value="1" tabindex="7" checked="checked" />' +
                'Save a Copy - <input type="checkbox" class="checkbox" name="options[readreceipt]" value="1" tabindex="8" checked="checked" />Request Read Receipt</div><br />';
            var formsend = '<div align="center"><input type="submit" class="button PMFromPostButton" name="submit" value="Send Message" tabindex="9" accesskey="s" />' +
                '<input type="submit" class="button PMFromPostButton" name="saveasdraft" value="Save as Draft" tabindex="10" />' +
                '<input type="submit" class="button PMFromPostButton" name="preview" value="Preview" tabindex="11" /></div><br />';
            var spacing ='<br /><br />';
            var finalform = formaction + formpmid + formdo + formicon + formmy_post_key + formuid + formto + formsubject +
                formmessage + formchecks + formsend + spacing + '</form></div>';
            // CSS for PostFromPM Buttons
            //$(".PMFromPostButton").css({ "margin-right": "5px" });
            // Append PostFromPM Popup
            $(this).find(".HFXPMFromPost").before(finalform);

        }
    });
}