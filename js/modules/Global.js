// Context menu example: https://stackoverflow.com/a/13783536/2694643
var debug = false;
var enableHideLocation = false;
var enableDenyPMReceipt = false;
var enableEasyCite = false;
var enableUserNote = false;
var enableHFTB = false;
var stickToolbar = false;
var hftbHomeLink = "https://hackforums.net/usercp.php";
var hftbFav1Text = "";
var hftbFav1Link = "";
var hftbFav2Text = "";
var hftbFav2Link = "";
var hftbFav3Text = "";
var hftbFav3Link = "";
var hftbFav4Text = "";
var hftbFav4Link = "";
var hftbFav5Text = "";
var hftbFav5Link = "";
var hftbFav6Text = "";
var hftbFav6Link = "";
var hftbFav7Text = "";
var hftbFav7Link = "";
var userNoteInfo;
var noteBubbleCSS = {
    "border-radius": "5px",
    "border": "1px solid 888",
    "padding": "1px 4px 2px 4px",
    "background-color": "#ddd", // FA909E (Darker Pink) FDCBC7 (Light Pink) B6E5CB (Green) DDD (Light Gray)
    "color": "#000000",
    "font-size": "12px",
    "font-weight": "bold",
    "cursor": "pointer",
    "text-shadow": "none"
};
var addNewPosts = false;
var SFWMode = false;
var injectHFXBadge = true;
var revertGreenStars = false;
var revertPurpleStars = false;
var hfxAlerts = true;
var enablePMBadges = false;
getGlobalSettings();

// Set vars equal to saved settings
function getGlobalSettings() {
    chrome.storage.sync.get("GlobalChanges", function (data) {
        if (!chrome.runtime.error) {
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        switch (key) {
                            case "GlobalChangesHideLocationEnabled": if (value) { enableHideLocation = value; }
                                break;
                            case "GlobalChangesDenyPMReceiptEnabled": if (value) { enableDenyPMReceipt = value; }
                                break;
                            case "GlobalChangesEasyCiteEnabled": if (value) { enableEasyCite = value; }
                                break;
                            case "GlobalChangesHFTBEnabled": if (value) { enableHFTB = value; }
                                break;
                            case "GlobalChangesHFTBStickyEnabled": if (value) { stickToolbar = value; }
                                break;
                            case "GlobalChangesHFTBFav1Text": hftbFav1Text = value;
                                break;
                            case "GlobalChangesHFTBFav1Link": hftbFav1Link = value;
                                break;
                            case "GlobalChangesHFTBFav2Text": hftbFav2Text = value;
                                break;
                            case "GlobalChangesHFTBFav2Link": hftbFav2Link = value;
                                break;
                            case "GlobalChangesHFTBFav3Text": hftbFav3Text = value;
                                break;
                            case "GlobalChangesHFTBFav3Link": hftbFav3Link = value;
                                break;
                            case "GlobalChangesHFTBFav4Text": hftbFav4Text = value;
                                break;
                            case "GlobalChangesHFTBFav4Link": hftbFav4Link = value;
                                break;
                            case "GlobalChangesHFTBFav5Text": hftbFav5Text = value;
                                break;
                            case "GlobalChangesHFTBFav5Link": hftbFav5Link = value;
                                break;
                            case "GlobalChangesHFTBFav6Text": hftbFav6Text = value;
                                break;
                            case "GlobalChangesHFTBFav6Link": hftbFav6Link = value;
                                break;
                            case "GlobalChangesHFTBFav7Text": hftbFav7Text = value;
                                break;
                            case "GlobalChangesHFTBFav7Link": hftbFav7Link = value;
                                break;
                            case "GlobalChangesUserNotes": if (value) { enableUserNote = value; }
                                break;
                            case "GlobalChangesNewPostLinks": if (value) { addNewPosts = value; }
                                break;
                            case "GlobalChangesSFWMode": if (value) { SFWMode = value; }
                                break;
                            case "GlobalRevertGreenStars": if (value) { revertGreenStars = value; }
                                break;
                            case "GlobalRevertPurpleStars": if (value) { revertPurpleStars = value; }
                                break;
                            case "GlobalHFXAlerts": if (value) { hfxAlerts = value; }
                                break;
                            case "GlobalUnreadBadgeCount": if (value) { enablePMBadges = value; }
                                break;
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })
                injectGlobalChanges();
            });

        }
    });
}

function injectGlobalChanges() {
    if (injectHFXBadge) {
        injectHFXBadges();
    }
    if (enableHideLocation) {
        injectHideLocation();
    }
    if (enableDenyPMReceipt) {
        injectDenyPMReceipt();
    }
    if (enableEasyCite) {
        injectEasyCite();
    }
    if (enableHFTB) {
        injectHFTB();
    }
    if (enableUserNote) {
        injectUserNote();
    }
    if (addNewPosts) {
        injectNewPosts();
    }
    if (SFWMode) {
        injectSFWMode();
    }
    if (revertGreenStars) {
        injectRevertGreenStars();
    }
    if (revertPurpleStars) {
        injectRevertPurpleStars();
    }
    if (enablePMBadges) {
        injectPMBadges();
    }
    if (hfxAlerts) {
        var savedAlertKey = "...";
        chrome.storage.sync.get("HFXAlert", function (data) {
            if (!chrome.runtime.error) {
                $.each(data, function (index, data1) {
                    $.each(data1, function (index1, data2) {
                        $.each(data2, function (key, value) {
                            switch (key) {
                                case "HFXAlertKey": if (value) { savedAlertKey = value; }
                                    break;
                                default: //console.log("ERROR: Key not found.");
                                    break;
                            }
                        })
                    })
                });
                injectHFXAlerts(savedAlertKey);
            }
        });
    }
}

