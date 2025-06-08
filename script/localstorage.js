document.addEventListener('DOMContentLoaded', () => {
  const fields = [
    { id: 'employeeName', key: 'employeeName' },
    { id: 'departmentRank', key: 'departmentRank' },
    { id: 'employeeRank', key: 'employeeRank' },
    { id: 'officerName', key: 'officerName' },
    { id: 'serialNo', key: 'serialNo' },
    { id: 'officerRank', key: 'officerRank' },
    { id: 'officerBadge', key: 'officerBadge' }
  ];

  fields.forEach(({ id, key }) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.value = localStorage.getItem(key) || '';

    el.addEventListener('input', () => {
      localStorage.setItem(key, el.value.trim());
    });
  });
});