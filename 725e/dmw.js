(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{238:function(t,e,n){"use strict";n(75),n(133),n(134),n(139),n(229),n(45),n(161),n(135),n(136),n(125),n(152),n(76),n(131),n(162),n(129),n(127),n(27),n(28),n(49),n(130),n(128),n(149),n(151),n(126);var r=n(191),o=n(179);function i(t){return function(t){if(Array.isArray(t))return a(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return a(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return a(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}e.a=function(t){var e=t.images,n=t.frames,a=e.length,c=n.length;return Promise.all([].concat(i(e.map((function(t,e){return Object(r.b)(t.hash,null,!0).then((function(n){return n.length?t.hash:t.getFileContent(t.sha,e,a).then((function(t){var e=t.split("\n").filter((function(t){return t.match(/^[0-9a-f ]+$/gi)}));return Object(r.c)(e)}))}))}))),i(n.map((function(t,e){return Object(o.a)(t.id).then((function(n){return n?t.id:t.getFileContent(t.sha,e,c).then((function(e){var n=JSON.parse(e,null,2),r=Array(32).fill("f").join(""),a=Array(16).fill(r),c=[].concat(i(n.upper),i(Array(14).fill().map((function(t,e){return[].concat(i(n.left[e]),i(a),i(n.right[e]))})).flat()),i(n.lower));return Object(o.b)(t.id,c)}))}))})))))}},264:function(t,e,n){"use strict";n(75),n(133),n(134),n(139),n(45),n(144),n(46),n(135),n(136),n(125),n(76),n(131),n(129),n(127),n(79),n(77),n(78),n(80),n(48),n(27),n(28),n(49),n(130),n(128),n(149),n(47),n(126);var r=n(211),o=n(178),i=n(196),a=n(179);n(170);function c(t){return function(t){if(Array.isArray(t))return u(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return u(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return u(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var s=function(t,e,n,r){var o=t.images,i=t.frames;return{upload:e.filter((function(t){var e=t.destination;return!o.find((function(t){return t.path===e}))&&!i.find((function(t){return t.path===e}))})),del:[].concat(c(c(o).filter((function(t){var o=t.path;return!n.find((function(t){var e=t.destination;return o===e}))&&!e.find((function(t){var e=t.destination;return o===e}))&&!r.find((function(t){return o.indexOf(t)>=-1}))}))),c(c(i).filter((function(t){var r=t.path;return!n.find((function(t){var e=t.destination;return r===e}))&&!e.find((function(t){var e=t.destination;return r===e}))}))))}},f=(n(152),n(151),n(263));function l(t){return function(t){if(Array.isArray(t))return h(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return h(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return h(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function h(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var p=function(t){var e=Object(f.a)(t);return function(t){var n=[],r=[],o={};t.forEach((function(t){var e=t.hash,i=t.files,a=t.inRepo;r.push.apply(r,l(a.map((function(t){var e=t.path,n=e.split("/")[0];return o[n]=o[n]?o[n]+1:1,{destination:e}})))),n.push.apply(n,l(i.map((function(t){var n=t.blob,r=t.folder,i=function(t){switch(t){case"image/png":return"png";case"image/jpg":case"image/jpeg":return"jpg";case"image/webp":return"webp";case"text/plain":return"txt";case"text/markdown":return"md";case"application/json":case"text/json":return"json";default:return console.warn('unknown file extension for type "'.concat(t,'"')),"none"}}(n.type),a=r||i;return o[a]=o[a]?o[a]+1:1,{destination:"".concat(a,"/").concat(e,".").concat(i),blob:n}}))))}));var i=["## Files in this repo:"].concat(l(Object.keys(o).map((function(t){return" * ".concat(t,": [").concat(o[t],"](/").concat(t,")")})))).join("\n");return e("remote").then((function(t){return n.push({destination:"README.md",blob:new Blob(l(i),{type:"text/plain"})},{destination:"settings.json",blob:new Blob(l(t),{type:"application/json"})}),{toUpload:n.filter(Boolean),toKeep:r.filter(Boolean)}}))}};function d(t){return function(t){if(Array.isArray(t))return b(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return b(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return b(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function b(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function m(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function y(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?m(Object(n),!0).forEach((function(e){g(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):m(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function g(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}e.a=function(t,e,n){var c=t.getState(),u=Object(r.a)(y(y({},c),{},{exportScaleFactors:[1],exportFileTypes:["txt"],exportCropFrame:!1})),f=p(t),l=[],h=c.images.map((function(t){return y(y({},t),{},{inRepo:[e.images.find((function(e){return e.name.substr(0,40)===t.hash}))].filter(Boolean)})})),b=h.length,m=c.frames.map((function(t){return y(y({},t),{},{inRepo:[e.frames.find((function(e){return e.name.match(/^[a-z]+[0-9]+/gi)[0]===t.id}))].filter(Boolean)})})),g=m.length;return Promise.all([].concat(d(h.map((function(t,e){return t.inRepo.length?y(y({},t),{},{inRepo:t.inRepo,files:[]}):n("loadImageTiles (".concat(e+1,"/").concat(b,") ").concat(t.title),3,(function(){return Object(o.a)(c)(t,!0).then((function(e){return e.length?u(Object(i.a)(c,t),t)(e).then((function(e){return y(y({},t),{},{files:e})})):(l.push(t.hash),Promise.resolve(null))}))}))}))),d(m.map((function(t,e){return t.inRepo.length?y(y({},t),{},{inRepo:t.inRepo,files:[]}):n("loadFrameData (".concat(e+1,"/").concat(g,") ").concat(t.id),3,(function(){return Object(a.a)(t.id).then((function(e){return y(y({},t),{},{hash:t.id,files:[{folder:"frames",filename:"",blob:new Blob(new Array(JSON.stringify(e||"{}",null,2)),{type:"application/json"}),title:t.name}]})}))}))}))))).then((function(t){return f(t.filter(Boolean))})).then((function(t){var n=t.toUpload,r=t.toKeep;return s(e,n,r,l)}))}},556:function(t,e){},558:function(t,e){},568:function(t,e){},570:function(t,e){},595:function(t,e){},597:function(t,e){},598:function(t,e){},603:function(t,e){},605:function(t,e){},612:function(t,e){},614:function(t,e){},632:function(t,e){},635:function(t,e){},651:function(t,e){},654:function(t,e){},754:function(t,e,n){"use strict";n.r(e);n(139),n(129),n(27),n(28),n(163);var r=n(228),o=n.n(r),i=n(264),a=n(238),c=(n(75),n(133),n(134),n(45),n(135),n(136),n(125),n(76),n(131),n(197),n(127),n(204),n(77),n(49),n(130),n(128),n(149),n(81),n(91),n(126),n(552)),u=n(234);function s(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var a,c=t[Symbol.iterator]();!(r=(a=c.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==c.return||c.return()}finally{if(o)throw i}}return n}(t,e)||l(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(t){return function(t){if(Array.isArray(t))return h(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||l(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t,e){if(t){if("string"==typeof t)return h(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?h(t,e):void 0}}function h(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function p(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var d,b=function(){function t(e,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.queueCallback=n,this.throttle=30,this.tokens=e;var r=e.accessToken,o=e.accessTokenExpiresAt;this.dbx=new c.Dropbox({clientId:"err6neqzlljod7b",accessToken:r,accessTokenExpiresAt:new Date(o)}),window.dbx=this.dbx,this.requestError=this.requestError.bind(this)}var e,n,r;return e=t,(n=[{key:"addToQueue",value:function(){return this.dbx.auth.getAccessToken()?this.queueCallback.apply(this,arguments):Promise.reject()}},{key:"checkLoginStatus",value:function(){var t=this;return this.dbx.auth.checkAndRefreshAccessToken().catch(this.requestError).then((function(){var e=t.dbx.auth.getAccessToken(),n=t.dbx.auth.getAccessTokenExpiresAt().getTime()-(new Date).getTime();return e&&n>1e3})).catch((function(){return!1}))}},{key:"startAuth",value:function(){this.dbx.auth.getAuthenticationUrl(encodeURIComponent("".concat(window.location.protocol,"//").concat(window.location.host,"/"))).then((function(t){window.location.replace(t)}))}},{key:"requestError",value:function(t){throw t.error.error_summary.startsWith("expired_access_token")&&(this.dbx.auth.setAccessTokenExpiresAt(new Date(0)),this.dbx.auth.setAccessToken(null)),new Error(t)}},{key:"getRemoteContents",value:function(){var t=this,e=["images","frames"];return this.checkLoginStatus().then((function(n){if(!n)throw new Error("not logged in");return t.addToQueue("dbx.filesDownload /settings.json",t.throttle,(function(){return t.dbx.filesDownload({path:"/settings.json"}).catch(t.requestError)})).catch((function(){return{result:{fileBlob:new Blob(f("{}"),{type:"text/plain"})}}})).then((function(n){var r=n.result.fileBlob;return Object(u.a)(r,"text").then((function(t){return JSON.parse(t)})).then((function(n){return Promise.all(e.map((function(e){return t.addToQueue("dbx.filesListFolder /".concat(e),t.throttle,(function(){return t.dbx.filesListFolder({path:"/".concat(e),limit:250,recursive:!0}).catch(t.requestError)})).catch((function(){return{result:{entries:[],has_more:!1}}})).then((function(e){var n=e.result,r=n.entries,o=n.has_more,i=n.cursor;return(o?t.getMoreContents(i,r):Promise.resolve(r)).then((function(t){return t.filter((function(t){return"file"===t[".tag"]}))}))}))}))).then((function(e){var r=s(e,2),o=r[0],i=r[1];return{images:t.augmentFileList("images",o),frames:t.augmentFileList("frames",i),settings:n}}))}))}))}))}},{key:"getMoreContents",value:function(t,e){var n=this;return this.addToQueue("dbx.filesListFolderContinue ".concat(t),this.throttle,(function(){return n.dbx.filesListFolderContinue({cursor:t}).catch(n.requestError)})).then((function(t){var r=t.result,o=r.entries,i=r.has_more,a=r.cursor,c=e.concat(o);return i?n.getMoreContents(a,c):c}))}},{key:"augmentFileList",value:function(t,e){var n=this;return e.map((function(r,o){var i=r.path_lower,a=r.name,c={path:i,name:a,getFileContent:function(){return n.getFileContent(i,o,e.length)}};switch(t){case"images":return Object.assign(c,{hash:a.substr(0,40)});case"frames":return Object.assign(c,{id:a.match(/^[a-z]+[0-9]+/gi)[0]});default:return c}}))}},{key:"getFileContent",value:function(t,e,n){var r=this;return this.addToQueue("dbx.filesDownload (".concat(e+1,"/").concat(n,") ").concat(t),this.throttle,(function(){return r.dbx.filesDownload({path:t}).catch(r.requestError)})).then((function(t){var e=t.result.fileBlob;return Object(u.a)(e,"text")}))}},{key:"upload",value:function(t){var e=this,n=t.upload,r=void 0===n?[]:n,o=t.del,i=void 0===o?[]:o;return Promise.all([r.length?Promise.all(r.map((function(t,n){return e.addToQueue("dbx.filesUpload (".concat(n+1,"/").concat(r.length,") ").concat(t.destination),e.throttle,(function(){return e.dbx.filesUpload({path:"/".concat(t.destination),contents:t.blob,mode:"overwrite"}).catch(e.requestError)})).then((function(t){return t.result}))}))):[],i.length?this.addToQueue("dbx.filesDeleteBatch ".concat(i.length," files"),this.throttle,(function(){return e.dbx.filesDeleteBatch({entries:i.map((function(t){return{path:t.path}}))}).catch(e.requestError)})).then((function(t){var n=t.result.async_job_id;return function t(){return e.addToQueue("dbx.filesDeleteBatchCheck ".concat(n),2e3,(function(){return e.dbx.filesDeleteBatchCheck({async_job_id:n}).catch(e.requestError)})).then((function(e){var n=e.result,r=n[".tag"],o=n.entries;return"in_progress"===r?t():o.map((function(t){return t.metadata}))}))}()})):[]]).then((function(t){var e=s(t,2),n=e[0],r=e[1];console.log({uploaded:n,deleted:r})}))}}])&&p(e.prototype,n),r&&p(e,r),t}(),m=function(){};e.default=function(t,e){var n=new o.a(1,1/0);return(d=new b(e,(m=function(e){return function(r,o,i){return n.add((function(){return new Promise((function(n,a){window.setTimeout((function(){t.dispatch({type:"DROPBOX_LOG_ACTION",payload:{timestamp:(new Date).getTime()/1e3,message:"".concat(e," runs ").concat(r)}}),i().then(n).catch(a)}),o)}))}))}})("Dropbox"))).checkLoginStatus().then((function(n){n?t.dispatch({type:"SET_DROPBOX_STORAGE",payload:e}):t.dispatch({type:"DROPBOX_LOGOUT"})})),function(e){"STORAGE_SYNC_START"===e.type&&"dropbox"===e.payload.storageType?d.getRemoteContents().then((function(n){switch(e.payload.direction){case"up":return Object(i.a)(t,n,m("GBPrinter")).then((function(t){return d.upload(t)}));case"down":return Object(a.a)(n).then((function(e){return t.dispatch({type:"DROPBOX_SETTINGS_IMPORT",payload:n.settings}),e}));default:return Promise.reject(new Error("dropbox sync: wrong sync case"))}})).then((function(e){t.dispatch({type:"STORAGE_SYNC_DONE",payload:{syncResult:e,storageType:"dropbox"}})})).catch((function(e){console.error(e),t.dispatch({type:"ERROR",payload:e.message})})):"DROPBOX_START_AUTH"===e.type&&d.startAuth()}}}}]);