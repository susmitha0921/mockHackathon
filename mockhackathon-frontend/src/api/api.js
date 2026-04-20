const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const getToken = () => {
  const u = localStorage.getItem('payroll_user');
  return u ? JSON.parse(u).token : null;
};

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

const request = async (method, path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const e = await res.json(); msg = e.message || e.error || msg; } catch {}
    throw new Error(msg);
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') return null;
  return res.json().catch(() => null);
};

export const api = {
  // Auth
  login: (body) => request('POST', '/api/users/login', body),
  signup: (body) => request('POST', '/api/users', body),

  // Users
  getUsers: (role) => request('GET', `/api/users${role ? `?role=${role}` : ''}`),
  getUser: (id) => request('GET', `/api/users/${id}`),

  // Salary Structures
  createSalaryStructure: (body) => request('POST', '/api/salary-structures', body),
  getSalaryStructures: (dept) => request('GET', `/api/salary-structures${dept ? `?department=${dept}` : ''}`),
  getSalaryStructureByEmployee: (id) => request('GET', `/api/salary-structures/employee/${id}`),

  // Payroll Cycles
  createPayrollCycle: (body) => request('POST', '/api/payroll-cycles', body),
  getPayrollCycles: (status) => request('GET', `/api/payroll-cycles${status ? `?status=${status}` : ''}`),
  getPayrollCycle: (id) => request('GET', `/api/payroll-cycles/${id}`),
  processCycle: (id) => request('PUT', `/api/payroll-cycles/${id}/process`),

  // Employee Payrolls
  getPayrollsByCycle: (cycleId) => request('GET', `/api/employee-payrolls/cycle/${cycleId}`),
  getPayrollsByEmployee: (empId) => request('GET', `/api/employee-payrolls/employee/${empId}`),
  getPayrollBreakup: (id) => request('GET', `/api/employee-payrolls/${id}/breakup`),
  payCycle: (cycleId) => request('PUT', `/api/employee-payrolls/cycle/${cycleId}/pay-all`),

  // Tax
  getTaxByEmployee: (empId, year) => request('GET', `/api/tax/employee/${empId}?financialYear=${year}`),
  getTaxByYear: (year) => request('GET', `/api/tax/financial-year?year=${year}`),

  // Seed
  seed: () => request('POST', '/api/seed'),
};

export const fmt = {
  currency: (v) => v == null ? '—' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v),
  date: (v) => v ? new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
  datetime: (v) => v ? new Date(v).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—',
};
