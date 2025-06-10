document.addEventListener('DOMContentLoaded', () => {
  const fieldMappings = [
    {
      ids: ['officerName', 'employeeName'],
      keys: ['officerName', 'employeeName']
    },
    {
      ids: ['serialNumber', 'serialNo', 'officerBadge'],
      keys: ['serialNo', 'officerBadge']
    },
    {
      ids: ['officerRank'],
      keys: ['officerRank']
    }
  ];

  fieldMappings.forEach(({ ids, keys }) => {
    const primaryId = ids[0];
    const input = document.getElementById(primaryId);
    if (!input) return;

    // Set the field value from the first available key
    for (let key of keys) {
      const value = localStorage.getItem(key);
      if (value) {
        input.value = value;
        break;
      }
    }

    // Update all related keys on input
    input.addEventListener('input', () => {
      const val = input.value.trim();
      keys.forEach(key => localStorage.setItem(key, val));
    });
  });
});
