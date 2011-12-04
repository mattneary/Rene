var ƒ = (function() {	

	//Local version of ƒ
	var ƒ = function(str) {		
		//Once ƒ is constructed with a string, ƒ becomes a function of a value -- with the same prototype
		var ƒ = function(x) {
			var	e = Math.exp(1),
				sin = Math.sin,
				cos = Math.cos,
				tan = Math.tan,
				pi = 3.14159,
				sqrt = Math.sqrt,
				parse = str.replace(/([0-9])([(][^)]+[)]|[a-zA-Z])/g, "$1*$2")	//Change coeff to multiplication
					   .replace(/([(][^)]+[)]|[a-zA-Z0-9]+)\^([(][^)]+[)]|\S+)(\s|$)/g, "Math.pow($1, $2)$3")	//Exponential Function
					   .replace(/x/g, x);		//Insert x
			
			return isNaN(x) ? parse : { f: function(window, document) { return eval(parse); } }.f();
		};
		ƒ.p = ƒ.prototype = window.ƒ.p;
		//Apply prototype to constructor
		for( var key in ƒ.p )
			ƒ[key] = ƒ.p[key];
		return ƒ;
	};
	ƒ.p = ƒ.prototype = {
		constructor: ƒ,
		initPlane: function(elem) {
			elem = elem || document.getElementsByTagName('canvas')[0];
			elem.width = elem.width;
			if (elem && elem.getContext && (context = elem.getContext('2d'))) {						    				
				context.beginPath();				
				//Axis Style
				context.strokeStyle = '#000';
				context.lineWidth   = 1;				
				//y-axis
				context.moveTo( axies.y, 0 );
				context.lineTo( axies.y, elem.height );				
				//x-axis
				context.moveTo( 0, axies.x );
				context.lineTo( elem.width, axies.x );				
				context.stroke();
				context.closePath();
			}
		},
		graph: function( f, elem, scaleWindow, prec) {
		
			var thiz = this;
			if( typeof(f) == 'object' )
				elem = [prec = scaleWindow, scaleWindow = elem, f, f = null][2];	//Swapping Magic
			else if( f && typeof(f) != 'function' )
				str = f, f = ƒ(str);
			if( !f )				
				f = thiz;
			
			var prec = prec || 100,
			    elem = elem || document.getElementsByTagName('canvas')[0],
			    scaleWindow = scaleWindow || [
					-8,	//xMin
					8,	//xMax
					-8,	//yMin
					8	//yMax
			    ];
			
			scaleWindow[3] = [-scaleWindow[2], (scaleWindow[2] = -scaleWindow[3])][0];	//Swap Max/Min to make more intuitive
			var pdy = elem.height/(scaleWindow[3]-scaleWindow[2]),
				pdx = elem.width/(scaleWindow[1]-scaleWindow[0]);
				
			axies = {
				y: (elem.width*(0-scaleWindow[0])/(scaleWindow[1]-scaleWindow[0])),
				x: (elem.height*(0-scaleWindow[2])/(scaleWindow[3]-scaleWindow[2]))
			};
			if (elem && elem.getContext && (context = elem.getContext('2d'))) {	
				ƒ.initPlane(elem);									
				context.beginPath();				
				//Plot style
				context.strokeStyle = '#f00';
				context.fillStyle 	= '#00f';
				context.lineWidth   = 3;
				
				var sum = 0;
				for( var i = axies.y/elem.width * -1 * prec; i < (elem.width-axies.y)/elem.width * prec; i++ ) {
					var fraction = function(n) { return (n - axies.y/elem.width * -1 * prec)/prec; },
						xMin	 = scaleWindow[0],
						xRange 	 = scaleWindow[1] - scaleWindow[0],
						yRange	 = scaleWindow[3] - scaleWindow[2];
					
				    context.moveTo(fraction(i)*elem.width, axies.x-f(xMin+fraction(i)*xRange)/yRange*elem.height); // give the (x,y) coordinates
				    context.lineTo(fraction(i+1)*elem.width, axies.x-f(xMin+fraction(i+1)*xRange)/yRange*elem.height);	
				}		   				
				context.fill();
				context.stroke();
				context.closePath();
			}
		}
	};
	//Apply prototype to constructor
	for( var key in ƒ.p ) {
		ƒ[key] = ƒ.p[key];
	}
	return ƒ;
})();