/**
 * @file render.js
 * @description Data-binding engine, field collector, sheet generation, and window.HVAC public API
 * @dependencies config.js, data.js, templates.js
 */

window.App = window.App || {};

const $ = s => document.querySelector(s);
let cur = "estimate", co = "jerrys", ph = false;

/* ---------- renderer: fills a rendered form from a JSON object ---------- */
const get = (o, p) => p.split(".").reduce((a, k) => a == null ? a : a[k], o);

function bind(root, data, pre, ph) {
    root.querySelectorAll("[data-repeat]").forEach(r => {
        const t = r.querySelector(":scope > template"), k = r.dataset.repeat;
        if (!t) return;
        [...r.children].forEach(n => { if (n !== t) n.remove(); });
        (ph ? [{}] : get(data, k) || []).forEach(it => {
            const f = t.content.cloneNode(true);
            bind(f, it, pre + k + "[].", ph);
            r.appendChild(f);
        });
    });
    root.querySelectorAll("[data-bind],[data-bind-src],[data-check]").forEach(e => {
        if (e.closest("[data-repeat]")) return;
        const p = e.dataset.bind || e.dataset.bindSrc || e.dataset.check, v = get(data, p);
        e.title = pre + p;
        if (e.dataset.bind !== undefined) {
            e.textContent = ph ? `{{${pre}${p}}}` : (v ?? "");
        } else if (e.dataset.bindSrc !== undefined) {
            const i = e.querySelector("img");
            if (i) i.remove();
            if (!ph && v) {
                const m = document.createElement("img");
                m.src = v;
                m.alt = "";
                e.appendChild(m);
                e.classList.add("has");
            } else {
                e.classList.remove("has");
            }
        } else {
            e.classList.toggle("on", !ph && (Array.isArray(v) ? v.includes(e.dataset.value) : v === e.dataset.value));
        }
    });
}

function collect(root, pre, out) {
    root.querySelectorAll("[data-repeat]").forEach(r => {
        if (r.parentElement && r.parentElement.closest("[data-repeat]") && root.nodeType === 1 && false) return;
        const t = r.querySelector(":scope > template");
        if (!t) return;
        out.add(pre + r.dataset.repeat + "[]");
        collect(t.content, pre + r.dataset.repeat + "[].", out);
    });
    root.querySelectorAll("[data-bind],[data-bind-src],[data-check]").forEach(e => {
        if (e.closest("template")) return;
        if (root.nodeType === 1 && e.closest("[data-repeat]")) return;
        out.add(pre + (e.dataset.bind || e.dataset.bindSrc || e.dataset.check));
    });
}

function fieldsOf(key) {
    const d = document.createElement("div");
    const bodyObj = window.App.BODY || BODY;
    d.innerHTML = head("x") + bodyObj[key]() + foot();
    const o = new Set();
    collect(d, "", o);
    const tpl = (n, pre) => { n.querySelectorAll("template").forEach(t => { }); };
    // also collect binds inside templates (relative)
    const walk = (root, pre) => {
        root.querySelectorAll("[data-repeat]").forEach(r => {
            const t = r.querySelector(":scope > template");
            if (!t) return;
            const p = pre + r.dataset.repeat + "[].";
            t.content.querySelectorAll("[data-bind],[data-bind-src],[data-check]").forEach(e => {
                if (e.closest("[data-repeat]")) return;
                o.add(p + (e.dataset.bind || e.dataset.bindSrc || e.dataset.check));
            });
            walk(t.content, p);
        });
    };
    walk(d, "");
    d.querySelectorAll("template").forEach(() => { });
    return [...o].sort();
}

window.HVAC = {
    render: (el, data, ph) => bind(el, data, "", ph),
    fields: fieldsOf,
    forms: window.App.FORMS || FORMS
};

function render() {
    const themes = window.App.THEMES || THEMES;
    const forms = window.App.FORMS || FORMS;
    const bodyObj = window.App.BODY || BODY;
    const sampleFn = window.App.sampleFor || sampleFor;

    const th = themes[co], r = document.documentElement.style;
    r.setProperty("--brand", th.brand);
    r.setProperty("--accent", th.accent);
    r.setProperty("--font", th.font);
    document.body.classList.toggle("ph", ph);
    const docs = $("#docs");
    if (docs) {
        docs.innerHTML = forms.map(([k, t]) => `<section class="sheet" id="s-${k}">${head(t)}${bodyObj[k]()}${foot()}</section>`).join("");
    }
    const data = sampleFn(co);
    document.querySelectorAll(".sheet").forEach(s => window.HVAC.render(s, data, ph));
    const tabs = $("#tabs");
    if (tabs) {
        tabs.innerHTML = forms.map(([k, t]) => `<button role="tab" data-k="${k}">${t}</button>`).join("");
    }
    show(cur);
}

function show(k) {
    cur = k;
    document.querySelectorAll(".sheet").forEach(s => s.classList.toggle("show", s.id === "s-" + k));
    document.querySelectorAll("#tabs button").forEach(b => b.classList.toggle("active", b.dataset.k === k));
}

Object.assign(window.App, {
    $, get, bind, collect, fieldsOf, render, show
});

Object.defineProperties(window.App, {
    cur: { get() { return cur; }, set(v) { cur = v; }, configurable: true, enumerable: true },
    co: { get() { return co; }, set(v) { co = v; }, configurable: true, enumerable: true },
    ph: { get() { return ph; }, set(v) { ph = v; }, configurable: true, enumerable: true }
});
