/**
 * Cấu hình danh sách Chi nhánh (Company Theme)
 * Đặt enabled: false nếu chi nhánh chưa hoàn thiện để ẩn khỏi dropdown ở tất cả các file.
 */
const COMPANIES = [
    { id: "jerrys", name: "Jerrys Heatng and Cooling", enabled: true }, // 1
    { id: "pozitivehvac", name: "Pozitive Heating and Cooling", enabled: true }, // 2
    { id: "bestcomforthvac", name: "Best Comfort HVAC of Joliet", enabled: true }, // 3
    { id: "bestcomforthvacservices", name: "Best Comfort HVAC Chicago", enabled: true }, // 4
    { id: "bestcomforthvacrepair", name: "Best Comfort HVAC New Lenox", enabled: true }, // 5
    { id: "repairsboilers", name: "Repair Boilers & Hvac", enabled: true }, // 6
    { id: "watershotagain", name: "Water Heaters & Boiler Hvac Service", enabled: true }, // 7
    // { id: "dupagehvacservices", name: "Best Comfort HVAC Naperville", enabled: false },
    // { id: "treydurden", name: "Trey Durden Heating and Cooling", enabled: false },
    // { id: "affordablehvacrepairs", name: "Affordable Heating & Cooling of Plainfield", enabled: false },
    // { id: "blueflameheatingcooling", name: "Blue Flame Heating & Cooling of Joliet", enabled: false },
    // { id: "completehvacservice", name: "Complete Heating and Cooing of Bolingbrook", enabled: false }
];

/**
 * Cấu hình danh sách Biểu mẫu (Form Tabs)
 * Đặt enabled: false nếu file biểu mẫu chưa hoàn thiện để ẩn tab khỏi thanh điều hướng ở tất cả các trang.
 */
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

    // Làm sạch options cũ và đổ lại theo cấu hình
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

    // Điều hướng khi chọn chi nhánh khác
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
    // 0. Khởi tạo dropdown chi nhánh và bộ lọc tab từ JS chung
    initCompanyDropdown();
    filterFormTabs();

    // 1. Database field highlight toggle (pure CSS class toggle, no data change)
    const hlCheckbox = document.getElementById("hl");
    if (hlCheckbox) {
        document.body.classList.add("hl");
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("hl") === "0") {
            hlCheckbox.checked = false;
            document.body.classList.remove("hl");
        }
        hlCheckbox.addEventListener("change", function (e) {
            document.body.classList.toggle("hl", e.target.checked);
        });
    }

    // 2. View Mode toggle: Link View (Full Color) vs Print / PDF View (Ink-Saving)
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

    // 3. Print button handler (unrolls all <details> before printing, restores after)
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

    // 5. Copy sample JSON button
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

    // 6. Copy for Gmail with Preview Modal
    initEmailCopyFeature();
});

/**
 * Khởi tạo tính năng "Copy for Gmail" có Preview (Bản sao 1:1 y hệt bản web)
 */
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

/**
 * Chuyển đổi DOM của một .sheet thành Email-Safe Table HTML chuẩn 100% không bao giờ vỡ layout trên Gmail / Outlook
 */
