/* To Add Toggle(s) to settings:
    0. Create group toggle in options.html
    1. Make event listener for toggle group class (doc.ready)
        - Remember to change saveFunc to save function created in #2
    2. Make Save function for new toggle group
    3. Make Load function for new toggle group
    4. Add new Load function to loadSettings()
    5. Make changes to manifest for new JS module
*/

$(document).ready(function () {
    // Load Default/Saved Settings
    loadSettings();
    
    $(".PostbitHide").change(function () {
        savePostbitHide();
        console.log("PostbitHide Settings Changed!");
    });

    $(".RepCharts").change(function () {
        saveRepCharts();
        console.log("RepCharts Settings Changed!");
    });

    $(".OnlineSorting").change(function () {
        saveOnlineSorting();
        console.log("OnlineSorting Settings Changed!");
    });

    $(".UserTag").change(function () {
        saveUserTag();
        console.log("UserTag Settings Changed!");
    });

    $(".PostOptions").change(function () {
        savePostOptions();
        console.log("PostOptions Settings Changed!");
    });

    $(".ImageChanges").change(function () {
        saveImageChanges();
        console.log("ImageChanges Settings Changed!");
    });

    $(".PMChanges").change(function () {
        savePMChanges();
        console.log("PMChanges Settings Changed!");
    });

    $(".ForumChanges").change(function () {
        saveForumChanges();
        console.log("ForumChanges Settings Changed!");
    });
});

function loadSettings() {
    loadPostbitHide();
    loadRepCharts();
    loadOnlineSorting();
    loadUserTag();
    loadPostOptions();
    loadImageChanges();
    loadPMChanges();
    loadForumChanges();
}

function saveForumChanges() {
    chrome.storage.sync.set({
        ForumChanges:
            [{ 'ForumChangesForumRatingEnabled': $("#ForumChangesForumRating").is(':checked') },
            { 'ForumChangesEnhancedSYTEnabled': $("#ForumChangesEnhancedSYT").is(':checked') },
            { 'ForumChangesHideClosedEnabled': $("#ForumChangesHideClosed").is(':checked') },
            { 'ForumChangesHideForumRatingsEnabled': $("#ForumChangesHideForumRatings").is(':checked') }]
    }, function () {
        // Save Confirmation
    });
}

function loadForumChanges() {
    chrome.storage.sync.get("ForumChanges", function (data) {
        console.log(data);
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
                $.each(data, function (key, value) {
                    switch (key) {
                        case "ForumChangesForumRatingEnabled": $("#ForumChangesForumRating").prop('checked', value);
                            break;
                        case "ForumChangesEnhancedSYTEnabled": $("#ForumChangesEnhancedSYT").prop('checked', value);
                            break;
                        case "ForumChangesHideClosedEnabled": $("#ForumChangesHideClosed").prop('checked', value);
                            break;
                        case "ForumChangesHideForumRatingsEnabled": $("#ForumChangesHideForumRatings").prop('checked', value);
                            break;
                        default: console.log("ERROR: Key not found.");
                    }
                })
            })

        });
    });
}

function savePMChanges() {
    chrome.storage.sync.set({
        PMChanges:
            [{ 'PMChangesQuoteStripping': $("#PMChangesQuoteStripping").is(':checked') },
            { 'PMChangesSalutationEnable': $("#PMChangesSalutation").is(':checked') },
            { 'PMChangesSalutationText': $("#PMChangesSalutationText").val() },
            { 'PMChangesSignatureEnable': $("#PMChangesSignature").is(':checked') },
            { 'PMChangesSignatureText': $("#PMChangesSignatureText").val() }]
    }, function () {
        // Save Confirmation
    });
}

function loadPMChanges() {
    chrome.storage.sync.get("PMChanges", function (data) {
        console.log(data);
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
                $.each(data, function (key, value) {
                    switch (key) {
                        case "PMChangesQuoteStripping": $("#PMChangesQuoteStripping").prop('checked', value);
                            break;
                        case "PMChangesSalutationEnable": $("#PMChangesSalutation").prop('checked', value);
                            break;
                        case "PMChangesSalutationText": $("#PMChangesSalutationText").val(value);
                            break;
                        case "PMChangesSignatureEnable": $("#PMChangesSignature").prop('checked', value);
                            break;
                        case "PMChangesSignatureText": $("#PMChangesSignatureText").val(value);
                            break;
                        default: console.log("ERROR: Key not found.");
                    }
                })
            })

        });
    });
}

