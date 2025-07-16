"use client";
import Navbar from "@/app/components/navbar/page";
import Footer from "@/app/components/footer/page";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <section className="space-y-4 text-gray-300 leading-relaxed">
          <p>
            Welcome to ReWear. By accessing or using our services, you agree to be bound by these Terms of Service.
          </p>
          <p>
            1. <strong>Use of Service:</strong> You agree to use the service only for lawful purposes and in a way that does not infringe the rights of others.
          </p>
          <p>
            2. <strong>User Accounts:</strong> You are responsible for maintaining the confidentiality of your account and password.
          </p>
          <p>
            3. <strong>Content:</strong> You retain ownership of your content but grant us a license to use it as necessary to provide the service.
          </p>
          <p>
            4. <strong>Prohibited Conduct:</strong> You agree not to engage in any activity that disrupts or interferes with the service.
          </p>
          <p>
            5. <strong>Termination:</strong> We reserve the right to suspend or terminate your access to the service at our discretion.
          </p>
          <p>
            6. <strong>Disclaimer of Warranties:</strong> The service is provided "as is" without warranties of any kind.
          </p>
          <p>
            7. <strong>Limitation of Liability:</strong> We are not liable for any damages arising from your use of the service.
          </p>
          <p>
            8. <strong>Changes to Terms:</strong> We may update these terms from time to time. Continued use of the service constitutes acceptance of the new terms.
          </p>
          <p>
            If you have any questions about these Terms, please contact us.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
