var debug = false;
var postOptionsPoTEnable = false;
var postOptionsPostsEnable = false;
var postOptionsThreadsEnable = false;
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
    var threadID = "";
    $("input[type=hidden]").each(function () {
        if ($(this).attr("name") == "tid") {
            threadID = $(this).attr("value");
        }
    });
    $("#posts > table").each(function (index) {
        var usernameUID = $(this).find(".post_author > strong > span > a").attr('href').replace(/\D/g, '');
        // Posts on Thread
        if (postOptionsPoTEnable) {
            var potLinkConst = "showthread.php?tid=" + threadID + "&mode=single&uid=";
            // Append button
            $(this).find(".author_buttons").append($("<a>")
                .attr({ "title" : "Posts on Thread" , "href" : potLinkConst + usernameUID })
                .text("PoT")
                .css({ "cursor": "default", "margin-right": "5px" })
                .addClass("bitButton"));
        }
        // Threads
        if (postOptionsThreadsEnable) {
            const potLinkConst = "search.php?action=finduserthreads&uid=";
            // Append button
            $(this).find(".author_buttons").append($("<a>")
                .attr({ "title": "User's Threads", "href": potLinkConst + usernameUID })
                .text("Threads")
                .css({ "cursor": "default", "margin-right" : "5px" })
                .addClass("bitButton"));
        }
        // Posts
        if (postOptionsPostsEnable) {
            const potLinkConst = "search.php?action=finduser&uid=";
            // Append button
            $(this).find(".author_buttons").append($("<a>")
                .attr({ "title": "User's Posts", "href": potLinkConst + usernameUID })
                .text("Posts")
                .css({ "cursor": "default", "margin-right": "5px" })
                .addClass("bitButton"));
        }
    });
}