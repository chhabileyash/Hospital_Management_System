"import React, { useEffect, useState } from \"react\";
import api from \"@/lib/api\";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from \"recharts\";

const COLORS = [\"#0d9488\",\"#0ea5e9\",\"#22c55e\",\"#f59e0b\",\"#a855f7\",\"#ef4444\",\"#64748b\",\"#84cc16\"];

export default function Analytics() {
    const [d, setD] = useState(null);
    useEffect(() => { api.get(\"/analytics/overview\").then(r => setD(r.data)); }, []);
        if (!d) return <div>Loading…</div>;
        const k = d.kpi;
        return (
            <div data-testid=\"analytics-page\">
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: \"0 0 18px\" }}>Analytics & Outcome Tracking</h1>
        <div className=\"grid-4\" style={{ marginBottom: 18 }}>
        <div className=\"kpi\"><div className=\"kpi-label\">Total Patients</div><div className=\"kpi-value\">{k.total_patients}</div></div>
        <div className=\"kpi\"><div className=\"kpi-label\">OPD Visits</div><div className=\"kpi-value\">{k.total_visits}</div></div>
        <div className=\"kpi\"><div className=\"kpi-label\">Admissions</div><div className=\"kpi-value\">{k.total_admissions}</div></div>
        <div className=\"kpi\"><div className=\"kpi-label\">Discharged</div><div className=\"kpi-value\">{k.discharged}</div></div>
        </div>
            <div className=\"grid-2\">
            <div className=\"card\">
            <div className=\"section-title\">Disease Distribution</div>
            <div style={{ width: \"100%\", height: 260 }}>
            <ResponsiveContainer>
            <BarChart data={d.disease_distribution}>
                <CartesianGrid strokeDasharray=\"3 3\" stroke=\"#eef2f7\" />
            <XAxis dataKey=\"name\" tick={{ fontSize: 10 }} interval={0} angle={-15} height={50} />
            <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey=\"count\" fill=\"#0d9488\" radius={[6,6,0,0]} />
                </BarChart>
            </ResponsiveContainer>
            </div>
            </div>
                <div className=\"card\">
                <div className=\"section-title\">Referral Source</div>
                <div style={{ width: \"100%\", height: 260 }}>
                <ResponsiveContainer>
                <PieChart>
                <Pie data={d.referral_sources} dataKey=\"count\" nameKey=\"name\" outerRadius={90} label>
                    {d.referral_sources.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                    <Tooltip />
                </PieChart>
                </ResponsiveContainer>
                </div>
                </div>
                    <div className=\"card\">
                    <div className=\"section-title\">Visit Types</div>
                    <div style={{ width: \"100%\", height: 260 }}>
                    <ResponsiveContainer>
                    <PieChart>
                    <Pie data={d.visit_types} dataKey=\"count\" nameKey=\"name\" outerRadius={90} label>
                        {d.visit_types.map((_, i) => <Cell key={i} fill={COLORS[(i+2) % COLORS.length]} />)}
                    </Pie>
                        <Tooltip />
                    </PieChart>
                    </ResponsiveContainer>
                    </div>
                    </div>
                        <div className=\"card\">
                        <div className=\"section-title\">Monthly Visit Trend</div>
                        <div style={{ width: \"100%\", height: 260 }}>
                        <ResponsiveContainer>
                        <LineChart data={d.monthly_visits}>
                            <CartesianGrid strokeDasharray=\"3 3\" stroke=\"#eef2f7\" />
                        <XAxis dataKey=\"month\" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Line type=\"monotone\" dataKey=\"count\" stroke=\"#0ea5e9\" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                        </div>
                        </div>
                        </div>
                        </div>
                        );
                        }
                        "