function buildEmailSafeTableHtml(sheetEl) {
    if (!sheetEl) return "";

    // 1. Đọc màu sắc thương hiệu thực tế từ CSS Variables
    const computedSheet = window.getComputedStyle(sheetEl);
    const brandColor = computedSheet.getPropertyValue("--brand").trim() || "#0b2545";
    const accentColor = computedSheet.getPropertyValue("--accent").trim() || "#c8102e";
    const bodyColor = "#1e293b";
    const mutedColor = "#64748b";
    const borderColor = "#e2e8f0";
    const lightBg = "#f8fafc";

    // 2. Tạm thời mở toàn bộ details trên sheet gốc để đọc đầy đủ nội dung
    const originalDetails = sheetEl.querySelectorAll("details");
    const originalDetailsStates = [];
    originalDetails.forEach(d => {
        originalDetailsStates.push(d.open);
        d.open = true;
    });

    // 3. Clone toàn bộ .sheet
    const clone = sheetEl.cloneNode(true);

    // Phục hồi lại trạng thái ban đầu cho giao diện chính
    originalDetails.forEach((d, i) => {
        d.open = originalDetailsStates[i];
    });

    // Loại bỏ các nút in hoặc phần tử UI chrome
    clone.querySelectorAll(".noprint, #btnEmailPreview, .nav-tabs, script, style, select, button").forEach(el => el.remove());

    // 4. Rasterize hình ảnh sang Base64 PNG để Gmail hiển thị chuẩn xác cả khi gửi từ local
    const origImgs = sheetEl.querySelectorAll("img");
    const cloneImgs = clone.querySelectorAll("img");
    for (let i = 0; i < origImgs.length; i++) {
        const oImg = origImgs[i];
        const cImg = cloneImgs[i];
        if (!oImg || !cImg) continue;
        try {
            const w = oImg.naturalWidth || oImg.offsetWidth || 150;
            const h = oImg.naturalHeight || oImg.offsetHeight || 50;
            if (w > 0 && h > 0) {
                const cv = document.createElement("canvas");
                cv.width = w * 2;
                cv.height = h * 2;
                const ctx = cv.getContext("2d");
                ctx.drawImage(oImg, 0, 0, cv.width, cv.height);
                cImg.src = cv.toDataURL("image/png");
            }
        } catch (e) {
            cImg.src = oImg.src;
        }
    }

    // 5. Chuyển đổi checkbox sang biểu tượng Unicode [✓] / [ ] an toàn tuyệt đối cho mail
    clone.querySelectorAll('input[type="checkbox"]').forEach(chk => {
        const span = document.createElement("span");
        if (chk.checked) {
            span.innerHTML = "&#10003;";
            span.setAttribute("style", `display:inline-block;width:15px;height:15px;line-height:15px;text-align:center;background-color:${brandColor};color:#ffffff;font-size:11px;font-weight:bold;border-radius:3px;margin-right:6px;vertical-align:middle;`);
        } else {
            span.setAttribute("style", `display:inline-block;width:15px;height:15px;border:1px solid #cbd5e1;background-color:#ffffff;border-radius:3px;margin-right:6px;vertical-align:middle;`);
        }
        chk.replaceWith(span);
    });

    // 6. Chuyển đổi toàn bộ <details> thành khối bảng mở sẵn (Gmail chặn tương tác thẻ details)
    clone.querySelectorAll("details").forEach(det => {
        const summary = det.querySelector("summary");
        const title = summary ? summary.textContent.trim() : "Specifications";
        if (summary) summary.remove();

        const box = document.createElement("div");
        box.setAttribute("style", `margin-top:10px;padding:10px 12px;background-color:${lightBg};border:1px solid ${borderColor};border-radius:4px;font-size:12px;`);
        box.innerHTML = `<div style="font-weight:bold;color:${brandColor};margin-bottom:6px;text-transform:uppercase;font-size:11px;letter-spacing:0.3px;">${title}</div>` + det.innerHTML;
        det.replaceWith(box);
    });

    // 7. Xử lý Header (.doc-head) thành Table 2 cột
    const headEl = clone.querySelector(".doc-head");
    let headHtml = "";
    if (headEl) {
        const leftPart = headEl.children[0] ? headEl.children[0].innerHTML : "";
        const rightPart = headEl.children[1] ? headEl.children[1].innerHTML : "";
        headHtml = `
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:${brandColor};color:#ffffff;border-radius:6px 6px 0 0;border-collapse:collapse;">
            <tr>
                <td width="60%" valign="top" style="padding:20px 24px;">
                    ${leftPart}
                </td>
                <td width="40%" valign="top" align="right" style="padding:20px 24px;text-align:right;">
                    ${rightPart}
                </td>
            </tr>
        </table>`;
        headEl.remove();
    }

    // 8. Xử lý Tiêu đề chứng từ (.doc-title)
    const titleEl = clone.querySelector(".doc-title");
    let docTitleHtml = "";
    if (titleEl) {
        docTitleHtml = `
        <div style="padding:16px 24px 8px 24px;">
            <h2 style="margin:0;font-size:20px;font-weight:bold;color:${brandColor};border-bottom:2px solid ${borderColor};padding-bottom:8px;">${titleEl.textContent.trim()}</h2>
        </div>`;
        titleEl.remove();
    }

    // 9. Xử lý Footer (.doc-foot) thành Table Chân trang
    const footEl = clone.querySelector(".doc-foot");
    let footHtml = "";
    if (footEl) {
        footHtml = `
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top:20px;border-top:1px solid ${borderColor};background-color:${lightBg};border-radius:0 0 6px 6px;border-collapse:collapse;">
            <tr>
                <td style="padding:14px 24px;font-size:11.5px;color:${mutedColor};text-align:center;line-height:1.6;">
                    ${footEl.innerHTML}
                </td>
            </tr>
        </table>`;
        footEl.remove();
    }

    // 10. Chuyển đổi mọi .row thành Table tương ứng (chống tụt hàng trên Gmail)
    clone.querySelectorAll(".row").forEach(row => {
        const cols = Array.from(row.children).filter(c => c.nodeType === 1);
        if (cols.length === 0) return;

        const table = document.createElement("table");
        table.setAttribute("role", "presentation");
        table.setAttribute("border", "0");
        table.setAttribute("cellpadding", "0");
        table.setAttribute("cellspacing", "0");
        table.setAttribute("width", "100%");
        table.setAttribute("style", "margin-top:10px;margin-bottom:10px;border-collapse:collapse;width:100%;");

        const tr = document.createElement("tr");

        if (cols.length === 2) {
            // 2 Cột song song: 48% - 4% khoảng cách - 48%
            const td1 = document.createElement("td");
            td1.setAttribute("width", "48%");
            td1.setAttribute("valign", "top");
            td1.setAttribute("style", "width:48%;vertical-align:top;");
            td1.appendChild(cols[0]);

            const tdSpacer = document.createElement("td");
            tdSpacer.setAttribute("width", "4%");
            tdSpacer.innerHTML = "&nbsp;";

            const td2 = document.createElement("td");
            td2.setAttribute("width", "48%");
            td2.setAttribute("valign", "top");
            td2.setAttribute("style", "width:48%;vertical-align:top;");
            td2.appendChild(cols[1]);

            tr.appendChild(td1);
            tr.appendChild(tdSpacer);
            tr.appendChild(td2);
        } else if (cols.length === 3) {
            // 3 Cột song song: 31% - 3.5% - 31% - 3.5% - 31%
            for (let c = 0; c < 3; c++) {
                const td = document.createElement("td");
                td.setAttribute("width", "31%");
                td.setAttribute("valign", "top");
                td.setAttribute("style", "width:31%;vertical-align:top;");
                td.appendChild(cols[c]);
                tr.appendChild(td);

                if (c < 2) {
                    const sp = document.createElement("td");
                    sp.setAttribute("width", "3.5%");
                    sp.innerHTML = "&nbsp;";
                    tr.appendChild(sp);
                }
            }
        } else {
            // 1 cột hoặc nhiều hơn 3 cột
            const colWidth = Math.floor(100 / cols.length) + "%";
            cols.forEach(c => {
                const td = document.createElement("td");
                td.setAttribute("width", colWidth);
                td.setAttribute("valign", "top");
                td.setAttribute("style", `width:${colWidth};vertical-align:top;`);
                td.appendChild(c);
                tr.appendChild(td);
            });
        }

        table.appendChild(tr);
        row.replaceWith(table);
    });

    // 11. Chuyển đổi mọi .card thành Card Table chuẩn Email
    clone.querySelectorAll(".card").forEach(card => {
        card.setAttribute("style", `background-color:#ffffff;border:1px solid ${borderColor};border-radius:6px;overflow:hidden;margin-bottom:12px;font-size:13px;color:${bodyColor};`);

        const header = card.querySelector(".card-header");
        if (header) {
            header.setAttribute("style", `background-color:${lightBg};border-bottom:1px solid ${borderColor};padding:8px 14px;font-weight:bold;font-size:12.5px;color:${brandColor};text-transform:uppercase;letter-spacing:0.3px;`);
        }

        const body = card.querySelector(".card-body");
        if (body) {
            body.setAttribute("style", `padding:12px 14px;line-height:1.5;font-size:13px;`);
        }
    });

    // 12. Chuyển đổi .eqrow (Equipment Row) thành Table 2 cột: Ảnh bên trái, Chi tiết bên phải
    clone.querySelectorAll(".eqrow").forEach(eqrow => {
        const imgDiv = eqrow.querySelector(".img");
        const bodyDiv = eqrow.querySelector(".eqbody");
        if (imgDiv && bodyDiv) {
            const table = document.createElement("table");
            table.setAttribute("role", "presentation");
            table.setAttribute("border", "0");
            table.setAttribute("cellpadding", "0");
            table.setAttribute("cellspacing", "0");
            table.setAttribute("width", "100%");
            table.setAttribute("style", "border-collapse:collapse;width:100%;");

            const tr = document.createElement("tr");

            const tdImg = document.createElement("td");
            tdImg.setAttribute("width", "120");
            tdImg.setAttribute("valign", "top");
            tdImg.setAttribute("align", "center");
            tdImg.setAttribute("style", "width:120px;padding-right:14px;vertical-align:top;text-align:center;");

            const img = imgDiv.querySelector("img");
            if (img) {
                img.setAttribute("style", "display:block;width:110px;max-width:110px;height:auto;border-radius:4px;border:1px solid #e2e8f0;");
                tdImg.appendChild(img);
            }

            const tdBody = document.createElement("td");
            tdBody.setAttribute("valign", "top");
            tdBody.setAttribute("style", "vertical-align:top;font-size:13px;line-height:1.5;");
            tdBody.appendChild(bodyDiv);

            tr.appendChild(tdImg);
            tr.appendChild(tdBody);
            table.appendChild(tr);
            eqrow.replaceWith(table);
        }
    });

    // 13. Chuyển đổi .kspecs thành Table thông số 4 ô cân đối
    clone.querySelectorAll(".kspecs").forEach(kspecs => {
        const items = Array.from(kspecs.children);
        if (items.length > 0) {
            const table = document.createElement("table");
            table.setAttribute("role", "presentation");
            table.setAttribute("border", "0");
            table.setAttribute("cellpadding", "6");
            table.setAttribute("cellspacing", "0");
            table.setAttribute("width", "100%");
            table.setAttribute("style", `background-color:${lightBg};border:1px solid ${borderColor};border-radius:4px;margin:8px 0;font-size:12px;border-collapse:collapse;width:100%;`);

            const tr = document.createElement("tr");
            const w = Math.floor(100 / items.length) + "%";
            items.forEach((it, idx) => {
                const td = document.createElement("td");
                td.setAttribute("width", w);
                td.setAttribute("valign", "top");
                td.setAttribute("style", `vertical-align:top;padding:6px 8px;${idx < items.length - 1 ? 'border-right:1px solid #e2e8f0;' : ''}`);
                td.innerHTML = it.innerHTML;
                tr.appendChild(td);
            });
            table.appendChild(tr);
            kspecs.replaceWith(table);
        }
    });

    // 14. Chuyển đổi .specs (Spec pairs) thành Table thông số kỹ thuật chi tiết
    clone.querySelectorAll(".specs").forEach(specs => {
        const spItems = Array.from(specs.querySelectorAll(".sp"));
        if (spItems.length > 0) {
            const table = document.createElement("table");
            table.setAttribute("role", "presentation");
            table.setAttribute("border", "0");
            table.setAttribute("cellpadding", "4");
            table.setAttribute("cellspacing", "0");
            table.setAttribute("width", "100%");
            table.setAttribute("style", "font-size:12px;margin-top:6px;border-collapse:collapse;width:100%;");

            spItems.forEach(sp => {
                const spans = sp.querySelectorAll("span");
                const tr = document.createElement("tr");
                tr.setAttribute("style", "border-bottom:1px solid #f1f5f9;");

                const td1 = document.createElement("td");
                td1.setAttribute("width", "35%");
                td1.setAttribute("style", `color:${mutedColor};padding:4px 6px;font-weight:600;`);
                td1.innerHTML = spans[0] ? spans[0].innerHTML : "";

                const td2 = document.createElement("td");
                td2.setAttribute("width", "65%");
                td2.setAttribute("style", "color:#0f172a;padding:4px 6px;");
                td2.innerHTML = spans[1] ? spans[1].innerHTML : "";

                tr.appendChild(td1);
                tr.appendChild(td2);
                table.appendChild(tr);
            });
            specs.replaceWith(table);
        }
    });

    // 15. Chuyển đổi .total-card (Khối tổng thanh toán)
    clone.querySelectorAll(".total-card").forEach(tc => {
        const spans = tc.querySelectorAll("span");
        const lbl = spans[0] ? spans[0].textContent.trim() : "Total";
        const val = spans[1] ? spans[1].textContent.trim() : "";

        const table = document.createElement("table");
        table.setAttribute("role", "presentation");
        table.setAttribute("border", "0");
        table.setAttribute("cellpadding", "0");
        table.setAttribute("cellspacing", "0");
        table.setAttribute("width", "100%");
        table.setAttribute("style", `background-color:${lightBg};border:2px solid ${brandColor};border-radius:6px;margin:14px 0;border-collapse:collapse;width:100%;`);
        table.innerHTML = `
        <tr>
            <td style="padding:14px 20px;font-size:15px;font-weight:bold;color:${brandColor};">
                ${lbl}
            </td>
            <td align="right" style="padding:14px 20px;font-size:24px;font-weight:bold;color:${accentColor};text-align:right;">
                ${val}
            </td>
        </tr>`;
        tc.replaceWith(table);
    });

    // 16. Chuyển đổi .sig (Khung chữ ký)
    clone.querySelectorAll(".sig").forEach(sig => {
        sig.setAttribute("style", `border-bottom:2px solid #cbd5e1;padding:8px 0;margin-bottom:4px;min-height:36px;`);
        const img = sig.querySelector("img");
        if (img) {
            img.setAttribute("style", "max-height:48px;width:auto;display:block;");
        }
    });

    // 17. Chuyển đổi Table dữ liệu (table.table)
    clone.querySelectorAll("table.table").forEach(tbl => {
        tbl.setAttribute("width", "100%");
        tbl.setAttribute("cellpadding", "8");
        tbl.setAttribute("cellspacing", "0");
        tbl.setAttribute("border", "0");
        tbl.setAttribute("style", `width:100%;border-collapse:collapse;margin:12px 0;font-size:12.5px;border:1px solid ${borderColor};`);

        tbl.querySelectorAll("th").forEach(th => {
            th.setAttribute("style", `background-color:${brandColor};color:#ffffff;font-weight:bold;text-align:left;padding:8px 10px;font-size:12px;border:1px solid ${brandColor};`);
        });

        tbl.querySelectorAll("td").forEach(td => {
            td.setAttribute("style", `padding:8px 10px;border:1px solid ${borderColor};color:${bodyColor};font-size:12px;`);
        });
    });

    // 18. Áp inline style cho Alert, Badge, Form-label, Headers
    clone.querySelectorAll(".alert").forEach(al => {
        al.setAttribute("style", `background-color:${lightBg};border:1px solid ${borderColor};border-left:4px solid ${brandColor};border-radius:4px;padding:10px 14px;font-size:12px;line-height:1.5;color:${bodyColor};margin:10px 0;`);
    });

    clone.querySelectorAll(".badge").forEach(bg => {
        bg.setAttribute("style", `display:inline-block;background-color:${accentColor};color:#ffffff;font-size:11px;font-weight:bold;padding:3px 8px;border-radius:4px;text-transform:uppercase;`);
    });

    clone.querySelectorAll(".form-label").forEach(fl => {
        fl.setAttribute("style", `font-size:11px;font-weight:bold;color:${mutedColor};text-transform:uppercase;margin-bottom:2px;letter-spacing:0.3px;`);
    });

    clone.querySelectorAll("h1, h2, h3, h4, h5").forEach(h => {
        h.setAttribute("style", `color:${brandColor};font-size:15px;font-weight:bold;margin:14px 0 6px 0;font-family:Arial,Helvetica,sans-serif;`);
    });

    clone.querySelectorAll(".photo.has img").forEach(pImg => {
        pImg.setAttribute("style", "display:block;width:100%;max-width:200px;height:auto;border-radius:4px;border:1px solid #e2e8f0;");
    });

    clone.querySelectorAll(".brand-logo").forEach(bl => {
        bl.setAttribute("style", "display:block;max-width:160px;height:auto;margin-bottom:6px;border:0;");
    });
    clone.querySelectorAll(".brand-name").forEach(bn => {
        bn.setAttribute("style", "font-size:20px;font-weight:bold;color:#ffffff;letter-spacing:0.3px;line-height:1.2;");
    });
    clone.querySelectorAll(".brand-tag").forEach(bt => {
        bt.setAttribute("style", "font-size:12px;color:#cbd5e1;margin-top:4px;");
    });

    const bodyContent = clone.innerHTML;

    // 19. Lắp ráp hoàn chỉnh vào Khung Table Email Chuẩn Quốc Tế (Chống vỡ layout 100%)
    return `
<!-- Email Container (Full width outer, fixed max-width inner table) -->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f1f5f9;margin:0;padding:20px 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${bodyColor};line-height:1.5;">
    <tr>
        <td align="center" valign="top">
            <!-- Center Card Table -->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:720px;background-color:#ffffff;border:1px solid #cbd5e1;border-radius:8px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.08);border-collapse:collapse;">
                <!-- Header -->
                ${headHtml ? `<tr><td>${headHtml}</td></tr>` : ''}
                <!-- Document Title -->
                ${docTitleHtml ? `<tr><td>${docTitleHtml}</td></tr>` : ''}
                <!-- Main Body -->
                <tr>
                    <td style="padding:16px 24px 20px 24px;">
                        ${bodyContent}
                    </td>
                </tr>
                <!-- Footer -->
                ${footHtml ? `<tr><td>${footHtml}</td></tr>` : ''}
            </table>
            <!-- Email signature disclaimer -->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:720px;margin-top:12px;border-collapse:collapse;">
                <tr>
                    <td align="center" style="font-size:11px;color:#94a3b8;padding:8px 0;">
                        This document was generated automatically by HVAC Form Suite. Please do not reply directly to this automated email.
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
`.trim();
}

