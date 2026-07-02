/* ============================================
   BudgetSphere - storage.js
   LocalStorage persistence + import/export
   ============================================ */
window.BS = window.BS || {};

BS.storage = (function () {
  const STORAGE_KEY = 'budgetsphere_data_v1';

  const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'];
  const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Education', 'Other'];
  const BILL_CATEGORIES = ['Rent', 'Utilities', 'Subscription', 'Insurance', 'Loan', 'Credit Card', 'Other'];

  function defaultData() {
    return {
      version: 1,
      transactions: [], // { id, type: 'income'|'expense', name, amount, category, date, note, createdAt }
      bills: [],        // { id, name, amount, category, dueDate, status: 'pending'|'paid', recurring, note, paidDate, lastNotifiedDate, createdAt }
      notifications: [], // { id, title, message, type, date, read }
      settings: {
        theme: 'dark',
        currency: 'USD',
        reminderDays: 3,
        notificationsEnabled: false,
      },
    };
  }

  function migrate(data) {
    const d = Object.assign(defaultData(), data || {});
    d.transactions = Array.isArray(d.transactions) ? d.transactions : [];
    d.bills = Array.isArray(d.bills) ? d.bills : [];
    d.notifications = Array.isArray(d.notifications) ? d.notifications : [];
    d.settings = Object.assign(defaultData().settings, d.settings || {});
    return d;
  }

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultData();
      const parsed = JSON.parse(raw);
      return migrate(parsed);
    } catch (e) {
      console.error('BudgetSphere: failed to load data, resetting.', e);
      return defaultData();
    }
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('BudgetSphere: failed to save data.', e);
      return false;
    }
  }

  function exportDataString(data) {
    return JSON.stringify(data, null, 2);
  }

  function validateImportedData(obj) {
    if (!obj || typeof obj !== 'object') return 'Invalid file: not a JSON object.';
    if (obj.transactions && !Array.isArray(obj.transactions)) return 'Invalid file: "transactions" must be an array.';
    if (obj.bills && !Array.isArray(obj.bills)) return 'Invalid file: "bills" must be an array.';
    return null;
  }

  function resetData() {
    localStorage.removeItem(STORAGE_KEY);
    return defaultData();
  }

  return {
    STORAGE_KEY,
    INCOME_CATEGORIES,
    EXPENSE_CATEGORIES,
    BILL_CATEGORIES,
    defaultData,
    loadData,
    saveData,
    exportDataString,
    validateImportedData,
    resetData,
    migrateExternal: migrate,
  };
})();