function saveImageChanges() {
    chrome.storage.sync.set({
        ImageChanges:
            [{ 'ImageChangesMaxSizeEnable': $("#ImageChangesMaxSize").is(':checked') },
            { 'ImageChangesReplaceBrokenEnable': $("#ImageChangesReplaceBroken").is(':checked') },
            { 'ImageChangesForceHTTPSEnable': $("#ImageChangesForceHTTPS").is(':checked') }]
    }, function () {
        // Save Confirmation
    });
}

function loadImageChanges() {
    chrome.storage.sync.get("ImageChanges", function (data) {
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
                $.each(data, function (key, value) {
                    switch (key) {
                        case "ImageChangesMaxSizeEnable": $("#ImageChangesMaxSize").prop('checked', value);
                            break;
                        case "ImageChangesReplaceBrokenEnable": $("#ImageChangesReplaceBroken").prop('checked', value);
                            break;
                        case "ImageChangesForceHTTPSEnable": $("#ImageChangesForceHTTPS").prop('checked', value);
                            break;
                        default: console.log("ERROR: Key not found.");
                    }
                })
            })

        });
    });
}

function savePostOptions() {
    chrome.storage.sync.set({
        PostOptions:
            [{ 'PostOptionsPoTEnable': $("#PostOptionsPoT").is(':checked') },
            { 'PostOptionsThreadsEnable': $("#PostOptionsThreads").is(':checked') },
            { 'PostOptionsPostsEnable': $("#PostOptionsPosts").is(':checked') },
            { 'PMChangesPMFromPostEnable': $("#PMChangesPMFromPost").is(':checked') },
            { 'AnnoyanceFixerFullscreenYoutubeEnable': $("#AnnoyanceFixerFullscreenYoutube").is(':checked') },
            { 'AnnoyanceFixerShowBlockedPostsEnable': $("#AnnoyanceFixerShowBlockedPosts").is(':checked') },
            { 'AnnoyanceFixerHideBlockedPostsEnable': $("#AnnoyanceFixerHideBlockedPosts").is(':checked') }]
    }, function () {
        // Save Confirmation
    });
}

function loadPostOptions() {
    chrome.storage.sync.get("PostOptions", function (data) {
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
                $.each(data, function (key, value) {
                    switch (key) {
                        case "PostOptionsPoTEnable": $("#PostOptionsPoT").prop('checked', value);
                            break;
                        case "PostOptionsThreadsEnable": $("#PostOptionsThreads").prop('checked', value);
                            break;
                        case "PostOptionsPostsEnable": $("#PostOptionsPosts").prop('checked', value);
                            break;
                        case "PMChangesPMFromPostEnable": $("#PMChangesPMFromPost").prop('checked', value);
                            break;
                        case "AnnoyanceFixerFullscreenYoutubeEnable": $("#AnnoyanceFixerFullscreenYoutube").prop('checked', value);
                            break;
                        case "AnnoyanceFixerShowBlockedPostsEnable": $("#AnnoyanceFixerShowBlockedPosts").prop('checked', value);
                            break;
                        case "AnnoyanceFixerHideBlockedPostsEnable": $("#AnnoyanceFixerHideBlockedPosts").prop('checked', value);
                            break;
                        default: console.log("ERROR: Key not found.");
                    }
                })
            })

        });
    });
}

function saveUserTag() {
    chrome.storage.sync.set({
        UserTag:
            [{ 'UserTagEnable': $("#UserTagEnable").is(':checked') }]
    }, function () {
        // Save Confirmation
    });
}

