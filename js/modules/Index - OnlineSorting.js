var debug = false;
var enableOnlineSorting = true;
getOnlineSorting();

// Set vars equal to saved settings
function getOnlineSorting() {
    chrome.storage.sync.get("OnlineSorting", function (data) {
        if (!chrome.runtime.error){
            $.each(data, function (index, data1) {
                $.each(data1, function (index1, data2) {
                    $.each(data2, function (key, value) {
                        if (typeof key === undefined || typeof value === undefined) { return; }
                        switch (key) {
                            case "OnlineSortingEnable": enableOnlineSorting = value;
                                break;
                            default: //console.log("ERROR: Key not found.");
                                break;
                        }
                    })
                })

            });
            if (enableOnlineSorting)
                onlineSorting();
        }
    });
}

function onlineSorting() {
    'use strict';
    var groupBox = [];
    var groupHeaders = [];
    var groupsContainer = document.createElement("div");
    var groups = { "Regular": [], "L33T": [], "UB3R": [], "Divined": [], "Custom Groups": [], "Banned": [], "Staff": [], "Closed": [], "Other": [] };
    var boardStats = document.getElementById("boardstats_e");
    var memberStats = boardStats.getElementsByTagName("tr");
    var memberList = memberStats[1].getElementsByClassName("smalltext");
    var members = memberList[0].getElementsByTagName("span");
    var memberTotal = members.length;
    for (var value in groups) {
        groupHeaders[value] = document.createElement("div");
        groupBox[value] = document.createElement("div");
        if (value == "Regular") {
            $(groupHeaders[value]).append($("<b>").text(value));
            
        }
        else {
            $(groupHeaders[value]).append("<br>").append($("<b>").text(value));
        }
        groupBox[value].appendChild(groupHeaders[value]);
    }
    for (var i = 0; i < members.length; i++) {
        if (members) {
            var groupContainer;
            var name;
            var sep;
            var groupName;
            var nameColor;
            if (members[i].style.color == "white") {
                groupContainer = document.createElement("div");
                name = document.createElement("a");
                sep = document.createElement("span");
                sep.append(", ");
                name.append(members[i]);
                //groupBox["Bots (Web Crawlers)"].appendChild(name);
                //groupBox["Bots (Web Crawlers)"].appendChild(sep);
            }
            else {
                //console.log(members[i].className);
                groupContainer = document.createElement("div");
                nameColor = window.getComputedStyle(members[i]).getPropertyValue('color');
                groupName = rgb2group(nameColor);
                name = document.createElement("a");
                sep = document.createElement("span");
                sep.append(", "); //sep.innerHTML = ", ";//
                name.href = members[i].parentNode.href;
                //name.innerHTML = members[i].innerHTML;//
                var tempHTML = members[i].innerHTML;
                $(name).append(tempHTML);

                if (rgb2group(nameColor) == "Closed") {
                    name.style.color = "#595959";
                }
                else {
                    name.style.color = nameColor;
                }
                if (members[i].className == "group7") {
                    groupName = "Banned";
                }
                if (members[i].className == "group36") {
                    groupName = "Custom Groups";
                }
                groupBox[groupName].appendChild(name);
                groupBox[groupName].appendChild(sep);
            }
        }
    }
    for (var value in groups) {
        // Loop groups, add labels and totals
        $(groupHeaders[value]).append(groupHeaders[value]);
        $(groupHeaders[value]).append("(" + groupBox[value].getElementsByTagName("a").length + ")");
        $(groupHeaders[value]).append("<br/>");
        groupsContainer.appendChild(groupBox[value]);
    }
    // Copy Activity string (users active in the past x minutes)
    var OnlineStr = $(memberList[0]).text().substr(0, $(memberList[0]).text().indexOf('guests).') + 8);
    // Clear existing elements
    $(memberList[0]).empty();
    // Append new string + list
    $(memberList[0]).append(OnlineStr).append(groupsContainer);
}

function rgb2group(rgb) {
    if (rgb == "rgb(255, 255, 255)") {
        return "Custom Groups";
    }
    else if (rgb == "rgb(239, 239, 239)") {
        return "Regular";
    }
    else if (rgb == "rgb(153, 255, 0)" || rgb == "rgb(153, 255, 0)" || rgb == "rgb(255, 204, 0)"){
        return "L33T";
    }
    else if (rgb == "rgb(0, 170, 255)" || rgb == "rgb(0, 170, 255)" || rgb == "rgb(0, 102, 255)") {
        return "UB3R";
    }
    else if (rgb == "rgb(0, 204, 102)") {
        return "Divined"; // weird green shit
    }
    else if (rgb == "rgb(56, 56, 56)" || rgb == "rgb(68, 68, 68)") {
        return "Closed";
    }
    else if (rgb == "rgb(255, 102, 255)" || rgb == "rgb(255, 62, 171) " || rgb == "rgb(153,153,255)") {
        return "Staff"; // admins
    }
    else if (rgb == "rgb(153, 153, 255)" || rgb == "rgb(191, 80, 255)" || rgb == "rgb(153, 204, 255)") {
        return "Staff"; // staff
    }
    else {
        return "Other";
    }
}