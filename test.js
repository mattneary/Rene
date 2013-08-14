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
var section = function(name, under) {
	under = under || '='
	console.log("\n"+name);
	console.log([].map.call(name, function(){return under;}).join(''));
};

section("Arithmetic");
assert_equal("Forming of a constant function.", ƒ("3")(2), [2, 3]);
assert_equal("Forming of a basic arithmetic function.", ƒ("3+x")(2), [2, 5]);
assert_equal("Forming of a composite arithmetic function.", ƒ("3+x*2")(2), [2, 7]);
assert_equal("Forming of a first-order composition.", ƒ("3*x+2")(2), [2, 8]);
assert_equal("Forming of a second-order composition.", ƒ("3*x+2*x")(2), [2, 10]);
assert_equal("Forming of an exponential composition.", ƒ("2*3^x")(2), [2, 18]);

section("Parenthetheses");
assert_equal("Parenthetical constant.", ƒ("(3)")(2), [2, 3]);
assert_equal("First-order parenthetical expression.", ƒ("(3*4)")(2), [2, 12]);
assert_equal("Second-order parenthetical expression.", ƒ("(3+(2*6))")(2), [2, 15]);