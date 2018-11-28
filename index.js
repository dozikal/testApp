var xhttp = new XMLHttpRequest();
var newsItems = [];
var itemsPerPage = 10;
var currentPage = 0;
var maxPages = 0;

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
        maxPages = Math.ceil(newsItems.length / itemsPerPage);
        return callback(newsItems.length);
    }
    xhttp.open("GET", endPoints.getAllNews, true); // true for asynchronous 
    xhttp.send(null);
}

refreshPage = (goTo) => {

    var index;
    if (goTo === 1 && currentPage < maxPages) index = currentPage + 1;
    else if (goTo === -1 && currentPage > 1) index = currentPage - 1;
    else if (goTo === 0) index = currentPage;
    else return;

    console.log('Gate 1');
    var subArray = newsItems.slice(itemsPerPage * (index - 1), itemsPerPage * index);
    var temp = '';

    for (i = 0; i < subArray.length; i++) {
        console.log('Gate 2', subArray.length, ' ', newsItems.length);

        temp = temp.concat("<div class='container4' id='" + subArray[i].id + "' onclick='newsReader(" + subArray[i].id + ")'><img name='avatar' src='" + subArray[i].avatar + "' class='image1'><div class='container7'><div name='title' class='text1'>" + subArray[i].title + "</div><div name='createdAt' class='text2'>" + new Date(subArray[i].createdAt) + "</div></div></div>");
    }
    document.getElementById('newsList').innerHTML = temp;
    currentPage = index;

    return;
}

newsReader = (id) => {
    console.log('Reader Screen', id);
    findObject = (x) => {
        if (x.id == id) return x;
    }
    document.getElementById('newsList').innerHTML = "<div class='container6'><iframe height='100%' width='100%' src='" + newsItems.filter((a) => findObject(a))[0].url + "'></iframe><div class='button3' onclick='refreshPage(0)'>Back</div></div>";
    /*
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //document.getElementById('newsList').innerHTML = "<div class='container6'>" + xhttp.responseText +"<div class='button3' onclick='refreshPage(0)'>Back</div></div>";

            console.log(xhttp.responseText)
        }
    }

    

    xhttp.open("GET", newsItems.filter((a) => findObject(a))[0].url, true); // true for asynchronous
    xhttp.send(null);
    */
}


createNews = () => {
    document.getElementById('newsList').innerHTML = "<form style='width: 100%' action='' method='post'><div class='container9'><label for='tile'>Article Title: </label><input name='title' type='text' placeholder='Article Title' required><input type='file' onchange='selectImage()' required><div class='container10'><img id='articleImage' class='image2' src='https://css-tricks.com/wp-content/uploads/2015/11/drag-drop-upload-6.gif'></div></div><textarea col='100' row='100'class='container8' type='text' name='fname' required></textarea><input type='submit' value='Publish'></form>"
}


selectImage = () => {
    var preview = document.getElementById('articleImage');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();

    reader.addEventListener("load", function () {
        preview.src = reader.result;
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}


init = () => {
    getNews((x) => {
        x > 0 ? refreshPage(1) : null;
    });
    return;
}

init();