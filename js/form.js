/**
 * Cấu hình danh sách Chi nhánh (Company Theme)
 * Đặt enabled: false nếu chi nhánh chưa hoàn thiện để ẩn khỏi dropdown ở tất cả các file.
 */
const COMPANIES = [
    { id: "jerrys", name: "Jerrys Heatng and Cooling", enabled: true }, // 1
    { id: "pozitivehvac", name: "Pozitive Heating and Cooling", enabled: true }, // 2
    { id: "bestcomforthvac", name: "Best Comfort HVAC of Joliet", enabled: true }, // 3
    { id: "bestcomforthvacservices", name: "Best Comfort HVAC Chicago", enabled: true }, // 4
    // { id: "bestcomforthvacrepair", name: "Best Comfort HVAC New Lenox", enabled: true }, // 5
    { id: "repairsboilers", name: "Repair Boilers & Hvac", enabled: true }, // 6
    // { id: "watershotagain", name: "Water Heaters & Boiler Hvac Service", enabled: true }, // 7
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
});
