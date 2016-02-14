function __cp_domReady(a) {
    /in/.test(document.readyState) ? setTimeout("__cp_domReady(" + a + ")", 9) : a()
}
document.getElementsByClassName || (document.getElementsByClassName = function(a) {
    var b, c, d, e = document,
        f = [];
    if (e.querySelectorAll) return e.querySelectorAll("." + a);
    if (e.evaluate) for (c = ".//*[contains(concat(' ', @class, ' '), ' " + a + " ')]", b = e.evaluate(c, e, null, 0, null); d = b.iterateNext();) f.push(d);
    else for (b = e.getElementsByTagName("*"), c = new RegExp("(^|\\s)" + a + "(\\s|$)"), d = 0; d < b.length; d++) c.test(b[d].className) && f.push(b[d]);
    return f
});
var CodePenEmbed = {
    width: "100%",
    init: function() {
        return window.__cp_embed_script_ran ? 0 : (window.__cp_embed_script_ran = !0, this.showCodePenEmbeds(), void this.listenToParentPostMessages())
    },
    showCodePenEmbeds: function() {
        for (var a = document.getElementsByClassName("codepen"), b = a.length - 1; b > -1; b--) {
            var c = this._getParamsFromAttributes(a[b]);
            if (c = this._convertOldDataAttributesToNewDataAttributes(c), c.user = this._findUsernameForURL(c, a[b]), this._paramsHasRequiredAttributes(c)) {
                var d = this._buildURL(c),
                    e = this._buildIFrame(c, d);
                this._addIFrameToPage(a[b], e)
            }
        }
    },
    _findUsernameForURL: function(a, b) {
        if ("string" == typeof a.user) return a.user;
        for (var c = 0, d = b.children.length; d > c; c++) {
            var e = b.children[c],
                f = e.href || "",
                g = f.match(/codepen\.(io|dev)\/(\w+)\/pen\//i);
            if (g) return g[2]
        }
        return "anon"
    },
    _paramsHasRequiredAttributes: function(a) {
        return a["slug-hash"]
    },
    _getParamsFromAttributes: function(a) {
        for (var b = {}, c = a.attributes, d = 0, e = c.length; e > d; d++) {
            var f = c[d].name;
            0 === f.indexOf("data-") && (b[f.replace("data-", "")] = c[d].value)
        }
        return b
    },
    _convertOldDataAttributesToNewDataAttributes: function(a) {
        return a.href && (a["slug-hash"] = a.href), a.type && (a["default-tab"] = a.type), a.safe && (a.animations = "true" === a.safe ? "run" : "stop-after-5"), a
    },
    _buildURL: function(a) {
        var b = this._getHost(a),
            c = a.user ? a.user : "anon",
            d = "?" + this._getGetParams(a),
            e = [b, c, "embed", a["slug-hash"] + d].join("/");
        return e.replace(/\/\//g, "//")
    },
    _getHost: function(a) {
        return a.host ? this._getSafeHost(a.host) : "file:" === document.location.protocol ? "http://codepen.io" : "//codepen.io"
    },
    _getSafeHost: function(a) {
        return a.match(/^\/\//) || !a.match(/http:/) ? document.location.protocol + "//" + a : a
    },
    _getGetParams: function(a) {
        var b = "";
        for (var c in a)"" !== b && (b += "&"), b += c + "=" + encodeURIComponent(a[c]);
        return b
    },
    _buildIFrame: function(a, b) {
        var c = "";
        "" !== a["class"] && (c = a["class"]);
        var d = {
            id: "cp_embed_" + a["slug-hash"].replace("/", "_"),
            src: b,
            scrolling: "no",
            frameborder: "0",
            height: this._getHeight(a),
            allowTransparency: "true",
            allowfullscreen: "true",
            "class": "cp_embed_iframe " + c,
            style: "width: " + this.width + "; overflow: hidden;"
        },
            e = "<iframe ";
        for (var f in d) e += f + '="' + d[f] + '" ';
        return e += "></iframe>"
    },
    _getHeight: function(a) {
        return a.height ? "auto" === a.height ? 300 : a.height : 300
    },
    _addIFrameToPage: function(a, b) {
        if (a.parentNode) {
            var c = document.createElement("div");
            c.innerHTML = b, a.parentNode.replaceChild(c, a)
        } else a.innerHTML = b
    },
    listenToParentPostMessages: function() {
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent",
            eventListener = window[eventMethod],
            messageEvent = "attachEvent" === eventMethod ? "onmessage" : "message";
        eventListener(messageEvent, function(e) {
            try {
                var dataObj = eval("(" + e.data + ")"),
                    iframe = document.getElementById("cp_embed_" + dataObj.hash);
                iframe && (iframe.height = dataObj.height)
            } catch (err) {}
        }, !1)
    }
};
__cp_domReady(function() {
    CodePenEmbed.init()
});
var addComment = {
    moveForm: function(a, b, c, d) {
        var e, f = this,
            g = f.I(a),
            h = f.I(c),
            i = f.I("cancel-comment-reply-link"),
            j = f.I("comment_parent"),
            k = f.I("comment_post_ID");
        if (g && h && i && j) {
            f.respondId = c, d = d || !1, f.I("wp-temp-form-div") || (e = document.createElement("div"), e.id = "wp-temp-form-div", e.style.display = "none", h.parentNode.insertBefore(e, h)), g.parentNode.insertBefore(h, g.nextSibling), k && d && (k.value = d), j.value = b, i.style.display = "", i.onclick = function() {
                var a = addComment,
                    b = a.I("wp-temp-form-div"),
                    c = a.I(a.respondId);
                return b && c ? (a.I("comment_parent").value = "0", b.parentNode.insertBefore(c, b), b.parentNode.removeChild(b), this.style.display = "none", this.onclick = null, !1) : void 0
            };
            try {
                f.I("comment").focus()
            } catch (l) {}
            return !1
        }
    },
    I: function(a) {
        return document.getElementById(a)
    }
},
    iec_config = {
        ajax_url: "https://www.smashingmagazine.com/wp-admin/admin-ajax.php?_wpnonce=82b4cc5680",
        slug: "inpsyde_extended_comments",
        l10n: {
            rate_this_comment: "Rate this comment",
            rate_up: "Vote up!",
            rate_down: "Vote down!"
        },
        selectors: {
            preview: "inpsyde_extended_comments_preview",
            rating: "inpsyde_extended_comments_rating",
            rate_wrapper: "inpsyde_extended_comments_rate_wrapper",
            rate: "inpsyde_extended_comments_rate",
            rate_stars: "inpsyde_extended_comments_rate_stars",
            write: "inpsyde_extended_comments_write",
            preview_container: "inpsyde_extended_comments_preview_container",
            preview_button: "inpsyde_extended_comments_preview_button",
            preview_wrapper: "inpsyde_extended_comments_preview_wrapper",
            edit: "inpsyde_extended_comments_edit"
        }
    },
    Inpsyde = Inpsyde || {};
if (function(a) {
    "use strict";

    function b(a) {
        c = a, d.apply(this)
    }
    var c = {},
        d = function() {
            var a, b = c.selectors,
                d = [],
                e = document.getElementsByClassName(b.rate_stars);
            d.push('<a class="rate_btn rate_btn_up" href="#" data-id="1" title="' + c.l10n.rate_up + '"></a>'), d.push('<a class="rate_btn rate_btn_down" href="#" data-id="-1" title="' + c.l10n.rate_down + '"></a>'), [].forEach.call(e, function(a) {
                a.innerHTML = d.join("\n")
            }), a = document.getElementsByClassName("rate_btn"), window.addEventListener ? [].forEach.call(a, function(a) {
                a.addEventListener("click", function(a) {
                    f(a)
                })
            }) : [].forEach.call(a, function(a) {
                a.attachEvent("click", function(a) {
                    f(a)
                })
            });
            var f = function(a) {
                    a.preventDefault();
                    var b, d, e = a.target ? a.target : a.srcElement,
                        f = e.parentNode,
                        g = f.getAttribute("data-comment_id"),
                        h = f.getAttribute("data-action"),
                        i = e.getAttribute("data-id"),
                        j = document.getElementById(h + "_" + g),
                        k = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
                    if (g && h && i) {
                        d = c.ajax_url + "&action=" + h, k.open("POST", d, !0), k.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), k.onreadystatechange = function() {
                            if (4 == k.readyState && 200 == k.status) {
                                var a = JSON.parse(k.responseText);
                                if (f.innerHTML = '<p class="' + c.slug + '_alert">' + a.message + "</p>", a.karma) {
                                    j.innerHTML = a.karma;
                                    var b = j.className;
                                    a.karma > 0 ? b.replace(" negative", " positive") : a.karma < 0 ? b.replace(" positive", " negative") : b.replace(" positive", " negative"), j.className = b
                                }
                            }
                        }, b = "", b += "action=" + h, b += "&rating_value=" + i, b += "&comment_id=" + g, k.send(b);
                        e.parentNode.remove()
                    }
                }
        };
    a.ExtendedComments = b, new a.ExtendedComments(iec_config)
}(Inpsyde || {}), function() {
    "use strict";

    function a(b, d) {
        function e(a, b) {
            return function() {
                return a.apply(b, arguments)
            }
        }
        var f;
        if (d = d || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = d.touchBoundary || 10, this.layer = b, this.tapDelay = d.tapDelay || 200, this.tapTimeout = d.tapTimeout || 700, !a.notNeeded(b)) {
            for (var g = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], h = this, i = 0, j = g.length; j > i; i++) h[g[i]] = e(h[g[i]], h);
            c && (b.addEventListener("mouseover", this.onMouse, !0), b.addEventListener("mousedown", this.onMouse, !0), b.addEventListener("mouseup", this.onMouse, !0)), b.addEventListener("click", this.onClick, !0), b.addEventListener("touchstart", this.onTouchStart, !1), b.addEventListener("touchmove", this.onTouchMove, !1), b.addEventListener("touchend", this.onTouchEnd, !1), b.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (b.removeEventListener = function(a, c, d) {
                var e = Node.prototype.removeEventListener;
                "click" === a ? e.call(b, a, c.hijacked || c, d) : e.call(b, a, c, d)
            }, b.addEventListener = function(a, c, d) {
                var e = Node.prototype.addEventListener;
                "click" === a ? e.call(b, a, c.hijacked || (c.hijacked = function(a) {
                    a.propagationStopped || c(a)
                }), d) : e.call(b, a, c, d)
            }), "function" == typeof b.onclick && (f = b.onclick, b.addEventListener("click", function(a) {
                f(a)
            }, !1), b.onclick = null)
        }
    }
    var b = navigator.userAgent.indexOf("Windows Phone") >= 0,
        c = navigator.userAgent.indexOf("Android") > 0 && !b,
        d = /iP(ad|hone|od)/.test(navigator.userAgent) && !b,
        e = d && /OS 4_\d(_\d)?/.test(navigator.userAgent),
        f = d && /OS [6-7]_\d/.test(navigator.userAgent),
        g = navigator.userAgent.indexOf("BB10") > 0;
    a.prototype.needsClick = function(a) {
        switch (a.nodeName.toLowerCase()) {
        case "button":
        case "select":
        case "textarea":
            if (a.disabled) return !0;
            break;
        case "input":
            if (d && "file" === a.type || a.disabled) return !0;
            break;
        case "label":
        case "iframe":
        case "video":
            return !0
        }
        return /\bneedsclick\b/.test(a.className)
    }, a.prototype.needsFocus = function(a) {
        switch (a.nodeName.toLowerCase()) {
        case "textarea":
            return !0;
        case "select":
            return !c;
        case "input":
            switch (a.type) {
            case "button":
            case "checkbox":
            case "file":
            case "image":
            case "radio":
            case "submit":
                return !1
            }
            return !a.disabled && !a.readOnly;
        default:
            return /\bneedsfocus\b/.test(a.className)
        }
    }, a.prototype.sendClick = function(a, b) {
        var c, d;
        document.activeElement && document.activeElement !== a && document.activeElement.blur(), d = b.changedTouches[0], c = document.createEvent("MouseEvents"), c.initMouseEvent(this.determineEventType(a), !0, !0, window, 1, d.screenX, d.screenY, d.clientX, d.clientY, !1, !1, !1, !1, 0, null), c.forwardedTouchEvent = !0, a.dispatchEvent(c)
    }, a.prototype.determineEventType = function(a) {
        return c && "select" === a.tagName.toLowerCase() ? "mousedown" : "click"
    }, a.prototype.focus = function(a) {
        var b;
        d && a.setSelectionRange && 0 !== a.type.indexOf("date") && "time" !== a.type && "month" !== a.type ? (b = a.value.length, a.setSelectionRange(b, b)) : a.focus()
    }, a.prototype.updateScrollParent = function(a) {
        var b, c;
        if (b = a.fastClickScrollParent, !b || !b.contains(a)) {
            c = a;
            do {
                if (c.scrollHeight > c.offsetHeight) {
                    b = c, a.fastClickScrollParent = c;
                    break
                }
                c = c.parentElement
            } while (c)
        }
        b && (b.fastClickLastScrollTop = b.scrollTop)
    }, a.prototype.getTargetElementFromEventTarget = function(a) {
        return a.nodeType === Node.TEXT_NODE ? a.parentNode : a
    }, a.prototype.onTouchStart = function(a) {
        var b, c, f;
        if (a.targetTouches.length > 1) return !0;
        if (b = this.getTargetElementFromEventTarget(a.target), c = a.targetTouches[0], d) {
            if (f = window.getSelection(), f.rangeCount && !f.isCollapsed) return !0;
            if (!e) {
                if (c.identifier && c.identifier === this.lastTouchIdentifier) return a.preventDefault(), !1;
                this.lastTouchIdentifier = c.identifier, this.updateScrollParent(b)
            }
        }
        return this.trackingClick = !0, this.trackingClickStart = a.timeStamp, this.targetElement = b, this.touchStartX = c.pageX, this.touchStartY = c.pageY, a.timeStamp - this.lastClickTime < this.tapDelay && a.preventDefault(), !0
    }, a.prototype.touchHasMoved = function(a) {
        var b = a.changedTouches[0],
            c = this.touchBoundary;
        return Math.abs(b.pageX - this.touchStartX) > c || Math.abs(b.pageY - this.touchStartY) > c ? !0 : !1
    }, a.prototype.onTouchMove = function(a) {
        return this.trackingClick ? ((this.targetElement !== this.getTargetElementFromEventTarget(a.target) || this.touchHasMoved(a)) && (this.trackingClick = !1, this.targetElement = null), !0) : !0
    }, a.prototype.findControl = function(a) {
        return void 0 !== a.control ? a.control : a.htmlFor ? document.getElementById(a.htmlFor) : a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
    }, a.prototype.onTouchEnd = function(a) {
        var b, g, h, i, j, k = this.targetElement;
        if (!this.trackingClick) return !0;
        if (a.timeStamp - this.lastClickTime < this.tapDelay) return this.cancelNextClick = !0, !0;
        if (a.timeStamp - this.trackingClickStart > this.tapTimeout) return !0;
        if (this.cancelNextClick = !1, this.lastClickTime = a.timeStamp, g = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, f && (j = a.changedTouches[0], k = document.elementFromPoint(j.pageX - window.pageXOffset, j.pageY - window.pageYOffset) || k, k.fastClickScrollParent = this.targetElement.fastClickScrollParent), h = k.tagName.toLowerCase(), "label" === h) {
            if (b = this.findControl(k)) {
                if (this.focus(k), c) return !1;
                k = b
            }
        } else if (this.needsFocus(k)) return a.timeStamp - g > 100 || d && window.top !== window && "input" === h ? (this.targetElement = null, !1) : (this.focus(k), this.sendClick(k, a), d && "select" === h || (this.targetElement = null, a.preventDefault()), !1);
        return d && !e && (i = k.fastClickScrollParent, i && i.fastClickLastScrollTop !== i.scrollTop) ? !0 : (this.needsClick(k) || (a.preventDefault(), this.sendClick(k, a)), !1)
    }, a.prototype.onTouchCancel = function() {
        this.trackingClick = !1, this.targetElement = null
    }, a.prototype.onMouse = function(a) {
        return this.targetElement ? a.forwardedTouchEvent ? !0 : a.cancelable && (!this.needsClick(this.targetElement) || this.cancelNextClick) ? (a.stopImmediatePropagation ? a.stopImmediatePropagation() : a.propagationStopped = !0, a.stopPropagation(), a.preventDefault(), !1) : !0 : !0
    }, a.prototype.onClick = function(a) {
        var b;
        return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : "submit" === a.target.type && 0 === a.detail ? !0 : (b = this.onMouse(a), b || (this.targetElement = null), b)
    }, a.prototype.destroy = function() {
        var a = this.layer;
        c && (a.removeEventListener("mouseover", this.onMouse, !0), a.removeEventListener("mousedown", this.onMouse, !0), a.removeEventListener("mouseup", this.onMouse, !0)), a.removeEventListener("click", this.onClick, !0), a.removeEventListener("touchstart", this.onTouchStart, !1), a.removeEventListener("touchmove", this.onTouchMove, !1), a.removeEventListener("touchend", this.onTouchEnd, !1), a.removeEventListener("touchcancel", this.onTouchCancel, !1)
    }, a.notNeeded = function(a) {
        var b, d, e, f;
        if ("undefined" == typeof window.ontouchstart) return !0;
        if (d = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
            if (!c) return !0;
            if (b = document.querySelector("meta[name=viewport]")) {
                if (-1 !== b.content.indexOf("user-scalable=no")) return !0;
                if (d > 31 && document.documentElement.scrollWidth <= window.outerWidth) return !0
            }
        }
        if (g && (e = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/), e[1] >= 10 && e[2] >= 3 && (b = document.querySelector("meta[name=viewport]")))) {
            if (-1 !== b.content.indexOf("user-scalable=no")) return !0;
            if (document.documentElement.scrollWidth <= window.outerWidth) return !0
        }
        return "none" === a.style.msTouchAction || "manipulation" === a.style.touchAction ? !0 : (f = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1], f >= 27 && (b = document.querySelector("meta[name=viewport]"), b && (-1 !== b.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) ? !0 : "none" === a.style.touchAction || "manipulation" === a.style.touchAction ? !0 : !1)
    }, a.attach = function(b, c) {
        return new a(b, c)
    }, "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() {
        return a
    }) : "undefined" != typeof module && module.exports ? (module.exports = a.attach, module.exports.FastClick = a) : window.FastClick = a
}(), navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement("style");
    msViewportStyle.appendChild(document.createTextNode("@-ms-viewport{width:auto!important}")), document.getElementsByTagName("head")[0].appendChild(msViewportStyle)
}
for (var i = 0; i < document.querySelectorAll("a img").length; i++)"A" == document.querySelectorAll("a img")[i].parentNode.tagName && (document.querySelectorAll("a img")[i].parentNode.style.border = "0");
!
function() {
    for (var a = 0, b = ["ms", "moz", "webkit", "o"], c = 0; c < b.length && !window.requestAnimationFrame; ++c) window.requestAnimationFrame = window[b[c] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[b[c] + "CancelAnimationFrame"] || window[b[c] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(b, c) {
        var d = (new Date).getTime(),
            e = Math.max(0, 16 - (d - a)),
            f = window.setTimeout(function() {
                b(d + e)
            }, e);
        return a = d + e, f
    }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(a) {
        clearTimeout(a)
    })
}(), function(a, b) {
    "function" == typeof define && define.amd ? define([], b) : "object" == typeof exports ? module.exports = b() : a.Layzr = b()
}(this, function() {
    "use strict";

    function a(a) {
        this._lastScroll = 0, this._ticking = !1, a = a || {}, this._optionsContainer = document.querySelector(a.container) || window, this._optionsSelector = a.selector || "[data-layzr]", this._optionsAttr = a.attr || "data-layzr", this._optionsAttrRetina = a.retinaAttr || "data-layzr-retina", this._optionsAttrBg = a.bgAttr || "data-layzr-bg", this._optionsAttrHidden = a.hiddenAttr || "data-layzr-hidden", this._optionsThreshold = a.threshold || 0, this._optionsCallback = a.callback || null, this._retina = window.devicePixelRatio > 1, this._srcAttr = this._retina ? this._optionsAttrRetina : this._optionsAttr, this._nodes = document.querySelectorAll(this._optionsSelector), this._create()
    }
    return a.prototype._requestScroll = function() {
        this._optionsContainer === window ? this._lastScroll = window.scrollY || window.pageYOffset : this._lastScroll = this._optionsContainer.scrollTop + this._getOffset(this._optionsContainer), this._requestTick()
    }, a.prototype._requestTick = function() {
        this._ticking || (requestAnimationFrame(this.update.bind(this)), this._ticking = !0)
    }, a.prototype._getOffset = function(a) {
        var b = 0;
        do isNaN(a.offsetTop) || (b += a.offsetTop);
        while (a = a.offsetParent);
        return b
    }, a.prototype._getContainerHeight = function() {
        return this._optionsContainer.innerHeight || this._optionsContainer.offsetHeight
    }, a.prototype._create = function() {
        this._requestScroll(), this._optionsContainer.addEventListener("scroll", this._requestScroll.bind(this), !1), this._optionsContainer.addEventListener("resize", this._requestScroll.bind(this), !1)
    }, a.prototype._destroy = function() {
        this._optionsContainer.removeEventListener("scroll", this._requestScroll.bind(this), !1), this._optionsContainer.removeEventListener("resize", this._requestScroll.bind(this), !1)
    }, a.prototype._inViewport = function(a) {
        var b = this._lastScroll,
            c = b + this._getContainerHeight(),
            d = this._getOffset(a),
            e = d + this._getContainerHeight(),
            f = this._optionsThreshold / 100 * window.innerHeight;
        return e >= b - f && c + f >= d && !a.hasAttribute(this._optionsAttrHidden)
    }, a.prototype._reveal = function(a) {
        var b = a.getAttribute(this._srcAttr) || a.getAttribute(this._optionsAttr);
        a.hasAttribute(this._optionsAttrBg) ? a.style.backgroundImage = "url(" + b + ")" : a.setAttribute("src", b), "function" == typeof this._optionsCallback && this._optionsCallback.call(a), a.removeAttribute(this._optionsAttr), a.removeAttribute(this._optionsAttrRetina), a.removeAttribute(this._optionsAttrBg), a.removeAttribute(this._optionsAttrHidden)
    }, a.prototype.updateSelector = function() {
        this._nodes = document.querySelectorAll(this._optionsSelector)
    }, a.prototype.update = function() {
        for (var a = this._nodes.length, b = 0; a > b; b++) {
            var c = this._nodes[b];
            c.hasAttribute(this._optionsAttr) && this._inViewport(c) && this._reveal(c)
        }
        this._ticking = !1
    }, a
}), function() {
    "use strict";
    var a = {};
    a.HANDLER = {
        onImageLoaded: function() {
            this.className = this.className + " avatar-loaded"
        }
    }, a.initialize = function() {
        new Layzr({
            container: null,
            selector: "[data-src]",
            attr: "data-src",
            retinaAttr: "data-src-retina",
            threshold: 0,
            callback: a.HANDLER.onImageLoaded
        })
    }, a.initialize()
}(), ("undefined" == typeof window.localStorage || "undefined" == typeof window.sessionStorage) &&
function() {
    var a = function(a) {
            function b(a, b, c) {
                var d, e;
                c ? (d = new Date, d.setTime(d.getTime() + 24 * c * 60 * 60 * 1e3), e = "; expires=" + d.toGMTString()) : e = "", document.cookie = a + "=" + b + e + "; path=/"
            }
            function c(a) {
                var b, c, d = a + "=",
                    e = document.cookie.split(";");
                for (b = 0; b < e.length; b++) {
                    for (c = e[b];
                    " " == c.charAt(0);) c = c.substring(1, c.length);
                    if (0 == c.indexOf(d)) return c.substring(d.length, c.length)
                }
                return null
            }
            function d(c) {
                c = JSON.stringify(c), "session" == a ? window.name = c : b("localStorage", c, 365)
            }
            function e() {
                "session" == a ? window.name = "" : b("localStorage", "", 365)
            }
            function f() {
                var b = "session" == a ? window.name : c("localStorage");
                return b ? JSON.parse(b) : {}
            }
            var g = f();
            return {
                length: 0,
                clear: function() {
                    g = {}, this.length = 0, e()
                },
                getItem: function(a) {
                    return void 0 === g[a] ? null : g[a]
                },
                key: function(a) {
                    var b = 0;
                    for (var c in g) {
                        if (b == a) return c;
                        b++
                    }
                    return null
                },
                removeItem: function(a) {
                    delete g[a], this.length--, d(g)
                },
                setItem: function(a, b) {
                    g[a] = b + "", this.length++, d(g)
                }
            }
        };
    "undefined" == typeof window.localStorage && (window.localStorage = new a("local")), "undefined" == typeof window.sessionStorage && (window.sessionStorage = new a("session"))
}(), function(a) {
    function b() {
        k.setAttribute("content", n), o = !0
    }
    function c() {
        k.setAttribute("content", m), o = !1
    }
    function d(d) {
        j = d.accelerationIncludingGravity, g = Math.abs(j.x), h = Math.abs(j.y), i = Math.abs(j.z), a.orientation && 180 !== a.orientation || !(g > 7 || (i > 6 && 8 > h || 8 > i && h > 6) && g > 5) ? o || b() : o && c()
    }
    var e = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(navigator.platform) && /OS [1-5]_[0-9_]* like Mac OS X/i.test(e) && e.indexOf("AppleWebKit") > -1) {
        var f = a.document;
        if (f.querySelector) {
            var g, h, i, j, k = f.querySelector("meta[name=viewport]"),
                l = k && k.getAttribute("content"),
                m = l + ",maximum-scale=1",
                n = l + ",maximum-scale=10",
                o = !0;
            k && (a.addEventListener("orientationchange", b, !1), a.addEventListener("devicemotion", d, !1))
        }
    }
}(this);
for (var i = 0; i < document.querySelectorAll(".ttoc").length; i++) for (var table_id = document.querySelectorAll(".ttoc")[i].id, tri = 0; tri < document.querySelectorAll("#" + table_id + " tr").length; tri++) {
    var element = document.querySelectorAll("#" + table_id + " tr")[tri];
    if (tri % 2 == 0 && 0 != tri) element.style.display = "none";
    else {
        var element_classes = element.className;
        element.className = element.className + " odd", element.onclick = function() {
            for (var a = this.nextSibling; a && "TR" != a.nodeName;) a = a.nextSibling;
            "none" == a.style.display ? a.style.display = "table-row" : a.style.display = "none";
            var b = this.querySelector(".arrow"),
                c = b.className; - 1 == c.indexOf("up") ? b.className = c + " up" : b.className = c.replace("up", "")
        }
    }
}