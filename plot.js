var ƒ = _ƒ =  (function() {
	var root = this;	
	    
	// THE EVALUATOR
	var readin = function(str, patterns) {
		if( patterns.length == 0 && (str.length == 0 || str.match(/^\s+$/)) ) {
			return [];
		} else if( patterns.length ) {
			if( str.match(new RegExp("^\\s*?"+patterns[0])) ) {
				var m = str.match(new RegExp("^\s*?"+patterns[0]))[0];
				return [m].concat(readin(str.replace(m, ''), patterns.slice(1)));
			} else {
				return [];
			}
		} else {
			return [];
		}
	};
	var read = function(str, patterns) {
		if( patterns.length == 0 ) {
			return str.length == 0 ? true : 2;
		} else if( patterns.length ) {
			if( str.match(new RegExp("^\\s*?"+patterns[0])) ) {
				var m = str.match(new RegExp("^\s*?"+patterns[0]))[0];
				return read(str.replace(m, ''), patterns.slice(1));
			} else {
				return false;
			}
		} else {
			return false;
		}
	};
	var or = function(a, b) {
		return '(('+a+')|('+b+'))';
	};
	var all = function() {
		return [].reduce.call(arguments, function(a, b) {
			return '('+a+')('+b+')';
		});
	};
	var eval = function(str, env) {
		var number = "[0-9\\.]+",
			variable = "[^\s0-9]",
			atom = or(number, variable),
			operator = "[\\*\\+-\\/\\^]",
			application = [atom, operator, atom],
			rest = ".*",
			oo = "^ * / + -".split(' ');
			
		if( read(str, [number]) === true ) {
			return parseFloat(str);
		} else if( read(str, [variable]) === true ) {
			return env[str];
		} else if( read(str, application) === true ) {
			var parse = readin(str, application),
				parts = parse.map(function(x){return eval(x, env);});
			return parts[1](parts[0], parts[2]);
		} else if( read(str, application.concat(operator)) ) {
			var parse = readin(str, application.concat(operator).concat(rest)),
				parts = parse.map(function(x){return eval(x, env);});
			if( oo.indexOf(parse[3]) > oo.indexOf(parse[1]) ) {
				return parts[3](parts[1](parts[0], parts[2]), parts[4]);
			} else {
				return parts[1](parts[0], parts[3](parts[2], parts[4]));
			}
		} else {
			return null;
		}
	};
	var extend = function(a, b) {
		var n = {};
		for(var k in a) {
			n[k] = a[k];
		}
		for(var k in b) {
			n[k] = b[k];
		}
		return n;
	};
	var ƒ = function(fns, polar) {		
		var env = {
			"+": function(a,b){return a+b},
			"*": function(a,b){return a*b},
			"^": function(a,b){return Math.pow(a, b);}
		};
		if( typeof fns == 'string' ) {
			fns = [fns];
		}		
		if(polar) {
			var eqs = fns.map(evalPolar);
			// ...
		} else {			
			if( fns.length == 1 ) {				
				f = function(x){
					return [x, eval(fns[0], extend(env, {x:x}))];
				};
			} else {				
				f = function(x) {
					var eqs = fns.map(function(ex){return eval(ex, extend(env, {x:x}));});
					return eqs;
				};
			}
		}
		
		ƒ.p = ƒ.prototype = _ƒ;
		for( var key in ƒ.p ) {
			f[key] = ƒ.p[key];
		}
		return f;
	};
	ƒ.p = ƒ.prototype = {
		constructor: ƒ,
		initPlane: function(el) {
			var thiz = this;
			ƒ("0").graph(el, 0, 1, '#666');
			ƒ(["0","x"]).graph(el, 0, 1, '#666');		
			return thiz;
		},
		y: function(x) {
			return this(x)[1];
		},
		graph: function( el, win, ax, color ) {
			var thiz = this, _f = f, f = thiz;		

			var prec = 1000,
			    elem = el,
			    win = [
					-8,	//xMin
					8,	//xMax
					-8,	//yMin
					8	//yMax
			    ];

			win[3] = [-win[2], (win[2] = -win[3])][0];	//Swap Max/Min to make more intuitive

			axies = {
				y: (elem.width*(0-win[0])/(win[1]-win[0])),
				x: (elem.height*(0-win[2])/(win[3]-win[2]))
			};
			var context = elem.getContext('2d');
				
			!ax && ƒ.initPlane(elem);									
			context.beginPath();				
			//Plot style
			context.strokeStyle = color;
			context.lineWidth   = 3;

			var sum = 0;
			for( var i = axies.y/elem.width * -1 * prec; i < (elem.width-axies.y)/elem.width * prec; i++ ) {
				var fraction = function(n) { return (n - axies.y/elem.width * -1 * prec)/prec; },
					xMin	 = win[0],
					yMin	 = win[2],
					xRange 	 = win[1] - win[0],
					yRange	 = win[3] - win[2];
				
			    context.moveTo(axies.y+f(xMin+fraction(i)*xRange)[0]/xRange*elem.width, axies.x-f(xMin+fraction(i)*xRange)[1]/yRange*elem.height); 
			    //x,y coordinate
			    context.lineTo(axies.y+f(xMin+fraction(i+1)*xRange)[0]/xRange*elem.width, axies.x-f(xMin+fraction(i+1)*xRange)[1]/yRange*elem.height);	
			}		   		
			context.stroke();
			context.closePath();
			
			return thiz;
		}
	};
	// Apply prototype to constructor
	for( var key in ƒ.p ) {
		ƒ[key] = ƒ.p[key];
	}
	return ƒ;
}());

if( module ) {
	module.exports = ƒ;
}