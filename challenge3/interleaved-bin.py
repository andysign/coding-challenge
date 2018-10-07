#!/usr/bin/python3
"""
	Python program to generate and print based on a given string of 1s, 0s and
	Xs, every possible combination where X is replaced with ​both 0 and 1.
	Usage: ./interleaved-bin.py 10X10X0
"""
# #https://stackoverflow.com/questions/12325868/#12329085
# import sys, itertools
# strarg = sys.argv[1] if len(sys.argv)>1 else "XX"
# exp = len(strarg.replace("1","").replace("0",""))
# def interleaved(strvar):
# 	interleav=itertools.zip_longest(strarg.split("X"),list(strvar),fillvalue='')
# 	return "".join([x for t in interleav for x in t])
#
# for x in range(2**exp): print(interleaved(bin(x)[2:].rjust(exp, '0')))

from sys import argv
from asyncio import Queue
from itertools import zip_longest

strarg = argv[1] if len(argv)>1 else "XX"

def interleaved(strvar):
	interleav = zip_longest(strarg.split("X"),list(strvar),fillvalue='')
	return "".join([x for t in interleav for x in t])

queue = Queue()

# Calculate exponential power to calculate n
exp = len(strarg.replace("1","").replace("0",""))

# Enqueu the first and second number
queue.put_nowait("0")
queue.put_nowait("1")

# Print first
print(interleaved( queue.get_nowait().rjust(exp,"0") ))

# Make a loop that makes a tree with 1 root 0 as l child and 1 as r child etc
for _ in range(2**exp-1, 0, -1):
	# Print the front of the queue
	f1 = queue.get_nowait()
	print(interleaved( f1.rjust(exp,"0") ))
	
	# Backup f1 in f2
	f2 = f1
	
	# Append "0" to f1 and enqueue it
	queue.put_nowait(f1 + "0")
	
	# Append "1" to f2 and enqueue it. Here f2 contains the prev front
	queue.put_nowait(f2 + "1")
