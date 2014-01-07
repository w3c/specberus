# Specberus

Specberus is a reload of W3C's PubRules checker. It is currently in development and not directly
usable, but hacking is welcome.

## Installation

Specberus is a Node application. It will eventually be distributed through npm, but in the meantime
you can simply clone this repository and run:

    npm install -d

In order to get all the dependencies installed. Naturally, this requires that you have a reasonably
recent version of Node installed.

## Running

Currently there is no shell to run Specberus. Later we will add both Web and CLI interfaces based
on the same core library.

## Testing

Testing is done using mocha. Simply run:

    mocha

from the root and you will be running the test suite. Mocha can be installed with:

    npm install -g mocha

Some of the tests can on occasion take a long time, or fail outright because a remote service is
unavailable. To work around this, you can set SKIP_NETWORK:

    SKIP_NETWORK=1 mocha
