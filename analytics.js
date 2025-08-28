const ctxMap = {
    "sales-days": document.getElementById("sales-days"),
    "leads-days": document.getElementById("leads-days"),
    "repeat-purchases": document.getElementById("repeat-purchases"),
    "revenue": document.getElementById("revenue"),
    "sales-manager": document.getElementById("sales-manager")
};

let charts = {};

fetch("sales.json")
    .then(res => res.json())
    .then(data => {
        renderCharts(data);
        setupTabs();
    });

function renderCharts(data) {
    renderSalesByDays(data);
    renderLeadsByDays(data);
    renderRepeatPurchases(data);
    renderRevenue(data);
    renderSalesByManager(data);

    Object.keys(charts).forEach((id, index) => {
        charts[id].canvas.style.display = index === 0 ? "block" : "none";
    });
}

function renderSalesByDays(data) {
    const grouped = {};
    data.forEach(sale => {
        grouped[sale.date] = (grouped[sale.date] || 0) + sale.amount;
    });
    const labels = Object.keys(grouped).sort();
    const values = labels.map(d => grouped[d]);

    charts["sales-days"] = new Chart(ctxMap["sales-days"], {
        type: "line",
        data: { labels, datasets: [{ label: "Produce sales", data: values, borderColor: "black", backgroundColor: "white", tension: 0.3, fill: false }] },
        options: { responsive: true }
    });
}

function renderLeadsByDays(data) {
    const grouped = {};
    data.filter(s => s.isLead).forEach(sale => {
        grouped[sale.date] = (grouped[sale.date] || 0) + 1;
    });
    const labels = Object.keys(grouped).sort();
    const values = labels.map(d => grouped[d]);

    charts["leads-days"] = new Chart(ctxMap["leads-days"], {
        type: "bar",
        data: { labels, datasets: [{ label: "Leads per Day", data: values, backgroundColor: "red" }] },
        options: { responsive: true }
    });
}

function renderRepeatPurchases(data) {
    const grouped = {};
    data.forEach(sale => {
        grouped[sale.product] = (grouped[sale.product] || 0) + 1;
    });

    const labels = Object.keys(grouped);
    const counts = Object.values(grouped);
    const total = counts.reduce((sum, v) => sum + v, 0);
    const percentages = counts.map(v => ((v / total) * 100).toFixed(1));

    const colors = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)'
    ];

    charts["repeat-purchases"] = new Chart(ctxMap["repeat-purchases"], {
        type: "pie",
        data: { labels, datasets: [{ data: percentages, backgroundColor: colors }] },
        options: { responsive: true }
    });
}

function renderRevenue(data) {
    const grouped = {};
    data.forEach(sale => {
        grouped[sale.date] = (grouped[sale.date] || 0) + sale.amount;
    });
    const labels = Object.keys(grouped).sort();
    const values = labels.map(d => grouped[d]);

    charts["revenue"] = new Chart(ctxMap["revenue"], {
        type: "line",
        data: { labels, datasets: [{ label: "Revenue", data: values, borderColor: "black", backgroundColor: "white", tension: 0.3, fill: false }] },
        options: { responsive: true }
    });
}

function renderSalesByManager(data) {
    const grouped = {};
    data.forEach(sale => {
        grouped[sale.manager] = (grouped[sale.manager] || 0) + sale.amount;
    });
    const labels = Object.keys(grouped);
    const values = Object.values(grouped);

    charts["sales-manager"] = new Chart(ctxMap["sales-manager"], {
        type: "radar",
        data: { labels, datasets: [{ label: "Sales by Manager ($)", data: values, borderColor: "#0d47a1", backgroundColor: "rgba(13,71,161,0.3)", pointBackgroundColor: "#0d47a1" }] },
        options: { responsive: true }
    });
}

function setupTabs() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            // Активна кнопка
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const tab = btn.dataset.tab;

            Object.keys(charts).forEach(id => charts[id].canvas.style.display = "none");

            charts[tab].canvas.style.display = "block";
            charts[tab].resize();
        });
    });
}