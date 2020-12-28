var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var path = require('path');

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
  res.render('index', { title: 'Image Upload Server' });
});

router.post('/upload', upload.array('imageUpload'), function(req, res, next) {
  let dir = req.body.dir;
  console.log("Saving files to " + dir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  req.files.map(file => {
    fs.rename(file.path, path.join(req.body.dir, file.filename), (err) => {
      if (err) throw err;
    });
  })
  res.redirect('/');
});

module.exports = router;
