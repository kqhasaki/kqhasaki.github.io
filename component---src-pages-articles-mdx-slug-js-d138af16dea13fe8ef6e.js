(self.webpackChunkkuaiq_blog=self.webpackChunkkuaiq_blog||[]).push([[783],{7228:function(e){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n},e.exports.__esModule=!0,e.exports.default=e.exports},3646:function(e,t,r){var n=r(7228);e.exports=function(e){if(Array.isArray(e))return n(e)},e.exports.__esModule=!0,e.exports.default=e.exports},9100:function(e,t,r){var n=r(9489),o=r(7067);function i(t,r,a){return o()?(e.exports=i=Reflect.construct,e.exports.__esModule=!0,e.exports.default=e.exports):(e.exports=i=function(e,t,r){var o=[null];o.push.apply(o,t);var i=new(Function.bind.apply(e,o));return r&&n(i,r.prototype),i},e.exports.__esModule=!0,e.exports.default=e.exports),i.apply(null,arguments)}e.exports=i,e.exports.__esModule=!0,e.exports.default=e.exports},9713:function(e){e.exports=function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e},e.exports.__esModule=!0,e.exports.default=e.exports},7067:function(e){e.exports=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}},e.exports.__esModule=!0,e.exports.default=e.exports},6860:function(e){e.exports=function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)},e.exports.__esModule=!0,e.exports.default=e.exports},8206:function(e){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},e.exports.__esModule=!0,e.exports.default=e.exports},319:function(e,t,r){var n=r(3646),o=r(6860),i=r(379),a=r(8206);e.exports=function(e){return n(e)||o(e)||i(e)||a()},e.exports.__esModule=!0,e.exports.default=e.exports},379:function(e,t,r){var n=r(7228);e.exports=function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}},e.exports.__esModule=!0,e.exports.default=e.exports},6725:function(e,t,r){var n=r(3395);e.exports={MDXRenderer:n}},3395:function(e,t,r){var n=r(9100),o=r(319),i=r(9713),a=r(7316),c=["scope","children"];function u(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?u(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var s=r(7294),f=r(4983).mdx,d=r(9480).useMDXScope;e.exports=function(e){var t=e.scope,r=e.children,i=a(e,c),u=d(t),p=s.useMemo((function(){if(!r)return null;var e=l({React:s,mdx:f},u),t=Object.keys(e),i=t.map((function(t){return e[t]}));return n(Function,["_fn"].concat(o(t),[""+r])).apply(void 0,[{}].concat(o(i)))}),[r,t]);return s.createElement(p,l({},i))}},2150:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return E}});var n=r(7294),o=r(3059),i=r(6725),a=r(4647),c=r(7991),u=r(3493),l=r.n(u);function s(){var e=(0,n.useState)(0),t=e[0],r=e[1];return(0,n.useEffect)((function(){var e=l()((function(){var e=document.body.scrollHeight-document.documentElement.clientHeight,t=document.documentElement.scrollTop,n=Math.floor(t/e*100);r(Math.min(100,Math.max(0,n)))}),200);return window.addEventListener("scroll",e),function(){window.removeEventListener("scroll",e)}}),[]),n.createElement("div",{className:"progresser",onClick:function(){window.scrollTo({top:0,behavior:"smooth"})}},t)}var f=r(3279),d=r.n(f);function p(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(r)return(r=r.call(e)).next.bind(r);if(Array.isArray(e)||(r=function(e,t){if(!e)return;if("string"==typeof e)return m(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return m(e,t)}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0;return function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function m(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function v(e){var t=e.headers,r=(0,n.useRef)(),o=(0,n.useState)(0),i=o[0],a=o[1];return(0,n.useEffect)((function(){var e=d()((function(){for(var e,n=0,o=p(t);!(e=o()).done;){if(e.value.target.getBoundingClientRect().top>0)break;n++}n=Math.min(t.length-1,n),a(n);var i=document.getElementById("header-number-"+n);i&&r.current.scrollTo({behavior:"smooth",top:i.offsetTop-200})}),150);return document.addEventListener("scroll",e),function(){return document.removeEventListener("scroll",e)}}),[]),(null==t?void 0:t.length)&&n.createElement("div",{className:"table-of-content",ref:r},t.map((function(e,t){return n.createElement("p",{className:"header-level-"+e.level+" "+(i===t?"topHeader":""),id:"header-number-"+t,key:t,onClick:function(t){!function(e,t){r.current.scrollTo({behavior:"smooth",top:e.target.offsetTop-200}),t.target.scrollIntoView()}(t,e)}},e.label)})))}var y=r(5444),b=r(9519),h=r(8014),g={"front-end":"前端杂谈","algorithms-and-leetcode":"数据结构和算法","redbook-series":"JavaScript高级程序设计","non-tech":"日常杂谈","electron-docs":"electron"};function x(e){var t=e.currArticle,r=(0,n.useState)(!0),o=r[0],i=r[1],a=(0,y.useStaticQuery)("3605573801").allFile.group.filter((function(e){var r=e.fieldValue;return t.slug.startsWith("non-tech")?"non-tech"===r:"non-tech"!==r}));return(0,n.useEffect)((function(){document.body.style.overflow=o&&document.body.clientWidth<900?"hidden":"initial";var e=d()((function(){window.innerWidth>=900?(document.body.style.overflow="initial",i(!0)):o&&(document.body.style.overflow="hidden")}),150);return window.onresize=e,function(){window.onresize=null}}),[o]),(0,n.useEffect)((function(){document.body.clientWidth<900&&i(!1)}),[]),n.createElement(n.Fragment,null,n.createElement("div",{className:"navigator-switch",onClick:function(){return i(!0)},style:{display:o?"none":"block"}},n.createElement(b.G,{icon:h.Zrf})),n.createElement("div",{className:"article-navigator",style:{display:o?"block":"none"}},n.createElement("div",{className:"article-navigator-toggler",onClick:function(){return i(!1)}},n.createElement(b.G,{icon:h.g82})),a.map((function(e,r){var o=g[e.fieldValue],i=e.nodes.map((function(e){var t=e.childMdx;return{slug:t.slug,title:t.frontmatter.title}})).sort((function(e,t){return e.slug.localeCompare(t.slug)}));return n.createElement(n.Fragment,{key:r},n.createElement("h4",null,o),i.map((function(e,r){var o=e.slug,i=e.title;return n.createElement("p",{key:r,onClick:function(){return(0,y.navigate)("/articles/"+o)},title:i,className:t.slug===o?"highlighted-navigator-item":""},i)})))}))))}function E(e){var t=e.data,r=t.mdx,u=(0,n.useState)([]),l=u[0],f=u[1];return(0,n.useEffect)((function(){document.title=r.frontmatter.title;var e=document.querySelectorAll(".article-body a");null==e||e.forEach((function(e){return e.target="_blank"}));var t=document.querySelectorAll(".article-body h1, .article-body h2, .article-body h3"),n=Array.from(t).map((function(e,t){return e.setAttribute("name",t),{level:e.localName,name:"header-"+t,label:e.textContent,target:e}}));f(n);var o=function(e){var t=e.target;t.matches("h1, h2, h3")&&t.scrollIntoView({behavior:"smooth"})};return document.addEventListener("click",o),function(){document.removeEventListener("click",o)}}),[t]),n.createElement(o.Z,null,n.createElement(s,null),n.createElement("div",{className:"article-body"},n.createElement("h1",{className:"article-title"},r.frontmatter.title),n.createElement("p",{className:"article-meta"},n.createElement("span",null,n.createElement(a.Z,null)," ",r.frontmatter.date," | ",n.createElement(c.Z,null)," ",100*Math.round(40*r.wordCount.sentences/100),"words ",Math.round(r.wordCount.sentences/7),"min")),n.createElement("img",{className:"article-cover",src:r.frontmatter.cover,alt:r.frontmatter.cover}),n.createElement(i.MDXRenderer,null,r.body)),n.createElement(x,{currArticle:r}),l.length&&n.createElement(v,{headers:l}))}},2705:function(e,t,r){var n=r(5639).Symbol;e.exports=n},4239:function(e,t,r){var n=r(2705),o=r(9607),i=r(2333),a=n?n.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":a&&a in Object(e)?o(e):i(e)}},7561:function(e,t,r){var n=r(7990),o=/^\s+/;e.exports=function(e){return e?e.slice(0,n(e)+1).replace(o,""):e}},1957:function(e,t,r){var n="object"==typeof r.g&&r.g&&r.g.Object===Object&&r.g;e.exports=n},9607:function(e,t,r){var n=r(2705),o=Object.prototype,i=o.hasOwnProperty,a=o.toString,c=n?n.toStringTag:void 0;e.exports=function(e){var t=i.call(e,c),r=e[c];try{e[c]=void 0;var n=!0}catch(u){}var o=a.call(e);return n&&(t?e[c]=r:delete e[c]),o}},2333:function(e){var t=Object.prototype.toString;e.exports=function(e){return t.call(e)}},5639:function(e,t,r){var n=r(1957),o="object"==typeof self&&self&&self.Object===Object&&self,i=n||o||Function("return this")();e.exports=i},7990:function(e){var t=/\s/;e.exports=function(e){for(var r=e.length;r--&&t.test(e.charAt(r)););return r}},3279:function(e,t,r){var n=r(3218),o=r(7771),i=r(4841),a=Math.max,c=Math.min;e.exports=function(e,t,r){var u,l,s,f,d,p,m=0,v=!1,y=!1,b=!0;if("function"!=typeof e)throw new TypeError("Expected a function");function h(t){var r=u,n=l;return u=l=void 0,m=t,f=e.apply(n,r)}function g(e){return m=e,d=setTimeout(E,t),v?h(e):f}function x(e){var r=e-p;return void 0===p||r>=t||r<0||y&&e-m>=s}function E(){var e=o();if(x(e))return w(e);d=setTimeout(E,function(e){var r=t-(e-p);return y?c(r,s-(e-m)):r}(e))}function w(e){return d=void 0,b&&u?h(e):(u=l=void 0,f)}function O(){var e=o(),r=x(e);if(u=arguments,l=this,p=e,r){if(void 0===d)return g(p);if(y)return clearTimeout(d),d=setTimeout(E,t),h(p)}return void 0===d&&(d=setTimeout(E,t)),f}return t=i(t)||0,n(r)&&(v=!!r.leading,s=(y="maxWait"in r)?a(i(r.maxWait)||0,t):s,b="trailing"in r?!!r.trailing:b),O.cancel=function(){void 0!==d&&clearTimeout(d),m=0,u=p=l=d=void 0},O.flush=function(){return void 0===d?f:w(o())},O}},3218:function(e){e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},7005:function(e){e.exports=function(e){return null!=e&&"object"==typeof e}},3448:function(e,t,r){var n=r(4239),o=r(7005);e.exports=function(e){return"symbol"==typeof e||o(e)&&"[object Symbol]"==n(e)}},7771:function(e,t,r){var n=r(5639);e.exports=function(){return n.Date.now()}},3493:function(e,t,r){var n=r(3279),o=r(3218);e.exports=function(e,t,r){var i=!0,a=!0;if("function"!=typeof e)throw new TypeError("Expected a function");return o(r)&&(i="leading"in r?!!r.leading:i,a="trailing"in r?!!r.trailing:a),n(e,t,{leading:i,maxWait:t,trailing:a})}},4841:function(e,t,r){var n=r(7561),o=r(3218),i=r(3448),a=/^[-+]0x[0-9a-f]+$/i,c=/^0b[01]+$/i,u=/^0o[0-7]+$/i,l=parseInt;e.exports=function(e){if("number"==typeof e)return e;if(i(e))return NaN;if(o(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=o(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=n(e);var r=c.test(e);return r||u.test(e)?l(e.slice(2),r?2:8):a.test(e)?NaN:+e}}}]);
//# sourceMappingURL=component---src-pages-articles-mdx-slug-js-d138af16dea13fe8ef6e.js.map