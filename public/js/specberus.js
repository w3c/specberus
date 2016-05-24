/**
 * @TODO Document.
 */

'use strict';

// TODO:
//  include socket.io
//  grab on submit and cancel, get values
//  client-side protocol
//  show errors

jQuery.extend({
    getQueryParameters : function(str) {
        return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = (n[1] === "true" || n[1] === "false") ? JSON.parse(n[1]) : n[1],this}.bind({}))[0];
    }
});

(function ($) {

    const MSG_ERROR = {ui: 'Error', bootstrap: 'danger'}
    ,   MSG_WARN = {ui: 'Warning', bootstrap: 'warning'}
    ,   MSG_INFO = {ui: 'Advice', bootstrap: 'info'}
    ;

    var $form = $("form#options")
    ,   $urlContainer = $("#urlContainer")
    ,   $url = $("#url")
    ,   profile
    ,   $profileContainer = $("#profileContainer")
    ,   $profile = $("#profile")
    ,   $profileOptions = $('#profile option')
    ,   $validation = $("#validation")
    ,   $noRecTrack = $("#noRecTrack")
    ,   $informativeOnly = $("#informativeOnly")
    ,   $echidnaReady = $("#echidnaReady")
    ,   $patentPolicy = $("#patentPolicy")
    ,   $processDocument = $("#processDocument")
    ,   $alert = $("#alert")
    ,   $results = $('#results')
    ,   $resultsBody = $results.find('.panel-body')
    ,   $resultsList = $results.find('.list-group')
    ,   $progressContainer = $("#progressBar")
    ,   $progress = $progressContainer.find(".progress-bar")
    ,   $progressStyler = $progress.parent()
    ,   socket = io(location.protocol + "//" + location.host, {path: '/' + 'socket.io'})
    ,   done = 0
    ,   result = {errors: [], warnings: [], infos: []}
    ,   total = 0
    ,   summary = {}
    ,   icons = {done: '\u2714', info: '\u2714', warning: '\u2714', error: '\u2718'}
    ;

    // handshake
    socket.on("handshake", function (data) {
        console.log("Using version", data.version);
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

    // clear errors
    function clearError () {
        $('.alert.alert-danger').filter(":not('.hide')")
                   .remove();
    }

    // validate
    function validate (options) {
        $resultsBody.find("tr:not(.h)").remove();
        profile = options.profile;
        socket.emit("validate", {
            url:                decodeURIComponent(options.url)
        ,   profile:            profile
        ,   validation:         options.validation
        ,   noRecTrack:         (true === options.noRecTrack)
        ,   informativeOnly:    (true === options.informativeOnly)
        ,   echidnaReady:       (true === options.echidnaReady)
        ,   patentPolicy:       options.patentPolicy
        ,   processDocument:    options.processDocument
        });
    }

    // extractMetadata
    function extractMetadata (url) {
        socket.emit("extractMetadata", {
            url: decodeURIComponent(url)
        });
    }

    // terminate validation
    function endValidation () {
        $progressContainer.hide();
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

    function addMessage (type, data) {
        const url = $url.val();
        var inContext = ''
        ,   issue
        ;
        if (data && data.id)
            inContext = `<a href="doc/rules?profile=${profile}#${data.id}">See rule in context</a> <br>`;
        if (data && data.name)
            issue = `<a href="https://github.com/w3c/specberus/issues/new?` +
                `title=Bug%20in%20rule%20%E2%80%9C${data.name}%E2%80%9D:%20[WHAT]&` +
                `body=[EXPLANATION]%0A%0AFound%20[while%20checking%20\`${url}\`](${encodeURIComponent(window.location)}).&` +
                `labels=from-template` +
                `">Report a bug</a>`;
        else
            issue = `<a href="https://github.com/w3c/specberus/issues/new?` +
                `title=Bug%20in%20rules:%20[WHAT]&` +
                `body=[EXPLANATION]%0A%0AFound%20[while%20checking%20\`${url}\`](${encodeURIComponent(window.location)}).&` +
                `labels=from-template` +
                `">Report a bug</a>`;
        var item = `<li class="list-group-item alert alert-${type.bootstrap}">
            <label class="pull-left label label-${type.bootstrap}">${type.ui}</label>
            <div class="detailed pull-right"><small> ${inContext} ${issue} </small></div>
            ${data.message}
        </li>`;
        if (MSG_ERROR === type) result.errors.push(item);
        else if (MSG_WARN === type) result.warnings.push(item);
        else if (MSG_INFO === type) result.infos.push(item);
    }

    function toggleManual(toggle) {
        $form.toggleClass('manual', toggle);
        $urlContainer.toggleClass('col-sm-4', !toggle);
        $urlContainer.toggleClass('col-sm-5', toggle);
        $profileContainer.toggleClass('col-sm-4 col-md-4 col-lg-4', !toggle);
        $profileContainer.toggleClass('col-sm-5 col-md-5 col-lg-5', toggle);
    }

    // protocol
    socket.on("exception", function (data) {
        console.log("exception", data);
        showError("Exception: " + data.message);
        endValidation();
    });
    socket.on("start", function (data) {
        done = 0;
        result = {errors: [], warnings: [], infos: []};
        total = data.rules.length;
        $progressStyler.addClass("active progress-striped");
        $progressContainer.fadeIn();
        $results.hide();
        resetSummary();
    });
    socket.on('err', function (data) {
        addMessage(MSG_ERROR, data);
    });
    socket.on('warning', function (data) {
        addMessage(MSG_WARN, data);
    });
    socket.on('info', function (data) {
        addMessage(MSG_INFO, data);
    });
    socket.on("done", function (data) {
        done++;
        $progress.attr({
            "aria-valuenow":    done
        ,   "aria-valuemax":    total
        ,   "style":            "width: " + (total ? (done/total)*100 : 0) + "%"
        });
        $progress.text(done + '/' + total);
    });
    socket.on("finished", function () {
        console.log("END");
        $results.fadeIn();
        $progressStyler.removeClass("active progress-striped");
        $progressContainer.hide();
        $progress.text('Done!');
        showResults();
    });
    socket.on("finishedExtraction", function (data) {
      toggleManual(true);
      var processDocument = (data.processdocument && data.processDocument.indexOf('Process-20051014') > -1) ? "2005" : "2015";
      profile = data.profile;
      $profile.val(profile);
      $processDocument.find("label#2005").toggleClass("active", (processDocument === "2005"));
      $processDocument.find("label#2015").toggleClass("active", (processDocument === "2015"));
      $noRecTrack.prop('checked', !data.rectrack);
      $informativeOnly.prop('checked', data.informative);
      // $validation.val('simple-validation');
      var validation = 'simple-validation';
      $validation.find("label").removeClass('active');
      $validation.find('label#simple-validation').addClass('active');
      var options = {
                        "url"             : data.url
                      , "profile"         : profile
                      , "validation"      : 'simple-validation'
                      , "noRecTrack"      : !data.rectrack || false
                      , "informativeOnly" : data.informative || false
                      , "echidnaReady"    : false
                      , "patentPolicy"    : "pp2004"
                      , "processDocument" : processDocument
                    };
      validate(options);
      var newurl = document.URL.split('?')[0] + "?" + $.param(options)
      history.pushState(options, url + " - " + profile, newurl);
    });

    // handle the form
    $form.submit(function () {
        clearError();
        if ($profile.val() === "auto") {
            extractMetadata($url.val());
        } else {
            var url = $url.val()
            ,   validation = $validation.find('label.active').attr('id')
            ,   noRecTrack = $noRecTrack.is(":checked") || false
            ,   informativeOnly = $informativeOnly.is(":checked") || false
            ,   echidnaReady = $echidnaReady.is(":checked") || false
            ,   patentPolicy = $patentPolicy.find('label.active').attr('id')
            ,   processDocument = $processDocument.find('label.active').attr('id')
            ;
            profile = $profile.val();
            if (!url) showError("Missing URL parameter.");
            if (!profile) showError("Missing profile parameter.");
            if (echidnaReady) profile += '-Echidna';
            var options = {
                              "url"             : url
                            , "profile"         : profile
                            , "validation"      : validation
                            , "noRecTrack"      : noRecTrack
                            , "informativeOnly" : informativeOnly
                            , "echidnaReady"    : echidnaReady
                            , "patentPolicy"    : patentPolicy
                            , "processDocument" : processDocument
                          };
            validate(options);
            var newurl = document.URL.split('?')[0] + "?" + $.param(options)
            history.pushState(options, url + " - " + profile, newurl);
        }
        return false;
    });

    function resetSummary() {
        summary = {};
    }

    // function updateSummary(data, level) {
    //
    //   var levels = {done: 0, info: 1, warning: 2, error: 3};
    //
    //   var id
    //   ,   status
    //   ;
    //
    //   if(data && data.name) {
    //     id = data.name.split('.')[0];
    //
    //     if(summary.hasOwnProperty(id)) {
    //       status = summary[id];
    //     }
    //     else {
    //       status = {current: -1, count: 0};
    //       summary[id] = status;
    //     }
    //
    //     if(levels[level] > status['current']) {
    //       summary[id]['current'] = levels[level];
    //     }
    //
    //     if(levels[level] > 2) {
    //       summary[id]['count'] = summary[id]['count'] + 1;
    //     }
    //
    //   }
    //
    // }

    function disableProfilesIfNeeded(checkbox) {
        if (checkbox.prop('checked')) {
            $profileOptions.each(function (_, el) {
                if ($(el).val() !== 'WD' && $(el).val() !== 'WG-NOTE')
                  $(el).prop('disabled', true);
            });
            if ($profile.val() !== 'WD' && $profile.val() !== 'WG-NOTE')
              $profile.val('');
        }
        else $profileOptions.each(function (_, el) {
            if ($(el).val() !== '') $(el).prop('disabled', false);
        });
    }

    function disableProcessIfNeeded(profileElement) {
        var isFPCR = (profileElement.val() === "FPCR");
        if (isFPCR) {
            $processDocument.find("label#2005").toggleClass("active", !isFPCR);
            $processDocument.find("label#2015").toggleClass("active", isFPCR);
        }
        $processDocument.find("label#2005").toggleClass("disabled", isFPCR);
    }

    function setFormParams(options) {
        // Option "echidnaReady" processed first, as it may restrict the list of enabled profiles.
        $echidnaReady.prop('checked', options.echidnaReady);
        if (options.url) $url.val(decodeURIComponent(options.url));
        // "profile" might be eg "WD-Echidna". Normalise.
        if (options.profile) {
          var newProfile = options.profile;
          if (newProfile.indexOf('-Echidna') > -1) {
            newProfile = newProfile.substring(0, newProfile.indexOf('-Echidna'));
          }
          $profile.find('option[value=' + newProfile + ']').prop('selected', true);
          disableProcessIfNeeded($profile);
        }
        if (options.validation) $validation.val(options.validation);
        $noRecTrack.prop('checked', options.noRecTrack);
        $informativeOnly.prop('checked', options.informativeOnly);
        if (options.processDocument) {
          $processDocument.find('label').removeClass('active');
          $processDocument.find('label#' + options.processDocument).addClass('active');
        }
        if (options.patentPolicy) {
          $patentPolicy.find('label').removeClass('active');
          $patentPolicy.find('label#' + options.patentPolicy).addClass('active');
        }
    }

    const countNicely = function(term, no) {
        if (0 === no)
            return 'No ' + term + 's';
        else if (1 === no)
            return 'One ' + term;
        else
            return no + ' ' + term + 's';
    };

    function showResults() {
        var message;
        if (result.errors.length > 0) {
            message = `<span class="icon red pull-left">&#10007;</span>`;
            if (result.warnings.length > 0)
                message += `<h4>${countNicely('error', result.errors.length)} (and ${countNicely('warning', result.warnings.length)})</h4>`;
            else
                message += `<h4>${countNicely('error', result.errors.length)}</h4>`;
        }
        else {
            if (result.warnings.length > 0)
                message = `<span class="icon amber pull-left">&#10003;</span>
                    <h4>All tests passed, but you are strongly encouraged to address
                    ${countNicely('warning', result.warnings.length).toLowerCase()} before publishing.</h4>`;
            else
                message = `<span class="icon green pull-left">&#10003;</span>
                    <h4>OK!</h4>`;
        }
        message += `<p class="details"><a href="doc/rules?profile=${profile}">${total} rules</a> were checked. Hover over the rows below for options.<p>`;
        $resultsBody.html(message);
        message = '';
        if (result.errors.length > 0 || result.warnings.length > 0 || result.infos.length > 0) {
            var i;
            for (i in result.errors) {
                message += result.errors[i];
            }
            for (i in result.warnings) {
                message += result.warnings[i];
            }
            for (i in result.infos) {
                message += result.infos[i];
            }
        }
        $resultsList.html(message);
    }

    window.addEventListener('popstate', function(event) {
        var options = event.state;
        if (options == null) return;
        setFormParams(options);
        validate(options);
    });

    $patentPolicy.find("label").on("click", function() {
        var isPP2002 = ($(this).attr("id") === "pp2002");
        $noRecTrack.prop("disabled", isPP2002);
        $informativeOnly.prop("disabled", isPP2002);
    });

    $profile.change(function() {
        toggleManual('auto' !== $(this).val());
        disableProcessIfNeeded($(this));
    });

    $echidnaReady.change(function () {
        disableProfilesIfNeeded($echidnaReady);
    });

    $(document).ready(function() {
        $.getJSON('/data/profiles.json', function(data) {
            $profile.append($('<option value="auto" selected="selected">Auto-detect</option>'));
            $.each(data.tracks, function(foo, track) {
                var optgroup = $('<optgroup label="' + track.name + '"></optgroup>');
                $.each(track.profiles, function(bar, profile) {
                    var option = $('<option value="' + profile.id + '">' + profile.id + '&nbsp;&mdash;&nbsp;' + profile.name + '</option>');
                    optgroup.append(option);
                });
                $profile.append(optgroup);
            });
            $profileOptions = $('#profile option');
            var options = $.getQueryParameters();
            setFormParams(options);
            toggleManual('auto' !== $profile.val());
            if (options.url && options.profile) {
              if (options.profile === "auto") {
                extractMetadata(options.url);
              } else {
                validate(options);
              }
            }
            $('[data-toggle="tooltip"]').tooltip();
            $url.select();
        });
    });

}(jQuery));
