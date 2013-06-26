(function ($, CoverPop, undefined) {

    'use strict';

    // set default settings
    var settings = {
            coverClass:          'CoverPop-cover',       // set default cover class
            fadeInDuration:      500,                    // time (in milliseconds) to fade in
            fadeOutDuration:     500,                    // time (in milliseconds) to fade out
            expires:             30,                     // duration (in days) before it pops up again
            closeClassNoDefault: 'CoverPop-close',       // close if someone clicks an element with this class and prevent default action
            closeClassDefault:   'CoverPop-close-go',    // close if someone clicks an element with this class and continue default action
            cookieName:          'CoverPop',             // to change the plugin cookie name
            onPopUpOpen:         function() {},          // on popup open / default is nothing
            onPopUpClose:        function() {},          // on popup close / default is nothing
            forceHash:           'splash',               // hash to append to url to force display of popup
            delayHash:           'go',                   // hash to append to url to delay popup for 1 day
            closeOnEscape:       true,                   // close if the user clicks escape
            info:                false                   // toggle console.log statements
        },

        el = {
            $html: $('html'),
            $cover: $('.' + settings.coverClass)
        },



        /* Private
        -------------------------------------------------------*/

        openCallback = function() {
            if (isFunction(settings.onPopUpOpen)) {
                settings.onPopUpOpen.call();
                shareInfo('CoverPop is open.');
            }
        },


        // close popup when user hits escape button
        onDocUp = function(e) {
            if (settings.closeOnEscape) {
                if (e.keyCode === 27) {
                    closePopUp();
                }
            }
        },


        closeCallback = function() {
            if (isFunction(settings.onPopUpClose)) {
                settings.onPopUpClose.call();
                shareInfo('CoverPop is closed.');
            }
        };




    /* Public
    -------------------------------------------------------*/

    CoverPop.openPopUp = function () {

        if (hashExists(settings.delayHash)) {
            setCookie(1);
            return;
        }

        el.$html.addClass('coverPop-open');
        el.$cover.fadeIn(settings.fadeInDuration, openCallback);

        // bind close events and prevent default event
        if ($('.' + settings.closeClassNoDefault).length) {
            $(document).on('click', '.' + settings.closeClassNoDefault, function(e) {
                e.preventDefault();
                CoverPop.closePopUp();
            });
        }

        // bind close events and continue with default event
        if ($('.' + settings.closeClassDefault).length) {
            $(document).on('click', '.' + settings.closeClassDefault, function() {
                CoverPop.closePopUp();
            });
        }

        // bind escape detection to document
        $(document).bind('keyup', onDocUp);
    };


    CoverPop.closePopUp = function() {

        el.$html.removeClass('CoverPop-open');
        el.$cover.fadeOut(settings.fadeOutDuration, closeCallback);

        setCookie(settings.expires);

        // unbind escape detection to document
        $(document).unbind('keyup', onDocUp);
    };


    CoverPop.init = function(options) {
        settings = $.extend(settings, options);

        // check if there is a cookie or hash before proceeding
        if (checkCookie(settings.cookieName) === false || hashExists(settings.forceHash) === true) {
            CoverPop.openPopUp();
        }

    };




    /* Helpers
    -------------------------------------------------------*/

    function isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }


    // for info and debugging
    function shareInfo(message) {
        if (window.console && window.console.log && settings.info) {
            window.console.log(message);
        }
    }


    function setCookie(days) {
        var date = new Date();
        date.setTime(+ date + (days * 86400000));
        document.cookie = settings.cookieName + '=true; expires=' + date.toGMTString() + '; path=/';
        shareInfo('Cookie ' + settings.cookieName + ' set for ' + days + ' days away.');
    }


    // check cookie exists and isn't expired
    function checkCookie(cookieName) {
        if (document.cookie.indexOf(cookieName) !== -1) {
            return true;
        }
        return false;
    }


    // check if there is a hash in the url
    function hashExists(hash) {
        if (window.location.hash.indexOf(hash) !== -1) {
            return true;
        }
        return false;
    }


}(jQuery, window.CoverPop = window.CoverPop || {}));