class: center, middle

# Specberus

.center[![Logo](https://raw.githubusercontent.com/w3c/specberus/master/doc/logo-small.png)]

---

# What

Specberus (ˈspɛk bər əs) _n. new_ pubrules _automatic checker and documentation tool._

_Specberus_ is expected to replace the [current pubrules tool](https://www.w3.org/2005/07/pubrules) in the near future.

---

# Why

[`https://www.w3.org/2005/07/pubrules`](https://www.w3.org/2005/07/pubrules) has been around for nine years. While it has served us well, there is room for improvement:

--

-   Complex maintenance.
-   XSLT is not flexible enough.
-   There is no clear separation between the documentation (_human-readable publication rules_) and the automatic checker (_the software_).
-   Difficult to integrate within the broader publication workflow.

---

# How

In JavaScript, on [Node.js](https://nodejs.org/); with [Bootstrap](https://getbootstrap.com/), [jQuery](https://jquery.com/) and [Mocha](https://mochajs.org/).

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

# How: _rules_

    Specberus
    ├── design
    ├── lib
    │   ├── profiles
    │   └── rules
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

# How: _profiles_

    "base"
        "TR"
            "WG-NOTE" (identical)
                "FPWG-NOTE" (identical)
            "WD" (identical)
            "PER"
            "RSCND" (identical)
            "PR"
            "CR"
            "FPWD" (identical)
        "IG-NOTE"
            "FPIG-NOTE" (identical)
        "SUBM"
        "MEM-SUBM"
        "CG-NOTE"
        "FPLC"
        "REC"
        "LC"

---

# How: testing

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
    │       ├── headers
    │       ├── links
    │       ├── sotd
    │       ├── structure
    │       ├── style
    │       └── validation
    └── tools

The tests are all written in `test/all-rules.js` and fixtures are available in `test/docs`.

---

# How: automated builds

Using [Jenkins](https://jenkins-ci.org/).

    $ mocha

---

# How: dependencies

`# apt-get install`:

-   [`nodejs`](https://nodejs.org/)
-   [`npm`](https://github.com/isaacs/npm)

--

`$ npm install`
(but you can do `npm install -d` instead to install all at once):

-   [`express`](https://www.npmjs.org/package/express) (web framework)
-   [`express-rest`](https://www.npmjs.org/package/express-rest) (REST server framework)
-   [`socket.io`](https://www.npmjs.org/package/socket.io) (realtime application server and client)
-   [`safe-url-input-checker`](https://www.npmjs.org/package/safe-url-input-checker) (URL checker)
-   [`superagent`](https://www.npmjs.org/package/superagent) (HTTP request library)
-   [`whacko`](https://www.npmjs.org/package/whacko) (HTML parser)

---

# How: dependencies for debugging

Necessary for development, testing and debugging:

-   [`mocha`](https://www.npmjs.org/package/mocha) (JavaScript test framework)
-   [`expect.js`](https://www.npmjs.org/package/expect.js) (assertion library)

--

Nice to have for debugging:

-   [`node-debug`](https://www.npmjs.org/package/debug)

---

# How Specberus has improved recently

`0.3.3` → `0.4.0`

-   Recursive validation of compound documents.
-   Better heuristics to detect and check dates, WG's, etc.
-   Better output, more detailed feedback to the user:
    -   Colour-coding error/warning messages.
    -   Informative messages can be displayed, too.
    -   Ability to include markup in the output, eg hyperlinks.
-   Added a _summary of results_, with internal links.
-   Implemented a few new rules.
-   Some enhancements related to usability and design.
-   Extended the suite of tests (there are 63 individual tests now).
-   Bug-fixing.
-   Deployed on a dedicated _Node.js_ server.
-   Exposing a REST API to enable integration within the broader publication workflow [WIP].

---

# When: pending tasks

`0.5.0`?
`1.0.0`?

1. _[Offer help descriptions for all rules and all errors](https://github.com/w3c/specberus/issues/22)_ and _[Reproduce documentation from pubrules](https://github.com/w3c/specberus/issues/25)_ (related).
2. _[Write command-line client](https://github.com/w3c/specberus/issues/5)_
3. _[Expose as HTTP API](https://github.com/w3c/specberus/issues/4)_
4. _[The hierarchy of available profiles is hard-coded in the UI](https://github.com/w3c/specberus/issues/51)_
5. _[Track whacko for better support for next/nextAll/prev/prevAll so that we can remove lots of nasty hacks](https://github.com/w3c/specberus/issues/3)_
6. _[Make rule checking more parallelised, notably for network IO](https://github.com/w3c/specberus/issues/1)_
7. Improve performance.
8. Polish design and test on more platforms.

---

# When: feedback about beta version

You are encouraged to try this new checker, and especially to submit bug reports and suggestions.

-   General feedback about the publication workflow: [`public-pubrules-comments@w3.org`](public-pubrules-comments@w3.org)
-   Specific bugs or ideas about the pubrules checker: [`https://github.com/w3c/specberus/issues`](https://github.com/w3c/specberus/issues)

---

# Where

## Public project & source code

[On GitHub](https://github.com/w3c/).

There are currently 22 [open issues](https://github.com/w3c/specberus/issues).

The `#pubrules` channel on [irc.w3.org](https://irc.w3.org/) is a good place if you have any questions regarding the project.

--

## Deployments for testing

-   Up to `v0.3.3-1`: [`https://pubrules.jit.su/`](https://pubrules.jit.su/).
-   From: `V0.4.0` onwards: [`https://www.w3.org/2014/10/pubrules/`](https://www.w3.org/2014/10/pubrules).

---

# Who

-   [Robin](https://github.com/darobin).
-   [Denis](https://github.com/deniak).
-   [Guillaume](https://github.com/guibbs).
-   [Antonio](https://github.com/tripu).
-   You!?
