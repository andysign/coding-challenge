express = require('express');
app = express();
router = new express.Router();

//app.get('/', function(req, resp) { resp.end('TEST'); });

app.get('/', function(req,res) {
	res.send('<html><head><title>Index</title></head><body>'+
	'<b>Move along people, nothing to see here!</b>'+
	'</body></body></html>');
}).post('/', function(req,res){ res.status(404).end('404'); });

app.use('/messages', router);

router.get('', function(req,res) {
	res.send("Must POST!");
}).post('', function(req,res) {
	res.send("Cool, you are posting...");
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

 
var server = app.listen(8080, ()=>{console.log("http://localhost:8080"); })
