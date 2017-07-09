$(document).ready(function () {
    console.log("testiiiiiing");
    $(".PostbitHide").change(function () {
        //
        console.log("PostbitHide Settings Changed!");
        savePostbitHide();
    });
});

function savePostbitHide() {
    chrome.storage.sync.set({PostbitHide:
        [{'PostbitHideAvatar': $("#PostbitHideAvatar").is(':checked')},
        {'PostbitHideUsertitle': $("#PostbitHideUsertitle").is(':checked')},
        {'PostbitHidePrestige': $("#PostbitHidePrestige").is(':checked')},
        {'PostbitHidePostCount': $("#PostbitHidePostCount").is(':checked')},
        {'PostbitHideJoinDate': $("#PostbitHideJoinDate").is(':checked')},
        {'PostbitHideReputation': $("#PostbitHideReputation").is(':checked')},
        {'PostbitHideWarningLevel': $("#PostbitHideWarningLevel").is(':checked')},
        {'PostbitHideAwards': $("#PostbitHideAwards").is(':checked')},
        {'PostbitHideSignature': $("#PostbitHideSignature").is(':checked')}]
    }, function () {
        chrome.storage.sync.get("PostbitHide", function (data) {
            console.log("PostbitHide", data);
        });
    });
}