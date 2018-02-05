var debug = false;
var enableLivePreview = true;
var collapseLivePreviewByDefault = true;
var characterCounterEnabled = true;
var enableLeaveWarning = false;
getLivePreview();

// Set vars equal to saved settings
function getLivePreview() {
    chrome.storage.sync.get("LivePreviewChanges", function (data) {
        if (!chrome.runtime.error){
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        if (typeof key === undefined || typeof value === undefined) { return; }
                        switch (key) {
                            case "LivePreviewChangesEnabled": enableLivePreview = value;
                                break;
                            case "LivePreviewChangesCollapsed": collapseLivePreviewByDefault = value;
                                break;
                            case "GlobalChangesCharacterCounterEnabled": characterCounterEnabled = value;
                                break;
                            case "GlobalChangesLeaveWarning": enableLeaveWarning = value;
                                break;
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })
                injectLivePreviewChanges();
            });
            
        }
    });
}

function injectLivePreviewChanges() {
    if (enableLivePreview) {
        injectLivePreview();
    }
    if (characterCounterEnabled) {
        injectCharacterCounterChanges();
    }
}

function injectLeaveWarning() {
    hasText = false;

    $(document.body).click(function (e) {
        if (!$(e.target).is("form input")) {
            console.log("not submit button");
            return;
        } 
    });

    $('textarea#message_new').keyup('change', function () {
        console.log("message new change");
        if ($('textarea#message_new').val() != '') {
            hasText = true;
        } else {
            hasText = false;
        }
        warnUserOnUnload(hasText);

    });

    $('textarea#message').keyup('change', function () {
        console.log("message change");
        if ($('textarea#message').val() != '') {
            hasText = true;
        } else {
            hasText = false;
        }
        warnUserOnUnload(hasText);
    });

}

function warnUserOnUnload(hasText) {
    if(hasText){
        $(window).bind('beforeunload', function (event) {
            window.event.returnValue = "teeeest";
        });
    }
}

function injectCharacterCounterChanges() {
    var appendCharCountToMe;
    if (window.location.href.includes("hackforums.net/showthread.php?tid=")) {
        //
        appendCharCountToMe = $("#quickreply_e").find("tr:eq(0) > td:eq(0) > span:eq(0)");
        appendCharCountToMe.after($("<span>").attr("id", "charLabel").text(""));
        appendCharCountToMe.after($("<br />"));
        appendCharCountToMe.after($("<br />"));
        $('#message').bind('input propertychange', function () {
            doCount();
        });
    }
    else if (window.location.href.includes("hackforums.net/newreply.php?tid=") ||
             window.location.href.includes("hackforums.net/newthread.php?fid=") ||
             window.location.href.includes("hackforums.net/editpost.php?pid=") ||
             window.location.href.includes("hackforums.net/private.php?action=send")) {
        // 
        appendCharCountToMe = $("strong:contains(Post Options:)");
        appendCharCountToMe.after($("<br />"));
        appendCharCountToMe.after($("<br />"));
        appendCharCountToMe.after($("<span>").attr("id", "charLabel").text(""));
        appendCharCountToMe.after($("<br />"));
        appendCharCountToMe.after($("<br />"));
        $('textarea').bind('input propertychange', function () {
            doCount();
        });
    }
    
    
}

