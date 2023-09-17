"use client"
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {

  return (
    <div className="container flex-col items-center justify-center p-16">

      <h1 className="text-xl font-medium mb-2">Privacy Policy</h1>
      
      <p className="text-lg">
        We take your privacy seriously. This privacy policy describes how we collect, use, and protect your personal information.
      </p>

      <Separator className="my-6" />

      <h2 className="text-xl font-medium mb-2">Information Collection</h2>

      <p className="text-lg">
        We collect information to provide and improve our services. We collect information in two ways:
      </p>

      <p className="text-lg">
        <strong>Information you give us.</strong> This includes information you provide when you create an account, contact us, or use our services. It may include your name, email address, and any other information you choose to provide.
      </p>

      <p className="text-lg">
        <strong>Information we collect automatically.</strong> We use tracking tools like Microsoft Clarity to collect usage data. This helps us understand how you use our site so we can improve it. The data collected includes your IP address, browser type, operating system, referral URLs, device information, pages visited, and search terms entered.
      </p>

      <Separator className="my-6" />
      
      {/* other sections */}

      <h2 className="text-xl font-medium mb-2">Contact Info</h2>


      <p className="text-lg">
        If you have any questions about this privacy policy or our data practices, please contact us at: 

        me@abilioazevedo.com.br
      </p>

      <Separator className="my-6" />

      <h2 className="text-xl font-medium mb-2">Changes</h2>

      <p className="text-lg">
        We may occasionally update this policy as required by law or to reflect changes to our data practices. We encourage you to check back periodically to review the latest version.
      </p>

      <Separator className="my-6" />

      <h2 className="text-xl font-medium mb-2">Effective Date</h2>

      <p className="text-lg">
        This privacy policy is effective as of 09/17/2023
      </p>
    </div>
  );
}