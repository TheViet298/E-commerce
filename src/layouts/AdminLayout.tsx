import { NavLink, Outlet } from 'react-router-dom'
import './admin.css'

export default function AdminLayout() {
  return (
    <div className="admin">
      {/* Sidebar */}
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <div className="admin__avatar">A</div>
          <div>
            <div className="admin__brand-name">Halong Admin</div>
            <div className="admin__brand-sub">v1.0.0</div>
          </div>
        </div>

        <nav className="admin__menu">
          <Section title="Báo cáo">
            <MenuLink to="/admin" icon="📊" end>Dashboard</MenuLink>
          </Section>

          <Section title="Quản lý">
            <MenuLink to="/admin/vessels" icon="⛴">Vessels</MenuLink>
            <MenuLink to="/admin/bookings" icon="🧾">Bookings</MenuLink>
            <MenuLink to="/admin/users" icon="👤">Users</MenuLink>
          </Section>

          <Section title="Hệ thống">
            <MenuLink to="/admin/settings" icon="⚙️">Settings</MenuLink>
          </Section>
        </nav>
      </aside>

      {/* Phần phải */}
      <div className="admin__right">
        {/* Topbar */}
        <header className="admin__topbar">
          <div className="admin__topbar-left">
            <span className="admin__breadcrumb">Admin</span>
          </div>
          <div className="admin__topbar-right">
            <button className="btn btn--light" onClick={() => { localStorage.clear(); location.href='/login' }}>
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Nội dung */}
        <main className="admin__content">
          <Outlet />
        </main>

        <footer className="admin__footer">
          © {new Date().getFullYear()} Halong Cruises
        </footer>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="admin__section">
      <div className="admin__section-title">{title}</div>
      <ul className="admin__links">{children}</ul>
    </div>
  )
}

function MenuLink({ to, icon, end, children }:{
  to: string; icon?: string; end?: boolean; children: React.ReactNode
}) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          'admin__link' + (isActive ? ' admin__link--active' : '')
        }
      >
        {icon && <span className="admin__icon">{icon}</span>}
        <span>{children}</span>
      </NavLink>
    </li>
  )
}
