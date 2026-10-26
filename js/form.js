
const FORM_SUITE_VERSION = "2.2.0";
console.log(`[HVAC Form Suite] Loaded version: ${FORM_SUITE_VERSION}`);

const COMPANIES = [
    { id: "jerrys", name: "Jerrys Heatng and Cooling", enabled: true },
    { id: "pozitivehvac", name: "Pozitive Heating and Cooling", enabled: true },
    { id: "bestcomforthvac", name: "Best Comfort HVAC of Joliet", enabled: true },
    { id: "bestcomforthvacservices", name: "Best Comfort HVAC Chicago", enabled: true },
    { id: "bestcomforthvacrepair", name: "Best Comfort HVAC New Lenox", enabled: true },
    { id: "repairsboilers", name: "Repairs Boilers Service & Hvac", enabled: true },
    { id: "watershotagain", name: "Water Heaters & Boiler Hvac Service", enabled: true },
    { id: "dupagehvacservices", name: "Best Comfort HVAC Naperville", enabled: true },
    { id: "treydurden", name: "Trey Durden Heating and Cooling", enabled: true },
    { id: "affordablehvacrepairs", name: "Affordable Heating & Cooling of Plainfield", enabled: true },
    { id: "blueflameheatingcooling", name: "Blue Flame Heating & Cooling of Joliet", enabled: true },
    { id: "completehvacservice", name: "Complete Heating and Cooing of Bolingbrook", enabled: true }
];

const FORMS = [
    { file: "estimate.html", name: "Estimate Form", enabled: true },
    { file: "install-agreement.html", name: "New Installation Agreement", enabled: true },
    { file: "install-receipt.html", name: "New Installation Receipt", enabled: true },
    { file: "inspection.html", name: "Field Service/Inspection Report", enabled: true },
    { file: "approval.html", name: "Field Service Estimate Approval", enabled: true },
    { file: "service-receipt.html", name: "Field Service Receipt", enabled: true },
    { file: "buyer-seller.html", name: "Buyer/Seller Report Form", enabled: true },
    { file: "right-to-repair.html", name: "Right to Repair and Correct", enabled: true },
    { file: "decline.html", name: "Decline to Service/Repair Report", enabled: true },
    { file: "warranty.html", name: "Manufactures Warranties and Guidelines Documentation", enabled: true }
];

function getCurrentBranch() {
    const parts = window.location.pathname.replace(/\\/g, "/").split("/").filter(Boolean);
    const branchIndex = parts.indexOf("branches");
    if (branchIndex !== -1 && parts[branchIndex + 1]) {
        return parts[branchIndex + 1].toLowerCase();
    }
    if (parts.length >= 2) {
        return parts[parts.length - 2].toLowerCase();
    }
    return "";
}

function initCompanyDropdown() {
    const coSelect = document.getElementById("co");
    if (!coSelect) return;

    const currentBranch = getCurrentBranch();

    coSelect.innerHTML = "";

    COMPANIES.forEach(function (company) {
        if (company.enabled !== false) {
            const opt = document.createElement("option");
            opt.value = company.id;
            opt.textContent = company.name;
            if (company.id.toLowerCase() === currentBranch) {
                opt.selected = true;
            }
            coSelect.appendChild(opt);
        }
    });

    coSelect.addEventListener("change", function (e) {
        const targetCo = e.target.value;
        const currentFile = window.location.pathname.split("/").pop() || "estimate.html";
        window.location.href = `../${targetCo}/${currentFile}`;
    });
}

