import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import FormBuilder from "@/react-app/pages/FormBuilder";
import PublicForm from "@/react-app/pages/PublicForm";
import FormResults from "@/react-app/pages/FormResults";
import CreatedForms from "@/react-app/pages/CreatedForms";
import AllResponses from "@/react-app/pages/AllResponses";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder" element={<FormBuilder />} />
        <Route path="/form/:id" element={<PublicForm />} />
        <Route path="/results/:id" element={<FormResults />} />
        <Route path="/created" element={<CreatedForms />} />
        <Route path="/responses" element={<AllResponses />} />
      </Routes>
    </Router>
  );
}
