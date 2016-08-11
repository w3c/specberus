/**
 * @TODO Document.
 */

/* globals jQuery: false, document: false, io: false, location: false, console: false, window: false, history: false, url: false */

// TODO:
//  grab on submit and cancel, get values
//  client-side protocol
//  show errors

jQuery.extend({
    getQueryParameters : function(str) {
        return (str || document.location.search)
            .replace(/(^\?)/,'')
            .split("&")
            .map(function(n){
                return n = n.split("="), this[n[0]] = (n[1] === "true" || n[1] === "false") ? JSON.parse(n[1]) : n[1], this;
            }
            .bind({}))[0];
    }
});

(function ($) {

    const MSG_EXCEPTION = {ui: 'Bug', bootstrap: 'danger'}
    ,   MSG_ERROR = {ui: 'Error', bootstrap: 'danger'}
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
    ,   $results = $('#results')
    ,   $resultsBody = $results.find('.panel-body')
    ,   $resultsList = $results.find('.list-group')
    ,   $progressContainer = $("#progressBar")
    ,   $progress = $progressContainer.find(".progress-bar")
    ,   $progressStyler = $progress.parent()
    ,   baseURI = (location.pathname + '/').replace(/\/+$/, '/')
    ,   socket = io(location.protocol + "//" + location.host, {path: baseURI + 'socket.io'})
    ,   done = 0
    ,   result = {exceptions: [], errors: [], warnings: [], infos: []}
    ,   total = 0
    ,   running = false
    ;

    // handshake
    socket.on("handshake", function (data) {
        console.log(`Handshake; using version “${data.version}”.`);
    });

    const toggleForm = function (bool) {
        if (bool) {
            $('form').css('opacity', 1);
            $('form input, form select, form label').removeClass('disabled').removeAttr('disabled');
            $('button[type=submit]').text('Check');
        } else {
            $('form').css('opacity', 0.333);
            $('form input, form select, form label').addClass('disabled').attr('disabled', 'disabled');
            $('button[type=submit]').text('Wait…');
        }
    };

    // validate
    function validate (options) {
        $resultsBody.empty();
        $resultsList.empty();
        profile = options.profile;
        socket.emit("validate", {
            url:                decodeURIComponent(options.url)
        ,   profile:            profile
        ,   validation:         options.validation
        ,   noRecTrack:         (true === options.noRecTrack)
        ,   informativeOnly:    (true === options.informativeOnly)
        ,   echidnaReady:       (true === options.echidnaReady)
        ,   patentPolicy:       options.patentPolicy
        });
    }

    // extractMetadata
    function extractMetadata (url) {
        socket.emit("extractMetadata", {
            url: decodeURIComponent(url)
        });
    }

    function addMessage (type, data) {
        const url = $url.val();
        var inContext = ''
        ,   issue
        ,   exc = (data && data.exception) ? ' exception' : ''
        ;
        if (data && data.id) {
            const newProfile = profile.replace(/\-echidna$/i, '');
            inContext = `<a href="doc/rules?profile=${newProfile}#${data.id}">See rule in context</a> <br>`;
        }
        if (data && data.name)
            issue = `<a href="https://github.com/w3c/specberus/issues/new?` +
                `title=Bug%20in%20rule%20%E2%80%9C${data.name}%E2%80%9D:%20[WHAT]&` +
                `body=[EXPLANATION]%0A%0AFound%20[while%20checking%20\`${url}\`](${encodeURIComponent(window.location)}).&` +
                `labels=from-template` +
                `">Report a bug</a>`;
        else if (data && data.exception)
            issue = `<a href="https://github.com/w3c/specberus/issues/new?` +
                `title=Bug:%20[WHAT]&` +
                `body=[EXPLANATION]%0A%0AFound%20[while%20checking%20\`${url}\`](${encodeURIComponent(window.location)}).&` +
                `labels=from-template` +
                `">Report a bug</a>`;
        else
            issue = `<a href="https://github.com/w3c/specberus/issues/new?` +
                `title=Bug%20in%20rules:%20[WHAT]&` +
                `body=[EXPLANATION]%0A%0AFound%20[while%20checking%20\`${url}\`](${encodeURIComponent(window.location)}).&` +
                `labels=from-template` +
                `">Report a bug</a>`;
        var item = `<li class="list-group-item alert alert-${type.bootstrap}${exc}">
            <label class="pull-left label label-${type.bootstrap}">${type.ui}</label>
            <div class="detailed pull-right"><small> ${inContext} ${issue} </small></div>
            ${data.message}
        </li>`;
        if (MSG_EXCEPTION === type) result.exceptions.push(item);
        else if (MSG_ERROR === type) result.errors.push(item);
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

    socket.on("exception", function (data) {
        const message = data.message ? data.message : data;
        addMessage(MSG_EXCEPTION, {message: `<div class="message">${message}</div>`, exception: true});
        window.setTimeout(showResults, 1000);
    });

    socket.on("start", function (data) {
        console.log('Started.');
        done = 0;
        result = {exceptions: [], errors: [], warnings: [], infos: []};
        total = data.rules.length;
        $progressStyler.addClass("active progress-striped");
        $progressContainer.fadeIn();
        $results.hide();
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
    socket.on("done", function () {
        done++;
        $progress.attr({
            "aria-valuenow":    done
        ,   "aria-valuemax":    total
        ,   "style":            "width: " + (total ? (done/total)*100 : 0) + "%"
        });
        $progress.text(done + '/' + total);
    });
    socket.on("finished", function () {
        console.log('Finished.');
        showResults();
    });
    socket.on("finishedExtraction", function (data) {
        if (!data || !data.metadata || !data.metadata.profile) {
            addMessage(MSG_EXCEPTION, {message: `<div class="message">Metadata extraction could not infer a profile for the document.</div>`});
            window.setTimeout(showResults, 1000);
        }
        else {
            toggleManual(true);
            profile = data.metadata.profile;
            $profile.val(profile);
            $noRecTrack.prop('checked', !data.metadata.rectrack);
            $informativeOnly.prop('checked', data.metadata.informative);
            $validation.find("label").removeClass('active');
            $validation.find('label#simple-validation').addClass('active');
            var options = {
                              "url"             : data.url
                            , "profile"         : profile
                            , "validation"      : 'simple-validation'
                            , "noRecTrack"      : !data.metadata.rectrack || false
                            , "informativeOnly" : data.metadata.informative || false
                            , "echidnaReady"    : false
                            , "patentPolicy"    : "pp2004"
                          };
            validate(options);
            var newurl = document.URL.split('?')[0] + "?" + $.param(options);
            history.pushState(options, url + " - " + profile, newurl);
        }
    });

    $form.submit(function (event) {
        if (running) {
            if (event)
                event.preventDefault();
            return;
        }
        running = true;
        toggleForm(false);
        $resultsBody.empty();
        $resultsList.empty();
        result = {exceptions: [], errors: [], warnings: [], infos: []};
        if ($profile.val() === "auto") {
            extractMetadata($url.val());
        } else {
            var url = $url.val()
            ,   validation = $validation.find('label.active').attr('id')
            ,   noRecTrack = $noRecTrack.is(":checked") || false
            ,   informativeOnly = $informativeOnly.is(":checked") || false
            ,   echidnaReady = $echidnaReady.is(":checked") || false
            ,   patentPolicy = $patentPolicy.find('label.active').attr('id')
            ;
            profile = $profile.val();
            if (!url) addMessage(MSG_ERROR, 'Missing “URL” parameer');
            if (!profile) addMessage(MSG_ERROR, 'Missing “profile” parameter');
            if (echidnaReady) profile += '-Echidna';
            var options = {
                              "url"             : url
                            , "profile"         : profile
                            , "validation"      : validation
                            , "noRecTrack"      : noRecTrack
                            , "informativeOnly" : informativeOnly
                            , "echidnaReady"    : echidnaReady
                            , "patentPolicy"    : patentPolicy
                          };
            validate(options);
            var newurl = document.URL.split('?')[0] + "?" + $.param(options);
            history.pushState(options, url + " - " + profile, newurl);
        }
        return false;
    });

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

    function setFormParams(options) {
        // Option "echidnaReady" processed first, as it may restrict the list of enabled profiles.
        $echidnaReady.prop('checked', options.echidnaReady);
        if (options.url) $url.val(decodeURIComponent(options.url));
        // "profile" might be eg "WD-Echidna". Normalise.
        if (options.profile) {
          const newProfile = options.profile.replace(/\-echidna$/i, '');
          $profile.find('option[value=' + newProfile + ']').prop('selected', true);
        }
        if (options.validation) {
          $validation.find('label#' + options.validation).addClass('active');
          $validation.find(':not(label#' + options.validation + ')').removeClass('active');
        }
        $noRecTrack.prop('checked', options.noRecTrack);
        $informativeOnly.prop('checked', options.informativeOnly);
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
        toggleForm(true);
        running = false;
        $results.fadeIn();
        $progressStyler.removeClass("active progress-striped");
        $progressContainer.hide();
        $progress.text('');
        $progress.attr('style', '0');
        var message;
        if (result.errors.length > 0 || result.exceptions.length > 0) {
            message = `<span class="icon red pull-left">&#10007;</span>`;
            if (result.warnings.length > 0)
                message += `<h4>${countNicely('error', result.exceptions.length + result.errors.length)}
                    (and ${countNicely('warning', result.warnings.length)})</h4>`;
            else
                message += `<h4>${countNicely('error', result.exceptions.length + result.errors.length)}</h4>`;
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
        message += `<p class="details">`;
        if (total > 0 && profile)
            message += `<a href="doc/rules?profile=${profile}">${total} rules</a> were checked. `;
        message += `Hover over the rows below for options.<p>`;
        $resultsBody.html(message);
        message = '';
        if (result.exceptions.length > 0 || result.errors.length > 0 || result.warnings.length > 0 || result.infos.length > 0) {
            var i;
            for (i in result.exceptions) {
                message += result.exceptions[i];
            }
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
        if (null === options) return;
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
    });

    $echidnaReady.change(function () {
        disableProfilesIfNeeded($echidnaReady);
    });

    $(document).ready(function() {
        $.getJSON(`${baseURI}data/profiles.json`, function(data) {
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
            if (options.url && options.profile)
                $('form').submit();
            $('[data-toggle="tooltip"]').tooltip();
            $url.select();
        });
    });

}(jQuery));
