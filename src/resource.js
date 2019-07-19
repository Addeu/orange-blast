var res = {
    tileBlue : "res/1.png",
    tileGreen : "res/2.png",
    tilePurple : "res/3.png",
    tileRed: "res/4.png",
    tileYellow: "res/5.png",
    superBlue : "res/1a.png",
    superGreen : "res/2a.png",
    superPurple : "res/3a.png",
    superRed: "res/4a.png",
    superYellow: "res/5a.png",
    button: "res/button-big-purple.png",
    gamefield: "res/gamefield.png",
    progressHoster: "res/progress-bar-hoster.png",
    progressBar: "res/progress-bar.png",
    progressBarCourse: "res/progress-course.png",
    bombie: "res/bombie.png",
    crossie: "res/crossie",
    MARVIN: { type: "ttf", name: "Marvin", srcs: ["res/Marvin.ttf"]}
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
