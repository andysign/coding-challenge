#!/usr/bin/python3
"""
	Python program to generate and print based on a given string of 1s, 0s and
	Xs, every possible combination where X is replaced with ​both 0 and 1.
"""

# Import sys and q and itertools
import sys, asyncio, itertools

queue = asyncio.Queue()

strarg = sys.argv[1] if len(sys.argv)-1 else "XX"

def interprint(strvar):
	strfixed = list(strarg.split("X"))
	strvar   = list(strvar)
	interleaved = itertools.zip_longest(strfixed,strvar,fillvalue='')
	return "".join([x for t in interleaved for x in t])

exp = len(strarg.replace("1","").replace("0",""))
n = 2**exp - 1

queue.put_nowait("0")
queue.put_nowait("1")

print(interprint( queue.get_nowait().rjust(exp, "0") ))

for i in range(n,0,-1):
	f1 = queue.get_nowait()
	print(interprint( f1.rjust(exp,"0") ))
	
	f2 = f1
	
	queue.put_nowait(f1 + "0")
	
	queue.put_nowait(f2 + "1")
