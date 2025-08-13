//@ts-check
"use strict";

const startTime=performance.now();

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
        // TODO ! manually keep track of window focus to solve this (chrome API can't get "last focused window with incognito mode on/off")
        if(lastTab.incognito!==tab.incognito)return console.warn("popup and normal window have differend incognito modes");
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
            // TODO ! manually keep track of window focus to solve this (chrome API can't get "last focused window with incognito mode on/off")
            if(lastTab.incognito!==tab.incognito)return console.warn("popup and normal window have differend incognito modes");
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
    console.debug("[install:%s] finished extension install",details.reason);
});

console.debug("loaded extension in %oms",Number((performance.now()-startTime).toFixed(2)));
