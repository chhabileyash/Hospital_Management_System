"import React from \"react\";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from \"react-router-dom\";
import { AuthProvider, useAuth } from \"@/context/AuthContext\";
import Login from \"@/pages/Login\";
import Layout from \"@/components/Layout\";
import Dashboard from \"@/pages/Dashboard\";
import Patients from \"@/pages/Patients\";
import PatientNew from \"@/pages/PatientNew\";
import PatientDetail from \"@/pages/PatientDetail\";
import OPDVisitNew from \"@/pages/OPDVisitNew\";
import VisitDetail from \"@/pages/VisitDetail\";
import IPDList from \"@/pages/IPDList\";
import AdmissionNew from \"@/pages/AdmissionNew\";
import AdmissionDetail from \"@/pages/AdmissionDetail\";
import Analytics from \"@/pages/Analytics\";
import { Toaster } from \"sonner\";

function Protected() {
  const { user } = useAuth();
  if (user === null) return <div style={{ padding: 40 }}>Loading…</div>;
  if (!user) return <Navigate to=\"/login\" replace />;
  return <Layout><Outlet /></Layout>;
}

export default function App() {
  return (
      <AuthProvider>
        <Toaster position=\"top-right\" richColors />
        <BrowserRouter>
          <Routes>
            <Route path=\"/login\" element={<Login />} />
            <Route element={<Protected />}>
              <Route path=\"/\" element={<Dashboard />} />
              <Route path=\"/patients\" element={<Patients />} />
              <Route path=\"/patients/new\" element={<PatientNew />} />
              <Route path=\"/patients/:id\" element={<PatientDetail />} />
              <Route path=\"/opd/new/:patientId\" element={<OPDVisitNew />} />
              <Route path=\"/visits/:id\" element={<VisitDetail />} />
              <Route path=\"/ipd\" element={<IPDList />} />
              <Route path=\"/ipd/new/:patientId\" element={<AdmissionNew />} />
              <Route path=\"/admissions/:id\" element={<AdmissionDetail />} />
              <Route path=\"/analytics\" element={<Analytics />} />
            </Route>
            <Route path=\"*\" element={<Navigate to=\"/\" replace />} />
              </Routes>
              </BrowserRouter>
              </AuthProvider>
              );
            }
              "