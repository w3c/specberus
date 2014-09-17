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
    ,   $skipValidation = $("#skipValidation")
    ,   $noRecTrack = $("#noRecTrack")
    ,   $informativeOnly = $("#informativeOnly")
    ,   $alert = $("#alert")
    ,   $results = $("#results")
    ,   $resultsBody = $results.find("table")
    ,   $progressContainer = $results.find(".panel-body")
    ,   $progress = $results.find(".progress-bar")
    ,   $progressStyler = $progress.parent()
    ,   $progressLabel = $progress.find(".sr-only")
    ,   socket = io.connect(location.protocol + "//" + location.host)
    ,   rows = {}
    ,   done = 0
    ,   total = 0
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
    function progress () {
        $progress.attr({
            "aria-valuenow":    done
        ,   "aria-valuemax":    total
        ,   "style":            "width: " + (total ? (done/total)*100 : 0) + "%"
        });
        $progressLabel.text(done + "/" + total + " done.");
    }

    // validate
    function validate (url, profile, skipValidation, noRecTrack, informativeOnly) {
        $resultsBody.find("tr:not(.h)").remove();
        socket.emit("validate", {
            url:                url
        ,   profile:            profile
        ,   skipValidation:     skipValidation
        ,   noRecTrack:         noRecTrack
        ,   informativeOnly:    informativeOnly
        });
    }
    
    // terminate validation
    function endValidation () {
        $progressContainer.hide();
    }
    
    // handle results
    function row (id) {
        if (rows[id]) return rows[id];
        rows[id] =  $("<tr><td class='status'></td><td class='test'></td><td class='results'></td></tr>")
                        .find(".test")
                            .text(id)
                        .end()
                        .appendTo($resultsBody)
        ;
        return rows[id];
    }
    var type2class = {
        error:      "text-danger"
    ,   warning:    "text-warning"
    ,   info:       "text-info"
    };
    var type2bgclass = {
        error:      "bg-danger"
    ,   warning:    "bg-warning"
    ,   info:       "bg-info"
    };
    function addMessage ($row, type, msg) {
        var $ul = $row.find("ul." + type);
        if (!$ul.length) $ul = $("<ul></ul>").addClass(type).appendTo($row.find(".results"));
        $('<span class="' + type2bgclass[type] + '">' + type + '</span> ').prependTo($("<li></li>")
            .addClass(type2class[type])
            .text(' ' + msg)
            .appendTo($ul));
    }
    
    // protocol
    socket.on("exception", function (data) {
        console.log("exception", data);
        showError("Exception: " + data.message);
        endValidation();
    });
    socket.on("start", function (data) {
        console.log("start", data);
        rows = {};
        for (var i = 0, n = data.rules.length; i < n; i++) row(data.rules[i]);
        done = 0;
        total = data.rules.length;
        $progressStyler.addClass("active progress-striped");
        $results.removeClass("hide").show();
        progress();
        $progressContainer.show();
    });
    socket.on("ok", function (data) {
        console.log("ok", data);
        row(data.name)
            .find(".status")
                .append("<span class='text-success'>\u2714 <span class='sr-only'>ok</span></span>")
            .end()
            .find(".results")
                .prepend("<span class='text-success'>Ok</span>")
            .end();
    });
    socket.on("warning", function (data) {
        console.log("warning", data);
        addMessage(row(data.name), "warning", data.message);
    });
    socket.on('info', function (data) {
        console.log('info', data);
        addMessage(row(data.name), 'info', data.message);
    });
    socket.on("error", function (data) {
        console.log("error", data);
        var $row = row(data.name);
        addMessage(row(data.name), "error", data.message);
        if (!$row.find(".status .text-danger").length) {
            $row
                .find(".status")
                    .append("<span class='text-danger'>\u2718 <span class='sr-only'>fail</span></span>")
                .end();
        }
    });
    socket.on("done", function (data) {
        console.log("done", data);
        done++;
        progress();
    });
    socket.on("finished", function () {
        console.log("END");
        $progressStyler.removeClass("active progress-striped");
        // endValidation();
    });

    // handle the form
    $("#options").submit(function () {
        var url = $url.val()
        ,   profile = $profile.val()
        ,   skipValidation = $skipValidation.is(":checked") || false
        ,   noRecTrack = $noRecTrack.is(":checked") || false
        ,   informativeOnly = $informativeOnly.is(":checked") || false
        ;
        if (!url) showError("Missing URL parameter.");
        if (!profile) showError("Missing profile parameter.");
        validate(url, profile, skipValidation, noRecTrack, informativeOnly);
        return false;
    });
    
}(jQuery));
