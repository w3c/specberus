
var fs = require("fs")
,   vm = require("vm")
,   pth = require("path")
,   jqPath = pth.join(__dirname, "..", "bower_components/jquery/jquery.js")
;

exports.loadJQuery = function () {
    var src = fs.readFileSync(jqPath)
    ,   doc = {
            createElement:  function () {}
        ,   documentElement:    null
        }
    ,   win = { document: doc }
    ,   sandbox = {
            window: win
        ,   document: doc
        }
    ,   context = vm.createContext(sandbox)
    ;
    vm.runInContext(src, context, jqPath);
    console.log(win);
    return win.jQuery;
};