function doCount() {
    const baseStyle = {
        "padding": "3px",
        "padding-left": "10px",
        "padding-right": "10px",
        "border-radius": "5px"
    }
    const minLimit = 26;
    const minLimitTxt = "Too Low: ";
    const minLimitStyle = {
        "background-color": "#d8b4b2",
        "border-color": "#d8b4b2",
        "color": "#891a14",
        
    };
    const limitText = "Good: ";
    const limitStyle = {
        "background-color": "#b2d8b9",
        "border-color": "#b2d8b9",
        "color": "#14892c",
    };

    const minLucky = 100;
    const minLuckyTxt = "Clover: ";
    const minLuckyStyle = {
        "background-color": "#b6b2d8",
        "border-color": "#b6b2d8",
        "color": "#201489",
    };

    // L33t: 12,000
    const maxLimitL33t = 12000;
    const maxLimitTxt = "Too High: ";
    const maxLimitStyleL33t = {
        "background-color": "#99FF00",
        "border-color": "#99FF00",
        "color": "#395211",
    };
    // Ub3r: 18,000
    const maxLimitUb3r = 18000;
    const maxLimitStyleUb3r = {
        "background-color": "#00AAFF",
        "border-color": "#00AAFF",
        "color": "#113a4f",
    };
    // Ep1c: 24,000
    const maxLimitEp1c = 24000;
    const maxLimitStyleEp1c = {
        "background-color": "#FFA500",
        "border-color": "#FFA500",
        "color": "#805b16",
    };

    var charReason = "";
    var charStyle;
    
    var charLength = 0;
    var textInput = "";
    if (window.location.href.includes("hackforums.net/showthread.php?tid=")) {
        textInput = $("#message").val();
    } else {
        textInput = $("textarea[dir='ltr']").val();
    }
    // Quotes
    textInput = textInput.replace(/\[\/?quote.*[^\]]*\]/g, '');
    // Images
    textInput = textInput.replace(/\[img\].*\[\/img\]/g, '');
    // Emojis
    textInput = textInput.replace(/:([^:][^:]*:)?/g, '');
    // Spaces
    textInput = textInput.replace(/ /g, '');
    // New Lines
    textInput = textInput.replace(/(\r\n|\n|\r)/gm, "");
    // Reply Length
    charLength = textInput.length;
    // Too Small
    if (charLength < minLimit) {
        charReason = minLimitTxt;
        charStyle = minLimitStyle;
    }
    // Good
    else if (charLength >= minLimit && charLength < minLucky) {
        charReason = limitText;
        charStyle = limitStyle;
    }
    // Lucky
    else if (charLength >= minLucky && charLength < maxLimitL33t) {
        charReason = minLuckyTxt;
        charStyle = minLuckyStyle;
    }
    // Too Big - L33t
    else if (charLength >= maxLimitL33t && charLength < maxLimitUb3r) {
        charReason = maxLimitTxt;
        charStyle = maxLimitStyleL33t;
    }
    // Too Big - Ub3r
    else if (charLength >= maxLimitL33t && charLength < maxLimitEp1c) {
        charReason = maxLimitTxt;
        charStyle = maxLimitStyleUb3r;
    }
    // Too Big - Ep1c
    else if (charLength >= maxLimitEp1c) {
        charReason = maxLimitTxt;
        charStyle = maxLimitStyleEp1c;
    }
    $("#charLabel").text(charReason + charLength);
    $("#charLabel").css(charStyle);
    $("#charLabel").css(baseStyle);
}

function injectLivePreview() {
    // Preview Background Color
    var prevBackColor = "#333333";
    // ------------------------------ On Page ------------------------------
    // http://www.freeformatter.com/javascript-escape.html
    // Dev: https://rawgit.com/xadamxk/ThreadDesignGenerator/master/CSS/xbbcode.css
    // Prod: https:\/\/cdn.rawgit.com\/xadamxk\/ThreadDesignGenerator\/8c58d68e\/CSS\/xbbcode.css
    // Files
    var collapseImg = chrome.extension.getURL("/images/collapse.gif");
    var collapseCollapsedImg = chrome.extension.getURL("/images/collapse_collapsed.gif");
    var xbbCodeSrc = chrome.extension.getURL("/css/xbbcode.css");

    $("head").append('<link ' + "href='" + xbbCodeSrc + "'" + 'rel="stylesheet" type="text/css">');

    // Quick Reply
    if (window.location.href.includes("hackforums.net/showthread.php?tid=")) {
        // Check for quick reply box
        if ($("strong:contains(Quick Reply)")) {
            $("#quickreply_e tr:eq(1)").after($("<tr>")
                                              .append($("<td>").attr("colspan", "2").addClass("trow1")
                                                      .append($("<div>").addClass("expcolimage")
                                                              .append("<img id='livePreviewCollapse' alt='[-]' title='[-]' style='cursor: pointer;' src='" + collapseImg + "' />"))
                                                      .append($("<div>")
                                                              .append($("<strong>").text("Live Preview")).append("<br>").append($("<span>").attr("id", "livePreviewErrors")))));
            $("#quickreply_e tr:eq(2)").after($("<tr>")
                                              .append($("<td>").attr("colspan", "2").css("background-color", prevBackColor)
                                                      //.append("<hr>")
                                                      .append($("<div>").attr("id", "livePreview"))));
            // Event Listener - LivePreview 
            $("#message").on("input click", function () {
                updatePreview($("#message").val(), false, "#livePreview");
            });
            // Setting to auto collapse - trigger click event here
            if (collapseLivePreviewByDefault) {
                $("#livePreview").toggle();
                toggleCollapseAttr();
            }
            // Event Listener - Show/Hide
            $("#livePreviewCollapse").on("click", function () {
                $("#livePreview").toggle();
                toggleCollapseAttr();
            });
            // Does this even work?
            $("#quick_reply_submit, #newPostButton").on("click", function () {
                //updatePreview($("#message").val(), false, "#livePreview");
                $("#livePreview").toggle();
                toggleCollapseAttr();
            });
        }
    }
        // Thread Reply & New Thread
    else if (window.location.href.includes("hackforums.net/newreply.php?tid=") ||
             window.location.href.includes("hackforums.net/newthread.php?fid=") ||
             window.location.href.includes("hackforums.net/editpost.php?pid=") ||
             window.location.href.includes("hackforums.net/private.php?action=send")) {
        // Images
        var collapseImg = chrome.extension.getURL("/images/collapse.gif");
        var collapseCollapsedImg = chrome.extension.getURL("/images/collapse_collapsed.gif");
        $("strong:contains(Message:)").parent().parent().after($("<tr>")
                                                                    .append($("<td>").addClass("trow1").css("width", "20%")
                                                                            .append($("<strong>").text("Live Preview:")).append("<br>").append($("<span>").attr("id", "livePreviewErrors")))
                                                                    .append($("<td>").addClass("trow1").append($("<div>").attr("id", "livePreview"))));
        // Collapse Box
        $("strong:contains(Live Preview:)").append($("<div>").addClass("expcolimage")
            .append("<img id='livePreviewCollapse' alt='[-]' title='[-]' style='cursor: pointer;' src='" + collapseImg + "' />"));

        // Setting to auto collapse - trigger click event here
        if (collapseLivePreviewByDefault) {
            $("#livePreview").toggle();
            $("#livePreviewErrors").toggle();
            toggleCollapseAttr();
        }
        // Event Listener - Show/Hide
        $("#livePreviewCollapse").on("click", function () {
            $("#livePreview").toggle();
            $("#livePreviewErrors").toggle();
            toggleCollapseAttr();
        });

        // Event Listener - LivePreview 
        $("textarea[dir='ltr']").on("click input onpropertychange", function () {
            updatePreview($("textarea[dir='ltr']").val(), false, "#livePreview");
        });
    }
}

