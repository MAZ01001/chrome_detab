//@ts-check
"use strict";

const startTime=performance.now();

//MARK: LastWindow class

//! `chrome.windows.getLastFocused()` gets the last focused window, but `chrome.windows.QueryOptions` (parameter)
//! can only distinguish between window types like `normal` and `popup`,
//! and has no way of getting incognito/non-incognito windows separately
//! So, manual tracking of all focused windows is necessary

/**@author MAZ <https://github.com/MAZ01001> @license MIT 2025 MAZ @link <https://github.com/MAZ01001/chrome_detab>*/
const LastWindow=class LastWindow extends null{
    /**@type {Map<number,[boolean,boolean]>} `id:[popup,incognito]` delete before set so insertion order reflects rank (last=newest)*/
    static #win=new Map();
    /**{@linkcode LastWindow.load} flag (abort {@linkcode LastWindow.get} when set)*/
    static #loading=false;
    /**please only read data when this flag is not set*/
    static get loading(){return LastWindow.#loading;}
    /**
     * ## [async] add all opened windows
     * order: opened > current (added before/during load) \
     * also sets {@linkcode LastWindow.loading} flag during loading
     */
    static async load(){
        LastWindow.#loading=true;
        //~ get all opened windows (sort via newest lastAccessed timestamp from all tabs of each window ~ not a "last focused" timestamp but good enough)
        const wins=await chrome.windows.getAll({windowTypes:["normal","popup"],populate:true}).then(
            /**@return {[number,number,[boolean,boolean]][]} `[lastAccessed,id,[popup,incognito]]` in ascending order via `lastAccessed`*/
            wins=>{
                for(let i=0,win=wins[i];i<wins.length;win=wins[++i])
                    //@ts-ignore change array type (avoids creating new array)
                    wins[i]=[win.tabs?.reduce((o,v)=>Math.max(o,v.lastAccessed),0)??0,win.id,[win.type==="popup",win.incognito]];
                //@ts-ignore change array type (avoids creating new array, sorting is also in-place)
                return wins.sort((a,b)=>a[0]-b[0]);
            }
        );
        //~ save (shallow) copy of current data and clear
        const lastWins=Array.from(LastWindow.#win.entries());
        LastWindow.#win.clear();
        //~ add currently opened windows (sorted)
        for(const[_,id,data]of wins)
            if(id!=null&&id!==chrome.windows.WINDOW_ID_NONE)LastWindow.#win.set(id,data);
        //~ add back saved copy (assume windows do exist currently)
        for(const[id,data]of lastWins){
            LastWindow.#win.delete(id);
            LastWindow.#win.set(id,data);
        }
        LastWindow.#loading=false;
        console.debug(
            "[LastWindow:load] %o unique windows: %o currently open, %o added before/during load",
            LastWindow.#win.size,
            wins.length,
            lastWins.length
        );
    }
    /**
     * ## get last focused window ID and type
     * @param {boolean} [popup] - if to look for a popup window - default `undefined` (can be either)
     * @param {boolean} [incognito] - if to look for an incognito window - default `undefined` (can be either)
     * @returns {{popup:true,incognito:boolean,id:number,id2:number}|{popup:false,incognito:boolean,id:number,id2:undefined}|null|false} last known window if any (see below)
     * - `{ id }` = last window (might be {@linkcode chrome.windows.WINDOW_ID_NONE} if none are available)
     * - `{ id2 }` = last normal window, invert to `id` (might be {@linkcode chrome.windows.WINDOW_ID_NONE} if none are available or `undefined` if `id` is a normal window)
     * - `null` = no (normal/popup) windows stored
     * - `false` = during {@linkcode LastWindow.loading}
     * @throws {TypeError} if {@linkcode popup} and {@linkcode incognito} are given but not booleans
     */
    static get(popup,incognito){
        if(popup!=null&&typeof popup!=="boolean")throw new TypeError("[LastWindow:get] popup is given but not a boolean");
        if(incognito!=null&&typeof incognito!=="boolean")throw new TypeError("[LastWindow:get] incognito is given but not a boolean");
        if(LastWindow.#loading)return false;
        if(LastWindow.#win.size===0)return null;
        let /**@type {number}*/p=chrome.windows.WINDOW_ID_NONE,
            /**@type {number}*/n=chrome.windows.WINDOW_ID_NONE,
            /**@type {number}*/pi=chrome.windows.WINDOW_ID_NONE,
            /**@type {number}*/ni=chrome.windows.WINDOW_ID_NONE,
            lastPopup=false,
            lastIncognito=false;
        for(const[id,[popup,incognito]]of LastWindow.#win){
            if(lastIncognito=incognito)
                if(lastPopup=popup)pi=id;
                else ni=id;
            else if(lastPopup=popup)p=id;
            else n=id;
        }
        if(incognito??lastIncognito)
            if(popup??lastPopup)return{popup:true,incognito:true,id:pi,id2:ni};
            else return{popup:false,incognito:true,id:ni,id2:undefined};
        else if(popup??lastPopup)return{popup:true,incognito:false,id:p,id2:n};
        else return{popup:false,incognito:false,id:n,id2:undefined};
    }
    /**
     * ## set newly focused window
     * ignores {@linkcode LastWindow.loading} flag
     * @param {number} id - window ID (integer)
     * @param {boolean} popup is window a popup
     * @param {boolean} incognito is window in incognito mode
     * @throws {TypeError} if {@linkcode id} is not an integer or {@linkcode popup} and {@linkcode incognito} aren't booleans
     */
    static set(id,popup,incognito){
        if(!Number.isInteger(id))throw new TypeError("[LastWindow:set] id is not an integer");
        if(typeof popup!=="boolean")throw new TypeError("[LastWindow:set] popup is not a boolean");
        if(typeof incognito!=="boolean")throw new TypeError("[LastWindow:set] incognito is not a boolean");
        LastWindow.#win.delete(id);
        LastWindow.#win.set(id,[popup,incognito]);
    }
    /**
     * ## remove window from list
     * ignores {@linkcode LastWindow.loading} flag
     * @param {number} id - window ID (integer)
     * @throws {TypeError} if {@linkcode id} is not an integer
     */
    static rem(id){
        if(!Number.isInteger(id))throw new TypeError("[LastWindow:rem] id is not an integer");
        LastWindow.#win.delete(id);
    }
    /**## output debug info*/
    static debug(){
        console.group("[LastWindow:debug]");
        let p=0,i=0;
        console.table(Array.from(LastWindow.#win.entries(),([id,[popup,incognito]])=>{
            if(popup)++p;
            if(incognito)++i;
            return{id,popup,incognito};
        }));
        console.debug(
            "Stored windows (Loading %o): %o total, %o popup, %o incognito",
            LastWindow.#loading,LastWindow.#win.size,p,i
        );
        console.groupEnd();
    }
    /**@deprecated @throws {ReferenceError} if called*/
    constructor(){throw new ReferenceError("[LastWindow] static class shall not be instantiated");}
    static{//~ remove inherited methods and make class and prototype immutable
        Object.setPrototypeOf(LastWindow,null);
        Object.freeze(LastWindow.prototype);
        Object.freeze(LastWindow);
    }
};

chrome.windows.onFocusChanged.addListener(async windowId=>{
    if(windowId===chrome.windows.WINDOW_ID_NONE)return;
    const win=await chrome.windows.get(windowId);
    if(win?.id==null||win.id===chrome.windows.WINDOW_ID_NONE)return;
    LastWindow.set(win.id,win.type==="popup",win.incognito);
},{windowTypes:["normal","popup"]});

chrome.windows.onRemoved.addListener(windowId=>LastWindow.rem(windowId),{windowTypes:["normal","popup"]});

//MARK: config

//~ numbers can be NaN to symbolise no input
//~ default numbers: width=100; height=75; left=0; top=0
//@ts-ignore no other "config" variable in this context (does not mix with options.js)
const config=Object.seal({
    /**@readonly @type {string}*/version:chrome.runtime.getManifest().version,

    /**@type {"auto"|"source"|"custom"}*/"nps-":"source",
    "nps-custom-width":NaN,
    "nps-custom-height":NaN,
    /**@type {"auto"|"source"|"custom"}*/"npl-":"source",
    "npl-custom-left":NaN,
    "npl-custom-top":NaN,
    "npm-copy":false,
    "npm-override":true,
    /**@type {"auto"|"source"|"custom"}*/"npms-":"auto",
    "npms-custom-width":NaN,
    "npms-custom-height":NaN,
    /**@type {"auto"|"source"|"custom"}*/"npml-":"auto",
    "npml-custom-left":NaN,
    "npml-custom-top":NaN,
    "npl-override":false,
    /**@type {"auto"|"source"|"custom"}*/"npls-":"source",
    "npls-custom-width":NaN,
    "npls-custom-height":NaN,
    /**@type {"auto"|"source"|"custom"}*/"npll-":"source",
    "npll-custom-left":NaN,
    "npll-custom-top":NaN,
    "nplm-copy":false,
    "nplm-override":true,
    /**@type {"auto"|"source"|"custom"}*/"nplms-":"auto",
    "nplms-custom-width":NaN,
    "nplms-custom-height":NaN,
    /**@type {"auto"|"source"|"custom"}*/"nplml-":"auto",
    "nplml-custom-left":NaN,
    "nplml-custom-top":NaN,
    "npi-override":false,
    /**@type {"auto"|"source"|"custom"}*/"npis-":"source",
    "npis-custom-width":NaN,
    "npis-custom-height":NaN,
    /**@type {"auto"|"source"|"custom"}*/"npil-":"source",
    "npil-custom-left":NaN,
    "npil-custom-top":NaN,
    "npim-copy":false,
    "npim-override":true,
    /**@type {"auto"|"source"|"custom"}*/"npims-":"auto",
    "npims-custom-width":NaN,
    "npims-custom-height":NaN,
    /**@type {"auto"|"source"|"custom"}*/"npiml-":"auto",
    "npiml-custom-left":NaN,
    "npiml-custom-top":NaN,
    "npv-override":false,
    /**@type {"auto"|"source"|"custom"}*/"npvs-":"source",
    "npvs-custom-width":NaN,
    "npvs-custom-height":NaN,
    /**@type {"auto"|"source"|"custom"}*/"npvl-":"source",
    "npvl-custom-left":NaN,
    "npvl-custom-top":NaN,
    "npvm-copy":false,
    "npvm-override":true,
    /**@type {"auto"|"source"|"custom"}*/"npvms-":"auto",
    "npvms-custom-width":NaN,
    "npvms-custom-height":NaN,
    /**@type {"auto"|"source"|"custom"}*/"npvml-":"auto",
    "npvml-custom-left":NaN,
    "npvml-custom-top":NaN,
    "npa-override":false,
    /**@type {"auto"|"source"|"custom"}*/"npas-":"source",
    "npas-custom-width":NaN,
    "npas-custom-height":NaN,
    /**@type {"auto"|"source"|"custom"}*/"npal-":"source",
    "npal-custom-left":NaN,
    "npal-custom-top":NaN,
    "npam-copy":false,
    "npam-override":true,
    /**@type {"auto"|"source"|"custom"}*/"npams-":"auto",
    "npams-custom-width":NaN,
    "npams-custom-height":NaN,
    /**@type {"auto"|"source"|"custom"}*/"npaml-":"auto",
    "npaml-custom-left":NaN,
    "npaml-custom-top":NaN,

    /**@type {"first"|"last"|"left"|"right"|"new"}*/"pni-":"left",
    /**@type {"auto"|"source"|"custom"}*/"pns-":"source",
    "pns-custom-width":NaN,
    "pns-custom-height":NaN,
    /**@type {"auto"|"source"|"custom"}*/"pnl-":"source",
    "pnl-custom-left":NaN,
    "pnl-custom-top":NaN,
    "pnm-copy":false,
    "pnm-override":true,
    /**@type {"auto"|"source"|"custom"}*/"pnms-":"auto",
    "pnms-custom-width":NaN,
    "pnms-custom-height":NaN,
    /**@type {"auto"|"source"|"custom"}*/"pnml-":"auto",
    "pnml-custom-left":NaN,
    "pnml-custom-top":NaN,

    /**@type {"auto"|"source"|"custom"}*/"nns-":"source",
    "nns-custom-width":NaN,
    "nns-custom-height":NaN,
    /**@type {"auto"|"source"|"custom"}*/"nnl-":"source",
    "nnl-custom-left":NaN,
    "nnl-custom-top":NaN,
    "nnm-copy":false,
    "nnm-override":true,
    /**@type {"auto"|"source"|"custom"}*/"nnms-":"auto",
    "nnms-custom-width":NaN,
    "nnms-custom-height":NaN,
    /**@type {"auto"|"source"|"custom"}*/"nnml-":"auto",
    "nnml-custom-left":NaN,
    "nnml-custom-top":NaN,
});
/**all keys of {@linkcode config} (includes `version`)*///@ts-ignore no other "configKeys" variable in this context (does not mix with options.js)
const configKeys=Object.freeze(Object.keys(config));
console.assert(configKeys.length<=chrome.storage.sync.MAX_ITEMS,"more items than can be saved in sync storage (%o)",chrome.storage.sync.MAX_ITEMS);
let configSync=true;

chrome.storage.onChanged.addListener(async(changes,areaName)=>{
    console.debug(">> storage %o changed %i items",areaName,Object.keys(changes).length);
    if(areaName!=="local"&&areaName!=="sync")return console.error("unrelated storage area");
    const configSyncNew=areaName==="local"&&typeof changes.sync==="boolean"?changes.sync:configSync;
    const storageNew=configSyncNew?"sync":"local";
    let count=0;
    if(configSync===configSyncNew){
        if(areaName===storageNew){
            if("version" in changes&&changes.version!==config.version)console.warn("stored version changed (%o)",changes.version);
            for(const[key,val]of Object.entries(changes))
                if(key==="sync")continue;
                else if(Object.hasOwn(config,key))
                    if(typeof config[key]===typeof val){
                        config[key]=val;
                        ++count;
                    }else console.warn("[unexpected] type missmatch of %o = %o → skipping",key,val);
                else console.warn("[unexpected] unknown setting %o = %o → skipping",key,val);
        }
        return console.debug("<< updated %i items from %o storage",count,storageNew);
    }
    console.debug("== changed storage area to %o, reloading entire storage",storageNew);
    //~ keys are the same as input list of keys (if in storage)
    const configNew=await chrome.storage[storageNew].get(configKeys).catch(reason=>({reason}));
    if(configNew==null||"reason" in configNew)return console.error("[unexpected] unable to load from %o storage: %o",storageNew,configNew?.reason);
    if(configNew.version!==config.version)console.warn("different stored version (%o)",configNew.version);
    for(const[key,val]of Object.entries(configNew))
        if(key==="sync")continue;
        else if(typeof config[key]===typeof val){
            config[key]=val;
            ++count;
        }else console.warn("[unexpected] type missmatch of %o = %o → skipping",key,val);
    console.debug("<< loaded %i items from %o storage",count,storageNew);
});

//MARK: helper functions

const initLoadStorage=async()=>{
    const storageNew=configSync?"sync":"local";
    console.debug(">> load settings from %o storage",storageNew);
    //~ keys are the same as input list of keys (if in storage)
    const configNew=await chrome.storage[storageNew].get(configKeys).catch(reason=>({reason}));
    if(configNew==null||"reason" in configNew)return console.error("[unexpected] unable to load from %o storage: %o",storageNew,configNew?.reason);
    if(configNew.version!==config.version)console.warn("different stored version (%o)",configNew.version);
    for(const[key,val]of Object.entries(configNew))
        if(key==="sync")continue;
        else if(typeof config[key]===typeof val)config[key]=val;
        else console.warn("[unexpected] type missmatch of %o = %o → skipping",key,val);
    console.debug("<< loaded settings from %o storage",storageNew);
};

/**@type {(prefix:"np"|"npl"|"npi"|"npv"|"npa"|"pn"|"nn",state?:chrome.windows.WindowState,left?:number,top?:number,width?:number,height?:number)=>{left?:number;top?:number;width?:number;height?:number;state?:chrome.windows.WindowState}} uses {@linkcode config} (auto determines overrides) @returns for {@linkcode chrome.windows.create}*/
const windowBounds=(prefix,state,left,top,width,height)=>{
    if(/^np[liva]$/.test(prefix)&&!config[prefix+"-override"])prefix="np";
    /**@type {{left?:number;top?:number;width?:number;height?:number;state?:chrome.windows.WindowState}}*/
    const out={left:undefined,top:undefined,width:undefined,height:undefined,state:config[prefix+"m-copy"]?state:"normal"};
    const override=state!=="normal"&&config[prefix+"m-override"]?"m":"";
    switch(config[prefix+override+"s-"]){
        case"auto":break;
        case"source":
            out.width=width;
            out.height=height;
            break;
        case"custom":
            out.width=(n=>Number.isNaN(n)?100:n)(config[prefix+override+"s-custom-width"]);
            out.height=(n=>Number.isNaN(n)?75:n)(config[prefix+override+"s-custom-height"]);
            break;
    }
    switch(config[prefix+override+"l-"]){
        case"auto":break;
        case"source":
            out.left=left==null?undefined:out.width==null||width==null?left:Math.round(left+(width-out.width)/2);
            out.top=top==null?undefined:out.height==null||height==null?top:Math.round(top+(height-out.height)/2);
            break;
        case"custom":
            out.left=(n=>Number.isNaN(n)?0:n)(config[prefix+override+"l-custom-left"]);
            out.top=(n=>Number.isNaN(n)?0:n)(config[prefix+override+"l-custom-top"]);
            break;
    }
    return out;
};

/**@type {(activeIndex:number)=>number} uses {@linkcode config} @returns new active index*/
const insertIndex=activeIndex=>{
    switch(config["pni-"]){
        case"left":return activeIndex;
        case"right":return activeIndex+1;
        case"first":return 0;
        case"last":return-1;
    }
    return activeIndex;
};

//MARK: event listener

chrome.commands.onCommand.addListener(async command=>{
    console.debug(">> running command %o",command);
    if(command==="new normal"){
        const win=await chrome.windows.getLastFocused({windowTypes:["normal","popup"],populate:true});
        if(win?.id==null||win.id===chrome.windows.WINDOW_ID_NONE)return console.error("no popups or normal windows");
        if(win.tabs==null)return console.error("[unexpected] did not populate tabs");
        /**@type {(chrome.tabs.Tab&{id:number})[]}*/
        const tabs=[];
        let activeTab;
        for(const tab of win.tabs){
            if(tab.id==null||tab.id===chrome.tabs.TAB_ID_NONE)continue;
            //@ts-ignore id of tab is not undefined (checked above) and matches tabs type
            if(tab.highlighted)tabs.push(tab);
            if(tab.active)activeTab=tab;
        }
        if(activeTab?.id==null)return console.error("[unexpected] window with no active tab");
        const firstTab=tabs.shift();
        if(firstTab==null)return console.error("[unexpected] window with no highlighted tabs");
        const winNew=await chrome.windows.create({
            tabId:firstTab.id,
            type:"normal",
            incognito:win.incognito,
            focused:true,
            ...windowBounds("nn",win.state,win.left,win.top,win.width??firstTab.width,win.height??firstTab.height)
        });
        if(winNew?.id==null||winNew?.id===chrome.windows.WINDOW_ID_NONE)return console.error("[unexpected] could not create window");
        if(tabs.length!==0){
            await chrome.tabs.move(tabs.map(v=>v.id),{windowId:winNew.id,index:-1});
            //// await chrome.tabs.update(activeTab.id,{active:true});
            const activeIndex=(i=>i===-1?0:i+1)(tabs.findIndex(v=>v.id===activeTab.id));
            await chrome.tabs.highlight({windowId:winNew.id,tabs:Array.from({length:tabs.length+1},(_,i)=>i===0?activeIndex:i>activeIndex?i:i-1)});
        }
        return console.debug("moved %i tabs to new normal window (from %o window)",tabs.length+1,win.type);
    }
    if(command!=="toggle")return console.error("[unexpected] unknown command");
    const win=await chrome.windows.getLastFocused({windowTypes:["normal","popup"],populate:true});
    if(win?.id==null||win.id===chrome.windows.WINDOW_ID_NONE)return console.error("no popups or normal windows");
    if(win.tabs==null)return console.error("[unexpected] did not populate tabs");
    if(win.type==="popup"){
        const tab=win.tabs[0];
        if(tab?.id==null||tab.id===chrome.tabs.TAB_ID_NONE)return console.error("[unexpected] popup window with no tab");
        const lastWin=await chrome.windows.getLastFocused({windowTypes:["normal"],populate:true});
        if(config["pni-"]==="new"||lastWin?.id==null||lastWin.id===chrome.windows.WINDOW_ID_NONE){
            const winNew=await chrome.windows.create({
                tabId:tab.id,
                type:"normal",
                incognito:tab.incognito,
                focused:true,
                ...windowBounds("pn",win.state,win.left,win.top,win.width??tab.width,win.height??tab.height)
            });
            if(winNew?.id==null||winNew?.id===chrome.windows.WINDOW_ID_NONE)return console.error("[unexpected] could not create window");
            return console.debug("<< popup & %s → move to new normal window",config["pni-"]==="new"?"force new window":"no normal windows");
        }
        if(lastWin.incognito!==tab.incognito){
            console.debug("== popup and last normal window have differend incognito modes → use LastWindow");
            let manualWin=null;
            for(let manual;true;){
                manual=LastWindow.get(false,tab.incognito);
                if(manual===false)return console.error("Lastwindow is still loading");
                if(manual==null){
                    const winNew=await chrome.windows.create({
                        tabId:tab.id,
                        type:"normal",
                        incognito:tab.incognito,
                        focused:true,
                        ...windowBounds("pn",win.state,win.left,win.top,win.width??tab.width,win.height??tab.height)
                    });
                    if(winNew?.id==null||winNew?.id===chrome.windows.WINDOW_ID_NONE)return console.error("[unexpected] could not create window");
                    return console.debug("<< popup & incognito mismatch & no matching windows (via LastWindow) → move to new normal window");
                }
                if(manual.id!==chrome.windows.WINDOW_ID_NONE){
                    manualWin=await chrome.windows.get(manual.id,{populate:true});
                    if(manualWin?.id!=null&&manualWin.id!==chrome.windows.WINDOW_ID_NONE)break;
                }
                LastWindow.rem(manual.id);
                console.warn("[unexpected] window from LastWindow does not exist (removed and will try again)");
            }
            if(manualWin.tabs==null)return console.error("[unexpected] did not populate tabs");
            const manualTab=manualWin.tabs.find(v=>v.active);
            if(manualTab?.id==null||manualTab.id===chrome.tabs.TAB_ID_NONE)return console.error("[unexpected] window with no active tabs");
            const newTab=await chrome.tabs.move(tab.id,{
                windowId:manualTab.windowId,
                index:insertIndex(manualTab.index)
            }).then(v=>Array.isArray(v)?v[0]:v);
            await chrome.tabs.highlight({windowId:manualTab.windowId,tabs:newTab.index});
            await chrome.windows.update(manualTab.windowId,{focused:true});
            return console.debug("<< popup & incognito mismatch → move to last normal window (via LastWindow)");
        }
        if(lastWin.tabs==null)return console.error("[unexpected] did not populate tabs");
        const lastTab=lastWin.tabs.find(v=>v.active);
        if(lastTab?.id==null||lastTab.id===chrome.tabs.TAB_ID_NONE)return console.error("[unexpected] normal window but no active tab");
        const newTab=await chrome.tabs.move(tab.id,{
            windowId:lastTab.windowId,
            index:insertIndex(lastTab.index)
        }).then(v=>Array.isArray(v)?v[0]:v);
        await chrome.tabs.highlight({windowId:lastTab.windowId,tabs:newTab.index});
        await chrome.windows.update(lastTab.windowId,{focused:true});
        return console.debug("<< popup → move to last normal window");
    }
    let popups=0,
        activePopup;
    for(const tab of win.tabs){
        if(tab.id==null||tab.id===chrome.tabs.TAB_ID_NONE)continue;
        if(!tab.highlighted)continue;
        const popup=await chrome.windows.create({
            tabId:tab.id,
            type:"popup",
            incognito:win.incognito,
            focused:true,
            ...windowBounds("np",win.state,win.left,win.top,win.width??tab.width,win.height??tab.height)
        });
        if(popup?.id==null||popup?.id===chrome.windows.WINDOW_ID_NONE)console.warn("[unexpected] could not create window for tab %o",tab.id);
        ++popups;
        if(tab.active)activePopup=popup;
    }
    if(activePopup?.id!=null)await chrome.windows.update(activePopup.id,{focused:true});
    console.debug("<< normal window (%i selected) → move to popup",popups);
});

chrome.action.onClicked.addListener(async tab=>{
    console.debug(">> extension icon clicked");
    if(tab?.id==null||tab.id===chrome.tabs.TAB_ID_NONE)return console.error("[unexpected] extension clicked but no tab given");
    const win=await chrome.windows.get(tab.windowId,{windowTypes:["normal"],populate:true}).catch(()=>undefined);
    if(win?.id==null||win.id===chrome.windows.WINDOW_ID_NONE)return console.error("[unexpected] extension clicked in non-normal window");
    if(win.tabs==null)return console.error("[unexpected] did not populate tabs");
    let popups=0,
        activePopup;
    for(const tab of win.tabs){
        if(tab.id==null||tab.id===chrome.tabs.TAB_ID_NONE)continue;
        if(!tab.highlighted)continue;
        const popup=await chrome.windows.create({
            tabId:tab.id,
            type:"popup",
            incognito:tab.incognito,
            focused:true,
            ...windowBounds("np",win.state,win.left,win.top,win.width??tab.width,win.height??tab.height)
        });
        if(popup?.id==null||popup?.id===chrome.windows.WINDOW_ID_NONE)console.warn("[unexpected] could not create window for tab %o",tab.id);
        ++popups;
        if(tab.active)activePopup=popup;
    }
    if(activePopup?.id!=null)await chrome.windows.update(activePopup.id,{focused:true});
    console.debug("<< normal window (%i selected) → move to popup",popups);
});

chrome.contextMenus.onClicked.addListener(async(info,tab)=>{
    console.debug(">> context menu item clicked: %o",info.menuItemId);
    if(info.menuItemId==="toggle"){
        if(tab?.id==null||tab.id===chrome.tabs.TAB_ID_NONE)return console.debug("<< no tab given (do nothing)");
        const win=await chrome.windows.get(tab.windowId).catch(()=>undefined);
        if(win?.id==null||win.id===chrome.windows.WINDOW_ID_NONE)return console.error("[unexpected] window of tab does not exist");
        if(win.type==="popup"){
            const lastWin=await chrome.windows.getLastFocused({windowTypes:["normal"],populate:true});
            if(config["pni-"]==="new"||lastWin?.id==null||lastWin.id===chrome.windows.WINDOW_ID_NONE){
                const winNew=await chrome.windows.create({
                    tabId:tab.id,
                    type:"normal",
                    incognito:tab.incognito,
                    focused:true,
                    ...windowBounds("pn",win.state,win.left,win.top,win.width??tab.width,win.height??tab.height)
                });
                if(winNew?.id==null||winNew?.id===chrome.windows.WINDOW_ID_NONE)return console.error("[unexpected] could not create window");
                return console.debug("<< popup & %s → move to new normal window",config["pni-"]==="new"?"force new window":"no normal windows");
            }
            if(lastWin.incognito!==tab.incognito){
                console.debug("== popup and last normal window have differend incognito modes → use LastWindow");
                let manualWin=null;
                for(let manual;true;){
                    manual=LastWindow.get(false,tab.incognito);
                    if(manual===false)return console.error("Lastwindow is still loading");
                    if(manual==null||manual.id===chrome.windows.WINDOW_ID_NONE){
                        const winNew=await chrome.windows.create({
                            tabId:tab.id,
                            type:"normal",
                            incognito:tab.incognito,
                            focused:true,
                            ...windowBounds("pn",win.state,win.left,win.top,win.width??tab.width,win.height??tab.height)
                        });
                        if(winNew?.id==null||winNew?.id===chrome.windows.WINDOW_ID_NONE)return console.error("[unexpected] could not create window");
                        return console.debug("<< popup & incognito mismatch & no matching windows (via LastWindow) → move to new normal window");
                    }
                    manualWin=await chrome.windows.get(manual.id,{populate:true});
                    if(manualWin?.id!=null&&manualWin.id!==chrome.windows.WINDOW_ID_NONE)break;
                    LastWindow.rem(manual.id);
                    console.warn("[unexpected] window from LastWindow does not exist (removed and will try again)");
                }
                if(manualWin.tabs==null)return console.error("[unexpected] did not populate tabs");
                const manualTab=manualWin.tabs.find(v=>v.active);
                if(manualTab?.id==null||manualTab.id===chrome.tabs.TAB_ID_NONE)return console.error("[unexpected] window with no active tabs");
                const newTab=await chrome.tabs.move(tab.id,{
                    windowId:manualTab.windowId,
                    index:insertIndex(manualTab.index)
                }).then(v=>Array.isArray(v)?v[0]:v);
                await chrome.tabs.highlight({windowId:manualTab.windowId,tabs:newTab.index});
                await chrome.windows.update(manualTab.windowId,{focused:true});
                return console.debug("<< popup & incognito mismatch → move to last normal window (via LastWindow)");
            }
            if(lastWin.tabs==null)return console.error("[unexpected] did not populate tabs");
            const lastTab=lastWin.tabs.find(v=>v.active);
            if(lastTab?.id==null||lastTab.id===chrome.tabs.TAB_ID_NONE)return console.error("[unexpected] normal window but no active tab");
            const newTab=await chrome.tabs.move(tab.id,{
                windowId:lastTab.windowId,
                index:insertIndex(lastTab.index)
            }).then(v=>Array.isArray(v)?v[0]:v);
            await chrome.tabs.highlight({windowId:lastTab.windowId,tabs:newTab.index});
            await chrome.windows.update(lastTab.windowId,{focused:true});
            return console.debug("<< popup → move to last normal window");
        }
        const winNew=await chrome.windows.create({
            tabId:tab.id,
            type:"popup",
            incognito:tab.incognito,
            focused:true,
            ...windowBounds("np",win.state,win.left,win.top,win.width??tab.width,win.height??tab.height)
        });
        if(winNew?.id==null||winNew?.id===chrome.windows.WINDOW_ID_NONE)return console.error("[unexpected] could not create window");
        return console.debug("<< normal window → move to popup");
    }
    if(info.menuItemId==="new normal"){
        if(tab?.id==null||tab.id===chrome.tabs.TAB_ID_NONE)return console.debug("<< no tab given (do nothing)");
        const win=await chrome.windows.get(tab.windowId).catch(()=>undefined);
        if(win?.id==null||win.id===chrome.windows.WINDOW_ID_NONE)return console.error("[unexpected] window of tab does not exist");
        const winNew=await chrome.windows.create({
            tabId:tab.id,
            type:"normal",
            incognito:tab.incognito,
            focused:true,
            ...windowBounds("nn",win.state,win.left,win.top,win.width??tab.width,win.height??tab.height)
        });
        if(winNew?.id==null||winNew?.id===chrome.windows.WINDOW_ID_NONE)return console.error("[unexpected] could not create window");
        return console.debug("<< new normal window (from %o window)",win.type);
    }
    if(info.menuItemId==="media"||info.menuItemId==="media incognito"){
        if(info.srcUrl==null)return console.error("media (type %o) has no source URL",info.mediaType);
        const incognito=info.menuItemId.length===15;
        const win=tab?.id==null||tab.id===chrome.tabs.TAB_ID_NONE?undefined:await chrome.windows.get(tab.windowId).catch(()=>undefined);
        const mediaPrefix=(()=>{switch(info.mediaType){
            case"image":return"npi";
            case"video":return"npv";
            case"audio":return"npa";
            default:return null;
        }})();
        if(mediaPrefix==null)return console.error("[unexpected] invalid media type (%o)",info.mediaType);
        const winNew=await chrome.windows.create({
            url:info.srcUrl,
            type:"popup",
            incognito,
            focused:true,
            ...windowBounds(mediaPrefix,win?.state,win?.left,win?.top,win?.width??tab?.width,win?.height??tab?.height)
        });
        if(winNew?.id==null||winNew?.id===chrome.windows.WINDOW_ID_NONE)return console.error("[unexpected] could not create window");
        return console.debug("<< opened media (type %o) in popup (with incognito mode %s)",info.mediaType,incognito);
    }
    if(info.menuItemId==="link"||info.menuItemId==="link incognito"){
        if(info.linkUrl==null)return console.error("link has no URL");
        const win=tab?.id==null||tab.id===chrome.tabs.TAB_ID_NONE?undefined:await chrome.windows.get(tab.windowId).catch(()=>undefined);
        const incognito=info.menuItemId.length===14;
        const winNew=await chrome.windows.create({
            url:info.linkUrl,
            focused:true,
            type:"popup",
            incognito,
            ...windowBounds("npl",win?.state,win?.left,win?.top,win?.width??tab?.width,win?.height??tab?.height)
        });
        if(winNew?.id==null||winNew?.id===chrome.windows.WINDOW_ID_NONE)return console.error("[unexpected] could not create window");
        return console.debug("<< opened link in popup (with incognito mode %s)",incognito?"on":"off");
    }
    console.error("[unexpected] context menu item with unknown ID");
});

// MARK: install

chrome.runtime.onInstalled.addListener(async details=>{
    console.group("installing extension: %s",details.reason);
    console.debug(">> adding context menu items");
    chrome.contextMenus.create({title:"Popup toggle current tab",contexts:["all"],id:"toggle"});
    chrome.contextMenus.create({title:"Move to new normal window",contexts:["all"],id:"new normal"});
    chrome.contextMenus.create({title:"Popup link",contexts:["link"],id:"link"});
    chrome.contextMenus.create({title:"Popup incognito link",contexts:["link"],id:"link incognito"});
    chrome.contextMenus.create({title:"Popup media (source URL)",contexts:["image","video","audio"],id:"media"});
    chrome.contextMenus.create({title:"Popup incognito media (source URL)",contexts:["image","video","audio"],id:"media incognito"});
    console.debug(">> loading sync state and config");
    const res=await chrome.storage.local.get("sync").catch(reason=>({reason}));
    if("reason" in res)console.error("couldn't get sync state from storage: %o",res.reason);
    else{
        if("sync" in res)configSync=Boolean(res.sync);
        else console.debug("== no sync state in storage (maybe first install)");
        await initLoadStorage();
    }
    console.debug(">> loading current tab/window setup");
    await LastWindow.load();
    console.groupEnd();
    LastWindow.debug();
});

console.debug("|| loaded extension in %oms (synchronous part of script)",Number((performance.now()-startTime).toFixed(2)));
