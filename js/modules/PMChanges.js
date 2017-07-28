var debug = false;
var quoteStripping = false;
var pMTracking = false;
var signatureEnable = false;
var signatureText = false;
var headerEnable = false;
var headerText = false;
getPMChanges();

// Set vars equal to saved settings
function getPMChanges() {
    chrome.storage.sync.get("PMChanges", function (data) {
        if (!chrome.runtime.error) {
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        switch (key) {
                            case "PMChangesQuoteStripping": if (value) { maxSizeEnable = value }
                                break;
                            case "PMChangesPMTracking": if (value) { replaceBrokenEnable = value }
                                break;
                            case "PMChangesSignatureEnable": if (value) { forceHTTPSEnable = value }
                                break;
                            case "PMChangesSignatureText": if (value) { forceHTTPSEnable = value }
                                break;
                            case "PMChangesHeaderEnable": if (value) { forceHTTPSEnable = value }
                                break;
                            case "PMChangesHeaderText": if (value) { forceHTTPSEnable = value }
                                break;
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })

            });
            setPMChanges();
        }
    });
}
function setPMChanges() {
    
}