function injectPMBadges() {
    // Check, log title?, then check again in 5 mins
    var numPMs = 0;
    if ($("#pm_notice").length > 0) {
        var pmAlert = $("#pm_notice");
        var hasNumber = /\d/;
        var numStr = hasNumber.test(pmAlert.find("strong").text());
        if (numStr)
            numPMs = parseInt(pmAlert.find("strong").text().replace(/[^0-9\.]/g, ''));
        else
            numPMs = 1;
        //
        updateHFXBadge(numPMs);
    } else {
        updateHFXBadge("");
    }
    
    // Function to check PM's in background
    var interval = 1000 * 60 * 5; // 1000 milli * 60 secs * x = minutes (No lower than 5 or timeout!)
    setInterval(function () {
        var pmCount = updateBadgeCount();
        if (pmCount > 0) {
            updateHFXBadge(pmCount);
        } else {
            updateHFXBadge("");
        }
    }, interval);
    
    
}

function updateHFXBadge(newBadge) {
    chrome.runtime.sendMessage({ greeting: newBadge.toString() }, function (response) {
        //console.log(response.farewell);
    });
}

function updateBadgeCount() {
    // Update this?
    var numPMs = 0;
    var notificationBodyText;
    var notificationBodyLink;
    var titleString;
    $.ajax({
        url: "https://hackforums.net/usercp.php",
        cache: false,
        async: false,
        success: function (response) {
            var pmAlert = $(response).find("#pm_notice");
            var hasNumber = /\d/;
            var numStr = hasNumber.test(pmAlert.find("strong").text());
            if (numStr)
                numPMs = parseInt(pmAlert.find("strong").text().replace(/[^0-9\.]/g, ''));
            else if (pmAlert.find("strong").text().includes("one"))
                numPMs = 1;
            notificationBodyText = $(pmAlert).find("div:eq(1) a:eq(1)").text() + " from " + $(pmAlert).find("div:eq(1) a:eq(0)").text();
            notificationBodyLink = $(pmAlert).find("div:eq(1) a:eq(1)").attr("href");
            titleString = numPMs + " Unread Message";
            if (numPMs > 1) { titleString = titleString + "s"; }
        }
    });
    // Desktop Notifications
    if (false && numPMs > 0) {
        notifyMe(titleString, notificationBodyText, notificationBodyLink);
    }
    //console.log("Number of unread PM's: "+numPMs);
    return numPMs;
}

function injectHFXAlerts(savedAlertKey) {
    // Get saved key (date)
    var loadedAlertKey;
    var loadedAlertValue;
    $.get('https://raw.githubusercontent.com/xadamxk/HFX/master/Alert.json' + "?nc=" + Math.random(), function (responseText) {
        $.each(responseText, function (key1, value1) {
                if (key1 == "AlertKey"){
                    //
                    loadedAlertKey = value1;
                } else if (key1 == "AlertValue"){
                    loadedAlertValue = value1;
                }
        });
        // Display alert
        if (savedAlertKey !== loadedAlertKey) {
            $("#content").prepend($("<div>").addClass("HFXAlert").attr("id", "HFXAlert")
                .append($("<div>").addClass("float_right").attr("id", "DismissHFXAlert")
                    .append($("<a>").attr("href", "javascript:void(0);")
                        .append($("<img>").attr("src", chrome.extension.getURL("/images/dismiss_notice.png")).attr("title", "Dismiss HFX Alert"))))
                .append($("<div>").append($("<b>").append(loadedAlertValue)))
                );
            // Alert CSS
            $("#HFXAlert").css({
                "background": "#333333",
                "border": "2px solid #f4d639",
                "text-align": "center",
                "padding": "7px 20px",
                "margin-bottom": "15px",
                "font-size": "13px"
            });
            // Event to save key
            $("#DismissHFXAlert").click(function () {
                // Fadeout
                $("#HFXAlert").fadeOut("slow", function () {
                });
                // Save close
                chrome.storage.sync.set({
                    HFXAlert: [{ 'HFXAlertKey': loadedAlertKey }]
                }, function () {
                    // Save Confirmation
                });
            });
        } else {
            // Same key, don't display alert
            //console.log("Same key - no alert");
        }
    }, "json"); // End get
}

function injectRevertPurpleStars() {
    $("img").each(function (index) {
        if ($(this).attr('src').indexOf('/images/blackreign/ub3rstar.gif') != -1) {
            $(this).attr('src', 'https://hackforums.net/images/blackreign/star.gif');
        }
    });
}

