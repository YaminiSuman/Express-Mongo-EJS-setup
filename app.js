const express = require("express");
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');


// override with POST having ?_method=DELETE or PUT
app.use(methodOverride('_method'))

//Middleware to parse form data
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());

// serve static files
app.use(express.static("public"));
// Set templating engine as ejs
app.set("view engine", "ejs");

//database url

const url = 'mongodb+srv://yamini:yamini-password@cluster0.bqsuu.mongodb.net/Diary?retryWrites=true&w=majority';

// Connection to DB
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(url, connectionParams).then(() => {
    console.log('MongoDB Connected');
}).catch(err => console.log(err));

//Call the database model
const Diary = require('./models/Diary');

// ROUTES
app.get("/", (req, res) => {
  res.render("Home", { value: "Hello World" }); // pass the file name
  //res.send("xyz")
});
app.get("/about", (req, res) => {
  res.render("About");
});
app.get("/diary", (req, res) => {
    Diary.find().then((data) => {
        res.render('Diary', { data: data });
    }).catch(err => console.log(err))
});

app.get('/diary/:id', (req, res) => {
    Diary.findOne({
        _id: req.params.id
    }).then(data => {
        res.render('Page', { data: data });
    })
        .catch(err => console.log(err));
})

app.get("/add", (req, res) => {
  res.render("Add");
});

app.get('/diary/edit/:id', (req, res) => {
    Diary.findOne({
        _id: req.params.id
    }).then((data) => {
        res.render('Edit', { data: data });
    }).catch(err => console.log(err));
})


// Route for saving diary
app.post("/add-to-diary", (req, res) => {
    const Data = new Diary({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date
    })

    //saving data in the database
    Data.save().then(() => {
        console.log("Data Saved");
        res.redirect('/diary');
    })
        .catch(err => console.log(err));

});
// edit entry in database
app.put('/diary/edit/:id', (req, res) => {
    Diary.findOne({
        _id: req.params.id
    }).then(data => {
        data.title = req.body.title,
            data.description = req.body.description,
            data.date = req.body.date

        data.save().then(() => {
            res.redirect('/diary');
        }).catch(err => console.log(err))
    }).catch(err => console.log(err));
});

// delete from database
app.delete('/diary/delete/:id', (req, res) => {
    Diary.remove({
        _id: req.params.id
    }).then(() => {
        res.redirect('/diary');
    }).catch(err => console.log(err));
});
// Listen to server
app.listen(5000, () => console.log("server is running"));
