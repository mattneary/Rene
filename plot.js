var ƒ = (function(el,globals) {	
	g = globals;			
	//Local version of ƒ
	var ƒ = function(str, xstr, polar) {		
		var xstr = xstr || "x",
			parse = function(str) {
				return str.replace(/([0-9])([(][^)]+[)]|[a-zA-Z])/g, "$1*$2")	//Change coeff to multiplication
				   .replace(/([(][^)]+[)]|[a-zA-Z0-9]+)\^([(][^)]+[)]|\S+)(\s|$)/g, "Math.pow($1, $2)$3");	//Exponential Function
			},
			x = parse(xstr),
			parse = parse(str);
			
		//Once ƒ is constructed with a string, ƒ becomes a function of a value -- with the same prototype
		if( polar )
			var ƒ = new Function("x", "with(g) return isNaN(x)?'"+parse+"':[cos("+x+")*"+parse+", sin(x)*"+parse+"]");
		else
			var ƒ = new Function("x", "with(g) return isNaN(x)?'"+parse+"':["+x+", "+parse+"]");
		ƒ.p = ƒ.prototype = window.ƒ.p;
		//Apply prototype to constructor
		for( var key in ƒ.p )
			ƒ[key] = ƒ.p[key];
		return ƒ;
	};
	ƒ.p = ƒ.prototype = {
		constructor: ƒ,
		initPlane: function(over, e) {
			var thiz = this;
			ƒ("0").graph(0,1,'#666'),ƒ("x","0").graph(0,1,'#666');		
			return thiz;
		},
		y: function(x) {
			return this(x)[1];
		},
		graph: function( win, ax, color ) {
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
			var context;
			if (elem.getContext && (context = elem.getContext('2d'))) {	
				!ax&&ƒ.initPlane(elem);									
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
			}
			return thiz;
		}
	};
	//Apply prototype to constructor
	for( var key in ƒ.p ) {
		ƒ[key] = ƒ.p[key];
	}
	return ƒ;
})(document.getElementsByTagName("canvas")[0],(function() {
	o = {};
	with(o) {
		o.factorial = function(x,a) {a=1,x++;while(x-->1)a*=x;return a},
		o.rec = function(cb){return function(x) {1/cb(x)}},
		o.e   = Math.exp(1),
		o.pi  = 3.14159,
		o.log = o.ln = Math.log,
		o.exp = Math.exp,
		o.sin = Math.sin,
		o.cos = Math.cos,
		o.tan = Math.tan,
		o.csc = rec(sin),
		o.sec = rec(cos),
		o.cot = rec(tan),
		o.acos = Math.acos,
		o.asin = Math.asin,
		o.atan = Math.atan,
		o.sqrt = Math.sqrt;
	}; 
	return o;
})());