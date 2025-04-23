import { useLocation, useNavigate } from "react-router-dom";  // <-- ✅ Add useNavigate
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import Header from "../components/Header"; 

function DiseaseEngine() {
  const location = useLocation();
  const navigate = useNavigate(); // <-- ✅
  const extractedData = location.state?.extractedData;

  // Redirect to sign-in page if the user is not logged in
  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Set initial state based on the extracted data
  const [modifiedData, setModifiedData] = useState({
    patientDetails: {
      medicalRecordNo: extractedData?.patientDetails?.medicalRecordNo || '',
      name: extractedData?.patientDetails?.name || '',
      providerName: extractedData?.patientDetails?.providerName || '',
      principalDiagnosis: extractedData?.patientDetails?.principalDiagnosis || '',
      pertinentdiagnosis: extractedData?.patientDetails?.pertinentdiagnosis || ''
    },
    diagnosis: {
      pertinentdiagnosisCont: extractedData?.diagnosis?.pertinentdiagnosisCont || '',
      constipated: extractedData?.diagnosis?.constipated || false,
      painIn: extractedData?.diagnosis?.painIn || '',
      diabetec: extractedData?.diagnosis?.diabetec || false,
      oxygen: extractedData?.diagnosis?.oxygen || false,
      depression: extractedData?.diagnosis?.depression || false
    },
    medications: {
      medications: extractedData?.medications?.medications || '',
      painMedications: extractedData?.medications?.painMedications || ''
    },
    extraDetails: {
      safetyMeasures: extractedData?.extraDetails?.safetyMeasures || '',
      nutritionalReq: extractedData?.extraDetails?.nutritionalReq || '',
      nutritionalReqCont: extractedData?.extraDetails?.nutritionalReqCont || '',
      edema: extractedData?.extraDetails?.edema || '',
      vertigo: extractedData?.extraDetails?.vertigo || false,
      palpitation: extractedData?.extraDetails?.palpitation || false,
      can: extractedData?.extraDetails?.can || false,
      walker: extractedData?.extraDetails?.walker || false
    }
  });

  const [processing, setProcessing] = useState(false);  
  const [processedData, setProcessedData] = useState(null);

  // Handle changes in editable fields
  const handleChange = (field, value) => {
    const updatedData = { ...modifiedData };

    // Split the field to handle nested state update
    if (field.includes('.')) {
      const [section, key] = field.split('.'); 
      updatedData[section][key] = value; // Update the nested field
    } else {
      updatedData[field] = value; // Update top-level field
    }

    setModifiedData(updatedData); // Set the new state
  };


  const handleRunDiseaseProcessing = async () => {
    setProcessing(true);

    try {
      // Send updated extracted data to the backend for saving
      const response = await axios.post("https://pdf-auto-bd-78m3.onrender.com/save-extracted-data", modifiedData);
      // console.log("Data saved:", response.data);

      // Send data for processing
      const processResponse = await axios.post("https://pdf-auto-bd-78m3.onrender.com/disease-processing/", modifiedData);
      // console.log("Disease Processing Result:", processResponse.data);
      setProcessedData(processResponse.data);
  
      // Move to next page with the processed data
      navigate("/diseaseEngine", { state: { processedData: processResponse.data } });
  
    } catch (error) {
      console.error('Disease processing failed:', error);
      alert("Disease processing failed. Please try again.");
    } finally {
      setProcessing(false);
    }
};
  return (
    <div className="bg-light" style={{ height: '100vh' }}>
    <Header backgroundColor="#FF9B17"/>
    <div className="container py-5">
      <div className="card p-5 shadow-lg">
        <h1 className="text-center mb-4">Disease Engine</h1>

        {/* Editable sections for each part of extracted data */}
        <h5>Patient Details</h5>
        <div className="mb-3">
          <label className="form-label">Medical Record No</label>
          <input 
            type="text" 
            className="form-control"
            value={modifiedData.patientDetails.medicalRecordNo}
            onChange={(e) => handleChange("patientDetails.medicalRecordNo", e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input 
            type="text" 
            className="form-control"
            value={modifiedData.patientDetails.name}
            onChange={(e) => handleChange("patientDetails.name", e.target.value)}
          />
        </div>


        <div className="mb-3">
          <label className="form-label">Provider Name</label>
          <input 
            type="text" 
            className="form-control"
            value={modifiedData.patientDetails.providerName}
            onChange={(e) => handleChange("patientDetails.providerName", e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Principal Diagnosis</label>
          <input 
            type="text" 
            className="form-control"
            value={modifiedData.patientDetails.principalDiagnosis}
            onChange={(e) => handleChange("patientDetails.principalDiagnosis", e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Pertinent Diagnosis</label>
          <textarea 
            className="form-control"
            value={modifiedData.patientDetails.pertinentdiagnosis}
            onChange={(e) => handleChange("patientDetails.pertinentdiagnosis", e.target.value)}
          />
        </div>

        <h5>Diagnosis</h5>
        <div className="mb-3">
          <label className="form-label">Pertinent Diagnosis Continued</label>
          <textarea 
            className="form-control"
            value={modifiedData.diagnosis.pertinentdiagnosisCont}
            onChange={(e) => handleChange("diagnosis.pertinentdiagnosisCont", e.target.value)}
          />
        </div>

          <div className="mb-3">
            <label className="form-label">Constipated</label>
            <select 
              className="form-select"
              value={modifiedData.diagnosis.constipated}
              onChange={(e) => handleChange("diagnosis.constipated", e.target.value === "true")}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

        <div className="mb-3">
          <label className="form-label">Pain In</label>
          <input 
            type="text" 
            className="form-control"
            value={modifiedData.diagnosis.painIn}
            onChange={(e) => handleChange("diagnosis.painIn", e.target.value)}
          />
        </div>

        <div className="mb-3">
            <label className="form-label">Diabetec</label>
            <select 
              className="form-select"
              value={modifiedData.diagnosis.diabetec}
              onChange={(e) => handleChange("diagnosis.diabetec", e.target.value === "true")}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Oxygen</label>
            <select 
              className="form-select"
              value={modifiedData.diagnosis.oxygen}
              onChange={(e) => handleChange("diagnosis.oxygen", e.target.value === "true")}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Depression</label>
            <select 
              className="form-select"
              value={modifiedData.diagnosis.depression}
              onChange={(e) => handleChange("diagnosis.depression", e.target.value === "true")}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>



        <h5>Medications</h5>
        <div className="mb-3">
          <label className="form-label">Medications</label>
          <textarea 
            className="form-control"
            value={modifiedData.medications.medications}
            onChange={(e) => handleChange("medications.medications", e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Pain Medications</label>
          <textarea 
            className="form-control"
            value={modifiedData.medications.painMedications}
            onChange={(e) => handleChange("medications.painMedications", e.target.value)}
          />
        </div>

        <h5>Extra Details</h5>
        <div className="mb-3">
          <label className="form-label">Safety Measures</label>
          <textarea 
            className="form-control"
            value={modifiedData.extraDetails.safetyMeasures}
            onChange={(e) => handleChange("extraDetails.safetyMeasures", e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nutritional Requirements</label>
          <textarea 
            className="form-control"
            value={modifiedData.extraDetails.nutritionalReq}
            onChange={(e) => handleChange("extraDetails.nutritionalReq", e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nutritional Requirements Continued</label>
          <textarea 
            className="form-control"
            value={modifiedData.extraDetails.nutritionalReqCont}
            onChange={(e) => handleChange("extraDetails.nutritionalReqCont", e.target.value)}
          />
        </div>


        <div className="mb-3">
          <label className="form-label">Edema</label>
          <input 
            type="text" 
            className="form-control"
            value={modifiedData.extraDetails.edema}
            onChange={(e) => handleChange("extraDetails.edema", e.target.value)}
          />
        </div>

        <div className="mb-3">
            <label className="form-label">Vertigo</label>
            <select 
              className="form-select"
              value={modifiedData.extraDetails.vertigo}
              onChange={(e) => handleChange("extraDetails.vertigo", e.target.value === "true")}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Palpitation</label>
            <select 
              className="form-select"
              value={modifiedData.extraDetails.palpitation}
              onChange={(e) => handleChange("extraDetails.palpitation", e.target.value === "true")}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Can</label>
            <select 
              className="form-select"
              value={modifiedData.extraDetails.can}
              onChange={(e) => handleChange("extraDetails.can", e.target.value === "true")}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Walker</label>
            <select 
              className="form-select"
              value={modifiedData.extraDetails.walker}
              onChange={(e) => handleChange("extraDetails.walker", e.target.value === "true")}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

        <div className="text-center mt-4">
          <button
            className="btn btn-success btn-lg"
            style={{backgroundColor: "#FF9B17", transition: "background-color 0.3s ease, transform 0.3s ease"}}
            onClick={handleRunDiseaseProcessing}
            disabled={processing}
          >
            {processing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              "Run Disease Processing"
            )}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default DiseaseEngine;
