var express = require('express');
var path = require('path');
var multer = require('multer');
var media_queries = require('../queries/media');
var db = require('../model/db');
var promise_db = require('../model/promise-db');

var router = express.Router();
var counter = 0;

const filename = (req, file, cb) => {
    var arr = file.originalname.split('.');
    var format = arr[arr.length - 1];
    counter++;
    cb(null, file.fieldname + '-' + Date.now() + counter + "" + '.' + format.toLowerCase());
};

var image_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images');
    },
    filename: filename
});

var video_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/videos');
    },
    filename: filename
});

var image_upload = multer({ storage: image_storage });

var video_upload = multer({ storage: video_storage });


router.get('/image', (req, res, next) => {
    const image_name = req.query['image'];
    res.status(200).sendFile(path.join(path.dirname(__dirname), 'uploads/images', image_name));
});

router.get('/video', (req, res, next) => {
    const video_name = req.query['video'];
    res.status(200).sendFile(path.join(path.dirname(__dirname), 'uploads/videos', video_name));
});

router.post('/upload/primary', image_upload.single("image"), (req, res, next) => {
    const project_id = req.body['project_id'];
    const file_name = req.file.filename;
    db.query(media_queries.add_image_of_project, [project_id, file_name, 1], (err, result, field) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.status(200).send(result);
        }
    });
});

router.post('/upload/secondary', image_upload.array("image"), (req, res, next) => {
    const project_id = req.body['project_id'];
    const files = req.files;
    try {
        var count = 1;
        files.forEach(file => {
            promise_db.query(media_queries.add_image_of_project, [project_id, file.filename, 0]);
            count++;
        });
        res.send('secondary images added completed');
    }
    catch (error) {
        res.status(400).send(error);
    }
});

router.post('/upload/video', video_upload.single("video"), (req, res, next) => {
    const project_id = req.body['project_id'];
    const file_name = req.file.filename;
    db.query(media_queries.add_video_of_project, [project_id, file_name], (err, result, field) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.status(200).send(result);
        }
    });
});

router.post('/update/primary', image_upload.single("image"), (req, res, next) => {
    const project_id = req.body['project_id'];
    const file_name = req.file.filename;
    db.query(media_queries.update_primary_image_of_project, [file_name, project_id], (err, result, field) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.send({ image_name: file_name, result: result });
        }
    });
});

router.post('/update/video', video_upload.single("video"), (req, res, next) => {
    const project_id = req.body['project_id'];
    const file_name = req.file.filename;
    try {
        promise_db.query(media_queries.delete_video_of_project, [project_id]);
        const result = promise_db.query(media_queries.add_video_of_project, [project_id, file_name]);
        res.send(result);
    }
    catch (error) {
        res.status(400).send(error);
    }

});

router.post('/update/secondary', image_upload.array("image"), (req, res, next) => {
    const project_id = req.body['project_id'];
    const files = req.files;
    try {
        promise_db.query(media_queries.delete_all_secondary_image_of_project, [project_id]);
        console.log("enter")
        var count = 1;
        files.forEach(file => {
            promise_db.query(media_queries.add_image_of_project, [project_id, file.filename, 0]);
            count++;
        });
        res.send();
    }
    catch (error) {
        res.status(400).send(error);
    }
});

router.post('/delete/secondary', (req, res, next) => {
    const project_id = image_info['project_id'];
    try {
        promise_db.query(media_queries.delete_all_secondary_image_of_project, [project_id]);
        es.send();
    }
    catch (error) {
        res.status(400).send(error);
    }
});

router.post('/delete/video', (req, res, next) => {
    const video_info = req.body;
    db.query(media_queries.delete_video_of_project, [video_info['project_id']], (err, result) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.send(result);
        }
    });
});

module.exports = router;