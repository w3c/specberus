[![Build Status](https://travis-ci.org/w3c/specberus.svg?branch=master)](https://travis-ci.org/w3c/specberus)
[![Coverage Status](https://coveralls.io/repos/w3c/specberus/badge.svg)](https://coveralls.io/r/w3c/specberus)
[![Dependency Status](https://david-dm.org/w3c/specberus.svg)](https://david-dm.org/w3c/specberus)
[![devDependency Status](https://david-dm.org/w3c/specberus/dev-status.svg)](https://david-dm.org/w3c/specberus#info=devDependencies)

# Specberus

Specberus is a checker for W3C's Publication Rules (PubRules).

## Installation

Specberus is a Node application. It will eventually be distributed through npm, but in the meantime
you can simply clone this repository and run:

    npm install -d

In order to get all the dependencies installed. Naturally, this requires that you have a reasonably
recent version of Node installed.

## Running

Currently there is no shell to run Specberus. Later we will add both Web and CLI interfaces based
on the same core library.

### Syntax and command-line parameters

```
$ npm start [PORT]
```

Meaning of positional parameters:

1. `PORT`: where Specberus will be listening for HTTP connections.
(Default `80`.)

Examples:

```bash
$ npm start
$ npm start 3001
```

## Testing

Testing is done using mocha. Simply run:

    mocha

from the root and you will be running the test suite. Mocha can be installed with:

    npm install -g mocha

Some of the tests can on occasion take a long time, or fail outright because a remote service is
unavailable. To work around this, you can set SKIP_NETWORK:

    SKIP_NETWORK=1 mocha

## API

The interface you get when you `require("specberus")` is that from `lib/validator`. It returns a
`Specberus` instance that is properly configured for operation in the Node environment
(there is nominal support for running Specberus under other environments, but it isn't usable at this time).

The validator interface supports a `validate(options)` methods, which takes an object with the
following fields:

* `url`: URL of the content to check. One of `url`, `source`, `file`, or `document` must be
  specified and if several are they will be used in this order.
* `source`: A `String` with the content to check.
* `file`: A file system path to the content to check.
* `document`: A DOM `Document` object to be checked.
* `profile`: A profile object which defines the validation. Required. See below.
* `events`: An event sink which supports the same interface as Node's `EventEmitter`. Required. See
  below for the events that get generated.

### Emitting metadata about the document

Every time the validator finds/deduces a piece of metadata about the document, it emits a `metadata` event.
`metadata` messages contain two arguments: *key* and *value*.
Keys are unique IDs, while the types of values are different according to the specific kind of metadata.

These properties are now returned when found:

* `docDate`: The date associated to the document.
* `title`: The (possible) title of the document.
* `process`: The process rules, **as they appear on the text of the document**, eg `'14 October 2005'`.
* `deliverers`: The deliverer(s) responsible for the document (WGs, TFs, etc); an `Array` of `Object`s, each one with these properties:
  * `homepage`: URL of the group's home page.
  * `name`: name of the group, exactly as it is found in the hyperlink on the document.
* `delivererIDs` ID(s) of the deliverer(s); an `Array` of `Number`s.
* `thisVersion`: URL of this version of the document.
* `previousVersion`: URL of the previous version of the document (the last one, if multiple are shown).
* `latestVersion`: URL of the latest version of the document.
* `editorIDs`: ID(s) of the editor(s) responsible for the document; an `Array` of `Number`s.
* `editorsDraft`: URL of the latest editor's draft.
* `status`: ID (acronym) of the profile detected in the document; a `String`. See file `public/data/profiles.json`.

As an example, validating [`http://www.w3.org/TR/2014/REC-exi-profile-20140909/`](http://www.w3.org/TR/2014/REC-exi-profile-20140909/) (REC)
emits these pairs of metadata:

```javascript
{ docDate: Tue Sep 09 2014 00:00:00 GMT+0900 (JST) }
{ title: 'Efficient XML Interchange (EXI) Profile for limiting usage of dynamic memory' }
{ thisVersion: 'http://www.w3.org/TR/2014/REC-exi-profile-20140909/' }
{ latestVersion: 'http://www.w3.org/TR/exi-profile/' }
{ previousVersion: 'http://www.w3.org/TR/2014/PR-exi-profile-20140506/' }
{ editorIDs: [] }
{ status: 'REC' }
{ process: '14 October 2005' }
{ deliverers: [
   { homepage: 'http://www.w3.org/XML/EXI/',
     name: 'Efficient XML Interchange Working Group' }
  ] }
```

If you download that very spec, edit it to include the following metadata&hellip;

```html
<dt>Editors:</dt>
<dd data-editor-id="329883">Youenn Fablet, Canon Research Centre France</dd>
<dd data-editor-id="387297">Daniel Peintner, Siemens AG</dd>
```

&hellip;and serve it locally from your machine, *Specberus* will spit also editor IDs:

```javascript
{ docDate: Tue Sep 09 2014 00:00:00 GMT+0900 (JST) }
{ title: 'Efficient XML Interchange (EXI) Profile for limiting usage of dynamic memory' }
{ latestVersion: 'http://www.w3.org/TR/exi-profile/' }
{ previousVersion: 'http://www.w3.org/TR/2014/PR-exi-profile-20140506/' }
{ editorIDs: [ '329883', '387297' ] }
{ status: 'REC' }
{ process: '14 October 2005' }
{ deliverers: [
   { homepage: 'http://www.w3.org/XML/EXI/',
     name: 'Efficient XML Interchange Working Group' }
  ] }
```

Another example: when applied to [`http://www.w3.org/TR/wai-aria-1.1/`](http://www.w3.org/TR/wai-aria-1.1/) (WD),
the following metadata will be found:

```javascript
{ docDate: Thu Dec 11 2014 00:00:00 GMT+0900 (JST) }
{ title: 'Accessible Rich Internet Applications (WAI-ARIA) 1.1' }
{ thisVersion: 'http://www.w3.org/TR/2014/WD-wai-aria-1.1-20141211/' }
{ latestVersion: 'http://www.w3.org/TR/wai-aria-1.1/' }
{ previousVersion: 'http://www.w3.org/TR/2014/WD-wai-aria-1.1-20140612/' }
{ editorIDs: [] }
{ status: 'WD' }
{ process: '1 August 2014' }
{ editorsDraft: 'http://w3c.github.io/aria/aria/aria.html' }
{ deliverers: [
   { homepage: 'http://www.w3.org/WAI/PF/',
     name: 'Protocols & Formats Working Group' },
   { homepage: 'http://www.w3.org/html/wg/',
     name: 'HTML Working Group' }
  ] }
```

## Profiles

Profiles are simple objects that support the following API:

* name: A `String` being the name of this profile.
* rules: An `Array` of rule objects which are checked in this profile.

A profile is basically a configuration of what to check. You can load a specific profile from under
`lib/profiles` or create your own.

Here follows the current hierarchy of profiles. Each profile inherits all rules from its parent profile.
Profiles that are identical to its parent profile, ie that do not add any new rules, are marked too.

* `base`
  * `TR`
    * `WG-NOTE` (identical)
      * `FPWG-NOTE` (identical)
    * `IG-NOTE`
      * `FPIG-NOTE` (identical)
    * `WD` (identical)
    * `PER`
    * `RSCND` (identical)
    * `PR`
    * `CR`
    * `FPWD` (identical)
    * `SUBM`
    * `MEM-SUBM`
    * `TEAM-SUBM`
    * `CG-NOTE`
    * `FPLC`
    * `REC`
    * `LC`
* `dummy`

## Validation events

For a given checking run, the event sink you specify will be receiving a bunch of events as
indicated below. Events are shown as having parameters since those are passed to the event handler.

* `start-all(profile-name)`: Fired first to indicate that the profile's checking has started.
* `end-all(profile-name)`: Fired last to indicate that the profile's checking has completed. When
  you receive this you are promised that all testing operations, including asynchronous ones, have
  terminated.
* `done(rule-name)`: Fired when a specific rule has finished processing, including its asynchronous
  tasks.
* `ok(rule-name)`: Fired to indicate that a rule has succeeded. There is only one `ok` per rule.
  There cannot also be `err` events but there can be `warning` events.
* `err(error-name, data)`: Fired when an error is detected. The `data` contains further details,
  that depend on the error but *should* feature a `message` field. There can be multiple errors for
  a given rule. There cannot also be `ok` events but there can be `warning`s.
* `warning(warnings-name, data)`: Fired for non-fatal problems with the document that may
  nevertheless require investigation. There may be several for a rule.
* `info(info-name, data)`: Fired for additional information items detected by the validator.
* `metadata(key, value)`: Fired for every piece of document metadata found by the validator.
* `exception(message)`: Fired when there is a system error, such as a *File not found* error. `message`
  contains details about this error. All exceptions are displayed on the error console in addition to
  this event being fired.

## Writing rules

Rules are simple modules that just expose a `check(sr, cb)` method. They receive a Specberus object
and a callback, use the Specberus object to fire validation events and call the callback when
they're done.

The Specberus object exposes the following API that's useful for validation:

* `$`. A jQuery-like interface to the document being checked.
* `loader`. The loader object that loaded the content, which exposes the content's `url` and
  `source` if they are known.
* `sink`. The event target on which to fire validation events.
* `version`. The Specberus version.
* `checkSelector(selector, rule-name, cb)`. Some rules need to do nothing other than to check that a
  selector returns some content. For this case, the rule can just call this method with the selector
  and its callback, and Specberus will conveniently take care of all the rest.
* `norm(text)`. Returns a whitespace-normalised version of the text.
* `getDocumentDate()`. Returns a Date object that matches the document's date as specified in the
  headers' h2.
* `getDocumentDateElement()`. Returns the element that contains the document's date.

