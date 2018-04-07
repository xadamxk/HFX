var debug = false;
var enableTSChart = false;
// Colors
// Values
var low = 3;
var medium = 6;
var high = 9;
var vhigh = 12;
// ------------------------------ Classes -----------------------------
class TSItem {
    constructor(label, weight, color, finalWeight) {
        this.label = label; // Label
        this.weight = weight; // Weight
        this.color = color; // Color
        this.finalWeight = finalWeight; // Actual Score
        this.set();
    }
    set() {
        this.label = "";
        this.weight = 0;
        this.color = 0;
        this.finalWeight = 0;
    }
}
class TSOverall {
    constructor(totalOverall, totalActual, countRed, countYellow, countGreen) {
        this.totaloverall = totalOverall;
        this.totalActual = totalActual;
        this.countRed = countRed;
        this.countYellow = countYellow;
        this.countGreen = countGreen;
        this.set();
    }
    set() {
        this.totalOverall = 0;
        this.totalActual = 0;
        this.countRed = 0;
        this.countYellow = 0;
        this.countGreen = 0;
    }
}
// ------------------------------ Settings -----------------------------
var trustScanList = [];

var gauth2FA = new TSItem();
gauth2FA.label = "Gauth/2FA:";
gauth2FA.weight = vhigh;
trustScanList.push(gauth2FA);

var lastGauth = new TSItem();
lastGauth.label = "Last Gauth/2FA Validation";
lastGauth.weight = medium;
trustScanList.push(lastGauth);

var numCountryLogins = new TSItem();
numCountryLogins.label = "Number of Unique Country Logins (last 30 days)";
numCountryLogins.weight = high;
trustScanList.push(numCountryLogins);

var numLoginIPs = new TSItem();
numLoginIPs.label = "Number of Unique Login IP's (last 30 days)";
numLoginIPs.weight = low;
trustScanList.push(numLoginIPs);

var numISPs = new TSItem();
numISPs.label = "Number of Unique ISP's (last 30 days)";
numISPs.weight = medium;
trustScanList.push(numISPs);

var registrationLastIP = new TSItem();
registrationLastIP.label = "Matching registration and last IP";
registrationLastIP.weight = low;
trustScanList.push(registrationLastIP);

var regionLastIP = new TSItem();
regionLastIP.label = "Matching region of registration and latest IP";
regionLastIP.weight = low;
trustScanList.push(regionLastIP);

var countryLastIP = new TSItem();
countryLastIP.label = "Matching country of registration and latest IP";
countryLastIP.weight = medium;
trustScanList.push(countryLastIP);

var ipMatchMembers = new TSItem();
ipMatchMembers.label = "Latest IP Matching Other Members";
ipMatchMembers.weight = medium;
trustScanList.push(ipMatchMembers);

var dealDisputes = new TSItem();
dealDisputes.label = "Deal Disputes (Claimant/Defendant)";
dealDisputes.weight = vhigh;
trustScanList.push(dealDisputes);

//var usernameChange = new TSItem();
//usernameChange.label = "Last Username Change";
//usernameChange.weight = medium;
//trustScanList.push(usernameChange);

var specialCharUsername = new TSItem();
specialCharUsername.label = "Special Characters in Username";
specialCharUsername.weight = low;
trustScanList.push(specialCharUsername);

var accountAge = new TSItem();
accountAge.label = "Account Age";
accountAge.weight = medium;
trustScanList.push(accountAge);
// ------------------------------ Script -----------------------------
enableTSCharts();

// Set vars equal to saved settings
function enableTSCharts() {
    chrome.storage.sync.get("TrustScanChanges", function (data) {
        if (!chrome.runtime.error) {
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        if (typeof key === undefined || typeof value === undefined) { return; }
                        switch (key) {
                            case "TSChartsEnable": enableTSChart = value;
                                break;
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })

            });
            // Run function
            injectTSChanges();
        }
    });
}

function injectTSChanges() {
    if (enableTSChart) {
        injectTSCharts();
    }
}

