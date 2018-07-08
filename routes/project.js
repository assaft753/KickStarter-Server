var express = require('express');
var db = require('../model/db');
var project_queries = require('../queries/project');
var router = express.Router();


router.post('/add', (req, res, next) => {
    const project_info = req.body;
    const now = new Date();
    db.query(project_queries.add_project,[project_info['user_id'],project_info['project_name'],project_info['idea'],project_info['description'],project_info['desire_amount'],project_info['days'],project_info['hours'],now.getTime()],(err,result) => {
        if(err)
        {
            res.status(400).send(err);
        }
        else
        {
            res.send(result.insertId+"");
        }
    });
});

router.post('/update', (req, res, next) => {
    const project_info = req.body;
    db.query(project_queries.update_project,[project_info['idea'],project_info['description'],project_info['desire_amount'],project_info['days'],project_info['hours'],project_info['id']],(err,result) => {
        if(err)
        {
            res.status(400).send(err);
        }
        else
        {
            res.status(200).send("updated");
        }
    });
});

router.post('/donate/delete', (req, res, next) => {
    const donation_info = req.body;
    db.query(project_queries.delete_donator_of_project,[donation_info['user_id'],donation_info['project_id']],(err,result) => {
        if(err)
        {
            res.status(400).send(err);
        }
        else
        {
            res.status(200).send();
        }
    });
});

router.post('/donate', (req, res, next) => {
    const donation_info = req.body;
    db.query(project_queries.donate_to_project,[donation_info['user_id'],donation_info['project_id'],donation_info['amount']],(err,result) => {
        if(err)
        {
            res.status(400).send(err);
        }
        else
        {
            res.status(200).send();
        }
    });
});

router.post('/delete', (req, res, next) => {
   const project_id = req.body['project_id'];
   db.query(project_queries.delete_project,[project_id],(err,result) => {
    if(err)
    {
        res.status(400).send(err);
    }
    else
    {
        res.status(200).send();
    }
   });
});

router.post('/permission', (req, res, next) => {
    const project_id = req.body['project_id'];
    const user_id = req.body['user_id'];
    db.query(project_queries.check_owner_of_project,[project_id,user_id],(err,result) => {
        if(err)
        {
            res.status(400).send(err);
        }
        else
        {
            const is_owner = result[0]['owner'];
            if(is_owner>0)
            {
                res.send({is_owner:true,donatble:false});
            }
            else
            {
                db.query(project_queries.check_donator_of_project,[user_id,project_id],(err,result) => {
                    if(err)
                    {
                        res.status(400).send(err);
                    }
                    else
                    {
                        const donatble = result[0]['donated']>0;
                        res.send({is_owner:false,donatble:!donatble});
                    }
                });
            }
        }
    });
});


module.exports = router;
