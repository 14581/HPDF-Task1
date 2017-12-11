var http = require('http');
var qs = require('querystring');
var path = require('path');
var express = require('express');
var app = express();
var ejs = require('ejs');

app.set('views','views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

var strUsrs = '';
var strPosts = '';
var users;
var posts;

/*------------------------- Users Fetch-------------------------------------------*/
var Options = {
    host: 'jsonplaceholder.typicode.com',
    path: '/users'
  };

var Callback = function(response) {
    response.on('data', function (chunk) {
        strUsrs += chunk;
    });
  response.on('end', function () {
      users = JSON.parse(strUsrs);
  });
}
var req = http.request(Options, Callback);  // Request for Users
req.end();


/*-------------------------- POSTS Fetch------------------------------------------*/
Options = {
    host: 'jsonplaceholder.typicode.com',
    path: '/posts'
  };

  Callback = function(response) {
    response.on('data', function (chunk) {
        strPosts += chunk;
    });

    response.on('end', function () {
        posts = JSON.parse(strPosts); 
    });
  }
  req = http.request(Options, Callback);
  req.end();

 
app.get('/users', function(req, res){
    res.send(usersPost(users));
  });

 
  app.get('/setcookie', function(req, res){
      res.cookie('Name','Rishi Kumar');
      res.cookie('Age','24');
    res.send("Cookie was set successfully !!");
 });

 app.get('/getcookies', function(req, res){
    var cookies = parseCookies(req);
    res.send(cookies);
 });
 function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

 app.get('/robots.txt', function(req, res){
    res.status(403);
    res.send('Access Denied !!');
 });

 app.get('/image', function(req, res){
    res.render('sample',{title : 'Rendering Image'});
 });

 app.get('/input', function(req, res){
    res.send("<h2> Enter some text and click on Submit !</h2> "+
    "<form method='post' action='/submitted'><input type='text' name='rndtxt' placeholder='Enter some Random Text' /><br/><br/><button name='btn' type='submit'>Submit</button></form>");
 });

 app.post('/submitted', function(req, res){
    if (req.method == 'POST') {
        var submittedRes = '';

        req.on('data', function (data) {
            submittedRes += data;
        });

        req.on('end', function () {
            op = qs.parse(submittedRes);
            res.send("Voilla !! U entered '"+op.rndtxt+"'");
        });
    }
 });

function usersPost(users){
    var text = '<table>';
    for (var key in users){
         text += '<tr><td> Id : '+ users[key].id +'&nbsp;</td><td>Name : ' + users[key].name + '&nbsp;</td><td>No. of Posts :  ' + getPostCount(users[key].id)+ '</td></tr>'
    }
    text += '</table>'
    return text;
}
function getPostCount(userid){
    var count= 0;
    for(var key in posts){
        if(posts[key].userId === userid)
            count++;
    }
    return count;
}

app.listen(3000);