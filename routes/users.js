
var express = require('express');
var mysql = require('mysql');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var router = express.Router();
var count=0;
var query = "SELECT id,name FROM Users";

/*var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Frog789753",
  database: "KickStarter"
});*/

var pool = mysql.createPool({
  connectionLimit : 10,
  host: "127.0.0.1",
  user: "root",
  password: "Frog789753",
  database: "KickStarter"
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    cb(null, 'uploads/images')
  },
  filename: (req, file, cb) => {
    var arr=file.originalname.split('.');
    var format=arr[arr.length-1];
    cb(null, file.fieldname + '-' + Date.now()+'.'+format);
  }
});
var upload = multer({storage: storage});
/*con.connect(function(err) {
  if (err) throw err;
});*/

/* GET users listing. */
router.post('/',upload.array("image"), function(req, res, next) {
  var obj = {name:"assaf"};
  obj["test"]="sty";
  //res.send(path.join(path.dirname(__dirname),'uploads/images',req.files[0].filename));
  index.query(query,(err,result,fields)=>{
    if(err){
      res.send(err+"error");
      //res.send(400,'bad');
    }
    else
    {
     res.send(result);
    }
  });
  console.log(index.SimpleMessage);
});

router.get('/',function(req,res,next){
console.log("enter");
var imageName = req.query['image'];
/*fs.readFile('/Users/assaftayouri/Desktop/KickStarter/server/uploads/images/image-1530883448944.png', function (err, content) {
  if (err) {
      res.writeHead(400, {'Content-type':'text/html'})
      console.log(err);
      res.end("No such image");    
  } else {
      //specify the content type in the response will be an image
      res.writeHead(200,{'Content-type':'image/jpg'});
      res.end(content);
  }
});*/
console.log(new Date().getTime());
res.status(200).sendFile(path.join(path.dirname(__dirname),'uploads/images','Untitled.mov'));
});

module.exports = router;
