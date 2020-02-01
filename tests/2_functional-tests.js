/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var { ObjectId } = require('mongodb');
var now = new Date().toISOString()


chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
//       test('Every field filled in', function(done) {
//        chai.request(server)
//         .post('/api/issues/test')
//         .send({
//           issue_title: 'Title',
//           issue_text: 'text',
//           created_by: 'Functional Test - Every field filled in',
//           assigned_to: 'Chai and Mocha',
//           status_text: 'In QA'
//         })
//         .end(function(err, res){
//           assert.equal(res.status, 200);
//           console.log('res.status is: ' + res.status)
//           assert.equal(res.body.issue_title, 'Title');
//           assert.equal(res.body.issue_text, 'text');
//           assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
//           assert.equal(res.body.assigned_to, 'Chai and Mocha');
//           assert.equal(res.body.status_text, 'In QA');
//           done();
//         });
//       });
      
//       test('Required fields filled in', function(done) {
//         chai.request(server)
//           .post('/api/issues/test') 
//           .send({issue_title: null,
//                  issue_text: null,
//                  created_by: null})
//           .end(function(err, res){
//             assert.isNull(res.body.issue_title)
//             assert.isNull(res.body.issue_text)
//             assert.isNull(res.body.created_by)
//             done();
//         })
//       });
      
//       test('Missing required fields', function(done) {
//         chai.request(server)
//           .post('/api/issues/test')
//           .send({issue_title: 'Title',
//                  issue_text: undefined,
//                  created_by: 'Creator'})
//           .end(function(err, res){
//             assert.isNotNull(res.body.issue_title);
//             assert.isUndefined(res.body.issue_text);
//             assert.isNotNull(res.body.created_by)
//             done();
//     })
//       });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({ issue_title: 'issue001'})
          .end(function(err, res){
            assert.isObject(res.body); 
            done(); 
        })
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({issue_title: 'issue002'})
          .end(function(err,res){
            assert.equal(res.body.issue_title, 'issue002')
            done();
        })
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({issue_title: 'issue003',
                 issue_text: 'issueText',
                 created_by: 'Creator',
                 assigned_to: 'Revisor',
                 status_text: 'Status_text'
      })
          .end(function(err,res){
            assert.equal(res.body.issue_title, 'issue003');
            assert.equal(res.body.issue_text, 'issueText');
            assert.equal(res.body.created_by, 'Creator');
            assert.equal(res.body.assigned_to, 'Revisor');
            assert.equal(res.body.status_text, 'Status_text');
            done();
        })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({open:true})
          .end(function(err,res){
            assert.propertyVal(res.body[0], 'open', true);
            done();
        })
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({status_text: 'In QA', open:true})
          .end(function(err,res){
            assert.propertyVal(res.body[0], 'status_text', 'In QA');
            assert.propertyVal(res.body[0], 'open', true);
             
            done();
        })
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({})  
          .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.value, null); 
            done(); 
        })
      });
      
      test('Valid _id', function(done) {
        var id = ObjectId('5e34e2ade730543abca9f7b8');
        chai.request(server)
          .delete('/api/issues/test')
          .send({_id: id})  
          .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'deleted ' + id);   
            done(); 
        })
      });
      
    });

});
