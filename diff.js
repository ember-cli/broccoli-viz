var fs = require('fs');
var deepDiff = require('deep-diff');
var chalk = require('chalk');

var a = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
var b = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));

var diff = deepDiff(a, b);
var lastNode;

function delta(lhs, rhs) {
	if (lhs > rhs) {
		return chalk.green('[' + lhs + ' -> ' + rhs + ']');
	} else {
		return chalk.red('[' + lhs + ' -> ' + rhs + ']');
	}
}

var stack = [];
diff.forEach(function(change) {
	var space = ' ';

	for (var i = 0; i < change.path.length - 1; i++) {
		space += ' ';
		console.log(space, change.path[i]);
	}

	console.log(space, ' ', change.path[change.path.length - 1],  delta(change.lhs, change.rhs));
});
