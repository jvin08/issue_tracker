/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var express = require('express');
var app = express();
var MongoClient = require('mongodb');
var { ObjectId } = require('mongodb');
var bodyParser = require('body-parser')
var now = new Date().toISOString()


const CONNECTION_STRING = process.env.DB; 


module.exports = function (app) {
 
  app.route('/api/issues/:project')
    .get(function (req, res){
      var project = req.params.project

    var issue = {
      title: req.query.issue_title,
      text: req.query.issue_text,
      created_by: req.query.created_by,
      assigned_to: req.query.assigned_to,
      status_text: req.query.status_text,
      open: Boolean(req.query.open)
    }
    // console.log("open: " + req.query.open)

    Object.keys(issue).map((x)=>{
      if(!issue[x]) delete issue[x]
    })
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        var db = db.db('issues_db')
        if(err){
          console.log('Database error: ' + err)
        } else {
          db.collection(project).find(issue).toArray((err,data)=>{
            if(err) throw err
            res.send(data)
          })
        }
      })

    })
    
    .post(function (req, res){
      var project = req.params.project;
      var issue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || "",
        status_text: req.body.status_text || "",
        created_on: now,
        updated_on: now,
        open: true
      }
      
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        var db = db.db('issues_db')
        if(err){
          console.log('Database error: ' + err)
        } else {
          console.log('Successfull connection ')
          db.collection(project).insertOne(issue,
            (err,doc)=>{
              if(err){
                console.log('next error occurred: ' + err)
              } else {
                console.log('created issue at - ' + issue.created_on)
                res.json(issue)
            }
          })
       }
      });
  })
  
    .put(function (req, res){
      var project = req.body.project||req.params.project;
      var id = ObjectId(req.body._id);
      var issue = req.body;
      delete issue['_id']
      delete issue['project']
      
      Object.keys(issue).map((x)=>{
        if(!issue[x]) delete issue[x]
      })

      issue.updated_on = now
      MongoClient.connect(CONNECTION_STRING, function(err, db){
        var db = db.db('issues_db');
        if(err){
          console.log('Database error: ' + err)
        } else {
          console.log('Updating database')
          issue.open = Boolean(issue.open);
          console.log('issue_open: ' + issue.open)
          db.collection(project).findOneAndUpdate({_id:id}, {$set:issue}, (err,doc)=>{
            if(err){
              console.log('next error occurred: ' + err)
              } else {
                console.log('updated collection on - ' + issue.updated_on)
                res.json(issue)
              }
          })
        }
      })
      
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      if(req.body._id){
        var id = ObjectId(req.body._id);
        MongoClient.connect(CONNECTION_STRING, function(err,db){
          var db = db.db('issues_db');
          if(err){
            console.log('Database error: ' + err)
          } else {
            console.log('Successful connection to database for deletion: ' + id) 
            db.collection(project).findOneAndDelete({_id: id}, (err)=>{
              if(err){
                console.log('Error occured: ' + err);
                res.send('db error')
              }
              else {
                console.log('issue with _id: ' + res.value  + ' removed from base')
                res.send('deleted ' + id)
              }
            })
          }
        })
      } else {
        res.send('id error')
      }
    });
};

