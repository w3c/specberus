
name:front

class: center, middle

# Specberus

[https://raw.githubusercontent.com/w3c/specberus/master/public/img/logo.svg]

---

# What

Specberus (ˈspɛk bər əs) *n. new* pubrules *automatic checker and documentation tool.*

*Specberus* is expected to replace the [current pubrules tool](http://www.w3.org/2005/07/pubrules) in the near future.

---

# Why

[`http://www.w3.org/2005/07/pubrules`](http://www.w3.org/2005/07/pubrules) has been around for nine years. While it has served us well, there is room for improvement:

* Complex maintenance.
* XSLT is not flexible enough.
* There is no clear separation beetween the documentation (human-readable publication rules) and the automatic checker (the software).

---

# How

In JavaScript, on *Node.js*.

## Architecture

    Specberus
    ├── design
    ├── lib
    │   ├── profiles
    │   └── rules
    │       ├── dummy
    │       ├── headers
    │       ├── heuristic
    │       ├── links
    │       ├── sotd
    │       ├── structure
    │       ├── style
    │       └── validation
    ├── node_modules
    │   ├── expect.js
    │   ├── express
    │   ├── mocha
    │   ├── safe-url-input-checker
    │   ├── socket.io
    │   ├── superagent
    │   └── whacko
    ├── public
    │   ├── css
    │   ├── fonts
    │   ├── img
    │   └── js
    ├── test
    │   └── docs
    │       ├── dummy
    │       ├── headers
    │       ├── links
    │       ├── sotd
    │       ├── structure
    │       ├── style
    │       └── validation
    └── tools

## Dependencies

`# apt-get install`:
* [`nodejs`](http://nodejs.org/)
* [`npm`](http://github.com/isaacs/npm)

`$ npm install` (but you can do `npm install -d` instead to install all at once):
* [`express`](https://www.npmjs.org/package/express)
* [`safe-url-input-checker`](https://www.npmjs.org/package/safe-url-input-checker)
* [`socket.io`](https://www.npmjs.org/package/socket.io)
* [`superagent`](https://www.npmjs.org/package/superagent)
* [`whacko`](https://www.npmjs.org/package/whacko)

Necessary for development, testing and debugging:
* [`expect.js`](https://www.npmjs.org/package/expect.js)
* [`mocha`](https://www.npmjs.org/package/mocha)

Nice to have for debugging:
* [`node-debug`](https://www.npmjs.org/package/debug)

---

# When

Switchover from the old publication workflow to the new one (including *Specberus*) is expected [during the first half of 2015?].

---

# Where

## Public project & source code

[On GitHub](https://github.com/w3c/).

There are currently 24 [open issues](https://github.com/w3c/specberus/issues).

## Deployments for testing

* Up to `v0.3.3-1`: [`http://pubrules.jit.su/`](http://pubrules.jit.su/).
* From: `V0.4.0` onwards: [`http://cerberus.w3.org/`](http://cerberus.w3.org/).

---

# Who

* [Robin](https://github.com/darobin).
* [Denis](https://github.com/deniak).
* [Guillaume](https://github.com/guibbs).
* [Antonio](https://github.com/tripu).
* You!?

