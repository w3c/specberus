
'use strict';

exports.name = "headers.hr";

exports.check = function (sr, done) {

  var hrLastChildren
  ,   hrNextSiblings
  ,   hasHrLastChild
  ,   hasHrNextSibling
  ;

  if (sr && sr.$) {
    hrLastChildren = sr.$("body div.head > hr:last-child");
    hrNextSiblings = sr.$("body div.head + hr");

    if (hrLastChildren && hrNextSiblings) {
      hasHrLastChild = (hrLastChildren.length === 1);
      hasHrNextSibling = (hrNextSiblings.length === 1);

      if (hasHrLastChild && hasHrNextSibling) {
          sr.error(exports.name, "duplicate");
      }
      else if (!hasHrLastChild && !hasHrNextSibling) {
          sr.error(exports.name, "not-found");
      }

    }
    else {
      // [TO-DO] Handle this error properly.
    }

    done();
  }
  else {
    // [TO-DO] Handle this error properly.
  }

};

