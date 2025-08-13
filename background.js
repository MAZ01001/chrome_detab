//@ts-check
"use strict";

const startTime=performance.now();

//! `chrome.windows.getLastFocused` (function) or rather `chrome.windows.QueryOptions` (type)
//! has no way of getting incognito/non-incognito windows separately,
//! which is possible with, for example, window type (normal/popup).
//! So, manual tracking of all windows is necessary.

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
    /**@throws {ReferenceError} if called*/
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

// ------------------------------------------------------------

chrome.commands.onCommand.addListener(async command=>{
    console.debug(">> running command");
    if(command!=="popup")return console.error("[unexpected] unknown command: %o",command);
    const win=await chrome.windows.getLastFocused({windowTypes:["normal","popup"],populate:true});
    if(win?.id==null||win.id===chrome.windows.WINDOW_ID_NONE)return console.warn("no popups or normal windows");
    if(win.tabs==null)return console.error("[unexpected] did not populate tabs");
    if(win.type==="popup"){
        const tab=win.tabs[0];
        if(tab?.id==null||tab.id===chrome.tabs.TAB_ID_NONE)return console.error("[unexpected] popup window with no tab");
        const lastWin=await chrome.windows.getLastFocused({windowTypes:["normal"],populate:true});
        if(lastWin?.id==null||lastWin.id===chrome.windows.WINDOW_ID_NONE){
            await chrome.windows.create({
                tabId:tab.id,
                type:"normal",
                incognito:tab.incognito,
                focused:true,
                left:win.left,
                top:win.top,
                width:tab.width,
                height:tab.height,
            });
            return console.debug("popup & no normal windows → move to new normal window");
        }
        if(lastWin.tabs==null)return console.error("[unexpected] did not populate tabs");
        const lastTab=lastWin.tabs.find(v=>v.active);
        if(lastTab?.id==null||lastTab.id===chrome.tabs.TAB_ID_NONE)return console.error("[unexpected] normal window but no active tab");
        if(lastTab.incognito!==tab.incognito){
            console.debug("popup and last normal window have differend incognito modes → use LastWindow");
            let manualWin=null;
            for(let manual;true;){
                manual=LastWindow.get(false,tab.incognito);
                if(manual===false)return console.warn("Lastwindow is still loading");
                if(manual==null||manual.id===chrome.windows.WINDOW_ID_NONE){
                    await chrome.windows.create({
                        tabId:tab.id,
                        type:"normal",
                        incognito:tab.incognito,
                        focused:true,
                        left:win.left,
                        top:win.top,
                        width:tab.width,
                        height:tab.height,
                    });
                    return console.debug("popup & incognito missmatch & no matching windows (via LastWindow) → move to new normal window");
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
                index:manualTab.index
            }).then(v=>Array.isArray(v)?v[0]:v);
            await chrome.tabs.highlight({windowId:manualTab.windowId,tabs:newTab.index});
            await chrome.windows.update(manualTab.windowId,{focused:true});
            return console.debug("popup & incognito missmatch → move to last normal window (via LastWindow)");
        }
        const newTab=await chrome.tabs.move(tab.id,{
            windowId:lastTab.windowId,
            index:lastTab.index
        }).then(v=>Array.isArray(v)?v[0]:v);
        await chrome.tabs.highlight({windowId:lastTab.windowId,tabs:newTab.index});
        await chrome.windows.update(lastTab.windowId,{focused:true});
        return console.debug("popup → move to last normal window");
    }
    const tab=win.tabs.find(v=>v.active);
    if(tab?.id==null||tab.id===chrome.tabs.TAB_ID_NONE)return console.error("[unexpected] normal window with no active tab");
    await chrome.windows.create({
        tabId:tab.id,
        type:"popup",
        incognito:tab.incognito,
        focused:true,
        left:win.left,
        top:win.top,
        width:tab.width,
        height:tab.height,
    });
    console.debug("normal window → move to popup");
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
            left:win.left,
            top:win.top,
            width:tab.width,
            height:tab.height,
        });
        ++popups;
        if(tab.active)activePopup=popup;
    }
    if(activePopup?.id!=null)await chrome.windows.update(activePopup.id,{focused:true});
    console.debug("normal window (%i selected) → move to popup",popups);
});

