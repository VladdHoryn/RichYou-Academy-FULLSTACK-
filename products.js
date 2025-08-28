const productTabs = document.querySelectorAll('.products-tab-btn');
const productTables = document.querySelectorAll('.products-table');

productTabs.forEach(btn => {
    btn.addEventListener('click', () => {
        productTabs.forEach(b => b.classList.remove('active'));
        productTables.forEach(t => t.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(btn.dataset.table).classList.add('active');
    });
});

async function loadSalesData() {
    try {
        const res = await fetch('./sales.json');
        const ordersData = await res.json();
        console.log(ordersData); // <--- перевірка
        renderManagerRevenue(ordersData);
        renderLowTurnover(ordersData);
    } catch (err) {
        console.error("Failed to load sales.json", err);
    }
}

function renderManagerRevenue(ordersData) {
    const managerRevenueTable = document.querySelector('#manager-revenue tbody');
    managerRevenueTable.innerHTML = '';

    const managerStats = {};

    ordersData.forEach(order => {
        if (!managerStats[order.manager]) managerStats[order.manager] = { orders: 0, revenue: 0 };
        managerStats[order.manager].orders += 1;
        managerStats[order.manager].revenue += order.amount;
    });

    for (const manager in managerStats) {
        const stats = managerStats[manager];
        const avgCheck = (stats.revenue / stats.orders).toFixed(2);
        managerRevenueTable.innerHTML += `
            <tr>
                <td>${manager}</td>
                <td>${stats.orders}</td>
                <td>${stats.revenue}</td>
                <td>${avgCheck}</td>
            </tr>
        `;
    }
}

function renderLowTurnover(ordersData) {
    const lowTurnoverTable = document.querySelector('#low-turnover tbody');
    lowTurnoverTable.innerHTML = '';

    const productStats = {};

    ordersData.forEach(order => {
        if (!productStats[order.product]) productStats[order.product] = { units: 0, revenue: 0 };
        productStats[order.product].units += 1;
        productStats[order.product].revenue += order.amount;
    });

    const sortedProducts = Object.entries(productStats)
        .sort((a, b) => a[1].revenue - b[1].revenue);

    sortedProducts.forEach(([product, stats]) => {
        const turnover = (stats.revenue / stats.units).toFixed(2);
        lowTurnoverTable.innerHTML += `
            <tr>
                <td>${product}</td>
                <td>${stats.units}</td>
                <td>${stats.revenue}</td>
                <td>${turnover}</td>
            </tr>
        `;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadSalesData();
});