function loadUserTag() {
    chrome.storage.sync.get("UserTag", function (data) {
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
                $.each(data, function (key, value) {
                    switch (key) {
                        case "UserTagEnable": $("#UserTagEnable").prop('checked', value);
                            break;
                        default: console.log("ERROR: Key not found.");
                    }
                })
            })

        });
    });
}

function loadOnlineSorting() {
    chrome.storage.sync.get("OnlineSorting", function (data) {
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
                $.each(data, function (key, value) {
                    switch (key) {
                        case "OnlineSortingEnable": $("#OnlineSortingEnable").prop('checked', value);
                            break;
                        default: console.log("ERROR: Key not found.");
                    }
                })
            })

        });
    });
}

function saveOnlineSorting(){
    chrome.storage.sync.set({
        OnlineSorting:
            [{ 'OnlineSortingEnable': $("#OnlineSortingEnable").is(':checked') }]
    }, function () {
        // Save Confirmation
    });
}

function loadRepCharts() {
    chrome.storage.sync.get("RepCharts", function (data) {
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
                $.each(data, function (key, value) {
                    switch (key) {
                        case "RepChartsEnable": $("#RepChartsEnable").prop('checked', value);
                            break;
                        default: console.log("ERROR: Key not found.");
                    }
                })
            })

        });
    });
}

function saveRepCharts() {
    chrome.storage.sync.set({RepCharts:
            [{ 'RepChartsEnable': $("#RepChartsEnable").is(':checked') }]
    }, function () {
        // Save Confirmation
    });
}

function savePostbitHide() {
    chrome.storage.sync.set({PostbitHide:
        [{'PostbitHideAvatar': $("#PostbitHideAvatar").is(':checked')},
        { 'PostbitHideUsertitle': $("#PostbitHideUsertitle").is(':checked') },
        { 'PostbitHideUserStar': $("#PostbitHideUserStar").is(':checked') },
        { 'PostbitHideUserBar': $("#PostbitHideUserBar").is(':checked') },
        {'PostbitHidePrestige': $("#PostbitHidePrestige").is(':checked')},
        {'PostbitHidePostCount': $("#PostbitHidePostCount").is(':checked')},
        {'PostbitHideJoinDate': $("#PostbitHideJoinDate").is(':checked')},
        {'PostbitHideReputation': $("#PostbitHideReputation").is(':checked')},
        {'PostbitHideWarningLevel': $("#PostbitHideWarningLevel").is(':checked')},
        {'PostbitHideAwards': $("#PostbitHideAwards").is(':checked')},
        {'PostbitHideSignature': $("#PostbitHideSignature").is(':checked')}]
    }, function () {
        // Save Confirmation
    });
}

function loadPostbitHide() {
    chrome.storage.sync.get("PostbitHide", function (data) {
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
            //console.log("1: " + $(this));
                $.each(data, function (key, value) {
                    //console.log("2: " + data);
                    switch (key) {
                        case "PostbitHideAvatar": $("#PostbitHideAvatar").prop('checked', value);
                            break;
                        case "PostbitHideUsertitle": $("#PostbitHideUsertitle").prop('checked', value);
                            break;
                        case "PostbitHideUserStar": $("#PostbitHideUserStar").prop('checked', value);
                            break;
                        case "PostbitHideUserBar": $("#PostbitHideUserBar").prop('checked', value);
                            break;
                        case "PostbitHidePrestige": $("#PostbitHidePrestige").prop('checked', value);
                            break;
                        case "PostbitHidePostCount": $("#PostbitHidePostCount").prop('checked', value);
                            break;
                        case "PostbitHideJoinDate": $("#PostbitHideJoinDate").prop('checked', value);
                            break;
                        case "PostbitHideReputation": $("#PostbitHideReputation").prop('checked', value);
                            break;
                        case "PostbitHideWarningLevel": $("#PostbitHideWarningLevel").prop('checked', value);
                            break;
                        case "PostbitHideAwards": $("#PostbitHideAwards").prop('checked', value);
                            break;
                        case "PostbitHideSignature": $("#PostbitHideSignature").prop('checked', value);
                            break;
                        default: console.log("ERROR: Key not found.");
                    }
                })
            })
            
        });
    });
}