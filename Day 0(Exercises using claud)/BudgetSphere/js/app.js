/* ============================================
   BudgetSphere - app.js
   Main application: state, rendering, CRUD, events
   ============================================ */
(function () {
  const utils = BS.utils;
  const storage = BS.storage;
  const notif = BS.notifications;
  const charts = BS.charts;

  let state = storage.loadData();
  let confirmCallback = null;

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $all = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function persist() { storage.saveData(state); }

  /* ================= TOASTS ================= */
  function showToast(message, type) {
    type = type || 'info';
    const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info', warning: 'fa-triangle-exclamation' };
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${utils.escapeHtml(message)}</span>`;
    $('#toast-container').appendChild(el);
    setTimeout(() => {
      el.classList.add('toast-out');
      setTimeout(() => el.remove(), 300);
    }, 3500);
  }

  /* ================= THEME ================= */
  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    state.settings.theme = theme;
    persist();
    [$('#theme-toggle'), $('#settings-theme-toggle')].forEach((btn) => {
      if (!btn) return;
      const icon = btn.querySelector('i');
      if (btn.id === 'theme-toggle') {
        if (theme === 'dark') { icon.className = 'fa-solid fa-sun'; btn.querySelector('span').textContent = 'Light Mode'; }
        else { icon.className = 'fa-solid fa-moon'; btn.querySelector('span').textContent = 'Dark Mode'; }
      }
    });
    if (appRendered) charts.renderAll(state);
  }

  function toggleTheme() {
    applyTheme(state.settings.theme === 'dark' ? 'light' : 'dark');
  }

  /* ================= NAVIGATION ================= */
  function goToPage(page) {
    $all('.nav-item').forEach((btn) => btn.classList.toggle('active', btn.dataset.page === page));
    $all('.page').forEach((sec) => sec.classList.toggle('active', sec.id === `page-${page}`));
    const titles = { dashboard: 'Dashboard', income: 'Income', expenses: 'Expenses', bills: 'Bill Planner', analytics: 'Analytics', settings: 'Settings' };
    $('#page-title').textContent = titles[page] || 'Dashboard';
    closeSidebar();
    if (page === 'analytics') charts.renderAll(state);
  }

  function bindNavigation() {
    $all('.nav-item').forEach((btn) => btn.addEventListener('click', () => goToPage(btn.dataset.page)));
    $all('[data-goto]').forEach((btn) => btn.addEventListener('click', () => goToPage(btn.dataset.goto)));
  }

  /* ================= SIDEBAR (mobile) ================= */
  function openSidebar() { $('#sidebar').classList.add('open'); $('#sidebar-overlay').classList.add('visible'); }
  function closeSidebar() { $('#sidebar').classList.remove('open'); $('#sidebar-overlay').classList.remove('visible'); }
  function bindSidebarToggle() {
    $('#hamburger').addEventListener('click', openSidebar);
    $('#sidebar-overlay').addEventListener('click', closeSidebar);
  }

  /* ================= CATEGORY SELECTS ================= */
  function setSelectOptions(select, categories, includeAll) {
    select.innerHTML = '';
    if (includeAll) {
      const opt = document.createElement('option');
      opt.value = ''; opt.textContent = 'All Categories';
      select.appendChild(opt);
    }
    categories.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      select.appendChild(opt);
    });
  }

  function populateFilterDropdowns() {
    setSelectOptions($('#income-category-filter'), storage.INCOME_CATEGORIES, true);
    setSelectOptions($('#expense-category-filter'), storage.EXPENSE_CATEGORIES, true);
    setSelectOptions($('#bill-category'), storage.BILL_CATEGORIES, false);
  }

  /* ================= NOTIFICATION CENTER ================= */
  function bindNotificationCenter() {
    const bell = $('#notif-bell');
    const panel = $('#notif-panel');
    bell.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
      if (!panel.classList.contains('hidden') && !panel.contains(e.target) && e.target !== bell) {
        panel.classList.add('hidden');
      }
    });
    $('#notif-mark-read').addEventListener('click', () => {
      state.notifications.forEach((n) => (n.read = true));
      persist();
      renderNotificationCenter();
    });
    $('#notif-clear').addEventListener('click', () => {
      state.notifications = [];
      persist();
      renderNotificationCenter();
    });
    $('#notif-list').addEventListener('click', (e) => {
      const item = e.target.closest('.notif-item');
      if (!item) return;
      const n = state.notifications.find((x) => x.id === item.dataset.id);
      if (n) { n.read = true; persist(); renderNotificationCenter(); }
    });
  }

  function timeAgo(iso) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  function renderNotificationCenter() {
    const list = $('#notif-list');
    const sorted = [...state.notifications].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sorted.length === 0) {
      list.innerHTML = `<div class="notif-empty">No notifications yet. We'll let you know about upcoming bills here.</div>`;
    } else {
      const icons = { warning: 'fa-triangle-exclamation', error: 'fa-circle-exclamation', info: 'fa-circle-info', success: 'fa-circle-check' };
      list.innerHTML = sorted.map((n) => `
        <div class="notif-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
          <i class="fa-solid ${icons[n.type] || icons.info}"></i>
          <div class="notif-body">
            <div class="notif-title">${utils.escapeHtml(n.title)}</div>
            <div>${utils.escapeHtml(n.message)}</div>
            <span class="notif-time">${timeAgo(n.date)}</span>
          </div>
        </div>
      `).join('');
    }
    const unreadCount = state.notifications.filter((n) => !n.read).length;
    const badge = $('#notif-badge');
    if (unreadCount > 0) { badge.textContent = unreadCount > 99 ? '99+' : String(unreadCount); badge.classList.remove('hidden'); }
    else badge.classList.add('hidden');
  }

  function runBillReminderCheck() {
    const created = notif.checkBillReminders(state);
    if (created) { persist(); renderNotificationCenter(); }
  }

  /* ================= COMPUTATIONS ================= */
  function billComputedStatus(bill) {
    if (bill.status === 'paid') return 'paid';
    const today = utils.todayInputValue();
    return bill.dueDate < today ? 'overdue' : 'pending';
  }

  function computeTotals() {
    const totalIncome = state.transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const manualExpense = state.transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    const paidBillsTotal = state.bills.filter((b) => b.status === 'paid').reduce((s, b) => s + Number(b.amount), 0);
    const totalExpense = manualExpense + paidBillsTotal;
    const balance = totalIncome - totalExpense;
    const pendingCount = state.bills.filter((b) => b.status !== 'paid').length;
    const paidCount = state.bills.filter((b) => b.status === 'paid').length;
    return { totalIncome, totalExpense, balance, pendingCount, paidCount };
  }

  /* ================= DASHBOARD ================= */
  function renderDashboardCards() {
    const t = computeTotals();
    const cur = state.settings.currency;
    utils.animateCounter($('#card-income'), t.totalIncome, { currency: true, currencyCode: cur });
    utils.animateCounter($('#card-expense'), t.totalExpense, { currency: true, currencyCode: cur });
    utils.animateCounter($('#card-balance'), t.balance, { currency: true, currencyCode: cur });
    utils.animateCounter($('#card-pending'), t.pendingCount, {});
    utils.animateCounter($('#card-paid'), t.paidCount, {});
  }

  function renderDashboardLists() {
    const cur = state.settings.currency;
    const recent = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
    const recentEl = $('#recent-transactions');
    if (recent.length === 0) {
      recentEl.innerHTML = `<p style="color:var(--text-2);font-size:13px;padding:10px 0;">No transactions yet.</p>`;
    } else {
      recentEl.innerHTML = recent.map((t) => `
        <div class="mini-item">
          <div class="mini-icon" style="background:${t.type === 'income' ? '#2ecc71' : '#ff6b6b'}">
            <i class="fa-solid ${t.type === 'income' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
          </div>
          <div class="mini-info">
            <div class="mini-name">${utils.escapeHtml(t.name)}</div>
            <div class="mini-sub">${utils.escapeHtml(t.category)} · ${utils.formatDateDisplay(t.date)}</div>
          </div>
          <div class="mini-amount ${t.type === 'income' ? 'amount-positive' : 'amount-negative'}">${t.type === 'income' ? '+' : '-'}${utils.formatCurrency(t.amount, cur)}</div>
        </div>
      `).join('');
    }

    const upcoming = state.bills.filter((b) => b.status !== 'paid').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 6);
    const upcomingEl = $('#upcoming-bills');
    if (upcoming.length === 0) {
      upcomingEl.innerHTML = `<p style="color:var(--text-2);font-size:13px;padding:10px 0;">No upcoming bills.</p>`;
    } else {
      upcomingEl.innerHTML = upcoming.map((b) => {
        const status = billComputedStatus(b);
        return `
        <div class="mini-item">
          <div class="mini-icon" style="background:${status === 'overdue' ? '#ff5252' : '#f7b731'}">
            <i class="fa-solid fa-file-invoice-dollar"></i>
          </div>
          <div class="mini-info">
            <div class="mini-name">${utils.escapeHtml(b.name)}</div>
            <div class="mini-sub">Due ${utils.formatDateDisplay(b.dueDate)} ${status === 'overdue' ? '· Overdue' : ''}</div>
          </div>
          <div class="mini-amount">${utils.formatCurrency(b.amount, cur)}</div>
        </div>`;
      }).join('');
    }
  }

  function renderDashboard() {
    renderDashboardCards();
    renderDashboardLists();
    charts.renderMonthlyChart('chart-monthly', state);
    charts.renderBreakdownChart('chart-breakdown', state);
  }

  /* ================= INCOME / EXPENSE TABLES ================= */
  function filterSortTransactions(type) {
    const prefix = type === 'income' ? 'income' : 'expense';
    const q = ($(`#${prefix}-search`).value || '').trim().toLowerCase();
    const cat = $(`#${prefix}-category-filter`).value;
    const sort = $(`#${prefix}-sort`).value;

    let list = state.transactions.filter((t) => t.type === type);
    if (q) list = list.filter((t) => t.name.toLowerCase().includes(q) || (t.note || '').toLowerCase().includes(q));
    if (cat) list = list.filter((t) => t.category === cat);

    const sorters = {
      'date-desc': (a, b) => new Date(b.date) - new Date(a.date),
      'date-asc': (a, b) => new Date(a.date) - new Date(b.date),
      'amount-desc': (a, b) => b.amount - a.amount,
      'amount-asc': (a, b) => a.amount - b.amount,
      'name-asc': (a, b) => a.name.localeCompare(b.name),
    };
    list.sort(sorters[sort] || sorters['date-desc']);
    return list;
  }

  function renderTransactionTable(type) {
    const prefix = type === 'income' ? 'income' : 'expense';
    const list = filterSortTransactions(type);
    const container = $(`#${prefix}-table`);
    const emptyEl = $(`#${prefix}-empty`);
    const total = state.transactions.filter((t) => t.type === type).length;

    if (list.length === 0) {
      container.innerHTML = '';
      emptyEl.classList.remove('hidden');
      emptyEl.querySelector('p').textContent = total === 0
        ? `No ${type} records yet. Add your first one!`
        : 'No matching results. Try adjusting your search or filters.';
      return;
    }
    emptyEl.classList.add('hidden');
    const cur = state.settings.currency;
    container.innerHTML = `
      <table class="data-table">
        <thead><tr><th>Date</th><th>Name</th><th>Category</th><th>Amount</th><th>Notes</th><th></th></tr></thead>
        <tbody>
          ${list.map((t) => `
            <tr>
              <td>${utils.formatDateDisplay(t.date)}</td>
              <td>${utils.escapeHtml(t.name)}</td>
              <td><span class="badge badge-${type}">${utils.escapeHtml(t.category)}</span></td>
              <td class="${type === 'income' ? 'amount-positive' : 'amount-negative'}">${utils.formatCurrency(t.amount, cur)}</td>
              <td>${utils.escapeHtml(t.note || '—')}</td>
              <td>
                <div class="row-actions">
                  <button class="edit-btn" data-id="${t.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
                  <button class="delete-btn" data-id="${t.id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function bindTableActions(containerId, type) {
    $(`#${containerId}`).addEventListener('click', (e) => {
      const editBtn = e.target.closest('.edit-btn');
      const delBtn = e.target.closest('.delete-btn');
      if (editBtn) openTransactionModal(type, editBtn.dataset.id);
      if (delBtn) {
        openConfirmModal('Delete transaction?', 'This will permanently remove this record.', () => {
          state.transactions = state.transactions.filter((t) => t.id !== delBtn.dataset.id);
          persist();
          renderIncomePage(); renderExpensePage(); renderDashboard(); charts.renderAll(state);
          showToast('Transaction deleted.', 'success');
        });
      }
    });
  }

  function renderIncomePage() { renderTransactionTable('income'); }
  function renderExpensePage() { renderTransactionTable('expense'); }

  function bindIncomeToolbar() {
    $('#add-income-btn').addEventListener('click', () => openTransactionModal('income'));
    $('#income-search').addEventListener('input', utils.debounce(renderIncomePage, 250));
    $('#income-category-filter').addEventListener('change', renderIncomePage);
    $('#income-sort').addEventListener('change', renderIncomePage);
    bindTableActions('income-table', 'income');
  }
  function bindExpenseToolbar() {
    $('#add-expense-btn').addEventListener('click', () => openTransactionModal('expense'));
    $('#expense-search').addEventListener('input', utils.debounce(renderExpensePage, 250));
    $('#expense-category-filter').addEventListener('change', renderExpensePage);
    $('#expense-sort').addEventListener('change', renderExpensePage);
    bindTableActions('expense-table', 'expense');
  }

  /* ================= BILLS ================= */
  function filterSortBills() {
    const q = ($('#bill-search').value || '').trim().toLowerCase();
    const statusFilter = $('#bill-status-filter').value;
    const sort = $('#bill-sort').value;

    let list = [...state.bills];
    if (q) list = list.filter((b) => b.name.toLowerCase().includes(q) || (b.note || '').toLowerCase().includes(q));
    if (statusFilter) list = list.filter((b) => billComputedStatus(b) === statusFilter);

    const sorters = {
      'due-asc': (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      'due-desc': (a, b) => new Date(b.dueDate) - new Date(a.dueDate),
      'amount-desc': (a, b) => b.amount - a.amount,
      'amount-asc': (a, b) => a.amount - b.amount,
      'name-asc': (a, b) => a.name.localeCompare(b.name),
    };
    list.sort(sorters[sort] || sorters['due-asc']);
    return list;
  }

  function renderBillsPage() {
    const list = filterSortBills();
    const grid = $('#bills-grid');
    const emptyEl = $('#bills-empty');

    if (list.length === 0) {
      grid.innerHTML = '';
      emptyEl.classList.remove('hidden');
      emptyEl.querySelector('p').textContent = state.bills.length === 0
        ? 'No bills planned yet. Add one to start tracking due dates!'
        : 'No matching bills. Try adjusting your search or filters.';
      return;
    }
    emptyEl.classList.add('hidden');
    const cur = state.settings.currency;
    grid.innerHTML = list.map((b) => {
      const status = billComputedStatus(b);
      const statusLabel = status === 'overdue' ? 'Overdue' : status === 'paid' ? 'Paid' : 'Pending';
      return `
      <div class="glass-card bill-card status-${status}">
        <div class="bill-card-head">
          <div>
            <div class="bill-name">${utils.escapeHtml(b.name)}</div>
            <div class="bill-category">${utils.escapeHtml(b.category)}${b.recurring !== 'none' ? ' · ' + utils.capitalize(b.recurring) : ''}</div>
          </div>
          <span class="bill-status-badge status-${status}">${statusLabel}</span>
        </div>
        <div class="bill-amount">${utils.formatCurrency(b.amount, cur)}</div>
        <div class="bill-due"><i class="fa-regular fa-calendar"></i> Due ${utils.formatDateDisplay(b.dueDate)}</div>
        ${b.note ? `<div class="bill-due">${utils.escapeHtml(b.note)}</div>` : ''}
        <div class="bill-card-actions">
          <button class="btn btn-secondary toggle-status-btn" data-id="${b.id}">
            <i class="fa-solid ${status === 'paid' ? 'fa-rotate-left' : 'fa-check'}"></i> ${status === 'paid' ? 'Mark Pending' : 'Mark Paid'}
          </button>
          <button class="btn btn-secondary edit-bill-btn" data-id="${b.id}"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-danger delete-bill-btn" data-id="${b.id}"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>`;
    }).join('');
  }

  function computeNextDueDate(dueDate, recurring) {
    const d = new Date(dueDate + 'T00:00:00');
    if (recurring === 'weekly') d.setDate(d.getDate() + 7);
    else if (recurring === 'monthly') d.setMonth(d.getMonth() + 1);
    else if (recurring === 'yearly') d.setFullYear(d.getFullYear() + 1);
    return utils.toDateInputValue(d);
  }

  function bindBillsToolbar() {
    $('#add-bill-btn').addEventListener('click', () => openBillModal());
    $('#bill-search').addEventListener('input', utils.debounce(renderBillsPage, 250));
    $('#bill-status-filter').addEventListener('change', renderBillsPage);
    $('#bill-sort').addEventListener('change', renderBillsPage);

    $('#bills-grid').addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('.toggle-status-btn');
      const editBtn = e.target.closest('.edit-bill-btn');
      const delBtn = e.target.closest('.delete-bill-btn');

      if (toggleBtn) {
        const bill = state.bills.find((b) => b.id === toggleBtn.dataset.id);
        if (!bill) return;
        if (bill.status === 'paid') {
          bill.status = 'pending';
          bill.paidDate = null;
          showToast(`${bill.name} marked as pending.`, 'info');
        } else {
          bill.status = 'paid';
          bill.paidDate = utils.todayInputValue();
          showToast(`${bill.name} marked as paid.`, 'success');
          if (bill.recurring && bill.recurring !== 'none') {
            state.bills.push({
              id: utils.uid(),
              name: bill.name,
              amount: bill.amount,
              category: bill.category,
              dueDate: computeNextDueDate(bill.dueDate, bill.recurring),
              status: 'pending',
              recurring: bill.recurring,
              note: bill.note,
              paidDate: null,
              lastNotifiedDate: null,
              createdAt: new Date().toISOString(),
            });
          }
        }
        persist();
        renderBillsPage(); renderDashboard(); charts.renderAll(state);
      }

      if (editBtn) openBillModal(editBtn.dataset.id);

      if (delBtn) {
        const bill = state.bills.find((b) => b.id === delBtn.dataset.id);
        openConfirmModal('Delete bill?', `This will permanently remove "${bill ? bill.name : ''}".`, () => {
          state.bills = state.bills.filter((b) => b.id !== delBtn.dataset.id);
          persist();
          renderBillsPage(); renderDashboard(); charts.renderAll(state);
          showToast('Bill deleted.', 'success');
        });
      }
    });
  }

  /* ================= ANALYTICS ================= */
  function renderAnalyticsPage() { charts.renderAll(state); }

  /* ================= TRANSACTION MODAL ================= */
  function clearFieldErrors(form) {
    $all('.field-error', form).forEach((el) => (el.textContent = ''));
    $all('input, select, textarea', form).forEach((el) => el.classList.remove('invalid'));
  }

  function setFieldError(inputId, message) {
    const input = $(`#${inputId}`);
    const err = $(`#err-${inputId}`);
    if (message) { input.classList.add('invalid'); if (err) err.textContent = message; }
    else { input.classList.remove('invalid'); if (err) err.textContent = ''; }
  }

  function openTransactionModal(type, id) {
    const form = $('#transaction-form');
    clearFieldErrors(form);
    const categories = type === 'income' ? storage.INCOME_CATEGORIES : storage.EXPENSE_CATEGORIES;
    setSelectOptions($('#transaction-category'), categories, false);

    $('#transaction-type').value = type;
    $('#transaction-id').value = '';
    $('#transaction-modal-title').textContent = id ? `Edit ${utils.capitalize(type)}` : `Add ${utils.capitalize(type)}`;

    if (id) {
      const t = state.transactions.find((x) => x.id === id);
      $('#transaction-id').value = t.id;
      $('#transaction-name').value = t.name;
      $('#transaction-amount').value = t.amount;
      $('#transaction-date').value = t.date;
      $('#transaction-category').value = t.category;
      $('#transaction-note').value = t.note || '';
    } else {
      form.reset();
      $('#transaction-date').value = utils.todayInputValue();
      $('#transaction-category').value = categories[0];
    }
    $('#transaction-modal-overlay').classList.remove('hidden');
    $('#transaction-name').focus();
  }

  function bindTransactionModal() {
    $('#transaction-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      clearFieldErrors(form);

      const name = $('#transaction-name').value.trim();
      const amount = $('#transaction-amount').value;
      const date = $('#transaction-date').value;
      const category = $('#transaction-category').value;
      const note = $('#transaction-note').value.trim();
      const type = $('#transaction-type').value;
      const id = $('#transaction-id').value;

      let valid = true;
      const nameErr = utils.validateRequired(name);
      if (nameErr) { setFieldError('transaction-name', nameErr); valid = false; }
      const amountErr = utils.validateAmount(amount);
      if (amountErr) { setFieldError('transaction-amount', amountErr); valid = false; }
      const dateErr = utils.validateDate(date);
      if (dateErr) { setFieldError('transaction-date', dateErr); valid = false; }
      const catErr = utils.validateRequired(category);
      if (catErr) { setFieldError('transaction-category', catErr); valid = false; }
      if (!valid) return;

      if (id) {
        const t = state.transactions.find((x) => x.id === id);
        Object.assign(t, { name, amount: Number(amount), date, category, note });
      } else {
        state.transactions.push({
          id: utils.uid(), type, name, amount: Number(amount), date, category, note, createdAt: new Date().toISOString(),
        });
      }
      persist();
      closeModal('transaction-modal-overlay');
      renderIncomePage(); renderExpensePage(); renderDashboard(); charts.renderAll(state);
      showToast(`${utils.capitalize(type)} ${id ? 'updated' : 'added'} successfully.`, 'success');
    });
  }

  /* ================= BILL MODAL ================= */
  function openBillModal(id) {
    const form = $('#bill-form');
    clearFieldErrors(form);
    $('#bill-id').value = '';
    $('#bill-modal-title').textContent = id ? 'Edit Bill' : 'Add Bill';

    if (id) {
      const b = state.bills.find((x) => x.id === id);
      $('#bill-id').value = b.id;
      $('#bill-name').value = b.name;
      $('#bill-amount').value = b.amount;
      $('#bill-due-date').value = b.dueDate;
      $('#bill-category').value = b.category;
      $('#bill-recurring').value = b.recurring || 'none';
      $('#bill-note').value = b.note || '';
    } else {
      form.reset();
      $('#bill-due-date').value = utils.todayInputValue();
      $('#bill-category').value = storage.BILL_CATEGORIES[0];
      $('#bill-recurring').value = 'none';
    }
    $('#bill-modal-overlay').classList.remove('hidden');
    $('#bill-name').focus();
  }

  function bindBillModal() {
    $('#bill-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      clearFieldErrors(form);

      const name = $('#bill-name').value.trim();
      const amount = $('#bill-amount').value;
      const dueDate = $('#bill-due-date').value;
      const category = $('#bill-category').value;
      const recurring = $('#bill-recurring').value;
      const note = $('#bill-note').value.trim();
      const id = $('#bill-id').value;

      let valid = true;
      const nameErr = utils.validateRequired(name);
      if (nameErr) { setFieldError('bill-name', nameErr); valid = false; }
      const amountErr = utils.validateAmount(amount);
      if (amountErr) { setFieldError('bill-amount', amountErr); valid = false; }
      const dateErr = utils.validateDate(dueDate);
      if (dateErr) { setFieldError('bill-due-date', dateErr); valid = false; }
      const catErr = utils.validateRequired(category);
      if (catErr) { setFieldError('bill-category', catErr); valid = false; }
      if (!valid) return;

      if (id) {
        const b = state.bills.find((x) => x.id === id);
        Object.assign(b, { name, amount: Number(amount), dueDate, category, recurring, note, lastNotifiedDate: null });
      } else {
        state.bills.push({
          id: utils.uid(), name, amount: Number(amount), category, dueDate, status: 'pending',
          recurring, note, paidDate: null, lastNotifiedDate: null, createdAt: new Date().toISOString(),
        });
      }
      persist();
      closeModal('bill-modal-overlay');
      renderBillsPage(); renderDashboard(); charts.renderAll(state);
      showToast(`Bill ${id ? 'updated' : 'added'} successfully.`, 'success');
    });
  }

  /* ================= CONFIRM MODAL ================= */
  function openConfirmModal(title, message, onConfirm) {
    $('#confirm-modal-title').textContent = title;
    $('#confirm-modal-message').textContent = message;
    confirmCallback = onConfirm;
    $('#confirm-modal-overlay').classList.remove('hidden');
  }
  function bindConfirmModal() {
    $('#confirm-modal-confirm-btn').addEventListener('click', () => {
      if (confirmCallback) confirmCallback();
      confirmCallback = null;
      closeModal('confirm-modal-overlay');
    });
  }

  /* ================= MODAL GENERIC ================= */
  function closeModal(overlayId) { $(`#${overlayId}`).classList.add('hidden'); }
  function bindModalClosers() {
    $all('[data-close]').forEach((btn) => btn.addEventListener('click', () => closeModal(btn.dataset.close)));
    $all('.modal-overlay').forEach((overlay) => {
      overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.add('hidden'); });
    });
  }

  /* ================= GLOBAL SEARCH ================= */
  function bindGlobalSearch() {
    $('#global-search').addEventListener('input', utils.debounce((e) => {
      const q = e.target.value;
      $('#income-search').value = q; renderIncomePage();
      $('#expense-search').value = q; renderExpensePage();
      $('#bill-search').value = q; renderBillsPage();
    }, 250));
  }

  /* ================= SETTINGS PAGE ================= */
  function updateNotifStatusText() {
    const status = notif.permissionStatus();
    const labels = { granted: 'enabled', denied: 'blocked (change in browser settings)', default: 'not requested', unsupported: 'not supported by this browser' };
    $('#notif-permission-status').textContent = `Status: ${labels[status] || status}`;
  }

  function bindSettingsPage() {
    $('#settings-theme-toggle').addEventListener('click', toggleTheme);
    $('#settings-currency').value = state.settings.currency;
    $('#settings-currency').addEventListener('change', (e) => {
      state.settings.currency = e.target.value;
      persist();
      renderEverything();
      showToast('Currency updated.', 'success');
    });
    $('#settings-reminder-days').value = state.settings.reminderDays;
    $('#settings-reminder-days').addEventListener('change', (e) => {
      let v = Number(e.target.value);
      if (isNaN(v) || v < 0) v = 0;
      if (v > 30) v = 30;
      e.target.value = v;
      state.settings.reminderDays = v;
      persist();
      showToast('Reminder lead time updated.', 'success');
    });
    updateNotifStatusText();
    $('#enable-notifications-btn').addEventListener('click', () => {
      notif.requestPermission().then((perm) => {
        state.settings.notificationsEnabled = perm === 'granted';
        persist();
        updateNotifStatusText();
        if (perm === 'granted') { showToast('Browser notifications enabled.', 'success'); runBillReminderCheck(); }
        else if (perm === 'denied') showToast('Notifications blocked by browser.', 'error');
      });
    });

    $('#export-json-btn').addEventListener('click', () => {
      const str = storage.exportDataString(state);
      const blob = new Blob([str], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `budgetsphere-export-${utils.todayInputValue()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Data exported successfully.', 'success');
    });

    $('#import-json-btn').addEventListener('click', () => $('#import-json-input').click());
    $('#import-json-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        let parsed;
        try { parsed = JSON.parse(reader.result); }
        catch (err) { showToast('Invalid JSON file.', 'error'); e.target.value = ''; return; }
        const validationErr = storage.validateImportedData(parsed);
        if (validationErr) { showToast(validationErr, 'error'); e.target.value = ''; return; }
        openConfirmModal('Import data?', 'This will replace all current data with the imported file. This cannot be undone.', () => {
          state = storage.migrateExternal(parsed);
          persist();
          renderEverything();
          applyTheme(state.settings.theme);
          showToast('Data imported successfully.', 'success');
        });
        e.target.value = '';
      };
      reader.readAsText(file);
    });

    $('#clear-data-btn').addEventListener('click', () => {
      openConfirmModal('Clear all data?', 'This will permanently delete all income, expenses, bills and notifications.', () => {
        state = storage.resetData();
        persist();
        renderEverything();
        applyTheme(state.settings.theme);
        showToast('All data cleared.', 'success');
      });
    });
  }

  /* ================= LOTTIE ================= */
  function loadLottiePlayers() {
    $all('lottie-player[data-anim]').forEach((el) => {
      const key = el.getAttribute('data-anim');
      const data = BS.lottieData && BS.lottieData[key];
      if (!data) return;
      if (typeof el.load === 'function') el.load(data);
      else el.addEventListener('ready', () => el.load(data), { once: true });
    });
  }

  /* ================= RENDER ALL / INIT ================= */
  let appRendered = false;
  function renderEverything() {
    renderDashboard();
    renderIncomePage();
    renderExpensePage();
    renderBillsPage();
    renderNotificationCenter();
    charts.renderAll(state);
    appRendered = true;
  }

  function hideLoadingScreen() {
    const loading = $('#loading-screen');
    const app = $('#app');
    app.classList.remove('hidden');
    requestAnimationFrame(() => app.classList.add('visible'));
    loading.classList.add('fade-out');
    setTimeout(() => loading.remove(), 650);
  }

  function init() {
    loadLottiePlayers();
    applyTheme(state.settings.theme);
    populateFilterDropdowns();
    bindNavigation();
    bindSidebarToggle();
    $('#theme-toggle').addEventListener('click', toggleTheme);
    bindGlobalSearch();
    bindNotificationCenter();
    bindTransactionModal();
    bindBillModal();
    bindConfirmModal();
    bindModalClosers();
    bindSettingsPage();
    bindIncomeToolbar();
    bindExpenseToolbar();
    bindBillsToolbar();

    runBillReminderCheck();
    renderEverything();
    setInterval(runBillReminderCheck, 5 * 60 * 1000);

    setTimeout(hideLoadingScreen, 1100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