function filterFormTabs() {
    const tabsContainer = document.getElementById("tabs");
    if (!tabsContainer) return;

    const disabledFiles = new Set(
        FORMS.filter(function (f) { return f.enabled === false; })
             .map(function (f) { return f.file.toLowerCase(); })
    );

    if (disabledFiles.size > 0) {
        tabsContainer.querySelectorAll("a").forEach(function (tabLink) {
            const href = tabLink.getAttribute("href") || "";
            const fileName = href.split("/").pop().split("?")[0].toLowerCase();
            if (disabledFiles.has(fileName)) {
                tabLink.style.display = "none";
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {

    initCompanyDropdown();
    filterFormTabs();

    const hlCheckbox = document.getElementById("hl");
    if (hlCheckbox) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("hl") === "1" || urlParams.get("hl") === "true") {
            hlCheckbox.checked = true;
            document.body.classList.add("hl");
        } else {
            hlCheckbox.checked = false;
            document.body.classList.remove("hl");
        }
        hlCheckbox.addEventListener("change", function (e) {
            document.body.classList.toggle("hl", e.target.checked);
        });
    }

    const viewModeCheckbox = document.getElementById("viewMode");
    if (viewModeCheckbox) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("view") === "print") {
            viewModeCheckbox.checked = true;
            document.body.classList.add("view-print");
        }
        viewModeCheckbox.addEventListener("change", function (e) {
            document.body.classList.toggle("view-print", e.target.checked);
        });
    }

    let detailsSaved = [];
    function openAllDetails() {
        detailsSaved = [];
        document.querySelectorAll("details").forEach(function (d) {
            detailsSaved.push({ el: d, wasOpen: d.open });
            d.open = true;
            d.setAttribute("open", "");
        });
    }

    function restoreDetails() {
        detailsSaved.forEach(function (item) {
            if (!item.wasOpen) {
                item.el.open = false;
                item.el.removeAttribute("open");
            }
        });
        detailsSaved = [];
    }

    function doPrint() {
        const hlState = document.body.classList.contains("hl");
        document.body.classList.remove("hl");
        openAllDetails();
        requestAnimationFrame(function () {
            setTimeout(function () {
                window.print();
                if (hlState) document.body.classList.add("hl");
                restoreDetails();
            }, 50);
        });
    }

    const printBtn = document.getElementById("pOne");
    if (printBtn) {
        printBtn.addEventListener("click", doPrint);
    }

    window.addEventListener("beforeprint", function () {
        document.body.classList.remove("hl");
        openAllDetails();
    });

    window.addEventListener("afterprint", function () {
        if (hlCheckbox && hlCheckbox.checked) {
            document.body.classList.add("hl");
        }
        restoreDetails();
    });

    const cpBtn = document.getElementById("cp");
    if (cpBtn) {
        cpBtn.addEventListener("click", async function () {
            const nameEl = document.querySelector('[data-bind="company.name"]');
            const phoneEl = document.querySelector('[data-bind="company.phone"]');
            const emailEl = document.querySelector('[data-bind="company.email"]');
            const totalEl = document.querySelector('[data-bind="totals.total"]');

            const sampleJson = {
                company: {
                    name: nameEl ? nameEl.textContent.trim() : "",
                    phone: phoneEl ? phoneEl.textContent.trim() : "",
                    email: emailEl ? emailEl.textContent.trim() : ""
                },
                totals: {
                    total: totalEl ? totalEl.textContent.trim() : ""
                }
            };

            const jsonStr = JSON.stringify(sampleJson, null, 2);
            try {
                await navigator.clipboard.writeText(jsonStr);
                cpBtn.textContent = "Copied";
            } catch (err) {
                prompt("Copy sample JSON:", jsonStr);
            }
            setTimeout(function () {
                cpBtn.textContent = "Copy sample JSON";
            }, 1500);
        });
    }

    initEmailCopyFeature();
});

function initEmailCopyFeature() {
    const toolbarRight = document.querySelector(".toolbar-right");
    let emailBtn = document.getElementById("btnEmailPreview");
    if (!emailBtn && toolbarRight) {
        emailBtn = document.createElement("button");
        emailBtn.type = "button";
        emailBtn.id = "btnEmailPreview";
        emailBtn.className = "btn btn-outline btn-sm";
        emailBtn.style.marginRight = "6px";
        emailBtn.title = "Preview & Copy formatted email for Gmail (1:1 Exact Match)";
        emailBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:5px"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>Copy for Gmail`;
        const cpBtn = document.getElementById("cp");
        if (cpBtn) {
            toolbarRight.insertBefore(emailBtn, cpBtn);
        } else {
            toolbarRight.insertBefore(emailBtn, toolbarRight.firstChild);
        }
    }

    if (emailBtn) {
        emailBtn.addEventListener("click", openEmailPreviewModal);
    }
}

