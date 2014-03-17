/**
 *
 * DFP Plugin to load ads
 * dfpgun.js
 * *******/

(function() {
    /**
     * object containing mapping of dfp unit id versus actual ad information.
     * @type {Object}
     */
    var adslotmap = {};

    var options = {};

    var adClassSelector = ".dfpgun";
    
    var triggeredAdClass = "dfpgunned";

    var log = function(msg) {
        console.log("dfpgun:" + (new Date().getTime()) + ":" + msg);
    };

    /**
     * Loads the google dfp library used to trigger the dfpads.
     * @method loadDFP
     */
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
                refresh(admap);
                admap["refreshed"] = true;
            }
        }
    };
    /**
     * Calls refresh on the adslot.
     * @method refresh
     * @param  {string} adunit [description]
     */
    var refresh = function(ad) {
        googletag.cmd.push(function() {
            log("refreshing ad");
            googletag.pubads().refresh([ad["slot"]]);
        });
    };

    var addInMap = function(adunit,element){
        adslotmap[adunit] = {};
        adslotmap[adunit]["callback"] = options.callback || undefined;
        adslotmap[adunit]["element"] = element;
        adslotmap[adunit]["forceRefresh"] = typeof(options.forceRefresh) !== "undefined" ? options.forceRefresh : false;
    };

    /**
     * Triggers the dfp ad with the specified dom element as the container.
     * @method triggerAd
     * @param  {ad}  object prepared with all the ad info.
     */
    var triggerAd = function(ad) {
        var adunit = ad.adunit,element = ad.element, slot, domid = "Ad_" + (parseInt(Math.random() * 100000,10)),
            sizes = ad.sizes;
        googletag = options.googletag || googletag;
        
        addInMap(adunit,element);

        log("dfploader:Triggering ad-" + adunit);
        element.empty().attr("id", domid).addClass(triggeredAdClass);
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
    var triggerAds = function(){
        var ads =[];
        $(adClassSelector).each(function(i,v){
            var id = $(v).attr("data-adunit");
            var size = $(v).attr("data-adsize");
            if(!id || !size){
                log("invalid parameters for ad,skipping");
            }else{
                size = size.split("x");
                if(size.length===2){
                    size[0] = parseInt(size[0],10);
                    size[1] = parseInt(size[1],10);
                    ads.push({
                        "adunit" : id,
                        "sizes" : size,
                        "element" : $(v)
                    });
                }else{
                    log("invalid parameters for ad,skipping");
                }
            }
        });
        $.each(ads,function(i,v){
            triggerAd(v);
        });
    };
    $.dfpgun  = function(params) {
        loadDFP();
        options = params || {};
        triggerAds();
    };
})($);