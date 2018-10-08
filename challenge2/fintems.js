#!/usr/bin/nodejs
/*
* Script crafted to to find one pair of prices from a sorterd list of prices
* that when combined the resulted value is equal or less then a given total.
* Usage: ./fintem.js ["FILE"] ["TOTAL"]
* Where: "FILE" is the file name/path built like: Headphones, 1400\nBox, 100\n
* And where: "TOTAL" is the desired total of the pair
* Will return: the pair of items with prices or "Not possible"
* Usage2: node fintem.js ["FILENAME"] ["TOTAL"]
*/

// Require the file system npm to help read the file
const fs = require('fs');
// Require path to help build the full path
const path = require('path');

// Get the command prompt filename and price arguments
const filename = process.argv[2];
const total = process.argv[3];

// Get the filename and price or default to predefined
const fn = filename ? filename : 'prices.txt';
const t  = total ? total : 2500;

// Read the file and store the content in a simple str
__dirname = path.resolve(path.dirname('')) + '/';
__dirname = (fn.includes('/')||fn.includes('\\')) ? '' : __dirname;
const fpath = __dirname + fn;
const filestr = fs.readFileSync(fpath, {encoding:'utf8'}).trim();

// Get the prices and names
let items = [], prices = [], names = [];
items = filestr.split('\n');
prices = items.map( function(e){ return 1*e.split(', ')[1]; } );
names  = items.map( function(e){ return e.split(', ')[0]+' '; } );

// Old version with hash map, not working for best x and y only for fix match
// mp = new Map(); T=5;  for (i=0; i<prices.length; i++) mp.set( prices[i] , T - prices[i] );
// for (i=0;i<prices.length;i++) if (mp.get( T/*12*/ - i )) console.log(T-i, mp.get(T-i));

// Init the best modified binary search vars
let left = 0, right = prices.length-1, found = false;
let bestx = besty = bestnx = bestny = null;

console.log(prices); console.log("T",t);

while(left<right) {
	console.log("lr", left, right)
	x = prices[left]; y = prices[right];
	console.log("newxy",bestx,besty);
	if ( x+y == t ) {
		console.log("FOUND");
		found = true;
		bestnx = names[left];
		bestny = names[right];
		bestx = x;
		besty = y;
	}
	else if ( x+y > t ) {
		console.log("XYTOBIG");
		right--;
	}
	else if ( x+y < t ) {
		console.log("small");
		if ( t-(bestx+besty) >= t-(x+y) ) {
			bestnx = names[left];
			bestny = names[right];
			bestx = x;
			besty = y;
		}
		left++;
	}
	if(found) break;
	console.log("---")
}
if ( bestx!=null && besty!=null ) {
	console.log(bestnx+bestx +', '+ bestny+besty);
} else {
	console.log("Not possible");
}
