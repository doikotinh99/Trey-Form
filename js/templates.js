/**
 * @file templates.js
 * @description HTML template builders and document body definitions for all 10 HVAC forms
 * @dependencies config.js
 */

window.App = window.App || {};

const B = (p, c = "") => `<span class="bind ${c}" data-bind="${p}">{{${p}}}</span>`;
const IMG = (p, c = "img", t = "Image") => `<div class="${c}" data-bind-src="${p}"><span>${t}</span></div>`;
const REP = (k, tag, inner, at = "") => `<${tag} data-repeat="${k}" ${at}><template>${inner}</template></${tag}>`;
const card = (h, b) => `<div class="card"><div class="card-header">${h}</div><div class="card-body">${b}</div></div>`;
const lab = (l, v) => `<div class="mb-2"><div class="form-label">${l}</div>${v}</div>`;
const head = t => `<div class="doc-head"><div><div class="brand-name">${B("company.name")}</div><div class="brand-tag">${B("company.tagline")}</div></div><div class="text-end small"><span class="badge">${t}</span><div class="mt-3">No. ${B("doc.number")}<br>Date ${B("doc.date")}</div></div></div><h2 class="doc-title">${t}</h2>`;
const foot = () => `<div class="doc-foot"><span>${B("company.phone")} &middot; ${B("company.email")}</span><span>${B("company.web")} &middot; ${B("company.license")}</span></div>`;
const parties = (a = "Bill to", b = "Service address") => `<div class="row"><div class="col-6">${card(a, lab("Name", B("customer.name")) + lab("Phone", B("customer.phone")) + lab("Email", B("customer.email")))}</div><div class="col-6">${card(b, lab("Street", B("customer.street")) + lab("City, state, ZIP", B("customer.city_state_zip")))}</div></div>`;
const table = (cols = (window.App.COLS || COLS), key = "items", tot = true) => `<table class="table"><thead><tr>${cols.map(c => `<th>${c[0]}</th>`).join("")}</tr></thead>${REP(key, "tbody", `<tr>${cols.map(c => `<td>${B(c[1])}</td>`).join("")}</tr>`)}</table>` + (tot ? `<div class="totals"><div><span>Subtotal</span>${B("totals.subtotal")}</div><div><span>Tax</span>${B("totals.tax")}</div><div class="grand"><span>Total</span>${B("totals.total")}</div></div>` : "");
const photos = () => REP("photos", "div", `<div class="col-4">${IMG("url", "photo", "Photo / video")}<div class="mt-3 small">Title: ${B("title")}</div></div>`, 'class="row"');
const sigs = (a = "Customer signature") => `<div class="row mt-3"><div class="col-6">${IMG("signature.customer_image", "sig", "")}<div class="small text-muted">${a}</div></div><div class="col-6"><div class="sig">${B("signature.date")}</div><div class="small text-muted">Date</div></div></div>`;
const chk = (p, l) => l.map(([v, t]) => `<div class="form-check"><span class="box" data-check="${p}" data-value="${v}"></span><span>${t}</span></div>`).join("");
const tech = () => `<div class="small text-muted mt-3">Prepared by ${B("tech.name")} &middot; ${B("tech.phone")} &middot; ${B("tech.email")}</div>`;
const TERMS_REF = window.App.TERMS || (typeof TERMS !== "undefined" ? TERMS : "");