function buildConciseEmailHtml(sheetEl) {
    if (!sheetEl) return "";

    const computedSheet = window.getComputedStyle(sheetEl);
    const brandColor = computedSheet.getPropertyValue("--brand").trim() || "#0f2d4a";
    const accentColor = computedSheet.getPropertyValue("--accent").trim() || "#c8102e";
    const bodyColor = "#1e293b";
    const mutedColor = "#64748b";
    const borderColor = "#e2e8f0";
    const lightBg = "#f8fafc";

    const companyName = sheetEl.querySelector('[data-bind="company.name"]')?.textContent.trim() || "HVAC Heating & Cooling Services";
    const companyTagline = sheetEl.querySelector('[data-bind="company.tagline"]')?.textContent.trim() || "Premium Indoor Comfort & Water Heating Solutions";
    const companyPhone = sheetEl.querySelector('[data-bind="company.phone"]')?.textContent.trim() || "";
    const companyEmail = sheetEl.querySelector('[data-bind="company.email"]')?.textContent.trim() || "";
    const companyWeb = sheetEl.querySelector('[data-bind="company.web"]')?.textContent.trim() || "";
    const companyLicense = sheetEl.querySelector('[data-bind="company.license"]')?.textContent.trim() || "";

    const docTitle = sheetEl.querySelector('.doc-title')?.textContent.trim() || sheetEl.querySelector('.badge')?.textContent.trim() || "HVAC Proposal & Estimate";
    const docNumber = sheetEl.querySelector('[data-bind="doc.number"]')?.textContent.trim() || "REF-2026";
    const docDate = sheetEl.querySelector('[data-bind="doc.date"]')?.textContent.trim() || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const custName = sheetEl.querySelector('[data-bind="customer.name"]')?.textContent.trim() || "Valued Customer";
    const custPhone = sheetEl.querySelector('[data-bind="customer.phone"]')?.textContent.trim() || "";
    const custEmail = sheetEl.querySelector('[data-bind="customer.email"]')?.textContent.trim() || "";
    const custStreet = sheetEl.querySelector('[data-bind="customer.street"]')?.textContent.trim() || sheetEl.querySelector('[data-bind="customer.address"]')?.textContent.trim() || "";
    const custCityState = sheetEl.querySelector('[data-bind="customer.city_state_zip"]')?.textContent.trim() || "";
    const custAddress = [custStreet, custCityState].filter(Boolean).join(", ");

    const techName = sheetEl.querySelector('[data-bind="tech.name"]')?.textContent.trim() || sheetEl.querySelector('[data-bind="lead_tech"]')?.textContent.trim() || sheetEl.querySelector('[data-bind="tech"]')?.textContent.trim() || "";
    const techPhone = sheetEl.querySelector('[data-bind="tech.phone"]')?.textContent.trim() || companyPhone;

    const items = [];
    const seenItems = new Set();
    

    const tableRows = sheetEl.querySelectorAll("table.table tbody tr");
    if (tableRows.length > 0) {
        tableRows.forEach(row => {
            const name = row.querySelector('[data-bind="name"]')?.textContent.trim() || row.querySelector('[data-bind="equipment"]')?.textContent.trim() || row.children[1]?.textContent.trim();
            const sku = row.querySelector('[data-bind="sku"]')?.textContent.trim() || row.querySelector('[data-bind="model"]')?.textContent.trim() || "";
            const qty = row.querySelector('[data-bind="qty"]')?.textContent.trim() || "1";
            const price = row.querySelector('[data-bind="line_total"]')?.textContent.trim() || row.querySelector('[data-bind="unit_price"]')?.textContent.trim() || "";
            const key = (name + '|' + sku).toLowerCase();
            if (name && !seenItems.has(key)) {
                seenItems.add(key);
                items.push({ name, sku, qty, price });
            }
        });
    }

    if (items.length === 0) {
        const eqCards = sheetEl.querySelectorAll(".eqlist > .card, .eqlist > .eq, .eqlist > .aqua-eq-card, .aqua-eq-card, .luxury-eq-card, .value-eq-card, .eco-eq-card, .urban-eq-card, .industrial-eq-card");
        const cardsToProcess = eqCards.length > 0 ? eqCards : sheetEl.querySelectorAll(".eqlist .card, .eqrow");
        cardsToProcess.forEach(c => {
            const name = c.querySelector("h3, h4, h5, [data-bind='name']")?.textContent.trim();
            const part = c.querySelector('[data-bind="part"]')?.textContent.trim() || c.querySelector('[data-bind="model"]')?.textContent.trim() || c.querySelector(".aqua-part-no")?.textContent.trim().replace(/^Factory SKU:\s*/i, "") || "";
            const warranty = c.querySelector('[data-bind="warranty"]')?.textContent.trim() || "";
            const key = (name + '|' + part).toLowerCase();
            if (name && !seenItems.has(key)) {
                seenItems.add(key);
                items.push({ name, sku: part, qty: "1", price: warranty ? "Warranty Covered" : "" });
            }
        });
    }

    const grandTotal = sheetEl.querySelector('[data-bind="totals.total"]')?.textContent.trim() 
        || sheetEl.querySelector('[data-bind="totals.grand"]')?.textContent.trim()
        || sheetEl.querySelector('.total-card .amount')?.textContent.trim()
        || sheetEl.querySelector('.totals .grand span:last-child')?.textContent.trim()
        || "";

    const deposit = sheetEl.querySelector('[data-bind="totals.deposit"]')?.textContent.trim()
        || sheetEl.querySelector('[data-bind="totals.paid"]')?.textContent.trim()
        || "";

    const balance = sheetEl.querySelector('[data-bind="totals.balance"]')?.textContent.trim() || "";

    const monthlyFinance = sheetEl.querySelector('[data-bind="financing[].monthly"]')?.textContent.trim() || "";
    const financePlan = sheetEl.querySelector('[data-bind="financing[].plan"]')?.textContent.trim() || "";
    const financeTerm = sheetEl.querySelector('[data-bind="financing[].term"]')?.textContent.trim() || "";

    let itemsTableHtml = "";
    if (items.length > 0) {
        let rowsHtml = "";
        items.forEach((it, idx) => {
            rowsHtml += `
            <tr style="border-bottom:1px solid #f1f5f9; background-color:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding:9px 12px; font-size:13px; color:#0f172a; font-weight:600; line-height:1.35;">
                    ${it.name}
                    ${it.sku ? `<div style="font-size:11.5px; color:#64748b; font-weight:normal; margin-top:2px;">Model: <b>${it.sku}</b> ${it.qty && it.qty !== '1' ? `&bull; Qty: <b>${it.qty}</b>` : ''}</div>` : ''}
                </td>
                <td align="right" style="padding:9px 12px; font-size:12.5px; color:#0f172a; font-weight:600; text-align:right; white-space:nowrap; vertical-align:top;">
                    ${it.price || (it.warranty ? 'Warranty Covered' : '')}
                </td>
            </tr>`;
        });

        itemsTableHtml = `
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse; margin:10px 0 14px 0; border:1px solid ${borderColor}; border-radius:6px; overflow:hidden;">
            <thead>
                <tr style="background-color:${lightBg}; border-bottom:1.5px solid ${borderColor};">
                    <th align="left" style="padding:8px 12px; font-size:11px; font-weight:bold; color:${brandColor}; text-transform:uppercase; letter-spacing:0.5px;">Proposed System &amp; Equipment</th>
                    <th align="right" style="padding:8px 12px; font-size:11px; font-weight:bold; color:${brandColor}; text-transform:uppercase; text-align:right; white-space:nowrap;">Coverage / Total</th>
                </tr>
            </thead>
            <tbody>
                ${rowsHtml}
            </tbody>
        </table>`;
    }

    let totalBlockHtml = "";
    if (grandTotal) {
        totalBlockHtml = `
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff; border:2px solid ${brandColor}; border-radius:8px; margin:14px 0; border-collapse:collapse;">
            <tr>
                <td style="padding:12px 16px; vertical-align:middle;">
                    <div style="font-size:11px; font-weight:bold; color:${mutedColor}; text-transform:uppercase; letter-spacing:0.5px;">Total Proposal Investment</div>
                    <div style="font-size:24px; font-weight:bold; color:${brandColor}; line-height:1.2; margin-top:2px;">${grandTotal}</div>
                    ${deposit ? `<div style="font-size:12px; color:#475569; margin-top:3px;">Deposit to Schedule: <b style="color:#0f172a;">${deposit}</b> ${balance ? `&bull; Balance: <b style="color:#0f172a;">${balance}</b>` : ''}</div>` : ''}
                </td>
                ${monthlyFinance ? `
                <td align="right" style="padding:12px 16px; vertical-align:middle; text-align:right; border-left:1px dashed ${borderColor}; background-color:${lightBg};">
                    <div style="font-size:11px; font-weight:bold; color:${accentColor}; text-transform:uppercase;">Financing</div>
                    <div style="font-size:18px; font-weight:bold; color:${accentColor}; margin-top:2px;">${monthlyFinance} <span style="font-size:11px; font-weight:normal; color:#64748b;">/ mo</span></div>
                    <div style="font-size:11px; color:#64748b; margin-top:2px;">${financePlan ? financePlan + ' &bull; ' : ''}${financeTerm || ''}</div>
                </td>` : ''}
            </tr>
        </table>`;
    }

    return `
<!-- Outer Email Wrapper (600px Responsive Container) -->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f1f5f9; margin:0; padding:16px 8px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:${bodyColor}; line-height:1.5;">
    <tr>
        <td align="center" valign="top">
            <!-- Main Content Card (Max 600px - Standard Email Fidelity) -->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background-color:#ffffff; border:1px solid #cbd5e1; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.06); border-collapse:collapse;">
                
                <!-- 1. Header Banner (Single-column stacked, full-width) -->
                <tr>
                    <td align="center" style="background-color:${brandColor}; padding:20px 22px; color:#ffffff; text-align:center;">
                        <div style="font-size:20px; font-weight:bold; color:#ffffff; line-height:1.25; letter-spacing:0.3px;">${companyName}</div>
                        ${companyTagline ? `<div style="font-size:12px; color:#cbd5e1; margin-top:4px; line-height:1.35;">${companyTagline}</div>` : ''}
                        <div style="margin-top:10px;">
                            <span style="display:inline-block; background-color:rgba(255,255,255,0.18); padding:3px 10px; border-radius:4px; font-size:11px; font-weight:bold; color:#ffffff; letter-spacing:0.5px; white-space:nowrap;">
                                REF: ${docNumber}
                            </span>
                            <span style="display:inline-block; font-size:11.5px; color:#cbd5e1; margin-left:8px; white-space:nowrap; vertical-align:middle;">
                                ${docDate}
                            </span>
                        </div>
                    </td>
                </tr>

                <!-- 2. Greeting & Concise Intro Note -->
                <tr>
                    <td style="padding:18px 22px 8px 22px;">
                        <div style="font-size:15px; font-weight:bold; color:#0f172a; margin-bottom:5px;">
                            Dear ${custName},
                        </div>
                        <div style="font-size:13px; color:#334155; line-height:1.5;">
                            Thank you for choosing <b>${companyName}</b>. Below is your proposal summary. Complete technical specifications, warranty terms, and agreement are in the attached PDF document.
                        </div>
                    </td>
                </tr>

                <!-- 3. Key Parties & Location Ribbon (Full-Width, Unbroken Phone/Address) -->
                <tr>
                    <td style="padding:6px 22px 10px 22px;">
                        <div style="background-color:${lightBg}; border:1px solid ${borderColor}; border-radius:8px; overflow:hidden;">
                            <div style="padding:8px 12px; border-bottom:1px solid ${borderColor}; font-size:12.5px; color:#0f172a; line-height:1.45;">
                                <span style="font-size:11px; font-weight:bold; color:${mutedColor}; text-transform:uppercase; margin-right:6px;">Customer:</span>
                                <b>${custName}</b>
                                ${custPhone ? `<span style="color:#475569; margin-left:6px; white-space:nowrap;">&bull; ${custPhone}</span>` : ''}
                            </div>
                            ${custAddress ? `
                            <div style="padding:8px 12px; border-bottom:1px solid ${borderColor}; font-size:12.5px; color:#334155; line-height:1.45;">
                                <span style="font-size:11px; font-weight:bold; color:${mutedColor}; text-transform:uppercase; margin-right:6px;">Address:</span>
                                ${custAddress}
                            </div>` : ''}
                            <div style="padding:8px 12px; font-size:12.5px; color:#334155; line-height:1.45;">
                                <span style="font-size:11px; font-weight:bold; color:${mutedColor}; text-transform:uppercase; margin-right:6px;">Specialist:</span>
                                <b style="color:#0f172a;">${techName || companyName}</b>
                                ${techPhone ? `<span style="color:#475569; margin-left:6px; white-space:nowrap;">&bull; ${techPhone}</span>` : ''}
                                <span style="color:${brandColor}; font-weight:600; margin-left:6px; white-space:nowrap;">&bull; ${docTitle}</span>
                            </div>
                        </div>
                    </td>
                </tr>

                <!-- 4. System & Equipment Table (Short & Clean) -->
                ${itemsTableHtml ? `
                <tr>
                    <td style="padding:0 22px;">
                        ${itemsTableHtml}
                    </td>
                </tr>` : ''}

                <!-- 5. Total Investment Highlight Card -->
                ${totalBlockHtml ? `
                <tr>
                    <td style="padding:0 22px;">
                        ${totalBlockHtml}
                    </td>
                </tr>` : ''}

                <!-- 6. Support & Next Steps -->
                <tr>
                    <td style="padding:6px 22px 18px 22px; font-size:12.5px; color:#475569; line-height:1.5;">
                        Questions or ready to schedule? Call us directly at <b>${companyPhone || techPhone || 'our service line'}</b> or reply directly to this email.
                        <div style="margin-top:10px; font-size:13px; font-weight:bold; color:${brandColor};">
                            ${companyName} Team
                        </div>
                    </td>
                </tr>

                <!-- 7. Footer Contacts & License -->
                <tr>
                    <td style="background-color:${lightBg}; border-top:1px solid ${borderColor}; padding:12px 22px; font-size:11px; color:${mutedColor}; text-align:center; line-height:1.5;">
                        <div>
                            ${companyPhone ? `<span>Hotline: <b>${companyPhone}</b></span>` : ''}
                            ${companyEmail ? `<span style="margin:0 6px;">&bull;</span><span>${companyEmail}</span>` : ''}
                            ${companyWeb ? `<span style="margin:0 6px;">&bull;</span><span>${companyWeb}</span>` : ''}
                        </div>
                        ${companyLicense ? `<div style="margin-top:2px;">${companyLicense}</div>` : ''}
                        <div style="margin-top:4px; font-size:10px; color:#94a3b8;">
                            &copy; ${new Date().getFullYear()} ${companyName}. Official estimate notification.
                        </div>
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>`.trim();
}

