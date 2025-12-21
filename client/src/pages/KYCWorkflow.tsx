import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";
import { Upload, ChevronLeft, ChevronRight, CheckCircle2, FileText, Check } from "lucide-react";

type KYCStep = 1 | 2;

/**
 * KYC Workflow Page
 * Design: Mobile-native banking app style
 * - Step 1: Basic Information & Guarantor Details
 * - Step 2: Dynamic Document Uploads
 */
export default function KYCWorkflow() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<KYCStep>(1);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  const [basicInfo, setBasicInfo] = useState({
    nationalId: "",
    idType: "nrc",
    salary: "",
    guarantor1Name: "",
    guarantor1Phone: "",
    guarantor2Name: "",
    guarantor2Phone: ""
  });

  const requiredDocuments = [
    "National ID or Passport",
    "3 Months Payslip",
    "Proof of Address"
  ];

  const handleBasicInfoChange = (field: string, value: string) => {
    setBasicInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDocumentUpload = (docName: string) => {
    if (!uploadedDocs.includes(docName)) {
      setUploadedDocs([...uploadedDocs, docName]);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as KYCStep);
    } else {
      setLocation("/apply");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation("/dashboard");
  };

  const stepLabels = ["Information", "Documents"];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center -ml-2"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="flex-1 text-center font-bold text-slate-900">
            KYC Verification
          </h1>
          <div className="w-10"></div>
        </div>

        {/* Progress Steps */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step < currentStep
                        ? "bg-primary text-white"
                        : step === currentStep
                        ? "bg-primary text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {step < currentStep ? <Check className="w-4 h-4" /> : step}
                  </div>
                  <span className={`text-[10px] mt-1 ${step <= currentStep ? "text-primary font-medium" : "text-slate-500"}`}>
                    {stepLabels[step - 1]}
                  </span>
                </div>
                {step < 2 && (
                  <div
                    className={`h-0.5 flex-1 -mt-4 mx-1 ${
                      step < currentStep ? "bg-primary" : "bg-slate-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 pb-24">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Your Information
              </h2>
              <p className="text-sm text-slate-600">
                Provide your ID and income details
              </p>
            </div>

            {/* ID Information */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <h3 className="font-bold text-slate-900 mb-3 text-sm">ID Information</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ID Type
                  </label>
                  <select
                    value={basicInfo.idType}
                    onChange={(e) => handleBasicInfoChange("idType", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-0 text-sm bg-white"
                  >
                    <option value="nrc">National Registration Card</option>
                    <option value="passport">Passport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ID Number
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your ID number"
                    value={basicInfo.nationalId}
                    onChange={(e) => handleBasicInfoChange("nationalId", e.target.value)}
                    className="h-11 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Monthly Salary (ZMW)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 10000"
                    value={basicInfo.salary}
                    onChange={(e) => handleBasicInfoChange("salary", e.target.value)}
                    className="h-11 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Guarantors */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <h3 className="font-bold text-slate-900 mb-3 text-sm">Guarantors</h3>
              
              {[1, 2].map((num) => (
                <div key={num} className={`space-y-3 ${num === 1 ? "mb-4 pb-4 border-b border-slate-100" : ""}`}>
                  <p className="text-xs font-medium text-slate-500">Guarantor {num}</p>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Full name"
                      value={basicInfo[`guarantor${num}Name` as keyof typeof basicInfo]}
                      onChange={(e) => handleBasicInfoChange(`guarantor${num}Name`, e.target.value)}
                      className="h-11 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="+260 123 456 789"
                      value={basicInfo[`guarantor${num}Phone` as keyof typeof basicInfo]}
                      onChange={(e) => handleBasicInfoChange(`guarantor${num}Phone`, e.target.value)}
                      className="h-11 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-0"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Next Button */}
            <Button
              onClick={handleNext}
              className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold h-12"
            >
              Continue <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        )}

        {/* Step 2: Document Uploads */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Upload Documents
              </h2>
              <p className="text-sm text-slate-600">
                {uploadedDocs.length} of {requiredDocuments.length} uploaded
              </p>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(uploadedDocs.length / requiredDocuments.length) * 100}%` }}
              ></div>
            </div>

            {/* Document List */}
            <div className="space-y-3">
              {requiredDocuments.map((doc) => {
                const isUploaded = uploadedDocs.includes(doc);
                return (
                  <label
                    key={doc}
                    className={`block bg-white rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                      isUploaded ? "border-green-300 bg-green-50" : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isUploaded ? "bg-green-100" : "bg-slate-100"
                      }`}>
                        {isUploaded ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${isUploaded ? "text-green-800" : "text-slate-900"}`}>
                          {doc}
                        </p>
                        <p className="text-xs text-slate-500">
                          {isUploaded ? "Uploaded" : "Tap to upload"}
                        </p>
                      </div>
                      {!isUploaded && (
                        <Upload className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      onChange={() => handleDocumentUpload(doc)}
                      accept="image/*,.pdf"
                      className="hidden"
                    />
                  </label>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="flex-1 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold h-12"
              >
                <ChevronLeft className="w-5 h-5 mr-1" /> Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={uploadedDocs.length < requiredDocuments.length}
                className="flex-1 rounded-xl bg-primary hover:bg-primary/90 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold h-12"
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
