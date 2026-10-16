/**
 * @file events.js
 * @description User interaction handlers, tab switching delegation, print flows, and clipboard actions
 * @dependencies render.js, data.js, config.js
 */

window.App = window.App || {};

function doPrint(setup) {
    const hlState = document.body.classList.contains("hl");
    document.body.classList.remove("hl");
    const detailsMap = [];
    document.querySelectorAll("details").forEach(d => {
        detailsMap.push({ d, wasOpen: d.open });
        d.open = true;
        d.setAttribute("open", "");
    });
    if (setup) setup();
    requestAnimationFrame(() => {
        setTimeout(() => {
            window.print();
            if (hlState) document.body.classList.add("hl");
            detailsMap.forEach(item => {
                if (!item.wasOpen) {
                    item.d.open = false;
                    item.d.removeAttribute("open");
                }
            });
            document.body.classList.remove("print-all");
            const showFn = window.App.show || show;
            const curForm = window.App.cur || cur;
            showFn(curForm);
        }, 40);
    });
}

function initEvents() {
    const $ = window.App.$ || (s => document.querySelector(s));
    const renderFn = window.App.render || render;
    const showFn = window.App.show || show;
    const sampleFn = window.App.sampleFor || sampleFor;

    document.addEventListener("click", e => {
        const btn = e.target.closest("[data-k]");
        if (btn && btn.dataset.k) showFn(btn.dataset.k);
    });

    const hl = $("#hl");
    if (hl) {
        hl.onchange = e => document.body.classList.toggle("hl", e.target.checked);
        document.body.classList.add("hl");
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("hl") === "0") {
            hl.checked = false;
            document.body.classList.remove("hl");
        }
    }

    const viewMode = $("#viewMode");
    if (viewMode) {
        viewMode.onchange = e => {
            document.body.classList.toggle("view-print", e.target.value === "print");
        };
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("view") === "print") {
            viewMode.value = "print";
            document.body.classList.add("view-print");
        }
    }

    const mode = $("#mode");
    if (mode) {
        mode.onchange = e => {
            window.App.ph = e.target.value === "ph";
            renderFn();
        };
    }

    const coSelect = $("#co");
    if (coSelect) {
        coSelect.onchange = e => {
            window.App.co = e.target.value;
            renderFn();
        };
    }

    const pOne = $("#pOne");
    if (pOne) {
        pOne.onclick = () => doPrint(() => document.body.classList.remove("print-all"));
    }

    const pAll = $("#pAll");
    if (pAll) {
        pAll.onclick = () => doPrint(() => {
            document.body.classList.add("print-all");
            document.querySelectorAll(".sheet").forEach(s => s.classList.add("show"));
        });
    }

    const cp = $("#cp");
    if (cp) {
        cp.onclick = async () => {
            const currentCo = window.App.co || "jerrys";
            const t = JSON.stringify(sampleFn(currentCo), null, 2);
            try {
                await navigator.clipboard.writeText(t);
                cp.textContent = "Copied";
            } catch (x) {
                prompt("Copy sample JSON:", t);
            }
            setTimeout(() => { cp.textContent = "Copy sample JSON"; }, 1500);
        };
    }

    let hlWas, savedDetails = [];
    window.addEventListener("beforeprint", () => {
        hlWas = document.body.classList.contains("hl");
        document.body.classList.remove("hl");
        savedDetails = [];
        document.querySelectorAll("details").forEach(d => {
            savedDetails.push({ d, wasOpen: d.open });
            d.open = true;
            d.setAttribute("open", "");
        });
    });

    window.addEventListener("afterprint", () => {
        if (hlWas) document.body.classList.add("hl");
        savedDetails.forEach(item => {
            if (!item.wasOpen) {
                item.d.open = false;
                item.d.removeAttribute("open");
            }
        });
        savedDetails = [];
        document.body.classList.remove("print-all");
        const curForm = window.App.cur || cur;
        showFn(curForm);
    });
}

Object.assign(window.App, { doPrint, initEvents });
