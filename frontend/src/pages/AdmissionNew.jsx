"import React, { useEffect, useState } from \"react\";
import api, { formatErr } from \"@/lib/api\";
import { useParams, useNavigate } from \"react-router-dom\";
import { toast } from \"sonner\";
import { Plus, X } from \"lucide-react\";

export default function AdmissionNew() {
    const { patientId } = useParams();
    const nav = useNavigate();
    const [patient, setPatient] = useState(null);
    const [icd, setIcd] = useState([]);
    const [d, setD] = useState({
        admission_type: \"Emergency\", admission_source: \"Emergency\", admitting_doctor: \"Dr. on Duty\",
    ward: \"General Ward\", bed_number: \"\", chief_complaints: \"\",
    referral_doctor: \"\", insurance_preauth: \"\", expected_los: \"3-7 days\",
    attendant_name: \"\", attendant_relation: \"\", attendant_mobile: \"\",
    consent: [\"General\"],
});
    const [dx, setDx] = useState([]);
    const [err, setErr] = useState(\"\");

    useEffect(() => {
        api.get(`/patients/${patientId}`).then(r => setPatient(r.data.patient));
        api.get(\"/ref/icd10\").then(r => setIcd(r.data));
    }, [patientId]);

    const toggleConsent = (c) => setD({ ...d, consent: d.consent.includes(c) ? d.consent.filter(x => x !== c) : [...d.consent, c] });
    const addDx = (x) => { if (dx.some(y => y.code === x.code)) return; setDx([...dx, { code: x.code, description: x.description }]); };

    const submit = async () => {
        setErr(\"\");
        try {
            const { data } = await api.post(\"/admissions\", { ...d, patient_id: patientId, admission_diagnosis: dx });
            toast.success(`Admitted: ${data.admission_id}`);
            nav(`/admissions/${data.id}`);
        } catch (e) { setErr(formatErr(e.response?.data?.detail) || e.message); }
    };

    if (!patient) return <div>Loading…</div>;
    return (
        <div data-testid=\"admission-new\">
    <h1 style={{ fontSize: 22, fontWeight: 700, margin: \"0 0 14px\" }}>Admit {patient.full_name} ({patient.upid})</h1>
    <div className=\"card grid-3\" style={{ marginBottom: 12 }}>
    <div><label className=\"label\">Admission type</label><select className=\"select\" value={d.admission_type} onChange={e => setD({...d, admission_type: e.target.value})} data-testid=\"adm-type\">{[\"Elective\",\"Emergency\",\"Transfer from OPD\",\"Referral Transfer\"].map(o=><option key={o}>{o}</option>)}</select></div>
    <div><label className=\"label\">Source</label><select className=\"select\" value={d.admission_source} onChange={e => setD({...d, admission_source: e.target.value})}>{[\"OPD\",\"Emergency\",\"Other Hospital Referral\",\"ICU Transfer\"].map(o=><option key={o}>{o}</option>)}</select></div>
    <div><label className=\"label\">Admitting doctor</label><input className=\"input\" value={d.admitting_doctor} onChange={e => setD({...d, admitting_doctor: e.target.value})} /></div>
    <div><label className=\"label\">Ward / Unit</label><select className=\"select\" value={d.ward} onChange={e => setD({...d, ward: e.target.value})}>{[\"General Ward\",\"Private Room\",\"Semi-Private\",\"HDU\",\"ICU\"].map(o=><option key={o}>{o}</option>)}</select></div>
    <div><label className=\"label\">Bed number</label><input className=\"input\" value={d.bed_number} onChange={e => setD({...d, bed_number: e.target.value})} required data-testid=\"adm-bed\" /></div>
    <div><label className=\"label\">Expected LOS</label><select className=\"select\" value={d.expected_los} onChange={e => setD({...d, expected_los: e.target.value})}>{[\"<3 days\",\"3-7 days\",\">7 days\"].map(o=><option key={o}>{o}</option>)}</select></div>
    </div>
        <div className=\"card\" style={{ marginBottom: 12 }}>
        <div className=\"section-title\">Admission Diagnosis (ICD-10)</div>
        <div style={{ display: \"flex\", flexWrap: \"wrap\", gap: 6, marginBottom: 12 }}>
            {icd.map(x => <button key={x.code} className=\"btn btn-outline btn-sm\" onClick={() => addDx(x)}><Plus size={12}/> {x.code}</button>)}
            </div>
                {dx.map((x, i) => <div key={i} style={{ display: \"flex\", justifyContent: \"space-between\", padding: \"4px 0\", fontSize: 13 }}><span><b>{x.code}</b> — {x.description}</span><button className=\"btn btn-outline btn-sm\" onClick={() => setDx(dx.filter((_,idx)=>idx!==i))}><X size={12}/></button></div>)}
                    </div>
                    <div className=\"card\" style={{ marginBottom: 12 }}>
                    <div className=\"section-title\">Chief Complaints</div>
                    <textarea className=\"input\" rows=\"2\" value={d.chief_complaints} onChange={e => setD({...d, chief_complaints: e.target.value})} />
                    </div>
                    <div className=\"card\" style={{ marginBottom: 12 }}>
                    <div className=\"section-title\">Consent</div>
                    <div style={{ display: \"flex\", gap: 6 }}>
                {[\"General\",\"Procedure\",\"Research\"].map(c => <button key={c} className={\"btn btn-sm \" + (d.consent.includes(c) ? \"btn-primary\" : \"btn-outline\")} onClick={() => toggleConsent(c)}>{c}</button>)}
                    </div>
                    </div>
                    <div className=\"card grid-3\" style={{ marginBottom: 12 }}>
                    <div><label className=\"label\">Attendant name</label><input className=\"input\" value={d.attendant_name} onChange={e => setD({...d, attendant_name: e.target.value})} /></div>
                    <div><label className=\"label\">Relation</label><input className=\"input\" value={d.attendant_relation} onChange={e => setD({...d, attendant_relation: e.target.value})} /></div>
                    <div><label className=\"label\">Mobile</label><input className=\"input\" value={d.attendant_mobile} onChange={e => setD({...d, attendant_mobile: e.target.value})} /></div>
                    <div><label className=\"label\">Referral doctor</label><input className=\"input\" value={d.referral_doctor} onChange={e => setD({...d, referral_doctor: e.target.value})} /></div>
                    <div><label className=\"label\">Insurance pre-auth #</label><input className=\"input\" value={d.insurance_preauth} onChange={e => setD({...d, insurance_preauth: e.target.value})} /></div>
                    </div>
                {err && <div className=\"alert-red\">{err}</div>}
                    <button className=\"btn btn-primary\" onClick={submit} data-testid=\"save-admission\">Admit Patient</button>
                    </div>
                    );
                }
                    "