function injectRevertGreenStars() {
    $("img").each(function (index) {
        if ($(this).attr('src').indexOf('/images/blackreign/star-d2.png') != -1) {
            $(this).attr('src', 'https://hackforums.net/images/blackreign/star.gif');
        }
    });
}

function injectHFXBadges() {
    if (location.href.includes("/member.php?action=profile&uid=") ||
        location.href.includes("/showthread.php?tid=") | 
        location.href.includes("/showthread.php?pid=")) {
            readBadgeList();
        }
}

function injectBadgesProfile(badgeList) {
    var uid = document.URL.split('uid=')[1];
    // Append HFX Badges row
    $("strong:contains(Awards:)").parent().parent()
        .after($("<tr>")
            .append($("<td>").addClass("trow2")
                .append($("<strong>").text("HFX Trophies:")))
            .append($("<td>").addClass("trow2").attr("id", "hfxBadgeContainer")));
    var selectingElement = $("#hfxBadgeContainer");
    searchBadgeList(badgeList, selectingElement,uid);
}

function injectBadgesThread(badgeList) {
    $(".post").each(function (indexPost) {
        var uid = $(this).find(".author_information > strong > span > a").attr('href').match(/\d+/)[0];
        $(this).find($(".author_information:eq(" + indexPost + ") > .smalltext")
            .after($("<div>").addClass("hfxBadgeContainer")));
        var selectingElement = $(".hfxBadgeContainer:eq(" + indexPost + ")");
        searchBadgeList(badgeList, selectingElement, uid);
        // If found, append them
        $(this).find($(".post_author:eq(" + indexPost + ") > .smalltext").after($("<br>")));
        
    });
}

function searchBadgeList(badgeList, selectingElement, uid) {
    var testersLink, supportersLink, donatorsLink, contributorsLink;

    var testerIcon = chrome.extension.getURL("/images/trophy_testers3.png");
    var supporterIcon = chrome.extension.getURL("/images/trophy_supporters2.png");
    var donatorIcon = chrome.extension.getURL("/images/trophy_donators.png");
    var contributorIcon = chrome.extension.getURL("/images/trophy_contributer.png");

    // Loop through badgeList for matches
    $.each(badgeList, function (key1, value1) {
        $.each(value1, function (key2, value2) {
            switch (key1) {
                case "testersLink":
                    //testersLink = value2;
                    testersLink = testerIcon;
                    break;
                case "supportersLink":
                    //supportersLink = value2;
                    supportersLink = supporterIcon;
                    break;
                case "donatorsLink":
                    //donatorsLink = value2;
                    donatorsLink = donatorIcon;
                    break;
                case "contributorsLink":
                    //contributorsLink = value2;
                    contributorsLink = contributorIcon;
                    break;
            }
        });
    });
    $.each(badgeList, function (key1, value1) {
        $.each(value1, function (key2, value2) {
            switch (key1) {
                case "testers":
                    if (uid == value2) {
                        selectingElement
                            .append($("<img>").attr(
                            {
                                "src": testersLink,
                                "title": "HFX Alpha Tester"
                            }).css({ "padding-right": "5px" }));
                    }
                    break;
                case "supporters":
                    if (uid == value2) {
                        selectingElement
                            .append($("<img>").attr(
                            {
                                "src": supportersLink,
                                "title": "HFX Supporter"
                            }).css({ "padding-right": "5px" }));
                    }
                    break;
                case "donators":
                    if (uid == value2) {
                        selectingElement
                            .append($("<img>").attr(
                            {
                                "src": donatorsLink,
                                "title": "HFX Donator"
                            }).css({ "padding-right": "5px" }));
                    }
                    break;
                case "contributors":
                    if (uid == value2) {
                        selectingElement
                            .append($("<img>").attr(
                            {
                                "src": contributorsLink,
                                "title": "HFX Contributor"
                            }).css({ "padding-right": "5px" }));
                    }
                    break;

            }
        });
    });
}

function readBadgeList() {
    //
    var badgeList;
    // Credit to Emylbus for no cache method
    $.get('https://raw.githubusercontent.com/xadamxk/HFX/master/Badges.json'+ "?nc=" + Math.random(), function (responseText) {
        if (location.href.includes("/member.php?action=profile&uid=")) {
            //var badgeList = $.parseJSON(responseText);
            injectBadgesProfile(responseText);
        } else if (location.href.includes("/showthread.php?tid=") | location.href.includes("/showthread.php?pid=")) {
            //var badgeList = $.parseJSON(responseText);
            injectBadgesThread(responseText);
        }
    }, "json");
}

