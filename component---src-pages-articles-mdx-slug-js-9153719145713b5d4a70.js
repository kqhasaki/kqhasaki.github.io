(self.webpackChunkkuaiq_blog=self.webpackChunkkuaiq_blog||[]).push([[783],{7228:function(e){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n},e.exports.__esModule=!0,e.exports.default=e.exports},3646:function(e,t,r){var n=r(7228);e.exports=function(e){if(Array.isArray(e))return n(e)},e.exports.__esModule=!0,e.exports.default=e.exports},9100:function(e,t,r){var n=r(9489),o=r(7067);function c(t,r,i){return o()?(e.exports=c=Reflect.construct,e.exports.__esModule=!0,e.exports.default=e.exports):(e.exports=c=function(e,t,r){var o=[null];o.push.apply(o,t);var c=new(Function.bind.apply(e,o));return r&&n(c,r.prototype),c},e.exports.__esModule=!0,e.exports.default=e.exports),c.apply(null,arguments)}e.exports=c,e.exports.__esModule=!0,e.exports.default=e.exports},9713:function(e){e.exports=function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e},e.exports.__esModule=!0,e.exports.default=e.exports},7067:function(e){e.exports=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}},e.exports.__esModule=!0,e.exports.default=e.exports},6860:function(e){e.exports=function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)},e.exports.__esModule=!0,e.exports.default=e.exports},8206:function(e){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},e.exports.__esModule=!0,e.exports.default=e.exports},319:function(e,t,r){var n=r(3646),o=r(6860),c=r(379),i=r(8206);e.exports=function(e){return n(e)||o(e)||c(e)||i()},e.exports.__esModule=!0,e.exports.default=e.exports},379:function(e,t,r){var n=r(7228);e.exports=function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}},e.exports.__esModule=!0,e.exports.default=e.exports},6725:function(e,t,r){var n=r(3395);e.exports={MDXRenderer:n}},3395:function(e,t,r){var n=r(9100),o=r(319),c=r(9713),i=r(7316),a=["scope","children"];function u(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?u(Object(r),!0).forEach((function(t){c(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var s=r(7294),f=r(4983).mdx,d=r(9480).useMDXScope;e.exports=function(e){var t=e.scope,r=e.children,c=i(e,a),u=d(t),p=s.useMemo((function(){if(!r)return null;var e=l({React:s,mdx:f},u),t=Object.keys(e),c=t.map((function(t){return e[t]}));return n(Function,["_fn"].concat(o(t),[""+r])).apply(void 0,[{}].concat(o(c)))}),[r,t]);return s.createElement(p,l({},c))}},3642:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return M}});var n=r(7294),o=r(2883),c=r(6725),i=r(1413),a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M928 161H699.2c-49.1 0-97.1 14.1-138.4 40.7L512 233l-48.8-31.3A255.2 255.2 0 00324.8 161H96c-17.7 0-32 14.3-32 32v568c0 17.7 14.3 32 32 32h228.8c49.1 0 97.1 14.1 138.4 40.7l44.4 28.6c1.3.8 2.8 1.3 4.3 1.3s3-.4 4.3-1.3l44.4-28.6C602 807.1 650.1 793 699.2 793H928c17.7 0 32-14.3 32-32V193c0-17.7-14.3-32-32-32zM324.8 721H136V233h188.8c35.4 0 69.8 10.1 99.5 29.2l48.8 31.3 6.9 4.5v462c-47.6-25.6-100.8-39-155.2-39zm563.2 0H699.2c-54.4 0-107.6 13.4-155.2 39V298l6.9-4.5 48.8-31.3c29.7-19.1 64.1-29.2 99.5-29.2H888v488zM396.9 361H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm223.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c0-4.1-3.2-7.5-7.1-7.5H627.1c-3.9 0-7.1 3.4-7.1 7.5zM396.9 501H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm416 0H627.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5z"}}]},name:"read",theme:"outlined"},u=r(7190),l=function(e,t){return n.createElement(u.Z,(0,i.Z)((0,i.Z)({},e),{},{ref:t,icon:a}))};l.displayName="ReadOutlined";var s=n.forwardRef(l),f=r(4647),d=r(3493),p=r.n(d);function m(){var e=(0,n.useState)(0),t=e[0],r=e[1];return(0,n.useEffect)((function(){var e=p()((function(){var e=document.body.scrollHeight-document.documentElement.clientHeight,t=document.documentElement.scrollTop,n=Math.floor(t/e*100);r(Math.min(100,Math.max(0,n)))}),200);return window.addEventListener("scroll",e),function(){window.removeEventListener("scroll",e)}}),[]),n.createElement("div",{className:"progresser",onClick:function(){window.scrollTo({top:0,behavior:"smooth"})}},t)}var v=r(3279),y=r.n(v);function h(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(r)return(r=r.call(e)).next.bind(r);if(Array.isArray(e)||(r=function(e,t){if(!e)return;if("string"==typeof e)return b(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return b(e,t)}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0;return function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function b(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function g(e){var t=e.headers,r=(0,n.useRef)(),o=(0,n.useState)(0),c=o[0],i=o[1];return(0,n.useEffect)((function(){var e=y()((function(){for(var e,n=0,o=h(t);!(e=o()).done;){if(e.value.target.getBoundingClientRect().top>0)break;n++}n=Math.min(t.length-1,n),i(n);var c=document.getElementById("header-number-"+n);c&&r.current.scrollTo({behavior:"smooth",top:c.offsetTop-200})}),150);return document.addEventListener("scroll",e),function(){return document.removeEventListener("scroll",e)}}),[]),(null==t?void 0:t.length)&&n.createElement("div",{className:"table-of-content",ref:r},t.map((function(e,t){return n.createElement("p",{className:"header-level-"+e.level+" "+(c===t?"topHeader":""),id:"header-number-"+t,key:t,onClick:function(t){!function(e,t){r.current.scrollTo({behavior:"smooth",top:e.target.offsetTop-200}),t.target.scrollIntoView()}(t,e)}},e.label)})))}var x=r(5444),E=r(9519),w=r(8014),O={"front-end":"前端杂谈","introduction-to-algorithms":"抄书系列——《算法导论》","redbook-series":"抄书系列——“红宝书”","non-tech":"日常杂谈"};function j(e){var t=e.currArticle,r=(0,n.useState)(!0),o=r[0],c=r[1],i=(0,x.K2)("3605573801").allFile.group.filter((function(e){var r=e.fieldValue;return t.slug.startsWith("non-tech")?"non-tech"===r:"non-tech"!==r}));return(0,n.useEffect)((function(){document.body.style.overflow=o&&document.body.clientWidth<810?"hidden":"initial";var e=y()((function(){window.innerWidth>=810?(document.body.style.overflow="initial",c(!0)):o&&(document.body.style.overflow="hidden")}),150);return window.onresize=e,function(){window.onresize=null}}),[o]),(0,n.useEffect)((function(){document.body.clientWidth<810&&c(!1)}),[]),n.createElement(n.Fragment,null,n.createElement("div",{className:"navigator-switch",onClick:function(){return c(!0)},style:{display:o?"none":"block"}},n.createElement(E.G,{icon:w.Zrf})),n.createElement("div",{className:"article-navigator",style:{display:o?"block":"none"}},n.createElement("div",{className:"article-navigator-toggler",onClick:function(){return c(!1)}},n.createElement(E.G,{icon:w.g82})),i.map((function(e,r){var o=O[e.fieldValue],c=e.nodes.map((function(e){var t=e.childMdx;return{slug:t.slug,title:t.frontmatter.title}})).sort((function(e,t){return e.slug.localeCompare(t.slug)}));return n.createElement(n.Fragment,{key:r},n.createElement("h4",null,o),c.map((function(e,r){var o=e.slug,c=e.title;return n.createElement("p",{key:r,onClick:function(){return(0,x.c4)("/articles/"+o)},title:c,className:t.slug===o?"highlighted-navigator-item":""},c)})))}))))}function M(e){var t=e.data,r=t.mdx,i=(0,n.useState)([]),a=i[0],u=i[1];return(0,n.useEffect)((function(){document.title=r.frontmatter.title;var e=document.querySelectorAll(".article-body a");null==e||e.forEach((function(e){return e.target="_blank"}));var t=document.querySelectorAll(".article-body h1, .article-body h2, .article-body h3"),n=Array.from(t).map((function(e,t){return e.setAttribute("name",t),{level:e.localName,name:"header-"+t,label:e.textContent,target:e}}));u(n);var o=function(e){var t=e.target;t.matches("h1, h2, h3")&&t.scrollIntoView({behavior:"smooth"})};return document.addEventListener("click",o),function(){document.removeEventListener("click",o)}}),[t]),n.createElement(o.Z,null,n.createElement(m,null),n.createElement("div",{className:"article-body"},n.createElement("h1",{className:"article-title"},r.frontmatter.title),n.createElement("p",{className:"article-meta"},n.createElement("span",null,n.createElement(f.Z,null)," ",r.frontmatter.date," | ",n.createElement(s,null)," ",100*Math.round(40*r.wordCount.sentences/100),"words ",Math.round(r.wordCount.sentences/7),"min")),n.createElement("img",{className:"article-cover",src:r.frontmatter.cover,alt:r.frontmatter.cover}),n.createElement(c.MDXRenderer,null,r.body)),n.createElement(j,{currArticle:r}),a.length&&n.createElement(g,{headers:a}))}},2705:function(e,t,r){var n=r(5639).Symbol;e.exports=n},4239:function(e,t,r){var n=r(2705),o=r(9607),c=r(2333),i=n?n.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":i&&i in Object(e)?o(e):c(e)}},7561:function(e,t,r){var n=r(7990),o=/^\s+/;e.exports=function(e){return e?e.slice(0,n(e)+1).replace(o,""):e}},1957:function(e,t,r){var n="object"==typeof r.g&&r.g&&r.g.Object===Object&&r.g;e.exports=n},9607:function(e,t,r){var n=r(2705),o=Object.prototype,c=o.hasOwnProperty,i=o.toString,a=n?n.toStringTag:void 0;e.exports=function(e){var t=c.call(e,a),r=e[a];try{e[a]=void 0;var n=!0}catch(u){}var o=i.call(e);return n&&(t?e[a]=r:delete e[a]),o}},2333:function(e){var t=Object.prototype.toString;e.exports=function(e){return t.call(e)}},5639:function(e,t,r){var n=r(1957),o="object"==typeof self&&self&&self.Object===Object&&self,c=n||o||Function("return this")();e.exports=c},7990:function(e){var t=/\s/;e.exports=function(e){for(var r=e.length;r--&&t.test(e.charAt(r)););return r}},3279:function(e,t,r){var n=r(3218),o=r(7771),c=r(4841),i=Math.max,a=Math.min;e.exports=function(e,t,r){var u,l,s,f,d,p,m=0,v=!1,y=!1,h=!0;if("function"!=typeof e)throw new TypeError("Expected a function");function b(t){var r=u,n=l;return u=l=void 0,m=t,f=e.apply(n,r)}function g(e){return m=e,d=setTimeout(E,t),v?b(e):f}function x(e){var r=e-p;return void 0===p||r>=t||r<0||y&&e-m>=s}function E(){var e=o();if(x(e))return w(e);d=setTimeout(E,function(e){var r=t-(e-p);return y?a(r,s-(e-m)):r}(e))}function w(e){return d=void 0,h&&u?b(e):(u=l=void 0,f)}function O(){var e=o(),r=x(e);if(u=arguments,l=this,p=e,r){if(void 0===d)return g(p);if(y)return clearTimeout(d),d=setTimeout(E,t),b(p)}return void 0===d&&(d=setTimeout(E,t)),f}return t=c(t)||0,n(r)&&(v=!!r.leading,s=(y="maxWait"in r)?i(c(r.maxWait)||0,t):s,h="trailing"in r?!!r.trailing:h),O.cancel=function(){void 0!==d&&clearTimeout(d),m=0,u=p=l=d=void 0},O.flush=function(){return void 0===d?f:w(o())},O}},3218:function(e){e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},7005:function(e){e.exports=function(e){return null!=e&&"object"==typeof e}},3448:function(e,t,r){var n=r(4239),o=r(7005);e.exports=function(e){return"symbol"==typeof e||o(e)&&"[object Symbol]"==n(e)}},7771:function(e,t,r){var n=r(5639);e.exports=function(){return n.Date.now()}},3493:function(e,t,r){var n=r(3279),o=r(3218);e.exports=function(e,t,r){var c=!0,i=!0;if("function"!=typeof e)throw new TypeError("Expected a function");return o(r)&&(c="leading"in r?!!r.leading:c,i="trailing"in r?!!r.trailing:i),n(e,t,{leading:c,maxWait:t,trailing:i})}},4841:function(e,t,r){var n=r(7561),o=r(3218),c=r(3448),i=/^[-+]0x[0-9a-f]+$/i,a=/^0b[01]+$/i,u=/^0o[0-7]+$/i,l=parseInt;e.exports=function(e){if("number"==typeof e)return e;if(c(e))return NaN;if(o(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=o(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=n(e);var r=a.test(e);return r||u.test(e)?l(e.slice(2),r?2:8):i.test(e)?NaN:+e}}}]);
//# sourceMappingURL=component---src-pages-articles-mdx-slug-js-9153719145713b5d4a70.js.map