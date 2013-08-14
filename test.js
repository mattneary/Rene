var ƒ = require('./plot');

var equal = function(a, b) {
	if( a.toString() == "[object Object]" || a.map ) {
		if( b.toString() == "[object Object]" || b.map ) {
			var eq = true;
			for(var k in b) {
				eq = equal(b[k], a[k]) && eq;
			}
			for(var k in a) {
				eq = equal(b[k], a[k]) && eq;
			}
			return eq;
		} else {
			return false;
		}
	} else {
		return a == b;
	}
};
var assert_equal = function(name, a, b) {
	if( equal(a, b) ) {
		console.log("PASSED: "+name);
	} else {
		console.log("FAILED: "+name);
	}
};

assert_equal("Forming of a constant function.", ƒ("3")(2), [2, 3]);
assert_equal("Forming of a basic arithmetic function.", ƒ("3+x")(2), [2, 5]);