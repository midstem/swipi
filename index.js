import at, { useRef as Te, useState as x, useCallback as fe, useEffect as de, useMemo as je, forwardRef as It } from "react";
var Ae = { exports: {} }, ye = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Je;
function Pt() {
  if (Je)
    return ye;
  Je = 1;
  var t = at, r = Symbol.for("react.element"), a = Symbol.for("react.fragment"), i = Object.prototype.hasOwnProperty, s = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, u = { key: !0, ref: !0, __self: !0, __source: !0 };
  function f(d, l, T) {
    var v, h = {}, m = null, E = null;
    T !== void 0 && (m = "" + T), l.key !== void 0 && (m = "" + l.key), l.ref !== void 0 && (E = l.ref);
    for (v in l)
      i.call(l, v) && !u.hasOwnProperty(v) && (h[v] = l[v]);
    if (d && d.defaultProps)
      for (v in l = d.defaultProps, l)
        h[v] === void 0 && (h[v] = l[v]);
    return { $$typeof: r, type: d, key: m, ref: E, props: h, _owner: s.current };
  }
  return ye.Fragment = a, ye.jsx = f, ye.jsxs = f, ye;
}
var Re = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Xe;
function xt() {
  return Xe || (Xe = 1, process.env.NODE_ENV !== "production" && function() {
    var t = at, r = Symbol.for("react.element"), a = Symbol.for("react.portal"), i = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), u = Symbol.for("react.profiler"), f = Symbol.for("react.provider"), d = Symbol.for("react.context"), l = Symbol.for("react.forward_ref"), T = Symbol.for("react.suspense"), v = Symbol.for("react.suspense_list"), h = Symbol.for("react.memo"), m = Symbol.for("react.lazy"), E = Symbol.for("react.offscreen"), S = Symbol.iterator, F = "@@iterator";
    function q(e) {
      if (e === null || typeof e != "object")
        return null;
      var n = S && e[S] || e[F];
      return typeof n == "function" ? n : null;
    }
    var y = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function w(e) {
      {
        for (var n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), c = 1; c < n; c++)
          o[c - 1] = arguments[c];
        M("error", e, o);
      }
    }
    function M(e, n, o) {
      {
        var c = y.ReactDebugCurrentFrame, b = c.getStackAddendum();
        b !== "" && (n += "%s", o = o.concat([b]));
        var R = o.map(function(g) {
          return String(g);
        });
        R.unshift("Warning: " + n), Function.prototype.apply.call(console[e], console, R);
      }
    }
    var $ = !1, Y = !1, j = !1, k = !1, V = !1, B;
    B = Symbol.for("react.module.reference");
    function J(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === i || e === u || V || e === s || e === T || e === v || k || e === E || $ || Y || j || typeof e == "object" && e !== null && (e.$$typeof === m || e.$$typeof === h || e.$$typeof === f || e.$$typeof === d || e.$$typeof === l || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === B || e.getModuleId !== void 0));
    }
    function X(e, n, o) {
      var c = e.displayName;
      if (c)
        return c;
      var b = n.displayName || n.name || "";
      return b !== "" ? o + "(" + b + ")" : o;
    }
    function P(e) {
      return e.displayName || "Context";
    }
    function _(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && w("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case i:
          return "Fragment";
        case a:
          return "Portal";
        case u:
          return "Profiler";
        case s:
          return "StrictMode";
        case T:
          return "Suspense";
        case v:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case d:
            var n = e;
            return P(n) + ".Consumer";
          case f:
            var o = e;
            return P(o._context) + ".Provider";
          case l:
            return X(e, e.render, "ForwardRef");
          case h:
            var c = e.displayName || null;
            return c !== null ? c : _(e.type) || "Memo";
          case m: {
            var b = e, R = b._payload, g = b._init;
            try {
              return _(g(R));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var C = Object.assign, L = 0, Q, z, ee, W, te, re, K;
    function G() {
    }
    G.__reactDisabledLog = !0;
    function ne() {
      {
        if (L === 0) {
          Q = console.log, z = console.info, ee = console.warn, W = console.error, te = console.group, re = console.groupCollapsed, K = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: G,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        L++;
      }
    }
    function ve() {
      {
        if (L--, L === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: C({}, e, {
              value: Q
            }),
            info: C({}, e, {
              value: z
            }),
            warn: C({}, e, {
              value: ee
            }),
            error: C({}, e, {
              value: W
            }),
            group: C({}, e, {
              value: te
            }),
            groupCollapsed: C({}, e, {
              value: re
            }),
            groupEnd: C({}, e, {
              value: K
            })
          });
        }
        L < 0 && w("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var pe = y.ReactCurrentDispatcher, oe;
    function ae(e, n, o) {
      {
        if (oe === void 0)
          try {
            throw Error();
          } catch (b) {
            var c = b.stack.trim().match(/\n( *(at )?)/);
            oe = c && c[1] || "";
          }
        return `
` + oe + e;
      }
    }
    var ge = !1, se;
    {
      var he = typeof WeakMap == "function" ? WeakMap : Map;
      se = new he();
    }
    function me(e, n) {
      if (!e || ge)
        return "";
      {
        var o = se.get(e);
        if (o !== void 0)
          return o;
      }
      var c;
      ge = !0;
      var b = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var R;
      R = pe.current, pe.current = null, ne();
      try {
        if (n) {
          var g = function() {
            throw Error();
          };
          if (Object.defineProperty(g.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(g, []);
            } catch (H) {
              c = H;
            }
            Reflect.construct(e, [], g);
          } else {
            try {
              g.call();
            } catch (H) {
              c = H;
            }
            e.call(g.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (H) {
            c = H;
          }
          e();
        }
      } catch (H) {
        if (H && c && typeof H.stack == "string") {
          for (var p = H.stack.split(`
`), A = c.stack.split(`
`), O = p.length - 1, I = A.length - 1; O >= 1 && I >= 0 && p[O] !== A[I]; )
            I--;
          for (; O >= 1 && I >= 0; O--, I--)
            if (p[O] !== A[I]) {
              if (O !== 1 || I !== 1)
                do
                  if (O--, I--, I < 0 || p[O] !== A[I]) {
                    var N = `
` + p[O].replace(" at new ", " at ");
                    return e.displayName && N.includes("<anonymous>") && (N = N.replace("<anonymous>", e.displayName)), typeof e == "function" && se.set(e, N), N;
                  }
                while (O >= 1 && I >= 0);
              break;
            }
        }
      } finally {
        ge = !1, pe.current = R, ve(), Error.prepareStackTrace = b;
      }
      var le = e ? e.displayName || e.name : "", He = le ? ae(le) : "";
      return typeof e == "function" && se.set(e, He), He;
    }
    function we(e, n, o) {
      return me(e, !1);
    }
    function _e(e) {
      var n = e.prototype;
      return !!(n && n.isReactComponent);
    }
    function ie(e, n, o) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return me(e, _e(e));
      if (typeof e == "string")
        return ae(e);
      switch (e) {
        case T:
          return ae("Suspense");
        case v:
          return ae("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case l:
            return we(e.render);
          case h:
            return ie(e.type, n, o);
          case m: {
            var c = e, b = c._payload, R = c._init;
            try {
              return ie(R(b), n, o);
            } catch {
            }
          }
        }
      return "";
    }
    var ue = Object.prototype.hasOwnProperty, be = {}, Se = y.ReactDebugCurrentFrame;
    function U(e) {
      if (e) {
        var n = e._owner, o = ie(e.type, e._source, n ? n.type : null);
        Se.setExtraStackFrame(o);
      } else
        Se.setExtraStackFrame(null);
    }
    function De(e, n, o, c, b) {
      {
        var R = Function.call.bind(ue);
        for (var g in e)
          if (R(e, g)) {
            var p = void 0;
            try {
              if (typeof e[g] != "function") {
                var A = Error((c || "React class") + ": " + o + " type `" + g + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[g] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw A.name = "Invariant Violation", A;
              }
              p = e[g](n, g, c, o, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (O) {
              p = O;
            }
            p && !(p instanceof Error) && (U(b), w("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", c || "React class", o, g, typeof p), U(null)), p instanceof Error && !(p.message in be) && (be[p.message] = !0, U(b), w("Failed %s type: %s", o, p.message), U(null));
          }
      }
    }
    var lt = Array.isArray;
    function Ce(e) {
      return lt(e);
    }
    function ft(e) {
      {
        var n = typeof Symbol == "function" && Symbol.toStringTag, o = n && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return o;
      }
    }
    function dt(e) {
      try {
        return We(e), !1;
      } catch {
        return !0;
      }
    }
    function We(e) {
      return "" + e;
    }
    function Ne(e) {
      if (dt(e))
        return w("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", ft(e)), We(e);
    }
    var Ee = y.ReactCurrentOwner, vt = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, $e, Be, Oe;
    Oe = {};
    function pt(e) {
      if (ue.call(e, "ref")) {
        var n = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (n && n.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function gt(e) {
      if (ue.call(e, "key")) {
        var n = Object.getOwnPropertyDescriptor(e, "key").get;
        if (n && n.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function ht(e, n) {
      if (typeof e.ref == "string" && Ee.current && n && Ee.current.stateNode !== n) {
        var o = _(Ee.current.type);
        Oe[o] || (w('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', _(Ee.current.type), e.ref), Oe[o] = !0);
      }
    }
    function mt(e, n) {
      {
        var o = function() {
          $e || ($e = !0, w("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", n));
        };
        o.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: o,
          configurable: !0
        });
      }
    }
    function bt(e, n) {
      {
        var o = function() {
          Be || (Be = !0, w("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", n));
        };
        o.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: o,
          configurable: !0
        });
      }
    }
    var Et = function(e, n, o, c, b, R, g) {
      var p = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: r,
        // Built-in properties that belong on the element
        type: e,
        key: n,
        ref: o,
        props: g,
        // Record the component responsible for creating this element.
        _owner: R
      };
      return p._store = {}, Object.defineProperty(p._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(p, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: c
      }), Object.defineProperty(p, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: b
      }), Object.freeze && (Object.freeze(p.props), Object.freeze(p)), p;
    };
    function yt(e, n, o, c, b) {
      {
        var R, g = {}, p = null, A = null;
        o !== void 0 && (Ne(o), p = "" + o), gt(n) && (Ne(n.key), p = "" + n.key), pt(n) && (A = n.ref, ht(n, b));
        for (R in n)
          ue.call(n, R) && !vt.hasOwnProperty(R) && (g[R] = n[R]);
        if (e && e.defaultProps) {
          var O = e.defaultProps;
          for (R in O)
            g[R] === void 0 && (g[R] = O[R]);
        }
        if (p || A) {
          var I = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          p && mt(g, I), A && bt(g, I);
        }
        return Et(e, p, A, b, c, Ee.current, g);
      }
    }
    var Ie = y.ReactCurrentOwner, Ue = y.ReactDebugCurrentFrame;
    function ce(e) {
      if (e) {
        var n = e._owner, o = ie(e.type, e._source, n ? n.type : null);
        Ue.setExtraStackFrame(o);
      } else
        Ue.setExtraStackFrame(null);
    }
    var Pe;
    Pe = !1;
    function xe(e) {
      return typeof e == "object" && e !== null && e.$$typeof === r;
    }
    function Ye() {
      {
        if (Ie.current) {
          var e = _(Ie.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function Rt(e) {
      {
        if (e !== void 0) {
          var n = e.fileName.replace(/^.*[\\\/]/, ""), o = e.lineNumber;
          return `

Check your code at ` + n + ":" + o + ".";
        }
        return "";
      }
    }
    var Ve = {};
    function Tt(e) {
      {
        var n = Ye();
        if (!n) {
          var o = typeof e == "string" ? e : e.displayName || e.name;
          o && (n = `

Check the top-level render call using <` + o + ">.");
        }
        return n;
      }
    }
    function ze(e, n) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var o = Tt(n);
        if (Ve[o])
          return;
        Ve[o] = !0;
        var c = "";
        e && e._owner && e._owner !== Ie.current && (c = " It was passed a child from " + _(e._owner.type) + "."), ce(e), w('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', o, c), ce(null);
      }
    }
    function qe(e, n) {
      {
        if (typeof e != "object")
          return;
        if (Ce(e))
          for (var o = 0; o < e.length; o++) {
            var c = e[o];
            xe(c) && ze(c, n);
          }
        else if (xe(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var b = q(e);
          if (typeof b == "function" && b !== e.entries)
            for (var R = b.call(e), g; !(g = R.next()).done; )
              xe(g.value) && ze(g.value, n);
        }
      }
    }
    function St(e) {
      {
        var n = e.type;
        if (n == null || typeof n == "string")
          return;
        var o;
        if (typeof n == "function")
          o = n.propTypes;
        else if (typeof n == "object" && (n.$$typeof === l || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        n.$$typeof === h))
          o = n.propTypes;
        else
          return;
        if (o) {
          var c = _(n);
          De(o, e.props, "prop", c, e);
        } else if (n.PropTypes !== void 0 && !Pe) {
          Pe = !0;
          var b = _(n);
          w("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", b || "Unknown");
        }
        typeof n.getDefaultProps == "function" && !n.getDefaultProps.isReactClassApproved && w("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function wt(e) {
      {
        for (var n = Object.keys(e.props), o = 0; o < n.length; o++) {
          var c = n[o];
          if (c !== "children" && c !== "key") {
            ce(e), w("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", c), ce(null);
            break;
          }
        }
        e.ref !== null && (ce(e), w("Invalid attribute `ref` supplied to `React.Fragment`."), ce(null));
      }
    }
    function Ge(e, n, o, c, b, R) {
      {
        var g = J(e);
        if (!g) {
          var p = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (p += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var A = Rt(b);
          A ? p += A : p += Ye();
          var O;
          e === null ? O = "null" : Ce(e) ? O = "array" : e !== void 0 && e.$$typeof === r ? (O = "<" + (_(e.type) || "Unknown") + " />", p = " Did you accidentally export a JSX literal instead of a component?") : O = typeof e, w("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", O, p);
        }
        var I = yt(e, n, o, b, R);
        if (I == null)
          return I;
        if (g) {
          var N = n.children;
          if (N !== void 0)
            if (c)
              if (Ce(N)) {
                for (var le = 0; le < N.length; le++)
                  qe(N[le], e);
                Object.freeze && Object.freeze(N);
              } else
                w("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              qe(N, e);
        }
        return e === i ? wt(I) : St(I), I;
      }
    }
    function _t(e, n, o) {
      return Ge(e, n, o, !0);
    }
    function Dt(e, n, o) {
      return Ge(e, n, o, !1);
    }
    var Ct = Dt, Ot = _t;
    Re.Fragment = i, Re.jsx = Ct, Re.jsxs = Ot;
  }()), Re;
}
process.env.NODE_ENV === "production" ? Ae.exports = Pt() : Ae.exports = xt();
var st = Ae.exports;
const D = st.jsx, ke = st.jsxs, it = ({
  sizeForDefaultActiveDot: t = 13,
  activeDotColor: r
}) => /* @__PURE__ */ D(
  "div",
  {
    className: "what-i-need",
    style: {
      aspectRatio: "1 / 1",
      width: `${t}px`,
      backgroundColor: r || "black",
      borderRadius: "50%",
      cursor: "pointer"
    }
  }
), Me = ({
  index: t,
  slideIndex: r,
  sizeForDefaultDot: a = 12,
  sizeForDefaultActiveDot: i = 12,
  dotColor: s = "#c7c7c7",
  activeDotColor: u = "black"
}) => /* @__PURE__ */ D(
  "div",
  {
    "data-cy": "default-dot",
    style: {
      aspectRatio: "1 / 1",
      width: r === t ? i : a,
      backgroundColor: r === t ? u : s,
      borderRadius: "50%",
      cursor: "pointer"
    }
  }
), jt = () => {
  const t = "abcdefghijklmnopqrstuvwxyz0123456789";
  return t.split("").map(() => t.charAt(Math.floor(Math.random() * t.length))).join("");
}, At = (t, r) => new Array(r).fill(t).flat(), ut = (t) => Array.from({ length: t }, () => ""), kt = (t, r) => Math.abs(t.getTime() - r.getTime());
var Le = /* @__PURE__ */ ((t) => (t.DEFAULT = "default", t.FADE_IN = "fade-in", t))(Le || {});
const Ft = (t) => ({
  opacity: t ? 1 : 0,
  transition: "opacity 350ms cubic-bezier(0.25, 1, 0.5, 1) 0s"
}), ct = ({ children: t }) => /* @__PURE__ */ D("div", { className: "dots-wrapper", "data-cy": "dots-wrapper", children: t }), Mt = ({
  slideIndex: t,
  customDot: r,
  customActiveDot: a,
  sizeForDefaultDot: i,
  sizeForDefaultActiveDot: s,
  dotColor: u,
  activeDotColor: f,
  handleDotClick: d,
  returnDots: l,
  countShowDots: T
}) => /* @__PURE__ */ D(ct, { children: ut(T).map((v, h) => /* @__PURE__ */ D(
  "div",
  {
    onClick: () => {
      d(h);
    },
    children: r || a ? l(h) : /* @__PURE__ */ D(
      Me,
      {
        index: h,
        slideIndex: t,
        sizeForDefaultDot: i,
        sizeForDefaultActiveDot: s,
        dotColor: u,
        activeDotColor: f
      }
    )
  },
  h
)) }), Lt = [{ left: 0 }], Wt = (t, r) => (t - r) / 2, Nt = (t) => {
  var r;
  return (r = t.current) == null ? void 0 : r.map((a) => ({
    left: (a == null ? void 0 : a.offsetLeft) ?? 0
  }));
}, $t = (t) => {
  const r = Te([]), a = Te(null), [i, s] = x(0), [u, f] = x(0), [d, l] = x(0), [T, v] = x(Lt), h = () => {
    var E, S;
    v(Nt(r)), f(((E = r.current[0]) == null ? void 0 : E.clientWidth) ?? 0), l(((S = a.current) == null ? void 0 : S.clientWidth) ?? 0);
  }, m = fe(() => {
    const E = T[t].left, S = Wt(u, d);
    if (!t)
      return s(E + S);
    s(E + S);
  }, [d, u, T, t]);
  return de(() => {
    h();
  }, []), de(() => {
    m();
  }, [m]), { dotsRef: r, activeDotRef: a, activeDotLeft: i };
}, Bt = ({
  customDot: t,
  slideIndex: r,
  customActiveDot: a,
  dotColor: i,
  sizeForDefaultDot: s,
  sizeForDefaultActiveDot: u,
  activeDotColor: f,
  animationSpeed: d,
  handleDotClick: l,
  countShowDots: T
}) => {
  const { dotsRef: v, activeDotRef: h, activeDotLeft: m } = $t(r);
  return /* @__PURE__ */ ke(ct, { children: [
    ut(T).map((E, S) => /* @__PURE__ */ D(
      "div",
      {
        ref: (F) => v.current[S] = F,
        onClick: () => {
          l(S);
        },
        style: {
          transition: `${d}ms`,
          transform: r === S ? "scale(0)" : "scale(1)"
        },
        children: t ?? /* @__PURE__ */ D(
          Me,
          {
            index: S,
            dotColor: i,
            sizeForDefaultDot: s
          }
        )
      },
      S
    )),
    /* @__PURE__ */ D(
      "div",
      {
        ref: h,
        style: {
          position: "absolute",
          left: m,
          transition: `left ${d}ms`
        },
        children: a ?? /* @__PURE__ */ D(
          it,
          {
            sizeForDefaultActiveDot: u,
            activeDotColor: f
          }
        )
      }
    )
  ] });
}, Ut = 934, Yt = 0.75, Ke = 100, Vt = {
  default: Mt,
  sliding: Bt
};
var Z = /* @__PURE__ */ ((t) => (t.TOP = "top", t.LEFT = "left", t.RIGHT = "right", t.BOTTOM = "bottom", t))(Z || {});
const zt = 1, Ze = 1, qt = 200, Qe = (t) => t.map((r) => ({ ...r, id: jt() })), et = ({
  visibleCountSlides: t,
  current: r = Ut,
  spaceBetween: a
}) => (r + a) / t, Fe = (t, r, a) => {
  const i = Math.round(Math.abs(t / r));
  return Math.abs(i % a.length);
}, Gt = (t, r, a) => {
  r.current = setTimeout(() => {
    a();
  }, t);
}, Ht = (t, r, a) => a && t.length > r, tt = (t) => t.map((r, a) => ({ ...r, key: a })), Jt = (t, r) => {
  switch (t) {
    case Le.FADE_IN:
      return Ft(r);
    default:
      return {};
  }
}, Xt = (t) => t === Le.FADE_IN, rt = ({
  touchEndX: t,
  touchStartX: r
}) => t - r > Ze ? Z.RIGHT : r - t > Ze ? Z.LEFT : null, Kt = (t, r, a) => a || r === 1 ? t.length : Math.round(t.length / r) + zt, Zt = ({
  transform: t,
  slideWidth: r,
  swipedSide: a,
  timeTouch: i,
  isDisableMove: s
}) => {
  const u = t / r, f = Math.round(u) * r;
  return s || kt(i, /* @__PURE__ */ new Date()) > qt ? f : a === Z.LEFT ? Math.floor(u) * r : a === Z.RIGHT ? Math.ceil(u) * r : f;
}, Qt = ({
  setTransform: t,
  slideWidth: r,
  customActiveDot: a,
  customDot: i,
  setAnimation: s,
  activeDotColor: u,
  dotColor: f
}) => {
  const [d, l] = x(0), T = (m) => {
    s(!0), t(-m * r), l(m);
  }, v = (m) => d === m ? a || /* @__PURE__ */ D(it, { activeDotColor: u }) : i || /* @__PURE__ */ D(Me, { index: m, slideIndex: d, dotColor: f }), h = fe(
    (m) => (E, S) => {
      l(
        Fe(
          m ? E - r : E + r,
          r,
          S
        )
      );
    },
    [r]
  );
  return {
    handleDotClick: T,
    returnDots: v,
    slideIndex: d,
    setSlideIndex: l,
    nextDot: h(!0),
    prevDot: h()
  };
}, er = (t, r) => {
  const a = (f) => {
    var d;
    return (d = t.filter((l) => l.maxWidth >= r).at(-1)) == null ? void 0 : d[f];
  }, i = (f) => a("slidesNumber") || f;
  return {
    returnCountSlides: i,
    returnSpaceBetween: (f) => a("spaceBetween") || f,
    getRightSlidesCount: (f, d) => Xt(d) ? 1 : i(f),
    getSwipiUpdatesParam: a
  };
}, tr = ({
  endX: t,
  startX: r,
  config: a,
  movePath: i,
  children: s,
  showArrows: u,
  currentRef: f,
  windowWidth: d,
  slidesNumber: l,
  slidesAnimation: T,
  spaceBetweenSlides: v,
  setMovePath: h
}) => {
  const [m, E] = x(0), { returnSpaceBetween: S, getSwipiUpdatesParam: F, getRightSlidesCount: q } = er(a, d), y = q(l, T), w = S(v), M = Ht(s, y, u), $ = !!F("biasRight"), Y = f == null ? void 0 : f.clientWidth, j = je(
    () => ({
      visibleCountSlides: y,
      spaceBetween: w,
      current: Y
    }),
    [w, y, Y]
  ), k = je(
    () => $ ? et(j) * Yt : et(j),
    [$, j]
  ), V = je(
    () => Qe(M ? At(tt(s), 3) : tt(s)),
    [M, s]
  ), B = -k * s.length;
  return {
    slides: V,
    transform: m,
    slideWidth: k,
    isShowArrows: M,
    spaceBetween: w,
    startTransform: B,
    moveSlides: () => {
      const _ = t && r - t;
      E((C) => C - _ + i), h(_);
    },
    setTransform: E,
    jumpToTheLastSlide: () => {
      const L = -(k * V.length - k * (y === 1 ? 2 : y));
      E(i > 0 ? L : 0);
    },
    checkAreaBeyondSwipi: () => m <= B * 2 - k || m >= k / 2,
    visibleCountSlides: y
  };
}, rr = ({
  endX: t,
  startX: r,
  children: a,
  transform: i,
  slideWidth: s,
  isShowArrows: u,
  startTransform: f,
  setEndX: d,
  setStartX: l,
  moveSlides: T,
  setMovePath: v,
  setAnimation: h,
  setTransform: m,
  setSlideIndex: E,
  checkSwipiCorner: S,
  jumpToTheLastSlide: F,
  checkAreaBeyondSwipi: q,
  isDisableMove: y
}) => {
  const [w, M] = x(!1), [$, Y] = x(/* @__PURE__ */ new Date()), j = () => {
    d(0), v(0), l(0);
  }, k = () => {
    h(!1), m((P) => P ? P - f : f);
  }, V = () => {
    const P = rt({ touchEndX: t, touchStartX: r });
    m((_) => {
      const C = Zt({
        transform: _,
        isDisableMove: y(P === Z.LEFT),
        slideWidth: s,
        timeTouch: $,
        swipedSide: P
      });
      return E(Fe(C, s, a)), C;
    });
  };
  return {
    onStart: u ? (P) => {
      Y(/* @__PURE__ */ new Date()), S() && k(), l(P), M(!0);
    } : () => {
    },
    onMove: u ? (P) => {
      if (!w)
        return;
      const _ = rt({ touchEndX: P, touchStartX: r });
      y(_ === Z.LEFT) || (h(!1), T(), d(P), E(Fe(i, s, a)));
    } : () => {
    },
    onEnd: () => {
      h(!0), V(), q() && F(), j(), M(!1);
    }
  };
}, nt = (t, r) => {
  const [a, i] = x(!1), s = Te(), u = fe(() => {
    a || (i(!0), t(), s.current = setTimeout(() => {
      i(!1);
    }, r));
  }, [a, t, r]);
  return de(() => () => {
    clearTimeout(s.current);
  }, []), u;
}, nr = ({
  autoplay: t,
  autoplaySpeed: r,
  slideIndex: a,
  nextImg: i,
  timeout: s
}) => {
  de(() => {
    if (!t)
      return;
    clearTimeout(s.current), Gt(r, s, i);
    const u = s.current;
    return () => clearTimeout(u);
  }, [r, t, a, i, s]);
}, or = ({
  putInTheInitialPosition: t,
  checkSwipiCorner: r,
  setTransform: a,
  setAnimation: i,
  slideWidth: s,
  children: u,
  isDisableMove: f
}) => {
  const d = (l) => (T) => {
    f(!!l) || (a((v) => (T(v, u), l ? v - s : v + s)), i(!0), r() && t(
      () => a((v) => (T(v, u), l ? v - s : v + s))
    ));
  };
  return {
    nextImg: d(!0),
    prevImg: d()
  };
}, ar = (t) => {
  const r = fe(t, [t]);
  de(() => (window.addEventListener("resize", r), () => {
    window.removeEventListener("resize", r);
  }), [r]);
}, sr = ({
  config: t,
  children: r,
  autoplay: a,
  dotColor: i,
  customDot: s,
  showArrows: u,
  slidesNumber: f,
  autoplaySpeed: d,
  dotsAnimation: l,
  activeDotColor: T,
  slidesAnimation: v,
  customActiveDot: h,
  spaceBetweenSlides: m,
  loop: E
}) => {
  const [S, F] = x(0), [q, y] = x(!1), [w, M] = x(null), [$, Y] = x(0), [j, k] = x(0), [V, B] = x(0), J = Te(), X = Te(null), {
    slides: P,
    transform: _,
    slideWidth: C,
    isShowArrows: L,
    spaceBetween: Q,
    startTransform: z,
    moveSlides: ee,
    setTransform: W,
    jumpToTheLastSlide: te,
    checkAreaBeyondSwipi: re,
    visibleCountSlides: K
  } = tr({
    endX: $,
    startX: j,
    config: t,
    children: r,
    movePath: V,
    currentRef: w,
    showArrows: u,
    windowWidth: S,
    slidesNumber: f,
    slidesAnimation: v,
    spaceBetweenSlides: m,
    setMovePath: B
  }), {
    slideIndex: G,
    nextDot: ne,
    prevDot: ve,
    returnDots: pe,
    setSlideIndex: oe,
    handleDotClick: ae
  } = Qt({
    dotColor: i,
    customDot: s,
    slideWidth: C,
    dotsAnimation: l,
    activeDotColor: T,
    customActiveDot: h,
    setAnimation: y,
    setTransform: W,
    loop: E
  }), ge = () => G + K === r.length, se = () => G === 0, he = () => (U) => !!(U && ge() && !E || !U && se() && !E), me = fe(
    () => _ <= z * 2 + C / 2 || _ >= -C / 2,
    [_, C, z]
  ), we = fe(
    (U) => {
      W(z), y(!1);
      const De = setTimeout(() => {
        U == null || U(), y(!0);
      }, 1);
      return () => clearTimeout(De);
    },
    [z, y, W]
  ), { onEnd: _e, onMove: ie, onStart: ue } = rr({
    startX: j,
    endX: $,
    children: r,
    transform: _,
    slideWidth: C,
    isShowArrows: L,
    startTransform: z,
    setEndX: Y,
    setStartX: k,
    moveSlides: ee,
    setMovePath: B,
    setAnimation: y,
    setTransform: W,
    setSlideIndex: oe,
    checkSwipiCorner: me,
    jumpToTheLastSlide: te,
    checkAreaBeyondSwipi: re,
    isDisableMove: he()
  }), { nextImg: be, prevImg: Se } = or({
    children: r,
    slideWidth: C,
    setTransform: W,
    setAnimation: y,
    checkSwipiCorner: me,
    putInTheInitialPosition: we,
    isDisableMove: he()
  });
  return nr({
    timeout: J,
    autoplay: a,
    slideIndex: G,
    autoplaySpeed: d,
    nextImg: () => be(ne)
  }), ar(() => {
    F(window.innerWidth), y(!1), oe(0), W(0);
  }), de(() => {
    F(window.innerWidth), M(X.current);
  }, []), {
    slides: P,
    animation: q,
    transform: _,
    slideIndex: G,
    slideWidth: C,
    isShowArrows: L,
    spaceBetween: Q,
    slidesWrapperRef: X,
    Dots: Vt[l],
    onEnd: _e,
    onMove: ie,
    onStart: ue,
    returnDots: pe,
    setTransform: W,
    setAnimation: y,
    handleDotClick: ae,
    nextImg: nt(() => be(ne), Ke),
    prevImg: nt(() => Se(ve), Ke),
    countShowDots: Kt(r, K, E),
    isDisableButton: he()
  };
}, ir = ({
  slideWidth: t,
  spaceBetween: r,
  children: a,
  animation: i = {}
}) => /* @__PURE__ */ D(
  "div",
  {
    "data-cy": "slide",
    style: {
      boxSizing: "border-box",
      width: `${t}px`,
      paddingRight: `${r}px`,
      ...i
    },
    children: a
  }
), ot = It(
  ({ children: t, onClick: r, className: a, disabled: i }, s) => /* @__PURE__ */ D(
    "button",
    {
      disabled: i,
      className: a,
      ref: s,
      onClick: r,
      type: "button",
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        outline: "none"
      },
      children: t
    }
  )
), ur = ({
  children: t,
  slidesWrapperRef: r,
  startTouchByScreen: a,
  moveTouchScreen: i,
  endTouchScreen: s
}) => /* @__PURE__ */ D(
  "div",
  {
    "data-cy": "slides-wrapper",
    ref: r,
    onTouchStart: (u) => a(u.touches[0].clientX),
    onTouchMove: (u) => i(u.touches[0].clientX),
    onTouchEnd: s,
    onMouseDown: (u) => a(u.clientX),
    onMouseMove: (u) => i(u.clientX),
    onMouseUp: s,
    onMouseLeave: s,
    style: {
      height: "100%",
      width: "100%",
      overflow: "hidden"
    },
    children: t
  }
), cr = ({ children: t }) => /* @__PURE__ */ D(
  "div",
  {
    style: {
      display: "flex",
      alignItems: "center",
      width: "100%"
    },
    children: t
  }
), lr = ({
  children: t,
  transform: r,
  animation: a,
  animationSpeed: i
}) => {
  const [s, u] = x(!1), f = () => u(!0), d = () => u(!1);
  return console.log(t), /* @__PURE__ */ D(
    "div",
    {
      onDragStart: (l) => {
        l.preventDefault();
      },
      onMouseDown: f,
      onMouseUp: d,
      onMouseLeave: d,
      style: {
        display: "flex",
        width: "fit-content",
        transform: `translate3d(${r}px, 0, 0)`,
        transition: `${a ? `all ${i}ms ease-out 0s` : "0s"}`,
        height: "100%",
        cursor: s ? "grabbing" : "grab"
      },
      children: t
    }
  );
}, fr = ({
  children: t,
  className: r = "",
  ...a
}) => /* @__PURE__ */ D("div", { className: `swipi ${r}`, ...a, children: t });
const vr = ({
  showDots: t,
  dotColor: r,
  customDot: a,
  config: i = [],
  children: s = [],
  activeDotColor: u,
  customActiveDot: f,
  slidesNumber: d = 3,
  nextButton: l = "ᐳ",
  prevButton: T = "ᐸ",
  autoplay: v = !1,
  sizeForDefaultDot: h,
  showArrows: m = !0,
  autoplaySpeed: E = 4e3,
  animationSpeed: S = 300,
  spaceBetweenSlides: F = 0,
  dotsAnimation: q = "default",
  slidesAnimation: y = "default",
  sizeForDefaultActiveDot: w = 13,
  className: M,
  loop: $ = !1
}) => {
  const {
    Dots: Y,
    slides: j,
    animation: k,
    transform: V,
    slideWidth: B,
    slideIndex: J,
    spaceBetween: X,
    isShowArrows: P,
    slidesWrapperRef: _,
    onEnd: C,
    onMove: L,
    nextImg: Q,
    prevImg: z,
    onStart: ee,
    returnDots: W,
    handleDotClick: te,
    countShowDots: re,
    isDisableButton: K
  } = sr({
    config: i,
    children: s,
    dotColor: r,
    autoplay: v,
    customDot: a,
    showArrows: m,
    slidesNumber: d,
    autoplaySpeed: E,
    dotsAnimation: q,
    activeDotColor: u,
    customActiveDot: f,
    slidesAnimation: y,
    spaceBetweenSlides: F,
    loop: $
  });
  return /* @__PURE__ */ ke(fr, { className: M, children: [
    /* @__PURE__ */ ke(cr, { children: [
      /* @__PURE__ */ D(
        ot,
        {
          disabled: K(),
          onClick: z,
          className: "left-button",
          children: P && T
        }
      ),
      /* @__PURE__ */ D(
        ur,
        {
          slidesWrapperRef: _,
          startTouchByScreen: ee,
          moveTouchScreen: L,
          endTouchScreen: C,
          children: /* @__PURE__ */ D(
            lr,
            {
              animation: k,
              transform: V,
              animationSpeed: S,
              children: j == null ? void 0 : j.map(({ id: G, key: ne }, ve) => /* @__PURE__ */ D(
                ir,
                {
                  slideWidth: B,
                  spaceBetween: X,
                  animation: Jt(
                    y,
                    ne === J
                  ),
                  children: j[ve]
                },
                G
              ))
            }
          )
        }
      ),
      /* @__PURE__ */ D(
        ot,
        {
          disabled: K(!0),
          onClick: Q,
          className: "right-button",
          children: P && l
        }
      )
    ] }),
    t && /* @__PURE__ */ D(
      Y,
      {
        countShowDots: re,
        dotColor: r,
        customDot: a,
        slideIndex: J,
        activeDotColor: u,
        animationSpeed: S,
        customActiveDot: f,
        sizeForDefaultDot: h,
        sizeForDefaultActiveDot: w,
        handleDotClick: te,
        returnDots: W
      }
    )
  ] });
};
export {
  vr as default
};
