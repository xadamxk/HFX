var smartQuoteTextColor = "#111111"; // (Default: #111111)
// Quote Header Colors (Header of Quote Block)
var smartQuoteHeaderTextColor = "#000000"; // (Default: #000000)
var smartQuoteNotificationColor = "#FF3B30"; // (Default: #FF3B30)
// Quote Header Colors - Username Quoted
var smartQuoteHeaderMatchTextColor = "#000000"; // (Default: #000000)


// Debug
var debug = false;
var enableSmartQuote = false;
// Quote Body Colors (Entire Quote Block)
var smartQuoteBackgroundColor = "#adb1a1"; // (Default: #adb1a1)
// Notification Text - Username Quoted (Mention text at top of page)
var enableSmartQuoteMentionCount = false;
var smartQuoteHeaderBackgroundColor = "b1d8bf"; // (Default: #b1d8bf)
var smartQuoteHeaderMatchBackgroundColor = "CC3636"; // (Default: #CC3636)
enableSmartQuotes();

// Set vars equal to saved settings
function enableSmartQuotes() {
    chrome.storage.sync.get("SmartQuoteChanges", function (data) {
        if (!chrome.runtime.error) {
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        if (typeof key === undefined || typeof value === undefined) { return; }
                        switch (key) {
                            case "SmartQuotesEnabled": enableSmartQuote = value;
                                break;
                            case "SmartQuotesMentionCount": enableSmartQuoteMentionCount = value;
                                break;
                            case "SmartQuoteColorBody": smartQuoteBackgroundColor = value;
                                break;
                            case "SmartQuoteColorQuote": smartQuoteHeaderBackgroundColor = value;
                                break;
                            case "SmartQuoteColorMention": smartQuoteHeaderMatchBackgroundColor = value;
                                break;
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })

            });
            injectSmartQuotes();
        }
    });
}

