"import React, { useEffect, useState } from \"react\";
import api from \"@/lib/api\";
import { Link } from \"react-router-dom\";
import { UserPlus, Search } from \"lucide-react\";

export default function Patients() {
    const [items, setItems] = useState([]);
    const [q, setQ] = useState(\"\");
    const load = async (query = \"\") => {
    const { data } = await api.get(\"/patients\", { params: query ? { q: query } : {} });
    setItems(data);
};
useEffect(() => { load(); }, []);
return (
    <div data-testid=\"patients-page\">
<div style={{ display: \"flex\", justifyContent: \"space-between\", alignItems: \"center\", marginBottom: 18 }}>
<h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Patients</h1>
    <Link to=\"/patients/new\" className=\"btn btn-primary\" data-testid=\"new-patient-btn\"><UserPlus size={16}/> Register Patient</Link>
    </div>
    <div className=\"card\" style={{ marginBottom: 16, padding: \".75rem 1rem\", display: \"flex\", gap: 8, alignItems: \"center\" }}>
    <Search size={16} color=\"#64748b\" />
    <input className=\"input\" placeholder=\"Search by name, UPID, mobile…\" value={q}
    onChange={(e) => { setQ(e.target.value); load(e.target.value); }} data-testid=\"patient-search\" style={{ border: \"none\" }} />
    </div>
    <div className=\"card\" style={{ padding: 0, overflow: \"hidden\" }}>
    <table className=\"tbl\">
    <thead><tr><th>UPID</th><th>Name</th><th>Age/Gender</th><th>Mobile</th><th>City</th><th>Source</th><th></th></tr></thead>
    <tbody data-testid=\"patients-table\">
    {items.length === 0 && <tr><td colSpan={7} style={{ textAlign: \"center\", color: \"var(--muted)\", padding: 32 }}>No patients yet — click \"Register Patient\"</td></tr>}
    {items.map((p) => (
        <tr key={p.id} data-testid={`patient-row-${p.upid}`}>
        <td style={{ fontFamily: \"monospace\", fontWeight: 600 }}>{p.upid}</td>
            <td>{p.full_name}</td>
            <td>{p.age}y / {p.gender}</td>
        <td>{p.mobile}</td>
        <td>{p.city}</td>
        <td><span className=\"tag tag-slate\">{p.patient_source}</span></td>
        <td>
            <Link to={`/patients/${p.id}`} className=\"btn btn-outline btn-sm\" data-testid={`view-patient-${p.upid}`}>Open</Link>
    </td>
    </tr>
    ))}
    </tbody>
    </table>
    </div>
    </div>
    );
    }
        "