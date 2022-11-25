var express = require('express');
var mysql = require('mysql2');
var path = require('path');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var {body, validationResult} = require('express-validator');
require('dotenv').config()

var app = express()

app.set('view engine', 'ejs')
app.use('/public', express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())

app.use(session({
    secret: "webFinalProject",
    cookie: {maxAge: 30000},
    resave: false,
    saveUninitialized: false
}))

var conn = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: process.env.PASSWORD,
    database: 'web_project',
    socketPath:"/var/run/mysqld/mysqld.sock"
})

conn.connect((err) => {
    if (err) throw err;
    console.log('Connected to the db successfully')
})

let registerErrors = []
let loginErrors = ''
let jobs = []

// app.get('/', (req, res) => {
//     if (req.session.isAuth) {
//         let current_user = req.cookies.current_user
//         let sql = `select * from products`
//         conn.query(sql, (err, result) => {
//             res.render('index', {username: current_user.username, products: result})
//         })

//     }
//     else{
//         res.redirect('login')
//     }
// })

// app.post('/', (req, res) => {
//     if (req.session.isAuth) {
//         let current_user = req.cookies.current_user
//         let product_code = req.body.product_code
//         let product_count = Number(req.body.product_count)
//         let productSql = ``
//         if (product_count == 0) {
//             productSql = `select * from products where productCode = ?`
//         }
//         else {
//             productSql = `select * from products where productCode = ? limit ?`
//         }
//         conn.query(productSql, [product_code, product_count], function(err, result) {
//             res.render('index', {username: current_user.username, products: result})
//         })
//     }
//     else{
//         res.redirect('login')
//     }
// })

app.get('/register', (req, res) => {
    res.render('register', {message: registerErrors})
})

app.post('/register',
body('name').trim().escape().isAlpha().withMessage('Username should be letters only'),
body('surname').trim().escape().isAlpha().withMessage('Surname should be letters only'),
body('email').trim().escape().isEmail().withMessage('Invalid email'),
body('number').trim().escape(),//.matches('/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{9}$/im').withMessage('Number is incorrect'),
body('password').trim().escape().isLength({min: 8}).withMessage('Password should be min 8 chars').matches('[0-9]').withMessage('Password must contain a number').matches('[A-Z]').withMessage('Password must contain an uppercase letter'),
body('confirmPassword').trim().escape().custom((value, {req}) => {
    if(value === req.body.password) return true
    else return false
}).withMessage('Passwords do not match'),
(req, res) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('register', {message: errors.array()})
    }
    else {
        query1 = `SELECT count(*) as total from users where email = ?`
        conn.query(query1, [req.body.email], (err, result) => {
            if (result[0].total > 0){
                message = [{'msg': 'Email already exists'}]
                res.render('register', {message: message})
            }
            else {
                bcrypt.hash(req.body.password, 12).then(function(hashpass){
                    query2 = `INSERT INTO users(name,surname,email,number,password) VALUES (?, ?, ?, ?, ?)`
                    conn.query(query2, [req.body.name,req.body.surname,req.body.email, req.body.number, hashpass])
                    res.redirect('login', 304, {message: loginErrors})
                })
            }
        })
    }
})

app.get('/login', (req, res) => {
    res.render('login', {message: loginErrors})
})

app.post('/login', (req, res) => {
    let {email, password} = req.body;
    query3 = `SELECT password from users where email = ?`
    query4 = `SELECT count(*) as total from users where email = ?`
    conn.query(query4, [email], (err, result) => {
        if (result[0].total > 0){
            conn.query(query3, [email], (err, result) => {
                let passwordDb = result[0].password;
                bcrypt.compare(password, passwordDb).then(function(result){
                    if (result){
                        req.session.isAuth = true
                        res.cookie('current_user', {username: email}, {maxAge: 30000})
                        res.redirect("index");
                    }
                    else {
                        res.render('login', {message: 'Credentials are incorrect'})
                    }
                })
            })
        }
        else res.render('login', {message: 'Credentials are incorrect'})
    })
})

app.post('/logout', (req, res) => {
    req.session.isAuth = false
    res.clearCookie('connect.sid')
    res.clearCookie('current_user')
    req.session.destroy(function (err) {
      res.redirect('login');
    });
});
app.get("/index",(req,res)=>{
    if(req.session.isAuth){
        res.render("index");
    }else{
        res.redirect('login', 304, {message: "Error"})
    }
});


app.get('/update/:id', (req, res) => {
    if (req.session.isAuth){
        let id = req.params.id
        res.render('update', {id: id})
    }
    else {
        res.redirect('/login')
    }

})

app.post('/update/:id', (req, res) => {
    if (req.session.isAuth){
        let {name, price} = req.body
        let id = req.params.id
        let updateProductSql = `UPDATE products set name = ?, price = ? where productID = ?`
        conn.query(updateProductSql, [name, price, id], (err, result) => {
            res.redirect('/')
        })
    }
    else {
        res.redirect('/login')
    }
})
app.get('/delete/:id', (req, res) => {
    if (req.session.isAuth){
        let id = req.params.id
        let deleteProductSql = `DELETE from products where productID = ?`
        conn.query(deleteProductSql, [id], (err, result) => {
            res.redirect('/')
        })
    }
    else {
        res.redirect('/login')
    }
})


app.listen(3000,(err)=>{
    if(err) throw err;
    console.log("Server started at http:/localhost:3000/");
});