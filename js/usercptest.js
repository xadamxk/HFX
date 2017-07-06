replace = "<strong>Email:</strong> <a class='toggleEmail' style='color:white;cursor:pointer;'>Show</a><p class='showEmail' style='display:none'>$1</p><br />";
document.body.innerHTML = document.body.innerHTML.replace(/<strong>Email\:<\/strong>(.*?)<br>/, replace);

$(".toggleEmail").click(function () {
    if ($(this).text() == "Show") {
        $(".showEmail").css("display", "inline");
        $(this).text("Hide");
    } else {
        $(".showEmail").css("display", "none");
        $(this).text("Show");
    }
});