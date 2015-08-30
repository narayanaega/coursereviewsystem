//Declaring raquired modules for node.js
var express = require('express');
var app = express();

var expressSession = require('express-session');
var expressHbs = require('express3-handlebars');
var mongoUrl = 'mongodb://localhost:27017/docreview';
var MongoStore = require('connect-mongo')(expressSession);
var mongo = require('./lib/mongo');

var methods = require('./lib/methods');


var port = 3333; // port number which we are using for node server


// Use this so we can get access to `req.body` in our posted forms.
app.use( require('body-parser')() );

// We need to use cookies for sessions, so use the cookie parser
app.use( require('cookie-parser')() );

app.use( expressSession({
  secret: 'somesecretrandomstring',
  store: new MongoStore({
    url: mongoUrl
  })
}));

// We must use this middleware _after_ the expressSession middleware,
// because checkIfLoggedIn checks the `req.session.username` value,
// which will not be available until after the session middleware runs.
app.use(methods.checkIfLoggedIn);


//set up of view engine
app.engine('html', expressHbs({extname:'html', defaultLayout:'main.html'}));
app.set('view engine', 'html');

//To get home page
app.get('/', function(req, res){

    res.render('index.html');
});

//To get login page
app.get('/login', function(req, res){
  res.render('login');
});


//To get logout page
app.get('/logout', function(req, res){
  delete req.session.username;
  res.redirect('/');
});

//To get a restriction notice page
app.get('/not_allowed', function(req, res){
  res.render('not_allowed');
});

app.get('/selectoption', function(req, res){
  res.render('selectoption');
});

//To get a Reviewer home page
app.get('/reviewer', function(req, res){
  username=req.session.username;
  var doc_Coll=mongo.collection('doclist');


  doc_Coll.find({status:{$ne:"Review completed"},reviewer:username}).toArray(function(err, doc_list){
    req.session.username = username;
  res.render('reviewer',{docs:doc_list});
});
});
app.get('/scoredoc', function(req, res){
  res.render('scoredoc');
});

app.get('/changestatus', function(req, res){
  username=req.session.username;
  var doc_Coll=mongo.collection('doclist');


  doc_Coll.findOne({cid:req.session.cid},function(err, record){
    req.session.username = username;
  res.render('changestatus',{record:record});
});
});
// The secret url includes the requireUser middleware.
app.get('/secret', methods.requireUser, function(req, res){
  res.render('secret');
});

//To get signup page
app.get('/signup', function(req,res){
  res.render('signup');
});

app.get('/applicanthome',function(req,res){
  username=req.session.username;
  req.session.username = username;
  res.render('applicanthome');
}
);
app.get('/viewstatus',function(req,res){
  username=req.session.username;
  var doc_Coll=mongo.collection('doclist');


  doc_Coll.find({aid:req.session.username}).toArray(function(err, doc_list){
    req.session.username = username;
  res.render('viewstatus',{docs:doc_list});
});
}
);

app.get('/admin',function(req,res){
  username=req.session.username;
  var doc_Coll=mongo.collection('doclist');


  doc_Coll.find().toArray(function(err, doc_list){
    req.session.username = username;
  res.render('admin',{docs:doc_list});
});
}
);

//To get default user screen
app.get('/userscreen', function(req,res){
username=req.session.username;
req.session.username = username;
    res.render('userscreen');

});

app.get('/submitted', function(req, res){
  username=req.session.username;
  var coll_score=mongo.collection("scorecards");
  coll_score.find({cid:req.session.cid}).toArray(function(err, scores){
    req.session.username = username;
  res.render('submitted',{scores:scores});
});

});

//To Submit a document for review
app.post('/submitdoc',function(req,res)
{
  username=req.session.username;
  var aname=req.body.aname;
  var aid=req.session.username;
  var cid=req.body.cid;
  var email=req.body.email;
  methods.submitDoc(aname, aid,cid, email, function(err, user){
    if (err) {
      res.render('userscreen', {error: err});
    } else {

      // This way subsequent requests will know the user is logged in.
      req.session.username = username;

      res.redirect('/applicanthome');
    }
  });
});
//To Submit a document for review
app.post('/scoredoc',function(req,res)
{
  username=req.session.username;
  var cid=req.body.selected;
  req.session.cid=cid;
      // This way subsequent requests will know the user is logged in.
      req.session.username = username;

      res.redirect('/selectoption');

});
app.post('/changestatus',function(req,res)
{
  username=req.session.username;
  var status=req.body.status;
  var coll=mongo.collection("doclist");
  if(status=="inreview")
  coll.update({cid:req.session.cid},{$set:{status:"In Review"}},function(err,user){});
      req.session.username = username;

      res.redirect('/reviewer');

});

app.post('/viewscore',function(req,res){
  username=req.session.username;
  var cid=req.body.courseid;
  var score_coll=mongo.collection("scorecards");

  score_coll.find({cid:cid}).toArray(function(err,scores){

    req.session.username = username;

    res.render('viewscore',{scores:scores});


  });


});


