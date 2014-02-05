/*global io*/

// TODO:
//  include socket.io
//  grab on submit and cancel, get values
//  client-side protocol
//  history API and reacting to the QS on load (and filling out form)
//  show errors

(function ($) {
    var $url = $("#url")
    ,   $profile = $("#profile")
    ,   $alert = $("#alert")
    ,   $results = $("#results")
    ,   $resultsBody = $results.find(".panel-body")
    ,   $progress = $results.find(".progress-bar")
    ,   $progressLabel = $progress.find(".sr-only")
    ,   socket = io.connect(location.protocol + "//" + location.host)
    ;
    
    // handshake
    socket.on("handshake", function (data) {
        console.log("Using version", data.version);
        $(".navbar-brand small").remove();
        $("<small></small>")
            .css({ fontSize: "0.5em", opacity: "0.5" })
            .text(" (" + data.version + ")")
            .appendTo($(".navbar-brand"))
            ;
    });

    // show errors
    function showError (string) {
        $alert.clone()
              .find("span")
                .text(string)
              .end()
              .removeClass("hide")
              .insertAfter($alert);
    }

    // show progress
    function progress (done, total) {
        $progress.attr({
            "aria-valuenow":    done
        ,   "aria-valuemax":    total
        ,   "style":            "width: " + ((done/total)*100) + "%"
        });
        $progressLabel.text(done + "/" + total + " done.");
    }

    // validate
    function validate (url, profile) {
        $resultsBody.empty();
        socket.emit("validate", {
            url:        url
        ,   profile:    profile
        });
    }
    
    // terminate validation
    function endValidation () {
        $progress.hide();
    }
    
    // protocol
    socket.on("exception", function (data) {
        showError("Exception:"); // XXX
        endValidation();
    });
    socket.on("start", function () {
        progress(0, 0);
        $progress.show();
    });
    socket.on("ok", function (data) {
        // XXX
        //  add row if not exist
        //  set it to ok (class, text)
    });
    socket.on("warning", function (data) {
        // XXX
        //  add row if not exist
        //  add a warning (class, text)
    });
    socket.on("error", function (data) {
        // XXX
        //  add row if not exist
        //  set it to error (class, text)
    });
    socket.on("done", function (data) {
        endValidation();
    });

    // handle the form
    $("#options").submit(function () {
        var url = $url.val()
        ,   profile = $profile.val()
        ;
        if (!url) showError("Missing URL parameter.");
        if (!profile) showError("Missing profile parameter.");
        validate(url, profile);
        return false;
    });
    
}(jQuery));
