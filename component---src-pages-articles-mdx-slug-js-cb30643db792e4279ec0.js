(self.webpackChunkkuaiq_blog=self.webpackChunkkuaiq_blog||[]).push([[783],{7228:function(e){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n},e.exports.__esModule=!0,e.exports.default=e.exports},3646:function(e,t,r){var n=r(7228);e.exports=function(e){if(Array.isArray(e))return n(e)},e.exports.__esModule=!0,e.exports.default=e.exports},9100:function(e,t,r){var n=r(9489),o=r(7067);function a(t,r,c){return o()?(e.exports=a=Reflect.construct,e.exports.__esModule=!0,e.exports.default=e.exports):(e.exports=a=function(e,t,r){var o=[null];o.push.apply(o,t);var a=new(Function.bind.apply(e,o));return r&&n(a,r.prototype),a},e.exports.__esModule=!0,e.exports.default=e.exports),a.apply(null,arguments)}e.exports=a,e.exports.__esModule=!0,e.exports.default=e.exports},9713:function(e){e.exports=function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e},e.exports.__esModule=!0,e.exports.default=e.exports},7067:function(e){e.exports=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}},e.exports.__esModule=!0,e.exports.default=e.exports},6860:function(e){e.exports=function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)},e.exports.__esModule=!0,e.exports.default=e.exports},8206:function(e){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},e.exports.__esModule=!0,e.exports.default=e.exports},319:function(e,t,r){var n=r(3646),o=r(6860),a=r(379),c=r(8206);e.exports=function(e){return n(e)||o(e)||a(e)||c()},e.exports.__esModule=!0,e.exports.default=e.exports},379:function(e,t,r){var n=r(7228);e.exports=function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}},e.exports.__esModule=!0,e.exports.default=e.exports},6725:function(e,t,r){var n=r(3395);e.exports={MDXRenderer:n}},3395:function(e,t,r){var n=r(9100),o=r(319),a=r(9713),c=r(7316),l=["scope","children"];function u(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?u(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var s=r(7294),f=r(4983).mdx,p=r(9480).useMDXScope;e.exports=function(e){var t=e.scope,r=e.children,a=c(e,l),u=p(t),d=s.useMemo((function(){if(!r)return null;var e=i({React:s,mdx:f},u),t=Object.keys(e),a=t.map((function(t){return e[t]}));return n(Function,["_fn"].concat(o(t),[""+r])).apply(void 0,[{}].concat(o(a)))}),[r,t]);return s.createElement(d,i({},a))}},9291:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return b}});var n=r(7294),o=r(3059),a=r(6725),c=r(4647),l=r(7991),u=r(3493),i=r.n(u);function s(){var e=(0,n.useState)(0),t=e[0],r=e[1];return(0,n.useEffect)((function(){var e=i()((function(){var e=document.body.scrollHeight-document.documentElement.clientHeight,t=document.documentElement.scrollTop,n=Math.floor(t/e*100);r(Math.min(100,Math.max(0,n)))}),200);return window.addEventListener("scroll",e),function(){window.removeEventListener("scroll",e)}}),[]),n.createElement("div",{className:"progresser",onClick:function(){window.scrollTo({top:0,behavior:"smooth"})}},t)}var f=r(3279),p=r.n(f);function d(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(r)return(r=r.call(e)).next.bind(r);if(Array.isArray(e)||(r=function(e,t){if(!e)return;if("string"==typeof e)return m(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return m(e,t)}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0;return function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function m(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function v(e){var t=e.headers,r=(0,n.useRef)(),o=(0,n.useState)(0),a=o[0],c=o[1];return(0,n.useEffect)((function(){var e=p()((function(){for(var e,n=0,o=d(t);!(e=o()).done;){if(e.value.target.getBoundingClientRect().top>0)break;n++}n=Math.min(t.length-1,n),c(n);var a=document.getElementById("header-number-"+n);a&&r.current.scrollTo({behavior:"smooth",top:a.offsetTop-200})}),150);return document.addEventListener("scroll",e),function(){return document.removeEventListener("scroll",e)}}),[]),n.createElement("div",{className:"table-of-content",ref:r},t.map((function(e,t){return n.createElement("p",{className:"header-level-"+e.level+" "+(a===t?"topHeader":""),id:"header-number-"+t,key:t,onClick:function(t){!function(e,t){r.current.scrollTo({behavior:"smooth",top:e.target.offsetTop-200}),t.target.scrollIntoView()}(t,e)}},e.label)})))}var y=r(1335);function b(e){var t=e.data,r=t.mdx,u=(0,n.useState)([]),i=u[0],f=u[1];return(0,n.useEffect)((function(){document.title=r.frontmatter.title;var e=document.querySelectorAll(".article-body a");null==e||e.forEach((function(e){return e.target="_blank"}));var t=document.querySelectorAll(".article-body h1, .article-body h2, .article-body h3"),n=Array.from(t).map((function(e,t){return e.setAttribute("name",t),{level:e.localName,name:"header-"+t,label:e.textContent,target:e}}));f(n);var o=function(e){var t=e.target;t.matches("h1, h2, h3")&&t.scrollIntoView({behavior:"smooth"})};return document.addEventListener("click",o),function(){document.removeEventListener("click",o)}}),[t]),n.createElement(o.Z,null,n.createElement(s,null),n.createElement("div",{className:"article-body"},n.createElement("h1",{className:"article-title"},r.frontmatter.title),n.createElement("p",{className:"article-meta"},n.createElement("span",null,n.createElement(c.Z,null)," ",r.frontmatter.date," | ",n.createElement(l.Z,null)," ",100*Math.round(40*r.wordCount.sentences/100),"words ",Math.round(r.wordCount.sentences/7),"min")),n.createElement("img",{className:"article-cover",src:r.frontmatter.cover,alt:r.frontmatter.cover}),n.createElement(a.MDXRenderer,null,r.body)),n.createElement(y.Z,{currArticle:r}),i.length&&n.createElement(v,{headers:i}))}},3493:function(e,t,r){var n=r(3279),o=r(3218);e.exports=function(e,t,r){var a=!0,c=!0;if("function"!=typeof e)throw new TypeError("Expected a function");return o(r)&&(a="leading"in r?!!r.leading:a,c="trailing"in r?!!r.trailing:c),n(e,t,{leading:a,maxWait:t,trailing:c})}}}]);
//# sourceMappingURL=component---src-pages-articles-mdx-slug-js-cb30643db792e4279ec0.js.map