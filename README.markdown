René
====

Usage
-----

Functions are to be provided in a slightly modified form of APL expressions. Often 
these expressions are indistinguishable from traditional arithmetic notation, but at 
other times they may look strikingly different.

```javascript
// f(x) = (x^3)/2 + 5
ƒ("(x^3)/2+5").graph(document.getElementById('cvs'), null, 100);
```

```javascript
// f(x) = 2cos(x)
ƒ("2*1•x").graph(document.getElementById('cvs'), null, 100);
```

Roadmap
-------
- 3D
- more complete library of APL functions