/**
 * Khởi tạo Modal Xem trước & Gửi mail tự động
 */
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
                    padding: 16px 20px;
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
                    padding: 6px 0;
                }
                .gmail-field .lbl {
                    width: 70px;
                    color: #64748b;
                    font-weight: 600;
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
                    padding: 20px;
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
                    padding: 8px 12px;
                    font-size: 0.84rem;
                    font-weight: 500;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.15s ease;
                }
                .btn-gmail-secondary:hover {
                    background: #f8fafc;
                    color: #0f172a;
                }
            </style>
            <div class="email-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="emailModalTitle">
                <div class="email-modal-head">
                    <div>
                        <h3 id="emailModalTitle">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            Email Delivery &amp; Gmail Table Preview
                        </h3>
                        <div class="sub">Bản sao chuẩn Table Layout (chống vỡ giao diện 100% trên Gmail / Outlook) &amp; Gửi mail tự động qua Backend</div>
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
                    </div>
                    <div class="email-preview-scroll" id="emailPreviewContent">
                        <!-- Email-safe table HTML will be rendered here -->
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
                            Gửi Mail Tự Động (BE)
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        // Close handlers
        document.getElementById("btnCloseEmailModal").addEventListener("click", closeEmailModal);
        modalOverlay.addEventListener("click", function (e) {
            if (e.target === modalOverlay) closeEmailModal();
        });
        window.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && modalOverlay.classList.contains("show")) {
                closeEmailModal();
            }
        });

        // 1. Nút Gửi Mail Tự Động qua Backend API
        document.getElementById("btnSendEmailBE").addEventListener("click", async function () {
            const sheet = document.querySelector(".sheet") || document.querySelector("main");
            if (!sheet) return;

            const toEmail = document.getElementById("gmailToInput").value.trim();
            const subject = document.getElementById("gmailSubjectInput").value.trim();
            const statusDiv = document.getElementById("emailSendStatus");
            const btn = document.getElementById("btnSendEmailBE");

            if (!toEmail) {
                alert("Vui lòng nhập địa chỉ email người nhận (To)!");
                return;
            }

            btn.disabled = true;
            btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg> Đang gửi mail...`;
            statusDiv.innerHTML = `<span style="color:#0284c7;">Đang kết nối BE và xử lý gửi mail...</span>`;

            const emailHtml = buildEmailSafeTableHtml(sheet);
            const coName = document.querySelector('[data-bind="company.name"]')?.textContent.trim() || "";
            const docNum = document.querySelector('[data-bind="doc.number"]')?.textContent.trim() || "";

            const isBranch = window.location.pathname.includes("/branches/");
            const apiUrl = isBranch ? "../../api/send-mail.php" : "api/send-mail.php";

            try {
                const res = await fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        to: toEmail,
                        subject: subject,
                        html_content: emailHtml,
                        company_name: coName,
                        doc_number: docNum
                    })
                });
                const data = await res.json();

                if (data.success) {
                    const previewLink = isBranch ? `../../${data.preview_url}` : data.preview_url;
                    statusDiv.innerHTML = `
                        <span style="color:#16a34a; font-weight:bold;">✓ ${data.message}</span>
                        <a href="${previewLink}" target="_blank" style="margin-left:8px; color:#2563eb; text-decoration:underline; font-weight:bold;">[Mở xem bản lưu email]</a>
                    `;
                    btn.innerHTML = `✓ Đã gửi thành công!`;
                    btn.style.background = "#15803d";
                    setTimeout(() => {
                        btn.disabled = false;
                        btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Gửi Mail Tự Động (BE)`;
                        btn.style.background = "#16a34a";
                    }, 4000);
                } else {
                    statusDiv.innerHTML = `<span style="color:#dc2626; font-weight:bold;">✗ Lỗi: ${data.error || "Gửi thất bại"}</span>`;
                    btn.disabled = false;
                    btn.innerHTML = `Thử lại`;
                    btn.style.background = "#dc2626";
                }
            } catch (err) {
                statusDiv.innerHTML = `<span style="color:#dc2626; font-weight:bold;">✗ Lỗi kết nối BE (${err.message}). Đảm bảo Laragon/PHP đang chạy!</span>`;
                btn.disabled = false;
                btn.innerHTML = `Thử lại`;
                btn.style.background = "#dc2626";
            }
        });

        // 2. Nút Copy for Gmail (Ctrl+V)
        document.getElementById("btnDoCopyGmail").addEventListener("click", async function () {
            const sheet = document.querySelector(".sheet") || document.querySelector("main");
            if (!sheet) return;

            const emailHtml = buildEmailSafeTableHtml(sheet);
            const plainText = sheet.innerText;

            const success = await copyRichHtmlToClipboard(emailHtml, plainText);
            const statusDiv = document.getElementById("emailSendStatus");
            const btn = document.getElementById("btnDoCopyGmail");
            if (success) {
                statusDiv.innerHTML = `<span style="color:#16a34a;font-weight:bold;">✓ Đã copy Email Table chuẩn! Mở Gmail và nhấn Ctrl+V để dán.</span>`;
                btn.innerHTML = `✓ Copied! Paste into Gmail (Ctrl+V)`;
                btn.style.background = "#16a34a";
                setTimeout(function () {
                    btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>Copy for Gmail (Ctrl+V)`;
                    btn.style.background = "#2563eb";
                }, 3000);
            }
        });

        // 3. Nút Copy Raw HTML
        document.getElementById("btnCopyRawHtml").addEventListener("click", async function () {
            const sheet = document.querySelector(".sheet") || document.querySelector("main");
            if (!sheet) return;
            const emailHtml = buildEmailSafeTableHtml(sheet);
            await navigator.clipboard.writeText(emailHtml);
            const btn = document.getElementById("btnCopyRawHtml");
            btn.textContent = "✓ Copied HTML";
            setTimeout(() => { btn.textContent = "Copy Raw HTML"; }, 2000);
        });
    }

    const sheet = document.querySelector(".sheet") || document.querySelector("main");
    if (!sheet) return;

    // Headers & Fields
    const custEmail = document.querySelector('[data-bind="customer.email"]')?.textContent.trim() || "";
    const custName = document.querySelector('[data-bind="customer.name"]')?.textContent.trim() || "Customer";
    const coName = document.querySelector('[data-bind="company.name"]')?.textContent.trim() || "HVAC";
    const docTitle = document.querySelector('.doc-title')?.textContent.trim() || document.querySelector('.badge')?.textContent.trim() || "Document";
    const docNum = document.querySelector('[data-bind="doc.number"]')?.textContent.trim() || "";

    document.getElementById("gmailToInput").value = custEmail && custEmail !== "N/A"
        ? custEmail
        : "";
    document.getElementById("gmailSubjectInput").value = `${coName} - ${docTitle}${docNum ? ` #${docNum}` : ""}`;

    // Live preview: Render email table layout chuẩn vào khung preview
    const previewContainer = document.getElementById("emailPreviewContent");
    const emailHtml = buildEmailSafeTableHtml(sheet);
    previewContainer.innerHTML = `
        <div style="width:100%; max-width:740px; margin:0 auto; box-shadow:0 10px 30px rgba(0,0,0,0.3); border-radius:8px; overflow:hidden;">
            ${emailHtml}
        </div>
    `;

    document.getElementById("emailSendStatus").innerHTML = "";

    // Show modal
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

    // Fallback cho mọi trình duyệt
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
