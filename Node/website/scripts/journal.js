/*Post displaying*/
function buildPost(postTitle, postDate, postContent){
    var post = document.createElement("div");
    post.id = "post";

    var title = document.createElement("h2");
    title.id = "title";
    title.appendChild(document.createTextNode(postTitle));

    var date = document.createElement("p");
    date.id = "date";
    dateString = strDate(postDate);
    date.appendChild(document.createTextNode(dateString));

    var content = document.createElement("p");
    content.id = "content";
    content.appendChild(document.createTextNode(postContent));

    post.appendChild(title);
    post.appendChild(date);
    post.appendChild(content);

    var postsDiv = document.getElementById('posts');
    postsDiv.appendChild(post);
}

/* Format date for post */
function strDate(date) {
    var result = date.toDateString();



    return result;
}