chrome.contextMenus.onClicked.addListener(async(info,tab)=>{
    console.debug(">> context menu item clicked");
    if(info.menuItemId==="page"){
        if(tab?.id==null||tab.id===chrome.tabs.TAB_ID_NONE)return console.error("[unexpected] context menu clicked but no tab given");
        const win=await chrome.windows.get(tab.windowId).catch(()=>undefined);
        if(win?.id==null||win.id===chrome.windows.WINDOW_ID_NONE)return console.error("[unexpected] window of tab does not exist");
        if(win.type==="popup"){
            const lastWin=await chrome.windows.getLastFocused({windowTypes:["normal"],populate:true});
            if(lastWin?.id==null||lastWin.id===chrome.windows.WINDOW_ID_NONE){
                await chrome.windows.create({
                    tabId:tab.id,
                    type:"normal",
                    incognito:tab.incognito,
                    focused:true,
                    left:win.left,
                    top:win.top,
                    width:tab.width,
                    height:tab.height,
                });
                return console.debug("popup & no normal windows → move to new normal window");
            }
            if(lastWin.tabs==null)return console.error("[unexpected] did not populate tabs");
            const lastTab=lastWin.tabs.find(v=>v.active);
            if(lastTab?.id==null||lastTab.id===chrome.tabs.TAB_ID_NONE)return console.error("[unexpected] normal window but no active tab");
            if(lastTab.incognito!==tab.incognito){
                console.debug("popup and last normal window have differend incognito modes → use LastWindow");
                let manualWin=null;
                for(let manual;true;){
                    manual=LastWindow.get(false,tab.incognito);
                    if(manual===false)return console.warn("Lastwindow is still loading");
                    if(manual==null||manual.id===chrome.windows.WINDOW_ID_NONE){
                        await chrome.windows.create({
                            tabId:tab.id,
                            type:"normal",
                            incognito:tab.incognito,
                            focused:true,
                            left:win.left,
                            top:win.top,
                            width:tab.width,
                            height:tab.height,
                        });
                        return console.debug("popup & incognito missmatch & no matching windows (via LastWindow) → move to new normal window");
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
                    index:manualTab.index
                }).then(v=>Array.isArray(v)?v[0]:v);
                await chrome.tabs.highlight({windowId:manualTab.windowId,tabs:newTab.index});
                await chrome.windows.update(manualTab.windowId,{focused:true});
                return console.debug("popup & incognito missmatch → move to last normal window (via LastWindow)");
            }
            const newTab=await chrome.tabs.move(tab.id,{
                windowId:lastTab.windowId,
                index:lastTab.index
            }).then(v=>Array.isArray(v)?v[0]:v);
            await chrome.tabs.highlight({windowId:lastTab.windowId,tabs:newTab.index});
            await chrome.windows.update(lastTab.windowId,{focused:true});
            return console.debug("popup → move to last normal window");
        }
        await chrome.windows.create({
            tabId:tab.id,
            type:"popup",
            incognito:tab.incognito,
            focused:true,
            left:win?.left,
            top:win?.top,
            width:tab.width,
            height:tab.height,
        });
        return console.debug("normal window → move to popup");
    }
    //~ info.menuItemId = "link" or "link incognito"
    const win=tab?.id==null||tab.id===chrome.tabs.TAB_ID_NONE?undefined:await chrome.windows.get(tab.windowId).catch(()=>undefined);
    const incognito=info.menuItemId==="link incognito";
    await chrome.windows.create({
        url:info.linkUrl,
        focused:true,
        type:"popup",
        incognito,
        left:win?.left,
        top:win?.top,
        width:tab?.width,
        height:tab?.height,
    });
    console.debug("opened link in popup (with incognito mode %s)",incognito?"on":"off");
});

chrome.runtime.onInstalled.addListener(async details=>{
    chrome.contextMenus.create({title:"Popup toggle current tab",contexts:["page"],id:"page"});
    chrome.contextMenus.create({title:"Popup window from link",contexts:["link"],id:"link"});
    chrome.contextMenus.create({title:"Popup incognito window from link",contexts:["link"],id:"link incognito"});
    console.debug("[install:%s] added context menu items",details.reason);
    await LastWindow.load();
    console.debug("[install:%s] finished extension install",details.reason);
    LastWindow.debug();
});

console.debug("loaded extension in %oms",Number((performance.now()-startTime).toFixed(2)));
