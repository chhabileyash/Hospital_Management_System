"import React, { useEffect, useState } from \"react\";
import api from \"@/lib/api\";
import { useParams, Link } from \"react-router-dom\";
import { Stethoscope, BedDouble } from \"lucide-react\";

export default function PatientDetail() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    useEffect(() => { api.get(`/patients/${id}`).then(r => setData(r.data)).catch(() => {}); }, [id]);
    if (!data) return <div>Loading…</div>;
    const p = data.patient;
    return (
        <div data-testid=\"patient-detail\">
    <div style={{ display: \"flex\", justifyContent: \"space-between\", alignItems: \"flex-start\", marginBottom: 14 }}>
    <div>
    <div style={{ fontSize: 12, color: \"var(--muted)\", fontFamily: \"monospace\" }}>{p.upid}</div>
    <h1 style={{ fontSize: 22, fontWeight: 700, margin: \"2px 0 6px\" }}>{p.full_name}</h1>
    <div style={{ color: \"var(--muted)\", fontSize: 13 }}>{p.age}y · {p.gender} · {p.mobile} · {p.city}</div>
    </div>
        <div style={{ display: \"flex\", gap: 8 }}>
            <Link to={`/opd/new/${p.id}`} className=\"btn btn-primary\" data-testid=\"new-opd-visit\"><Stethoscope size={15}/> New OPD Visit</Link>
            <Link to={`/ipd/new/${p.id}`} className=\"btn btn-outline\" data-testid=\"new-admission\"><BedDouble size={15}/> Admit (IPD)</Link>
            </div>
            </div>
            <div className=\"grid-2\">
            <div className=\"card\">
            <div className=\"section-title\">Demographics</div>
            <div style={{ fontSize: 13, lineHeight: 1.9 }}>
            <div><b>Address:</b> {p.address}, {p.city} {p.pincode}, {p.state}</div>
            <div><b>Email:</b> {p.email || \"—\"}</div>
            <div><b>Blood group:</b> {p.blood_group || \"—\"}</div>
            <div><b>Occupation:</b> {p.occupation || \"—\"}</div>
            <div><b>ABHA:</b> {p.abha_number || \"Not linked\"}</div>
            <div><b>Source:</b> <span className=\"tag tag-slate\">{p.patient_source}</span></div>
            </div>
            </div>
            <div className=\"card\">
            <div className=\"section-title\">Activity</div>
            <div style={{ fontSize: 13 }}>
            <div><b>OPD visits:</b> {data.visits.length}</div>
            <div><b>IPD admissions:</b> {data.admissions.length}</div>
    </div>
    </div>
    </div>
        <div className=\"card\" style={{ marginTop: 14 }}>
        <div className=\"section-title\">OPD Visits</div>
        {data.visits.length === 0 && <div style={{ color: \"var(--muted)\", fontSize: 13 }}>No visits yet</div>}
            <table className=\"tbl\">
            <tbody>
        {data.visits.map((v) => (
            <tr key={v.id}>
            <td style={{ fontFamily: \"monospace\", fontSize: 12 }}>{v.visit_id}</td>
                <td>{v.visit_type}</td>
                <td>{v.consulting_doctor}</td>
            <td>{(v.diagnosis || []).map(d => d.description).join(\", \") || \"—\"}</td>
                <td>{new Date(v.created_at).toLocaleDateString()}</td>
                <td><Link to={`/visits/${v.id}`} className=\"btn btn-outline btn-sm\">View</Link></td>
        </tr>
        ))}
        </tbody>
        </table>
        </div>
            <div className=\"card\" style={{ marginTop: 14 }}>
        <div className=\"section-title\">IPD Admissions</div>
            {data.admissions.length === 0 && <div style={{ color: \"var(--muted)\", fontSize: 13 }}>No admissions yet</div>}
                <table className=\"tbl\">
                <tbody>
            {data.admissions.map((a) => (
                <tr key={a.id}>
                <td style={{ fontFamily: \"monospace\", fontSize: 12 }}>{a.admission_id}</td>
                    <td>{a.ward} / Bed {a.bed_number}</td>
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