function injectTSCharts() {
    //
    var trustScanListStats = new TSOverall();
    var TSSearchDiv = $("table").find("strong:contains(Trust Scan Search)").parent().parent().parent().parent().parent();
    TSSearchDiv.after("<br>").after($("<table>").css("width", "100%").css("margin-right", "auto").css("margin-left", "0px").attr('id', 'hfxTSDiv').attr('border', 0).attr('cellspacing', 1)
        .attr('cellpadding', 4).attr('colspan', 4).addClass('tborder').append('<tbody>').attr('colspan', 4)).after("<br>");
    // Insert thead (title, thread hyperlink)
    $('#hfxTSDiv').append($('<tr>').append($('<td>').addClass('thead').attr('colspan', 4).append($('<strong>').text("HFX: Trust Scan Graphs"))
        .append($('<a>').attr('href', '')
            .append($('<strong>').text('Brought to you by HFX').addClass('float_right')))));
    //
    $('#hfxTSDiv').append($('<tr>')
        .append($('<td>').append($('<strong>').text('This table is part of HFX (browser extension you have installed). ' +
            'This feature is only meant to help visualize Trust Scan data. Use results AT YOUR OWN RISK!'))
            .addClass('tcat').attr('colspan', 4).css("font-size", "12px").css("width", "100%").css("color", "red")));
    //
    $('#hfxTSDiv').append($('<tr>')
        .append($('<td>').append($('<strong>').text('')).addClass('trow1').attr('colspan', 3).attr('align', 'left').css("font-size", "14px").css("width", "80%")
            .append($('<td>').attr("id", "hfxTSGraphSummary").addClass('trow1').attr('colspan', 1).css("font-size", "14px"))
            .append($('<td>').attr("id", "hfxTSGraphSpacer").addClass('').attr('colspan', 1).css("font-size", "14px").css("width", "20px"))
            .append($('<td>').attr("id", "hfxTSGraphWeight").addClass('trow1').attr('colspan', 1).css("font-size", "14px")))
        .append($('<td>').attr("id", "hfxTSFinalScore").append("Calculating...").addClass('trow1').attr('colspan', 1).attr('align', 'left').css("font-size", "14px").css("width", "20%")));

    // .append($('<td>').attr("id","hfxTSGraph").addClass('trow1').attr('colspan', 1).attr('align', 'left').css("font-size", "14px").css("width", "50%")));

    var table = $("table").find("strong:contains(Trust Scan of )").parent().parent().parent().parent();
    for (var tsListIndex = 0; tsListIndex < trustScanList.length; tsListIndex++) {
        table.find("td").each(function (tableIndex) {
            //
            if ($(this).text().includes(trustScanList[tsListIndex].label)) {
                // Get Color Level
                trustScanList[tsListIndex].color = getStatLevel($(this));
                // Get Final weight
                trustScanList[tsListIndex].finalWeight = (trustScanList[tsListIndex].weight / 3) * trustScanList[tsListIndex].color;
                // Add to final stats
                trustScanListStats.totalOverall += trustScanList[tsListIndex].weight;
                trustScanListStats.totalActual += trustScanList[tsListIndex].finalWeight;
                switch (trustScanList[tsListIndex].color) {
                    case 0:
                        break;
                    case 1: trustScanListStats.countRed++;
                        break;
                    case 2: trustScanListStats.countYellow++;
                        break;
                    case 3: trustScanListStats.countGreen++;
                        break;
                    // Normal
                    default: break;
                }
            }
        });
    }

    //console.log(trustScanListStats);
    var finalStatsString = "Weaknesses: " + trustScanListStats.countRed;
    finalStatsString += "\nWarnings: " + trustScanListStats.countYellow;
    finalStatsString += "\nStrengths: " + trustScanListStats.countGreen;
    finalStatsString += "\n\nWeighted Points: " + trustScanListStats.totalActual + "/" + trustScanListStats.totalOverall;
    finalStatsString += "\nWeighted Grade: " + parseFloat(Math.round(((trustScanListStats.totalActual / trustScanListStats.totalOverall) * 100) * 100) / 100).toFixed(2) + "%";

    $("#hfxTSFinalScore").html(finalStatsString.replace(/\n/g, '<br />'));

    //console.log(trustScanList);

    // ----- Summary -----
    var canvasTotal = document.createElement('canvas');
    canvasTotal.id = "hfxTSCanvasSummary";
    $("#hfxTSGraphSummary").append(canvasTotal);
    // Canvas instance
    var hfxTSCanvas = document.getElementById('hfxTSCanvasSummary').getContext('2d');
    // Total rep pie chart
    var hfxTSChart = new Chart(hfxTSCanvasSummary, {
        type: 'pie',
        data: {
            labels: ["Weaknesses (" + trustScanListStats.countRed + ")",
            "Warnings (" + trustScanListStats.countYellow + ")",
            "Strengths (" + trustScanListStats.countGreen + ")"],
            datasets: [{
                backgroundColor: [
                    "#ff0000",
                    "#ffff00",
                    "#00D01D"
                ],
                data: [trustScanListStats.countRed, trustScanListStats.countYellow, trustScanListStats.countGreen]
            }]
        },
        options: {
            cutoutPercentage: 50,
            animateRotate: true,
            hover: {
                animationDuration: 750
            },
            title: {
                display: true,
                fontColor: "#cccccc",
                text: 'Summary',
                fontSize: 18
            },
            legend: {
                display: true,
                fullWidth: true,
                position: 'top',
                labels: {
                    fontColor: "white",
                    boxWidth: 20,
                    fontSize: 12,
                },
            },
        }
    });
    // ----- Weighted -----
    var canvasWeight = document.createElement('canvas');
    canvasWeight.id = "hfxTSCanvasWeight";
    $("#hfxTSGraphWeight").append(canvasWeight);
    // Canvas instance
    var hfxTSCanvasWeight = document.getElementById('hfxTSCanvasWeight').getContext('2d');
    // Total rep pie chart
    var hfxTSChartWeight = new Chart(hfxTSCanvasWeight, {
        type: 'pie',
        data: {
            labels: ["Missed (" + parseFloat(Math.round((((trustScanListStats.totalOverall - trustScanListStats.totalActual) / trustScanListStats.totalOverall) * 100) * 100) / 100).toFixed(0) + "%)",
            "Score (" + parseFloat(Math.round(((trustScanListStats.totalActual / trustScanListStats.totalOverall) * 100) * 100) / 100).toFixed(0) + "%)"],
            datasets: [{
                backgroundColor: [
                    "#FFA500",
                    "#0000FF"
                ],
                data: [(trustScanListStats.totalOverall - trustScanListStats.totalActual), trustScanListStats.totalActual]
            }]
        },
        options: {
            cutoutPercentage: 50,
            animateRotate: true,
            hover: {
                animationDuration: 750
            },
            title: {
                display: true,
                fontColor: "#cccccc",
                text: 'Weighted (custom)',
                fontSize: 18
            },
            legend: {
                display: true,
                fullWidth: true,
                position: 'top',
                labels: {
                    fontColor: "white",
                    boxWidth: 20,
                    fontSize: 12,
                },
            },
        }
    });
}

function getStatLevel(leftCol) {
    var level, tsColor;
    if (leftCol.parent().children().hasClass("red") || leftCol.parent().children().children().hasClass("red")) {
        tsColor = "red";
    } else if (leftCol.parent().children().hasClass("yellow") || leftCol.parent().children().children().hasClass("yellow")) {
        tsColor = "yellow";
    } else if (leftCol.parent().children().hasClass("green") || leftCol.parent().children().children().hasClass("green")) {
        tsColor = "green";
    }
    // Need to add conditional to check for gray
    else {
        tsColor = "none";
    }
    switch (tsColor) {
        /*
        Red (low): 1
        Yellow (medium): 2
        Green (high): 3
        Normal (none): 0
        */
        case "none": level = 0;
            break;
        case "red": level = 1;
            break;
        case "yellow": level = 2;
            break;
        case "green": level = 3;
            break;
        // Normal
        default: level = -1;
            break;
    }
    return level;
}