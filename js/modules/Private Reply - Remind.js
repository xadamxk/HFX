class Remind {
    constructor() {
        this.injectRemindButton();
    }

    injectRemindButton() {
        $(".postbit_buttons").append($("<a>").html("<span>Remind Me</span>").attr("id", "remindMe").css("margin-right","5px").attr("href", "#").addClass("remindMeButton"));
    }

    getPMAuthorInfo() {
        return {
            name: $($(".author_information").find("a span")).text(),
            href: $($(".author_information").find("a")[0]).attr("href")
        };
    }

    getPMTitle() {
        return $("#posts").parent().parent().parent().find(".thead").text();
    }

    getPMBody() {
        return $(".post_body").text();
    }

    getPMHref() {
        return location.href;
    }

    getPostDate() {
        return $(".post_date").text();
    }

    post() {
        $.post("/private.php", this.getPostParams(), function(data, success) {
            this.success();
        });
    }

    getPostParams() {
        return {
            "my_post_key": $('[name="my_post_key"]').attr("value"),
            "subject": `HFX[Remind Me] ${this.title}`,
            "options": {
                "signature": $('[name="options[signature]"]').attr("value"),
                "disablesmilies": $('[name="options[disablesmilies]"]').attr("value"),
                "savecopy": $('[name="options[savecopy]"]').attr("value"),
                "savecopy": $('[name="options[readreceipt]"]').attr("value")
            },
            "action": "do_send",
            "pmid": 0,
            "do": "",
            "message": this.getMessageBody(),
            "to": $(".welcome strong a").text(),
        };
    }

    getMessageBody() {
        var body = `[b]From:[/b] ${this.author_info.name} ${this.author_info.href} |
[b]Date/time of message received:[/b] ${this.post_date} |
[b]PM URL:[/b] ${this.href} |
[b]PM Ttle:[/b] ${this.title} |
-----
${this.body}`;
        return body;
    }

    clicked() {
        this.author_info = this.getPMAuthorInfo();
        this.title = this.getPMTitle();
        this.body = this.getPMBody();
        this.href = this.getPMHref();
        this.post_date = this.getPostDate();
        this.post();
    }

    success() {
        alert("PM sent");
    }
}

isFeatureEnabled("PMChanges", "PMChangesRemind", function(data) {
    if (data) {
        var remind = new Remind();
        $("#remindMe").click(function(e) {
            remind.clicked();
            e.preventDefault();
        });
    }
});