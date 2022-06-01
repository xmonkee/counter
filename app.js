#!env node
var express = require('express');
var cors = require('cors'); // Use cors module for enable Cross-origin resource sharing
const fs = require('fs')
const filename = "./count.json"

var app = express();
app.use(cors()); // for all routes

var port = process.env.PORT || 8080;

function updatecount(by, callback) {
	fs.readFile(filename, 'utf-8', (err, data) => {
		if(err) {
			console.log(err)
			return
		}
		let {count} = JSON.parse(data)
		count = count + by
		fs.writeFile(filename, JSON.stringify({count}),() => {callback({count})})
	})
}

function getcount() {
	const {count} = JSON.parse(fs.readFileSync(filename, 'utf-8'))
	return count
}

app.post('/reset', function(req, res) {
	fs.writeFileSync(filename, '{"count":0}', 'utf-8')
	const count = getcount()
	res.json({count})
})

app.post('/:count', function(req, res) {
	const {count} = req.params
	updatecount(parseInt(parseInt(count)), ({count}) => res.json({count}) )
})

app.get('/', function(req, res) {
	const count = getcount()
	res.json({count})
})

app.listen(port, function() {
    console.log('Node.js listening on port ' + port)
})
