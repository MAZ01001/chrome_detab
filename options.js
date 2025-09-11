//@ts-check
"use strict";

const timeStart=performance.now();

//MARK: HTML

const html=Object.freeze({
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "sync":document.getElementById("sync"),
    /**@type {HTMLInputElement} `button`*///@ts-ignore element does exist in DOM
    "sync-save":document.getElementById("sync-save"),
    /**@type {HTMLInputElement} `button`*///@ts-ignore element does exist in DOM
    "sync-load":document.getElementById("sync-load"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "autosave":document.getElementById("autosave"),
    /**@type {HTMLInputElement} `button`*///@ts-ignore element does exist in DOM
    "save":document.getElementById("save"),
    /**@type {HTMLInputElement} `button`*///@ts-ignore element does exist in DOM
    "load":document.getElementById("load"),
    /**@type {HTMLInputElement} `button`*///@ts-ignore element does exist in DOM
    "export":document.getElementById("export"),
    /**@type {HTMLInputElement} `button`*///@ts-ignore element does exist in DOM
    "import":document.getElementById("import"),
    /**@type {HTMLInputElement} `file`*///@ts-ignore element does exist in DOM
    "file":document.getElementById("file"),
    /**@type {HTMLInputElement} `button`*///@ts-ignore element does exist in DOM
    "reset":document.getElementById("reset"),

    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nps-auto":document.getElementById("nps-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nps-source":document.getElementById("nps-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nps-custom":document.getElementById("nps-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "nps-custom-width":document.getElementById("nps-custom-width"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "nps-custom-height":document.getElementById("nps-custom-height"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npl-auto":document.getElementById("npl-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npl-source":document.getElementById("npl-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npl-custom":document.getElementById("npl-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npl-custom-left":document.getElementById("npl-custom-left"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npl-custom-top":document.getElementById("npl-custom-top"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "npm-copy":document.getElementById("npm-copy"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "npm-override":document.getElementById("npm-override"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npms-auto":document.getElementById("npms-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npms-source":document.getElementById("npms-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npms-custom":document.getElementById("npms-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npms-custom-width":document.getElementById("npms-custom-width"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npms-custom-height":document.getElementById("npms-custom-height"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npml-auto":document.getElementById("npml-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npml-source":document.getElementById("npml-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npml-custom":document.getElementById("npml-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npml-custom-left":document.getElementById("npml-custom-left"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npml-custom-top":document.getElementById("npml-custom-top"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "npl-override":document.getElementById("npl-override"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npls-auto":document.getElementById("npls-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npls-source":document.getElementById("npls-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npls-custom":document.getElementById("npls-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npls-custom-width":document.getElementById("npls-custom-width"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npls-custom-height":document.getElementById("npls-custom-height"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npll-auto":document.getElementById("npll-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npll-source":document.getElementById("npll-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npll-custom":document.getElementById("npll-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npll-custom-left":document.getElementById("npll-custom-left"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npll-custom-top":document.getElementById("npll-custom-top"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "nplm-copy":document.getElementById("nplm-copy"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "nplm-override":document.getElementById("nplm-override"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nplms-auto":document.getElementById("nplms-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nplms-source":document.getElementById("nplms-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nplms-custom":document.getElementById("nplms-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "nplms-custom-width":document.getElementById("nplms-custom-width"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "nplms-custom-height":document.getElementById("nplms-custom-height"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nplml-auto":document.getElementById("nplml-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nplml-source":document.getElementById("nplml-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nplml-custom":document.getElementById("nplml-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "nplml-custom-left":document.getElementById("nplml-custom-left"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "nplml-custom-top":document.getElementById("nplml-custom-top"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "npi-override":document.getElementById("npi-override"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npis-auto":document.getElementById("npis-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npis-source":document.getElementById("npis-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npis-custom":document.getElementById("npis-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npis-custom-width":document.getElementById("npis-custom-width"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npis-custom-height":document.getElementById("npis-custom-height"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npil-auto":document.getElementById("npil-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npil-source":document.getElementById("npil-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npil-custom":document.getElementById("npil-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npil-custom-left":document.getElementById("npil-custom-left"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npil-custom-top":document.getElementById("npil-custom-top"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "npim-copy":document.getElementById("npim-copy"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "npim-override":document.getElementById("npim-override"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npims-auto":document.getElementById("npims-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npims-source":document.getElementById("npims-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npims-custom":document.getElementById("npims-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npims-custom-width":document.getElementById("npims-custom-width"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npims-custom-height":document.getElementById("npims-custom-height"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npiml-auto":document.getElementById("npiml-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npiml-source":document.getElementById("npiml-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npiml-custom":document.getElementById("npiml-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npiml-custom-left":document.getElementById("npiml-custom-left"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npiml-custom-top":document.getElementById("npiml-custom-top"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "npv-override":document.getElementById("npv-override"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npvs-auto":document.getElementById("npvs-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npvs-source":document.getElementById("npvs-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npvs-custom":document.getElementById("npvs-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npvs-custom-width":document.getElementById("npvs-custom-width"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npvs-custom-height":document.getElementById("npvs-custom-height"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npvl-auto":document.getElementById("npvl-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npvl-source":document.getElementById("npvl-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npvl-custom":document.getElementById("npvl-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npvl-custom-left":document.getElementById("npvl-custom-left"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npvl-custom-top":document.getElementById("npvl-custom-top"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "npvm-copy":document.getElementById("npvm-copy"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "npvm-override":document.getElementById("npvm-override"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npvms-auto":document.getElementById("npvms-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npvms-source":document.getElementById("npvms-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npvms-custom":document.getElementById("npvms-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npvms-custom-width":document.getElementById("npvms-custom-width"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npvms-custom-height":document.getElementById("npvms-custom-height"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npvml-auto":document.getElementById("npvml-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npvml-source":document.getElementById("npvml-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npvml-custom":document.getElementById("npvml-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npvml-custom-left":document.getElementById("npvml-custom-left"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npvml-custom-top":document.getElementById("npvml-custom-top"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "npa-override":document.getElementById("npa-override"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npas-auto":document.getElementById("npas-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npas-source":document.getElementById("npas-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npas-custom":document.getElementById("npas-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npas-custom-width":document.getElementById("npas-custom-width"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npas-custom-height":document.getElementById("npas-custom-height"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npal-auto":document.getElementById("npal-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npal-source":document.getElementById("npal-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npal-custom":document.getElementById("npal-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npal-custom-left":document.getElementById("npal-custom-left"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npal-custom-top":document.getElementById("npal-custom-top"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "npam-copy":document.getElementById("npam-copy"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "npam-override":document.getElementById("npam-override"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npams-auto":document.getElementById("npams-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npams-source":document.getElementById("npams-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npams-custom":document.getElementById("npams-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npams-custom-width":document.getElementById("npams-custom-width"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npams-custom-height":document.getElementById("npams-custom-height"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npaml-auto":document.getElementById("npaml-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npaml-source":document.getElementById("npaml-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "npaml-custom":document.getElementById("npaml-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npaml-custom-left":document.getElementById("npaml-custom-left"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "npaml-custom-top":document.getElementById("npaml-custom-top"),

    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "pni-first":document.getElementById("pni-first"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "pni-last":document.getElementById("pni-last"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "pni-left":document.getElementById("pni-left"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "pni-right":document.getElementById("pni-right"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "pni-new":document.getElementById("pni-new"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "pns-auto":document.getElementById("pns-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "pns-source":document.getElementById("pns-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "pns-custom":document.getElementById("pns-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "pns-custom-width":document.getElementById("pns-custom-width"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "pns-custom-height":document.getElementById("pns-custom-height"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "pnl-auto":document.getElementById("pnl-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "pnl-source":document.getElementById("pnl-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "pnl-custom":document.getElementById("pnl-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "pnl-custom-left":document.getElementById("pnl-custom-left"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "pnl-custom-top":document.getElementById("pnl-custom-top"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "pnm-copy":document.getElementById("pnm-copy"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "pnm-override":document.getElementById("pnm-override"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "pnms-auto":document.getElementById("pnms-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "pnms-source":document.getElementById("pnms-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "pnms-custom":document.getElementById("pnms-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "pnms-custom-width":document.getElementById("pnms-custom-width"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "pnms-custom-height":document.getElementById("pnms-custom-height"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "pnml-auto":document.getElementById("pnml-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "pnml-source":document.getElementById("pnml-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "pnml-custom":document.getElementById("pnml-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "pnml-custom-left":document.getElementById("pnml-custom-left"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "pnml-custom-top":document.getElementById("pnml-custom-top"),

    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nns-auto":document.getElementById("nns-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nns-source":document.getElementById("nns-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nns-custom":document.getElementById("nns-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "nns-custom-width":document.getElementById("nns-custom-width"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "nns-custom-height":document.getElementById("nns-custom-height"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nnl-auto":document.getElementById("nnl-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nnl-source":document.getElementById("nnl-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nnl-custom":document.getElementById("nnl-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "nnl-custom-left":document.getElementById("nnl-custom-left"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "nnl-custom-top":document.getElementById("nnl-custom-top"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "nnm-copy":document.getElementById("nnm-copy"),
    /**@type {HTMLInputElement} `checkbox`*///@ts-ignore element does exist in DOM
    "nnm-override":document.getElementById("nnm-override"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nnms-auto":document.getElementById("nnms-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nnms-source":document.getElementById("nnms-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nnms-custom":document.getElementById("nnms-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "nnms-custom-width":document.getElementById("nnms-custom-width"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "nnms-custom-height":document.getElementById("nnms-custom-height"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nnml-auto":document.getElementById("nnml-auto"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nnml-source":document.getElementById("nnml-source"),
    /**@type {HTMLInputElement} `radio`*///@ts-ignore element does exist in DOM
    "nnml-custom":document.getElementById("nnml-custom"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "nnml-custom-left":document.getElementById("nnml-custom-left"),
    /**@type {HTMLInputElement} `number`*///@ts-ignore element does exist in DOM
    "nnml-custom-top":document.getElementById("nnml-custom-top"),

    /**@type {HTMLDivElement}*///@ts-ignore element does exist in DOM
    "note":document.getElementById("note"),
});
for(const id in html)
    if(html[id]==null)console.warn("options element %o not found",id);

//MARK: Note class

/**@author MAZ <https://github.com/MAZ01001> @license MIT 2025 MAZ @link <https://github.com/MAZ01001/chrome_detab>*/
const Note=class Note extends null{
    static #note=html.note;
    static #animPopup=Note.#note.animate(
        {scale:["0","1","1","0"],bottom:["-2rem","0rem","0rem","-2rem"]},
        {duration:2000,easing:"cubic-bezier(0,.9,.9,0)"}
    );
    static #animAmend=Note.#note.animate(
        {scale:["1","1.1","1.1","1"],bottom:["0rem",".5rem",".5rem","0rem"]},
        {fill:"both",duration:300,easing:"ease-out"}
    );
    static #animEnter=Note.#note.animate(
        {scale:["0","1","1","0"],bottom:["-2rem","0rem","0rem","-2rem"]},
        {iterations:.5,fill:"forwards",duration:2000,easing:"cubic-bezier(0,.9,.9,0)"}
    );
    static #animLeave=Note.#note.animate(
        {scale:["0","1","1","0"],bottom:["-2rem","0rem","0rem","-2rem"]},
        {iterationStart:.5,iterations:.5,fill:"forwards",duration:2000,easing:"cubic-bezier(0,.9,.9,0)"}
    );
    /**@type {boolean} `true` when popup is up (after {@linkcode popupStart})*/
    static #popup=false;
    /**`true` if a popup is currently up (with custom time)*/
    static get visible(){return Note.#popup;}
    /**`true` if the last popup was marked as error*/
    static get error(){return Note.#note.dataset.state==="f";}
    /**`true` if any animation is currently running*/
    static get running(){
        return Note.#animPopup.playState==="running"
            || Note.#animAmend.playState==="running"
            || Note.#animEnter.playState==="running"
            || Note.#animLeave.playState==="running";
    }
    static #cancelAll(){
        Note.#animPopup.cancel();
        Note.#animAmend.cancel();
        Note.#animEnter.cancel();
        Note.#animLeave.cancel();
    }
    /**@type {(txt:string,err?:boolean)=>void} show popup for 2sec or update when already shown*/
    static popup(txt,err){
        Note.#note.textContent=txt;
        Note.#note.dataset.state=(err??false)?"f":"";
        Note.#cancelAll();
        if(Note.#popup)Note.#animAmend.play();
        else Note.#animPopup.play();
    }
    /**@type {(txt:string,err?:boolean)=>void} show popup for a custom time (call {@linkcode popupEnd} to stop)*/
    static popupStart(txt,err){
        if(Note.#popup)return Note.popup(txt,err);
        Note.#popup=true;
        Note.#note.textContent=txt;
        Note.#note.dataset.state=err?"f":"";
        Note.#cancelAll();
        Note.#animEnter.play();
    }
    /**@type {(txt?:string,err?:boolean)=>void} hides popup (call after {@linkcode popupStart}) with optional last popup-message*/
    static popupEnd(txt,err){
        if(!Note.#popup)
            if(txt==null)return;
            else return Note.popup(txt,err);
        Note.#popup=false;
        if(Note.#animEnter.playState==="running"){
            if(txt!=null)return Note.popup(txt,err);
            const time=Note.#animEnter.currentTime;
            Note.#cancelAll();
            Note.#animPopup.currentTime=time;
            return Note.#animPopup.play();
        }
        Note.#cancelAll();
        if(txt==null)return Note.#animLeave.play();
        Note.#note.textContent=txt;
        Note.#note.dataset.state=(err??false)?"f":"";
        const abort=new AbortController();
        Note.#animAmend.addEventListener("cancel",()=>{
            Note.#animLeave.finish();
            Note.#animLeave.cancel();
            abort.abort();
        },{passive:true,signal:abort.signal});
        Note.#animAmend.addEventListener("finish",()=>{
            Note.#animLeave.play();
            abort.abort();
        },{passive:true,signal:abort.signal});
        Note.#animAmend.play();
    }
    /**@deprecated @throws {ReferenceError} if called*/
    constructor(){throw new ReferenceError("[Note] static class shall not be instantiated");}
    static{//~ reset animations, remove inherited methods, and make class and prototype immutable
        Note.#cancelAll();
        Object.setPrototypeOf(Note,null);
        Object.freeze(Note.prototype);
        Object.freeze(Note);
    }
};

//MARK: config

//~ numbers can be NaN to symbolise no input
//~ default numbers: width=100; height=75; left=0; top=0
//@ts-ignore no other "config" variable in this context (does not mix with background.js)
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
/**all keys of {@linkcode config} (includes `version`)*///@ts-ignore no other "configKeys" variable in this context (does not mix with background.js)
const configKeys=Object.freeze(Object.keys(config));
console.assert(configKeys.length<=chrome.storage.sync.MAX_ITEMS,"more items than can be saved in sync storage (%o)",chrome.storage.sync.MAX_ITEMS);
console.assert(!Object.hasOwn(config,"reason"),"config has key 'reason' which will interfere with error checking");

//MARK: helper functions

/**@type {(disable:boolean)=>void} disable all inputs in {@linkcode html} (for async edits)*/
const disableInputs=disable=>{
    for(const el of Object.values(html))
        if(el instanceof HTMLInputElement)el.disabled=disable;
    html.import.disabled=disable||html.file.files==null||html.file.files.length===0;
    html["sync-save"].disabled=html["sync-load"].disabled=disable||html.sync.checked;
    html.save.disabled=html.load.disabled=disable||html.autosave.checked;
};
/**set all elements in {@linkcode html} (except {@linkcode html.sync} and {@linkcode html.autosave}) to their default value and update {@linkcode config}*/
const loadDefaults=()=>{
    console.debug(">> reset inputs to default");
    for(const el of Object.values(html)){
        if(el===html.sync||el===html.autosave)continue;
        if(el instanceof HTMLInputElement)switch(el.type){
            case"radio":
                if(el.checked=el.defaultChecked){
                    const m=el.id.match(/^(.+-)([^-]+)$/i);
                    if(m!=null&&Object.hasOwn(config,m[1]))config[m[1]]=m[2];
                    else console.warn("[unexpected] unknown element %o",el);
                }
                break;
            case"checkbox":
                el.checked=el.defaultChecked;
                if(Object.hasOwn(config,el.id))config[el.id]=el.checked;
                else console.warn("[unexpected] unknown element %o",el);
                break;
            case"number":
                el.value=el.defaultValue;
                if(Object.hasOwn(config,el.id))config[el.id]=el.valueAsNumber;
                else console.warn("[unexpected] unknown element %o",el);
                break;
            case"button":break;
            case"file":
                el.files=null;
                html.import.disabled=true;
                break;
            default:
                console.warn("[unexpected] unknown element %o",el);
                el.checked=el.defaultChecked;
                el.value=el.defaultValue;
                break;
        }
    }
    Note.popup("Loaded defaults");
    console.debug("<< resetted inputs to default");
};

/**@type {(sync:boolean)=>Promise<void>} load from {@linkcode chrome.storage.sync} or {@linkcode chrome.storage.local}*/
const loadFromStorage=async sync=>{
    const storage=sync?"sync":"local";
    console.debug(">> load settings from %o storage",storage);
    disableInputs(true);
    Note.popupStart("Loading...");
    //~ keys are the same as input list of keys (if in storage)
    const configNew=await chrome.storage[storage].get(configKeys).catch(reason=>({reason}));
    if(configNew==null||"reason" in configNew){
        Note.popupEnd("Couldn't load",true);
        disableInputs(false);
        return console.error("[unexpected] unable to load from storage: %o",configNew?.reason);
    }
    if(configNew.version!==config.version)console.warn("different stored version (%o)",configNew.version);
    let count=0;
    for(const[key,val]of Object.entries(configNew)){
        if(key==="version")continue;
        const type=typeof val;
        if(typeof config[key]!==type){
            console.warn("[unexpected] type missmatch for %o = %o → skipping",key,val);
            continue;
        }
        switch(type){
            case"number":
                if(val<0||!(Number.isNaN(val)||Number.isSafeInteger(val))){
                    console.warn("[unexpected] number %o is set but not a positive safe integer (%o) → skipping",key,val);
                    continue;
                }
                html[key].valueAsNumber=config[key]=val;
                break;
            case"boolean":
                html[key].checked=config[key]=val;
                break;
            case"string":
                config[key]=val;
                html[key+val].checked=true;
                break;
            default:
                console.warn("[unexpected] unknown config %o = %o → skipping",key,val);
                continue;
        }
        ++count;
    }
    if(count!==configKeys.length-1)console.warn("only loaded %o settings",count);
    Note.popupEnd("Loaded");
    disableInputs(false);
    console.debug("<< loaded settings from %o storage",storage);
};
/**@type {(sync:boolean)=>Promise<void>} load from {@linkcode chrome.storage.sync} or {@linkcode chrome.storage.local}*/
const saveToStorage=async sync=>{
    const storage=sync?"sync":"local";
    console.debug(">> save settings in %o storage",storage);
    disableInputs(true);
    Note.popupStart("Saving...");
    const res=await chrome.storage[storage].set(config).then(()=>({}),reason=>({reason}));
    if("reason" in res){
        Note.popupEnd("Couldn't save",true);
        disableInputs(false);
        return console.error("[unexpected] unable to save to sync storage: %o",res.reason);
    }
    Note.popupEnd("Saved");
    disableInputs(false);
    console.debug("<< saved settings in %o storage",storage);
};
/**@type {(syncToLocal:boolean)=>Promise<void>} transfer {@linkcode chrome.storage.sync} to {@linkcode chrome.storage.local} or vice versa*/
const copyStorage=async syncToLocal=>{
    /**@type {["sync","local"]|["local","sync"]}*/
    const[from,to]=syncToLocal?["sync","local"]:["local","sync"];
    console.debug(">> transfer storage (%o → %o)",from,to);
    disableInputs(true);
    Note.popupStart("Transfering settings...");
    const stored=await chrome.storage[from].get(configKeys).catch(reason=>({reason}));
    if("reason" in stored){
        Note.popupEnd("Couldn't load settings",true);
        disableInputs(false);
        return console.error("[unexpected] couldn't load storage from %o: %o",from,stored.reason);
    }
    const res=await chrome.storage[to].set(stored).then(()=>({}),reason=>({reason}));
    if("reason" in res){
        Note.popupEnd("Couldn't transfer settings",true);
        disableInputs(false);
        return console.error("couldn't copy storage to %o: %o",to,res.reason);
    }
    Note.popupEnd("Settings transfered");
    disableInputs(false);
    console.debug("<< transfered storage (%o → %o)",from,to);
};
/**@type {(sync:boolean)=>Promise<void>} clear entire {@linkcode chrome.storage.sync} or {@linkcode chrome.storage.local}*/
const clearStorage=async sync=>{
    const storage=sync?"sync":"local";
    console.debug(">> clear %o storage",storage);
    disableInputs(true);
    Note.popupStart("Clearing...");
    const res=await chrome.storage[storage].clear().then(()=>({}),reason=>({reason}));
    if("reason" in res){
        Note.popupEnd("Couldn't clear storage",true);
        disableInputs(false);
        return console.error("[unexpected] unable to clear %o storage: %o",storage,res.reason);
    }
    Note.popupEnd("Cleared");
    disableInputs(false);
    console.debug("<< cleared %o storage",storage);
};

const loadFromFile=async()=>{
    console.debug(">> load settings from file");
    disableInputs(true);
    Note.popupStart("Loading...");
    const file=html.file.files?.item(0);
    if(file==null){
        Note.popupEnd("No file",true);
        disableInputs(false);
        return console.error("no file given");
    }
    if(file.type!=="application/json"){
        Note.popupEnd("Invalid file format",true);
        disableInputs(false);
        return console.error("invalid file type (%o)",file.type);
    }
    /**@type {{reason:any}|{reasonJSON:any}|{[K in string]:any}}*/
    const configNew=await file.text().then(v=>JSON.parse(v),reason=>({reason})).catch(reasonJSON=>({reasonJSON}));
    if("reason" in configNew){
        Note.popupEnd("Couldn't read file",true);
        disableInputs(false);
        return console.error("unable to read file: %o",configNew.reason);
    }
    if("reasonJSON" in configNew){
        Note.popupEnd("Invalid JSON",true);
        disableInputs(false);
        return console.error("invalid JSON: %o",configNew.reasonJSON);
    }
    if(configNew.version!==config.version)console.warn("different file version (%o)",configNew.version);
    let count=0;
    for(const[key,val]of Object.entries(configNew)){
        if(key==="version")continue;
        const type=typeof val;
        if(typeof config[key]!==type){
            console.warn("[unexpected] type missmatch for %o = %o → skipping",key,val);
            continue;
        }
        switch(type){
            case"number":
                if(val<0||!(Number.isNaN(val)||Number.isSafeInteger(val))){
                    console.warn("[unexpected] number %o is not a positive safe integer (%o) → skipping",key,val);
                    continue;
                }
                html[key].valueAsNumber=config[key]=val;
                break;
            case"boolean":
                html[key].checked=config[key]=val;
                break;
            case"string":
                config[key]=val;
                html[key+val].checked=true;
                break;
            default:
                console.warn("[unexpected] unknown config %o = %o → skipping",key,val);
                continue;
        }
        ++count;
    }
    if(count!==configKeys.length-1)console.warn("only loaded %o settings",count);
    Note.popupEnd("Loaded");
    disableInputs(false);
    console.debug("<< loaded settings from file");
};
const saveToFile=()=>Object.assign(document.createElement("a"),{href:`data:application/json,${encodeURIComponent(JSON.stringify(config))}`,download:"chrome_detab.json"}).click();

//MARK: event listener

html.sync.addEventListener("change",async()=>{
    const res=await chrome.storage.local.set({sync:html.sync.checked}).then(()=>({}),reason=>({reason}));
    if("reason" in res){
        html.sync.checked=!html.sync.checked;
        return console.error("couldn't write sync state to local storage: %o",res.reason);
    }
    console.debug("wrote sync state to local storage");
    html["sync-save"].disabled=html["sync-load"].disabled=html.sync.checked;
    if(html.autosave.checked)await saveToStorage(html.sync.checked);
    else await copyStorage(!html.sync.checked);
},{passive:true});
html["sync-save"].addEventListener("click",()=>saveToStorage(true),{passive:true});
html["sync-load"].addEventListener("click",()=>loadFromStorage(true),{passive:true});
html.autosave.addEventListener("change",async()=>{
    const res=await chrome.storage.local.set({autosave:html.autosave.checked}).then(()=>({}),reason=>({reason}));
    if("reason" in res){
        html.autosave.checked=!html.autosave.checked;
        return console.error("couldn't write autosave state to local storage: %o",res.reason);
    }
    console.debug("wrote autosave state to local storage");
    if(html.save.disabled=html.load.disabled=html.autosave.checked)saveToStorage(html.sync.checked);
},{passive:true});
html.save.addEventListener("click",()=>saveToStorage(html.sync.checked),{passive:true});
html.load.addEventListener("click",()=>loadFromStorage(html.sync.checked),{passive:true});
html.export.addEventListener("click",()=>saveToFile(),{passive:true});
html.import.addEventListener("click",async()=>{
    await loadFromFile();
    if(!Note.error&&html.autosave.checked){
        await saveToStorage(html.sync.checked);
        if(Note.error)Note.popup("Loaded but couldn't save",true);
        else Note.popup("Loaded file and saved");
    }
},{passive:true});
html.file.addEventListener("change",()=>{html.import.disabled=html.file.files==null||html.file.files.length===0;},{passive:true});
html.reset.addEventListener("click",async()=>{
    loadDefaults();
    if(html.autosave.checked){
        await saveToStorage(html.sync.checked);
        if(Note.error)Note.popup("Reset but couldn't save",true);
        else Note.popup("Loaded defaults and saved");
    }
},{passive:true});

/**@type {(this:HTMLInputElement,ev:Event)=>void} (`change` event) for all input fields*/
const handleChange=function(ev){
    console.debug("== change %o",this.id);
    switch(this.type){
        case"radio":
            const m=this.id.match(/^(.+-)([^-]+)$/i);
            if(m!=null&&Object.hasOwn(config,m[1]))config[m[1]]=m[2];
            else console.warn("[unexpected] unknown element %o",this);
            break;
        case"checkbox":
            if(Object.hasOwn(config,this.id))config[this.id]=this.checked;
            else console.warn("[unexpected] unknown element %o",this);
            break;
        case"number":
            if(!this.reportValidity())break;
            if(Object.hasOwn(config,this.id))config[this.id]=this.valueAsNumber;
            else console.warn("[unexpected] unknown element %o",this);
            break;
        default:
            console.warn("[unexpected] unknown element %o",this);
            break;
    }
    if(html.autosave.checked)saveToStorage(html.sync.checked);
};
for(const [id,el] of Object.entries(html))
    if(/^(?:np|pn|nn).*-/.test(id))el.addEventListener("change",handleChange,{passive:true});

//MARK: load settigns from storage (if present)

(async()=>{
    disableInputs(true);
    Note.popupStart("Loading...");
    const res=await chrome.storage.local.get(["sync","autosave"]).catch(reason=>({reason}));
    if("reason" in res){
        Note.popupEnd("Couldn't load",true);
        disableInputs(false);
        return console.error("couldn't get sync/autosave state from storage: %o",res.reason);
    }
    if("autosave" in res)html.autosave.checked=Boolean(res.autosave);
    else console.debug("no autosave state in storage (maybe first install)");
    if("sync" in res)return await loadFromStorage(html.sync.checked=Boolean(res.sync));
    else console.debug("no sync state in storage (maybe first install)");
    Note.popupEnd("Loaded");
    disableInputs(false);
})();

console.debug("loaded script in %oms",Number((performance.now()-timeStart).toFixed(2)));
