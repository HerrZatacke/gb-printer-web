(self.webpackChunkgb_printer_web=self.webpackChunkgb_printer_web||[]).push([[575],{584:function(t,e,s){"use strict";s.d(e,{dropBoxSyncTool:function(){return j}});var a=s(4353),o=s.n(a),i=s(6344),n=s.n(i),r=s(6727),h=s(7673),c=s(8231),l=s(2388),u=s(7947),d=s(6194),g=s(4783),p=s(7007),m=s(8025),w=s(5431),f=s(6763);const b=encodeURIComponent(`${window.location.protocol}//${window.location.host}${window.location.pathname}`);class y extends p.EventEmitter{queueCallback;throttle;dbx;auth;rootPath;constructor(t,e){super(),this.queueCallback=e,this.throttle=30,this.rootPath=[];const{accessToken:s,expiresAt:a,refreshToken:o,path:i,autoDropboxSync:n}=t;this.setRootPath(i),this.dbx=new g.Dropbox({clientId:"err6neqzlljod7b",accessToken:s,accessTokenExpiresAt:new Date(a||0),refreshToken:o});const r=this.dbx?.auth;if(!r)throw new Error("dbx auth error");this.auth=r,n&&this.startLongPollSettings()}async addToQueue(...t){if(!this.auth.getAccessToken())throw new Error("not logged in");return this.queueCallback(...t)}setRootPath(t=""){this.rootPath=(0,w.A)(t).split("/")}toPath(t){return`/${[...this.rootPath,...t.split("/")].filter(Boolean).join("/")}`}inSettingsPath(t){const e=this.toPath("settings");return(0,w.A)(t.replace(e,""))}async checkLoginStatus(){try{await this.auth.checkAndRefreshAccessToken();const t=this.auth.getAccessToken(),e=this.auth.getAccessTokenExpiresAt().getTime(),s=e-(new Date).getTime();return this.emit("loginDataUpdate",{accessToken:t,expiresAt:e}),!!t&&s>1e3}catch(t){throw this.auth.setAccessTokenExpiresAt(new Date(0)),this.auth.setAccessToken(""),t}}async startAuth(){const t=await this.auth.getAuthenticationUrl(b,void 0,"code","offline",void 0,void 0,!0);window.sessionStorage.setItem("dropboxCodeVerifier",this.auth.getCodeVerifier()),window.location.replace(t)}async codeAuth(t){const e=window.sessionStorage.getItem("dropboxCodeVerifier");if(!e)throw new Error("no codeVerifier");this.auth.setCodeVerifier(e),window.sessionStorage.removeItem("dropboxCodeVerifier");const s=await this.auth.getAccessTokenFromCode(b,t),{refresh_token:a,access_token:o,expires_in:i}=s.result,n=(new Date).getTime()+1e3*i;this.auth.setAccessToken(o),this.auth.setAccessTokenExpiresAt(new Date(n)),this.emit("loginDataUpdate",{refreshToken:a,accessToken:o,expiresAt:n})}async getRemoteContents(t){const e="diff"===t;if(!await this.checkLoginStatus())throw new Error("not logged in");let s;try{const t=(await this.addToQueue("dbx.filesDownload /settings.json",this.throttle,(()=>this.dbx.filesDownload({path:this.toPath("/settings/settings.json")})),e)).result,a=await(0,m.A)(t.fileBlob,m.Z.TEXT);s=JSON.parse(a)}catch(t){s={state:{lastUpdateUTC:0,version:l.A}}}const[a,o]=await Promise.all(["images","frames"].map((async t=>{let s,a,o="";try{const i=await this.addToQueue(`dbx.filesListFolder /${t}`,this.throttle,(()=>this.dbx.filesListFolder({path:this.toPath(`/settings/${t}`),limit:250,recursive:!0})),e);s=i.result.entries,a=i.result.has_more,o=i.result.cursor}catch(t){s=[],a=!1}return a&&(s=s.concat(await this.getMoreContents(o,e))),s.filter((({".tag":t})=>"file"===t))})));return{images:this.augmentFileList("images",a,e),frames:this.augmentFileList("frames",o,e),settings:s}}async getImageContents(){let t,e,s="";try{const a=await this.addToQueue("dbx.filesListFolder /images",this.throttle,(()=>this.dbx.filesListFolder({path:this.toPath("/images"),limit:250,recursive:!0})));t=a.result.entries,e=a.result.has_more,s=a.result.cursor}catch(s){t=[],e=!1}return e&&(t=t.concat(await this.getMoreContents(s))),t.reduce(((t,e)=>"file"===e[".tag"]?[...t,e]:t),[])}async getMoreContents(t,e){let s,a,o="";try{const i=await this.addToQueue(`dbx.filesListFolderContinue ${t}`,this.throttle,(()=>this.dbx.filesListFolderContinue({cursor:t})),e);s=i.result.entries,a=i.result.has_more,o=i.result.cursor}catch(t){s=[],a=!1}return a&&(s=s.concat(await this.getMoreContents(o,e))),s}augmentFileList(t,e,s){return e.map(((a,o)=>{const{path_lower:i,content_hash:n,name:r}=a,h=i?this.inSettingsPath(i):"";let c;switch(t){case"images":case"frames":c=r.split(".")[0];break;default:c="-"}return{path:h,name:r,contentHash:n||"",hash:c,getFileContent:()=>this.getFileContent(h,o,e.length,s)}}))}async getFileContent(t,e,s,a=!1){const o=`dbx.filesDownload (${e+1}/${s}) ${t}`,i=(await this.addToQueue(o,this.throttle,(()=>this.dbx.filesDownload({path:this.toPath(`/settings/${t}`)})),a)).result;return(0,m.A)(i.fileBlob,m.Z.TEXT)}async upload(t,e){const{upload:s,del:a}=t,o=await Promise.all(s.map((async(t,a)=>{const{result:o}=await this.addToQueue(`dbx.filesUpload (${a+1}/${s.length}) ${t.destination}`,this.throttle,(()=>this.dbx.filesUpload({path:this.toPath(`/${e}/${t.destination}`),contents:t.blob,mode:{".tag":"overwrite"}})));return o})));if(!a.length)return{uploaded:o,deleted:[]};const{result:{async_job_id:i}}=await this.addToQueue(`dbx.filesDeleteBatch ${a.length} files`,this.throttle,(()=>this.dbx.filesDeleteBatch({entries:a.map((({path:t})=>({path:this.toPath(`/settings/${t}`)})))}))),n=async()=>{const{result:{".tag":t,entries:e}}=await this.addToQueue(`dbx.filesDeleteBatchCheck ${i}`,2e3,(()=>this.dbx.filesDeleteBatchCheck({async_job_id:i})));return"in_progress"===t?n():e.map((t=>t.metadata))};return{uploaded:o,deleted:await n()}}startLongPollSettings(){f.info("Start dropbox longpolling"),this.dbx.filesListFolderGetLatestCursor({path:this.toPath("/settings"),recursive:!1,include_media_info:!1,include_deleted:!1,include_has_explicit_shared_members:!1}).then((({result:{cursor:t}})=>{const e=()=>this.dbx.filesListFolderLongpoll({cursor:t,timeout:480});return e().then((({result:{changes:t}})=>(f.info("Longpoll info. Changes: ",t),t?(this.emit("settingsChanged"),this.addToQueue("Restart longpolling",this.throttle,(()=>(this.startLongPollSettings(),Promise.resolve(null))),!0)):e())))})).catch((t=>{c.A.getState().setError(t)}))}}var T=y,S=s(6472),A=s(8714);var x=()=>{const t=new URLSearchParams(window.location.search).get("code");return t?(window.history.replaceState({},document.title,"./"),window.location.replace("#/settings/dropbox"),{dropboxCode:t}):{}},C=s(3052),$=s(5534),k=s(5021),L=s.n(k);async function P(t){const e=L()(new Uint8Array(t),4194304),s=await Promise.all(e.map((async t=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new Uint8Array(t)))]))),a=new Uint8Array(s.flat());return[...new Uint8Array(await crypto.subtle.digest("SHA-256",a))].map((t=>t.toString(16).padStart(2,"0"))).join("")}var D=s(3323),B=s(6533),F=s(9200),R=s(3814),U=s(6564),_=s(8222);const v=[],j=(t,e)=>{const{setProgressLog:s,resetProgressLog:a,setSyncBusy:i,setSyncSelect:g}=c.A.getState(),{dismissDialog:p,setDialog:m}=r.A.getState(),w=new(n())(1,1/0),f=t=>(e,a,o,i)=>w.add((async()=>(await(0,R.c)(a),i||s("dropbox",{timestamp:(new Date).getTime()/1e3,message:`${t} runs ${e}`}),o()))),b=new T(d.A.getState().dropboxStorage,f("Dropbox")),y=async t=>{await b.setRootPath(t.path||"/")},k=async t=>{i(!0),g(!1);const{preferredLocale:n}=u.A.getState(),{syncLastUpdate:r}=d.A.getState(),h=await b.getRemoteContents(t);switch(t){case"diff":{if(null===h?.settings?.state?.lastUpdateUTC)break;const t=void 0===h.settings.state?.lastUpdateUTC?Date.now()/1e3:h.settings.state.lastUpdateUTC;d.A.getState().setSyncLastUpdate("dropbox",t),t>r?.local&&m({message:"There is newer content in your dropbox!",questions:()=>[`Your dropbox contains changes from ${(0,$.A)(o()(1e3*t),n)}`,`Your last local update was ${r?.local?(0,$.A)(o()(1e3*r.local),n):"never"}.`,"Do you want to load the changes?"].map(((t,e)=>({label:t,key:`info${e}`,type:U.V.INFO}))),confirm:async()=>{p(0),k("down")},deny:async()=>p(0)});break}case"up":{const t=r?.local||Math.floor((new Date).getTime()/1e3),e=await(0,S.A)(h,t,f("GBPrinter"));await b.upload(e,"settings"),d.A.getState().setSyncLastUpdate("dropbox",t);break}case"down":{const t=await(0,A.Ay)(h);e(t);const s=h.settings?.state?.lastUpdateUTC||0;s&&d.A.getState().setSyncLastUpdate("dropbox",s);break}default:throw new Error("dropbox sync: wrong sync case")}"diff"!==t?s("dropbox",{timestamp:(new Date).getTime()/1e3,message:"."}):a(),i(!1)},L=()=>{k("diff")};d.A.getState().dropboxStorage.autoDropboxSync&&(L(),b.on("settingsChanged",(()=>{L()}))),b.on("loginDataUpdate",(t=>{const{setDropboxStorage:e}=d.A.getState();e(t)}));const{dropboxCode:j}=x();return j&&b.codeAuth(j),d.A.subscribe((t=>t.dropboxStorage),y),{updateSettings:y,startSyncData:k,startSyncImages:async()=>{i(!0),g(!1);const{frames:t,palettes:e,images:a}=l.h.getState(),{exportScaleFactors:o,exportFileTypes:n,handleExportFrame:r}=u.A.getState(),c=h.A.getState(),d=(0,F.S)(a,c),p=(0,D.j)(o,n,r,e),m=(0,B.T)(a,t),w=(await Promise.all(d.map((async(e,s)=>f("Generate images and hashes")(`${s+1}/${d.length}`,10,(async()=>{const s=await m(e.hash),a=t.find((({id:t})=>t===e.frame)),o=a?await(0,_.mZ)(a?.hash):null,i=o?o.upper.length/20:2;if(!s)throw new Error("tiles missing");const n=await p(e)(s,i);return await Promise.all(n.map((async t=>({filename:t.filename,arrayBuffer:await t.blob.arrayBuffer()}))))})))))).flat(),y=(0,C.A)(w),T=await Promise.all(y.map((async t=>({...t,dropboxContentHash:await P(t.arrayBuffer)})))),S=await b.getImageContents(),A=T.reduce(((t,e)=>{const{arrayBuffer:s,dropboxContentHash:a,filename:o}=e;return-1===S.findIndex((({content_hash:t,name:e})=>t===a&&e===o))?[...t,{blob:new Blob([s]),destination:o}]:t}),[]);await b.upload({upload:A,del:[]},"images"),s("dropbox",{timestamp:(new Date).getTime()/1e3,message:"."}),i(!1)},startAuth:()=>b.startAuth(),recoverImageData:async e=>{const{updateImages:s}=t;if(!v.includes(e)){v.push(e);const t=await b.getFileContent(`images/${e}.txt`,0,1,!0);await(0,A._K)(t),s([])}}}}},1069:function(){},3776:function(){},3779:function(){},3814:function(t,e,s){"use strict";s.d(e,{c:function(){return a}});const a=async t=>new Promise((e=>{window.setTimeout(e,t)}))},4688:function(){},5340:function(){},5927:function(t,e,s){"use strict";s.d(e,{gitSyncTool:function(){return C},init:function(){return x}});var a=s(6344),o=s.n(a),i=s(8231),n=s(7947),r=s(6194),h=s(7007),c=s.n(h),l=s(2326),u=s(4353),d=s.n(u),g=s(5534),p=s(8025);class m extends(c()){octoKit;busy;owner;repo;branch;throttle;token;progress;queueLength;addToQueue;getPreferredLocale;constructor(t,e,s){super(),this.octoKit=null,this.busy=!1,this.owner="",this.repo="",this.branch="",this.throttle=10,this.token=null,this.progress=0,this.queueLength=0,this.addToQueue=s,this.getPreferredLocale=e,this.setOctokit(t||{})}setOctokit({use:t,owner:e,repo:s,branch:a,throttle:o,token:i}){if(this.busy||!t||!e||!s||!a||!o||!i)return this.octoKit=null,this.owner="",this.repo="",this.branch="",this.throttle=10,void(this.token=null);this.owner=e,this.repo=s,this.branch=a,this.throttle=Math.max(o,10)||10,this.token=i,this.octoKit=new l.E({auth:i})}progressStart(t){this.queueLength=t+7,this.emit("starting",{progress:0,queueLength:this.queueLength}),this.progressTick()}progressTick(t=!1){this.progress=t?0:this.progress+1,this.emit("progress",{progress:this.progress,queueLength:this.queueLength}),t&&(this.queueLength=0)}async getRepoContents(){this.progressTick();const{data:{commit:{sha:t}}}=await this.addToQueue(`repos.getBranch ${this.branch}`,this.throttle,(()=>this.octoKit?.repos.getBranch({owner:this.owner,repo:this.repo,branch:this.branch}))),{data:{tree:{sha:e}}}=await this.addToQueue(`git.getCommit ${t}`,this.throttle,(()=>this.octoKit?.git.getCommit({owner:this.owner,repo:this.repo,commit_sha:t}))),{data:{tree:s}}=await this.addToQueue(`git.getTree ${e}`,this.throttle,(()=>this.octoKit?.git.getTree({owner:this.owner,repo:this.repo,tree_sha:e,recursive:"1"}))),a=s.find((({path:t})=>"settings.json"===t)),o=this.augmentFileList("images",s.filter((({path:t})=>t?.startsWith("images/")))),i=this.augmentFileList("frames",s.filter((({path:t})=>t?.startsWith("frames/")))),n=a?.sha?await this.getFileContent(a.sha,0,1):"{}";return{images:o,frames:i,settings:JSON.parse(n)}}augmentFileList(t,e){return e.reduce(((s,{path:a,sha:o},i)=>{if(!a||!o)return s;const n=a.split("/").pop()||"";let r;switch(t){case"images":case"frames":r=n.split(".")[0];break;default:r="-"}const h={path:a,name:n,hash:r,getFileContent:()=>this.getFileContent(o,i,e.length)};return[...s,h]}),[])}async getFileContent(t,e,s){this.progressTick();const{data:{content:a}}=await this.addToQueue(`git.getBlob (${e+1}/${s}) ${t}`,this.throttle,(()=>this.octoKit?.git.getBlob({owner:this.owner,repo:this.repo,file_sha:t})));return o=a,decodeURIComponent(Array.prototype.map.call(atob(o),(t=>`%${`00${t.charCodeAt(0).toString(16)}`.slice(-2)}`)).join(""));var o}async getCurrentCommit(){this.progressTick();const{data:{object:{sha:t}}}=await this.addToQueue(`git.getRef heads/${this.branch}`,this.throttle,(()=>this.octoKit?.git.getRef({owner:this.owner,repo:this.repo,ref:`heads/${this.branch}`}))),{data:e}=await this.addToQueue(`git.getCommit ${t}`,this.throttle,(()=>this.octoKit?.git.getCommit({owner:this.owner,repo:this.repo,commit_sha:t})));return{commitSha:t,treeSha:e.tree.sha}}async createBlobForFile({destination:t,blob:e},s,a){this.progressTick();const o=await(0,p.A)(e,p.Z.DATA_URL),i=o.indexOf(";base64,")+8,n=o.slice(i),{data:r}=await this.addToQueue(`git.createBlob (${s+1}/${a}) ${t}`,this.throttle,(()=>this.octoKit?.git.createBlob({owner:this.owner,repo:this.repo,content:n,encoding:"base64"})));return{filename:t,blobData:r}}async createNewTree(t,e,s){this.progressTick();const a=t.map((({filename:t,blobData:{sha:e}})=>({path:t,mode:"100644",type:"blob",sha:e}))),o=e.map((({path:t})=>({path:t,mode:"100644",sha:null}))),{data:i}=await this.addToQueue(`git.createTree ${s}`,this.throttle,(()=>this.octoKit?.git.createTree({owner:this.owner,repo:this.repo,tree:[...a,...o],base_tree:s})));return i.sha}async createNewCommit(t,e,s){this.progressTick();const{data:a}=await this.addToQueue(`git.createCommit ${t}`,this.throttle,(()=>this.octoKit?.git.createCommit({owner:this.owner,repo:this.repo,message:t,tree:e,parents:[s]})));return a.sha}async setBranchToCommit(t){this.progressTick(),await this.addToQueue(`git.updateRef ${t}`,this.throttle,(()=>this.octoKit?.git.updateRef({owner:this.owner,repo:this.repo,ref:`heads/${this.branch}`,sha:t})))}async uploadToRepo({upload:t,del:e}){if(!this.octoKit)throw new Error("OctoClient not configured");const s=`Sync. ${(0,g.A)(d()(),this.getPreferredLocale())}`,a=t.length,{treeSha:o,commitSha:i}=await this.getCurrentCommit(),n=await Promise.all(t.map(((t,e)=>this.createBlobForFile(t,e,a)))),r=await this.createNewTree(n,e,o),h=await this.createNewCommit(s,r,i);await this.setBranchToCommit(h)}async updateRemoteStore({upload:t,del:e}){try{if(this.busy)throw new Error("currently busy");return t.length||e.length?(this.progressStart(t.length),this.busy=!0,await this.uploadToRepo({upload:t,del:e}),this.busy=!1,this.progressTick(!0),{uploaded:t.map((({destination:t})=>t)),deleted:e.map((({path:t})=>t)),repo:`https://github.com/${this.owner}/${this.repo}/tree/${this.branch}`}):{}}catch(t){throw this.busy=!1,this.emit("error",t),t}}}var w=m,f=s(6472),b=s(8714),y=s(3814),T=s(6763);let S,A;const x=()=>{const{gitStorage:t}=r.A.getState(),{setProgressLog:e}=i.A.getState(),s=new(o())(1,1/0);A=t=>(a,o,i)=>s.add((async()=>(await(0,y.c)(o),e("git",{timestamp:(new Date).getTime()/1e3,message:`${t} runs ${a}`}),i()))),S=new w(t,(()=>n.A.getState().preferredLocale),A("OctoClient"))},C=t=>{const{setProgressLog:e,setSyncBusy:s,setSyncSelect:a}=i.A.getState(),{syncLastUpdate:o}=r.A.getState(),n=async t=>{await S.setOctokit(t)};return r.A.subscribe((t=>t.gitStorage),n),{startSyncData:async n=>{s(!0),a(!1);try{const a=await S.getRepoContents();switch(n){case"up":{const t=o?.local||Math.floor((new Date).getTime()/1e3),e=await(0,f.A)(a,t,A("GBPrinter"));await S.updateRemoteStore(e);break}case"down":{const e=await(0,b.Ay)(a);t(e);break}default:throw new Error("github sync: wrong sync case")}e("git",{timestamp:(new Date).getTime()/1e3,message:"."}),s(!1)}catch(t){T.error(t),i.A.getState().setError(t)}},updateSettings:n}}},6089:function(){},6472:function(t,e,s){"use strict";s.d(e,{A:function(){return g}});var a=({images:t,frames:e},s,a,o)=>{const i=t.filter((({path:t})=>!a.find((({destination:e})=>t===e))&&!s.find((({destination:e})=>t===e))&&!o.find((e=>t.indexOf(e)>=-1)))),n=e.filter((({path:t})=>!a.find((({destination:e})=>t===e))&&!s.find((({destination:e})=>t===e))));return{upload:s.filter((({destination:s})=>!t.find((({path:t})=>t===s))&&!e.find((({path:t})=>t===s)))),del:[...i,...n]}},o=s(7837),i=s(3876),n=s(6763);var r=()=>{const t=(0,o.A)();return async(e,s)=>{const a=[],o=[],r={};e.forEach((({files:t,inRepo:e})=>{o.push(...e.map((({path:t})=>{const e=t.split("/")[0];return r[e]=r[e]?r[e]+1:1,{destination:t}}))),a.push(...t.map((t=>{const{blob:e,folder:s,filename:a}=t,o=(t=>{switch(t){case"image/png":return"png";case"image/jpg":case"image/jpeg":return"jpg";case"image/webp":return"webp";case"text/plain":return"txt";case"text/markdown":return"md";case"application/json":case"text/json":return"json";default:return n.warn(`unknown file extension for type "${t}"`),"none"}})(e.type),i=s||o;return r[i]=r[i]?r[i]+1:1,{destination:`${i}/${a}`,blob:e}})))}));const h=["## Files in this repo:",...Object.keys(r).map((t=>` * ${t}: [${r[t]}](/${t})`))].join("\n"),c=await t(i.m.ALL,{lastUpdateUTC:s});return a.push({destination:"README.md",blob:new Blob([...h],{type:"text/plain"})},{destination:"settings.json",blob:new Blob([...c],{type:"application/json"})}),{toUpload:a.filter(Boolean),toKeep:o.filter(Boolean)}}},h=s(7261),c=s(9809),l=s(7372),u=s(2388);var d=s(8222);var g=async(t,e,s)=>{const o=r(),i=[],{syncImages:n,missingLocally:g}=await(async(t,e)=>{const{images:s}=u.h.getState(),a=s.map((e=>{const s=(0,h.pl)(e)?(0,l.A)(Object.values(e.hashes)):[e.hash];return{file:e,searchHashes:s,inRepo:t.images.reduce(((t,e)=>s.includes(e.hash)?[...t,e]:t),[])}})),o=a.length;return{syncImages:(await Promise.all(a.map((async(t,s)=>t.inRepo.length===t.searchHashes.length?{hash:t.file.hash,inRepo:t.inRepo,files:[]}:e(`loadImageTiles (${s+1}/${o}) ${t.file.title}`,3,(async()=>{let e;if((0,h.pl)(t.file)){const s=t.file;e=await Promise.all(Object.values(s.hashes).map((t=>(0,c.Z)(t,s.title,t))))}else{const s=t.file;e=[await(0,c.Z)(s.hash,s.title,s.hash)]}return{hash:t.file.hash,files:e,inRepo:t.inRepo}})))))).filter(Boolean),missingLocally:[]}})(t,s);i.push(...g);const{syncFrames:p,missingLocally:m}=await(async(t,e)=>{const{frames:s}=u.h.getState(),a=s.map((e=>({file:e,searchHashes:[e.hash],inRepo:[t.frames.find((({hash:t})=>t===e.hash))].filter(Boolean)}))),o=a.length;return{syncFrames:(await Promise.all(a.map(((t,s)=>{const a=t.file;return t.inRepo.length?{...a,inRepo:t.inRepo,files:[]}:e(`loadFrameData (${s+1}/${o}) ${a.id}`,3,(async()=>{const e=await(0,d.mZ)(a.hash);return{...a,inRepo:t.inRepo,files:[{folder:"frames",filename:`${a.hash}.json`,blob:new Blob(new Array(JSON.stringify(e||"{}",null,2)),{type:"application/json"}),title:a.name}]}}))})))).filter(Boolean),missingLocally:[]}})(t,s);i.push(...m);const w=[...n,...p],{toUpload:f,toKeep:b}=await o(w,e);return a(t,f,b,i)}},7199:function(){},7790:function(){},7965:function(){},8982:function(){},9368:function(){},9838:function(){}}]);