app.post('/submitscore',function(req,res)
{
  username=req.session.username;
    var f11 = parseInt(req.body.s11);
    var f12 = parseInt(req.body.s12);
    var f13 = parseInt(req.body.s13);
    var f14 = parseInt(req.body.s14);
    var f15 = parseInt(req.body.s15);
    var f16 = parseInt(req.body.s16);
    var f17 = parseInt(req.body.s17);
    var f18 = parseInt(req.body.s18);
    var f19 = parseInt(req.body.s19);
    var f21 = parseInt(req.body.s21);
    var f22 = parseInt(req.body.s22);
    var f23 = parseInt(req.body.s23);
    var f24 = parseInt(req.body.s24);
    var f25 = parseInt(req.body.s25);
    var f31 = parseInt(req.body.s31);
    var f32 = parseInt(req.body.s32);
    var f33 = parseInt(req.body.s33);
    var f34 = parseInt(req.body.s34);
    var f35 = parseInt(req.body.s35);
    var f41 = parseInt(req.body.s41);
    var f42 = parseInt(req.body.s42);
    var f43 = parseInt(req.body.s43);
    var f44 = parseInt(req.body.s44);
    var f45 = parseInt(req.body.s45);
    var f46 = parseInt(req.body.s46);
    var f51 = parseInt(req.body.s51);
    var f52 = parseInt(req.body.s52);
    var f53 = parseInt(req.body.s53);
    var f54 = parseInt(req.body.s54);
    var f61 = parseInt(req.body.s61);
    var f62 = parseInt(req.body.s62);
    var f63 = parseInt(req.body.s63);
    var f64 = parseInt(req.body.s64);
    var f65 = parseInt(req.body.s65);
    var f71 = parseInt(req.body.s71);
    var f72 = parseInt(req.body.s72);
    var f73 = parseInt(req.body.s73);
    var f74 = parseInt(req.body.s74);
    var f81 = parseInt(req.body.s81);
    var f82 = parseInt(req.body.s82);
    var f83 = parseInt(req.body.s83);
    var f84 = parseInt(req.body.s84);
    var f85 = parseInt(req.body.s85);
    var c11 = req.body.c11;
    var c12 = req.body.c12;
    var c13 = req.body.c13;
    var c14 = req.body.c14;
    var c15 = req.body.c15;
    var c16 = req.body.c16;
    var c17 = req.body.c17;
    var c18 = req.body.c18;
    var c19 = req.body.c19;
    var c21 = req.body.c21;
    var c22 = req.body.c22;
    var c23 = req.body.c23;
    var c24 = req.body.c24;
    var c25 = req.body.c25;
    var c31 = req.body.c31;
    var c32 = req.body.c32;
    var c33 = req.body.c33;
    var c34 = req.body.c34;
    var c35 = req.body.c35;
    var c41 = req.body.c41;
    var c42 = req.body.c42;
    var c43 = req.body.c43;
    var c44 = req.body.c44;
    var c45 = req.body.c45;
    var c46 = req.body.c46;
    var c51 = req.body.c51;
    var c52 = req.body.c52;
    var c53 = req.body.c53;
    var c54 = req.body.c54;
    var c61 = req.body.c61;
    var c62 = req.body.c62;
    var c63 = req.body.c63;
    var c64 = req.body.c64;
    var c65 = req.body.c65;
    var c71 = req.body.c71;
    var c72 = req.body.c72;
    var c73 = req.body.c73;
    var c74 = req.body.c74;
    var c81 = req.body.c81;
    var c82 = req.body.c82;
    var c83 = req.body.c83;
    var c84 = req.body.c84;
    var c85 = req.body.c85;

    cid=req.session.cid;
    methods.submitscore(f11,f12,f13,f14,f15,f16,f17,f18,f19,f21,f22,f23,f24,f25,f31,f32,f33,f34,f35,f41,f42,f43,f44,f45,f46,f51,f52,f53,f54,f61,f62,f63,f64,f65,f71,f72,f73,f74,f81,f82,f83,f84,f85,c11,c12,c13,c14,c15,c16,c17,c18,c19,c21,c22,c23,c24,c25,c31,c32,c33,c34,c35,c41,c42,c43,c44,c45,c46,c51,c52,c53,c54,c61,c62,c63,c64,c65,c71,c72,c73,c74,c81,c82,c83,c84,c85,cid,username, function(err, user){
      if (err) {
        res.render('scoredoc', {error: err});
      } else {

        // This way subsequent requests will know the user is logged in.
        req.session.username = user.username;
        res.redirect('/submitted');
      }
    });

});

//To get the data from signup form
app.post('/signup', function(req, res){
  // The variables below all come from the form in views/signup.html
   var firstname = req.body.firstname;
    var lastname = req.body.lastname;
  var username = req.body.username;
  var password = req.body.password;
  var password_confirmation = req.body.password_confirmation;
  var email = req.body.email;
   var userrole = req.body.userrole;

  methods.createUser(firstname, lastname,username, password, password_confirmation, email, userrole, function(err, user){
    if (err) {
      res.render('signup', {error: err});
    } else {

      // This way subsequent requests will know the user is logged in.
      req.session.username = user.username;

      res.redirect('/');
    }
  });
});



app.post('/login', function(req, res){
  // These two variables come from the form on
  // the views/login.hbs page
  var username = req.body.username;
  var password = req.body.password;

  methods.authenticateUser(username, password, function(err, user){
    if(user)
    {
      if(user.userrole==='admin')
	     {
		// This way subsequent requests will know the user is logged in.
          req.session.username = user.username;

            res.redirect('/admin');
	         }
	          else if(user.userrole==='student'){
              // This way subsequent requests will know the user is logged in.
              req.session.username = user.username;

              res.redirect('/applicanthome');
    }
    else {
      req.session.username = user.username;

      res.redirect('/reviewer');
    }
  }
   else {
      res.render('login', {badCredentials: true});
    }
  });
});

app.use('/public', express.static('public'));

mongo.connect(mongoUrl, function(){
  console.log('Connected to mongo at: ' + mongoUrl);
  app.listen(port, function(){
    console.log('Server is listening on port: '+port);
  });
})
