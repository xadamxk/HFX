var debug = false;
var enableHideLocation = false;
var enableDenyPMReceipt = false;
var enableEasyCite = false;
getGlobalSettings();

// Set vars equal to saved settings
function getGlobalSettings() {
    chrome.storage.sync.get("GlobalChanges", function (data) {
        if (!chrome.runtime.error){
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
    if (enableHideLocation) {
        injectHideLocation();
    }
    if (enableDenyPMReceipt) {
        injectDenyPMReceipt();
    }
    if (enableEasyCite) {
        injectEasyCite();
    }
    
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
    $(".navigation").append($("<button>").text("Cite").addClass("bitButton")).attr("id", "citeButton"); //.css("background","#333333")
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
            citationText = "[color=" + rgb2hex($(".quick_keys").find(".largetext strong span").css("color")) + "]" + citationDescripion + "[/color]";
        else
            citationText = +citationDescripion;
    }
        // Threads
    else if (location.href.includes("/showthread.php?tid=")) {
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
        $(".bitButton[title='Trust Scan']").each(function (index, element) {
            var tsButton = $(element);
            var postMessage = tsButton.parents("table.tborder");
            // Grab UID & create button
            tsButton.parent().append($("<button>").text("Cite").attr("id", "citeButton" + index).addClass("bitButton").css("margin-right", "5px"));
            // temp vars
            var tempcitationDescripion;
            var tempcitationLink;
            var tempcitationText;
            // onClick for cite buttons
            $("body").on("click", "#citeButton" + index, function (e) {
                e.preventDefault();
                // Foreach a in smalltext in postbit
                for (i = 0; i < $(postMessage).find(".smalltext strong a").length; i++) {
                    // If first post
                    if ($(postMessage).find(".smalltext strong a")[i].text == ("#1")) {
                        tempcitationLink = "https://hackforums.net/" + $(postMessage).find(".smalltext strong a:eq(" + i + ")").attr('href');
                        tempcitationDescripion = $(".navigation").find(".active").text() + " by " + $(".post_author:eq(0) strong span a span").text();
                        tempcitationText = $(".navigation").find(".active").text() + "[/b][/url] by [b][url=" + $(".post_author:eq(0) strong span a").attr("href") + "]" + $(".post_author:eq(0) strong span a span").text();
                    }
                        // Every other post
                    else if ($(postMessage).find(".smalltext strong a")[i].text.includes("#")) {
                        tempcitationLink = "https://hackforums.net/" + $(postMessage).find(".smalltext strong a:eq(" + i + ")").attr('href');
                        tempcitationDescripion = $(postMessage).find(".largetext a:eq(0) span").text() + "'s Post";
                        // User profile link
                        if (usernameLink)
                            tempcitationLink = $(postMessage).find(".largetext a:eq(0)").attr('href');
                        // post Username Info
                        var postUsername = $(postMessage).find(".largetext a:eq(0) span").text();
                        var postUsernameLink = "https://hackforums.net/" + $(postMessage).find(".smalltext strong a:eq(" + i + ")").attr('href');
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
                }
                prompt("Citation: " + tempcitationDescripion, "[url=" + tempcitationLink + "][b]" + tempcitationText + "[/b][/url]");
            });
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
        citationDescripion = $(".quick_keys").find("strong:contains('Reputation Report for')").text().replace("Reputation Report for ", "") + " 's " + $(".navigation").find(".active").text();
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
        $(".quick_keys").find("strong:contains(Search in Forum)").append(" ").append($("<a>").text("Cite").addClass("bitButton").attr("id", "citeAllSections"));
        $("#citeAllSections").click(function () {
            // Output
            var selectTable = $(".quick_keys").find("strong:contains(Hack Forums - Search)").parent().parent().parent().parent();
            selectTable.after($("<textarea>").val(citeAllSections()).css("width", selectTable.css("width")).attr("id", "citeAllSectionsOutput")).after("<br>");
            $("#citeAllSectionsOutput").select();
            //prompt("All Sections:",citeAllSections());
        });
    }
    $("#citeButton").click(function (event) {
        console.log("cite button clicked");
        var target = $(event.target);
        if (target.is("button")) {
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
// Credit: https://jsfiddle.net/mushigh/myoskaos/
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}