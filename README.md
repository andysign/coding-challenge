# Coding Challenge

The details of the coding challange

**[Full-stack-Engineer.pdf](Full-stack-Engineer.pdf)**

As a side note: explanation why take-home tests are the best way for you to show off your skills **[www.paxos.com/engineering/why-take-home-tests-are-awesome](https://www.paxos.com/engineering/why-take-home-tests-are-awesome)**

# Challenge #1 - Programming

TBD

# Challenge #2 - Programming

TBD

# Challenge #3 - Programming

## Problem

What is required for this challange

> **Introduction**

> You are given a string composed of only 1s, 0s, and Xs.

> Write a program that will print out every possible combination where you replace the X with ​ both 0 and 1.

> **Example**

> ```
> $ myprogram X0
> 00
> 10

> $ myprogram 10X10X0
> 1001000
> 1001010
> 1011000
> 1011010
> ```

> While your program will take longer to run based on the number of possible combinations, your program shouldn’t crash (or hang) on an input with many Xs.

> What is the big O notation for your program?

## Solution

The solution can be found in [challenge3](challenge3) / [interleaved-bin.py](challenge3/interleaved-bin.py)

The solution is done in python3, (Python 3.5.2 to be more exact but the code can be edited to workin in python legacy without much effort.

The approach will have the complexity `O(2^n)` where `n` is the number of `X`s in the given string.

The main loop with the way binary digits are added at the end makes the solution look like a tree with 1 root 0 as left child and 1 as right child and so on. If the print ordering is not important, parhaps this code can be crafted again to use two or more than two threads in parallel.

Another solution is to just use the normal `bin()` conversion function to convert `decimal` numbers into `binary` numbers. This will require of course a loop from `zero` to `n^2-1`.

One can write this second approach in one line:

```python
for x in range(2**exp): print(interleaved(bin(x)[2:].rjust(exp, '0')))
```

Where interleaved is a function to interleave the binary number into the final string that looks like:

```python
def interleaved(strvar):
	interleav = zip_longest(strarg.split("X"),list(strvar),fillvalue='')
	return "".join([x for t in interleav for x in t])
```

For better speed this can be threaded with `asyncio` especially if the requirement is to spit out the result in a file or something similar.

So, final solution will end up with `O(2^n)` but the speed will end up perhaps like `O(2^n/cpu)`
