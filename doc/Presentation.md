
name:front

class: center, middle

# Specberus

[https://github.com/w3c/specberus/blob/master/doc/logo.png]

---

# What

Specberus (ˈspɛk bər əs) *n. new* pubrules *automatic checker and documentation tool.*

*Specberus* is expected to replace the [current pubrules tool](http://www.w3.org/2005/07/pubrules) in the near future.

---

# Why

[`http://www.w3.org/2005/07/pubrules`](http://www.w3.org/2005/07/pubrules) has been around for nine years. While it has served us well, there is room for improvement:

--
*Complex maintenance.
--
* XSLT is not flexible enough.
--
* There is no clear separation beetween the documentation (human-readable publication rules) and the automatic checker (the software).

---

# How

In JavaScript, on [Node.js](http://nodejs.org/), with [Bootstrap](http://getbootstrap.com/), [jQuery](http://jquery.com/) and [Mocha](http://mochajs.org/).

---

# How: general architecture

    Specberus
    ├── design
    ├── lib
    │   ├── profiles
    │   └── rules
    ├── node_modules
    ├── public
    │   ├── css
    │   ├── fonts
    │   ├── img
    │   └── js
    ├── test
    │   └── docs
    └── tools

---

# How: *rules*

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
    ├── public
    │   ├── css
    │   ├── fonts
    │   ├── img
    │   └── js
    ├── test
    │   └── docs
    └── tools

---

# How: *profiles*

* foo
** bar
* err
** foo
** bar

* `base`
  * `TR`
    * `WG-NOTE` (identical)
      * `FPWG-NOTE` (identical)
    * `WD` (identical)
    * `PER`
    * `RSCND` (identical)
    * `PR`
    * `CR`
    * `FPWD` (identical)
  * `IG-NOTE`
    * `FPIG-NOTE` (identical)
  * `SUBM`
  * `MEM-SUBM`
  * `TEAM-SUBM`
  * `CG-NOTE`
  * `FPLC`
  * `REC`
  * `LC`
* `dummy`

---

# How: unit-testing

    Specberus
    ├── design
    ├── lib
    │   ├── profiles
    │   └── rules
    ├── node_modules
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

---

# How: dependencies

`# apt-get install`:
* [`nodejs`](http://nodejs.org/)
* [`npm`](http://github.com/isaacs/npm)

--

`$ npm install` (but you can do `npm install -d` instead to install all at once):
* [`express`](https://www.npmjs.org/package/express)
* [`safe-url-input-checker`](https://www.npmjs.org/package/safe-url-input-checker)
* [`socket.io`](https://www.npmjs.org/package/socket.io)
* [`superagent`](https://www.npmjs.org/package/superagent)
* [`whacko`](https://www.npmjs.org/package/whacko)

---

# How: dependencies for debugging

Necessary for development, testing and debugging:
* [`expect.js`](https://www.npmjs.org/package/expect.js)
* [`mocha`](https://www.npmjs.org/package/mocha)

--

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

--

## Deployments for testing

* Up to `v0.3.3-1`: [`http://pubrules.jit.su/`](http://pubrules.jit.su/).
* From: `V0.4.0` onwards: [`http://cerberus.w3.org/`](http://cerberus.w3.org/).

[Information maintenance of our machine for Node.js apps](https://www.w3.org/Systems/nodejs/)

---

# Who

* [Robin](https://github.com/darobin).
* [Denis](https://github.com/deniak).
* [Guillaume](https://github.com/guibbs).
* [Antonio](https://github.com/tripu).
* You!?