function injectSmartQuotes() {
    var username = $("#panel strong a:eq(0)").text();
    var usernameCount = 0;
    if (debug) { console.log("Number of Quotes: " + $("*").find("blockquote").length); }
    if (enableSmartQuote) {
        if ($("*").find("blockquote").length > 0) {
            // Each Block Quote
            $("*").find("blockquote").each(function () {
                $(this)
                    .css("border-radius", "5px")
                    .css("border", "1px solid black")
                    .css("padding", "1px 4px 1px 4px")
                    .css("background-color", "#"+smartQuoteBackgroundColor)
                    .css("color", smartQuoteTextColor);
            });
            // Each Block Quote Header
            $("*").find("blockquote cite").each(function () {
                // Standard QuoteCite Settings
                $(this)
                    .css("border-bottom", "1px solid #999")
                    .css("padding", "2px 8px 2px 8px");
                // Username Quoted
                if ($(this).text().includes(username)) {
                    smartQuoteHeaderMatchTextColor = getColorByBgColor("#" + smartQuoteHeaderMatchBackgroundColor);
                    if (debug) { console.log("Username found."); }
                    $(this)
                        .css("background-color", "#" + smartQuoteHeaderMatchBackgroundColor)
                        .css("color", smartQuoteHeaderMatchTextColor)
                        .css("border-radius", "5px")
                        .css("border", "1px solid black")
                        .addClass("SmartQuoteMentionTitle");
                }
                    // No username match
                else {
                    smartQuoteHeaderTextColor = getColorByBgColor("#" + smartQuoteHeaderBackgroundColor);
                    $(this)
                        .css("background-color", "#"+smartQuoteHeaderBackgroundColor)
                        .css("color", smartQuoteHeaderTextColor)
                        .css("border-radius", "5px")
                        .css("border", "1px solid black")
                        .addClass("SmartQuoteStandardTitle");
                }
            });
        }
    }
    if (enableSmartQuoteMentionCount) {
        var username = $("#panel strong a:eq(0)").text();
        if ($("*").find("blockquote").length > 0) {
            $("*").find("blockquote cite").each(function () {
                // Username Quoted
                if ($(this).text().includes(username)) {
                    $(this).addClass("SmartQuoteMentionTitle");
                    usernameCount++;
                    if (debug) { console.log("Username found."); }
                }
                    // No username match
                else {
                    $(this).addClass("SmartQuoteStandardTitle");
                }
            });
        }
        var mentionBubbleCSS = {
            "display": "inline-block",
            "padding": "3px 4px",
            "font-size": "12px",
            "font-weight": "600",
            "line-height": "1",
            "border-radius": "2px",
            "border": "1px solid 888",
            "color": "#000",
            "background-color": "#FA909E"
            // www.sessions.edu/color-calculator/
            // FA909E (Dark Pink) 
            // FDCBC7 (Light Pink) 
            // B6E5CB (Green)
            // FABE90 (Peach) 
        };
        var thead = $("strong:contains(Thread Options)").parent().parent().parent();
        // Strong that contains thread title
        if (usernameCount < 1)
            $(thead.find("strong:contains(" + thead.find("div strong").text().replace("Thread Options", "") + ")"))
                .after($("<span>")
                    .text("No Mentions")
                    .addClass("mentionBubbles")
                    .css(mentionBubbleCSS)
                    .attr("id", "smartQuoteMentions"))
                .after("&nbsp;");
        else {
            var mentionString = " Mention";
            if (usernameCount > 1)
                mentionString += "s";
            $(thead.find("strong:contains(" + thead.find("div strong").text().replace("Thread Options", "") + ")"))
                .after($("<span>").append($("<a>")
                    .addClass("mentionBubbles")
                    .css(mentionBubbleCSS)
                    .css({ "cursor": "pointer" })
                    .text(usernameCount + mentionString) // "(" + 
                    .attr("id", "smartQuoteMentions")))
                .after("&nbsp;");
            // Group quotes
            groupQuotedPosts();
            // Hover event
            $('#smartQuoteMentions').hover(
                // https://stackoverflow.com/a/3741171/2694643
              function () {
                  var $this = $(this);
                  $this.data('smartQuoteTextColor', $this.css('color')).css('color', 'white');
              },
              function () {
                  var $this = $(this);
                  $this.css('color', $this.data('smartQuoteTextColor'));
              }
            );
            // On-Click Event
            $("#smartQuoteMentions").click(function () {
                // Toggle state:
                $(".smartQuoteNoMentions").toggle();
            });
        }
        //$("#smartQuoteMentions").css("color", smartQuoteNotificationColor);
    }
    // Always Quote
    if ($("#content").find($("span:contains(Thread Closed)")).length > 0) {
        // Append quote buttons
        $("#content").find($("a[title='Report this post to a moderator']")).each(function (index) {
            $(this).before($("<a>").addClass("bitButton closedQuote").attr("href", "javascript:void(0)").css("margin", "5px").attr("id", "closedQuote" + index)
                .append($("<span>").text("Quote")));
        });
        // Quote event listeners
        $(".closedQuote").click(function () {
            var postBlock = $(this).parent().parent().parent();
            //console.log(postBlock);
            // Post Link
            var postLink = postBlock.find(".post_head .float_right strong a").attr("href").split("&pid=");
            //console.log(postLink);
            if (postLink[1].includes("#pid")) { postLink[1] = postLink[1].substring(0, postLink[1].indexOf("#pid")); }
            //console.log("Post ID: " + postLink[1]);
            // Username
            var postUsername = postBlock.find(".author_information").find("strong span a span").text();
            //console.log("Username: "+postUsername);
            // Post Content
            var postContent = $("#pid_" + postLink[1]).text();
            var postContentHTML = $("#pid_" + postLink[1]).html();
            var parsedPostHTML = $('<div/>').append(postContentHTML);
            //console.log(parsedPostHTML);
            // Spoilers
            if (parsedPostHTML.find(".spoiler_header").length > 0) {
                $(parsedPostHTML).find(".spoiler_header").each(function (index) {
                    var spoilerHead = $(this).text().replace(" (Click to View)", "");
                    var spoilerBody = $(parsedPostHTML).find(".spoiler_body:eq(" + index + ")").text();
                    postContent = postContent.replace($(this).text(), "[sp=" + spoilerHead + "]" + spoilerBody + "[/sp]");
                });
            }
            // Hyperlinks
            if (parsedPostHTML.find("a").length > 0) {
                $(parsedPostHTML).find("a").each(function (index) {
                    // Exclude spoilers
                    if (!$(this).text().includes("(Click to View)")) {
                        // Add hyperlink to text
                        postContent = postContent.replace($(this).text(), "[url=" + $(this).attr("href") + "]" + $(this).text() + "[/url]");
                    }
                });
            }
            postContent = "[quote='" + postUsername + "' pid='" + postLink[1] + "']" + postContent + "[/quote]";
            //console.log("new content: "+postContent);
            prompt(postUsername + "'s Quote: ", postContent);
        });
    }
}

function groupQuotedPosts() {
    var username = $("#panel strong a:eq(0)").text();
    // Loop posts
    $("#posts > table").each(function (index) {
        // Check for quotes
        if ($(this).find("cite.SmartQuoteMentionTitle").length > 0) {
            $(this).addClass("smartQuoteMentions");
        } else {
            $(this).addClass("smartQuoteNoMentions");
        }
    });
}

// ------------------------------ Functions ------------------------------
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function getColorByBgColor(bgColor) {
    if (!bgColor) { return '000000'; }
    return (parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff';
}