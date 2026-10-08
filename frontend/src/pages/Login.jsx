"import React, { useState } from \"react\";
import { useAuth } from \"@/context/AuthContext\";
import { useNavigate } from \"react-router-dom\";
import { formatErr } from \"@/lib/api\";
import api from \"@/lib/api\";
import { Activity } from \"lucide-react\";
import { toast } from \"sonner\";

export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [mode, setMode] = useState(\"login\");
    const [email, setEmail] = useState(\"admin@epic.com\");
    const [password, setPassword] = useState(\"Admin@123\");
    const [name, setName] = useState(\"\");
    const [role, setRole] = useState(\"doctor\");
    const [err, setErr] = useState(\"\");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setErr(\"\"); setLoading(true);
        try {
            if (mode === \"login\") {
            await login(email, password);
        } else {
            const { data } = await api.post(\"/auth/register\", { email, password, name, role });
            // AuthProvider doesn't auto-update for register call here; refresh me
            await api.get(\"/auth/me\");
            window.location.href = \"/\";
            return data;
        }
        toast.success(\"Welcome back!\");
        nav(\"/\");
    } catch (e2) {
        setErr(formatErr(e2.response?.data?.detail) || e2.message);
    } finally { setLoading(false); }
};

return (
    <div style={{ minHeight: \"100vh\", display: \"grid\", placeItems: \"center\", background: \"linear-gradient(135deg,#f0fdfa 0%,#e0f2fe 100%)\" }}>
        <div className=\"card\" style={{ width: 420, maxWidth: \"92vw\", padding: \"2rem\" }}>
        <div style={{ display: \"flex\", alignItems: \"center\", gap: 12, marginBottom: 18 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: \"linear-gradient(135deg,#0d9488,#0ea5e9)\", display: \"grid\", placeItems: \"center\", color: \"#fff\" }}>
        <Activity size={22} />
        </div>
        <div>
        <div style={{ fontWeight: 800, fontSize: 18 }}>EPiC Biosphere</div>
<div style={{ fontSize: 12, color: \"var(--muted)\" }}>Gastroenterology Clinical Platform</div>
    </div>
    </div>
    <div className=\"tabs\" style={{ marginBottom: 18 }}>
    <div className={\"tab\" + (mode === \"login\" ? \" active\" : \"\")} onClick={() => setMode(\"login\")} data-testid=\"tab-login\">Sign in</div>
    <div className={\"tab\" + (mode === \"register\" ? \" active\" : \"\")} onClick={() => setMode(\"register\")} data-testid=\"tab-register\">Register</div>
    </div>
    <form onSubmit={submit}>
    {mode === \"register\" && (
        <>
        <label className=\"label\">Full name</label>
        <input className=\"input\" value={name} onChange={(e) => setName(e.target.value)} required data-testid=\"register-name\" />
        <label className=\"label\" style={{ marginTop: 12 }}>Role</label>
        <select className=\"select\" value={role} onChange={(e) => setRole(e.target.value)} data-testid=\"register-role\">
        <option value=\"doctor\">Doctor</option>
        <option value=\"nurse\">Nurse</option>
        <option value=\"pharmacist\">Pharmacist</option>
        <option value=\"dietitian\">Dietitian</option>
        <option value=\"admin\">Admin</option>
        </select>
        </>
        )}
    <label className=\"label\" style={{ marginTop: 12 }}>Email</label>
<input className=\"input\" type=\"email\" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid=\"login-email\" />
<label className=\"label\" style={{ marginTop: 12 }}>Password</label>
<input className=\"input\" type=\"password\" value={password} onChange={(e) => setPassword(e.target.value)} required data-testid=\"login-password\" />
{err && <div className=\"alert-red\" style={{ marginTop: 14 }} data-testid=\"login-error\">{err}</div>}
<button className=\"btn btn-primary\" style={{ width: \"100%\", marginTop: 18 }} disabled={loading} data-testid=\"login-submit\">
    {loading ? \"Please wait…\" : mode === \"login\" ? \"Sign in\" : \"Create account\"}
    </button>
    </form>
        <div style={{ marginTop: 16, fontSize: 12, color: \"var(--muted)\", textAlign: \"center\" }}>
            Demo admin: <b>admin@epic.com</b> / <b>Admin@123</b>
            </div>
            </div>
            </div>
            );
        }
            "