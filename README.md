# Coding Challenge

The details of the coding challange: **[Full-stack-Engineer.pdf](Full-stack-Engineer.pdf)** and as a side note: explanation why take-home tests are the best way for you to show off your skills **[www.paxos.com/engineering/why-take-home-tests-are-awesome](https://www.paxos.com/engineering/why-take-home-tests-are-awesome)**

**Table of Contents**

* **[Challenge #1](#challenge-1---programming)**
* **[Challenge #2](#challenge-2---programming)**
* **[Challenge #3](#challenge-3---programming)**

----

# Challenge #1 - Programming

## Problem

What is required for this challange

> **Introduction**
>
> Publish a small service on the web that has two endpoints:
>
> 1. **/messages** takes a message (a string) as a POST and returns the SHA256 hash digest of that message (in hexadecimal format)
>
> 2. **/messages/< hash >** is a GET request that returns the original message. A request to a non-existent <hash> should return a 404 error.
>
> **Example**

>```
>$ curl http://mywebsite.com/messages/2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae
> {
> "message": "foo"
> }
> $ curl -i
> http://mywebsite.com/messages/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
> HTTP/1.0 404 NOT FOUND
> Content-Type: application/json
> Content-Length: 36
> Server: Werkzeug/0.11.5 Python/3.5.1
> Date: Wed, 31 Aug 2016 14:21:11 GMT
> {
> "err_msg": "Message not found"
> }
> (your specifics may vary, all that matters is that you get a 404)
>```

> Hnt: When does ordering of messages you POST vs digests you GET matter?

> **Performance Question**

> What would the bottleneck(s) be in your implementation as you acquire more users? How you might scale your microservice?


## Solution

The app can be review at: **[http://3.8.41.27:8080/](http://3.8.41.27:8080)**

The code can be found in [challenge1](challenge1) / [app.js](challenge1/app.js) and the entire approach is a *Nodejs-8* plus *MongoDb* web based service with the `body-parser`, `express` and `mongodb` *npms*.

In the Linux virtual machine / Testing machine with docker, run `export DBPWD=password` to before anything then install what's needed and then run the app in background with:

`nohup node app.js >> log 2>> log &`

OR

`nohup node app.js password >> log 2>> log &`

The application script will take the message posted trough the html form provided trough the messages/ router and hash that message (**sha256** using *crypto.js*) and save that hash in a *mongodb document* (after checking if the information is not already there). Finally the application script will also check if a provided hash is already saved in the database and display the message or display page not found if not.

Testing was done both with *curl* and with a normal browser as seen below:

A simple post with the message foo

```shell
root@express:~/myprj# curl -X POST --data 'message=foo' http://localhost:8080/messages/ && echo
2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae
```

Then a simple check for 2c2...

```shell
root@express:~/myprj# curl http://localhost:8080/messages/2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae && echo
{
 "message": "foo"
}
```

Then finally test the page not found message

```shell
root@express:~/myprj# curl -i http://localhost:8080/messages/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa && echo
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 35
ETag: W/"23-rpDNi/ZlZdMC2ioe7G+yNl+c+7o"
Date: Tue, 09 Oct 2018 16:57:05 GMT
Connection: keep-alive

{
 "err_msg": "Message not found"
}
```

In terms of problems like bottlenecks, if the server gets hit with a lot of traffic by a lot of users, the the best way would be to scale using standard scalable solutions provided by AWS and so on.

If the assumption is there will be a lot of users from day one then the best approach is to build the application in the following way.

At first the user will create the hash in the browser then based on the first hexadecimal digit of the hash connect to to another server to save the entire hash and the message after proper verifications.

For example: *if* `hash('foo')` starts with `'2'` *then* connect to server number 3 from a subset of 16 servers trough ip X.Y.0.2 then save the data there after making sure the hash provided is actually hash of *foo* , same way for a hash that starts with `3` and so on...

A more complex idea would be to use the something similar to the **Ethereum Modified Merkle-Paricia-Trie System**.

Last but not least, if the message is fixed in length and the lenght is reasonably small, one can compute a large  [RainbowTable](http://kestas.kuliukas.com/RainbowTables/) meaning the database will remain more or less static.

----

# Challenge #2 - Programming

## Problem

What is required for this challange

> **Introduction**
>
> You have been given a gift card that is about to expire and you want to buy gifts for 2 friends.
>
> You want to spend the whole gift card, or if that’s not an option as close to the balance as possible. You have a list of sorted prices for a popular store that you know they both like to shop at. Your challenge is to find two distinct items in the list whose sum is minimally under (or equal to) the gift card balance.
>
> The file contains two columns:
>
> 1. A unique identifier of the item. You can assume there are no duplicates.
>
> 2. The value of that item in cents. It is always a positive integer that represents the price in
> cents (1000 = $10.00).
>
> Write a program to find the best two items. It takes two inputs:
>
> 1. A filename with a list of sorted prices
>
> 2. The balance of your gift card
>
> If no two items have a sum that is less than or equal to the balance on the gift card, print “Not possible”. You don’t have to return every possible pair that is under the balance, just one such pair.

> **Example**
>
> Some examples:
>
> ```
> $ cat prices.txt
> Candy Bar, 500
> Paperback Book, 700
> Detergent, 1000
> Headphones, 1400
> Earmuffs, 2000
> Bluetooth Stereo, 6000
>
> $ find-pair prices.txt 2500
> Candy Bar 500, Earmuffs 2000
>
> $ find-pair prices.txt 2300
> Paperback Book 700, Headphones 1400
>
> $ find-pair prices.txt 10000
> Earmuffs 2000, Bluetooth Stereo 6000
>
> $ find-pair prices.txt 1100
> Not possible
> ```


> Note: There may be many rows in the file, so be sure to optimize your solution to scale.
> What is the big O notation for your program?

> **Bonus Question (optional)**

> You are considering giving gifts to more people. Instead of choosing exactly 2 items, allow for 3 gifts.

## Solution

The code can be found in [challenge2](challenge2) / [fintems.js](challenge2/fintems.js) and it is written in `NodeJs 8`. One can run the code with simply `./fintems.js filename 1000` if the *fintems* is changed to *chmod* exacutable.

There are three approaches to solve this problem (1) brute force, (2) use binary and search on the sorted array, and (3) ~~use the hashtables~~.

The last one is the best one but only if what is required is to find the perfect match of two items that when adding the two items the result is exactly the amount of the gift card.

The first approach, as in to use **brute force**, gives unfortunately a time complexity of `O(n^2)` and a space complexity something that looks similar.

The third approach, **hashtables**, cannot be used in this example at all but as an idea, just for the record, inserting every el into a hash table is easy. This takes `O(n)` as constant time insertion. After that for every x, we can just look up its complement, `T-x`, which is `O(1)`. Overall it takes will be `O(n)`.

Just for the record this would look something like:

```javascript
mp = new Map(); for (i=0; i<prices.length; i++) mp.set( prices[i] , t - prices[i] ); for (i=0;i<prices.length;i++) if (mp.get( t - i )) console.log(t-i, mp.get(t-i));
```

Finally the only option left is to use the second approach as in, use something that looks like a **binary search** algorithm. In general a normal *binary search* algorithm has a complexity of `O(log n)` but because of other things like preparing the array the final solution will take `O(n log n)`.

The final solution will be a loop that takes the first and last element and sum them up. After that check if sum is equal to t total desired we have found the pair, but if sum is greater than t, we reduce right pointer by 1, and so on...

If the we want to find a pair of 3 numbers therefore 3 gifts, then a similar binary search function can be crafted to find `x,y,z`. Here we will need to go trough all the numbers like first select z as one of the first numbers then do a binary search for x,y where the condition is `(x+y)<=(t-z)` and of course keep `bestX,bestY,bestZ` then select another item for Z and get bestX,Y,Z again and so on and then give only the pair of 3 that is just under t the desired total which is the value of the gift card.

----

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
>
> $ myprogram 10X10X0
> 1001000
> 1001010
> 1011000
> 1011010
> ```

> While your program will take longer to run based on the number of possible combinations, your program shouldn’t crash (or hang) on an input with many Xs.

> What is the big O notation for your program?

## Solution

The solution can be found in [challenge3](challenge3) / [interleaved-bin.py](challenge3/interleaved-bin.py) and one can run the script with `./interleaved-bin.py 10X10X0` if interleaved is *chmod* executable.

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