function injectNewPosts() {
    // Search
    if (location.href.includes("/search.php")) {
        if ($("td span strong a:contains('Post')").html().length == 4) {
            // Add New Post Links
            $("img[src*='folder'][src*='new']").each(function (i) {
                var $current = $(this).parent().next().next().children().first();
                $current.prepend('<a href="showthread.php?tid=' + $current.html().match(/tid\=(\d*)/)[1] +
                    '&amp;action=newpost" title="Go to first unread post" class="quick_jump">&#9658;</a>');
            });
        }
    }
    // Main Page
    else if (location.href.includes("/index.php") || document.title == "Hack Forums") {
        $("a[href*='action=lastpost']").each(function (i) {
            $(this).before('<a href="showthread.php?tid=' + $(this).attr('href').match(/tid\=(\d*)/)[1] +
                '&amp;action=newpost" title="Go to first unread post" class="quick_jump">&#9658;</a>&nbsp;');
        });
    }
}

function injectUserNote() {
    if (location.href.includes("/member.php?action=profile&uid=")) {
        //
        profileTagger();
    } else if (location.href.includes("/showthread.php?tid=") | location.href.includes("/showthread.php?pid=")) {
        //
        threadTagger();
    }
}

function threadTagger() {
    var i, apHolder, tagNameHolder, tagNameKeys, uid;
    // Get List of Keys/Values
    chrome.storage.sync.get("UserNoteStorage", function (data) {
        if (!chrome.runtime.error) {
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        switch (key) {
                            case "UserNote": userNoteInfo = value;
                                break;
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })

            });
            if (userNoteInfo == null || userNoteInfo == "") {
                var userNoteArray = [];
                userNoteInfo = [["1306528", "HFX Developer"], ["1", "Mr. BossMan"]];
            }
            // Append Tag - Loop Through Posts
            $(".post").each(function (indexPost) {
                matchFound = false;
                uid = $(this).find(".author_information > strong > span > a").attr('href').match(/\d+/)[0];
                // Loop each saved user note
                $(userNoteInfo).each(function (index) {
                    //console.log(userNoteInfo[index][0] == uid && userNoteInfo[index][1] != '');
                    if (userNoteInfo[index][0] == uid && userNoteInfo[index][1] != '') {
                        tag = userNoteInfo[index][1];
                        matchFound = true;
                    }
                });
                if (!matchFound) {
                    tag = "+";
                }
                // Append Tag
                $(".post_author:eq(" + indexPost + ")").find("br:eq(0)")
                    .before("&nbsp;")
                    .before($("<span>").text(tag).attr("id", "profileTag" + indexPost)
                    .css(noteBubbleCSS)
                    .addClass("tagBubbles"));
                $("#profileTag" + indexPost).click(function () {
                    tagEditorThread(indexPost);
                });

            });
        }
    });
}

function injectSFWMode()
{
    $("img").hide();
}

function tagEditorThread(indexPost) {
    var newTag = "", tagNameHolder, uid, newNameFound = true;
    $(".post").each(function (matchingIndex) {
        if (indexPost == matchingIndex) {
            uid = $(this).find(".author_information > strong > span > a").attr('href').match(/\d+/)[0];
        }
    });
    // Get List of Keys/Values - Loop each saved user note
    $(userNoteInfo).each(function (index) {
        if (userNoteInfo[index][0] == uid) {
            newTag = userNoteInfo[index][1];
        }
    });
    newTag = prompt('Enter tag for user: ', newTag);
    // If null, reset label, cancel method
    if (newTag == null) {
        //$("#profileTag" + indexPost).text("+");
        return;
    }
    $(".post").each(function (indexPost) {
        // Loop each saved user note
        $(userNoteInfo).each(function (index) {
            if (userNoteInfo[index][0] == uid) {
                userNoteInfo[index][1] = newTag;
                //setUserNote(userNoteInfo);
                $("#profileTag:eq(" + indexPost + ")").text(newTag);
                newNameFound = false;
            }
        });
    });
    // Save Changes
    if (newNameFound) {
        userNoteInfo.push([uid, newTag]);
    }
    setUserNote(userNoteInfo);
    if (newTag == '' || newTag == null) {
        $("#profileTag" + indexPost).text("+");
    } else {
        $("#profileTag" + indexPost).text(newTag);
    }

}

function profileTagger() {
    var tag = 'Click to Add Note', uid, tagNameHolder;
    uid = document.URL.split('uid=')[1];
    // Get List of Keys/Values
    chrome.storage.sync.get("UserNoteStorage", function (data) {
        if (!chrome.runtime.error) {
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        switch (key) {
                            case "UserNote": userNoteInfo = value;
                                break;
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })

            });
            if (userNoteInfo == null || userNoteInfo == "") {
                var userNoteArray = [];
                userNoteInfo = [["1306528", "HFX Developer"], ["1", "Mr. BossMan"]];
            }
            // Loop each saved user note
            $(userNoteInfo).each(function (index) {
                if (userNoteInfo[index][0] == uid && userNoteInfo[index][1] != '') {
                    tag = userNoteInfo[index][1];
                }
            });
            // ------------------------------------------- PROFILE NOTE HERE ----------------------------------------------------
            // Append Tag
            $('.largetext strong span')
                .append("&nbsp;")
                .append($("<span>").text(tag).attr("id", "profileTag")
                .css(noteBubbleCSS)
                .addClass("tagBubbles"));
            $("#profileTag").click(function () {
                tagEditorProfile();
            });
        }
    });
}