function updatePreview(input, removeTag, outContainer) {
    // Instanciate xbb
    var preview = XBBCODE.process({
        text: input,
        removeMisalignedTags: removeTag,
        addInLineBreaks: true
    });
    $(outContainer).html(filterKeywords(preview.html));
    //console.error("Errors", preview.error);
    //console.log(preview.errorQueue);
    // Errors
    if (preview.error) {
        $("#livePreviewErrors").text("ERROR: " + preview.errorQueue).css("color", "red");
        if ($("#livePreviewErrors").parent().has("a").length < 1 && true == false) {
            $("#livePreviewErrors").after($("<a>").attr("class", "fixLivePreviewErrors").attr("href", "#fix").text("(Attempt to fix)"))
                .after($("<br>").attr("class", "fixLivePreviewErrors"));
            // Event for error fix
            $(".fixLivePreviewErrors").click(function () {
                updatePreview(input, true, outContainer);
            });
        }
    } else {
        $("#livePreviewErrors").text("");
        if ($("#livePreviewErrors").parent().has("a").length > 0) {
            $(".fixLivePreviewErrors").remove();
        }
    }
}

function toggleCollapseAttr() {
    var collapseImg = chrome.extension.getURL("/images/collapse.gif");
    var collapseCollapsedImg = chrome.extension.getURL("/images/collapse_collapsed.gif");
    if ($("#livePreview").is(':visible')) {
        $("#livePreviewCollapse").attr("alt", "[-]").attr("title", "[-]").attr("src", collapseImg);
    } else {
        $("#livePreviewCollapse").attr("alt", "[+]").attr("title", "[+]").attr("src", collapseCollapsedImg);
    }
}

