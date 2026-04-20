import { useState, useEffect } from 'react';
import { api, fmt } from './api/api';
import {
  Icon, Spinner, Alert, Modal, StatusBadge, StatCard, FormGroup,
  EmployeeList, SalaryStructureList, PayrollCyclePanel,
  MyPayslips, TaxView, AdminOverview, PageLoader, EmptyState,
} from './components/DashboardComponents';
import './index.css';

/* ──────────────────────────────────────────────────────────────
   LOGIN
   ────────────────────────────────────────────────────────────── */
const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ employeeCode: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');
  const [showSignup, setShowSignup] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { onLogin(await api.login(form)); }
    catch { setError('Invalid Employee ID or Password. Seed demo data first if new.'); }
    finally { setLoading(false); }
  };

  const runSeed = async () => {
    setSeeding(true); setSeedMsg('');
    try {
      await api.seed();
      setSeedMsg('✓ Demo data seeded! Use the quick-login buttons below.');
    } catch (e) { setSeedMsg('Error: ' + e.message); }
    finally { setSeeding(false); }
  };

  const demos = [
    { label: 'HR Manager', code: 'HR001', color: '#0ea5e9' },
    { label: 'Finance',    code: 'FIN001', color: '#f59e0b' },
    { label: 'Employee',   code: 'EMP001', color: '#059669' },
    { label: 'Admin',      code: 'ADM001', color: '#7c3aed' },
  ];

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="auth-page">
      <div className="auth-card animate-slide">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Icon.BarChart2 style={{ width: 22, height: 22, color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.2rem' }}>
            <span className="gradient-text">CorePayroll</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '0.78rem' }}>Corporate Payroll &amp; Tax Deduction System</p>
        </div>



        {error && <Alert type="danger">{error}</Alert>}

        <form onSubmit={submit}>
          <FormGroup label="Employee ID">
            <input required value={form.employeeCode} onChange={f('employeeCode')} placeholder="e.g. EMP001" />
          </FormGroup>
          <FormGroup label="Password">
            <input required type="password" value={form.password} onChange={f('password')} placeholder="••••••••" />
          </FormGroup>
          <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '0.25rem' }} disabled={loading}>
            {loading ? <><Spinner size={14} /> Authenticating…</> : 'Sign In'}
          </button>
        </form>

        {/* Quick Login */}
        <div style={{ marginTop: '1.25rem' }}>
          <p className="text-muted text-xs text-center mb-2">Quick login (all passwords: <code>password123</code>)</p>
          <div className="grid-2 grid" style={{ gap: '0.4rem' }}>
            {demos.map(d => (
              <button key={d.code} className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', fontSize: '0.75rem' }}
                onClick={() => setForm({ employeeCode: d.code, password: 'password123' })}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                {d.label} · {d.code}
              </button>
            ))}
          </div>
        </div>

        <div className="divider" />
        <div className="flex justify-between items-center text-xs text-muted" style={{ padding: '0 0.25rem' }}>
          <div>
            First time?{' '}
            <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '0.1rem 0.35rem', fontSize: '0.7rem', display: 'inline-flex' }} onClick={runSeed} disabled={seeding}>
              {seeding ? 'Seeding...' : 'Load demo data'}
            </button>
          </div>
          <div>
            New user?{' '}
            <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '0.1rem 0.35rem', fontSize: '0.7rem', display: 'inline-flex' }} onClick={() => setShowSignup(true)}>
              Create account
            </button>
          </div>
        </div>
        {seedMsg && (
          <div className="text-center mt-2" style={{ fontSize: '0.7rem', color: seedMsg.startsWith('✓') ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
            {seedMsg}
          </div>
        )}
      </div>

      <SignupModal open={showSignup} onClose={() => setShowSignup(false)} />
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────
   SIGNUP MODAL
   ────────────────────────────────────────────────────────────── */
const SignupModal = ({ open, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', employeeCode: '', password: '', department: '', role: 'EMPLOYEE' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError(''); setSuccess('');
    try { await api.signup(form); setSuccess('Account created! You can now log in.'); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <Modal open={open} onClose={onClose} title="Create Account">
      {error && <Alert type="danger">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}
      <form onSubmit={submit}>
        <div className="form-grid-2">
          <FormGroup label="Full Name"><input required value={form.name} onChange={f('name')} placeholder="John Doe" /></FormGroup>
          <FormGroup label="Email"><input required type="email" value={form.email} onChange={f('email')} placeholder="john@company.com" /></FormGroup>
          <FormGroup label="Employee Code"><input required value={form.employeeCode} onChange={f('employeeCode')} placeholder="EMP003" /></FormGroup>
          <FormGroup label="Department"><input value={form.department} onChange={f('department')} placeholder="Engineering" /></FormGroup>
        </div>
        <FormGroup label="Password"><input required type="password" value={form.password} onChange={f('password')} /></FormGroup>
        <FormGroup label="Role">
          <select value={form.role} onChange={f('role')}>
            <option value="EMPLOYEE">Employee</option>
            <option value="HR_MANAGER">HR Manager</option>
            <option value="FINANCE">Finance</option>
            <option value="ADMIN">Admin</option>
          </select>
        </FormGroup>
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <Spinner /> : 'Create Account'}</button>
        </div>
      </form>
    </Modal>
  );
};

/* ──────────────────────────────────────────────────────────────
   SIDEBAR
   ────────────────────────────────────────────────────────────── */
const navByRole = {
  HR_MANAGER: [
    { id: 'overview',        label: 'Overview',          icon: Icon.Home },
    { id: 'employees',       label: 'Employees',         icon: Icon.Users },
    { id: 'salaryStructures',label: 'Salary Structures', icon: Icon.DollarSign },
  ],
  FINANCE: [
    { id: 'overview',     label: 'Overview',       icon: Icon.Home },
    { id: 'payrollCycles',label: 'Payroll Cycles', icon: Icon.CreditCard },
    { id: 'taxYear',      label: 'Tax Reports',    icon: Icon.FileText },
  ],
  EMPLOYEE: [
    { id: 'overview',   label: 'Overview',       icon: Icon.Home },
    { id: 'myPayslips', label: 'My Payslips',    icon: Icon.FileText },
    { id: 'myTax',      label: 'Tax Statement',  icon: Icon.Shield },
    { id: 'mySalary',   label: 'Salary Info',    icon: Icon.DollarSign },
  ],
  ADMIN: [
    { id: 'overview',  label: 'System Overview', icon: Icon.BarChart2 },
    { id: 'allUsers',  label: 'All Users',        icon: Icon.Users },
    { id: 'allCycles', label: 'Payroll Cycles',   icon: Icon.CreditCard },
    { id: 'allTax',    label: 'Tax Reports',      icon: Icon.FileText },
  ],
};

const roleColor = { HR_MANAGER: '#0ea5e9', FINANCE: '#f59e0b', EMPLOYEE: '#059669', ADMIN: '#7c3aed' };

const Sidebar = ({ user, activeTab, setActiveTab }) => {
  const items = navByRole[user.role] || [];
  const initials = user.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon-wrap">
          <Icon.BarChart2 style={{ width: 14, height: 14, color: '#fff' }} />
        </div>
        <div>
          <h2>CorePayroll</h2>
          <span>Payroll &amp; Tax System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Menu</div>
        {items.map(item => (
          <button key={item.id}
            className={`nav-item${activeTab === item.id ? ' active' : ''}`}
            onClick={() => setActiveTab(item.id)}>
            <item.icon style={{ width: 15, height: 15 }} className="nav-icon" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="avatar" style={{ background: `linear-gradient(135deg,${roleColor[user.role] || '#4f46e5'},#7c3aed)` }}>
            {initials}
          </div>
          <div className="user-chip-info">
            <div className="user-chip-name">{user.name}</div>
            <div className="user-chip-role">{user.role?.replace('_', ' ')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────
   ROLE-SPECIFIC OVERVIEW PAGES
   ────────────────────────────────────────────────────────────── */
const HROverview = () => {
  const [employees, setEmployees] = useState([]);
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getUsers('EMPLOYEE'), api.getSalaryStructures()])
      .then(([e, s]) => { setEmployees(e); setStructures(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  const depts = [...new Set(employees.map(e => e.department).filter(Boolean))];

  return (
    <>
      <div className="grid grid-4 mb-4">
        <StatCard label="Total Employees"    value={employees.length}              icon={Icon.Users}      color="blue" />
        <StatCard label="With Salary Setup"  value={structures.length}             icon={Icon.DollarSign} color="green" />
        <StatCard label="Pending Setup"      value={Math.max(0,employees.length-structures.length)} icon={Icon.AlertTriangle} color="orange" />
        <StatCard label="Departments"        value={depts.length}                  icon={Icon.BarChart2}  color="purple" />
      </div>
      <div className="card">
        <div className="card-title mb-4">Employee Directory</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Code</th><th>Department</th><th>Joined</th><th>Salary</th></tr></thead>
            <tbody>
              {employees.map(e => (
                <tr key={e.id}>
                  <td><div className="font-semibold">{e.name}</div><div className="text-muted text-xs">{e.email}</div></td>
                  <td><code style={{ background:'var(--surface2)', padding:'0.15rem 0.4rem', borderRadius:4, fontSize:'0.72rem' }}>{e.employeeCode}</code></td>
                  <td>{e.department || '—'}</td>
                  <td>{fmt.date(e.joiningDate)}</td>
                  <td><StatusBadge status={structures.some(s=>s.employeeId===e.id)?'COMPLETED':'PENDING'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const FinanceOverview = () => {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.getPayrollCycles().then(setCycles).catch(()=>{}).finally(()=>setLoading(false)); }, []);

  if (loading) return <PageLoader />;
  const completed = cycles.filter(c=>c.status==='COMPLETED').length;

  return (
    <>
      <div className="grid grid-3 mb-4">
        <StatCard label="Total Cycles" value={cycles.length}                 icon={Icon.CreditCard}   color="blue" />
        <StatCard label="Completed"    value={completed}                     icon={Icon.Check}        color="green" />
        <StatCard label="Draft"        value={cycles.filter(c=>c.status==='DRAFT').length} icon={Icon.AlertTriangle} color="orange" />
      </div>
      <div className="card">
        <div className="card-title mb-4">Payroll Cycle Summary</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Period</th><th>Status</th><th>Payment Date</th><th>Processed At</th></tr></thead>
            <tbody>
              {cycles.length===0 && <tr><td colSpan={4}><EmptyState title="No cycles" subtitle="Create the first payroll cycle." /></td></tr>}
              {cycles.map(c=>(
                <tr key={c.id}>
                  <td className="font-bold">{c.month} {c.year}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>{fmt.date(c.paymentDate)}</td>
                  <td>{fmt.datetime(c.processedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const EmployeeOverview = ({ user }) => {
  const [payrolls, setPayrolls] = useState([]);
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const uid = user.id || user.employeeId;

  useEffect(() => {
    Promise.all([
      api.getPayrollsByEmployee(uid),
      api.getSalaryStructureByEmployee(uid),
    ]).then(([p,s])=>{ setPayrolls(p); setSalary(s); }).catch(()=>{}).finally(()=>setLoading(false));
  }, [uid]);

  if (loading) return <PageLoader />;
  const latest = [...payrolls].reverse()[0];
  const totalNet = payrolls.reduce((s,p)=>s+parseFloat(p.netSalary||0),0);

  return (
    <>
      <div className="grid grid-3 mb-4">
        <StatCard label="Latest Net Salary"  value={latest?fmt.currency(latest.netSalary):'—'} icon={Icon.DollarSign} color="green" />
        <StatCard label="Payslips Available" value={payrolls.length}                            icon={Icon.FileText}   color="blue" />
        <StatCard label="YTD Net Earnings"   value={fmt.currency(totalNet)}                     icon={Icon.TrendingUp} color="purple" />
      </div>
      <div className="grid grid-2">
        {salary && (
          <div className="card">
            <div className="card-title mb-4">Current Salary Structure</div>
            {[['Basic Salary',fmt.currency(salary.basicSalary)],['HRA',fmt.currency(salary.hra)],['DA',fmt.currency(salary.da)],['Special Allowance',fmt.currency(salary.specialAllowance)],['Annual Bonus',fmt.currency(salary.bonus)]].map(([k,v])=>(
              <div key={k} className="payslip-row"><span className="text-muted">{k}</span><span className="font-semibold">{v}</span></div>
            ))}
            <div className="payslip-row total">
              <span>Monthly Gross</span>
              <span className="text-success">{fmt.currency((parseFloat(salary.basicSalary)||0)+(parseFloat(salary.hra)||0)+(parseFloat(salary.da)||0)+(parseFloat(salary.specialAllowance)||0)+((parseFloat(salary.bonus)||0)/12))}</span>
            </div>
          </div>
        )}
        <div className="card">
          <div className="card-title mb-4">Recent Payslips</div>
          {payrolls.length===0?<EmptyState title="No payslips yet" subtitle="Payslips will appear after payroll processing." />:(
            [...payrolls].reverse().slice(0,5).map(p=>(
              <div key={p.id} className="payslip-row">
                <span className="font-semibold">{p.payrollMonth} {p.payrollYear}</span>
                <div className="flex items-center gap-2"><span className="text-success font-bold">{fmt.currency(p.netSalary)}</span><StatusBadge status={p.payoutStatus} /></div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

const MySalaryInfo = ({ user }) => {
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const uid = user.id || user.employeeId;

  useEffect(()=>{
    api.getSalaryStructureByEmployee(uid).then(setSalary).catch(()=>setSalary(null)).finally(()=>setLoading(false));
  },[uid]);

  if (loading) return <PageLoader />;
  if (!salary) return <EmptyState title="No salary structure" subtitle="Your HR team hasn't configured your salary yet." />;

  const gross=(parseFloat(salary.basicSalary)||0)+(parseFloat(salary.hra)||0)+(parseFloat(salary.da)||0)+(parseFloat(salary.specialAllowance)||0)+((parseFloat(salary.bonus)||0)/12);

  return (
    <div className="grid grid-2">
      <div className="card">
        <div className="card-title mb-4">Salary Components</div>
        {[{label:'Basic Salary',value:salary.basicSalary},{label:'HRA',value:salary.hra},{label:'DA',value:salary.da},{label:'Special Allowance',value:salary.specialAllowance}].filter(c=>c.value).map(c=>{
          const pct=Math.round(((parseFloat(c.value)||0)/gross)*100);
          return(
            <div key={c.label} style={{marginBottom:'0.85rem'}}>
              <div className="flex justify-between items-center mb-1"><span className="text-sm font-semibold">{c.label}</span><span className="text-sm font-bold">{fmt.currency(c.value)}</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{width:`${pct}%`}} /></div>
              <div className="text-xs text-muted mt-1">{pct}% of gross</div>
            </div>
          );
        })}
      </div>
      <div className="card">
        <div className="card-title mb-4">Summary</div>
        <div className="payslip-net" style={{marginBottom:'1rem'}}>
          <div>
            <div style={{color:'rgba(255,255,255,0.75)',fontSize:'0.7rem'}}>Estimated Monthly Gross</div>
            <div style={{fontSize:'1.5rem',fontWeight:800,color:'#fff'}}>{fmt.currency(gross)}</div>
          </div>
        </div>
        {[['Annual Bonus',fmt.currency(salary.bonus)],['LTA',fmt.currency(salary.lta)],['Effective From',fmt.date(salary.effectiveFrom)],['Effective To',fmt.date(salary.effectiveTo)]].map(([k,v])=>(
          <div key={k} className="payslip-row"><span className="text-muted">{k}</span><span className="font-semibold">{v}</span></div>
        ))}
        <div className="mt-4"><Alert type="info">PF (12%), ESI (0.75%), PT (₹200/mo) & TDS deducted at source.</Alert></div>
      </div>
    </div>
  );
};

const FinanceTaxReport = () => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setData(await api.getTaxByYear(year)); } catch { setData([]); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);
  const totalTDS = data.reduce((s,r)=>s+parseFloat(r.tdsDeducted||0),0);

  return (
    <>
      <div className="card-header mb-4">
        <div><div className="card-title">Tax Report — FY {year}</div><div className="card-subtitle">{data.length} records</div></div>
        <div className="flex gap-2 items-center">
          <input style={{width:110,marginBottom:0}} type="number" value={year} onChange={e=>setYear(e.target.value)} />
          <button className="btn btn-primary btn-sm" onClick={load}><Icon.Search style={{width:13,height:13}} /> Search</button>
        </div>
      </div>
      {totalTDS>0 && <div className="highlight-box mb-4"><div className="text-muted text-xs mb-1">Total TDS Deducted — FY {year}</div><div className="font-bold" style={{fontSize:'1.25rem',color:'var(--primary)'}}>{fmt.currency(totalTDS)}</div></div>}
      {loading ? <PageLoader /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Employee</th><th>Total Income</th><th>80C Ded.</th><th>Taxable</th><th>Tax</th><th>TDS Deducted</th><th>Status</th></tr></thead>
            <tbody>
              {data.length===0&&<tr><td colSpan={7}><EmptyState title="No tax data" subtitle={`No records for FY ${year}`} /></td></tr>}
              {data.map(r=>(
                <tr key={r.id}>
                  <td><div className="font-semibold">{r.employeeName}</div><div className="text-muted text-xs">{r.employeeCode}</div></td>
                  <td>{fmt.currency(r.totalIncome)}</td>
                  <td>{fmt.currency(r.totalDeductionsUnder80C)}</td>
                  <td>{fmt.currency(r.taxableIncome)}</td>
                  <td>{fmt.currency(r.taxPayable)}</td>
                  <td className="font-bold text-danger">{fmt.currency(r.tdsDeducted)}</td>
                  <td><StatusBadge status={r.taxStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

/* ──────────────────────────────────────────────────────────────
   PAGE META
   ────────────────────────────────────────────────────────────── */
const pageInfo = {
  overview:         { title: 'Dashboard Overview' },
  employees:        { title: 'Employee Management' },
  salaryStructures: { title: 'Salary Structures' },
  payrollCycles:    { title: 'Payroll Processing' },
  taxYear:          { title: 'Tax Reports' },
  myPayslips:       { title: 'My Payslips' },
  myTax:            { title: 'Tax Statement' },
  mySalary:         { title: 'My Salary Info' },
  allUsers:         { title: 'User Management' },
  allCycles:        { title: 'All Payroll Cycles' },
  allTax:           { title: 'Tax Reports' },
};

/* ──────────────────────────────────────────────────────────────
   ROOT APP
   ────────────────────────────────────────────────────────────── */
export default function App() {
  const [user, setUser] = useState(() => {
    try { const s = localStorage.getItem('payroll_user'); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [activeTab, setActiveTab] = useState('overview');

  const login = (u) => { setUser(u); localStorage.setItem('payroll_user', JSON.stringify(u)); setActiveTab('overview'); };
  const logout = () => { setUser(null); localStorage.removeItem('payroll_user'); setActiveTab('overview'); };

  if (!user) return <Login onLogin={login} />;

  const uid = user.id || user.employeeId;
  const role = user.role;

  const renderContent = () => {
    if (activeTab === 'overview') {
      if (role === 'EMPLOYEE')   return <EmployeeOverview user={user} />;
      if (role === 'HR_MANAGER') return <HROverview />;
      if (role === 'FINANCE')    return <FinanceOverview />;
      if (role === 'ADMIN')      return <AdminOverview />;
    }
    if (activeTab === 'employees')        return <EmployeeList />;
    if (activeTab === 'salaryStructures') return <SalaryStructureList />;
    if (activeTab === 'payrollCycles')    return <PayrollCyclePanel />;
    if (activeTab === 'taxYear')          return <FinanceTaxReport />;
    if (activeTab === 'myPayslips')       return <MyPayslips employeeId={uid} />;
    if (activeTab === 'myTax')            return <TaxView employeeId={uid} />;
    if (activeTab === 'mySalary')         return <MySalaryInfo user={user} />;
    if (activeTab === 'allUsers')         return <EmployeeList />;
    if (activeTab === 'allCycles')        return <PayrollCyclePanel />;
    if (activeTab === 'allTax')           return <FinanceTaxReport />;
    return null;
  };

  const pg = pageInfo[activeTab] || {};
  const initials = user.name?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  return (
    <div className="app-shell">
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="main-content">
        {/* ── TOP HEADER WITH LOGOUT ── */}
        <div className="page-header">
          <div>
            <h1 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{pg.title}</h1>
            <p className="text-muted" style={{ fontSize: '0.72rem', marginTop: '0.1rem' }}>
              {user.role?.replace('_', ' ')} · {user.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={user.role} />
            <div className="avatar" title={user.name} style={{background:`linear-gradient(135deg,${roleColor[role]||'#4f46e5'},#7c3aed)`}}>
              {initials}
            </div>
            {/* ── LOGOUT BUTTON ── */}
            <button className="header-logout" onClick={logout} title="Logout">
              <Icon.LogOut style={{ width: 13, height: 13 }} />
              Logout
            </button>
          </div>
        </div>

        <div className="page-body animate-fade">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