function tagEditorProfile() {
    var newTag, tagNameHolder, uid, newNameFound = true;
    uid = document.URL.split('uid=')[1];
    // Get List of Keys/Values - Loop each saved user note
    $(userNoteInfo).each(function (index) {
        if (userNoteInfo[index][0] == uid) {
            newTag = userNoteInfo[index][1];
        }
    });
    newTag = prompt('Enter tag for user: ', newTag);
    // If null, reset label, cancel method
    if (newTag == null) {
        //$("#profileTag").text("Click to Add Note");
        return;
    }
    // Save User Note - Loop through again
    $(userNoteInfo).each(function (index) {
        // Updates Exisiting
        if (userNoteInfo[index][0] == uid) {
            userNoteInfo[index][1] = newTag;
            newNameFound = false;
        }
    });
    if (newNameFound) {
        userNoteInfo.push([uid, newTag]);
    }
    setUserNote(userNoteInfo);
    if (newTag == '' || newTag == null) {
        $("#profileTag").text("Click to Add Note");
    } else {
        $("#profileTag").text(newTag);
    }
}

function setUserNote(userNoteInfo) {
    var indexesToRemove = [];
    count = 0;
    if (debug) { console.log(userNoteInfo) }
    // Remove empty notes - find indexes
    $(userNoteInfo).each(function (index) {
        if (userNoteInfo[index][1] == "") {
            indexesToRemove[count] = index;
            count++;
        }
    });
    // Remove empty notes - remove indexes
    for (var i = indexesToRemove.length - 1; i >= 0; i--) {
        userNoteInfo.splice(indexesToRemove[i], 1);
    }
    // Save changes
    chrome.storage.sync.set({
        UserNoteStorage:
            [{ 'UserNote': userNoteInfo }]
    }, function () {
        // Save Confirmation
        //console.log(userNoteInfo);
    });
}

function injectHFTB() {
    // Inject font-awesome.css (Thank you: http://www.freeformatter.com/javascript-escape.html)
    $("head").append('<link ' + "href='https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/font-awesome\/4.7.0\/css\/font-awesome.css'" + 'rel="stylesheet" type="text/css">');
    $("head").append('<link ' + "href='https:\/\/cdn.rawgit.com\/xadamxk\/HF-Userscripts\/9bf86deb\/JS%20Libraries\/tinybox.css'" + 'rel="stylesheet" type="text/css">');
    // Create toolbar
    createStickyHeader();
    // Stick toolbar
    stickStickyHeader();
    // Buddy event listener 
    //$("#leftSticky a:eq(1)").click(function () {showBuddyContainer();});
    // Append quick links to toolbar
    appendQuickLinks();
    // Add spacers to toolbar
    addSpacersToHeader();
    // Check current page (color if found on toolbar)
    checkforCurrentPage();
}

function createStickyHeader() {
    var headerHeight = "18px";
    var showIconLabels = false;
    // Append Toolbar
    $("#panel").append($("<div>").attr("id", "Sticky")
                       .css("height", "22px").css("background-color", "#1f1f1f")
                       .css("border-style", "solid").css("border-color", "#f9f9f9").css("border-width", "0px 0px 1px 0px")
                       .css("align-items", "center").css("z-index", "100"));
    // ----------------------------------------- LEFT -----------------------------------------
    $("#Sticky").append($("<div>").attr("id", "leftSticky").addClass("float_left").text("")
                        .css("padding-left", "5px").css("display", "block").css("height", headerHeight));
    // Home
    $("#leftSticky").append($("<a>").attr("href", hftbHomeLink).attr("onClick", "").attr("title", "Home")
                            .append($("<i>").attr("id", "homeLeftSticky").addClass("fa fa-home fa-lg")));
    // Buddies
    //$("#leftSticky").append($("<a>").attr("href", "#Buddies").attr("onclick", "").append($("<i>").attr("id", "buddiesLeftSticky").addClass("fa fa-users")));
    // Note
    //$("#leftSticky").append($("<a>").attr("href", "#QuickNote").attr("onClick", "").append($("<i>").attr("id", "savedLeftSticky").addClass("fa fa-sticky-note")));
    // Top
    $("#leftSticky").append($("<a>")
        .append($($("<i>").addClass("fa fa-arrow-up")))
        .attr("href", "#top").attr("onClick", ""));
    // Bottom
    $("#leftSticky").append($("<a>")
        .append($($("<i>").addClass("fa fa-arrow-down")))
        .attr("href", "#footer").attr("onClick", ""));
    // New PM
    var shortcut4NewPM = false;
    var shortcut4Text = "PM Inbox";
    var shortcut4Link = "https://hackforums.net/private.php";
    if ($("#pm_notice").length > 0) {
        // Active Icons
        shortcut4NewPM = true;
        shortcut4Text = $("#pm_notice div:eq(1) a:eq(1)").text() + " from " + $("#pm_notice div:eq(1) a:eq(0)").text();
        shortcut4Link = $("#pm_notice div:eq(1) a:eq(1)").attr("href");
    }
    // PMs
    $("#leftSticky").append($("<a>").attr("href", shortcut4Link).attr("title", shortcut4Text)
                            .append($("<i>").attr("id", "pmLeftSticky").addClass("fa fa-comments fa-lg")));
    // If new PM & enableActiveIcons
    if (shortcut4NewPM) {
        $("#pmLeftSticky").css("color", "#ff3b30");
    }
    // Settings (left)
    //$("#leftSticky").append($("<a>").attr("href", "#Settings").attr("onClick", "").attr("title", "Settings")
    //                        .append($("<i>").attr("id", "settingsleftSticky").addClass("fa fa-cog fa-lg")));
    // Right
    $("#Sticky").append($("<div>").attr("id", "rightSticky").css("float", "right").css("height", headerHeight));
    // ----------------------------------------- RIGHT -----------------------------------------
    // View New Posts (right)
    $("#rightSticky").append($("<a>").text("New Posts").attr("href", "https://hackforums.net/search.php?action=getnew").attr("onClick", ""));
    // Your Threads (right)
    $("#rightSticky").append($("<a>").text("Your Threads").attr("href", "https://hackforums.net/search.php?action=finduserthreads&uid=" + getUID()).attr("onClick", ""));
    // Your Posts (right)
    $("#rightSticky").append($("<a>").text("Your Posts").attr("href", "https://hackforums.net/search.php?action=finduser&uid=" + getUID()).attr("onClick", ""));
    // Icon Labels
    if (showIconLabels) {
        var count = 0;
        // Left
        $("#leftSticky a:eq(0) i:eq(0)").after(" Home");
        $("#leftSticky a:eq(1) i:eq(0)").after(" Buddies");
        $("#leftSticky a:eq(2) i:eq(0)").after(" Notepad");
        $("#leftSticky a:eq(3) i:eq(0)").after(" Messages");
        $("#leftSticky a:eq(4) i:eq(0)").after(" Settings");
    }
}