function filterKeywords(htmlInput) {
    var filters = [
        [':pinch:', '<img src="images/smilies/pinch.gif" style="vertical-align: middle;" border="0" alt="Pinch" title="Pinch">'],
        [':victoire:', '<img src="images/smilies/victoire.gif" style="vertical-align: middle;" border="0" alt="Victoire" title="Victoire">'],
        [':hehe:', '<img src="images/smilies/hehe.gif" style="vertical-align: middle;" border="0" alt="Hehe" title="Hehe">'],
        [':oui:', '<img src="images/smilies/oui.gif" style="vertical-align: middle;" border="0" alt="Oui" title="Oui">'],
        [':bebe-pleure:', '<img src="images/smilies/bebe-pleure.gif" style="vertical-align: middle;" border="0" alt="Bebe-pleure" title="Bebe-pleure">'],
        [':ohmy:', '<img src="images/smilies/ohmy.gif" style="vertical-align: middle;" border="0" alt="Ohmy" title="Ohmy">'],
        [':blink:', '<img src="images/smilies/blink.gif" style="vertical-align: middle;" border="0" alt="Blink" title="Blink">'],
        [':superman:', '<img src="images/smilies/superman.gif" style="vertical-align: middle;" border="0" alt="Superman" title="Superman">'],
        [':nono:', '<img src="images/smilies/nono.gif" style="vertical-align: middle;" border="0" alt="Nono" title="Nono">'],
        [':biggrin:', '<img src="images/smilies/biggrin.gif" style="vertical-align: middle;" border="0" alt="Biggrin" title="Biggrin">'],
        [':sad:', '<img src="images/smilies/sad.gif" style="vertical-align: middle;" border="0" alt="Sad" title="Sad">'],
        [':unsure:', '<img src="images/smilies/unsure.gif" style="vertical-align: middle;" border="0" alt="Unsure" title="Unsure">'],
        [':glare:', '<img src="images/smilies/glare.gif" style="vertical-align: middle;" border="0" alt="Glare" title="Glare">'],
        [':roflmao:', '<img src="images/smilies/roflmao.gif" style="vertical-align: middle;" border="0" alt="Roflmao" title="Roflmao">'],
        [':devlish:', '<img src="images/smilies/devlish.gif" style="vertical-align: middle;" border="0" alt="Devlish" title="Devlish">'],
        [':rolleyes:', '<img src="images/smilies/rolleyes.gif" style="vertical-align: middle;" border="0" alt="Rolleyes" title="Rolleyes">'],
        [':cool:', '<img src="images/smilies/cool.gif" style="vertical-align: middle;" border="0" alt="Cool" title="Cool">'],
        [':gratte:', '<img src="images/smilies/gratte.gif" style="vertical-align: middle;" border="0" alt="Gratte" title="Gratte">'],
        [':confused:', '<img src="images/smilies/confused.gif" style="vertical-align: middle;" border="0" alt="Confused" title="Confused">'],
        [':blackhat:', '<img src="images/smilies/blackhat.gif" style="vertical-align: middle;" border="0" alt="Black Hat" title="Black Hat">'],
        [':ninja:', '<img src="images/smilies/ninja.gif" style="vertical-align: middle;" border="0" alt="Ninja" title="Ninja">'],
        [':blush:', '<img src="images/smilies/blush.gif" style="vertical-align: middle;" border="0" alt="Blush" title="Blush">'],
        [':lipssealed:', '<img src="images/smilies/lipssealed.gif" style="vertical-align: middle;" border="0" alt="Lipssealed" title="Lipssealed">'],
        [':yeye:', '<img src="images/smilies/yeye.gif" style="vertical-align: middle;" border="0" alt="Yeye" title="Yeye">'],
        [':non:', '<img src="images/smilies/non.gif" style="vertical-align: middle;" border="0" alt="Non" title="Non">'],
        [':smile:', '<img src="images/smilies/smile.gif" style="vertical-align: middle;" border="0" alt="Smile" title="Smile">'],
        [':whistle:', '<img src="images/smilies/whistle.gif" style="vertical-align: middle;" border="0" alt="Whistle" title="Whistle">'],
        [':sleep:', '<img src="images/smilies/sleep.gif" style="vertical-align: middle;" border="0" alt="Sleep" title="Sleep">'],
        [':evilgrin:', '<img src="images/smilies/evilgrin.gif" style="vertical-align: middle;" border="0" alt="Evilgrin" title="Evilgrin">'],
        [':omg:', '<img src="images/smilies/omg.gif" style="vertical-align: middle;" border="0" alt="Omg" title="Omg">'],
        [':tongue:', '<img src="images/smilies/tongue.gif" style="vertical-align: middle;" border="0" alt="Tongue" title="Tongue">'],
        [':mad:', '<img src="images/smilies/mad.gif" style="vertical-align: middle;" border="0" alt="Mad" title="Mad">'],
        [':huh:', '<img src="images/smilies/huh.gif" style="vertical-align: middle;" border="0" alt="Huh" title="Huh">'],
        [':thumbsup:', '<img src="images/smilies/thumbsup.gif" style="vertical-align: middle;" border="0" alt="Thumbsup" title="Thumbsup">'],
        [':wacko:', '<img src="images/smilies/wacko.gif" style="vertical-align: middle;" border="0" alt="Wacko" title="Wacko">'],
        [':pirate:', '<img src="images/smilies/pirate.gif" style="vertical-align: middle;" border="0" alt="Pirate" title="Pirate">'],
        ['&#91;hr&#93;', '<hr>'],
        ['[help]', 'We recommend you take the time to read the <a href="misc.php?action=help">HF Help Documents</a> section. The answer to your questions should be contained in there.']
    ];
    for (var i = 0; i < filters.length; i++) {
        if (htmlInput.includes(filters[i][0])) {
            htmlInput = htmlInput.replaceAll(filters[i][0], filters[i][1]);
        }
    }
    return htmlInput;
}

// Replace All (Credit: http://stackoverflow.com/a/17606289)
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};