var debug = false;
var enableQuickReps = false;
enableQuickRep();

function enableQuickRep() {
    chrome.storage.sync.get("QuickRepChanges", function (data) {
        if (!chrome.runtime.error) {
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        switch (key) {
                            case "QuickRepEnabled": if (value) { enableQuickReps = value }
                                break;
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })

            });
            // Run function
            if (enableQuickReps)
                injectQuickRep();
        }
    });
}

// called on ThreadView & ReadPM
function injectQuickRep() {
    // Label for button (visible from /showthread.php?)
    var repButtonLabel = "Rep"; // Default: "Rep")
    var basicQuickRep = false; // (Default: false)
    // Rep comment box width
    var repCommentWidth = "60%"; // (Default: "60%")
    // Notification Dismissal Time
    var notificationTimeout = 15000; // (Default: 15000)
    // Auto Trigger Rep Queue - otherwise only triggers when out of reps
    var queueRep = false; // (Default: false)
    // Global Vars
    var uidArray = [];
    var ajaxSuccess = false;
    var errorFound = false;
    var my_key, my_uid, my_pid, my_rid, my_repOptions, my_comments, repIndex;
    var repComment, repLink, recipientUsername, recipientUID;
    var queuedUID, queuedAmt, queuedReason;

    const repLimit = "You have already given as many reputation ratings as you are allowed to for today";
    const repSelf = "You cannot add to your own reputation";
    const repSelfResp = "You can't rep yourself dumb dumb :P";

    $(".bitButton[title='Trust Scan']").each(function (index, element) {
        var tsButton = $(element);
        var postMessage = tsButton.parents("table.tborder");
        // Grab UID & create button
        uidArray[index] = parseInt(tsButton.attr("href").split("uid=")[1]);
        tsButton.parent().append($("<a>").text(repButtonLabel).attr("id", "repButton" + index).css("margin-right","5px").attr("href", "#").addClass("bitButton"));


        // Standard Quick Rep
        if (basicQuickRep)
            $("body").on("click", "#repButton" + index, function () { MyBB.reputation(uidArray[index]); });
            // Integrated Quick Rep
        else {
            $("body").on("click", "#repButton" + index, function (e) {
                e.preventDefault();
                // Rep Row Exists
                if (!$("#repContainerRow").length < 1) {
                    $("#repContainerRow").remove();
                    return;
                }
                // ajax call on button click
                $.ajax({
                    url: "https://hackforums.net/reputation.php?action=add&uid=" + uidArray[index],
                    cache: false,
                    success: function (response) {
                        // Check for errors
                        // No errors
                        var errorBlock = $(response).find("blockquote").html();
                        var permError = "Permission Error: ";
                        if (errorBlock === undefined) {
                            if (debug)
                                console.log("No permission errors!");
                        }
                            // Rep Limit
                        else if (errorBlock.includes(repLimit)) {
                            // Rep Queue logic
                            my_key = $(response).find('[name=my_post_key]').val();
                            // UID
                            my_uid = $(response).find('[name=uid]').val();
                            // PID
                            my_pid = $(response).find('[name=pid]').val();
                            // RID
                            my_rid = $(response).find('[name=rid]').val();
                            // Select vals
                            my_repOptions = $(response).find('[name=reputation]').children();
                            // Comments
                            my_comments = $(response).find('[name=comments]').val();
                            queueRep = true;
                        }
                            // Self rep
                        else if (errorBlock.includes(repSelf)) {
                            errorFound = true;
                            window.alert(permError + repSelfResp);
                            return;
                        }
                            // Require Upgrade, Rep Disabled, Other?
                        else {
                            errorFound = true;
                            window.alert(permError + errorBlock);
                            return;
                        }
                        // No Rep Permission Errors
                        if (!errorFound) {
                            // Grab rep index
                            repIndex = $(response).find("#reputation :selected").index();
                            // Magical string of justice: $(response).children(3).children().children().children().children().siblings(6)
                            // Post Key
                            my_key = $(response).find('[name=my_post_key]').val();
                            // UID
                            my_uid = $(response).find('[name=uid]').val();
                            // PID
                            my_pid = $(response).find('[name=pid]').val();
                            // RID
                            my_rid = $(response).find('[name=rid]').val();
                            // Select vals
                            my_repOptions = $(response).find('[name=reputation]').children();
                            // Comments
                            my_comments = $(response).find('[name=comments]').val();
                            if (true) {
                                console.log("my_key: " + my_key);
                                console.log("my_uid: " + my_uid);
                                console.log("my_pid: " + my_pid);
                                console.log("my_rid: " + my_rid);
                                console.log("my_repOptions(below): " + my_repOptions);
                                console.log(my_repOptions);
                                console.log("my_comments: " + my_comments);
                            }
                            ajaxSuccess = true;
                        }
                        // Shouldn't run if error, but just incase...
                        if (!errorFound) {
                            // Rep Row Doesn't Exist
                            if ($("#repContainerRow").length < 1) {
                                // Append Rep Container
                                $(postMessage).find("#repButton" + index).parent().parent().parent().after($("<tr>").attr("id", "repContainerRow"));
                                $("#repContainerRow").append("<td>").addClass("trow1");
                                // Append rep reasoning textbox
                                $("#repContainerRow > td").append($("<input type='text'>").attr("id", "repComment" + index).val(my_comments)
                                                                              .css("padding", "3px 6px")
                                                                              .css("text-shadow", "1px 1px 0px #000;")
                                                                              .css("background-color", "#072948")
                                                                              .css("margin-left", "5px")
                                                                              .css("width", repCommentWidth)
                                                                              .css("background", "white")
                                                                              .css("box-shadow", "0 1px 0 0 #0F5799")
                                                                              .css("font-family", "arial")
                                                                              .css("font-size", "14px")
                                                                              .css("border", "1px solid #000")
                                                                              .css("margin", "5px")
                                                                              .css("color", "black")
                                                                             ); //.css("", "")
                                // Selectbox
                                // Append Rep selection
                                $("#repContainerRow > td").append($("<select>").attr("id", "repSelect" + index).css("margin-right", "5px").addClass("button"));
                                // Out of reps - rep queue
                                if (queueRep) {
                                    // Append rep options based on primary usergroup
                                    if (document.cookie.replace(/(?:(?:^|.*;\s*)RepQueueUsergroup\s*\=\s*([^;]*).*$)|^.*$/, "$1") === "")
                                        getPrimaryUserGroup();
                                    if (document.cookie.replace(/(?:(?:^|.*;\s*)RepQueueUsergroup\s*\=\s*([^;]*).*$)|^.*$/, "$1") == "Uber") {
                                        $("#repSelect" + index).append($('<option></option>').val(3).html("Positive(+3)"));
                                        $("#repSelect" + index).append($('<option></option>').val(2).html("Positive(+2)"));
                                        $("#repSelect" + index).append($('<option></option>').val(1).html("Positive(+1)"));
                                        $("#repSelect" + index).append($('<option></option>').val(0).html("Neutral"));
                                        $("#repSelect" + index).append($('<option></option>').val(-1).html("Negative(-1)"));
                                        $("#repSelect" + index).append($('<option></option>').val(-2).html("Negative(-2)"));
                                        $("#repSelect" + index).append($('<option></option>').val(-3).html("Negative(-3)"));
                                    }
                                    else if (document.cookie.replace(/(?:(?:^|.*;\s*)RepQueueUsergroup\s*\=\s*([^;]*).*$)|^.*$/, "$1") == "Leet") {
                                        $("#repSelect" + index).append($('<option></option>').val(1).html("Positive(+1)"));
                                        $("#repSelect" + index).append($('<option></option>').val(0).html("Neutral"));
                                    }
                                    else if (document.cookie.replace(/(?:(?:^|.*;\s*)RepQueueUsergroup\s*\=\s*([^;]*).*$)|^.*$/, "$1") == "Staff") {
                                        $("#repSelect" + index).append($('<option></option>').val(5).html("Positive(+5)"));
                                        $("#repSelect" + index).append($('<option></option>').val(4).html("Positive(+4)"));
                                        $("#repSelect" + index).append($('<option></option>').val(3).html("Positive(+3)"));
                                        $("#repSelect" + index).append($('<option></option>').val(2).html("Positive(+2)"));
                                        $("#repSelect" + index).append($('<option></option>').val(1).html("Positive(+1)"));
                                        $("#repSelect" + index).append($('<option></option>').val(0).html("Neutral"));
                                        $("#repSelect" + index).append($('<option></option>').val(-1).html("Negative(-1)"));
                                        $("#repSelect" + index).append($('<option></option>').val(-2).html("Negative(-2)"));
                                        $("#repSelect" + index).append($('<option></option>').val(-3).html("Negative(-3)"));
                                        $("#repSelect" + index).append($('<option></option>').val(-4).html("Negative(-4)"));
                                        $("#repSelect" + index).append($('<option></option>').val(-5).html("Negative(-5)"));
                                    }
                                    else if (document.cookie.replace(/(?:(?:^|.*;\s*)RepQueueUsergroup\s*\=\s*([^;]*).*$)|^.*$/, "$1") == "Normal") {
                                        window.alert("Permissions Error! Normal members do not have access to the reputation system!");
                                        return;
                                    }
                                }
                                    // Have more available reps
                                else {
                                    // Append rep options from give rep page
                                    $(my_repOptions).each(function (subindex, subelement) {
                                        $("#repSelect" + index).append($('<option></option>').val($(subelement).val()).html($(subelement).text()));
                                    });
                                    // Set selected index
                                    $("#repSelect" + index)[0].selectedIndex = repIndex;
                                }
                                // Rep Button
                                // Append Rep User button
                                var repUserStr = "Rep User";
                                if (queueRep)
                                    repUserStr = "Queue Rep";
                                $("#repContainerRow > td").append($("<button>").text(repUserStr).attr("id", "repPost" + index).addClass("button"));
                                // Click event for button
                                $("body").on("click", "#repPost" + index, function () {
                                    // Check if PM or thread
                                    var default_comment; // If rep comment is empty
                                    var next_loc; // Address to load on success
                                    recipientUsername = $(postMessage).find('.post_author strong .largetext a span').text();
                                    recipientUID = $(postMessage).find('.post_author strong .largetext a').attr('href');
                                    // Remove everything but digit
                                    for (i = 0; i < recipientUID.length; i++)
                                        recipientUID = recipientUID.replace(/\D+/g, '');
                                    if (window.location.pathname == '/private.php') {
                                        next_loc = window.location.href;
                                        default_comment = 'Regarding your PM.';
                                    } else {
                                        // Cycle through attributes, look for '#' in matching html (counters against other scripts)
                                        for (i = 0; i < $(postMessage).find(".smalltext strong a").length; i++) {
                                            if ($(postMessage).find(".smalltext strong a")[i].text.includes("#"))
                                                next_loc = "https://hackforums.net/" + $(postMessage).find(".smalltext strong a:eq(" + i + ")").attr('href');
                                        }
                                        default_comment = "Regarding Thread: " + next_loc;
                                    }
                                    var queueString;
                                    // Rep comment is empty - use appropriate default
                                    if ($("#repComment" + index).val().length === 0) {
                                        // Queue Rep - Default
                                        if (queueRep) {
                                            // Queue string
                                            queueString = recipientUID + "||" + recipientUsername + "||" + $("#repSelect" + index).val() + "||" + default_comment + "|||";
                                            // Make cookie if doesn't already exist
                                            if (document.cookie.replace(/(?:(?:^|.*;\s*)RepQueueCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1") === undefined)
                                                createCookie("RepQueueCookie", "", 10000);
                                            // Add queueString to cookie
                                            if (readCookie("RepQueueCookie") !== null)
                                                queueString = readCookie("RepQueueCookie") + queueString;
                                            createCookie("RepQueueCookie", queueString, 10000);
                                            // Notification
                                            repComment = $("#repSelect" + index + " option:selected").text() + "\nRep Reasoning: " + default_comment;
                                            notififyMe("Rep Queued!", repComment, next_loc);
                                        }
                                        else {
                                            // Make $.Post Request
                                            giveRep(index, next_loc, $("#repSelect" + index + " option:selected").text(), $("#repSelect" + index + " option:selected").val(), default_comment);
                                        }
                                        // Remove rep elements
                                        //hideRepElements(postMessage, index);
                                        $("#repContainerRow").remove();
                                    }
                                        // Custom comment but too short
                                    else if ($("#repComment" + index).val().length < 11 && $("#repComment" + index).val().length > 0)
                                        window.alert("Rep comments must be atleast 10 chars.");

                                        // Input over 10 chars
                                    else {
                                        // Queue Rep - Custom
                                        // TODO: Change statement to this to implement queueRep
                                        if (false) {
                                            var newComment = $("#repComment" + index).val();
                                            // If rep reasoning contains '|' seperator, remove all
                                            newComment = $("#repComment" + index).val();
                                            do { newComment = newComment.replace('|', ''); }
                                            while (newComment.includes('|'));
                                            // Queue string
                                            queueString = recipientUID + "||" + recipientUsername + "||" + $("#repSelect" + index).val() + "||" + newComment + "|||";
                                            // Make cookie if doesn't already exist
                                            if (document.cookie.replace(/(?:(?:^|.*;\s*)RepQueueCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1") === undefined)
                                                createCookie("RepQueueCookie", "", 10000);
                                            // Add queueString to cookie
                                            if (readCookie("RepQueueCookie") !== null)
                                                queueString = readCookie("RepQueueCookie") + queueString;
                                            createCookie("RepQueueCookie", queueString, 10000);
                                            // Notification
                                            repComment = $("#repSelect" + index + " option:selected").text() + "\nRep Reasoning: " + $("#repComment" + index).val();
                                            notififyMe("Rep Queued!", repComment, next_loc);
                                        }
                                        else {
                                            // Make $.Post Request
                                            giveRep(index, next_loc, $("#repSelect" + index + " option:selected").text(),
                                                $("#repSelect" + index + " option:selected").val(), $("#repComment" + index).val(),
                                                my_key, my_uid, my_pid, my_rid);
                                        }
                                        // Remove rep elements
                                        //hideRepElements(postMessage, index);
                                        $("#repContainerRow").remove();
                                    }
                                });
                            }
                        } // no errors
                    }// success
                }); // ajax
            }); // Rep Button onClick
        } // else
    }); // each post
}
// $.Post Reputation call
function giveRep(index, loc, selectTxt, selectVal, reason, my_key, my_uid, my_pid, my_rid) {
    //window.alert(loc +','+selectTxt+','+selectVal+','+reason);
    $.post("/reputation.php",
           {
               "my_post_key": my_key,
               "action": "do_add",
               "uid": my_uid,
               "pid": my_pid,
               "rid": my_rid,
               "reputation": selectVal,
               "comments": reason
           },
           function (data, status) {
               // Success prompt- notification
               repComment = selectTxt + "\nRep Reasoning: " + reason;
               notififyMe("Rep Added Successfully!", repComment, loc);
           });
}

// Hide elements
function hideRepElements(element, index) {
    $(element).find("#repComment" + index).remove();
    $(element).find("#repSelect" + index).remove();
    $(element).find("#repPost" + index).remove();
}

// Notifications
function notififyMe(repTitle, repComment, repLink) {
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(function () {
            if (Notification.permission !== "granted") {
                window.alert("Quick Rep Userscript: Please allow desktop notifications!");
            } else {
                notififyMe(repComment, repLink);
            }
        });
    }
    else {
        var notification = new Notification(repTitle, {
            icon: 'https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/Quick%20Rep/NotificationIcon.png',
            body: repComment,
        });

        notification.onclick = function () {
            window.location.href = repLink;
            notification.close();
        };
        setTimeout(function () { notification.close(); }, notificationTimeout);
    }
}
// Event listener for submit
$("button.repQueueAdd").click(function () {
    submitRepQuest($(this).val());
});

// Event listener for remove
$("button.repQueueRemove").click(function () {
    var confirm = window.confirm('Are you sure you want to remove this queued rep?');
    if (confirm)
        removeEntry($(this).val());
});

// Add button on UserCP
function submitRepQuest(index) {
    $.ajax({
        url: "https://hackforums.net/reputation.php?action=add&uid=" + queuedUID[index].toString(),
        cache: false,
        success: function (response) {
            // Post Key
            my_key = $(response).find('[name=my_post_key]').val();
            // UID
            my_uid = $(response).find('[name=uid]').val();
            // PID
            my_pid = $(response).find('[name=pid]').val();
            // RID
            my_rid = $(response).find('[name=rid]').val();
            // Check for errors
            // No errors
            var errorBlock = $(response).find("blockquote").html();
            var permError = "Permission Error: ";
            if (errorBlock === undefined) {
                if (debug)
                    console.log("No permission errors!");
            }
                // Rep Limit
            else if (errorBlock.includes(repLimit)) {
                errorFound = true;
                window.alert(permError + repLimit);
            }
                // Self rep
            else if (errorBlock.includes(repSelf)) {
                window.alert(permError + repSelfResp);
            }
                // Require Upgrade, Rep Disabled, Other?
            else {
                errorFound = true;
                window.alert(permError + errorBlock);
            }
            // No errors
            if (!errorFound) {
                // Rep label logic
                var queuedAmtStr = "";
                if (queuedAmt[index].includes('-'))
                    queuedAmtStr = "Negative (" + queuedAmt[index] + ")";
                else if (queuedAmt[index] == "0")
                    queuedAmtStr = "Neutral (0)";
                else
                    queuedAmtStr = "Positive (+" + queuedAmt[index] + ")";
                // Submit Rep
                giveRep(index, "https://hackforums.net/usercp.php", queuedAmtStr, queuedAmt[index], queuedReason[index]);
                // Remove element from cookie
                removeEntry(index);
            }
        }
    });// Ajax
}

// Update primary usergroup
function getPrimaryUserGroup() {
    var primaryUserGroupStr = "Primary User Group:";
    var primaryUserGroupParent;
    if (window.location.href.includes("/usercp.php")) {
        primaryUserGroupParent = $("strong:contains('Primary User Group')").parent().text();
    }
    else {
        $.ajax({
            url: "https://hackforums.net/usercp.php",
            cache: false,
            async: false,
            success: function (response) {
                primaryUserGroupParent = $(response).find("strong:contains('Primary User Group')").parent().text();
            }
        });
    }
    // String we want from UserCP
    var desiredString = primaryUserGroupParent.substr(primaryUserGroupParent.indexOf(primaryUserGroupStr) + primaryUserGroupStr.length);
    // Create if it doesn't exist
    if (document.cookie.replace(/(?:(?:^|.*;\s*)RepQueueUsergroup\s*\=\s*([^;]*).*$)|^.*$/, "$1") === undefined)
        document.cookie = 'RepQueueUsergroup=';
    // Ub3r
    if (desiredString.includes("HF Ub3r")) {
        document.cookie = 'RepQueueUsergroup=' + "Uber";
    }
        // L33t
    else if (desiredString.includes("HF l33t"))
        document.cookie = 'RepQueueUsergroup=' + "Leet";
        // Staff
    else if (desiredString.includes("Staff"))
        document.cookie = 'RepQueueUsergroup=' + "Staff";
        // Everything else
    else
        document.cookie = 'RepQueueUsergroup=' + "Normal";
    // Debug default usergroup
    if (debug) { console.log("Default usergroup: " + document.cookie.replace(/(?:(?:^|.*;\s*)RepQueueUsergroup\s*\=\s*([^;]*).*$)|^.*$/, "$1")); }
}
// Cookie functions (http://stackoverflow.com/a/24103596)
function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    else expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

// remove entry from cookie
function removeEntry(queueIndex) {
    // Queued array
    var queuedRep = document.cookie.replace(/(?:(?:^|.*;\s*)RepQueueCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1").split('|||');
    // Precaution incase they delete cookie - should never run
    if (document.cookie.replace(/(?:(?:^|.*;\s*)RepQueueCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1") === undefined)
        window.alert("No reps queued.");

    var newQueueString = "";
    // Loop each queued rep from cookie
    for (i = 0; i < queuedRep.length - 1; i++) {
        // Don't add selected index
        if (i != queueIndex) {
            newQueueString = newQueueString + queuedRep[i] + "|||";
        }
    }
    // Add queueString back to cookie
    console.log(newQueueString);
    createCookie("RepQueueCookie", newQueueString, 10000);
    location.reload();
    // Remove Entry
    //$("#repQueueTable").remove();
    // Rebuild table
    //buildQueueTable();
}