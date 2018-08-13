var debug = false;

class HFNewsNotifier {
    constructor() {
        this.editionNum = "";
        this.editionTitle = "";
    }
    getEditionNum() {
        return this.editionNum;
    }
    setEditionNum(editionNum) {
        this.editionNum = editionNum;
    }
    getEditionTitle() {
        return this.editionTitle;
    }
    setEditionTitle(editionTitle) {
        this.editionTitle = editionTitle;
    }

    run() {
        this.getResponse();
    }
    // Fetch Results
    getResponse() {
        $.ajax({
            url: "https://hackforums.net/forumdisplay.php?fid=162",
            cache: false,
            success: function (response) {
                this.setEditionTitle(postGetRequest(response));
            },
            error: function (error) {
                console.log("There was an error retrieving the section data: " + error);
                return null;
            }
        });
    }
    postGetRequest(res) {
        var title = this.parseResponseSectionName(res);
        return title;
    }
    parseResponseThreads(response) {
        //
    }
    parseResponseSectionName(response) {
        return $(response).find(".navigation").find(".active").text();
    }
    // Save Results (w/ Newest Edition)
    // Is New Edition
}

var test = new HFNewsNotifier();
console.log(test.getEditionTitle);
test.run();