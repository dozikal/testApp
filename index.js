var xhttp = new XMLHttpRequest();
var newsItems = [];
var itemsPerPage = 10;
var currentPage = 1;

var base = 'https://5bee92827839000013e6faed.mockapi.io/clane/api/v2';
var endPoints = {
    getAllNews: base + '/news',
    getNews: base + '/news?page=1&limit=10',
    getNewsById: base + '/news/:id',
}

console.log("Script started");

getNews = (callback) => {
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200)
            newsItems = [...newsItems, ...JSON.parse(xhttp.responseText)];
        console.log(newsItems[5]);
        console.log(newsItems.length);
        return callback(newsItems.length);
    }
    xhttp.open("GET", endPoints.getAllNews, true); // true for asynchronous 
    xhttp.send(null);
}

refreshPage = (index) => {

    console.log('Gate 1');
    var subArray = newsItems.splice(itemsPerPage * (index - 1), itemsPerPage);
    var temp = '';

    for (i = 0; i < subArray.length; i++) {
        console.log('Gate 2', subArray.length);

        temp = temp.concat("<div class='container4' id='" + subArray[i].id + "'><img name='avatar' src='" + subArray[i].avatar + "' class='image1'><div class='container7'><div name='title' class='text1'>" + subArray[i].title + "</div><div name='createdAt' class='text2'>" + new Date(subArray[i].createdAt) + "</div></div></div>");
    }
    document.getElementById('newsList').innerHTML = temp;

    return;
}

init = () => {
    getNews((x) => {
        x > 0 ? refreshPage(1) : null;
    });
    return;
}

init();