function stickStickyHeader() {
    $(document).ready(function () {
        if (stickToolbar) {
            $("#Sticky").sticky();
        }
    });
}

function injectHideLocation() {
    // Credit: Emlybus
    if (document.URL.indexOf("www.") != -1) {
        $.get("https://www.hackforums.net/misc.php", function () { });
    } else {
        $.get("https://hackforums.net/misc.php", function () { });
    }
}

function injectDenyPMReceipt() {
    if ($("#pm_notice").length > 0) {
        $("#pm_notice div:eq(1)")
                .append($("<a>")
                        .append($("<i>").text(" [deny receipt]").css("font-size", "10px"))
                        .attr("href", $("#pm_notice div:eq(1) a:eq(1)").attr("href") + "&denyreceipt=1"));
    }
}

function injectEasyCite() {
    // Add's color to the username (based on the user's group) when citing a user's profile.
    var profileColors = true; // (Default: true)
    // Add's color to the username (based on the user's group) when citing a user's post.
    var usernameColors = false; // (Default: false)
    // Hyperlink's the username when citing a user's post
    var usernameLink = false; // (Default: false)
    // ------------------------------ ON PAGE LOAD ------------------------------
    // Default
    var citationLink = location.href;
    var citationDescripion = $(".navigation").find(".active").text();
    var citationText = citationDescripion;
    // Append Cite Button
    $(".navigation").append($("<a>").text("Cite").addClass("bitButton").css("cursor", "pointer").attr("id", "citeButton")); //.css("background","#333333")
    // Profile Awards
    if (location.href.includes("/myawards.php?uid=")) {
        citationDescripion = $(".quick_keys").find("strong:contains('My Awards : ') a").text() + "'s " + $(".navigation").find(".active").text();
        citationText = citationDescripion;
    }
        // Sections
    else if (location.href.includes("/forumdisplay.php?fid=")) {
        citationDescripion = $(".navigation").find(".active").text() + " Section";
        citationText = citationDescripion;
    }
        // Profiles
    else if (location.href.includes("/member.php?action=profile")) {
        citationDescripion = $(".navigation").find(".active").text().replace("Profile of ", "");
        if (profileColors)
            citationText = "[color=" + rgb2hex($("fieldset").find(".largetext strong span").css("color")) + "]" + citationDescripion + "[/color]";
        else
            citationText = +citationDescripion;
    }
        // Threads
    else if (location.href.includes("/showthread.php?tid=") | location.href.includes("/showthread.php?pid=")) {
        // Thread - not first post
        if (location.href.includes("&pid=")) {
            citationLink = location.href.substring(0, location.href.indexOf("&pid="));
        }
        // Thread - not first page
        if (location.href.includes("&page=")) {
            citationLink = location.href.substring(0, location.href.indexOf("&page="));
        }
        citationText = $(".navigation").find(".active").text();
        citationDescripion = citationText;
        // Posts - each post bit on page
        $(".post").each(function (index, element) {
            //var tsButton = $(element);
            //var postMessage = tsButton.parents("table.tborder");
            var postMessage = $(this);
            // Grab UID & create button
            $(element).find(".author_buttons").append($("<a>")
                .attr({ "title": "Cite Post", "id": "citeButton" + index, "href": "javascript:void(0);" })
                .text("Cite")
                .css({ "cursor": "pointer", "margin-right": "5px" })
                .addClass("bitButton"));
            // temp vars
            var tempcitationDescripion;
            var tempcitationLink;
            var tempcitationText;
            // onClick for cite buttons
            $("body").on("click", "#citeButton" + index, function (e) {
                e.preventDefault();
                // Foreach a in smalltext in postbit
               // If first post
                if ($(".post_head:eq(" + index + ") > .float_right:eq(0) > strong > a").text() == ("#1")) {
                    tempcitationLink = "https://hackforums.net/" + $(".post_head:eq(" + index + ") > .float_right:eq(0) > strong > a").attr('href');
                        //console.log(tempcitationLink);
                    tempcitationDescripion = $(".navigation").find(".active").text() + " by " + $(".author_information:eq(" + index + ") strong span a span").text();
                        //console.log(tempcitationDescripion);
                    tempcitationText = $(".navigation").find(".active").text() + "[/b][/url] by [b][url=" + $(".author_information:eq(" + index + ") strong span a").attr("href") + "]" + $(".author_information:eq(" + index + ") strong span a span").text();
                        //console.log(tempcitationText);
                    }
                        // Every other post
                else if ($(".post_head:eq(" + index + ") > .float_right:eq(0) > strong > a").text().includes("#")) {
                    tempcitationLink = "https://hackforums.net/" + $(".post_head:eq(" + index + ") > .float_right:eq(0) > strong > a").attr('href');
                    tempcitationDescripion = $(".author_information strong span a span:eq(" + index + ")").text() + "'s Post";
                        // User profile link
                        if (usernameLink)
                            tempcitationLink = $(".author_information:eq(" + index + ") strong span a").attr("href");
                        // post Username Info
                        var postUsername = $(".author_information:eq(" + index + ") strong span a span").text()
                        var postUsernameLink = "https://hackforums.net/" + $(".author_information:eq(" + index + ") strong span a").attr("href");
                        // User color
                        if (usernameColors) {
                            var userColor = rgb2hex($(postMessage).find(".largetext a:eq(0) span").css('color'));
                            // Color + User link
                            if (usernameLink)
                                tempcitationText = "[color=" + userColor + "]" + postUsername + " [/url][/color][color=white]'s[/color][url=" + postUsernameLink + "]" + "[/b][b] Post";
                                // Color + No Link
                            else
                                tempcitationText = "[color=" + userColor + "]" + postUsername + "[/color]'s Post";
                        }
                            // No color
                        else {
                            // No color + User link
                            if (usernameLink)
                                tempcitationText = postUsername + "[/url]'s[/b][url=" + postUsernameLink + "][b] Post";
                                // No color + No link
                            else
                                tempcitationText = postUsername + "'s Post";
                        }
                    }
                prompt("Citation: " + tempcitationDescripion, "[b][url=" + tempcitationLink + "]" + tempcitationText + "[/url][/b]");
            }); // end of posts loop
        });
    }
        // Help Docs /myawards.php?awid=
    else if (location.href.includes("/misc.php?action=help")) {
        citationDescripion = "Help Documents - " + $(".navigation").find(".active").text();
        citationText = citationDescripion;
    }
        // Deal Dispute
    else if (location.href.includes("/disputedb.php")) {
        citationDescripion = "Deal Dispute - " + $(".navigation").find(".active").text();
        citationText = citationDescripion;
    }
        // Reputation Report
    else if (location.href.includes("/reputation.php?uid=") || location.href.includes("/repsgiven.php?uid=")) {
        citationDescripion = $("#content").find("strong:contains('Reputation Report for')").text().replace("Reputation Report for ", "") + " 's " + $(".navigation").find(".active").text();
        citationText = citationDescripion;
    }
        // Search Page Results
    else if (location.href.includes("/search.php?action=results")) {
        citationDescripion = "" + $(".navigation").find(".active").text();
        citationText = citationDescripion;
    }
        // Search Page
    else if (location.href.includes("/search.php") && !location.href.includes("?action=results")) {
        // Append button
        $("form").find("strong:contains(Search in Forum)").append(" ")
            .append($("<a>")
            .attr({ "title": "Cite All Sections", "href": "javascript:void(0);", "id": "citeAllSections" })
            .text("Cite")
            .css({ "cursor": "pointer", "margin-right": "5px" })
            .addClass("bitButton"));

        $("#citeAllSections").click(function () {
            // Output
            console.log($("#citeAllSectionsOutput").length == 0);
            if ($("#citeAllSectionsOutput").length == 0) {
                var selectTable = $("form").find("table");
                $("form").after($("<textarea>").val(citeAllSections()).css("width", selectTable.css("width")).attr("id", "citeAllSectionsOutput")).after("<br>");
                $("#citeAllSectionsOutput").select();
                //prompt("All Sections:",citeAllSections());
            }
        });
    }
    $("#citeButton").click(function (event) {
        var target = $(event.target);
        if (target.is("a")) {
            prompt("Citation: " + citationDescripion, "[url=" + citationLink + "][b]" + citationText + "[/b][/url]");
        }
    });
}
// Grab all section values function
function citeAllSections() {
    var baseStr = "";
    // Grab values
    $("select[name='forums[]'] option").each(function (index) {
        if ($(this).attr("value") !== "all")
            baseStr = baseStr + "[url=https://hackforums.net/forumdisplay.php?fid=" + $(this).attr("value") + "]" + $(this).text() + "[/url]\n";
    });
    return baseStr;
}

