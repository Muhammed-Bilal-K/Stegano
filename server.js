if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
require('./passport-config');
const flash = require("express-flash");
const session = require('express-session');
const { name } = require("ejs");
const methodOverride = require('method-override');
const LocalStrategy = require("passport-local").Strategy;

//-------------------------------------------

const userss = require("./model/user");
const mongoose = require('mongoose');

// //'''''''''''''''''''
mongoose.connect('mongodb://localhost:27017/UserData').then(() => {
    console.log("Database connected");
})





// const users = []

app.use(express.urlencoded({ extended: false }))
//app.use(bodyPaeser.json())
//app.use(bodyParser.urlencoded({
//extended:true
//}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, //we want to resave session variable if nothing changed
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))



app.use("/public", express.static(__dirname + "/public"));

app.post('/login', checkNotAuthenticated, function (req, res) {
    const {
        email,
        password
    } = req.body;

    userss.findOne({ email: email }).then(result => {
        if (email === result.email) {
            res.render('index.ejs')
        } else {
            console.log(err);
        }
    })
});

// configuration the register
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        let users = new userss({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })
        users.save()
        console.log(users);
        res.redirect("/login")
    } catch (e) {
        console.log(e);
        res.redirect("/register")
    }
})

//Routers
app.get('/', checkAuthenticated, (req, res) => {
    res.status(200).render('index.ejs');
})

// app.get('/encode', checkNotAuthenticated, (req, res) => {
//     res.status(200).render('encode.ejs')
// })

// app.get('/decode', checkNotAuthenticated, (req, res) => {
//     res.status(200).render('decode.ejs')
// })

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.status(200).render('login.ejs');
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.status(200).render('register.ejs');
})

app.delete('/logout', (req, res, next) => {
    req.logout(req.user, err => {
        if (err) return next(err)
        res.redirect('/')
    })
})


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')

}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()

}

app.listen(4001, () => {
    console.log("Listening...");
})