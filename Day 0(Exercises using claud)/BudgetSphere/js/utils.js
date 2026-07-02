/* ============================================
   BudgetSphere - utils.js
   Shared helper functions (namespaced on BS)
   ============================================ */
window.BS = window.BS || {};

BS.utils = (function () {

  const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥' };

  function generateId() {
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
  }

  function getCurrencySymbol(code) {
    return CURRENCY_SYMBOLS[code] || '$';
  }

  function formatCurrency(amount, currency) {
    const symbol = getCurrencySymbol(currency || 'USD');
    const n = Number(amount) || 0;
    const sign = n < 0 ? '-' : '';
    const abs = Math.abs(n);
    return `${sign}${symbol}${abs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function formatNumber(n) {
    return Number(n || 0).toLocaleString();
  }

  function toDateInputValue(date) {
    const d = (date instanceof Date) ? date : new Date(date);
    const off = d.getTimezoneOffset();
    const local = new Date(d.getTime() - off * 60000);
    return local.toISOString().slice(0, 10);
  }

  function todayInputValue() {
    return toDateInputValue(new Date());
  }

  function formatDateDisplay(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function monthKey(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  function monthLabel(key) {
    const [y, m] = key.split('-').map(Number);
    const d = new Date(y, m - 1, 1);
    return d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
  }

  function daysBetween(dateStr1, dateStr2) {
    const d1 = new Date(dateStr1 + 'T00:00:00');
    const d2 = new Date(dateStr2 + 'T00:00:00');
    return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
  }

  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* Animated counter - counts numeric text content up/down to target */
  function animateCounter(el, endValue, opts) {
    opts = opts || {};
    const duration = opts.duration || 900;
    const isCurrency = !!opts.currency;
    const currencyCode = opts.currencyCode || 'USD';
    const startValue = parseFloat(el.dataset.count || '0') || 0;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = startValue + (endValue - startValue) * eased;
      el.textContent = isCurrency ? formatCurrency(current, currencyCode) : Math.round(current).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.dataset.count = String(endValue);
        el.textContent = isCurrency ? formatCurrency(endValue, currencyCode) : Math.round(endValue).toLocaleString();
      }
    }
    requestAnimationFrame(step);
  }

  /* ---- Validators ---- */
  function validateRequired(value) {
    if (value === null || value === undefined) return 'This field is required.';
    if (String(value).trim() === '') return 'This field is required.';
    return null;
  }

  function validateAmount(value) {
    if (value === null || value === undefined || String(value).trim() === '') return 'Amount is required.';
    const n = Number(value);
    if (isNaN(n)) return 'Amount must be a valid number.';
    if (n <= 0) return 'Amount must be greater than zero.';
    if (n > 999999999) return 'Amount is too large.';
    return null;
  }

  function validateDate(value) {
    if (!value) return 'Date is required.';
    const d = new Date(value);
    if (isNaN(d.getTime())) return 'Please enter a valid date.';
    return null;
  }

  function uid() { return generateId(); }

  return {
    generateId, uid,
    getCurrencySymbol,
    formatCurrency,
    formatNumber,
    toDateInputValue,
    todayInputValue,
    formatDateDisplay,
    monthKey,
    monthLabel,
    daysBetween,
    debounce,
    escapeHtml,
    capitalize,
    animateCounter,
    validateRequired,
    validateAmount,
    validateDate,
  };
})();
