/**
 * @file main.js
 * @description Application bootstrap, wires components together and triggers initial render
 * @dependencies config.js, data.js, templates.js, render.js, events.js
 */

(function () {
    const $ = window.App.$ || (s => document.querySelector(s));
    const themes = window.App.THEMES || THEMES;
    const coSelect = $("#co");

    if (coSelect && themes) {
        coSelect.innerHTML = Object.entries(themes)
            .map(([k, t]) => `<option value="${k}">${t.label}</option>`)
            .join("");
    }

    const initEventsFn = window.App.initEvents || initEvents;
    if (typeof initEventsFn === "function") {
        initEventsFn();
    }

    const renderFn = window.App.render || render;
    if (typeof renderFn === "function") {
        renderFn();
    }
})();
