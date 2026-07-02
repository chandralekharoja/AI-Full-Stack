/* ============================================
   BudgetSphere - charts.js
   Chart.js rendering helpers for dashboard & analytics
   ============================================ */
window.BS = window.BS || {};

BS.charts = (function () {
  const utils = BS.utils;
  const instances = {};

  const PALETTE = ['#6c5ce7', '#4d96ff', '#2ecc71', '#f7b731', '#ff6b6b', '#8c7ae6', '#26de81', '#fd79a8', '#00cec9', '#e17055'];

  function themeColors() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    return {
      text: isDark ? '#a3a7c2' : '#565a72',
      grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(27,29,43,0.08)',
    };
  }

  function destroy(key) {
    if (instances[key]) {
      instances[key].destroy();
      delete instances[key];
    }
  }

  function lastNMonthKeys(n) {
    const keys = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    return keys;
  }

  function renderMonthlyChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const colors = themeColors();
    const months = lastNMonthKeys(6);

    const incomeByMonth = {};
    const expenseByMonth = {};
    months.forEach((m) => { incomeByMonth[m] = 0; expenseByMonth[m] = 0; });

    data.transactions.forEach((t) => {
      const mk = utils.monthKey(t.date);
      if (!(mk in incomeByMonth)) return;
      if (t.type === 'income') incomeByMonth[mk] += Number(t.amount);
      else expenseByMonth[mk] += Number(t.amount);
    });
    data.bills.forEach((b) => {
      if (b.status !== 'paid' || !b.paidDate) return;
      const mk = utils.monthKey(b.paidDate);
      if (!(mk in expenseByMonth)) return;
      expenseByMonth[mk] += Number(b.amount);
    });

    destroy('monthly');
    instances.monthly = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months.map(utils.monthLabel),
        datasets: [
          { label: 'Income', data: months.map((m) => incomeByMonth[m]), backgroundColor: '#2ecc71', borderRadius: 8, maxBarThickness: 28 },
          { label: 'Expenses', data: months.map((m) => expenseByMonth[m]), backgroundColor: '#ff6b6b', borderRadius: 8, maxBarThickness: 28 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: colors.text } } },
        scales: {
          x: { ticks: { color: colors.text }, grid: { display: false } },
          y: { ticks: { color: colors.text }, grid: { color: colors.grid } },
        },
      },
    });
  }

  function categoryTotals(items, valueKey) {
    const totals = {};
    items.forEach((item) => {
      const cat = item.category || 'Other';
      totals[cat] = (totals[cat] || 0) + Number(item[valueKey] || 0);
    });
    return totals;
  }

  function renderDoughnut(canvasId, key, labels, values, colors) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const tc = themeColors();
    destroy(key);
    instances[key] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data: values, backgroundColor: colors, borderWidth: 0, hoverOffset: 8 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: '65%',
        plugins: { legend: { position: 'bottom', labels: { color: tc.text, boxWidth: 12, padding: 12 } } },
      },
    });
  }

  function renderBreakdownChart(canvasId, data) {
    const expenses = data.transactions.filter((t) => t.type === 'expense');
    const paidBills = data.bills.filter((b) => b.status === 'paid');
    const totals = categoryTotals(expenses, 'amount');
    paidBills.forEach((b) => {
      const cat = b.category || 'Other';
      totals[cat] = (totals[cat] || 0) + Number(b.amount);
    });
    const labels = Object.keys(totals);
    if (labels.length === 0) {
      destroy('breakdown');
      return;
    }
    renderDoughnut(canvasId, 'breakdown', labels, labels.map((l) => totals[l]), PALETTE);
  }

  function renderIncomeCategoryChart(canvasId, data) {
    const income = data.transactions.filter((t) => t.type === 'income');
    const totals = categoryTotals(income, 'amount');
    const labels = Object.keys(totals);
    if (labels.length === 0) { destroy('incomeCat'); return; }
    renderDoughnut(canvasId, 'incomeCat', labels, labels.map((l) => totals[l]), PALETTE);
  }

  function renderExpenseCategoryChart(canvasId, data) {
    const expenses = data.transactions.filter((t) => t.type === 'expense');
    const totals = categoryTotals(expenses, 'amount');
    const labels = Object.keys(totals);
    if (labels.length === 0) { destroy('expenseCat'); return; }
    renderDoughnut(canvasId, 'expenseCat', labels, labels.map((l) => totals[l]), PALETTE);
  }

  function renderBillsStatusChart(canvasId, data) {
    const pending = data.bills.filter((b) => b.status === 'pending').length;
    const paid = data.bills.filter((b) => b.status === 'paid').length;
    if (pending + paid === 0) { destroy('billsStatus'); return; }
    renderDoughnut(canvasId, 'billsStatus', ['Pending', 'Paid'], [pending, paid], ['#f7b731', '#26de81']);
  }

  function renderTrendChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const colors = themeColors();
    const months = lastNMonthKeys(6);

    let running = 0;
    // compute running balance up to the start of the window using all prior transactions
    const windowStart = months[0];
    data.transactions.forEach((t) => {
      const mk = utils.monthKey(t.date);
      if (mk < windowStart) running += (t.type === 'income' ? Number(t.amount) : -Number(t.amount));
    });
    data.bills.forEach((b) => {
      if (b.status === 'paid' && b.paidDate && utils.monthKey(b.paidDate) < windowStart) running -= Number(b.amount);
    });

    const balances = [];
    months.forEach((mk) => {
      let net = 0;
      data.transactions.forEach((t) => {
        if (utils.monthKey(t.date) === mk) net += (t.type === 'income' ? Number(t.amount) : -Number(t.amount));
      });
      data.bills.forEach((b) => {
        if (b.status === 'paid' && b.paidDate && utils.monthKey(b.paidDate) === mk) net -= Number(b.amount);
      });
      running += net;
      balances.push(running);
    });

    destroy('trend');
    instances.trend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months.map(utils.monthLabel),
        datasets: [{
          label: 'Balance',
          data: balances,
          borderColor: '#6c5ce7',
          backgroundColor: 'rgba(108,92,231,0.15)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#6c5ce7',
          pointRadius: 4,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: colors.text }, grid: { display: false } },
          y: { ticks: { color: colors.text }, grid: { color: colors.grid } },
        },
      },
    });
  }

  function renderAll(data) {
    renderMonthlyChart('chart-monthly', data);
    renderBreakdownChart('chart-breakdown', data);
    renderTrendChart('chart-trend', data);
    renderBillsStatusChart('chart-bills-status', data);
    renderIncomeCategoryChart('chart-income-cat', data);
    renderExpenseCategoryChart('chart-expense-cat', data);
  }

  return { renderAll, renderMonthlyChart, renderBreakdownChart, renderTrendChart, renderBillsStatusChart, renderIncomeCategoryChart, renderExpenseCategoryChart };
})();
