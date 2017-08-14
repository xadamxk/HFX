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

    $(".QuickRepChanges").change(function () {
        saveQuickRepChanges();
        console.log("QuickRepChanges Settings Changed!");
    });

    $(".GlobalChanges").change(function () {
        saveGlobalChanges();
        console.log("GlobalChanges Settings Changed!");
    });

    $(".SmartQuotes").change(function () {
        saveSmartQuotes();
        console.log("SmartQuotes Settings Changed!");
    });

    $(".LivePreview").change(function () {
        saveLivePreview();
        console.log("LivePreview Settings Changed!");
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
    loadQuickRepChanges();
    loadGlobalChanges();
    loadSmartQuotes();
    loadLivePreview();
}

function saveLivePreview() {
    chrome.storage.sync.set({
        LivePreviewChanges:
            [{ 'LivePreviewChangesEnabled': $("#LivePreviewChangesEnable").is(':checked') },
            { 'LivePreviewChangesCollapsed': $("#LivePreviewChangesCollapse").is(':checked') }]
    }, function () {
        // Save Confirmation
    });
}

function loadLivePreview() {
    var LivePreviewChangesEnabled, LivePreviewChangesCollapsed;
    chrome.storage.sync.get("LivePreviewChanges", function (data) {
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
                $.each(data, function (key, value) {
                    switch (key) {
                        case "LivePreviewChangesEnabled": LivePreviewChangesEnabled = value;
                            break;
                        case "LivePreviewChangesCollapsed": LivePreviewChangesCollapsed = value;
                            break;
                        default: console.log("ERROR: Key not found.");
                    }
                })
            })
            // Check with defaults
            if (LivePreviewChangesEnabled !== false) {
                $("#LivePreviewChangesEnable").prop('checked', true);
            }
            if (LivePreviewChangesCollapsed !== false) {
                $("#LivePreviewChangesCollapse").prop('checked', true);
            }
        });
    });
}

function saveSmartQuotes() {
    chrome.storage.sync.set({
        SmartQuoteChanges:
            [{ 'SmartQuotesEnabled': $("#SmartQuotesEnable").is(':checked') },
            { 'SmartQuotesMentionCount': $("#SmartQuotesMentionCount").is(':checked') }]
    }, function () {
        // Save Confirmation
    });
}

function loadSmartQuotes() {
    var SmartQuotesEnabled, SmartQuotesMentionCount;
    chrome.storage.sync.get("SmartQuoteChanges", function (data) {
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
                $.each(data, function (key, value) {
                    switch (key) {
                        case "SmartQuotesEnabled": SmartQuotesEnabled = value;
                            break;
                        case "SmartQuotesMentionCount": SmartQuotesMentionCount = value;
                            break;
                        default: console.log("ERROR: Key not found.");
                    }
                })
            })
            // Check with defaults
            if (SmartQuotesEnabled !== false) {
                $("#SmartQuotesEnable").prop('checked', true);
            }
            if (SmartQuotesMentionCount !== false) {
                $("#SmartQuotesMentionCount").prop('checked', true);
            }
        });
    });
}

function saveGlobalChanges() {
    chrome.storage.sync.set({
        GlobalChanges:
            [{ 'GlobalChangesHideLocationEnabled': $("#HideLocation").is(':checked') },
            { 'GlobalChangesDenyPMReceiptEnabled': $("#PMChangesDenyPMReceipt").is(':checked') },
            { 'GlobalChangesEasyCiteEnabled': $("#GlobalChangesEasyCite").is(':checked') },
            { 'GlobalChangesHFTBEnabled': $("#GlobalChangesHFTBEnabled").is(':checked') },
            { 'GlobalChangesHFTBStickyEnabled': $("#GlobalChangesHFTBStickyEnabled").is(':checked') },
            // Fav Text/Links
            { 'GlobalChangesHFTBFav1Text': $("#GlobalChangesHFTBFav1Text").val() },
            { 'GlobalChangesHFTBFav1Link': $("#GlobalChangesHFTBFav1Link").val() },
            { 'GlobalChangesHFTBFav2Text': $("#GlobalChangesHFTBFav2Text").val() },
            { 'GlobalChangesHFTBFav2Link': $("#GlobalChangesHFTBFav2Link").val() },
            { 'GlobalChangesHFTBFav3Text': $("#GlobalChangesHFTBFav3Text").val() },
            { 'GlobalChangesHFTBFav3Link': $("#GlobalChangesHFTBFav3Link").val() },
            { 'GlobalChangesHFTBFav4Text': $("#GlobalChangesHFTBFav4Text").val() },
            { 'GlobalChangesHFTBFav4Link': $("#GlobalChangesHFTBFav4Link").val() },
            { 'GlobalChangesHFTBFav5Text': $("#GlobalChangesHFTBFav5Text").val() },
            { 'GlobalChangesHFTBFav5Link': $("#GlobalChangesHFTBFav5Link").val() },
            { 'GlobalChangesHFTBFav6Text': $("#GlobalChangesHFTBFav6Text").val() },
            { 'GlobalChangesHFTBFav6Link': $("#GlobalChangesHFTBFav6Link").val() },
            { 'GlobalChangesHFTBFav7Text': $("#GlobalChangesHFTBFav7Text").val() },
            { 'GlobalChangesHFTBFav7Link': $("#GlobalChangesHFTBFav7Link").val() },
            { 'GlobalChangesUserNotes': $("#GlobalChangesUserNotes").is(':checked') },
            { 'GlobalChangesNewPostLinks': $("#GlobalChangesNewPostLinks").is(':checked') }
            ]
        // { '': $("#").val() }
    }, function () {
        // Save Confirmation
    });
}

