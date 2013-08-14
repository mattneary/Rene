René
====

Usage
-----

	var linear = ƒ("3x + 5");
	linear.graph(document.getElementById('cvs'), null, 100);

Documentation
-------------

__ƒ (constructor)__:	Input a string and and receive a function of x.
Example:

	ƒ("3x^2")(2)

__ƒ#graph__: Renders a function as a graph on a canvas plane.

	ƒ("3x^2").graph(elem)

Roadmap
-------
- A Full-featured evaluator.
- 3D