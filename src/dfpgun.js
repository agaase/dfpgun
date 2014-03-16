/**
 *
 * DFP Plugin to load ads
 * dfpgun.js
 * *******/

(function() {

    var adslotmap = {};


    var log = function(msg) {
        console.log("dfpgun:" + (new Date().getTime()) + ":" + msg);
    };

    var loadDFP = function() {
        var DFPLoaded;
        DFPLoaded = DFPLoaded || $('script[src*="gpt.js"]').length;
        if (DFPLoaded) {
            return;
        }
        window.googletag = window.googletag || {};
        window.googletag.cmd = window.googletag.cmd || [];

        var gads = document.createElement('script');
        gads.async = true;
        gads.type = 'text/javascript';

        //check for ad blocker
        gads.onerror = function() {
            console.log("There is an ad blocker");
        };

        var useSSL = 'https:' === document.location.protocol;
        gads.src = (useSSL ? 'https:' : 'http:') +
            '//www.googletagservices.com/tag/js/gpt.js';
        var node = document.getElementsByTagName('script')[0];
        node.parentNode.insertBefore(gads, node);

        //another ad block check
        if (gads.style.display === 'none') {
            console.log("There is an ad blocker");
        }
    };
    /**
     * The  googletag.debug_log.log function is hacked to have the below
     * function definition. Using this we can get the callback event when the ad was loaded.
     * @method loadedCallback
     * @param  {[type]}       level     [description]
     * @param  {[type]}       message   [description]
     * @param  {[type]}       service   [description]
     * @param  {[type]}       slot      [description]
     * @param  {[type]}       reference [description]
     * @return {[type]}
     */
    var loadedCallback = function(level, message, service, slot, reference) {
        if (message.getMessageId().toString() === "6") {
            var adid = message.getMessageArgs();
            log("ad loaded-" + adid);
            var admap = adslotmap[adid];
            var element = admap["element"];
            var callback = admap["callback"];
            if (callback) {
                log("callback called" + adid);
                callback(admap["element"]);
            }
            if (!admap["refreshed"] && !element.is(":visible") && admap["forceRefresh"]) {
                refresh(adid);
                admap["refreshed"] = true;
            }
        }
    };

    var refresh = function(adunit) {
        var admap = adslotmap[adunit];
        googletag.cmd.push(function() {
            log("refreshed-" + adunit);
            googletag.pubads().refresh([admap["slot"]]);
        });
    };

    var triggerAd = function(element, args) {
        var adunit = args.adunit,
            sizes = args.sizes;
        googletag = args.googletag || googletag;

        adslotmap[adunit] = {};

        adslotmap[adunit]["callback"] = args.callback || undefined;
        adslotmap[adunit]["element"] = element;
        adslotmap[adunit]["forceRefresh"] = typeof(args.forceRefresh) !== "undefined" ? args.forceRefresh : true;

        log("dfploader:Triggering ad-" + adunit);
        var slot;
        var domid = "Ad_" + (parseInt(Math.random() * 100000));
        element.empty().attr("id", domid);

        googletag.cmd.push(function() {
            googletag.debug_log.log = loadedCallback;
            googletag.pubads().collapseEmptyDivs(true);
            googletag.enableServices();
        });
        googletag.cmd.push(function() {
            slot = googletag.defineSlot(adunit, sizes, domid).addService(googletag.pubads());
            adslotmap[adunit]["slot"] = slot;
        });
        googletag.cmd.push(function() {
            googletag.display(domid);
        });
    };

    $.fn.dfpgun = function(args) {
        loadDFP();
        triggerAd($(this), args);
    };
})($);