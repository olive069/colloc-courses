let express = require("express")
let mongodb = require('mongodb');
let sanitizeHTML = require('sanitize-html')
let app = express();
let db
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000
}
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

let connectionString = "mongodb+srv://todoAppUser:todoAppUserPW@cluster0-los3w.mongodb.net/TodoApp?retryWrites=true&w=majority"
mongodb.connect(connectionString, { useNewUrlParser: true }, function (err, client) {
    db = client.db()
    app.listen(port)
})

function passwordProtected(req, res, next) {
    res.set("WWW-Authenticate", 'Basic realm="Liste de Courses"')
    console.log(req.headers.authorization);
    if (req.headers.authorization == "Basic b2xpdmU6b2xpdmU=" || req.headers.authorization == "Basic Y29sbG9jOmNvbGxvYw==") {
        next()
    }
    else {
        res.status(401).send("Pas de la colloque??")
    }
}

//use passwordProtected function for each url req
app.use(passwordProtected)

app.get("/", function (req, res) {
    db.collection("items").find().toArray(function (err, items) {
        res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Liste de Courses</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
      </head>
      <body>
      <div class="container">
      <h4 class="display-5 text-center py-1">Colloc - Liste de Courses</h4>
      
      <div class="jumbotron p-3 shadow-sm">
      <form id="create-form" action="/create-item" method="POST">
      <div class="d-flex align-items-center">
      <input id="create-field" name="item"autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
      <button class="btn btn-primary">Ajouter</button>
      </div>
      </form>
      </div>
      
      <ul id="item-list" class="list-group pb-4">
      
        </ul>
        </div>

        <script>
            let items = ${JSON.stringify(items)} 
        </script>
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script src="/browser.js"></script>
        </body>
        </html>`)
    })
})

app.post("/create-item", function (req, res) {
    let safeText = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: {} })
    db.collection("items").insertOne({ text: safeText }, function (err, info) {
        res.json(info.ops[0])
    })
})

app.post("/update-item", function (req, res) {
    let safeText = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: {} })

    db.collection("items").findOneAndUpdate({ _id: new mongodb.ObjectId(req.body.id) }, { $set: safeText }, function () {
        res.send("Success")
    })
})

app.post("/delete-item", function (req, res) {
    db.collection("items").deleteOne({ _id: new mongodb.ObjectId(req.body.id) }, function () {
        res.send("Success")
    })
})