var res = {
    tileBlue : "/res/1.png",
    tileGreen : "res/2.png",
    tilePurple : "res/3.png",
    tileRed: "res/4.png",
    tileYellow: "res/5.png",
    button: "res/button-big-purple.png",
    gamefield: "res/gamefield.png",
    progressHoster: "res/progress-bar-hoster.png",
    progressBar: "res/progress-bar.png",
    progressBarCourse: "res/progress-course.png",
    bombie: "res/bombie.png",
    MARVIN: { type: "ttf", name: "Marvin", srcs: ["res/Marvin.ttf"]}
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
