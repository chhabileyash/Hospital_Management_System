"import React, { useEffect, useState } from \"react\";
import api, { formatErr } from \"@/lib/api\";
import { useParams, useNavigate } from \"react-router-dom\";
import { toast } from \"sonner\";
import { Plus, X, AlertTriangle } from \"lucide-react\";

const TABS = [\"Visit\", \"Complaints\", \"History\", \"Vitals\", \"Exam\", \"Diagnosis\", \"Investigations\", \"Prescription\", \"Plan\"];

const FREQ = [\"OD\",\"BD\",\"TDS\",\"QID\",\"SOS\",\"Weekly\",\"Alternate day\"];
const TIMING = [\"Before food\",\"After food\",\"With food\",\"Empty stomach\",\"Bedtime\"];
const ROUTE = [\"Oral\",\"IV\",\"IM\",\"SC\",\"Rectal\",\"Topical\"];
const COMORB = [\"Diabetes Type 1\",\"Diabetes Type 2\",\"Hypertension\",\"Dyslipidaemia\",\"Obesity\",\"CKD\",\"CAD\",\"Thyroid Disorder\"];
const PREV_GI = [\"GERD\",\"IBS\",\"IBD\",\"Cirrhosis\",\"Hepatitis B\",\"Hepatitis C\",\"HCC\",\"Peptic Ulcer\",\"Pancreatitis\"];

export default function OPDVisitNew() {
    const { patientId } = useParams();
    const nav = useNavigate();
    const [patient, setPatient] = useState(null);
    const [tab, setTab] = useState(\"Visit\");
    const [symptoms, setSymptoms] = useState([]);
    const [icd, setIcd] = useState([]);
    const [drugs, setDrugs] = useState([]);
    const [templates, setTemplates] = useState([]);

    const [visit, setVisit] = useState({
        visit_type: \"New Consultation\", consulting_doctor: \"Dr. on Duty\",
    payment_type: \"Cash\", consultation_fee: 500, insurance_company: \"\", tpa_name: \"\",
});
    const [complaints, setComplaints] = useState([]);
    const [history, setHistory] = useState({
        known_gi: [], comorbidities: [], prev_surgeries: \"\", prev_hosp: \"\", prev_procedures: \"\",
    allergies: \"\", vaccinations: \"\", family_history: \"\",
    smoking: \"Never\", alcohol: \"None\", alcohol_type: \"\", tobacco: \"None\",
    dietary: \"Mixed\", activity: \"Moderate\", stress: \"Moderate\", fluid_intake: \"1-2L\",
});
    const [vitals, setVitals] = useState({
        temperature: \"\", pulse: \"\", bp_sys: \"\", bp_dia: \"\", resp_rate: \"\", spo2: \"\",
    weight: \"\", height: \"\", bmi: \"\", waist: \"\", rbs: \"\",
});
    const [exam, setExam] = useState({ general: \"\", inspection: \"\", palpation: \"\", percussion: \"\", auscultation: \"\", pr_exam: \"\", systemic: \"\" });
    const [diagnosis, setDiagnosis] = useState([]);
    const [investigations, setInvestigations] = useState([]);
    const [prescription, setPrescription] = useState([]);
    const [planNotes, setPlanNotes] = useState(\"\");
    const [previewAlerts, setPreviewAlerts] = useState([]);
    const [err, setErr] = useState(\"\");

    useEffect(() => {
        api.get(`/patients/${patientId}`).then(r => setPatient(r.data.patient));
        api.get(\"/ref/symptoms\").then(r => setSymptoms(r.data));
        api.get(\"/ref/icd10\").then(r => setIcd(r.data));
        api.get(\"/ref/drugs\").then(r => setDrugs(r.data));
        api.get(\"/ref/templates\").then(r => setTemplates(r.data));
    }, [patientId]);

    // Auto BMI
    useEffect(() => {
        const w = parseFloat(vitals.weight), h = parseFloat(vitals.height);
        if (w && h) {
            const bmi = (w / Math.pow(h/100, 2)).toFixed(1);
            setVitals(v => ({ ...v, bmi }));
        }
    }, [vitals.weight, vitals.height]);

    // CDS preview
    useEffect(() => {
        const alerts = [];
        const names = complaints.map(c => (c.name||\"\").toLowerCase());
        const has = (...keys) => keys.some(k => names.some(n => n.includes(k)));
        const age = patient?.age || 0;
        if (has(\"dysphagia\") && has(\"weight loss\") && age > 50) alerts.push({level:\"red\", message:\"Dysphagia + Weight loss + Age >50 → Endoscopy advised (Upper GI malignancy suspicion)\"});
        if ((has(\"blood in stool\") || has(\"pr bleed\")) && age > 45) alerts.push({level:\"red\", message:\"PR bleed + Age >45 → Colonoscopy advised\"});
        if (has(\"jaundice\") && has(\"weight loss\")) alerts.push({level:\"red\", message:\"Painless jaundice + Weight loss → Pancreatic Ca workup\"});
        if (has(\"haematemesis\")) alerts.push({level:\"red\", message:\"Active haematemesis → Emergency IPD admission\"});
        const bmi = parseFloat(vitals.bmi);
        if (bmi && bmi < 18.5) alerts.push({level:\"amber\", message:`BMI ${bmi} — malnutrition flag`});
        if (bmi && bmi >= 30) alerts.push({level:\"amber\", message:`BMI ${bmi} — obesity`});
        if (parseFloat(vitals.temperature) > 100.4) alerts.push({level:\"amber\", message:`Fever ${vitals.temperature}°F`});
        setPreviewAlerts(alerts);
    }, [complaints, vitals, patient]);

        const addComplaint = (s) => {
            if (complaints.some(c => c.name === s.name)) return;
            setComplaints([...complaints, { name: s.name, icd: s.icd, duration: \"\", severity: \"\" }]);
        };
            const setComplaintField = (i, k, v) => setComplaints(complaints.map((c, idx) => idx === i ? { ...c, [k]: v } : c));
            const removeComplaint = (i) => setComplaints(complaints.filter((_, idx) => idx !== i));

            const addDiagnosis = (d) => {
                if (diagnosis.some(x => x.code === d.code)) return;
                setDiagnosis([...diagnosis, { code: d.code, description: d.description, severity: \"Mild\", confirmed: \"Provisional\" }]);
            };
                const removeDx = (i) => setDiagnosis(diagnosis.filter((_, idx) => idx !== i));

                const addDrug = (drug) => setPrescription([...prescription, { drug: drug.name, dose: drug.default_dose, frequency: \"OD\", timing: \"After food\", route: \"Oral\", duration: \"5 days\", instructions: \"\" }]);
                const setRxField = (i, k, v) => setPrescription(prescription.map((p, idx) => idx === i ? { ...p, [k]: v } : p));
                const removeRx = (i) => setPrescription(prescription.filter((_, idx) => idx !== i));
                const applyTemplate = (t) => {
                    const rx = t.drugs.map(d => ({ ...d, route: \"Oral\", instructions: t.diet_attached || \"\" }));
                    setPrescription([...prescription, ...rx]);
                    toast.success(`Template applied: ${t.name}`);
                };

                    const toggle = (arr, val, setter) => setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

                    const submit = async () => {
                        setErr(\"\");
                        try {
                            const payload = {
                                patient_id: patientId, ...visit,
                                complaints, history, vitals: { ...vitals }, examination: exam,
                                diagnosis, investigations, prescription, plan_notes: planNotes,
                            };
                            const { data } = await api.post(\"/visits\", payload);
                            toast.success(`Visit recorded: ${data.visit_id}`);
                            nav(`/visits/${data.id}`);
                        } catch (e) { setErr(formatErr(e.response?.data?.detail) || e.message); }
                    };

                    if (!patient) return <div>Loading…</div>;
                    return (
                        <div data-testid=\"opd-visit-new\">
                    <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: \"var(--muted)\" }}>{patient.upid} · {patient.age}y · {patient.gender}</div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, margin: \"2px 0\" }}>OPD Visit — {patient.full_name}</h1>
                    </div>

                        {previewAlerts.length > 0 && (
                            <div style={{ marginBottom: 12 }}>
                                {previewAlerts.map((a, i) => (
                                    <div key={i} className={a.level === \"red\" ? \"alert-red\" : \"alert-amber\"} data-testid={`cds-alert-${i}`}>
                                        <AlertTriangle size={14} style={{ display:\"inline\", marginRight:6 }} /> {a.message}
                                        </div>
                                        ))}
                                        </div>
                                        )}

                                        <div className=\"tabs\">
                                    {TABS.map(t => <div key={t} className={\"tab\" + (tab === t ? \" active\" : \"\")} onClick={() => setTab(t)} data-testid={`tab-${t.toLowerCase()}`}>{t}</div>)}
                                        </div>

                                    {tab === \"Visit\" && (
                                        <div className=\"card grid-3\">
                                        <div><label className=\"label\">Visit type</label>
                                        <select className=\"select\" value={visit.visit_type} onChange={e => setVisit({...visit, visit_type: e.target.value})} data-testid=\"v-type\">
                                    {[\"New Consultation\",\"Follow-up\",\"Emergency OPD\",\"Teleconsultation\"].map(o => <option key={o}>{o}</option>)}
                                        </select></div>
                                        <div><label className=\"label\">Consulting doctor</label><input className=\"input\" value={visit.consulting_doctor} onChange={e => setVisit({...visit, consulting_doctor: e.target.value})} data-testid=\"v-doc\" /></div>
                                        <div><label className=\"label\">Payment type</label>
                                        <select className=\"select\" value={visit.payment_type} onChange={e => setVisit({...visit, payment_type: e.target.value})} data-testid=\"v-pay\">
                                    {[\"Cash\",\"Card\",\"UPI\",\"Insurance\",\"TPA\",\"Govt. Scheme\"].map(o => <option key={o}>{o}</option>)}
                                        </select></div>
                                        <div><label className=\"label\">Consultation fee (₹)</label><input type=\"number\" className=\"input\" value={visit.consultation_fee} onChange={e => setVisit({...visit, consultation_fee: parseFloat(e.target.value)})} data-testid=\"v-fee\" /></div>
                                    {visit.payment_type === \"Insurance\" && <div><label className=\"label\">Insurance company</label><input className=\"input\" value={visit.insurance_company} onChange={e => setVisit({...visit, insurance_company: e.target.value})} /></div>}
                                    {visit.payment_type === \"TPA\" && <div><label className=\"label\">TPA name</label><input className=\"input\" value={visit.tpa_name} onChange={e => setVisit({...visit, tpa_name: e.target.value})} /></div>}
                                        </div>
                                        )}

                                    {tab === \"Complaints\" && (
                                        <div className=\"card\">
                                        <div className=\"section-title\">Add Gastro Symptoms</div>
                                        <div style={{ display: \"flex\", gap: 6, flexWrap: \"wrap\", marginBottom: 14 }}>
                                    {symptoms.map(s => <button key={s.name} className=\"btn btn-outline btn-sm\" onClick={() => addComplaint(s)} data-testid={`sym-${s.name}`}><Plus size={12}/> {s.name}</button>)}
                                    </div>
                                {complaints.map((c, i) => (
                                    <div key={i} className=\"grid-3\" style={{ marginBottom: 8, alignItems: \"end\" }}>
                                <div><label className=\"label\">{c.name} ({c.icd})</label><div style={{ fontSize: 12, color: \"var(--muted)\" }}>Selected</div></div>
                                <div><label className=\"label\">Duration</label><input className=\"input\" value={c.duration} onChange={e => setComplaintField(i, \"duration\", e.target.value)} placeholder=\"e.g., 2 weeks\" /></div>
                                <div style={{ display: \"flex\", gap: 8 }}>
                                <div style={{ flex: 1 }}><label className=\"label\">Severity (0-10)</label><input className=\"input\" value={c.severity} onChange={e => setComplaintField(i, \"severity\", e.target.value)} placeholder=\"VAS\"/></div>
                                <button className=\"btn btn-outline btn-sm\" onClick={() => removeComplaint(i)} style={{ alignSelf: \"flex-end\" }}><X size={14}/></button>
                                </div>
                            </div>
                        ))}
                        </div>
                        )}

                            {tab === \"History\" && (
                            <div className=\"card\">
                            <div className=\"section-title\">Known GI Conditions</div>
                            <div style={{ display: \"flex\", gap: 6, flexWrap: \"wrap\", marginBottom: 14 }}>
                                {PREV_GI.map(c => <button key={c} className={\"btn btn-sm \" + (history.known_gi.includes(c) ? \"btn-primary\" : \"btn-outline\")} onClick={() => toggle(history.known_gi, c, (v) => setHistory({...history, known_gi: v}))}>{c}</button>)}
                                    </div>
                                    <div className=\"section-title\">Comorbidities</div>
                                    <div style={{ display: \"flex\", gap: 6, flexWrap: \"wrap\", marginBottom: 14 }}>
                                {COMORB.map(c => <button key={c} className={\"btn btn-sm \" + (history.comorbidities.includes(c) ? \"btn-primary\" : \"btn-outline\")} onClick={() => toggle(history.comorbidities, c, (v) => setHistory({...history, comorbidities: v}))}>{c}</button>)}
                                    </div>
                                    <div className=\"grid-2\">
                                    <div><label className=\"label\">Previous GI surgeries</label><textarea className=\"input\" rows=\"2\" value={history.prev_surgeries} onChange={e => setHistory({...history, prev_surgeries: e.target.value})} /></div>
                                    <div><label className=\"label\">Previous hospitalisations</label><textarea className=\"input\" rows=\"2\" value={history.prev_hosp} onChange={e => setHistory({...history, prev_hosp: e.target.value})} /></div>
                                    <div><label className=\"label\">Prior GI procedures</label><textarea className=\"input\" rows=\"2\" value={history.prev_procedures} onChange={e => setHistory({...history, prev_procedures: e.target.value})} /></div>
                                    <div><label className=\"label\">Allergies (HARD STOP at prescription)</label><textarea className=\"input\" rows=\"2\" value={history.allergies} onChange={e => setHistory({...history, allergies: e.target.value})} data-testid=\"h-allergies\" /></div>
                                    <div><label className=\"label\">Vaccinations (HepA, HepB)</label><input className=\"input\" value={history.vaccinations} onChange={e => setHistory({...history, vaccinations: e.target.value})} /></div>
                                    <div><label className=\"label\">Family history</label><textarea className=\"input\" rows=\"2\" value={history.family_history} onChange={e => setHistory({...history, family_history: e.target.value})} /></div>
                                    </div>
                                    <div className=\"section-title\" style={{ marginTop: 16 }}>Personal & Lifestyle</div>
                                    <div className=\"grid-4\">
                                    <div><label className=\"label\">Smoking</label><select className=\"select\" value={history.smoking} onChange={e => setHistory({...history, smoking: e.target.value})}>{[\"Never\",\"Ex-smoker\",\"Current\"].map(o=><option key={o}>{o}</option>)}</select></div>
                                    <div><label className=\"label\">Alcohol</label><select className=\"select\" value={history.alcohol} onChange={e => setHistory({...history, alcohol: e.target.value})}>{[\"None\",\"Social\",\"Moderate\",\"Heavy\"].map(o=><option key={o}>{o}</option>)}</select></div>
                                    <div><label className=\"label\">Alcohol type</label><input className=\"input\" value={history.alcohol_type} onChange={e => setHistory({...history, alcohol_type: e.target.value})} placeholder=\"Beer/Wine/Spirits\"/></div>
                                    <div><label className=\"label\">Tobacco / Gutka</label><select className=\"select\" value={history.tobacco} onChange={e => setHistory({...history, tobacco: e.target.value})}>{[\"None\",\"Occasional\",\"Regular\"].map(o=><option key={o}>{o}</option>)}</select></div>
                                    <div><label className=\"label\">Dietary</label><select className=\"select\" value={history.dietary} onChange={e => setHistory({...history, dietary: e.target.value})}>{[\"Vegetarian\",\"Non-vegetarian\",\"Vegan\",\"Mixed\"].map(o=><option key={o}>{o}</option>)}</select></div>
                                    <div><label className=\"label\">Physical activity</label><select className=\"select\" value={history.activity} onChange={e => setHistory({...history, activity: e.target.value})}>{[\"Sedentary\",\"Moderate\",\"Active\"].map(o=><option key={o}>{o}</option>)}</select></div>
                                    <div><label className=\"label\">Stress</label><select className=\"select\" value={history.stress} onChange={e => setHistory({...history, stress: e.target.value})}>{[\"Low\",\"Moderate\",\"High\"].map(o=><option key={o}>{o}</option>)}</select></div>
                                    <div><label className=\"label\">Fluid intake</label><select className=\"select\" value={history.fluid_intake} onChange={e => setHistory({...history, fluid_intake: e.target.value})}>{[\"<1L\",\"1-2L\",\">2L\"].map(o=><option key={o}>{o}</option>)}</select></div>
                                    </div>
                                    </div>
                                    )}

                                    {tab === \"Vitals\" && (
                                        <div className=\"card grid-4\">
                                    {[[\"temperature\",\"Temperature (°F)\"],[\"pulse\",\"Pulse (bpm)\"],[\"bp_sys\",\"BP Systolic\"],[\"bp_dia\",\"BP Diastolic\"],[\"resp_rate\",\"Resp Rate\"],[\"spo2\",\"SpO2 %\"],[\"weight\",\"Weight (kg)\"],[\"height\",\"Height (cm)\"],[\"bmi\",\"BMI (auto)\"],[\"waist\",\"Waist (cm)\"],[\"rbs\",\"RBS (mg/dL)\"]].map(([k,l]) => (
                                        <div key={k}><label className=\"label\">{l}</label><input className=\"input\" value={vitals[k]} onChange={e => setVitals({...vitals, [k]: e.target.value})} disabled={k===\"bmi\"} data-testid={`vital-${k}`} /></div>
                                        ))}
                                        </div>
                                        )}

                                    {tab === \"Exam\" && (
                                        <div className=\"card grid-2\">
                                    {[[\"general\",\"General examination\"],[\"inspection\",\"Abdominal inspection\"],[\"palpation\",\"Abdominal palpation\"],[\"percussion\",\"Percussion\"],[\"auscultation\",\"Auscultation\"],[\"pr_exam\",\"Per rectal examination\"],[\"systemic\",\"Systemic findings\"]].map(([k,l]) => (
                                        <div key={k}><label className=\"label\">{l}</label><textarea className=\"input\" rows=\"2\" value={exam[k]} onChange={e => setExam({...exam, [k]: e.target.value})} /></div>
                                        ))}
                                        </div>
                                        )}

                                    {tab === \"Diagnosis\" && (
                                        <div className=\"card\">
                                        <div className=\"section-title\">ICD-10 Quick Add (Gastroenterology)</div>
                                        <div style={{ display: \"flex\", gap: 6, flexWrap: \"wrap\", marginBottom: 14 }}>
                                    {icd.map(d => <button key={d.code} className=\"btn btn-outline btn-sm\" onClick={() => addDiagnosis(d)} data-testid={`icd-${d.code}`}><Plus size={12}/> {d.code} — {d.description}</button>)}
                                </div>
                                    {diagnosis.map((d, i) => (
                                        <div key={i} className=\"grid-4\" style={{ marginBottom: 8, alignItems: \"end\" }}>
                                    <div style={{ gridColumn: \"span 2\" }}><label className=\"label\">{d.code} — {d.description}</label></div>
                                    <div><label className=\"label\">Severity</label><select className=\"select\" value={d.severity} onChange={e => setDiagnosis(diagnosis.map((x, idx) => idx === i ? {...x, severity: e.target.value} : x))}>{[\"Mild\",\"Moderate\",\"Severe\"].map(o=><option key={o}>{o}</option>)}</select></div>
                                    <div style={{ display: \"flex\", gap: 8 }}>
                                    <div style={{ flex: 1 }}><label className=\"label\">Status</label><select className=\"select\" value={d.confirmed} onChange={e => setDiagnosis(diagnosis.map((x, idx) => idx === i ? {...x, confirmed: e.target.value} : x))}>{[\"Provisional\",\"Confirmed\",\"Differential\"].map(o=><option key={o}>{o}</option>)}</select></div>
                                    <button className=\"btn btn-outline btn-sm\" onClick={() => removeDx(i)} style={{ alignSelf: \"flex-end\" }}><X size={14}/></button>
                                    </div>
                                    </div>
                                    ))}
                                    </div>
                                    )}

                                        {tab === \"Investigations\" && (
                                        <div className=\"card\">
                                        <div className=\"section-title\">Order Investigations</div>
                                        <div style={{ display: \"flex\", gap: 6, flexWrap: \"wrap\", marginBottom: 12 }}>
                                            {[\"LFT\",\"CBC\",\"KFT\",\"HBsAg\",\"Anti-HCV\",\"HBV DNA\",\"HCV RNA\",\"AFP\",\"CEA\",\"CA 19-9\",\"Stool R&M\",\"Stool Occult Blood\",\"H. pylori Stool Ag\",\"Calprotectin\",\"Urine R&M\",\"PT/INR\",\"Ammonia\",\"HbA1c\",\"USG Abdomen\",\"CECT Abdomen\",\"MRI/MRCP\",\"Fibroscan\",\"Upper GI Endoscopy\",\"Colonoscopy\",\"ERCP\",\"EUS\"].map(t => (
                                            <button key={t} className={\"btn btn-sm \" + (investigations.includes(t) ? \"btn-primary\" : \"btn-outline\")} onClick={() => toggle(investigations, t, setInvestigations)} data-testid={`inv-${t}`}>{t}</button>
                                            ))}
                                            </div>
                                            </div>
                                            )}

                                            {tab === \"Prescription\" && (
                                            <div className=\"card\">
                                            <div className=\"section-title\">Apply Template</div>
                                            <div style={{ display: \"flex\", gap: 6, flexWrap: \"wrap\", marginBottom: 14 }}>
                                                {templates.map(t => <button key={t.name} className=\"btn btn-outline btn-sm\" onClick={() => applyTemplate(t)} data-testid={`tpl-${t.name}`}>{t.name}</button>)}
                                                </div>
                                                    <div className=\"section-title\">Add Drug</div>
                                                <div style={{ display: \"flex\", gap: 6, flexWrap: \"wrap\", marginBottom: 12 }}>
                                                    {drugs.map(d => <button key={d.name} className=\"btn btn-outline btn-sm\" onClick={() => addDrug(d)}><Plus size={12}/> {d.name}</button>)}
                                                    </div>
                                                        {prescription.map((p, i) => (
                                                            <div key={i} className=\"card\" style={{ marginBottom: 8, padding: \".75rem\" }}>
                                                        <div className=\"grid-4\" style={{ alignItems: \"end\" }}>
                                                        <div><label className=\"label\">Drug</label><input className=\"input\" value={p.drug} onChange={e => setRxField(i, \"drug\", e.target.value)} /></div>
                                                        <div><label className=\"label\">Dose</label><input className=\"input\" value={p.dose} onChange={e => setRxField(i, \"dose\", e.target.value)} /></div>
                                                        <div><label className=\"label\">Frequency</label><select className=\"select\" value={p.frequency} onChange={e => setRxField(i, \"frequency\", e.target.value)}>{FREQ.map(o=><option key={o}>{o}</option>)}</select></div>
                                                        <div><label className=\"label\">Timing</label><select className=\"select\" value={p.timing} onChange={e => setRxField(i, \"timing\", e.target.value)}>{TIMING.map(o=><option key={o}>{o}</option>)}</select></div>
                                                        <div><label className=\"label\">Route</label><select className=\"select\" value={p.route} onChange={e => setRxField(i, \"route\", e.target.value)}>{ROUTE.map(o=><option key={o}>{o}</option>)}</select></div>
                                                        <div><label className=\"label\">Duration</label><input className=\"input\" value={p.duration} onChange={e => setRxField(i, \"duration\", e.target.value)} /></div>
                                                        <div style={{ gridColumn: \"span 2\", display: \"flex\", gap: 8 }}>
                                                        <div style={{ flex: 1 }}><label className=\"label\">Instructions</label><input className=\"input\" value={p.instructions} onChange={e => setRxField(i, \"instructions\", e.target.value)} /></div>
                                                        <button className=\"btn btn-outline btn-sm\" onClick={() => removeRx(i)} style={{ alignSelf: \"flex-end\" }}><X size={14}/></button>
                                                        </div>
                                                        </div>
                                                        </div>
                                                        ))}
                                                        </div>
                                                        )}

                                                            {tab === \"Plan\" && (
                                                            <div className=\"card\">
                                                            <label className=\"label\">Plan & Follow-up notes</label>
                                                            <textarea className=\"input\" rows=\"5\" value={planNotes} onChange={e => setPlanNotes(e.target.value)} data-testid=\"plan-notes\" />
                                                            </div>
                                                            )}

                                                            {err && <div className=\"alert-red\" style={{ marginTop: 12 }}>{err}</div>}
                                                            <div style={{ marginTop: 14, display: \"flex\", gap: 8 }}>
                                                            <button className=\"btn btn-primary\" onClick={submit} data-testid=\"save-visit\">Save Visit</button>
                                                            <button className=\"btn btn-outline\" onClick={() => nav(-1)}>Cancel</button>
                                                            </div>
                                                            </div>
                                                            );
                                                            }
                                                                "