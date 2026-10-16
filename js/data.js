/**
 * @file data.js
 * @description Sample data generator and payload structures (pure data access, no DOM code)
 * @dependencies none
 */

window.App = window.App || {};

/* ---------- sample payloads (stand-in for the backend response) ---------- */
const sampleFor = k => ({
    company: k === "jerrys" ? {
        name: "Jerry's Heating & Cooling",
        tagline: "Residential comfort specialists · Serving Chicagoland",
        phone: "815-791-7447",
        email: "Trey.D@JerrysHeatingCooling.com",
        web: "www.JerrysHeatingCooling.com",
        license: "License # ________",
        warranty_text: "Heating and cooling residential equipment installed by Jerry's is covered by a 10-year parts and labor warranty. Registration with the manufacturer is mandatory within 30 days of installation.",
        financing_note: "Apply for financing at FTLFinance.com, available 24 hours a day. No early repayment penalty."
    } : {
        name: "Sample Company HVAC",
        tagline: "Heating, cooling & boilers",
        phone: "(000) 000-0000",
        email: "office@example.com",
        web: "www.example.com",
        license: "License # ________",
        warranty_text: "Sample warranty wording supplied by the database.",
        financing_note: "Sample financing note supplied by the database."
    },
    doc: {
        number: "EST-0001",
        date: "October 13, 2026"
    },
    customer: {
        name: "Marc Grasley",
        phone: "815-483-1448",
        email: "MarcGrasley@iCloud.com",
        street: "1104 Kingfisher Ct.",
        city_state_zip: "Joliet, IL 60431"
    },
    tech: {
        name: "Trey Durden",
        phone: "630-361-7434",
        email: "Trey.D@JerrysHeatingCooling.com"
    },
    equipment: [
        {
            image: "assets/images/furnace.jpg",
            name: "Rheem 100,000 BTU Single-Stage Furnace",
            part: "R801T1005A21DZSNAS",
            warranty: "10-year parts warranty when registered with manufacturer",
            key_specs: [
                { label: "Brand", value: "Rheem" },
                { label: "Capacity", value: "100,000 BTU" },
                { label: "Width", value: '21"' },
                { label: "Stages", value: "Single stage" }
            ],
            specs: [
                { label: "Efficiency", value: "80% AFUE" },
                { label: "Blower motor", value: "¾ HP, 5-speed constant-torque ECM, up to 1,840 CFM" },
                { label: "Dimensions (L x H x W)", value: '29.6" x 34" x 21"' },
                { label: "Weight", value: "140 lbs" },
                { label: "Fuel", value: "Natural gas" },
                { label: "Voltage", value: "120V" },
                { label: "Ignition", value: "Spark" },
                { label: "Heat exchanger", value: "Aluminized steel (removable), 20-year warranty" },
                { label: "AHRI number", value: "TBD" }
            ]
        },
        {
            image: "assets/images/ac-unit.jpg",
            name: "Rheem 3.5-Ton Single-Stage Air Conditioner",
            part: "RA13NY42AJ1NA",
            warranty: "10-year parts warranty when registered with manufacturer",
            key_specs: [
                { label: "Capacity", value: "3.5 ton (42,000 BTU)" },
                { label: "Voltage", value: "208/230V" },
                { label: "Stages", value: "Single stage" }
            ],
            specs: [
                { label: "Brand", value: "Rheem" },
                { label: "Width", value: '21"' }
            ]
        }
    ],
    totals: {
        total: "$13,800.00",
        deposit: "$6,900.00",
        subtotal: "$13,800.00",
        tax: "$0.00",
        payment_method: "Card",
        paid: "$6,900.00",
        balance: "$6,900.00"
    },
    financing: [
        { plan: "Plan L1510", term: "120 months", monthly: "$231.05" },
        { plan: "Plan LR0084", term: "84 months", monthly: "$281.88" }
    ],
    items: [
        { qty: "1", name: "Rheem furnace", sku: "R801T1005A21DZSNAS", type: "Furnace", description: "100,000 BTU single stage", unit_price: "$0.00", line_total: "$0.00" },
        { qty: "1", name: "Rheem air conditioner", sku: "RA13NY42AJ1NA", type: "AC", description: "3.5 ton single stage", unit_price: "$0.00", line_total: "$0.00" }
    ],
    units: [
        { brand: "Rheem", type: "Furnace", model: "R801T1005A21DZSNAS", serial: "20260801J1", registration_url: "www.example.com/register" }
    ],
    photos: [
        { url: "assets/images/inspection-furnace.jpg", title: "Furnace" },
        { url: "assets/images/inspection-ac.jpg", title: "Outdoor unit" },
        { url: "assets/images/inspection-thermostat.jpg", title: "Thermostat" }
    ],
    report: {
        technician: "Trey Durden",
        equipment: "Furnace and air conditioner",
        summary: "Summary written by the technician and stored in the database.",
        seller: "Sample Seller",
        inspection_date: "10/13/2026"
    },
    agreement: {
        scope: "Remove existing equipment and install the system listed on estimate EST-0001.",
        terms: "Payment schedule, access, permits and cancellation terms from the database."
    },
    approval: {
        decision: "approve"
    },
    decline: {
        reasons: ["quote"],
        notes: "Customer wants a second opinion."
    },
    right_to_repair: {
        text: "Thank you for allowing us to be your service provider. If a mistake was made by a previous technician, we can send the same or a different technician from our company to correct it."
    },
    warranty_items: [
        { equipment: "Rheem furnace", model: "R801T1005A21DZSNAS", serial: "20260801J1", term: "10 years parts", register_by: "30 days after install", notes: "20-year heat exchanger" }
    ],
    signature: {
        customer_image: "assets/images/signature.png",
        date: "10/13/2026"
    }
});

Object.assign(window.App, { sampleFor });