function getUID() {
    var profileLink = "";
    if ($("#panel a:eq(0)").length > 0)
        profileLink = $("#panel a:eq(0)").attr("href");
    if (profileLink.includes("hackforums.net/member.php?action=profile&uid="))
        profileLink = profileLink.replace(/\D/g, '');
    return profileLink;
}

function showBuddyContainer() {
    TINY.box.show({ iframe: 'https://hackforums.net/misc.php?action=buddypopup', mask: false, boxid: 'buddyBox', width: 300, height: 350, fixed: true, closejs: function () { $("#buddiesLeftSticky").css("color", "white"); } });
    $("#buddyBox").css("background-color", "rgba(7,41,72,0.4)"); //.tbox for no frame
    $("#buddyBox").draggable();
    // Toggle color of buddy
    if ($("#buddyBox").length > 0)
        $("#buddiesLeftSticky").css("color", "#1ff182");
}

function appendQuickLinks() {
    if ($("#Sticky").length > 0) {
        // Fav 1
        if (hftbFav1Text && hftbFav1Link) {
            $("#leftSticky").append($("<a>").attr("href", hftbFav1Link).text(hftbFav1Text).addClass("currentLink"));
        }
        // Fav 2
        if (hftbFav2Text && hftbFav2Link) {
            $("#leftSticky").append($("<a>").attr("href", hftbFav2Link).text(hftbFav2Text).addClass("currentLink"));
        }
        // Fav 3
        if (hftbFav3Text && hftbFav3Link) {
            $("#leftSticky").append($("<a>").attr("href", hftbFav3Link).text(hftbFav3Text).addClass("currentLink"));
        }
        // Fav 4
        if (hftbFav4Text && hftbFav4Link) {
            $("#leftSticky").append($("<a>").attr("href", hftbFav4Link).text(hftbFav4Text).addClass("currentLink"));
        }
        // Fav 5
        if (hftbFav5Text && hftbFav5Link) {
            $("#leftSticky").append($("<a>").attr("href", hftbFav5Link).text(hftbFav5Text).addClass("currentLink"));
        }
        // Fav 6
        if (hftbFav6Text && hftbFav6Link) {
            $("#leftSticky").append($("<a>").attr("href", hftbFav6Link).text(hftbFav6Text).addClass("currentLink"));
        }
        // Fav 7
        if (hftbFav7Text && hftbFav7Link) {
            $("#leftSticky").append($("<a>").attr("href", hftbFav7Link).text(hftbFav7Text).addClass("currentLink"));
        }
    }
}

