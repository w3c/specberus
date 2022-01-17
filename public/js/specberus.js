'use strict';

/* globals io, url */

/**
 * @TODO Document.
 */

// TODO:
//  grab on submit and cancel, get values
//  client-side protocol
//  show errors

jQuery.extend({
    getQueryParameters(str) {
        return (str || document.location.search)
            .replace(/(^\?)/, '')
            .split('&')
            .map(
                function (n) {
                    // eslint-disable-next-line no-return-assign
                    return (
                        (n = n.split('=')),
                        (this[n[0]] =
                            n[1] === 'true' || n[1] === 'false'
                                ? JSON.parse(n[1])
                                : n[1]),
                        this
                    );
                }.bind({})
            )[0];
    },
});

(function ($) {
    const MSG_EXCEPTION = { ui: 'Bug', bootstrap: 'danger' };
    const MSG_ERROR = { ui: 'Error', bootstrap: 'danger' };
    const MSG_WARN = { ui: 'Warning', bootstrap: 'warning' };
    const MSG_INFO = { ui: 'Advice', bootstrap: 'info' };
    const $form = $('form#options');
    const $urlContainer = $('#urlContainer');
    const $url = $('#url');
    let profile;
    const $profileContainer = $('#profileContainer');
    const $profile = $('#profile');
    let $profileOptions = $('#profile option');
    const $validation = $('#validation');
    const $informativeOnly = $('#informativeOnly');
    const $echidnaReady = $('#echidnaReady');
    const $patentPolicy = $('#patentPolicy');
    const $results = $('#results');
    const $resultsBody = $results.find('.panel-body');
    const $resultsList = $results.find('.list-group');
    const $progressContainer = $('#progressBar');
    const $progress = $progressContainer.find('.progress-bar');
    const $progressStyler = $progress.parent();
    const baseURI = `${document.location.pathname}/`.replace(/\/+$/, '/');
    const socket = io(
        `${document.location.protocol}//${document.location.host}`,
        {
            path: `${baseURI}socket.io`,
        }
    );
    let done = 0;
    let result = { exceptions: [], errors: [], warnings: [], infos: [] };
    let total = 0;
    let running = false;
    // handshake
    socket.on('handshake', data => {
        console.log(`Handshake; using version “${data.version}”.`);

        socket.on('disconnect', () => {
            socket.close();
            toggleForm(false); // eslint-disable-line no-use-before-define
        });
    });

    function toggleForm(bool) {
        if (bool) {
            $('form').css('opacity', 1);
            $('form input, form select, form label')
                .removeClass('disabled')
                .removeAttr('disabled');
            $('button[type=submit]').fadeIn();
        } else {
            $('form').css('opacity', 0.333);
            $('form input, form select, form label')
                .addClass('disabled')
                .attr('disabled', 'disabled');
            $('button[type=submit]').hide();
        }
    }

    // validate
    function validate(options) {
        $resultsBody.empty();
        $resultsList.empty();
        profile = options.profile;
        socket.emit('validate', {
            url: decodeURIComponent(options.url),
            profile,
            validation: options.validation,
            informativeOnly: options.informativeOnly === true,
            echidnaReady: options.echidnaReady === true,
            patentPolicy: options.patentPolicy,
        });
    }

    // extractMetadata
    function extractMetadata(url) {
        socket.emit('extractMetadata', {
            url: decodeURIComponent(url),
        });
    }

    function addMessage(type, data) {
        const url = $url.val();
        let inContext = '';
        let issue;
        const exc = data && data.exception ? ' exception' : '';
        if (data && data.id) {
            // Corner case: if the profile is unknown, let's assume 'WD' (most common).
            const newProfile = profile
                ? profile.replace(/-echidna$/i, '')
                : 'WD';
            inContext = `<a href="doc/rules?profile=${newProfile}#${data.id}">See rule in context</a> <br>`;
        }
        if (data && data.name)
            issue =
                `<a href="https://github.com/w3c/specberus/issues/new?` +
                `title=Bug%20in%20rule%20%E2%80%9C${data.name}%E2%80%9D:%20[WHAT]&` +
                `body=[EXPLANATION]%0A%0AFound%20[while%20checking%20\`${encodeURIComponent(
                    url
                )}\`]` +
                `(${encodeURIComponent(window.location)}).&` +
                `labels=from-template` +
                `">Report a bug</a>`;
        else if (data && data.exception)
            issue =
                `<a href="https://github.com/w3c/specberus/issues/new?` +
                `title=Bug:%20[WHAT]&` +
                `body=[EXPLANATION]%0A%0AFound%20[while%20checking%20\`${encodeURIComponent(
                    url
                )}\`]` +
                `(${encodeURIComponent(window.location)}).&` +
                `labels=from-template` +
                `">Report a bug</a>`;
        else
            issue =
                `<a href="https://github.com/w3c/specberus/issues/new?` +
                `title=Bug%20in%20rules:%20[WHAT]&` +
                `body=[EXPLANATION]%0A%0AFound%20[while%20checking%20\`${encodeURIComponent(
                    url
                )}\`]` +
                `(${encodeURIComponent(window.location)}).&` +
                `labels=from-template` +
                `">Report a bug</a>`;
        const item = `<li class="list-group-item alert alert-${type.bootstrap}${exc}">
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

    function countNicely(term, no) {
        if (no === 0) return `No ${term}s`;
        if (no === 1) return `One ${term}`;
        return `${no} ${term}s`;
    }

    function showResults() {
        toggleForm(true);
        running = false;
        $results.fadeIn();
        $progressStyler.removeClass('active progress-striped');
        $progressContainer.hide();
        $progress.text('');
        $progress.attr('style', '0');
        let message;
        const metadataURL = `${baseURI}api/metadata?url=${encodeURIComponent(
            url.value
        )}`;
        if (result.errors.length > 0 || result.exceptions.length > 0) {
            message = `<span class="icon red pull-left">&#10007;</span>`;
            if (result.warnings.length > 0)
                message += `<h4>${countNicely(
                    'error',
                    result.exceptions.length + result.errors.length
                )}
                    (and ${countNicely(
                        'warning',
                        result.warnings.length
                    )})</h4>`;
            else
                message += `<h4>${countNicely(
                    'error',
                    result.exceptions.length + result.errors.length
                )}</h4>`;
        } else if (result.warnings.length > 0)
            message = `<span class="icon amber pull-left">&#10003;</span>
                    <h4>All tests passed, but you are strongly encouraged to address
                    ${countNicely(
                        'warning',
                        result.warnings.length
                    ).toLowerCase()} before publishing.</h4>`;
        else
            message = `<span class="icon green pull-left">&#10003;</span>
                    <h4>OK!</h4>`;
        message += `<p class="details">`;
        if (total > 0 && profile)
            message += `<a href="doc/rules?profile=${profile}">${total} rules</a> were checked. `;
        message += `Hover over the rows below for options.<br />`;
        message += `Tip: review the <a href="${metadataURL}">metadata that was inferred from the document</a> to make sure that there are no errors.`;
        message += '</p>';
        $resultsBody.html(message);
        message = '';
        if (
            result.exceptions.length > 0 ||
            result.errors.length > 0 ||
            result.warnings.length > 0 ||
            result.infos.length > 0
        ) {
            let i;
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

    socket.on('exception', data => {
        const message = data.message ? data.message : data;
        addMessage(MSG_EXCEPTION, {
            message: `<div class="message">${message}</div>`,
            exception: true,
        });
        window.setTimeout(showResults, 1000);
    });

    socket.on('start', data => {
        done = 0;
        total = data.rules.length;
        $progressStyler.addClass('active progress-striped');
        $progressContainer.fadeIn();
        $results.hide();
    });
    socket.on('err', data => {
        addMessage(MSG_ERROR, data);
    });
    socket.on('warning', data => {
        addMessage(MSG_WARN, data);
    });
    socket.on('info', data => {
        addMessage(MSG_INFO, data);
    });
    socket.on('done', () => {
        done += 1;
        $progress.attr({
            'aria-valuenow': done,
            'aria-valuemax': total,
            style: `width: ${total ? (done / total) * 100 : 0}%`,
        });
        $progress.text(`${done}/${total}`);
    });
    socket.on('finished', () => {
        showResults();
    });
    socket.on('finishedExtraction', data => {
        if (
            data &&
            data.success &&
            data.errors &&
            data.errors.length === 0 &&
            data.metadata &&
            data.metadata.profile
        ) {
            if (data.warnings && data.warnings.length > 0)
                for (const w in data.warnings) addMessage(MSG_WARN, w);
            toggleManual(true);

            profile = data.metadata.profile;
            $profile.val(profile);
            $informativeOnly.prop('checked', data.metadata.informative);
            $validation.find('label').removeClass('active');
            $validation.find('label#simple-validation').addClass('active');
            let patentPolicy;
            if (data.metadata.patentPolicy) {
                if (
                    data.metadata.patentPolicy ===
                    'https://www.w3.org/Consortium/Patent-Policy-20170801/'
                ) {
                    patentPolicy = 'pp2004';
                } else if (
                    data.metadata.patentPolicy ===
                    'https://www.w3.org/Consortium/Patent-Policy-20200915/'
                ) {
                    patentPolicy = 'pp2020';
                }
            }
            $patentPolicy.find('label').removeClass('active');
            $patentPolicy.find(`label#${patentPolicy}`).addClass('active');

            const options = {
                url: data.url,
                profile,
                validation: 'simple-validation',
                informativeOnly: data.metadata.informative || false,
                echidnaReady: false,
                patentPolicy,
            };
            validate(options);
            const newUrl = `${document.URL.split('?')[0]}?${$.param(options)}`;
            window.history.pushState(options, `${url} - ${profile}`, newUrl);
        } else {
            // Deal with all possible errors:
            if (!data)
                addMessage(MSG_EXCEPTION, {
                    message: `<div class="message">An unknown error occurred while extracting metadata from the document.</div>`,
                });
            else if (!data.errors || data.errors.length === 0) {
                // If there were errors at all, those were shown to the user already; no need to add more here.
                if (!data.metadata || !data.metadata.profile)
                    addMessage(MSG_ERROR, {
                        message: `<div class="message">Metadata extraction could not infer a profile for the document.</div>`,
                    });
                else if (!data.success)
                    addMessage(MSG_EXCEPTION, {
                        message: `<div class="message">An unknown error occurred while extracting metadata from the document.</div>`,
                    });
            }
            window.setTimeout(showResults, 1000);
        }
    });

    $form.submit(event => {
        if (running) {
            if (event) event.preventDefault();
            return;
        }
        running = true;
        toggleForm(false);
        $resultsBody.empty();
        $resultsList.empty();
        result = { exceptions: [], errors: [], warnings: [], infos: [] };
        if ($profile.val() === 'auto') {
            extractMetadata($url.val());
        } else {
            const url = $url.val();
            const validation = $validation.find('label.active').attr('id');
            const informativeOnly = $informativeOnly.is(':checked') || false;
            const echidnaReady = $echidnaReady.is(':checked') || false;
            const patentPolicy = $patentPolicy.find('label.active').attr('id');
            profile = $profile.val();
            if (!url)
                addMessage(MSG_ERROR, { message: 'Missing “URL” parameter' });
            if (!profile)
                addMessage(MSG_ERROR, {
                    message: 'Missing “profile” parameter',
                });
            if (echidnaReady) profile += '-Echidna';
            const options = {
                url,
                profile,
                validation,
                informativeOnly,
                echidnaReady,
                patentPolicy,
            };
            validate(options);
            const newUrl = `${document.URL.split('?')[0]}?${$.param(options)}`;
            window.history.pushState(options, `${url} - ${profile}`, newUrl);
        }
        return false;
    });

    function disableProfilesIfNeeded(checkbox) {
        if (checkbox.prop('checked')) {
            $profileOptions.each((_, el) => {
                if (!['WD', 'NOTE', 'DNOTE', 'CR', 'CRD'].includes($(el).val()))
                    $(el).prop('disabled', true);
            });
            if (!['WD', 'NOTE', 'DNOTE', 'CR', 'CRD'].includes($profile.val()))
                $profile.val('');
        } else
            $profileOptions.each((_, el) => {
                if ($(el).val() !== '') $(el).prop('disabled', false);
            });
    }

    function setFormParams(options) {
        // Option "echidnaReady" processed first, as it may restrict the list of enabled profiles.
        $echidnaReady.prop('checked', options.echidnaReady);
        if (options.url) $url.val(decodeURIComponent(options.url));
        // "profile" might be eg "WD-Echidna". Normalise.
        if (options.profile) {
            const newProfile = options.profile.replace(/-echidna$/i, '');
            $profile.find(`option[value=${newProfile}]`).prop('selected', true);
        }
        if (options.validation) {
            $validation.find(`label#${options.validation}`).addClass('active');
            $validation
                .find(`:not(label#${options.validation})`)
                .removeClass('active');
        }
        $informativeOnly.prop('checked', options.informativeOnly);
        $patentPolicy.find('label').removeClass('active');
        if (options.patentPolicy) {
            $patentPolicy
                .find(`label#${options.patentPolicy}`)
                .addClass('active');
        } else {
            $patentPolicy.find(`label#pp2020`).addClass('active');
        }
    }

    window.addEventListener('popstate', event => {
        const options = event.state;
        if (options === null) return;
        setFormParams(options);
        validate(options);
    });

    $profile.change(function () {
        toggleManual($(this).val() !== 'auto');
    });

    $echidnaReady.change(() => {
        disableProfilesIfNeeded($echidnaReady);
    });

    $(document).ready(() => {
        $profileOptions = $('#profile option');
        const options = $.getQueryParameters();
        setFormParams(options);
        toggleManual($profile.val() !== 'auto');
        if (options.url && options.profile) $('form').submit();
        $('[data-toggle="tooltip"]').tooltip();
        $url.select();
    });
})(jQuery);
