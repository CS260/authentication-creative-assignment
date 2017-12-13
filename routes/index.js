var express = require('express');
var router = express.Router();
var expressSession = require('express-session');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/commentDB', {useMongoClient:true});
var commentSchema = mongoose.Schema ({
        Name:String,
        Comment:String,
        Avatar:String
});

var Comment = mongoose.model('Comment', commentSchema);
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function(){
        console.log("connected");
});

router.get('/comment', function(req,res,next) {
        console.log("In the GET route?");
        Comment.find(function(err,commentList) {
                if(err) return console.error(err);
                else {
			console.log(commentList);
                        res.json(commentList);
                }
        });
});

router.post('/comment',function(req,res,next) {
        console.log("Comment Post");
        var newcomment = new Comment(req.body);
        newcomment.name = req.session.username;
	newcomment.save(function(err,post) {
                if(err) return console.error(err);
                console.log(post);
                res.sendStatus(200);
        });
});

router.delete('/comment', function(req,res,next) {
	console.log("Delete Comments");
	Comment.find().remove(function(err){
		if(err) return console.error(err);
		console.log("Deleted");
		res.sendStatus(200);
	});
});

var users = require('../controllers/users_controller');
console.log("before / Route");
router.get('/', function(req, res){
    console.log("/ Route");
//    console.log(req);
    console.log(req.session);
    if (req.session.user) {
      console.log("/ Route if user");
      res.render('index', {username: req.session.username,
                           msg:req.session.msg,
                           color:req.session.color,
                           profile_picture:req.session.profile_picture});
    } else {
      console.log("/ Route else user");
      req.session.msg = 'Access denied!';
      res.redirect('/login');
    }
});
router.get('/user', function(req, res){
    console.log("/user Route");
    if (req.session.user) {
      res.render('user', {msg:req.session.msg});
    } else {
      req.session.msg = 'Access denied!';
      res.redirect('/login');
    }
});
router.get('/signup', function(req, res){
    console.log("/signup Route");
    if(req.session.user){
      res.redirect('/');
    }
    res.render('signup', {msg:req.session.msg});
});
router.get('/login',  function(req, res){
    console.log("/login Route");
    if(req.session.user){
      res.redirect('/');
    }
    res.render('login', {msg:req.session.msg});
});
router.get('/logout', function(req, res){
    console.log("/logout Route");
    req.session.destroy(function(){
      res.redirect('/login');
    });
  });
router.post('/signup', users.signup);
router.post('/user/update', users.updateUser);
router.post('/user/delete', users.deleteUser);
router.post('/login', users.login);
router.get('/user/profile', users.getUserProfile);


module.exports = router;
