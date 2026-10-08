"import React from \"react\";
import { NavLink, useNavigate, Link } from \"react-router-dom\";
import { useAuth } from \"@/context/AuthContext\";
import { LayoutDashboard, Users, Stethoscope, BedDouble, BarChart3, LogOut, Activity } from \"lucide-react\";

const NAV = [
    { to: \"/\", label: \"Dashboard\", icon: LayoutDashboard, testid: \"nav-dashboard\" },
{ to: \"/patients\", label: \"Patients\", icon: Users, testid: \"nav-patients\" },
    { to: \"/ipd\", label: \"IPD Ward\", icon: BedDouble, testid: \"nav-ipd\" },
        { to: \"/analytics\", label: \"Analytics\", icon: BarChart3, testid: \"nav-analytics\" },
        ];

            export default function Layout({ children }) {
                const { user, logout } = useAuth();
                const nav = useNavigate();
                return (
                    <div style={{ display: \"flex\", minHeight: \"100vh\" }}>
                        <aside style={{ width: 240, background: \"#fff\", borderRight: \"1px solid var(--border)\", padding: \"1.25rem .9rem\", display: \"flex\", flexDirection: \"column\" }}>
                        <Link to=\"/\" data-testid=\"brand-link\" style={{ display: \"flex\", alignItems: \"center\", gap: 10, padding: \"0 .5rem 1.5rem\", borderBottom: \"1px solid var(--border)\", textDecoration: \"none\", color: \"inherit\" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: \"linear-gradient(135deg,#0d9488,#0ea5e9)\", display: \"grid\", placeItems: \"center\", color: \"#fff\" }}>
                        <Activity size={20} />
                        </div>
                        <div>
                        <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: \".02em\" }}>EPiC Biosphere</div>
                        <div style={{ fontSize: 11, color: \"var(--muted)\" }}>Gastro Intelligence</div>
                        </div>
                        </Link>
                        <nav style={{ display: \"flex\", flexDirection: \"column\", gap: 4, marginTop: 14, flex: 1 }}>
                    {NAV.map((n) => (
                        <NavLink key={n.to} to={n.to} end={n.to === \"/\"} data-testid={n.testid}
                        className={({ isActive }) => \"sidebar-link\" + (isActive ? \" active\" : \"\")}>
                        <n.icon size={17} /> {n.label}
                        </NavLink>
                        ))}
                        </nav>
                        <div style={{ borderTop: \"1px solid var(--border)\", paddingTop: 12 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }} data-testid=\"user-name\">{user?.name}</div>
                        <div style={{ fontSize: 11, color: \"var(--muted)\", textTransform: \"capitalize\" }} data-testid=\"user-role\">{user?.role}</div>
                        <button className=\"btn btn-outline btn-sm\" style={{ marginTop: 10, width: \"100%\" }}
                        data-testid=\"logout-btn\" onClick={async () => { await logout(); nav(\"/login\"); }}>
                        <LogOut size={14} /> Logout
                        </button>
                        </div>
                        </aside>
                        <main style={{ flex: 1, padding: \"1.5rem 2rem\", overflow: \"auto\" }}>{children}</main>
                        </div>
                        );
                    }
                        "