function loadGlobalChanges() {
    var GlobalChangesHideLocationEnabled, GlobalChangesEasyCiteEnabled
    GlobalChangesHFTBEnabled, GlobalChangesHFTBStickyEnabled, GlobalChangesNewPostLinks;
    chrome.storage.sync.get("GlobalChanges", function (data) {
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
                $.each(data, function (key, value) {
                    switch (key) {
                        case "GlobalChangesHideLocationEnabled": GlobalChangesHideLocationEnabled = value; 
                            break;
                        case "GlobalChangesDenyPMReceiptEnabled": $("#PMChangesDenyPMReceipt").prop('checked', value);
                            break;
                        case "GlobalChangesEasyCiteEnabled": GlobalChangesEasyCiteEnabled = value;
                            break;
                        case "GlobalChangesHFTBEnabled": GlobalChangesHFTBEnabled = value;
                            break;
                        case "GlobalChangesHFTBStickyEnabled": GlobalChangesHFTBStickyEnabled = value;
                            break;
                        case "GlobalChangesHFTBFav1Text": $("#GlobalChangesHFTBFav1Text").val(value);
                            break;
                        case "GlobalChangesHFTBFav1Link": $("#GlobalChangesHFTBFav1Link").val(value);
                            break;
                        case "GlobalChangesHFTBFav2Text": $("#GlobalChangesHFTBFav2Text").val(value);
                            break;
                        case "GlobalChangesHFTBFav2Link": $("#GlobalChangesHFTBFav2Link").val(value);
                            break;
                        case "GlobalChangesHFTBFav3Text": $("#GlobalChangesHFTBFav3Text").val(value);
                            break;
                        case "GlobalChangesHFTBFav3Link": $("#GlobalChangesHFTBFav3Link").val(value);
                            break;
                        case "GlobalChangesHFTBFav4Text": $("#GlobalChangesHFTBFav4Text").val(value);
                            break;
                        case "GlobalChangesHFTBFav4Link": $("#GlobalChangesHFTBFav4Link").val(value);
                            break;
                        case "GlobalChangesHFTBFav5Text": $("#GlobalChangesHFTBFav5Text").val(value);
                            break;
                        case "GlobalChangesHFTBFav5Link": $("#GlobalChangesHFTBFav5Link").val(value);
                            break;
                        case "GlobalChangesHFTBFav6Text": $("#GlobalChangesHFTBFav6Text").val(value);
                            break;
                        case "GlobalChangesHFTBFav6Link": $("#GlobalChangesHFTBFav6Link").val(value);
                            break;
                        case "GlobalChangesHFTBFav7Text": $("#GlobalChangesHFTBFav7Text").val(value);
                            break;
                        case "GlobalChangesHFTBFav7Link": $("#GlobalChangesHFTBFav7Link").val(value);
                            break;
                        case "GlobalChangesUserNotes": $("#GlobalChangesUserNotes").prop('checked', value);
                            break;
                        case "GlobalChangesNewPostLinks": GlobalChangesNewPostLinks = value;
                            break;
                        default: console.log("ERROR: Key not found.");
                            /*
                            case "": $("#").val(value);
                            break;
                            */
                    }
                })
            })
            if (GlobalChangesHideLocationEnabled !== false) {
                $("#HideLocation").prop('checked', true);
            }
            if (GlobalChangesEasyCiteEnabled !== false) {
                $("#GlobalChangesEasyCite").prop('checked', true);
            }
            if (GlobalChangesHFTBEnabled !== false) {
                $("#GlobalChangesHFTBEnabled").prop('checked', true);
            }
            if (GlobalChangesHFTBStickyEnabled !== false) {
                $("#GlobalChangesHFTBStickyEnabled").prop('checked', true);
            }
            if (GlobalChangesNewPostLinks !== false) {
                $("#GlobalChangesNewPostLinks").prop('checked', true);
            }
        });
    });
}

