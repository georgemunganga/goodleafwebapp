import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

/**
 * Terms of Service Page
 * Design: Mobile-native banking app style
 */
export default function Terms() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden pb-24">
      {/* Header - Green gradient */}
      <header className="bg-gradient-to-r from-[#2e7146] to-[#1d4a2f] text-white flex-shrink-0">
        <div className="px-5 pt-6 pb-6 w-full">
          <button
            onClick={() => setLocation("/login")}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-bold">Terms of Service</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 w-full overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p className="text-base text-gray-600 leading-relaxed">
              By accessing and using the Goodleaf Online Loans application, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Use License</h2>
            <p className="text-base text-gray-600 leading-relaxed mb-3">
              Permission is granted to temporarily download one copy of the materials (information or software) on Goodleaf Online Loans for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="space-y-2 text-base text-gray-600">
              <li>• Modifying or copying the materials</li>
              <li>• Using the materials for any commercial purpose or for any public display</li>
              <li>• Attempting to decompile or reverse engineer any software contained on the application</li>
              <li>• Removing any copyright or other proprietary notations from the materials</li>
              <li>• Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Disclaimer</h2>
            <p className="text-base text-gray-600 leading-relaxed">
              The materials on Goodleaf Online Loans are provided on an 'as is' basis. Goodleaf makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Limitations</h2>
            <p className="text-base text-gray-600 leading-relaxed">
              In no event shall Goodleaf or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Goodleaf Online Loans.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Accuracy of Materials</h2>
            <p className="text-base text-gray-600 leading-relaxed">
              The materials appearing on Goodleaf Online Loans could include technical, typographical, or photographic errors. Goodleaf does not warrant that any of the materials on its application are accurate, complete, or current.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Links</h2>
            <p className="text-base text-gray-600 leading-relaxed">
              Goodleaf has not reviewed all of the sites linked to its application and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Goodleaf of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Modifications</h2>
            <p className="text-base text-gray-600 leading-relaxed">
              Goodleaf may revise these terms of service for its application at any time without notice. By using this application, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Governing Law</h2>
            <p className="text-base text-gray-600 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of Zambia, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <div className="pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">Last updated: January 2026</p>
          </div>
        </div>
      </main>
    </div>
  );
}
