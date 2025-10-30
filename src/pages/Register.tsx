import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { http } from '../lib/http'

export default function Register() {
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER')
  const [err, setErr] = useState<string>()
  const [ok, setOk] = useState<string>()
  const nav = useNavigate()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(undefined); setOk(undefined)

    if (!u.trim() || !p.trim()) {
      setErr('Username/password required')
      return
    }

    try {
      const url = role === 'ADMIN' ? '/auth/register-admin' : '/auth/register-user'
      await http.post(url, { username: u.trim(), password: p })
      setOk('Đăng ký thành công! Vui lòng đăng nhập.')
      setTimeout(() => nav('/login'), 900)
    } catch (e: any) {
      if (e?.response?.status === 409) setErr('Username đã tồn tại')
      else if (e?.response?.status === 400) setErr('Thiếu thông tin hoặc không hợp lệ')
      else setErr('Có lỗi xảy ra. Thử lại sau.')
    }
  }

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <h1 style={styles.title}>Đăng ký</h1>

        {err && <div style={styles.error}>{err}</div>}
        {ok && <div style={styles.success}>{ok}</div>}

        <form onSubmit={submit} style={styles.form}>
          <label style={styles.label}>Username</label>
          <input style={styles.input} value={u} onChange={e => setU(e.target.value)} />

          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" value={p} onChange={e => setP(e.target.value)} />

          <label style={styles.label}>Account type</label>
          <select style={styles.input} value={role} onChange={e => setRole(e.target.value as any)}>
            <option value="USER">User</option>
            <option value="ADMIN">Admin (dev only)</option>
          </select>

          <button type="submit" style={styles.primaryBtn}>Register</button>
        </form>
      </div>
    </div>
  )
}

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
  form: { display: 'grid', gap: 8 },
  label: { fontSize: 12, color: '#64748b' },
  input: {
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    padding: '10px 12px',
    outline: 'none',
    background: '#fff',
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
  error: { background: '#fee2e2', color: '#b91c1c', padding: '8px 10px', borderRadius: 8, marginBottom: 10, fontSize: 14 },
  success: { background: '#dcfce7', color: '#166534', padding: '8px 10px', borderRadius: 8, marginBottom: 10, fontSize: 14 },
}
