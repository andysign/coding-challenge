#!/usr/bin/python3
"""
	Python program to generate and print based on a given string of 1s, 0s and
	Xs, every possible combination where X is replaced with ​both 0 and 1.
"""

# Import sys and q and itertools
import sys
import asyncio
import itertools

strarg = sys.argv[1] if len(sys.argv)-1 else "XX"

queue = asyncio.Queue()

def interprint(strvar):
	strfixed = list(strarg.split("X"))
	strvar   = list(strvar)
	interleaved = itertools.zip_longest(strfixed,strvar,fillvalue='')
	return "".join([x for t in interleaved for x in t])

# Calculate exponential power to calculate n
exp = len(strarg.replace("1","").replace("0",""))
n = 2**exp - 1

# Enqueu the first and second number
queue.put_nowait("0")
queue.put_nowait("1")

# Print first
print(interprint( queue.get_nowait().rjust(exp, "0") ))

# Make a loop that makes a tree with 1 root 0 as l child and 1 as r child etc
for i in range(n,0,-1):
	# Print the front of the queue
	f1 = queue.get_nowait()
	print(interprint( f1.rjust(exp,"0") ))
	
	# Backup f1
	f2 = f1
	
	# Append "0" to f1 and enqueue it
	queue.put_nowait(f1 + "0")
	
	# Append "1" to f2 and enqueue it. Here f2 contains the prev front
	queue.put_nowait(f2 + "1")