function buildEmailSafeTableHtml(sheetEl) {
    return buildConciseEmailHtml(sheetEl);
}

function buildEmailSafeTableHtml(sheetEl) {
    return buildConciseEmailHtml(sheetEl);
}

function openEmailPreviewModal() {
    let modalOverlay = document.getElementById("emailPreviewModalOverlay");
    if (!modalOverlay) {
        modalOverlay = document.createElement("div");
        modalOverlay.id = "emailPreviewModalOverlay";
        modalOverlay.innerHTML = `
            <style>
                #emailPreviewModalOverlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(15, 23, 42, 0.75);
                    backdrop-filter: blur(4px);
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.2s ease, visibility 0.2s ease;
                    box-sizing: border-box;
                }
                #emailPreviewModalOverlay.show {
                    opacity: 1;
                    visibility: visible;
                }
                .email-modal-dialog {
                    background: #ffffff;
                    width: 100%;
                    max-width: 860px;
                    max-height: 94vh;
                    border-radius: 12px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    transform: translateY(20px);
                    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                }
                #emailPreviewModalOverlay.show .email-modal-dialog {
                    transform: translateY(0);
                }
                .email-modal-head {
                    padding: 14px 20px;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #f8fafc;
                }
                .email-modal-head h3 {
                    margin: 0;
                    font-size: 1.15rem;
                    color: #0f172a;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .email-modal-head .sub {
                    font-size: 0.8rem;
                    color: #64748b;
                    margin-top: 2px;
                }
                .email-modal-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    line-height: 1;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 6px;
                }
                .email-modal-close:hover {
                    color: #0f172a;
                    background: #e2e8f0;
                }
                .email-modal-body {
                    padding: 16px;
                    overflow-y: auto;
                    background: #f1f5f9;
                    flex: 1;
                }
                .email-gmail-frame {
                    background: #ffffff;
                    border-radius: 8px;
                    border: 1px solid #cbd5e1;
                    padding: 12px 16px;
                    margin-bottom: 14px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                .gmail-field {
                    display: flex;
                    align-items: center;
                    font-size: 0.85rem;
                    padding: 5px 0;
                }
                .gmail-field .lbl {
                    width: 95px;
                    color: #64748b;
                    font-weight: 600;
                    flex-shrink: 0;
                }
                .gmail-input {
                    flex: 1;
                    padding: 6px 10px;
                    font-size: 0.85rem;
                    border: 1px solid #cbd5e1;
                    border-radius: 6px;
                    background: #f8fafc;
                    color: #0f172a;
                    font-family: inherit;
                }
                .gmail-input:focus {
                    outline: none;
                    border-color: #2563eb;
                    background: #ffffff;
                }
                .email-preview-scroll {
                    background: #334155;
                    padding: 16px;
                    border-radius: 8px;
                    overflow-x: auto;
                    display: flex;
                    justify-content: center;
                }
                .email-modal-foot {
                    padding: 12px 20px;
                    border-top: 1px solid #e2e8f0;
                    background: #ffffff;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                .email-toast {
                    font-size: 0.85rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    max-width: 50%;
                }
                .btn-gmail-primary {
                    background: #2563eb;
                    color: #ffffff;
                    border: none;
                    padding: 8px 16px;
                    font-size: 0.86rem;
                    font-weight: 600;
                    border-radius: 6px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    transition: background 0.15s ease;
                }
                .btn-gmail-primary:hover {
                    background: #1d4ed8;
                }
                .btn-gmail-success {
                    background: #16a34a;
                    color: #ffffff;
                    border: none;
                    padding: 8px 16px;
                    font-size: 0.86rem;
                    font-weight: 600;
                    border-radius: 6px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    transition: background 0.15s ease;
                }
                .btn-gmail-success:hover {
                    background: #15803d;
                }
                .btn-gmail-secondary {
                    background: #ffffff;
                    color: #475569;
                    border: 1px solid #cbd5e1;
                    padding: 7px 12px;
                    font-size: 0.83rem;
                    font-weight: 500;
                    border-radius: 6px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    transition: all 0.15s ease;
                }
                .btn-gmail-secondary:hover {
                    background: #f8fafc;
                    color: #0f172a;
                    border-color: #94a3b8;
                }
                @media (max-width: 640px) {
                    #emailPreviewModalOverlay {
                        padding: 8px !important;
                    }
                    .email-modal-dialog {
                        max-height: 98vh !important;
                        border-radius: 8px !important;
                    }
                    .email-modal-head {
                        padding: 10px 14px !important;
                    }
                    .email-modal-head h3 {
                        font-size: 1rem !important;
                    }
                    .email-modal-body {
                        padding: 10px 8px !important;
                    }
                    .gmail-field {
                        flex-direction: column !important;
                        align-items: stretch !important;
                        gap: 4px !important;
                    }
                    .gmail-field .lbl {
                        width: 100% !important;
                    }
                    #pdfAttachInfo {
                        padding-left: 0 !important;
                    }
                    .email-preview-scroll {
                        padding: 8px 4px !important;
                    }
                    .email-modal-foot {
                        padding: 10px 14px !important;
                        flex-direction: column !important;
                        align-items: stretch !important;
                    }
                    .email-modal-foot > div {
                        width: 100% !important;
                    }
                    .email-modal-foot button {
                        flex: 1 1 100% !important;
                        justify-content: center !important;
                    }
                }
            </style>
            <div class="email-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="emailModalTitle">
                <div class="email-modal-head">
                    <div>
                        <h3 id="emailModalTitle">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            Email Delivery &amp; Attached PDF
                        </h3>
                        <div class="sub">Executive summary email (100% English) with official PDF proposal attached</div>
                    </div>
                    <button type="button" class="email-modal-close" id="btnCloseEmailModal" aria-label="Close">&times;</button>
                </div>
                <div class="email-modal-body">
                    <div class="email-gmail-frame">
                        <div class="gmail-field">
                            <span class="lbl">To (Email):</span>
                            <input type="email" id="gmailToInput" class="gmail-input" placeholder="customer@example.com">
                        </div>
                        <div class="gmail-field">
                            <span class="lbl">Subject:</span>
                            <input type="text" id="gmailSubjectInput" class="gmail-input" placeholder="Subject...">
                        </div>
                        <div class="gmail-field" style="align-items:center; background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; padding:10px 12px; margin-top:8px;">
                            <span class="lbl" style="width:130px; color:#1e293b; display:flex; align-items:center; gap:6px; font-weight:600;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.49-8.49a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                Attach PDF:
                            </span>
                            <div style="flex:1; display:flex; align-items:center; gap:10px;">
                                <input type="file" id="gmailPdfInput" accept=".pdf" style="font-size:0.88rem; color:#334155; cursor:pointer; flex:1;">
                            </div>
                        </div>
                        <div id="pdfAttachInfo" style="font-size:0.82rem; color:#059669; font-weight:600; margin-top:5px; padding-left:135px; display:none;"></div>
                    </div>
                    <div class="email-preview-scroll" id="emailPreviewContent">
                        <!-- Concise Email Preview will be rendered here -->
                    </div>
                </div>
                <div class="email-modal-foot">
                    <div class="email-toast" id="emailSendStatus"></div>
                    <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                        <button type="button" class="btn-gmail-secondary" id="btnCopyRawHtml">Copy Raw HTML</button>
                        <button type="button" class="btn-gmail-primary" id="btnDoCopyGmail">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                            Copy for Gmail (Ctrl+V)
                        </button>
                        <button type="button" class="btn-gmail-success" id="btnSendEmailBE">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                            Send Email Automatically (BE)
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        document.getElementById("btnCloseEmailModal").addEventListener("click", closeEmailModal);
        modalOverlay.addEventListener("click", function (e) {
            if (e.target === modalOverlay) closeEmailModal();
        });
        window.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && modalOverlay.classList.contains("show")) {
                closeEmailModal();
            }
        });

        document.getElementById("gmailPdfInput").addEventListener("change", function (e) {
            const file = e.target.files && e.target.files[0];
            const infoDiv = document.getElementById("pdfAttachInfo");

            if (file) {
                const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
                infoDiv.style.display = "block";
                infoDiv.innerHTML = `✓ Selected PDF: <b>${file.name}</b> (${sizeMb} MB) &bull; Ready to deliver!`;
            } else {
                infoDiv.style.display = "none";
                infoDiv.innerHTML = "";
            }
        });

        document.getElementById("btnSendEmailBE").addEventListener("click", async function () {
            const sheet = document.querySelector(".sheet") || document.querySelector("main");
            if (!sheet) return;

            const toEmail = document.getElementById("gmailToInput").value.trim();
            const subject = document.getElementById("gmailSubjectInput").value.trim();
            const statusDiv = document.getElementById("emailSendStatus");
            const btn = document.getElementById("btnSendEmailBE");
            const pdfInput = document.getElementById("gmailPdfInput");

            if (!toEmail) {
                alert("Please enter the recipient email address (To)!");
                return;
            }

            if (!pdfInput || !pdfInput.files || !pdfInput.files[0]) {
                statusDiv.innerHTML = `<span style="color:#dc2626; font-weight:bold;">⚠️ Vui lòng chọn tệp PDF cần đính kèm trước khi gửi!</span>`;
                alert("Vui lòng chọn tệp PDF cần đính kèm trước khi gửi!");
                if (pdfInput) pdfInput.focus();
                return;
            }

            const file = pdfInput.files[0];
            const pdfName = file.name;

            btn.disabled = true;
            btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg> Reading PDF &amp; sending...`;
            statusDiv.innerHTML = `<span style="color:#0284c7;">Reading attached PDF (${(file.size / 1024).toFixed(0)} KB)...</span>`;

            const coName = sheet.querySelector('[data-bind="company.name"]')?.textContent.trim() || "HVAC";
            const docNum = sheet.querySelector('[data-bind="doc.number"]')?.textContent.trim() || "";

            let pdfBase64 = "";
            try {
                pdfBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            } catch (readErr) {
                alert("Could not read selected PDF: " + readErr.message);
                btn.disabled = false;
                btn.innerHTML = `Retry`;
                return;
            }

            const emailHtml = buildConciseEmailHtml(sheet);

            let apiUrl;
            if (window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
                apiUrl = "http://127.0.0.1:8088/api/send-mail.php";
            } else {
                const isBranch = window.location.pathname.includes("/branches/");
                apiUrl = isBranch ? "../../api/send-mail.php" : "api/send-mail.php";
            }

            try {
                statusDiv.innerHTML = `<span style="color:#0284c7;">Delivering via SMTP socket...</span>`;
                const res = await fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        to: toEmail,
                        subject: subject,
                        html_content: emailHtml,
                        company_name: coName,
                        doc_number: docNum,
                        pdf_base64: pdfBase64,
                        pdf_name: pdfName
                    })
                });

                const rawText = await res.text();
                let data;
                try {
                    data = JSON.parse(rawText);
                } catch (jsonErr) {
                    if (rawText.includes("<!DOCTYPE") || rawText.includes("<html") || rawText.includes("<!--")) {
                        throw new Error(`Server returned HTML error (HTTP ${res.status}). Ensure PHP server on port 8088 is active.`);
                    } else {
                        throw new Error(`Malformed JSON response: ${rawText.slice(0, 150)}...`);
                    }
                }

                if (data.success) {
                    const previewLink = (data.preview_url.startsWith("http") || window.location.protocol === "file:" || window.location.hostname === "localhost")
                        ? (data.preview_url.startsWith("http") ? data.preview_url : `http://127.0.0.1:8088/${data.preview_url}`)
                        : (window.location.pathname.includes("/branches/") ? `../../${data.preview_url}` : data.preview_url);

                    const attachNote = data.has_attachment ? ` (with attached ${pdfName})` : "";
                    statusDiv.innerHTML = `
                        <span style="color:#16a34a; font-weight:bold;">✓ Email delivered successfully${attachNote}!</span>
                        <a href="${previewLink}" target="_blank" style="margin-left:8px; color:#2563eb; text-decoration:underline; font-weight:bold;">[View archived copy]</a>
                    `;
                    btn.innerHTML = `✓ Delivered!`;
                    btn.style.background = "#15803d";
                    setTimeout(() => {
                        btn.disabled = false;
                        btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Send Email Automatically (BE)`;
                        btn.style.background = "#16a34a";
                    }, 4000);
                } else {
                    statusDiv.innerHTML = `<span style="color:#dc2626; font-weight:bold;">✗ Error: ${data.error || "Delivery failed"}</span>`;
                    btn.disabled = false;
                    btn.innerHTML = `Retry`;
                    btn.style.background = "#dc2626";
                }
            } catch (err) {
                statusDiv.innerHTML = `<span style="color:#dc2626; font-weight:bold;">✗ Connection error (${err.message})</span>`;
                btn.disabled = false;
                btn.innerHTML = `Retry`;
                btn.style.background = "#dc2626";
            }
        });

        document.getElementById("btnDoCopyGmail").addEventListener("click", async function () {
            const sheet = document.querySelector(".sheet") || document.querySelector("main");
            if (!sheet) return;

            const emailHtml = buildConciseEmailHtml(sheet);
            const plainText = sheet.innerText;

            const success = await copyRichHtmlToClipboard(emailHtml, plainText);
            const statusDiv = document.getElementById("emailSendStatus");
            const btn = document.getElementById("btnDoCopyGmail");
            if (success) {
                statusDiv.innerHTML = `<span style="color:#16a34a;font-weight:bold;">✓ Executive email copied! Paste directly into Gmail with Ctrl+V.</span>`;
                btn.innerHTML = `✓ Copied! Paste into Gmail (Ctrl+V)`;
                btn.style.background = "#16a34a";
                setTimeout(function () {
                    btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>Copy for Gmail (Ctrl+V)`;
                    btn.style.background = "#2563eb";
                }, 3000);
            }
        });

        document.getElementById("btnCopyRawHtml").addEventListener("click", async function () {
            const sheet = document.querySelector(".sheet") || document.querySelector("main");
            if (!sheet) return;
            const emailHtml = buildConciseEmailHtml(sheet);
            await navigator.clipboard.writeText(emailHtml);
            const btn = document.getElementById("btnCopyRawHtml");
            btn.textContent = "✓ Copied HTML";
            setTimeout(() => { btn.textContent = "Copy Raw HTML"; }, 2000);
        });
    }

    const sheet = document.querySelector(".sheet") || document.querySelector("main");
    if (!sheet) return;

    const custEmail = sheet.querySelector('[data-bind="customer.email"]')?.textContent.trim() || "";
    const custName = sheet.querySelector('[data-bind="customer.name"]')?.textContent.trim() || "Customer";
    const coName = sheet.querySelector('[data-bind="company.name"]')?.textContent.trim() || "HVAC";
    const docTitle = sheet.querySelector('.doc-title')?.textContent.trim() || sheet.querySelector('.badge')?.textContent.trim() || "Estimate";
    const docNum = sheet.querySelector('[data-bind="doc.number"]')?.textContent.trim() || "";

    document.getElementById("gmailToInput").value = "treydurden@gmail.com";
    document.getElementById("gmailSubjectInput").value = `${coName} - ${docTitle}${docNum ? ` #${docNum}` : ""}`;

    const previewContainer = document.getElementById("emailPreviewContent");
    const emailHtml = buildConciseEmailHtml(sheet);
    previewContainer.innerHTML = `
        <div style="width:100%; max-width:620px; margin:0 auto; box-shadow:0 10px 30px rgba(0,0,0,0.3); border-radius:10px; overflow:hidden;">
            ${emailHtml}
        </div>
    `;

    document.getElementById("emailSendStatus").innerHTML = "";
    const pdfInput = document.getElementById("gmailPdfInput");
    const infoDiv = document.getElementById("pdfAttachInfo");
    if (pdfInput && (!pdfInput.files || !pdfInput.files[0])) {
        if (infoDiv) {
            infoDiv.style.display = "none";
            infoDiv.innerHTML = "";
        }
    }

    modalOverlay.classList.add("show");
}

function closeEmailModal() {
    const modal = document.getElementById("emailPreviewModalOverlay");
    if (modal) modal.classList.remove("show");
}

async function copyRichHtmlToClipboard(htmlContent, plainText) {
    if (navigator.clipboard && window.ClipboardItem) {
        try {
            const htmlBlob = new Blob([htmlContent], { type: "text/html" });
            const textBlob = new Blob([plainText], { type: "text/plain" });
            await navigator.clipboard.write([
                new ClipboardItem({
                    "text/html": htmlBlob,
                    "text/plain": textBlob
                })
            ]);
            return true;
        } catch (e) {
            console.warn("ClipboardItem write failed, fallback to execCommand", e);
        }
    }

    try {
        const div = document.createElement("div");
        div.contentEditable = "true";
        div.style.position = "fixed";
        div.style.left = "-9999px";
        div.style.top = "0";
        div.innerHTML = htmlContent;
        document.body.appendChild(div);
        div.focus();
        const sel = window.getSelection();
        sel.removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(div);
        sel.addRange(range);
        const res = document.execCommand("copy");
        sel.removeAllRanges();
        document.body.removeChild(div);
        return res;
    } catch (err) {
        prompt("Copy Email HTML:", htmlContent);
        return true;
    }
}
