"import React, { useEffect, useState } from \"react\";
import api from \"@/lib/api\";
import { useParams } from \"react-router-dom\";
import { AlertTriangle } from \"lucide-react\";

export default function VisitDetail() {
    const { id } = useParams();
    const [d, setD] = useState(null);
    useEffect(() => { api.get(`/visits/${id}`).then(r => setD(r.data)); }, [id]);
    if (!d) return <div>Loading…</div>;
    const v = d.visit, p = d.patient;
    return (
        <div data-testid=\"visit-detail\">
    <div style={{ marginBottom: 14 }}>
<div style={{ fontSize: 12, color: \"var(--muted)\", fontFamily: \"monospace\" }}>{v.visit_id}</div>
    <h1 style={{ fontSize: 22, fontWeight: 700, margin: \"2px 0\" }}>{p?.full_name} — {v.visit_type}</h1>
    <div style={{ color: \"var(--muted)\", fontSize: 13 }}>{v.consulting_doctor} · {new Date(v.created_at).toLocaleString()}</div>
    </div>
        {(v.alerts || []).length > 0 && (
            <div style={{ marginBottom: 12 }}>
                {v.alerts.map((a, i) => <div key={i} className={a.level === \"red\" ? \"alert-red\" : \"alert-amber\"}><AlertTriangle size={14} style={{display:\"inline\",marginRight:6}}/>{a.message}</div>)}
                    </div>
                    )}
                <div className=\"grid-2\">
                    <div className=\"card\">
                    <div className=\"section-title\">Complaints</div>
                {(v.complaints || []).map((c, i) => <div key={i} style={{ fontSize: 13, padding: \"4px 0\" }}>• {c.name} ({c.icd}) — {c.duration} {c.severity && `· VAS ${c.severity}`}</div>)}
                </div>
                <div className=\"card\">
                <div className=\"section-title\">Vitals</div>
                <div style={{ fontSize: 13, lineHeight: 1.8 }}>
                <div>Temp: {v.vitals?.temperature || \"—\"} °F · Pulse: {v.vitals?.pulse || \"—\"} bpm · BP: {v.vitals?.bp_sys || \"—\"}/{v.vitals?.bp_dia || \"—\"} mmHg</div>
                <div>SpO2: {v.vitals?.spo2 || \"—\"}% · Weight: {v.vitals?.weight || \"—\"} kg · Height: {v.vitals?.height || \"—\"} cm · BMI: {v.vitals?.bmi || \"—\"}</div>
                </div>
                </div>
                <div className=\"card\">
                <div className=\"section-title\">Diagnosis</div>
            {(v.diagnosis || []).map((dx, i) => <div key={i} style={{ fontSize: 13, padding: \"4px 0\" }}>• <b>{dx.code}</b> — {dx.description} <span className=\"tag tag-slate\">{dx.severity}</span> <span className=\"tag tag-blue\">{dx.confirmed}</span></div>)}
                </div>
                <div className=\"card\">
                <div className=\"section-title\">Investigations Ordered</div>
                <div style={{ display: \"flex\", flexWrap: \"wrap\", gap: 6 }}>{(v.investigations || []).map((i, idx) => <span key={idx} className=\"tag tag-blue\">{i}</span>)}</div>
                </div>
                </div>
                <div className=\"card\" style={{ marginTop: 14 }}>
                <div className=\"section-title\">Prescription</div>
                <table className=\"tbl\">
                <thead><tr><th>Drug</th><th>Dose</th><th>Frequency</th><th>Timing</th><th>Route</th><th>Duration</th><th>Instructions</th></tr></thead>
                <tbody>
            {(v.prescription || []).map((p, i) => (
                <tr key={i}><td>{p.drug}</td><td>{p.dose}</td><td>{p.frequency}</td><td>{p.timing}</td><td>{p.route}</td><td>{p.duration}</td><td>{p.instructions}</td></tr>
        ))}
        </tbody>
        </table>
        </div>
            {v.plan_notes && <div className=\"card\" style={{ marginTop: 14 }}><div className=\"section-title\">Plan</div><div style={{ fontSize: 13, whiteSpace: \"pre-wrap\" }}>{v.plan_notes}</div></div>}
            </div>
            );
            }
            "