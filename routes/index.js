var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var url = require('url');

tempDirectory = "tmp/"
if (!fs.existsSync(tempDirectory)) {
  fs.mkdirSync(tempDirectory);
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDirectory)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
var upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { query: req.query, currDir: path.join(__dirname, "..") });
});

router.post('/upload', upload.array('imageUpload'), function(req, res, next) {
  let dir = path.join(req.body.rootDir, req.body.dir);
  console.log("Saving files to " + dir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  req.files.map(file => {
    fs.rename(file.path, path.join(req.body.dir, file.filename), (err) => {
      if (err) throw err;
    });
  });
  console.log(req.files.length + " images/videos uploaded successfully!");
  res.redirect(url.format({
    pathname: "/",
    query: {
      "success": true,
      "length": req.files.length
    }
  }));
});

module.exports = router;
