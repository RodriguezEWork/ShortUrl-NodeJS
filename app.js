require('dotenv').config();
require('./database/db');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const csrf = require('csurf');
const mongoSanitize = require('express-mongo-sanitize');
const { create } = require('express-handlebars');
const User = require('./models/User');
const app = express();
require('dotenv').config();

const MongoStore = require('connect-mongo');
const { clientDB } = require('./database/db');

const hbs = create({
    extname: ".hbs",
    partialsDir: ['views/components'],
});

app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitiliazed: false,
        name: "NodeJsApp2",
        store: MongoStore.create({
            clientPromise: clientDB,
            dbName: 'dbURLNodeJSStayHigh'
        })
    })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(
    (user, done) => done(null, { id: user._id, userName: user.userName })
);

passport.deserializeUser(async (user, done) => {
    const userDB = await User.findById(user.id).exec();
    return done(null, { id: userDB._id, userName: userDB.userName });
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }))
app.use('/', require('./routes/web'));
app.use('/auth', require('./routes/auth'));
app.use(express.static(__dirname + '/public'));

app.use(csrf());
app.use(mongoSanitize());
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Funcionando el servidor')
});