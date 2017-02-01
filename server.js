const express = require("express");
const ejs = require("ejs")
const bodyParser = require("body-parser");
// const multer = require("multer");
const mongoose = require("mongoose");
const app = express();

const User = require("./database/models/user");


const port = process.env.port || 3000;

/**********Express session*********/
const expressSession = require("express-session");
/**********************************/
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

mongoose.connect("mongodb://localhost/passport-ajax");
//Make sure capital P for promise.
mongoose.Promise = global.Promise;



app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
// app.use(multer({dest : "./uploads"}));

app.use(expressSession({
    secret : "longString",
    resave:false,
     saveUninitialized: false
}))



/********************Configure passport*************************/


passport.use("login",  new localStrategy({
    usernameField : "emailOrUsername",
    passwordField : "password",
    passReqToCallback : true
},
    function(req, username, password, done){
        console.log("HIT HERE");
        User.findOne({emailOrUsername: req.body.emailOrUsername})
            .then((user)=>{
                console.log("FINDING!!");
                if(!user){
                    console.log("My error: NO SUCH USER");
                    return done(null, false, "No such user");
                }
                if(password !== user.password){
                    console.log(`Password Doesnt Match`);
                    done(null, false , "Passwords dont match");
                }
                console.log("USER MATCHED!!");
                done(null, user)

            })
            .catch((err) => console.log(err));
    }
))

passport.use("signUp", new localStrategy({
    usernameField : "emailOrUsername",
    passwordField : "password",
    passReqToCallback : true
},
    function(req, username, password, done){
        // Removing from the DB first so there won't be multiple records while testing.
        User.remove({})
        .then(() =>{
            User.findOne({emailOrUsername : username})
                .then((user) => {
                    console.log("FINDING INSIDE SIGNUP");
                    if(user){
                        return done(null, false, "User "+ username + "allready exists. " );
                    }
                    var user = {
                        emailOrUsername : username,
                        password : password
                    };
                    new User(user).save()
                        //possible do done(err)
                        .then((newUser) =>{
                            if(!newUser) return done("Failed On Create User");
                            done(null, newUser)
                        })
                })
        })
        .catch((err) => {
            console.log(err);
        })
    }
))

function verifyAuth(req, res, next){
    if(!req.isAuthenticated()){
        return res.status(401).json({
            err : "Please login correctly. You received a 401 error.",
            sesstionId : req.session.id
        })
    }
    next();
}
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err,user);
    })
})

/**************************************************************/


app.set("view engine", "ejs");

//file will be served like http://localhost:4000/style.css
app.use(express.static(__dirname + "/public"));

app.get("/create", (req, res) => {
    res.render("create")
});

app.post("/login", (req, res) => {
    console.log(req.body);
})

app.listen(port, function(){
    console.log(`Listening on port ${port}`);
})
