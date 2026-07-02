/* ============================================
   BudgetSphere - notifications.js
   Browser notifications + in-app Notification Center
   ============================================ */
window.BS = window.BS || {};

BS.notifications = (function () {
  const utils = BS.utils;

  function isSupported() {
    return 'Notification' in window;
  }

  function permissionStatus() {
    if (!isSupported()) return 'unsupported';
    return Notification.permission; // 'default' | 'granted' | 'denied'
  }

  function requestPermission() {
    if (!isSupported()) return Promise.resolve('unsupported');
    return Notification.requestPermission();
  }

  function pushBrowserNotification(title, body) {
    if (isSupported() && Notification.permission === 'granted') {
      try {
        new Notification(title, { body, icon: undefined });
      } catch (e) {
        console.warn('BudgetSphere: could not show browser notification', e);
      }
    }
  }

  /* Adds an entry to the in-app Notification Center list (mutates data.notifications) */
  function addCenterNotification(data, { title, message, type }) {
    data.notifications.unshift({
      id: utils.uid(),
      title,
      message,
      type: type || 'info',
      date: new Date().toISOString(),
      read: false,
    });
    // Cap history to last 100 entries
    if (data.notifications.length > 100) data.notifications.length = 100;
  }

  /* Scans bills for due/overdue reminders, generates at most one notification
     per bill per day, pushes both a browser notification and a center entry. */
  function checkBillReminders(data) {
    const today = utils.todayInputValue();
    const leadDays = Number(data.settings.reminderDays) || 0;
    let created = false;

    data.bills.forEach((bill) => {
      if (bill.status === 'paid') return;
      if (bill.lastNotifiedDate === today) return; // already notified today

      const diff = utils.daysBetween(today, bill.dueDate); // positive = future, negative = overdue
      const isOverdue = diff < 0;
      const isDueSoon = diff >= 0 && diff <= leadDays;

      if (isOverdue || isDueSoon) {
        const amountStr = utils.formatCurrency(bill.amount, data.settings.currency);
        let title, message;
        if (isOverdue) {
          title = `Overdue: ${bill.name}`;
          message = `${bill.name} (${amountStr}) was due ${utils.formatDateDisplay(bill.dueDate)} and is now overdue.`;
        } else if (diff === 0) {
          title = `Due Today: ${bill.name}`;
          message = `${bill.name} (${amountStr}) is due today.`;
        } else {
          title = `Upcoming Bill: ${bill.name}`;
          message = `${bill.name} (${amountStr}) is due in ${diff} day${diff === 1 ? '' : 's'} (${utils.formatDateDisplay(bill.dueDate)}).`;
        }

        addCenterNotification(data, { title, message, type: isOverdue ? 'error' : 'warning' });
        pushBrowserNotification(title, message);
        bill.lastNotifiedDate = today;
        created = true;
      }
    });

    return created;
  }

  return {
    isSupported,
    permissionStatus,
    requestPermission,
    pushBrowserNotification,
    addCenterNotification,
    checkBillReminders,
  };
})();
