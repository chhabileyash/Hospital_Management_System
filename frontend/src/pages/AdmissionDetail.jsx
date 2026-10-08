"import React, { useEffect, useState } from \"react\";
import api, { formatErr } from \"@/lib/api\";
import { useParams } from \"react-router-dom\";
import { toast } from \"sonner\";

export default function AdmissionDetail() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [tab, setTab] = useState(\"overview\");
    const [note, setNote] = useState({ soap_s: \"\", soap_o: \"\", soap_a: \"\", soap_p: \"\", vitals: {}, complications: [] });
    const [dc, setDc] = useState({ discharge_type: \"Treated & Discharged\", final_diagnosis: [], procedures_done: [], hospital_course: \"\", condition_at_discharge: \"Improved\", discharge_meds: [], diet_instructions: \"\", activity_restrictions: \"\", follow_up_date: \"\", follow_up_doctor: \"\", follow_up_investigations: [], red_flag_symptoms: [], clinical_scores: {} });
    const [err, setErr] = useState(\"\");

    const load = () => api.get(`/admissions/${id}`).then(r => setData(r.data));
    useEffect(() => { load(); }, [id]);

    const addNote = async () => {
        try {
            await api.post(\"/progress-notes\", { admission_id: id, ...note });
            toast.success(\"Progress note added\");
            setNote({ soap_s: \"\", soap_o: \"\", soap_a: \"\", soap_p: \"\", vitals: {}, complications: [] });
            load();
        } catch (e) { setErr(formatErr(e.response?.data?.detail)); }
        };
        const discharge = async () => {
            try {
                // copy final diagnosis from admission
                const payload = { ...dc, admission_id: id, final_diagnosis: data.admission.admission_diagnosis || [] };
                await api.post(\"/discharge\", payload);
                toast.success(\"Patient discharged\");
                load();
            } catch (e) { setErr(formatErr(e.response?.data?.detail)); }
        };

        if (!data) return <div>Loading…</div>;
        const a = data.admission, p = data.patient;
        const discharged = !!data.discharge;
        return (
            <div data-testid=\"admission-detail\">
        <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 12, color: \"var(--muted)\", fontFamily: \"monospace\" }}>{a.admission_id}</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: \"2px 0\" }}>{p?.full_name} — {a.ward} / Bed {a.bed_number}</h1>
        <div style={{ color: \"var(--muted)\", fontSize: 13 }}>
        <span className={\"tag \" + (a.status === \"active\" ? \"tag-amber\" : \"tag-green\")}>{a.status}</span> · Admitted {new Date(a.admission_date).toLocaleString()}
            {a.los_days && ` · LOS ${a.los_days} days`}
        </div>
        </div>
            <div className=\"tabs\">
            {[\"overview\",\"progress\",\"discharge\"].map(t => <div key={t} className={\"tab\" + (tab === t ? \" active\" : \"\")} onClick={() => setTab(t)} data-testid={`adm-tab-${t}`}>{t}</div>)}
            </div>

                {tab === \"overview\" && (
                <div className=\"grid-2\">
                <div className=\"card\">
                <div className=\"section-title\">Admission Details</div>
                <div style={{ fontSize: 13, lineHeight: 1.9 }}>
                <div><b>Type:</b> {a.admission_type}</div>
                    <div><b>Source:</b> {a.admission_source}</div>
                    <div><b>Doctor:</b> {a.admitting_doctor}</div>
                    <div><b>Expected LOS:</b> {a.expected_los}</div>
                    <div><b>Consent:</b> {(a.consent || []).join(\", \")}</div>
                        </div>
                        </div>
                        <div className=\"card\">
                        <div className=\"section-title\">Admission Diagnosis</div>
                    {(a.admission_diagnosis || []).map((d, i) => <div key={i} style={{ fontSize: 13 }}>• <b>{d.code}</b> — {d.description}</div>)}
                    <div className=\"section-title\" style={{ marginTop: 12 }}>Attendant</div>
                <div style={{ fontSize: 13 }}>{a.attendant_name} ({a.attendant_relation}) · {a.attendant_mobile}</div>
                </div>
                </div>
                )}

                {tab === \"progress\" && (
                <>
                {!discharged && (
                    <div className=\"card\" style={{ marginBottom: 14 }}>
                <div className=\"section-title\">Add Progress Note (SOAP)</div>
                <div className=\"grid-2\">
                <div><label className=\"label\">S — Subjective</label><textarea className=\"input\" rows=\"2\" value={note.soap_s} onChange={e => setNote({...note, soap_s: e.target.value})} data-testid=\"soap-s\" /></div>
                <div><label className=\"label\">O — Objective</label><textarea className=\"input\" rows=\"2\" value={note.soap_o} onChange={e => setNote({...note, soap_o: e.target.value})} data-testid=\"soap-o\" /></div>
                <div><label className=\"label\">A — Assessment</label><textarea className=\"input\" rows=\"2\" value={note.soap_a} onChange={e => setNote({...note, soap_a: e.target.value})} data-testid=\"soap-a\" /></div>
                <div><label className=\"label\">P — Plan</label><textarea className=\"input\" rows=\"2\" value={note.soap_p} onChange={e => setNote({...note, soap_p: e.target.value})} data-testid=\"soap-p\" /></div>
                </div>
                    {err && <div className=\"alert-red\" style={{ marginTop: 10 }}>{err}</div>}
                    <button className=\"btn btn-primary\" style={{ marginTop: 10 }} onClick={addNote} data-testid=\"save-soap\">Add Note</button>
                    </div>
                    )}
                    <div className=\"section-title\">Notes Timeline</div>
                    {data.progress_notes.length === 0 && <div className=\"card\" style={{ color: \"var(--muted)\" }}>No notes yet</div>}
                        {data.progress_notes.map((n, i) => (
                            <div key={i} className=\"card\" style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 12, color: \"var(--muted)\" }}>{new Date(n.created_at).toLocaleString()} · {n.author_name}</div>
                        <div style={{ fontSize: 13, marginTop: 6 }}>
                        <div><b>S:</b> {n.soap_s}</div>
                            <div><b>O:</b> {n.soap_o}</div>
                            <div><b>A:</b> {n.soap_a}</div>
                            <div><b>P:</b> {n.soap_p}</div>
                        </div>
                        </div>
                        ))}
                        </>
                        )}

                            {tab === \"discharge\" && (
                                discharged ? (
                                    <div className=\"card\">
                                    <div className=\"section-title\">Discharge Summary</div>
                            <div style={{ fontSize: 13, lineHeight: 1.9 }}>
                            <div><b>Type:</b> {data.discharge.discharge_type}</div>
                                <div><b>LOS:</b> {data.discharge.los_days} days</div>
                                <div><b>Condition:</b> {data.discharge.condition_at_discharge}</div>
                                <div><b>Hospital course:</b> {data.discharge.hospital_course}</div>
                                <div><b>Diet:</b> {data.discharge.diet_instructions}</div>
                                <div><b>Follow-up:</b> {data.discharge.follow_up_date} with {data.discharge.follow_up_doctor}</div>
                                <div><b>Red flag symptoms:</b> {(data.discharge.red_flag_symptoms || []).join(\", \")}</div>
                                    </div>
                                    </div>
                                    ) : (
                                    <div className=\"card\">
                                    <div className=\"section-title\">Create Discharge Summary</div>
                                    <div className=\"grid-2\">
                                    <div><label className=\"label\">Discharge type</label><select className=\"select\" value={dc.discharge_type} onChange={e => setDc({...dc, discharge_type: e.target.value})}>{[\"Treated & Discharged\",\"LAMA\",\"Referral\",\"Expiry\",\"Transfer\"].map(o=><option key={o}>{o}</option>)}</select></div>
                                    <div><label className=\"label\">Condition at discharge</label><select className=\"select\" value={dc.condition_at_discharge} onChange={e => setDc({...dc, condition_at_discharge: e.target.value})}>{[\"Stable\",\"Improved\",\"Same\",\"Deteriorated\"].map(o=><option key={o}>{o}</option>)}</select></div>
                                    <div style={{ gridColumn: \"span 2\" }}><label className=\"label\">Hospital course</label><textarea className=\"input\" rows=\"4\" value={dc.hospital_course} onChange={e => setDc({...dc, hospital_course: e.target.value})} data-testid=\"dc-course\" /></div>
                                    <div><label className=\"label\">Diet instructions</label><textarea className=\"input\" rows=\"2\" value={dc.diet_instructions} onChange={e => setDc({...dc, diet_instructions: e.target.value})} /></div>
                                    <div><label className=\"label\">Activity restrictions</label><textarea className=\"input\" rows=\"2\" value={dc.activity_restrictions} onChange={e => setDc({...dc, activity_restrictions: e.target.value})} /></div>
                                    <div><label className=\"label\">Follow-up date</label><input type=\"date\" className=\"input\" value={dc.follow_up_date} onChange={e => setDc({...dc, follow_up_date: e.target.value})} /></div>
                                    <div><label className=\"label\">Follow-up doctor</label><input className=\"input\" value={dc.follow_up_doctor} onChange={e => setDc({...dc, follow_up_doctor: e.target.value})} /></div>
                                    <div style={{ gridColumn: \"span 2\" }}><label className=\"label\">Red-flag symptoms (comma separated)</label><input className=\"input\" value={(dc.red_flag_symptoms||[]).join(\", \")} onChange={e => setDc({...dc, red_flag_symptoms: e.target.value.split(\",\").map(s => s.trim()).filter(Boolean)})} /></div>
                                    </div>
                                {err && <div className=\"alert-red\" style={{ marginTop: 10 }}>{err}</div>}
                                    <button className=\"btn btn-primary\" style={{ marginTop: 12 }} onClick={discharge} data-testid=\"save-discharge\">Generate Discharge Summary</button>
                                    </div>
                                    )
                                    )}
                                    </div>
                                    );
                                }
                                    "