import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

/**
 * Privacy Policy Page
 * Design: Mobile-native banking app style
 */
export default function Privacy() {
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
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 w-full overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Introduction</h2>
            <p className="text-base text-gray-600 leading-relaxed">
              Goodleaf Online Loans ("we" or "us" or "our") operates the Goodleaf Online Loans application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our application and the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Information Collection and Use</h2>
            <p className="text-base text-gray-600 leading-relaxed mb-3">
              We collect several different types of information for various purposes to provide and improve our application to you.
            </p>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Data:</h3>
                <p className="text-base text-gray-600">
                  While using our application, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:
                </p>
                <ul className="mt-2 space-y-1 text-base text-gray-600 ml-4">
                  <li>• Email address</li>
                  <li>• Phone number</li>
                  <li>• First name and last name</li>
                  <li>• Address, State, Province, ZIP/Postal code, City</li>
                  <li>• Cookies and Usage Data</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Use of Data</h2>
            <p className="text-base text-gray-600 leading-relaxed mb-3">
              Goodleaf Online Loans uses the collected data for various purposes:
            </p>
            <ul className="space-y-2 text-base text-gray-600">
              <li>• To provide and maintain our application</li>
              <li>• To notify you about changes to our application</li>
              <li>• To allow you to participate in interactive features of our application when you choose to do so</li>
              <li>• To provide customer support</li>
              <li>• To gather analysis or valuable information so that we can improve our application</li>
              <li>• To monitor the usage of our application</li>
              <li>• To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Security of Data</h2>
            <p className="text-base text-gray-600 leading-relaxed">
              The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Changes to This Privacy Policy</h2>
            <p className="text-base text-gray-600 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the bottom of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact Us</h2>
            <p className="text-base text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-3 text-base text-gray-600">
              <p>Email: privacy@goodleafloans.com</p>
              <p>Phone: +260 123 456 789</p>
            </div>
          </section>

          <div className="pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">Last updated: January 2026</p>
          </div>
        </div>
      </main>
    </div>
  );
}
