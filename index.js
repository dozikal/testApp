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
    var temp = newsItems.splice(itemsPerPage * (index - 1), itemsPerPage);
    var temp3 = [];

    for (i = 0; i < temp.length; i++) {
        console.log('Gate 2', temp.length);
        var temp2 = document.getElementById("listItemTemplate").cloneNode(true);
        temp2.classList.remove('hidden');
        temp2.childNodes[1].src = temp[i].avatar;
        console.log(temp2.childNodes[2].c);
        //temp2.childNodes[1].childNodes[1].innerHTML = temp[i].title;
        //temp2.getElementsByName('date')[0].innerHTML = newsItems[0].createdAt;
        document.getElementById('newsList').appendChild(temp2);
        
    }
    
    return;
}

init = () => {
    getNews((x) => {
        x > 0 ? refreshPage(1) : null;
    });
    return;
}

init();