function addSpacersToHeader() {
    var iconLabelSpacer = "-";
    // Left
    var numLeftElements = $("#leftSticky a").length;
    $("#leftSticky a").each(function (index) {
        if ((index) == 3) {
            $(this).after($("<span>").text(" | ").removeAttr('href'));
        }
        else if ((index + 1) == numLeftElements) {
            // Don't append anything
        }
        else {
            $(this).after($("<span>").text(" " + iconLabelSpacer + " ").removeAttr('href'));
        }
    });
    // Right
    var numRightElements = $("#rightSticky a").length;
    $("#rightSticky a").each(function (index) {
        if ((index) == 4) {
            $(this).after($("<span>").text(" | ").removeAttr('href'));
        }
        else if ((index + 1) == numRightElements) {
            // Don't append anything
        }
        else {
            $(this).after($("<span>").text(" " + iconLabelSpacer + " ").removeAttr('href'));
        }
    });
}

// Each Quick Link
function checkforCurrentPage() {
    $(".currentLink").each(function (index) {
        if ($(this).attr("href") === window.location.href) {
            $(this).css("color", "#F4B94F");
            return false;
        }
    });
    if (window.location.href == (hftbHomeLink))
        $("#homeLeftSticky").css("color", "#F4B94F");
}

// Desktop notifications
function notifyMe(Title, Comment, Link) {
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(function () {
            if (Notification.permission !== "granted") {
                window.alert("HFX Extension: Please allow desktop notifications!");
            } else {
                notififyMe("", Comment, Link);
            }
        });
    }
    else {
        var notification = new Notification(Title, {
            icon: 'https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/Quick%20Rep/NotificationIcon.png',
            requireInteraction: true,
            body: Comment,
        });

        notification.onclick = function () {
            window.location.href = Link;
            notification.close();
        };
        //setTimeout(function() { notification.close(); });
    }
}

// Credit: https://jsfiddle.net/mushigh/myoskaos/
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

function getType(p) {
    if (Array.isArray(p)) return 'array';
    else if (typeof p == 'string') return 'string';
    else if (p != null && typeof p == 'object') return 'object';
    else return 'other';
}