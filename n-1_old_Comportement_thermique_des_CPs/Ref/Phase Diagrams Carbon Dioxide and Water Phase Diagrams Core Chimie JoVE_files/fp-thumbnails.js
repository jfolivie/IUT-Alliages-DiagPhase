!(function (t, n) {
    "object" == typeof exports && "undefined" != typeof module ? (module.exports = n()) : "function" == typeof define && define.amd ? define(n) : (((t = t || self).flowplayer = t.flowplayer || {}), (t.flowplayer.thumbnails = n()));
})(this, function () {
    "use strict";
    function t(t) {
        return "function" == typeof t;
    }
    function n() {
        throw new Error("Function was expected as Argument[0]");
    }
    var e = [].slice;
    function r(i) {
        if (!(this instanceof r)) return new r(i);
        var o = this;
        return (
            (o.data = i),
            (o.tap = function () {
                var i = e.call(arguments),
                    a = i.shift();
                return a == r.lift ? o.data : t(a) ? (a.apply(o, [o.data].concat(i)), o) : void n();
            }),
            (o.into = o.fmap = function () {
                var i = e.call(arguments),
                    a = i.shift();
                return a == r.lift ? o.data : t(a) ? r(a.apply(o, [o.data].concat(i))) : void n();
            }),
            (o.unwrap = function () {
                return o.data;
            }),
            o
        );
    }
    (r.of = r),
        (r.lift = function (t) {
            return t instanceof r ? t.data : t;
        }),
        (r._apply = r.apply = function (t, n) {
            if (0 == n.length) return t();
            if (1 == n.length) return t(n[0]);
            if (2 == n.length) return t(n[0], n[1]);
            if (3 == n.length) return t(n[0], n[1], n[2]);
            if (4 == n.length) return t(n[0], n[1], n[2], n[3]);
            if (5 == n.length) return t(n[0], n[1], n[2], n[3], n[4]);
            throw new Error("Pipe._apply() does not support arity > 5");
        }),
        (r.maybe = function (t, n, i) {
            return t ? r._apply(n, [t].concat(e.call(arguments, 2, arguments.length))) : t;
        }),
        (r.curry = function (t, n, i) {
            return (n = n || []).length > t.length - 1
                ? t.apply(i, n)
                : function () {
                      var o = n.concat(e.call(arguments));
                      return r.curry(t, o, i);
                  };
        });
    var i = [].slice;
    function o(t, n) {
        for (var e = [], r = 2; r < arguments.length; r++) e[r - 2] = arguments[r];
        for (var i in n) t[i] = n[i];
        return t;
    }
    function a() {
        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
        return t.slice(1).reduce(function (t, n) {
            return o(t, n);
        }, t[0] || {});
    }
    function u(t) {
        return Array.isArray(t) ? t.slice(0) : t.split(".");
    }
    function f(t, n, e) {
        for (var r = u(n); r.length; ) {
            if (null == t) return e;
            var i = r.shift();
            if ("string" != typeof i) return e;
            t = t[i];
        }
        return null == t ? e : t;
    }
    function s(t, n, e) {
        var r = (n = u(n)).pop(),
            i = f(t, n);
        return i && r && (i[r] = e), t;
    }
    var c = !!(function () {
            var t = !1;
            try {
                var n = Object.defineProperty({}, "passive", {
                    get: function () {
                        t = !0;
                    },
                });
                window.addEventListener("testPassive", null, n), window.removeEventListener("testPassive", null, n);
            } catch (t) {}
            return t;
        })() && { passive: !0 },
        l = ["touchstart", "touchmove"];
    function d(t) {
        return (
            (t.emit = function (n, e, r) {
                r = r || {};
                var i = (function (t) {
                    var n = document.createEvent("Event");
                    return n.initEvent(t, !1, !0), n;
                })(n);
                return e && o(i, { data: e || {} }), t.dispatchEvent(i), !1 === r.return_self ? i : t;
            }),
            (t.on = function (n, e) {
                return (
                    "string" == typeof n && (n = n.split(" ")),
                    n.forEach(function (n) {
                        return (function (t) {
                            return ~l.indexOf(t);
                        })(n)
                            ? t.addEventListener(n, e, c)
                            : t.addEventListener(n, e);
                    }),
                    t
                );
            }),
            (t.off = function (n, e) {
                return t.removeEventListener(n, e), t;
            }),
            (t.one = t.once = function (n, e) {
                return t.on(n, function r(i) {
                    t.off(n, r), e(i);
                });
            }),
            t
        );
    }
    var p = Array.isArray,
        h = "undefined" != typeof window && d(window),
        m = "undefined" != typeof document && d(document),
        v = ["span", "a", "em", "p", "i"],
        y = v.concat(["div", "strong", "video", "img", "ol", "ul", "li", "script"]);
    function g(t, n, e) {
        var r = w(document.createElement(t));
        if (
            (p(n) && ((e = n), (n = !1)),
            p(e) || (e = [e]),
            r.append(
                e.filter(function (t) {
                    return t;
                })
            ),
            "object" != typeof n)
        )
            return r;
        for (var i in n) i in r ? (r[i] = n[i]) : r.setAttribute(i, n[i]);
        return r;
    }
    function b(t) {
        var n = t.tagName;
        (t.__flowplayer__ = 1),
            (t.find = function (n) {
                var e = t.querySelector(n);
                return e ? w(e) : e;
            }),
            (t.html = function (n) {
                return (t.innerHTML = n), t;
            }),
            (t.empty = function () {
                return (t.innerHTML = ""), t;
            }),
            (t.offset = function () {
                var n = { top: 0, left: 0 },
                    e = t;
                do {
                    (n.left += e.offsetLeft || 0), (n.top += e.offsetTop || 0);
                } while ((e = e.offsetParent));
                return n;
            }),
            (t.innerWidth = function () {
                var n = getComputedStyle(t);
                return t.clientWidth - parseFloat(n.paddingLeft) - parseFloat(n.paddingRight);
            });
        var e = (t.insert = function (n, e) {
            return p(e)
                ? e.map(function (e) {
                      return t.insert(n, e);
                  })[0]
                : w((e = "string" == typeof e ? t.insertAdjacentHTML(n, e) : t.insertAdjacentElement ? t.insertAdjacentElement(n, e) : t.appendChild(e)));
        });
        return (
            (t.append = e.bind(t, "beforeend")),
            (t.prepend = e.bind(t, "afterbegin")),
            (t.css = function (n, e) {
                if ("object" == typeof n) {
                    for (var r in n) t.css(r, n[r]);
                    return t;
                }
                return void 0 === e ? getComputedStyle(t)[n] : (1 * e && (e += "px"), (t.style[n] = e), t);
            }),
            (t.show = function () {
                return t.css({ display: ~v.indexOf(n) ? "inline" : "block" });
            }),
            (t.hide = function () {
                return t.css({ display: "none" });
            }),
            (t.remove = function () {
                var n = t.parentNode;
                n && n.removeChild(t);
            }),
            (t.attr = function (n, e) {
                return null == e ? t.getAttribute(n) : (t.setAttribute(n, e), t);
            }),
            (t.txt = function (n) {
                return (t.textContent = n), t;
            }),
            (t.fp = function (n) {
                return t.addClass("fp-" + n);
            }),
            (t.addClass = function (n) {
                return (
                    n.split(" ").forEach(function (n) {
                        t.hasClass(n) || (t.className += (t.className ? " " : "") + n);
                    }),
                    t
                );
            }),
            (t.removeClass = function (n) {
                n = n.split(" ");
                var e = t.className.split(" ");
                return (
                    (t.className = e
                        .filter(function (t) {
                            return !~n.indexOf(t);
                        })
                        .join(" ")),
                    t
                );
            }),
            (t.toggleClass = function (n, e) {
                return void 0 === e && (e = !t.hasClass(n)), e ? t.addClass(n) : t.removeClass(n);
            }),
            (t.findAll = function (n) {
                return (e = t.querySelectorAll(n)), i.call(e);
                var e;
            }),
            (t.hasClass = function (n) {
                return ~t.className.split(" ").indexOf(n);
            }),
            t
        );
    }
    function w(t) {
        return void 0 === t ||
            (function (t) {
                return t && t.__flowplayer__;
            })(t)
            ? t
            : b(d(t));
    }
    function x(t, n) {
        if ("string" == typeof t && "<" == t[0]) return g(t.slice(1, -1), n);
        if ("string" != typeof t) return w(t);
        var e = (n instanceof HTMLElement && n.querySelector(".fp-" + t)) || document.querySelector(t);
        return e ? w(e) : void 0;
    }
    (x.window = h),
        (x.document = m),
        (x.el = g),
        y.forEach(function (t) {
            x[t] = function (n, e) {
                return "string" == typeof n && (n = { class: n }), g(t, n, e);
            };
        });
    function _(t, n) {
        if (
            ((function (t) {
                switch (t) {
                    case "":
                    case "anonymous":
                    case "use-credentials":
                        return !0;
                    default:
                        console.warn("Invalid(crossorigin: %s) must be one of '', 'anonymous', or 'use-credentials'\nhttps://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes", t);
                }
            })((n = n || "anonymous")),
            t.crossOrigin != n)
        )
            return t.attr("crossorigin", n), t;
    }
    function E(t) {
        var n = document.createElement("a");
        return (n.href = t), n.origin;
    }
    function A(t, n) {
        return t.querySelector("track[id='" + n + "']");
    }
    function C(t, n) {
        var e = x(document.createElement("track"));
        return (
            a(e, n),
            (function (t, n) {
                try {
                    return t.src.indexOf("blob:"), E(t.src) !== E(n);
                } catch (t) {
                    return console.error(t), !0;
                }
            })(t, n.src) && (_(t), _(e)),
            t.appendChild(e)
        );
    }
    var k = /#xywh=(\d+),(\d+),(\d+),(\d+)$/,
        T = /^(https:|https:|\/)/;
    function L(t, n) {
        for (t = t.slice(0); t.length; ) {
            var e = t.shift();
            if (e.startTime <= n && n <= e.endTime) return e;
        }
    }
    var j = { h: "height", w: "width", x: "x", y: "y" };
    function M(t, n) {
        if (0 != t.length)
            return ~t.match(k)
                ? (function (t) {
                      var n = t.indexOf("#"),
                          e = t.slice(0, n),
                          r = t.slice(n + 1, t.length).split("="),
                          i = r[0].split(""),
                          o = r[1].split(",");
                      return i.reduce(
                          function (t, n, e) {
                              return s(t, j[n], o[e]);
                          },
                          { path: e }
                      );
                  })(t)
                : a({}, n, { path: t });
    }
    function O(t) {
        return t.removeClass("with-thumbnail"), t.removeAttribute("style");
    }
    function S(t, n, e, r) {
		//t contains thumbnail information;
		//n is the timestamp element
		//e is the percent of the timeline
		//r is the player itself
		//console.dir(e);
		
		//only want to do this in certain situations
		var chapter_text = '',
			timestamp = '';
		//if($('#collection_id').length === 0){
			var current_time = (e / 100) * r.video.duration;
			if($('.jove_navigation .chapters .chapter').length > 0){
				$('.jove_navigation .chapters .chapter').each(function(){
					if(current_time >= $(this).data('time') ){
						var new_el = document.createElement('div');
						var el = $(this).find('h4');
						new_el.innerHTML = el.html();
						$(new_el).find('span').remove();
						chapter_text = $(new_el).html();
						var mlen = 50;
						if(chapter_text.length > mlen){
							chapter_text = chapter_text.substring(0,mlen) + "&hellip;";
						}
					}
				});
			}
			var minutes = (Math.floor(current_time / 60)).toString().padStart(2,'0');
			var seconds = (Math.round(current_time % 60)).toString().padStart(2,'0');
			timestamp = minutes + ':' + seconds;
		//}
		
        var i = r.find(".fp-timeline").offsetWidth,
            o = parseInt(t.width, 10),
            a = o / 2,
            u = Math.round(i * (e / 100)) - a,
            f = Math.min(i - o, Math.max(u, 0)),
			m = parseInt(t.height,10) + 50;
		//need to add a check for eoe here I think
        t.x = -t.x;
        if(timestamp && chapter_text){
			return n
            .addClass("with-thumbnail")
            .css({ backgroundImage: ["url(", t.path, ")"].join(""), backgroundPositionX: t.x + "px ", backgroundPositionY: "-" + t.y + "px", height: t.height, width: t.width, left: f + "px", marginTop: "-" + m.toString() + "px" }).html('<span class="thumb-chapter-text">'+chapter_text+'<br class="time-break">'+timestamp+'</span>');
		}else{
			return n
            .addClass("with-thumbnail")
            .css({ backgroundImage: ["url(", t.path, ")"].join(""), backgroundPositionX: t.x + "px ", backgroundPositionY: "-" + t.y + "px", height: t.height, width: t.width, left: f + "px", marginTop: "-" + t.height + "px" });
		}
    }
    var N = [].slice,
        P = "thumbnails";
    function q(t) {
        var n = A(t, P);
        n && n.remove(), t.reaper.put(P, []);
    }
    return (function (t, n) {
        if ("object" == typeof exports && "undefined" != typeof module) return n;
        "flowplayer" in t || (t.flowplayer = { extensions: [] });
        var e = t.flowplayer;
        return "function" == typeof e ? (e(n), n) : (Array.isArray(e.extensions) || (e.extensions = []), ~e.extensions.indexOf(n) || e.extensions.push(n), n);
    })(window, function (t, n, e) {
        e.reaper.put("thumbnails", []),
            e.one("mount", function () {
                !(function (t) {
                    var n = { vod: f(t, "_behavior.kinds.vod.tooltip_update"), live: f(t, "_behavior.kinds.live.tooltip_update") },
                        e = function (t, e, r, i) {
                            O(r.timestamp), n[i].apply(this, arguments), e.emit("thumbnails:render", a({}, t, { controls: r }));
                        };
                    s(t, "_behavior.kinds.vod.tooltip_update", e), s(t, "_behavior.kinds.live.tooltip_update", e);
                })(e);
            }),
            e.on("thumbnails:render", function (i) {
                var o = f(i, "data.controls"),
                    a = f(i, "data.percent");
                if (o && "number" == typeof a) {
                    var u = r
                        .of(e.duration * (a / 100))
                        .fmap(Math.min, e.duration)
                        .fmap(Math.max, 0)
                        .unwrap();
                    r.of(e.thumbnails).fmap(L, u).fmap(f, "src", "").fmap(M, f(t, "thumbnails", {})).fmap(r.maybe, S, o.timestamp, a, n);
                }
            }),
            (e.textTracks.onaddtrack = function (t) {
                var n = t.track;
                if (n.id === P) {
                    var r = A(e, P);
                    r &&
                        ((r.onload = r.onerror = function (t) {
                            if ("error" == t.type) return console.error(t.type, t);
                            s(
                                e,
                                "thumbnails",
                                N.call(n.cues).map(function (t) {
                                    return (function (t, n) {
                                        return {
                                            src: t.text.match(T)
                                                ? t.text
                                                : (function (t, n) {
                                                      const e = n.split("/");
                                                      return e.pop(), e.push(t), e.join("/");
                                                  })(t.text, n),
                                            endTime: t.endTime,
                                            startTime: t.startTime,
                                        };
                                    })(t, r.src);
                                })
                            );
                        }),
                        (n.mode = "hidden"));
                }
            }),
            e.on("config", function (t) {
                var n = f(t.data, "thumbnails.src", !1);
                if ("string" == typeof n)
                    return (function (t, n) {
                        if (
                            !(function (t, n) {
                                return t.querySelector("track[src='" + n + "']");
                            })(t, n)
                        )
                            return q(t), new C(t, { kind: "metadata", src: n, id: P });
                    })(e, n);
                var r = f(t.data, "thumbnails.thumbs", !1);
                return Array.isArray(r)
                    ? (function (t, n) {
                          q(t), t.reaper.put(P, n);
                      })(e, r)
                    : void 0;
            });
    });
});
