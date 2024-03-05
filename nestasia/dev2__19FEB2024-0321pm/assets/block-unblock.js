const TYPE_ATTRIBUTE="javascript/blocked",patterns={blacklist:window.YETT_BLACKLIST,whitelist:window.YETT_WHITELIST},backupScripts={blacklisted:[]},isOnBlacklist=(t,e)=>t&&(!e||e!==TYPE_ATTRIBUTE)&&(!patterns.blacklist||patterns.blacklist.some((e=>e.test(t))))&&(!patterns.whitelist||patterns.whitelist.every((e=>!e.test(t)))),willBeUnblocked=function(t){const e=t.getAttribute("src");return patterns.blacklist&&patterns.blacklist.every((t=>!t.test(e)))||patterns.whitelist&&patterns.whitelist.some((t=>t.test(e)))},observer=new MutationObserver((t=>{for(let e=0;e<t.length;e++){const{addedNodes:r}=t[e];for(let t=0;t<r.length;t++){const e=r[t];if(1===e.nodeType&&"SCRIPT"===e.tagName){const t=e.src,r=e.type;if(isOnBlacklist(t,r)){backupScripts.blacklisted.push([e,e.type]),e.type=TYPE_ATTRIBUTE;const t=function(r){e.getAttribute("type")===TYPE_ATTRIBUTE&&r.preventDefault(),e.removeEventListener("beforescriptexecute",t)};e.addEventListener("beforescriptexecute",t),e.parentElement&&e.parentElement.removeChild(e)}}}}}));observer.observe(document.documentElement,{childList:!0,subtree:!0});const createElementBackup=document.createElement,originalDescriptors={src:Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype,"src"),type:Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype,"type")};document.createElement=function(...t){if("script"!==t[0].toLowerCase())return createElementBackup.bind(document)(...t);const e=createElementBackup.bind(document)(...t);try{Object.defineProperties(e,{src:{...originalDescriptors.src,set(t){isOnBlacklist(t,e.type)&&originalDescriptors.type.set.call(this,TYPE_ATTRIBUTE),originalDescriptors.src.set.call(this,t)}},type:{...originalDescriptors.type,get(){const t=originalDescriptors.type.get.call(this);return t===TYPE_ATTRIBUTE||isOnBlacklist(this.src,t)?null:t},set(t){const r=isOnBlacklist(e.src,e.type)?TYPE_ATTRIBUTE:t;originalDescriptors.type.set.call(this,r)}}}),e.setAttribute=function(t,r){"type"===t||"src"===t?e[t]=r:HTMLScriptElement.prototype.setAttribute.call(e,t,r)}}catch(t){console.warn("Yett: unable to prevent script execution for script src ",e.src,".\n",'A likely cause would be because you are using a third-party browser extension that monkey patches the "document.createElement" function.')}return e};const URL_REPLACER_REGEXP=new RegExp("[|\\{}()[\\]^$+*?.]","g"),unblock_script=function(...t){t.length<1?(patterns.blacklist=[],patterns.whitelist=[]):(patterns.blacklist&&(patterns.blacklist=patterns.blacklist.filter((e=>t.every((t=>"string"==typeof t?!e.test(t):t instanceof RegExp?e.toString()!==t.toString():void 0))))),patterns.whitelist&&(patterns.whitelist=[...patterns.whitelist,...t.map((t=>{if("string"==typeof t){const e=".*"+t.replace(URL_REPLACER_REGEXP,"\\$&")+".*";if(patterns.whitelist.every((t=>t.toString()!==e.toString())))return new RegExp(e)}else if(t instanceof RegExp&&patterns.whitelist.every((e=>e.toString()!==t.toString())))return t;return null})).filter(Boolean)]));const e=document.querySelectorAll(`script[type="${TYPE_ATTRIBUTE}"]`);for(let t=0;t<e.length;t++){const r=e[t];willBeUnblocked(r)&&(backupScripts.blacklisted.push([r,"application/javascript"]),r.parentElement.removeChild(r))}let r=0;[...backupScripts.blacklisted].forEach((([t,e],s)=>{if(willBeUnblocked(t)){const i=document.createElement("script");for(let e=0;e<t.attributes.length;e++){let r=t.attributes[e];"src"!==r.name&&"type"!==r.name&&i.setAttribute(r.name,t.attributes[e].value)}i.setAttribute("src",t.src),i.setAttribute("type",e||"application/javascript"),document.head.appendChild(i),backupScripts.blacklisted.splice(s-r,1),r++}})),patterns.blacklist&&patterns.blacklist.length<1&&observer.disconnect()};