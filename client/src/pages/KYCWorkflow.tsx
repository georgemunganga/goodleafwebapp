import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";
import { Upload, ChevronLeft, ChevronRight, FileText, CheckCircle2, X } from "lucide-react";

type KYCStep = 1 | 2;

/**
 * KYC Workflow Page
 * Design: Mobile-first responsive with modern branding
 * - Step 1: Basic Information & Guarantor Details
 * - Step 2: Dynamic Document Uploads
 */
export default function KYCWorkflow() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<KYCStep>(1);
  const [loanType] = useState("personal");
  const [loanCategory] = useState("civil-servant");
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  const [basicInfo, setBasicInfo] = useState({
    nationalId: "",
    idType: "nrc",
    salary: "",
    guarantor1Name: "",
    guarantor1Phone: "",
    guarantor1Title: "",
    guarantor2Name: "",
    guarantor2Phone: "",
    guarantor2Title: ""
  });

  const requiredDocuments = {
    "civil-servant": [
      "National ID or Passport",
      "3 Months Payslip"
    ],
    "collateral-vehicle": [
      "National Registration Card (NRC)",
      "3 Months Bank Statements",
      "White Book",
      "Photos of Vehicle"
    ],
    "collateral-property": [
      "National Registration Card (NRC)",
      "3 Months Bank Statements",
      "Copy of Certificate of Title",
      "Lands Registry Search Printout",
      "Pictures of Property",
      "Valuation Report"
    ],
    "business": [
      "NRC of all Directors",
      "Company Registration Documentation",
      "Form 5 or 125 (Limited Company)",
      "6 Months Latest Bank Statements",
      "Financial Statements"
    ]
  };

  const docs = requiredDocuments[loanCategory as keyof typeof requiredDocuments] || [];

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

  const handleRemoveDocument = (docName: string) => {
    setUploadedDocs(uploadedDocs.filter(d => d !== docName));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as KYCStep);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedDocs.length === docs.length) {
      setLocation("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container flex items-center justify-between h-14 md:h-20 px-4 md:px-6">
          <button
            onClick={() => setLocation("/dashboard")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/logo-dark.svg" 
              alt="Goodleaf" 
              className="h-8 md:h-10"
            />
          </button>
          <span className="text-xs md:text-sm font-medium text-slate-600">
            KYC Verification
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container px-4 md:px-6 py-6 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-all ${
                      step <= currentStep
                        ? "bg-primary text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 2 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                        step < currentStep ? "bg-primary" : "bg-slate-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs md:text-sm font-medium text-slate-600">
              <span>Basic Info</span>
              <span>Documents</span>
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                  Verify Your Information
                </h1>
                <p className="text-sm md:text-base text-slate-600">
                  Please provide your identification and income details
                </p>
              </div>

              <form className="space-y-4 md:space-y-6">
                {/* ID Information Section */}
                <div className="p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4">ID Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-slate-900 mb-2">
                        ID Type
                      </label>
                      <select
                        value={basicInfo.idType}
                        onChange={(e) => handleBasicInfoChange("idType", e.target.value)}
                        className="w-full px-3 md:px-4 py-2 md:py-3 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 text-sm md:text-base"
                      >
                        <option value="nrc">National Registration Card (NRC)</option>
                        <option value="passport">Passport</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-slate-900 mb-2">
                        ID Number
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter your ID number"
                        value={basicInfo.nationalId}
                        onChange={(e) => handleBasicInfoChange("nationalId", e.target.value)}
                        className="h-10 md:h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 text-sm md:text-base"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Income Section */}
                <div className="p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4">Income Details</h3>
                  
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-slate-900 mb-2">
                      Current Monthly Salary (ZMW)
                    </label>
                    <Input
                      type="number"
                      placeholder="e.g., 10,000"
                      value={basicInfo.salary}
                      onChange={(e) => handleBasicInfoChange("salary", e.target.value)}
                      className="h-10 md:h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 text-sm md:text-base"
                      required
                    />
                  </div>
                </div>

                {/* Guarantors Section */}
                <div className="p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4">Guarantor Details</h3>
                  
                  {[1, 2].map((num) => (
                    <div key={num} className="mb-6 last:mb-0 pb-6 last:pb-0 border-b border-slate-200 last:border-b-0">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">
                        Guarantor {num}
                      </h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs md:text-sm font-semibold text-slate-900 mb-1">
                            Full Name
                          </label>
                          <Input
                            type="text"
                            placeholder="Full name"
                            value={basicInfo[`guarantor${num}Name` as keyof typeof basicInfo]}
                            onChange={(e) => handleBasicInfoChange(`guarantor${num}Name`, e.target.value)}
                            className="h-10 md:h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 text-sm md:text-base"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs md:text-sm font-semibold text-slate-900 mb-1">
                            Phone Number
                          </label>
                          <Input
                            type="tel"
                            placeholder="+260 123 456 789"
                            value={basicInfo[`guarantor${num}Phone` as keyof typeof basicInfo]}
                            onChange={(e) => handleBasicInfoChange(`guarantor${num}Phone`, e.target.value)}
                            className="h-10 md:h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 text-sm md:text-base"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs md:text-sm font-semibold text-slate-900 mb-1">
                            Job Title
                          </label>
                          <Input
                            type="text"
                            placeholder="e.g., Manager, Teacher"
                            value={basicInfo[`guarantor${num}Title` as keyof typeof basicInfo]}
                            onChange={(e) => handleBasicInfoChange(`guarantor${num}Title`, e.target.value)}
                            className="h-10 md:h-12 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 text-sm md:text-base"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setLocation("/dashboard")}
                    variant="outline"
                    className="flex-1 rounded-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-2 md:py-3 h-10 md:h-12 text-sm md:text-base"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 md:py-3 h-10 md:h-12 text-sm md:text-base flex items-center justify-center gap-2"
                  >
                    Next <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Document Upload */}
          {currentStep === 2 && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                  Upload Required Documents
                </h1>
                <p className="text-sm md:text-base text-slate-600">
                  Please upload all required documents to complete your KYC
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Documents List */}
                <div className="space-y-3 md:space-y-4">
                  {docs.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border-2 border-slate-200 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 md:gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 text-sm md:text-base mb-1">
                            {doc}
                          </h4>
                          <p className="text-xs md:text-sm text-slate-600">
                            PDF, JPG, or PNG • Max 10MB
                          </p>
                        </div>
                        
                        {uploadedDocs.includes(doc) ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-secondary flex-shrink-0" />
                            <button
                              type="button"
                              onClick={() => handleRemoveDocument(doc)}
                              className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                            >
                              <X className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDocumentUpload(doc)}
                            className="px-3 md:px-4 py-2 md:py-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors font-semibold text-xs md:text-sm flex items-center gap-2 flex-shrink-0"
                          >
                            <Upload className="w-4 h-4" />
                            Upload
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload Progress */}
                <div className="p-4 md:p-6 bg-blue-50 rounded-2xl md:rounded-3xl border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm md:text-base font-semibold text-slate-900">
                      Documents Uploaded
                    </p>
                    <p className="text-sm md:text-base font-bold text-primary">
                      {uploadedDocs.length}/{docs.length}
                    </p>
                  </div>
                  <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${(uploadedDocs.length / docs.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 rounded-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-2 md:py-3 h-10 md:h-12 text-sm md:text-base flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" /> Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploadedDocs.length < docs.length}
                    className="flex-1 rounded-full bg-primary hover:bg-primary/90 disabled:bg-slate-300 text-white font-semibold py-2 md:py-3 h-10 md:h-12 text-sm md:text-base"
                  >
                    Submit KYC Documents
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
