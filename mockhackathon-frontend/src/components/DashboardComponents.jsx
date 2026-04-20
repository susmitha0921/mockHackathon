import { useState, useEffect } from 'react';
import { api, fmt } from '../api/api';

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
export const Icon = {
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  DollarSign: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  TrendingUp: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  FileText: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Play: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  BarChart2: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  LogOut: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  AlertTriangle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  RefreshCw: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  CreditCard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
};

// ─── Reusable UI Components ───────────────────────────────────────────────────

export const Spinner = ({ size = 20 }) => (
  <div style={{ width: size, height: size, border: '2px solid rgba(255,255,255,0.2)', borderTop: '2px solid currentColor', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
);

export const PageLoader = () => (
  <div className="page-loader">
    <Spinner size={24} />
    <span>Loading...</span>
  </div>
);

export const Alert = ({ type = 'info', children }) => (
  <div className={`alert alert-${type}`}>
    <Icon.AlertTriangle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1 }} />
    <span>{children}</span>
  </div>
);

export const Modal = ({ open, onClose, title, children, size }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal${size === 'lg' ? ' modal-lg' : ''}`}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}><Icon.X /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const map = {
    DRAFT: 'gray', PROCESSING: 'warning', COMPLETED: 'success', CANCELLED: 'danger',
    PENDING: 'warning', PROCESSED: 'success', FAILED: 'danger',
    COMPUTED: 'success', FILED: 'info', ACTIVE: 'success',
    ADMIN: 'purple', HR_MANAGER: 'info', FINANCE: 'warning', EMPLOYEE: 'success',
  };
  return <span className={`badge badge-${map[status] || 'gray'}`}>{status?.replace('_', ' ')}</span>;
};

export const EmptyState = ({ title = 'No data found', subtitle = 'Nothing to display yet.', icon }) => (
  <div className="empty-state">
    {icon || <Icon.FileText style={{ width: 48, height: 48 }} />}
    <h3>{title}</h3>
    <p>{subtitle}</p>
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, icon: Ic, color = 'blue', sub }) => (
  <div className={`stat-card ${color}`}>
    <div className={`stat-icon ${color}`}><Ic style={{ width: 22, height: 22 }} /></div>
    <div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-change up">{sub}</div>}
    </div>
  </div>
);

// ─── Modal Form helpers ───────────────────────────────────────────────────────
export const FormGroup = ({ label, children }) => (
  <div className="form-group">
    <label>{label}</label>
    {children}
  </div>
);

// ─── HR Dashboard Components ──────────────────────────────────────────────────
export const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStructureModal, setShowStructureModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const all = await api.getUsers();
      setEmployees(all.filter(u => u.role === 'EMPLOYEE'));
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
    (e.department || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <div>
          <div className="card-title">Employee Directory</div>
          <div className="card-subtitle">{employees.length} employees registered</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Icon.Plus style={{ width: 16, height: 16 }} /> Add Employee
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <Icon.Search style={{ width: 16, height: 16, position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
        <input style={{ paddingLeft: '2.25rem', marginBottom: 0 }} placeholder="Search employees…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {error && <Alert type="danger">{error}</Alert>}
      {loading ? <PageLoader /> : (
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Name</th><th>Code</th><th>Department</th><th>Joined</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={5}><EmptyState title="No employees" subtitle="Add employees to get started." /></td></tr>}
              {filtered.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>{emp.name[0]}</div>
                      <div>
                        <div className="font-semibold" style={{ fontSize: '0.875rem' }}>{emp.name}</div>
                        <div className="text-muted text-xs">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><code style={{ background: 'var(--surface2)', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.78rem' }}>{emp.employeeCode}</code></td>
                  <td>{emp.department || '—'}</td>
                  <td>{fmt.date(emp.joiningDate)}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedEmployee(emp); setShowStructureModal(true); }}>
                      <Icon.Settings style={{ width: 14, height: 14 }} /> Salary
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddEmployeeModal open={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={load} />
      {selectedEmployee && (
        <SalaryStructureModal open={showStructureModal} onClose={() => setShowStructureModal(false)} employee={selectedEmployee} onSuccess={load} />
      )}
    </div>
  );
};

const AddEmployeeModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '', employeeCode: '', password: 'password123', department: '', role: 'EMPLOYEE', joiningDate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await api.signup(form);
      onSuccess(); onClose();
      setForm({ name: '', email: '', employeeCode: '', password: 'password123', department: '', role: 'EMPLOYEE', joiningDate: '' });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <Modal open={open} onClose={onClose} title="Add New User">
      {error && <Alert type="danger">{error}</Alert>}
      <form onSubmit={submit}>
        <div className="form-grid-2">
          <FormGroup label="Full Name"><input required value={form.name} onChange={f('name')} placeholder="John Doe" /></FormGroup>
          <FormGroup label="Email"><input required type="email" value={form.email} onChange={f('email')} placeholder="john@company.com" /></FormGroup>
          <FormGroup label="Employee Code"><input required value={form.employeeCode} onChange={f('employeeCode')} placeholder="EMP003" /></FormGroup>
          <FormGroup label="Department"><input value={form.department} onChange={f('department')} placeholder="Engineering" /></FormGroup>
          <FormGroup label="Role">
            <select value={form.role} onChange={f('role')}>
              <option value="EMPLOYEE">Employee</option>
              <option value="HR_MANAGER">HR Manager</option>
              <option value="FINANCE">Finance</option>
              <option value="ADMIN">Admin</option>
            </select>
          </FormGroup>
          <FormGroup label="Joining Date"><input type="date" value={form.joiningDate} onChange={f('joiningDate')} /></FormGroup>
        </div>
        <FormGroup label="Password"><input required type="password" value={form.password} onChange={f('password')} /></FormGroup>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <Spinner /> : 'Create User'}</button>
        </div>
      </form>
    </Modal>
  );
};

const SalaryStructureModal = ({ open, onClose, employee, onSuccess }) => {
  const [existing, setExisting] = useState(null);
  const [form, setForm] = useState({ basicSalary: '', hra: '', da: '', specialAllowance: '', bonus: '', lta: '', effectiveFrom: '', effectiveTo: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (open && employee) {
      api.getSalaryStructureByEmployee(employee.id).then(s => {
        setExisting(s);
        setForm({ basicSalary: s.basicSalary || '', hra: s.hra || '', da: s.da || '', specialAllowance: s.specialAllowance || '', bonus: s.bonus || '', lta: s.lta || '', effectiveFrom: s.effectiveFrom || '', effectiveTo: s.effectiveTo || '' });
      }).catch(() => setExisting(null));
    }
  }, [open, employee]);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError(''); setSuccess('');
    try {
      await api.createSalaryStructure({ ...form, employeeId: employee.id });
      setSuccess('Salary structure saved!');
      onSuccess();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <Modal open={open} onClose={onClose} title={`Salary Structure — ${employee?.name}`}>
      {error && <Alert type="danger">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}
      <form onSubmit={submit}>
        <div className="form-grid-2">
          <FormGroup label="Basic Salary (min ₹15,000)"><input required type="number" value={form.basicSalary} onChange={f('basicSalary')} min="15000" placeholder="30000" /></FormGroup>
          <FormGroup label="HRA"><input type="number" value={form.hra} onChange={f('hra')} placeholder="15000" /></FormGroup>
          <FormGroup label="DA (Dearness Allowance)"><input type="number" value={form.da} onChange={f('da')} placeholder="5000" /></FormGroup>
          <FormGroup label="Special Allowance"><input type="number" value={form.specialAllowance} onChange={f('specialAllowance')} placeholder="10000" /></FormGroup>
          <FormGroup label="Bonus (Annual)"><input type="number" value={form.bonus} onChange={f('bonus')} placeholder="0" /></FormGroup>
          <FormGroup label="LTA"><input type="number" value={form.lta} onChange={f('lta')} placeholder="0" /></FormGroup>
          <FormGroup label="Effective From"><input type="date" value={form.effectiveFrom} onChange={f('effectiveFrom')} /></FormGroup>
          <FormGroup label="Effective To"><input type="date" value={form.effectiveTo} onChange={f('effectiveTo')} /></FormGroup>
        </div>
        {form.basicSalary && (
          <div className="highlight-box mb-4 text-sm">
            <strong>Calculated Gross:</strong> {fmt.currency(
              (parseFloat(form.basicSalary) || 0) + (parseFloat(form.hra) || 0) + (parseFloat(form.da) || 0) +
              (parseFloat(form.specialAllowance) || 0) + ((parseFloat(form.bonus) || 0) / 12)
            )} / month
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <Spinner /> : existing ? 'Update Structure' : 'Save Structure'}</button>
        </div>
      </form>
    </Modal>
  );
};

export const SalaryStructureList = () => {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dept, setDept] = useState('');

  const load = async () => {
    setLoading(true);
    try { setStructures(await api.getSalaryStructures(dept || undefined)); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [dept]);

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <div><div className="card-title">Salary Structures</div><div className="card-subtitle">All employee compensation packages</div></div>
        <input style={{ width: 200, marginBottom: 0 }} placeholder="Filter by dept…" value={dept} onChange={e => setDept(e.target.value)} />
      </div>
      {loading ? <PageLoader /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Employee</th><th>Basic</th><th>HRA</th><th>DA</th><th>Special Allowance</th><th>Gross/Mo</th><th>From</th></tr></thead>
            <tbody>
              {structures.length === 0 && <tr><td colSpan={7}><EmptyState title="No salary structures" subtitle="Assign salary structures to employees first." /></td></tr>}
              {structures.map(s => {
                const gross = (parseFloat(s.basicSalary) || 0) + (parseFloat(s.hra) || 0) + (parseFloat(s.da) || 0) + (parseFloat(s.specialAllowance) || 0) + ((parseFloat(s.bonus) || 0) / 12);
                return (
                  <tr key={s.id}>
                    <td><div className="font-semibold">{s.employeeName}</div><div className="text-muted text-xs">{s.employeeCode}</div></td>
                    <td>{fmt.currency(s.basicSalary)}</td>
                    <td>{fmt.currency(s.hra)}</td>
                    <td>{fmt.currency(s.da)}</td>
                    <td>{fmt.currency(s.specialAllowance)}</td>
                    <td className="font-bold text-success">{fmt.currency(gross)}</td>
                    <td>{fmt.date(s.effectiveFrom)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ─── Finance: Payroll Cycle Management ───────────────────────────────────────
export const PayrollCyclePanel = () => {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [processing, setProcessing] = useState(null);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try { setCycles(await api.getPayrollCycles()); } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleProcess = async (cycle) => {
    if (!confirm(`Process payroll cycle for ${cycle.month} ${cycle.year}? This will calculate salaries for all employees.`)) return;
    setProcessing(cycle.id);
    try {
      await api.processCycle(cycle.id);
      await load();
    } catch (e) { alert('Error: ' + e.message); }
    finally { setProcessing(null); }
  };

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <div><div className="card-title">Payroll Cycles</div><div className="card-subtitle">Manage monthly payroll processing</div></div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Icon.Plus style={{ width: 16, height: 16 }} /> Create Cycle</button>
      </div>
      {loading ? <PageLoader /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Month/Year</th><th>Status</th><th>Payment Date</th><th>Processed At</th><th>Actions</th></tr></thead>
            <tbody>
              {cycles.length === 0 && <tr><td colSpan={5}><EmptyState title="No payroll cycles" subtitle="Create your first payroll cycle." /></td></tr>}
              {cycles.map(c => (
                <tr key={c.id}>
                  <td><div className="font-bold">{c.month} {c.year}</div></td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>{fmt.date(c.paymentDate)}</td>
                  <td>{fmt.datetime(c.processedAt)}</td>
                  <td className="flex gap-2">
                    {c.status === 'DRAFT' && (
                      <button className="btn btn-success btn-sm" disabled={processing === c.id} onClick={() => handleProcess(c)}>
                        {processing === c.id ? <Spinner size={14} /> : <><Icon.Play style={{ width: 14, height: 14 }} /> Process</>}
                      </button>
                    )}
                    {c.status === 'COMPLETED' && (
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelected(c)}>
                        <Icon.Eye style={{ width: 14, height: 14 }} /> View Payrolls
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateCycleModal open={showCreate} onClose={() => setShowCreate(false)} onSuccess={load} />
      {selected && <CyclePayrollsModal cycle={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

const CreateCycleModal = ({ open, onClose, onSuccess }) => {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const currentMonth = months[new Date().getMonth()];
  const [form, setForm] = useState({ month: currentMonth, year: new Date().getFullYear(), paymentDate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await api.createPayrollCycle(form); onSuccess(); onClose(); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <Modal open={open} onClose={onClose} title="Create Payroll Cycle">
      {error && <Alert type="danger">{error}</Alert>}
      <form onSubmit={submit}>
        <div className="form-grid-2">
          <FormGroup label="Month">
            <select value={form.month} onChange={f('month')}>
              {months.map(m => <option key={m}>{m}</option>)}
            </select>
          </FormGroup>
          <FormGroup label="Year"><input required type="number" value={form.year} onChange={f('year')} min="2020" max="2030" /></FormGroup>
        </div>
        <FormGroup label="Payment Date"><input type="date" value={form.paymentDate} onChange={f('paymentDate')} /></FormGroup>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <Spinner /> : 'Create Cycle'}</button>
        </div>
      </form>
    </Modal>
  );
};

const CyclePayrollsModal = ({ cycle, onClose }) => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    api.getPayrollsByCycle(cycle.id).then(setPayrolls).catch(console.error).finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [cycle.id]);

  const handlePayAll = async () => {
    if (!confirm('Disburse salaries? This marks all pending records as paid.')) return;
    setPaying(true);
    try {
      await api.payCycle(cycle.id);
      load();
    } catch (e) { alert('Error: ' + e.message); }
    finally { setPaying(false); }
  };

  const totalGross = payrolls.reduce((s, p) => s + parseFloat(p.grossEarnings || 0), 0);
  const totalNet = payrolls.reduce((s, p) => s + parseFloat(p.netSalary || 0), 0);
  const hasPending = payrolls.some(p => p.payoutStatus === 'PENDING');

  return (
    <Modal open size="lg" onClose={onClose} title={`Payrolls — ${cycle.month} ${cycle.year}`}>
      {loading ? <PageLoader /> : (
        <>
          <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
            <div className="grid grid-2" style={{ flex: 1, gap: '1rem' }}>
              <div className="highlight-box"><div className="text-muted text-xs mb-1">Total Gross</div><div className="font-bold text-lg">{fmt.currency(totalGross)}</div></div>
              <div className="highlight-box"><div className="text-muted text-xs mb-1">Total Net Disbursed</div><div className="font-bold text-lg text-success">{fmt.currency(totalNet)}</div></div>
            </div>
            {hasPending && (
              <button className="btn btn-success" style={{ marginLeft: '1rem' }} onClick={handlePayAll} disabled={paying}>
                {paying ? <Spinner size={14}/> : <><Icon.Check style={{ width: 14, height: 14 }}/> Disburse Payments</>}
              </button>
            )}
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Employee</th><th>Gross</th><th>Deductions</th><th>Net Salary</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {payrolls.map(p => (
                  <tr key={p.id}>
                    <td><div className="font-semibold">{p.employeeName}</div><div className="text-muted text-xs">{p.employeeCode}</div></td>
                    <td>{fmt.currency(p.grossEarnings)}</td>
                    <td className="text-danger">-{fmt.currency(p.totalDeductions)}</td>
                    <td className="font-bold text-success">{fmt.currency(p.netSalary)}</td>
                    <td><StatusBadge status={p.payoutStatus} /></td>
                    <td><button className="btn btn-ghost btn-sm" onClick={() => setSelected(p)}><Icon.Eye style={{ width: 14, height: 14 }} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selected && <PayslipModal payroll={selected} onClose={() => setSelected(null)} />}
        </>
      )}
    </Modal>
  );
};

// ─── Payslip Modal ────────────────────────────────────────────────────────────
export const PayslipModal = ({ payroll, onClose }) => {
  const [breakup, setBreakup] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPayrollBreakup(payroll.id).then(setBreakup).catch(console.error).finally(() => setLoading(false));
  }, [payroll.id]);

  const earnings = breakup.filter(b => b.componentType === 'EARNING');
  const deductions = breakup.filter(b => b.componentType === 'DEDUCTION');

  const printPayslip = () => window.print();

  return (
    <Modal open size="lg" onClose={onClose} title="Payslip">
      {loading ? <PageLoader /> : (
        <div className="payslip" id="payslip-print">
          <div className="payslip-header">
            <h2 style={{ margin: 0 }} className="gradient-text">PayRoll &amp; Tax System</h2>
            <p className="text-muted text-sm mt-1">Salary Slip for {payroll.payrollMonth} {payroll.payrollYear}</p>
          </div>

          <div className="form-grid-2" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <div><span className="text-muted">Employee Name:</span> <strong>{payroll.employeeName}</strong></div>
            <div><span className="text-muted">Employee Code:</span> <strong>{payroll.employeeCode}</strong></div>
            <div><span className="text-muted">Department:</span> <strong>{payroll.department || '—'}</strong></div>
            <div><span className="text-muted">Pay Period:</span> <strong>{payroll.payrollMonth} {payroll.payrollYear}</strong></div>
          </div>

          <div className="form-grid-2">
            <div>
              <div className="font-semibold mb-2 text-success">Earnings</div>
              {earnings.map(e => (
                <div key={e.id} className="payslip-row earning">
                  <span>{e.componentName}</span>
                  <span>{fmt.currency(e.amount)}</span>
                </div>
              ))}
              <div className="payslip-row total">
                <span>Total Earnings</span>
                <span>{fmt.currency(payroll.grossEarnings)}</span>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-2 text-danger">Deductions</div>
              {deductions.map(d => (
                <div key={d.id} className="payslip-row deduction">
                  <span>{d.componentName}</span>
                  <span>-{fmt.currency(d.amount)}</span>
                </div>
              ))}
              <div className="payslip-row total">
                <span>Total Deductions</span>
                <span>-{fmt.currency(payroll.totalDeductions)}</span>
              </div>
            </div>
          </div>

          <div className="payslip-net">
            <div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>Net Salary (Take Home)</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{fmt.currency(payroll.netSalary)}</div>
            </div>
            <StatusBadge status={payroll.payoutStatus} />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button className="btn btn-ghost" onClick={onClose}>Close</button>
            <button className="btn btn-primary" onClick={printPayslip}><Icon.Download style={{ width: 16, height: 16 }} /> Download PDF</button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// ─── Employee Payslip Viewer ──────────────────────────────────────────────────
export const MyPayslips = ({ employeeId }) => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.getPayrollsByEmployee(employeeId).then(setPayrolls).catch(console.error).finally(() => setLoading(false));
  }, [employeeId]);

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <div><div className="card-title">My Payslips</div><div className="card-subtitle">{payrolls.length} payslips available</div></div>
      </div>
      {payrolls.length === 0 ? (
        <EmptyState title="No payslips yet" subtitle="Your payslips will appear here after payroll processing." />
      ) : (
        <div className="grid grid-2">
          {payrolls.map(p => (
            <div key={p.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(p)}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold">{p.payrollMonth} {p.payrollYear}</div>
                  <div className="text-muted text-sm mt-1">Net: <span className="text-success font-bold">{fmt.currency(p.netSalary)}</span></div>
                </div>
                <StatusBadge status={p.payoutStatus} />
              </div>
              <div className="divider" />
              <div className="flex gap-4 text-sm">
                <div><div className="text-muted" style={{ fontSize: '0.7rem' }}>GROSS</div><div className="font-semibold">{fmt.currency(p.grossEarnings)}</div></div>
                <div><div className="text-muted" style={{ fontSize: '0.7rem' }}>DEDUCTIONS</div><div className="font-semibold text-danger">-{fmt.currency(p.totalDeductions)}</div></div>
              </div>
              <div className="mt-4 text-xs text-primary font-semibold flex items-center gap-1"><Icon.Eye style={{ width: 12, height: 12 }} /> View Payslip</div>
            </div>
          ))}
        </div>
      )}

      {selected && <PayslipModal payroll={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

// ─── Tax View ─────────────────────────────────────────────────────────────────
export const TaxView = ({ employeeId }) => {
  const year = new Date().getFullYear().toString();
  const [tax, setTax] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inputYear, setInputYear] = useState(year);

  const load = async (y) => {
    setLoading(true);
    try { setTax(await api.getTaxByEmployee(employeeId, y)); }
    catch { setTax(null); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(inputYear); }, [employeeId]);

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <div><div className="card-title">Tax Statement</div><div className="card-subtitle">Annual tax computation (Form 16)</div></div>
        <div className="flex gap-2 items-center">
          <input style={{ width: 120, marginBottom: 0 }} type="number" value={inputYear} onChange={e => setInputYear(e.target.value)} />
          <button className="btn btn-ghost btn-sm" onClick={() => load(inputYear)}><Icon.RefreshCw style={{ width: 14, height: 14 }} /></button>
        </div>
      </div>
      {loading ? <PageLoader /> : !tax ? (
        <EmptyState title="No tax data" subtitle={`No tax computation found for ${inputYear}. Tax is computed when payroll is processed.`} />
      ) : (
        <div className="grid grid-2">
          <div>
            <div className="font-semibold mb-3">Income Details</div>
            {[
              ['Financial Year', tax.financialYear],
              ['Total Annual Income', fmt.currency(tax.totalIncome)],
              ['80C Deductions', fmt.currency(tax.totalDeductionsUnder80C)],
              ['Taxable Income', fmt.currency(tax.taxableIncome)],
            ].map(([k, v]) => (
              <div key={k} className="payslip-row">
                <span className="text-muted">{k}</span><span className="font-semibold">{v}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="font-semibold mb-3">Tax Computation</div>
            {[
              ['Tax Payable', fmt.currency(tax.taxPayable)],
              ['Cess (4%)', fmt.currency(tax.cess)],
              ['Total Tax', fmt.currency(tax.totalTax)],
              ['TDS Deducted to Date', fmt.currency(tax.tdsDeducted)],
            ].map(([k, v]) => (
              <div key={k} className="payslip-row">
                <span className="text-muted">{k}</span><span className="font-semibold">{v}</span>
              </div>
            ))}
            <div className="mt-4">
              <StatusBadge status={tax.taxStatus} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Admin Overview ───────────────────────────────────────────────────────────
export const AdminOverview = () => {
  const [users, setUsers] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [u, c] = await Promise.all([api.getUsers(), api.getPayrollCycles()]);
      setUsers(u); setCycles(c);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSeed = async () => {
    if (!confirm('This will reset all users and seed demo data. Continue?')) return;
    setSeeding(true); setSeedMsg('');
    try {
      const msg = await api.seed();
      setSeedMsg(typeof msg === 'string' ? msg : 'Seed successful!');
      load();
    } catch (e) { setSeedMsg('Error: ' + e.message); }
    finally { setSeeding(false); }
  };

  const employees = users.filter(u => u.role === 'EMPLOYEE');
  const completed = cycles.filter(c => c.status === 'COMPLETED').length;

  return (
    <div>
      {loading ? <PageLoader /> : (
        <>
          <div className="grid grid-4 mb-6">
            <StatCard label="Total Employees" value={employees.length} icon={Icon.Users} color="blue" />
            <StatCard label="Total Users" value={users.length} icon={Icon.Shield} color="purple" />
            <StatCard label="Payroll Cycles" value={cycles.length} icon={Icon.CreditCard} color="green" />
            <StatCard label="Completed Cycles" value={completed} icon={Icon.Check} color="orange" />
          </div>

          {seedMsg && <Alert type="success">{seedMsg}</Alert>}

          <div className="grid grid-2">
            <div className="card">
              <div className="card-header"><div className="card-title">All Users</div></div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Name</th><th>Code</th><th>Role</th><th>Dept</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td><code style={{ fontSize: '0.75rem' }}>{u.employeeCode}</code></td>
                        <td><StatusBadge status={u.role} /></td>
                        <td>{u.department || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><div className="card-title">Payroll Cycle History</div></div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Period</th><th>Status</th><th>Processed</th></tr></thead>
                  <tbody>
                    {cycles.length === 0 && <tr><td colSpan={3}><EmptyState title="No cycles yet" subtitle="" /></td></tr>}
                    {cycles.map(c => (
                      <tr key={c.id}>
                        <td className="font-bold">{c.month} {c.year}</td>
                        <td><StatusBadge status={c.status} /></td>
                        <td>{fmt.datetime(c.processedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <button className="btn btn-ghost btn-sm" onClick={handleSeed} disabled={seeding}>
                  {seeding ? <Spinner size={14} /> : <Icon.RefreshCw style={{ width: 14, height: 14 }} />}
                  {seeding ? ' Seeding…' : ' Reset & Seed Demo Data'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default {};
