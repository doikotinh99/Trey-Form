/**
 * @file config.js
 * @description Application constants, company themes, form definitions, table columns, and warranty terms
 * @dependencies none
 */

window.App = window.App || {};

const THEMES = {
    jerrys: {
        label: "Jerry's Heating & Cooling",
        brand: "#0b2545",
        accent: "#c8102e",
        font: 'system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif'
    },
    sample: {
        label: "Sample Company HVAC",
        brand: "#14532d",
        accent: "#d97706",
        font: 'Georgia,"Times New Roman",serif'
    }
};

const FORMS = [
    ["estimate", "Estimate"],
    ["install-agreement", "Installation Agreement"],
    ["install-receipt", "Installation Receipt"],
    ["inspection", "Inspection Report"],
    ["approval", "Estimate Approval"],
    ["service-receipt", "Service Receipt"],
    ["buyer-seller", "Buyer / Seller Report"],
    ["right-to-repair", "Right to Repair"],
    ["decline", "Decline to Service"],
    ["warranty", "Warranties & Guidelines"]
];

const COLS = [
    ["Qty", "qty"],
    ["Item name", "name"],
    ["SKU / model", "sku"],
    ["Type", "type"],
    ["Description", "description"],
    ["Unit price", "unit_price"],
    ["Line total", "line_total"]
];

const TERMS = `<div class="alert small mb-3"><b>Must maintain:</b> annual service appointments and records are required for each piece of equipment during the warranty term.<br><b>Not covered by the manufacturer warranty:</b> power surge; direct or indirect physical damage; water damage; negligent service or repairs; and claims after lengthy periods without proper service or maintenance.<br><b>Protect your equipment:</b> keep the area free of airflow blockage, dirt, dust, standing water and high traffic. Where applicable, place 36" of gravel or stone around outdoor units.</div>`;

Object.assign(window.App, { THEMES, FORMS, COLS, TERMS });
