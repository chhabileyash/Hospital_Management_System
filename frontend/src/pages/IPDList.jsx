"import React, { useEffect, useState } from \"react\";
import api from \"@/lib/api\";
import { Link } from \"react-router-dom\";

export default function IPDList() {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState(\"active\");
    useEffect(() => { api.get(\"/admissions\", { params: filter !== \"all\" ? { status: filter } : {} }).then(r => setItems(r.data)); }, [filter]);
        return (
            <div data-testid=\"ipd-list\">
        <div style={{ display: \"flex\", justifyContent: \"space-between\", alignItems: \"center\", marginBottom: 18 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>IPD Ward</h1>
            <div style={{ display: \"flex\", gap: 6 }}>
            {[\"active\",\"discharged\",\"all\"].map(f => (
                <button key={f} className={\"btn btn-sm \" + (filter === f ? \"btn-primary\" : \"btn-outline\")} onClick={() => setFilter(f)} data-testid={`filter-${f}`}>{f}</button>
                ))}
                </div>
                </div>
                <div className=\"card\" style={{ padding: 0, overflow: \"hidden\" }}>
                <table className=\"tbl\">
                <thead><tr><th>Admission ID</th><th>Patient</th><th>Ward / Bed</th><th>Admitting Dr</th><th>Status</th><th>Date</th><th></th></tr></thead>
                <tbody>
            {items.length === 0 && <tr><td colSpan={7} style={{ textAlign: \"center\", color: \"var(--muted)\", padding: 32 }}>No admissions in this view</td></tr>}
            {items.map(a => (
                <tr key={a.id} data-testid={`ipd-row-${a.admission_id}`}>
                <td style={{ fontFamily: \"monospace\", fontSize: 12 }}>{a.admission_id}</td>
                    <td>{a.patient_id?.slice(0, 8)}…</td>
                    <td>{a.ward} / Bed {a.bed_number}</td>
            <td>{a.admitting_doctor}</td>
            <td><span className={\"tag \" + (a.status === \"active\" ? \"tag-amber\" : \"tag-green\")}>{a.status}</span></td>
                <td>{new Date(a.admission_date).toLocaleDateString()}</td>
                <td><Link to={`/admissions/${a.id}`} className=\"btn btn-outline btn-sm\">Open</Link></td>
        </tr>
        ))}
        </tbody>
        </table>
        </div>
        </div>
        );
        }
            "