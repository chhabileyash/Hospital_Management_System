"import React, { useEffect, useState } from \"react\";
import api from \"@/lib/api\";
import { Link } from \"react-router-dom\";
import { Users, Stethoscope, BedDouble, Activity, TrendingUp, UserPlus } from \"lucide-react\";

export default function Dashboard() {
    const [data, setData] = useState(null);
    useEffect(() => { api.get(\"/analytics/overview\").then(r => setData(r.data)).catch(() => {}); }, []);
        if (!data) return <div data-testid=\"dashboard-loading\">Loading dashboard…</div>;
        const k = data.kpi;
        return (
            <div data-testid=\"dashboard-page\">
        <div style={{ display: \"flex\", justifyContent: \"space-between\", alignItems: \"center\", marginBottom: 22 }}>
        <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Clinical Dashboard</h1>
            <div style={{ color: \"var(--muted)\", fontSize: 13, marginTop: 4 }}>Gastroenterology · OPD & IPD overview</div>
                </div>
                <div style={{ display: \"flex\", gap: 8 }}>
                <Link to=\"/patients/new\" className=\"btn btn-primary\" data-testid=\"quick-add-patient\"><UserPlus size={16}/> New Patient</Link>
                <Link to=\"/patients\" className=\"btn btn-outline\" data-testid=\"quick-patients\">All Patients</Link>
                </div>
                </div>
                <div className=\"grid-4\" style={{ marginBottom: 18 }}>
                <div className=\"kpi\" data-testid=\"kpi-patients\"><div className=\"kpi-label\"><Users size={12} style={{ display:\"inline\" }}/> Patients</div><div className=\"kpi-value\">{k.total_patients}</div></div>
                <div className=\"kpi\" data-testid=\"kpi-visits\"><div className=\"kpi-label\"><Stethoscope size={12} style={{ display:\"inline\" }}/> OPD Visits</div><div className=\"kpi-value\">{k.total_visits}</div></div>
                <div className=\"kpi\" data-testid=\"kpi-active-ipd\"><div className=\"kpi-label\"><BedDouble size={12} style={{ display:\"inline\" }}/> Active IPD</div><div className=\"kpi-value\">{k.active_admissions}</div></div>
                <div className=\"kpi\" data-testid=\"kpi-avg-los\"><div className=\"kpi-label\"><TrendingUp size={12} style={{ display:\"inline\" }}/> Avg LOS (days)</div><div className=\"kpi-value\">{k.avg_los_days}</div></div>
                </div>
                <div className=\"grid-2\">
                <div className=\"card\">
                <div className=\"section-title\">Top Diagnoses</div>
            {data.disease_distribution.length === 0 && <div style={{ color: \"var(--muted)\", fontSize: 13 }}>No data yet</div>}
            {data.disease_distribution.map((d, i) => (
                <div key={i} style={{ display: \"flex\", justifyContent: \"space-between\", padding: \"8px 0\", borderBottom: \"1px solid #f1f5f9\" }}>
                <span style={{ fontSize: 13 }}>{d.name}</span>
                <span className=\"tag tag-blue\">{d.count}</span>
                </div>
                ))}
                </div>
                <div className=\"card\">
                <div className=\"section-title\">Referral Sources</div>
            {data.referral_sources.length === 0 && <div style={{ color: \"var(--muted)\", fontSize: 13 }}>No data yet</div>}
            {data.referral_sources.map((d, i) => (
                <div key={i} style={{ display: \"flex\", justifyContent: \"space-between\", padding: \"8px 0\", borderBottom: \"1px solid #f1f5f9\" }}>
                <span style={{ fontSize: 13 }}>{d.name}</span>
                <span className=\"tag tag-slate\">{d.count}</span>
                </div>
                ))}
                </div>
                </div>
                </div>
                );
            }
                "