function saveQuickRepChanges() {
    chrome.storage.sync.set({
        QuickRepChanges:
            [{ 'QuickRepEnabled': $("#QuickRep").is(':checked') }]
    }, function () {
        // Save Confirmation
    });
}

function loadQuickRepChanges() {
    var QuickRepEnabled;
    chrome.storage.sync.get("QuickRepChanges", function (data) {
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
                $.each(data, function (key, value) {
                    switch (key) {
                        case "QuickRepEnabled": QuickRepEnabled = value;
                            break;
                        default: console.log("ERROR: Key not found.");
                    }
                })
            })
            if (QuickRepEnabled !== false) {
                $("#QuickRep").prop('checked', true);
            }
        });
    });
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
    var ForumChangesForumRatingEnabled, ForumChangesEnhancedSYTEnabled;
    chrome.storage.sync.get("ForumChanges", function (data) {
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
                $.each(data, function (key, value) {
                    switch (key) {
                        case "ForumChangesForumRatingEnabled": ForumChangesForumRatingEnabled = value;
                            break;
                        case "ForumChangesEnhancedSYTEnabled": ForumChangesEnhancedSYTEnabled = value;
                            break;
                        case "ForumChangesHideClosedEnabled": $("#ForumChangesHideClosed").prop('checked', value);
                            break;
                        case "ForumChangesHideForumRatingsEnabled": $("#ForumChangesHideForumRatings").prop('checked', value);
                            break;
                        default: console.log("ERROR: Key not found.");
                    }
                })
            })
            if (ForumChangesForumRatingEnabled !== false) {
                $("#ForumChangesForumRating").prop('checked', true);
            }
            if (ForumChangesEnhancedSYTEnabled !== false) {
                $("#ForumChangesEnhancedSYT").prop('checked', true);
            }
        });
    });
}

function savePMChanges() {
    chrome.storage.sync.set({
        PMChanges:
            [{ 'PMChangesQuoteStripping': $("#PMChangesQuoteStripping").is(':checked') },
            { 'PMChangesSalutationEnable': $("#PMChangesSalutation").is(':checked') },
            { 'PMChangesSalutationText': $("#PMChangesSalutationText").val()+"\n\n" },
            { 'PMChangesSignatureEnable': $("#PMChangesSignature").is(':checked') },
            { 'PMChangesSignatureText': $("#PMChangesSignatureText").val() },
            { 'PMChangesTrackingLinksEnable': $("#PMChangesTrackingLinks").is(':checked') }]
    }, function () {
        // Save Confirmation
    });
}

function loadPMChanges() {
    var PMChangesQuoteStripping, ForumChangesEnhancedSYTEnable;
    chrome.storage.sync.get("PMChanges", function (data) {
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
                $.each(data, function (key, value) {
                    switch (key) {
                        case "PMChangesQuoteStripping": PMChangesQuoteStripping = value;
                            break;
                        case "PMChangesSalutationEnable": $("#PMChangesSalutation").prop('checked', value);
                            break;
                        case "PMChangesSalutationText": $("#PMChangesSalutationText").val(value);
                            break;
                        case "PMChangesSignatureEnable": $("#PMChangesSignature").prop('checked', value);
                            break;
                        case "PMChangesSignatureText": $("#PMChangesSignatureText").val(value);
                            break;
                        case "PMChangesTrackingLinksEnable": ForumChangesEnhancedSYTEnable = value;
                            break;
                        default: console.log("ERROR: Key not found.");
                    }
                })
            })
            if (PMChangesQuoteStripping !== false) {
                $("#PMChangesQuoteStripping").prop('checked', true);
            }
            if (ForumChangesEnhancedSYTEnable !== false) {
                $("#PMChangesTrackingLinks").prop('checked', true);
            }
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
    var ImageChangesMaxSizeEnable;
    chrome.storage.sync.get("ImageChanges", function (data) {
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
                $.each(data, function (key, value) {
                    switch (key) {
                        case "ImageChangesMaxSizeEnable": ImageChangesMaxSizeEnable = value;
                            break;
                        case "ImageChangesReplaceBrokenEnable": $("#ImageChangesReplaceBroken").prop('checked', value);
                            break;
                        case "ImageChangesForceHTTPSEnable": $("#ImageChangesForceHTTPS").prop('checked', value);
                            break;
                        default: console.log("ERROR: Key not found.");
                    }
                })
            })
            if (ImageChangesMaxSizeEnable !== false) {
                $("#ImageChangesMaxSize").prop('checked', true);
            }
        });
    });
}