const BODY = {
    estimate: () => parties("Prepared for", "Service address") + tech() + `<h5 class="mt-3">Your new comfort system</h5>` + REP("equipment", "div", `<div class="card eq"><div class="eqrow">${IMG("image")}<div class="eqbody"><h5>${B("name")}</h5><div class="small text-muted">Part # ${B("part")}</div>${REP("key_specs", "div", `<div><div class="form-label">${B("label")}</div>${B("value")}</div>`, 'class="kspecs"')}<div class="small"><b class="ok">Warranty</b> ${B("warranty")}</div></div></div><details class="eq-details"><summary>Full specifications</summary>${REP("specs", "div", `<div class="sp"><span>${B("label")}</span><span>${B("value")}</span></div>`, 'class="specs"')}</details></div>`, 'class="eqlist"') +
        `<h5 class="mt-3">Your investment</h5><div class="total-card"><span>Estimate total</span><span class="big">${B("totals.total")}</span></div><div class="row mt-3"><div class="col-4"><div class="card"><div class="card-body"><div class="form-label">Deposit to schedule</div><div class="big2">${B("totals.deposit")}</div></div></div></div>` + REP("financing", "div", `<div class="col-4"><div class="card"><div class="card-body"><div class="form-label">${B("plan")} &middot; ${B("term")}</div><div class="big2">${B("monthly")}<small> / month</small></div></div></div></div>`, 'class="fin"') + `</div><div class="alert small mb-3">${B("company.financing_note")}</div>` +
        `<h5 class="mt-3">Our warranty</h5><div class="alert mb-3"><b>${B("company.warranty_text")}</b></div>${TERMS_REF}<h5>Acceptance</h5>${sigs()}<div class="alert mt-3 small">Thank you for the opportunity to be your service provider. Questions? Contact ${B("tech.name")} at ${B("tech.phone")}.</div>`,
    "install-agreement": () => parties("Customer", "Installation address") + `<h5 class="mt-3">Scope of work</h5><div class="card mb-3"><div class="card-body">${B("agreement.scope")}</div></div><h5>Terms</h5><div class="card mb-3"><div class="card-body small">${B("agreement.terms")}</div></div><div class="alert small"><b>Warranty:</b> ${B("company.warranty_text")}</div>${sigs()}${sigs("Company representative")}`,
    "install-receipt": () => parties() + `<h5 class="mt-3">Items installed</h5>` + table() + `<h5 class="mt-3">Installed units</h5>` + REP("units", "div", `<div class="col-12">${card("Unit", `<div class="row"><div class="col-6">${lab("Brand", B("brand"))}</div><div class="col-6">${lab("Equipment type", B("type"))}</div><div class="col-6">${lab("Model number", B("model"))}</div><div class="col-6">${lab("Serial number", B("serial"))}</div><div class="col-12">${lab("Warranty registration URL", B("registration_url"))}</div></div>`)}</div>`, 'class="row"') + `<div class="alert small"><b>${B("company.warranty_text")}</b></div>`,
    inspection: () => parties("Customer", "Service address") + `<div class="row mt-3"><div class="col-6">${lab("Technician", B("report.technician"))}</div><div class="col-6">${lab("Equipment inspected", B("report.equipment"))}</div></div><h5>Photos &amp; video</h5>${photos()}<h5 class="mt-3">Findings &amp; recommendation</h5><div class="card"><div class="card-body">${B("report.summary")}</div></div>`,
    approval: () => parties("Customer", "Service address") + `<h5 class="mt-3">Recommended repair</h5>` + table() + `<h5 class="mt-3">Customer decision</h5>${chk("approval.decision", [["approve", "I approve the work above at the total shown."], ["decline", "I decline the work above."]])}${sigs()}`,
    "service-receipt": () => parties() + `<h5 class="mt-3">Service performed</h5>` + table() + `<div class="row mt-3"><div class="col-4">${lab("Payment method", B("totals.payment_method"))}</div><div class="col-4">${lab("Paid", B("totals.paid"))}</div><div class="col-4">${lab("Balance due", B("totals.balance"))}</div></div>`,
    "buyer-seller": () => parties("Buyer / client", "Property address") + `<div class="row mt-3"><div class="col-6">${lab("Seller / agent", B("report.seller"))}</div><div class="col-6">${lab("Inspection date", B("report.inspection_date"))}</div></div><h5>Photos &amp; video</h5>${photos()}<h5 class="mt-3">Report summary</h5><div class="card"><div class="card-body">${B("report.summary")}</div></div>`,
    "right-to-repair": () => parties("Customer", "Service address") + `<div class="card mt-3"><div class="card-body">${B("right_to_repair.text")}</div></div>${sigs()}`,
    decline: () => parties("Customer", "Service address") + `<h5 class="mt-3">Reason for declining</h5>${chk("decline.reasons", [["diagnostic", "Customer declined diagnostic"], ["quote", "Customer declined repair quote"], ["unsafe", "Unsafe or impractical to repair"], ["other", "Other"]])}<h5 class="mt-3">Notes</h5><div class="card"><div class="card-body">${B("decline.notes")}</div></div>${sigs()}`,
    warranty: () => `<div class="alert mb-3"><b>${B("company.warranty_text")}</b></div><h5>Equipment covered</h5>` + table([["Equipment", "equipment"], ["Model", "model"], ["Serial", "serial"], ["Warranty term", "term"], ["Register by", "register_by"], ["Notes", "notes"]], "warranty_items", false) + `<h5 class="mt-3">Guidelines</h5>${TERMS_REF}`
};

Object.assign(window.App, {
    B, IMG, REP, card, lab, head, foot, parties, table, photos, sigs, chk, tech, BODY
});
