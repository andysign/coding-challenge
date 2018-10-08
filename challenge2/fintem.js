#!/usr/bin/nodejs
/*
* Script crafted to to find one pair of prices from a sorterd list of prices
* that when combined the resulted value is equal or less then a given total.
* Usage: ./fintem.js ["FILENAME"] ["TOTAL"]
* Where: ["FILENAME"] is the file similar to: Headphones, 1400\nBox, 100\n
* And where: ["TOTAL"] is the desired total of the pair
* Will return: the pair of items with prices or "Not possible"
* Usage2: node fintem.js ["FILENAME"] ["TOTAL"]
*/

const fs = require('fs');

const filename = process.argv[2];
const total = process.argv[3];
fn = filename ? filename : 'prices.txt';
t  = total ? total : 2500;
path = require('path'); __dirname = path.resolve(path.dirname('')); fpath = __dirname + '/' + 'prices.txt'; filestr = fs.readFileSync(fpath, {encoding:'utf8'}).trim(); items = filestr.split('\n');


prices = items.map( function(e){ return 1*e.split(', ')[1]; } );

names  = items.map( function(e){ return e.split(', ')[0]+' '; } );

// Old version with hash map, not working for best x and y only for fix match
// mp = new Map(); T=5;  for (i=0; i<prices.length; i++) mp.set( prices[i] , T - prices[i] );
// for (i=0;i<prices.length;i++) if (mp.get( T/*12*/ - i )) console.log(T-i, mp.get(T-i));

left = 0; right = prices.length-1; bestx = null; besty = null; found = false;

while(left<right) {
x = prices[left]; y = prices[right]; console.log(x,y);
if ( x+y == t ) { console.log("F"); found = true; bestx = x; besty = y; }
if ( x+y > t ) { console.log("B"); right--; }
if ( x+y < t ) { console.log("s"); left++; bestx = x; besty = y; }
console.log("lr,t", left, right, t)
console.log(prices)
if(found) break;
}
if (bestx!=null&&besty!=null) {console.log(names[left]+prices[left] +', '+ names[right]+prices[right]);} else {console.log("Not possible");}