function savePostOptions() {
    chrome.storage.sync.set({
        PostOptions: [{ 'PostOptionsThreadRatingEnable': $("#PostOptionsThreadRating").is(':checked') },
            { 'PostOptionsPoTEnable': $("#PostOptionsPoT").is(':checked') },
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
    var PostOptionsThreadRatingEnable, PostOptionsPoTEnable, PostOptionsThreadsEnable,
        PostOptionsPostsEnable, PMChangesPMFromPostEnable, AnnoyanceFixerFullscreenYoutubeEnable,
        AnnoyanceFixerShowBlockedPostsEnable;
    chrome.storage.sync.get("PostOptions", function (data) {
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
                $.each(data, function (key, value) {
                    switch (key) {
                        case "PostOptionsThreadRatingEnable": PostOptionsThreadRatingEnable = value;
                            break;
                        case "PostOptionsPoTEnable": PostOptionsPoTEnable = value;
                            break;
                        case "PostOptionsThreadsEnable": PostOptionsThreadsEnable = value;
                            break;
                        case "PostOptionsPostsEnable": PostOptionsPostsEnable = value;
                            break;
                        case "PMChangesPMFromPostEnable": PMChangesPMFromPostEnable = value;
                            break;
                        case "AnnoyanceFixerFullscreenYoutubeEnable": AnnoyanceFixerFullscreenYoutubeEnable = value;
                            break;
                        case "AnnoyanceFixerShowBlockedPostsEnable": AnnoyanceFixerShowBlockedPostsEnable = value;
                            break;
                        case "AnnoyanceFixerHideBlockedPostsEnable": $("#AnnoyanceFixerHideBlockedPosts").prop('checked', value);
                            break;
                        default: console.log("ERROR: Key not found.");
                    }
                })
            })
            if (PostOptionsThreadRatingEnable !== false) {
                $("#PostOptionsThreadRating").prop('checked', true);
            }
            if (PostOptionsPoTEnable !== false) {
                $("#PostOptionsPoT").prop('checked', true);
            }
            if (PostOptionsThreadsEnable !== false) {
                $("#PostOptionsThreads").prop('checked', true);
            }
            if (PostOptionsPostsEnable !== false) {
                $("#PostOptionsPosts").prop('checked', true);
            }
            if (PMChangesPMFromPostEnable !== false) {
                $("#PMChangesPMFromPost").prop('checked', true);
            }
            if (AnnoyanceFixerFullscreenYoutubeEnable !== false) {
                $("#AnnoyanceFixerFullscreenYoutube").prop('checked', true);
            }
            if (AnnoyanceFixerShowBlockedPostsEnable !== false) {
                $("#AnnoyanceFixerShowBlockedPosts").prop('checked', true);
            }
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
    var OnlineSortingEnable;
    chrome.storage.sync.get("OnlineSorting", function (data) {
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
                $.each(data, function (key, value) {
                    switch (key) {
                        case "OnlineSortingEnable": OnlineSortingEnable = value;
                            break;
                        default: console.log("ERROR: Key not found.");
                    }
                })
            })
            if (OnlineSortingEnable !== false) {
                $("#OnlineSortingEnable").prop('checked', true);
            }
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
    var RepChartsEnable, RepChartsLinksEnable;
    chrome.storage.sync.get("RepCharts", function (data) {
        $.each(data, function (index, data) {
            $.each(data, function (index, data) {
                $.each(data, function (key, value) {
                    switch (key) {
                        case "RepChartsEnable": RepChartsEnable = value;
                            break;
                        case "RepChartsLinksEnable": RepChartsLinksEnable = value;
                            break;
                        default: console.log("ERROR: Key not found.");
                    }
                })
            })
            if (RepChartsEnable !== false) {
                $("#RepChartsEnable").prop('checked', true);
            }
            if (RepChartsLinksEnable !== false) {
                $("#RepChartsLinksEnable").prop('checked', true);
            }
        });
    });
}

function saveRepCharts() {
    chrome.storage.sync.set({RepCharts:
            [{ 'RepChartsEnable': $("#RepChartsEnable").is(':checked') },
            { 'RepChartsLinksEnable': $("#RepChartsLinksEnable").is(':checked') }]
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