/*
* App crafter to calculate digest hashes of messages and save them then return
* the original messages based on digest hashes
* USAGE:
* RUNNING: node app.js
* TEST: open browser and naviget to
* http://<IP>:8080/messages
* http://<IP>:8080/messages/12...
*/

const express = require('express');
const mongo = require('mongodb');
const parser = require('body-parser');
const crypto = require('crypto');
const app = express();
const router = new express.Router();

const DBPWD = process.env.DBPWD ? process.env.DBPWD : process.argv[2];

const DBHOST = 'ds125263.mlab.com:25263';
const DBACC  = 'guest';

let db;


app.get('/', function(req,res) {
	res.send('<html><head><title>Index</title></head><body>'+
	'<b>Move along people, nothing to see here!</b>'+
	'</body></body></html>');
}).post('/', function(req,res){ res.status(404).end('404'); });

app.use(parser.urlencoded({extended:true}))
	.use('/messages', router);

router.get('', function(req,res) {
	res.send('<html><head><title>Sha</title></head><body>'+
	'<h2>Submit message for sha256 hashing</h2>'+
	'<form action="/messages" method="POST">'+
	'<input placeholder="foo" name="message">'+
	'<button type="submit">Submit</button>'+
	'</form></body></body></html>');
}).post('', function(req,res) {
	let message = req.body.message;
	let hash = crypto.createHash('sha256').update(message).digest('hex');
	res.send(hash);
});

router.get('/:hash([a-fA-F0-9]+)', function(req,res) {
	res.set({'Content-Type': 'application/json'});
	if (req.params.hash=='abc123') {
		res.send(JSON.stringify({message:req.params.hash},null,' '));
	} else {
		var errmsg = 'Message not found';
		res.status(404).send(JSON.stringify({err_msg:errmsg},null,' '));
	}
}).post('/:hash', function(req,res) {
	res.send("No POST just GET");
});

mongo.connect('mongodb://'+DBACC+':'+DBPWD+'@'+DBHOST+'/andy-bit', (e,dbcli)=>{
	if(e) return console.log(e);
	db = dbcli.db('andy-bit');
	var server = app.listen(8080, ()=>{console.log("http://localhost:8080");})
});
