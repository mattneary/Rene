Usage Sample
============

	var linear = ƒ("3x + 5");
	linear.graph(document.getElementById('cvs'), null, 100);

Functions
=========

__ƒ (constructor):	Input a string and and receive a function of x.__
Example:

	ƒ("3x^2")(2) //Returns 12
	
__ƒ.graph: Input a function (optional) canvas element, window, and precision level and have it plotted.__
Examples:

	ƒ.graph("3x^2", document.getElementById('cvs'), null, 100);

OR

	ƒ("3x^2").graph(document.getElementById('cvs'), null, 100);
	
Code Breakdown
==============

Basics:
	```\_f = (function() {						//IIFE
	 var _f = function(str) {				//Constructor
	  return function(x) {					//Constructed Function
	   return eval(str.replace(/x/g, x));	//Evaluation based on input
	  };
	 }
	
	\_f.p = _f.prototype = {				//Declare prototype
	  constructor: \_f,
	  attr: "value"
	 }
	 for( key in \_f.p )						//Extend Instance
	  \_f[key] = \_f.p[key];
	 return _f;								//Return instance
	})(); ```

Reduces to a tweet:
	```\_=function(){\_=function(s){return function(x){return eval(s)}};\_.p=\_.prototype={constructor:\_,var:"x"};for(k in \_.p)_[k]=\_.p[k];return \_}()```

	


