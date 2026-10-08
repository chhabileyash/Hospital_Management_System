"import React, { useState } from \"react\";
import api, { formatErr } from \"@/lib/api\";
import { useNavigate } from \"react-router-dom\";
import { toast } from \"sonner\";

const init = {
    full_name: \"\", dob: \"\", age: \"\", gender: \"Male\", mobile: \"\", alt_contact: \"\", email: \"\",
address: \"\", city: \"\", pincode: \"\", state: \"\", nationality: \"Indian\",
govt_id_type: \"\", govt_id_number: \"\", abha_number: \"\", blood_group: \"\",
marital_status: \"\", occupation: \"\", language: \"English\",
patient_source: \"Walk-in\", referring_doctor: \"\", referring_hospital: \"\",
referral_channel: \"\", campaign_tag: \"\",
};

const F = ({ label, name, type = \"text\", value, onChange, options, required, testid }) => (
<div>
<label className=\"label\">{label}{required && \" *\"}</label>
{options ? (
    <select className=\"select\" value={value} onChange={(e) => onChange(name, e.target.value)} required={required} data-testid={testid}>
    {options.map((o) => <option key={o} value={o}>{o}</option>)}
</select>
) : (
    <input className=\"input\" type={type} value={value} onChange={(e) => onChange(name, e.target.value)} required={required} data-testid={testid} />
)}
</div>
);

export default function PatientNew() {
    const [d, setD] = useState(init);
    const [err, setErr] = useState(\"\");
    const nav = useNavigate();
    const set = (k, v) => setD((s) => ({ ...s, [k]: v }));
    const submit = async (e) => {
        e.preventDefault();
        setErr(\"\");
        try {
            const payload = { ...d, age: d.age ? parseInt(d.age) : undefined };
            const { data } = await api.post(\"/patients\", payload);
            toast.success(`Patient registered: ${data.upid}`);
            nav(`/patients/${data.id}`);
        } catch (e2) { setErr(formatErr(e2.response?.data?.detail) || e2.message); }
    };
    return (
        <div data-testid=\"patient-new-page\">
    <h1 style={{ fontSize: 22, fontWeight: 700, margin: \"0 0 18px\" }}>Register Patient</h1>
    <form onSubmit={submit}>
        <div className=\"card\" style={{ marginBottom: 14 }}>
    <div className=\"section-title\">Demographics & Identity</div>
    <div className=\"grid-3\">
    <F label=\"Full name\" name=\"full_name\" value={d.full_name} onChange={set} required testid=\"f-name\" />
    <F label=\"Date of birth\" name=\"dob\" type=\"date\" value={d.dob} onChange={set} testid=\"f-dob\" />
    <F label=\"Age (years)\" name=\"age\" type=\"number\" value={d.age} onChange={set} required testid=\"f-age\" />
    <F label=\"Gender\" name=\"gender\" value={d.gender} onChange={set} options={[\"Male\",\"Female\",\"Transgender\",\"Prefer not to say\"]} required testid=\"f-gender\" />
    <F label=\"Mobile\" name=\"mobile\" value={d.mobile} onChange={set} required testid=\"f-mobile\" />
    <F label=\"Alternate contact\" name=\"alt_contact\" value={d.alt_contact} onChange={set} testid=\"f-alt\" />
    <F label=\"Email\" name=\"email\" type=\"email\" value={d.email} onChange={set} testid=\"f-email\" />
    <F label=\"Blood group\" name=\"blood_group\" value={d.blood_group} onChange={set} options={[\"\",\"A+\",\"A-\",\"B+\",\"B-\",\"O+\",\"O-\",\"AB+\",\"AB-\",\"Unknown\"]} testid=\"f-bg\" />
    <F label=\"Marital status\" name=\"marital_status\" value={d.marital_status} onChange={set} options={[\"\",\"Single\",\"Married\",\"Divorced\",\"Widowed\"]} testid=\"f-marital\" />
    </div>
    </div>
        <div className=\"card\" style={{ marginBottom: 14 }}>
        <div className=\"section-title\">Address</div>
        <div className=\"grid-3\">
        <F label=\"Address\" name=\"address\" value={d.address} onChange={set} required testid=\"f-address\" />
        <F label=\"City\" name=\"city\" value={d.city} onChange={set} required testid=\"f-city\" />
        <F label=\"Pin code\" name=\"pincode\" value={d.pincode} onChange={set} required testid=\"f-pin\" />
        <F label=\"State\" name=\"state\" value={d.state} onChange={set} required testid=\"f-state\" />
        <F label=\"Nationality\" name=\"nationality\" value={d.nationality} onChange={set} testid=\"f-nat\" />
        <F label=\"Language\" name=\"language\" value={d.language} onChange={set} options={[\"English\",\"Hindi\",\"Tamil\",\"Telugu\",\"Bengali\",\"Marathi\",\"Gujarati\",\"Kannada\",\"Malayalam\"]} testid=\"f-lang\" />
        </div>
    </div>
        <div className=\"card\" style={{ marginBottom: 14 }}>
        <div className=\"section-title\">Identity & ABDM</div>
        <div className=\"grid-3\">
        <F label=\"Govt ID type\" name=\"govt_id_type\" value={d.govt_id_type} onChange={set} options={[\"\",\"Aadhaar\",\"PAN\",\"Passport\",\"Driving Licence\"]} testid=\"f-idtype\" />
        <F label=\"Govt ID number\" name=\"govt_id_number\" value={d.govt_id_number} onChange={set} testid=\"f-idnum\" />
        <F label=\"ABHA number\" name=\"abha_number\" value={d.abha_number} onChange={set} testid=\"f-abha\" />
        <F label=\"Occupation\" name=\"occupation\" value={d.occupation} onChange={set} testid=\"f-occ\" />
        </div>
    </div>
        <div className=\"card\" style={{ marginBottom: 14 }}>
        <div className=\"section-title\">Referral & Source</div>
        <div className=\"grid-3\">
        <F label=\"Patient source\" name=\"patient_source\" value={d.patient_source} onChange={set} options={[\"Walk-in\",\"Doctor Referral\",\"Digital Campaign\",\"Insurance\",\"Emergency\"]} required testid=\"f-src\" />
        <F label=\"Referring doctor\" name=\"referring_doctor\" value={d.referring_doctor} onChange={set} testid=\"f-refdoc\" />
        <F label=\"Referring hospital\" name=\"referring_hospital\" value={d.referring_hospital} onChange={set} testid=\"f-refhosp\" />
        <F label=\"Referral channel\" name=\"referral_channel\" value={d.referral_channel} onChange={set} options={[\"\",\"WhatsApp\",\"Google\",\"Social Media\",\"Print Ad\",\"Word of Mouth\"]} testid=\"f-refch\" />
        <F label=\"Campaign tag\" name=\"campaign_tag\" value={d.campaign_tag} onChange={set} testid=\"f-camp\" />
        </div>
    </div>
        {err && <div className=\"alert-red\">{err}</div>}
        <button type=\"submit\" className=\"btn btn-primary\" data-testid=\"submit-patient\">Register Patient</button>
        </form>
        </div>
        );
        }
        "