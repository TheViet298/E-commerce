import { useState } from 'react'
import { login, getRole } from '../lib/auth'
import { useNavigate, useLocation, Link } from 'react-router-dom'

export default function Login() {
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState<string>()
  const nav = useNavigate()
  const location = useLocation() as any

  // nơi quay lại khi bị chặn
  const from: string | undefined = location.state?.from
  const requireRole: 'ADMIN' | 'USER' | undefined = location.state?.require

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(undefined)
    try {
      await login(u, p)
      const role = getRole()

      // nếu route yêu cầu role cụ thể thì check thêm
      if (requireRole && role !== requireRole) {
        setErr(`Tài khoản không có quyền ${requireRole}`)
        return
      }

      if (from) nav(from, { replace: true })
      else nav(role === 'ADMIN' ? '/admin' : '/me/bookings', { replace: true })
    } catch (e: any) {
      if (e?.response?.status === 401) setErr('Sai username/password')
      else setErr('Đăng nhập thất bại')
    }
  }

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <h1 style={styles.title}>Đăng nhập</h1>

        {requireRole && (
          <div style={styles.note}>
            Trang này yêu cầu quyền: <b>{requireRole}</b>
          </div>
        )}

        {err && <div style={styles.error}>{err}</div>}

        <form onSubmit={submit} style={styles.form}>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            placeholder="Username"
            value={u}
            onChange={e => setU(e.target.value)}
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            placeholder="Password"
            type="password"
            value={p}
            onChange={e => setP(e.target.value)}
          />

          <button type="submit" style={styles.primaryBtn}>Login</button>
        </form>

        <div style={styles.footerText}>
          Chưa có tài khoản? <Link to="/register" style={styles.link}>Đăng ký</Link>
        </div>
      </div>
    </div>
  )
}

/* ---------- tiny inline styles (không cần tailwind) ---------- */
const styles: Record<string, React.CSSProperties> = {
  screen: {
    minHeight: '100vh',
    background: '#f4f6f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: 360,
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    padding: 24,
  },
  title: { fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 14 },
  note: { fontSize: 12, color: '#475569', marginBottom: 8 },
  error: { background: '#fee2e2', color: '#b91c1c', padding: '8px 10px', borderRadius: 8, marginBottom: 10, fontSize: 14 },
  form: { display: 'grid', gap: 8 },
  label: { fontSize: 12, color: '#64748b' },
  input: {
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    padding: '10px 12px',
    outline: 'none',
  },
  primaryBtn: {
    background: '#0ea5e9',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  footerText: { marginTop: 10, fontSize: 12, textAlign: 'center', color: '#475569' },
  link: { color: '#0ea5e9', textDecoration: 'none', fontWeight: 600 },
}
