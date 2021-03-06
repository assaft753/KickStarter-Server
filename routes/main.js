var express = require('express');
var db = require('../model/db');
var promise_db = require('../model/promise-db');
var project_queries = require('../queries/project');
var media_queries = require('../queries/media');
var md5 = require('md5');
var moment = require('moment');

var router = express.Router();

router.post('/login', (req, res, next) => {
    const user_name = req.body['user_name'];
    const pass = req.body['password'];
    const encrypt_pass = md5(pass);
    const user_info = promise_db.query(project_queries.login, [encrypt_pass, user_name]);
    if (user_info.length > 0) {
        res.send(user_info[0]);
    }
    else {
        res.status(404).send('user not found');
    }
});

router.post('/register', (req, res, next) => {
    const user_name = req.body['user_name'];
    const pass = req.body['password'];
    const encrypt_pass = md5(pass);
    const user_exists = promise_db.query(project_queries.check_user_exits, [user_name]);
    if (user_exists.length == 0) {
        const user_info = promise_db.query(project_queries.register, [user_name, encrypt_pass]);
        if (user_info != null) {
            res.send({ id: user_info.insertId, user_name: user_name, password: pass });
        }
        else {
            res.status(404).send('user not registered');
        }
    }
    else {
        res.status(404).send('user already exits');
    }
});

router.get('/all', function (req, res, next) {
    db.query(project_queries.all_projects, (err, result, fields) => {
        if (err) {
            res.send(400, err);
        }
        else {
            try {
                console.log(result);
                var project_arr = result;
                var projects = [];
                for (var i = 0; i < project_arr.length; i++) {
                    var project = project_arr[i];
                    const donations = promise_db.query(project_queries.donation_of_project, [project.id]);
                    var donation = 0;
                    if (donations.length > 0) {
                        donation = donations[0]['donation'];
                    }
                    project.donation = donation;
                    var oneDay = 24 * 60 * 60 * 1000;
                    var current_date = new Date();
                    var project_date = new Date(project.created_date);
                    var diffDays = Math.round(Math.abs((current_date.getTime() - project_date.getTime()) / (oneDay)));
                    project.days_to_go = project.days - diffDays;

                    const primary_image = promise_db.query(media_queries.primary_image_of_project, [project.id])[0]['image_name'];
                    project.primary_image = primary_image;

                    const secondary_images = promise_db.query(media_queries.secondary_images_of_project, [project.id]);
                    if (secondary_images.length > 0) {
                        project.secondary_images = secondary_images;
                    }
                    else {
                        project.secondary_images = [];
                    }

                    const video = promise_db.query(media_queries.video_of_project, [project.id]);
                    if (video.length > 0) {
                        project.video = video[0]['video_name'];
                    }
                    else {
                        project.video = '';
                    }

                    const donators = promise_db.query(project_queries.donators_of_project, [project.id]);
                    if (donators.length > 0) {
                        project.donators = donators;
                    }
                    else {
                        project.donators = [];
                    }

                    projects.push(project);
                }//for
                res.send({
                    projects: projects
                });
            }//try
            catch (error) {
                res.status(400).send(error);
            }
        }
    });
});

router.get('/', (req, res, next) => {
    db.query(project_queries.all_projects, (err, result, fields) => {
        if (err) {
            res.send(400, err);
        }
        else {
            try {
                console.log(result);
                var live = 0;
                var go = 0;
                var project_arr = result;
                var projects = [];
                for (var i = 0; i < project_arr.length; i++) {
                    var project = project_arr[i];
                    const donations = promise_db.query(project_queries.donation_of_project, [project.id]);
                    var donation = 0;
                    if (donations.length > 0) {
                        donation = donations[0]['donation'];
                    }

                    var created_date = new Date();
                    created_date.setTime(project.created_date);

                    if (moment(created_date).add(project.days, 'days').add(project.hours, 'hours').isAfter(moment())) {
                        live++;
                        project.donation = donation;
                        var oneDay = 24 * 60 * 60 * 1000;
                        var current_date = new Date();
                        var project_date = new Date(project.created_date);
                        var diffDays = Math.round(Math.abs((current_date.getTime() - project_date.getTime()) / (oneDay)));
                        project.days_to_go = project.days - diffDays;

                        const primary_image = promise_db.query(media_queries.primary_image_of_project, [project.id])[0]['image_name'];
                        project.primary_image = primary_image;

                        const secondary_images = promise_db.query(media_queries.secondary_images_of_project, [project.id]);
                        if (secondary_images.length > 0) {
                            project.secondary_images = secondary_images;
                        }
                        else {
                            project.secondary_images = [];
                        }

                        const video = promise_db.query(media_queries.video_of_project, [project.id]);
                        if (video.length > 0) {
                            project.video = video[0]['video_name'];
                        }
                        else {
                            project.video = '';
                        }

                        const donators = promise_db.query(project_queries.donators_of_project, [project.id]);
                        if (donators.length > 0) {
                            project.donators = donators;
                        }
                        else {
                            project.donators = [];
                        }

                        projects.push(project);
                    }

                    else {
                        if (donation >= project.desire_amount) {
                            go++;
                        }
                    }
                }//for
                res.send({
                    live: live,
                    go: go,
                    projects: projects
                });
            }//try
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        }
    });

});

module.exports = router;