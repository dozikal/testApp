var xhttp = new XMLHttpRequest();
var newsItems = [];
var itemsPerPage = 7;
var currentPage = 0;
var maxPages = 0;
var slideIndex = 1;

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
        generateSlides();
        return callback(newsItems.length);
    }
    xhttp.open("GET", endPoints.getAllNews, true); // true for asynchronous 
    xhttp.send(null);
}


generateSlides = () => {
    for (i = 0; i < newsItems.length; i++) {
        document.getElementById('imageSlider').innerHTML += "<img name='slide' src='" + newsItems[i].avatar + "' class='image1 hidden'></img>";
    }

    showDivs(slideIndex);
}


plusDivs = (n) => {
    showDivs(slideIndex += n);
}


showDivs = (n) => {
    var i;
    var x = document.getElementsByName('slide');
    if (n > x.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = x.length }
    for (i = 0; i < x.length; i++) {
        x[i].style.display = 'none';
    }
    x[slideIndex - 1].style.display = 'block';
}


refreshPage = (goTo) => {

    var index;

    if (goTo === 1 && currentPage < maxPages) index = currentPage + 1;
    else if (goTo === -1 && currentPage > 1) index = currentPage - 1;
    else if (goTo === 0) {
        index = currentPage;
        document.getElementById('navButtons').classList.remove('hidden');
        document.getElementById('createNewsButton').classList.remove('hidden');
        document.getElementById('createNewsContainer').classList.add('hidden');
        document.getElementById('newsView').classList.add('hidden');
    }
    else if (goTo === -2) {
        index = 1;
        document.getElementById('navButtons').classList.remove('hidden');
        document.getElementById('createNewsButton').classList.remove('hidden');
    }
    else return;

    var subArray = newsItems.slice(itemsPerPage * (index - 1), itemsPerPage * index);
    var temp = '';

    for (i = 0; i < subArray.length; i++) {

        temp = temp.concat("<div name='item' class='container4' id='" + subArray[i].id + "' onclick='newsReader(" + subArray[i].id + ")'><img name='avatar' src='" + subArray[i].avatar + "' class='image1'><div class='container7'><div name='title' class='text1'>" + subArray[i].title + "</div><div name='createdAt' class='text2'>" + new Date(subArray[i].createdAt).toUTCString() + "</div></div></div>");
    }

    var dispose = document.getElementsByName('item');

    for (i = 0; i < dispose.length; i++) {
        dispose[i].remove();
        i--;
    }

    document.getElementById('newsList').innerHTML += temp;
    currentPage = index;

    return;
}


newsReader = (id) => {
    console.log('Reader Screen', id);
    //var form = "<form id='articleForm' action='#' style='width: 100%' onsubmit='publishArticle(); return false' method='post'><textarea id='myComment' type='text' placeholder='Type comment' required></textarea><br><br><input type='submit' value='Post'></form>"
    findObject = (x) => {
        if (x.id == id) return x;
    }
    document.getElementById('newsFrame').src = newsItems.filter((a) => findObject(a))[0].url;
    document.getElementById('newsView').classList.remove('hidden');
    //document.getElementById('newsList').innerHTML = "<div class='container6'><iframe frameborder='0' width='100%' src='" + newsItems.filter((a) => findObject(a))[0].url + "'></iframe><div id='commentBox' class='container12'><div class='container13'>This is a comment</div></div>" + form + "<div class='button3 but' onclick='refreshPage(0)'>Back</div></div>";
    document.getElementById('navButtons').classList.add('hidden');
    document.getElementById('createNewsButton').classList.add('hidden');

    /*
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            document.getElementById('newsList').innerHTML = "<div class='container6'>" + xhttp.responseText +"<div class='button3' onclick='refreshPage(0)'>Back</div></div>";

            console.log(xhttp.responseText)
        }
    }

    

    xhttp.open("GET", newsItems.filter((a) => findObject(a))[0].url, true); // true for asynchronous
    xhttp.send(null);
    */
}


resizeIFrameToFitContent = (iFrame) => {

    iFrame.width = iFrame.contentWindow.document.body.scrollWidth;
    iFrame.height = iFrame.contentWindow.document.body.scrollHeight;
}


createNews = () => {
    document.getElementById('navButtons').classList.add('hidden');
    document.getElementById('createNewsButton').classList.add('hidden');
    //document.getElementById('newsList').innerHTML = "<div class='container14'><form id='articleForm' action='#' style='margin: auto;' onsubmit='publishArticle(); return false' method='post'><label for='articleTitle'>Article Title: </label><input id='articleTitle' name='articleTitle' type='text' placeholder='Article Title' required><br><input type='file' onchange='selectImage()' required><div class='container10'><img id='articleImage' class='image2' src='https://css-tricks.com/wp-content/uploads/2015/11/drag-drop-upload-6.gif'></div><input id='articleAuthor' type='text' placeholder='Author' required><br><input id='articleUrl' type='url' placeholder='article's url' required><br><input id='articleId' type='number' placeholder='article id' required><br><input type='submit' value='Publish'></form><div class='button3 but' onclick='refreshPage(0)'>Back</div></div>"
    document.getElementById('createNewsContainer').classList.remove('hidden');
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


publishArticle = () => {

    var myObject = {
        author: document.getElementById('articleAuthor').value,
        avatar: document.getElementById('articleImage').src,
        createdAt: new Date(),
        title: document.getElementById('articleTitle').value,
        id: document.getElementById('articleId').value,
        url: document.getElementById('articleUrl').value
    }
    newsItems.unshift(myObject);
    refreshPage(-2);
    setTimeout(() => {
        document.getElementById('createNewsContainer').classList.add('hidden');
    }, 1000);

    console.log(myObject);
}


addComment = () => {
    var id = Date.now();
    document.getElementById('commentBox').innerHTML += "<div id='" + id + "' style='position: relative'><div class='container13'>" + document.getElementById('myComment').value + "</div><div class='button8 but' onclick='deleteComment("+ id +")'>x</div></div>";
    document.getElementById('myComment').value = '';
}


deleteComment = (x) => {
    document.getElementById(x).remove();
}


init = () => {
    getNews((x) => {
        x > 0 ? refreshPage(1) : null;
    });
    return;
}

init();