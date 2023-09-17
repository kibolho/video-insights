"use client";
import { Separator } from "@/components/ui/separator";

export default function TermsOfService() {
  return (
    <div className="container flex-col items-center justify-center p-16">
      <h1 className="text-xl font-medium mb-2">Terms of Service</h1>

      <p className="text-lg">
        Please read these terms of service carefully before using our services.
      </p>

      <Separator className="my-6" />

      <h2 className="text-xl font-medium mb-2">Use of Services</h2>

      <p className="text-lg">
        By accessing our website or using our mobile applications and related
        services (collectively, the `Services`), you agree to comply with these
        Terms of Service. You may use the Services only if you can form a
        binding contract with us and you are not legally prohibited from using
        the Services.
      </p>

      <Separator className="my-6" />
      <h2 className="text-xl font-medium mb-2">Service Availability</h2>

      <p className="text-lg">
        As this is an experimental product, the service may be intermittently
        unavailable. We are constantly improving and updating the system, which
        may require downtime. We will try to provide advance notice of planned
        outages, but cannot guarantee uninterrupted service. Using this
        experimental product does not entitle you to credits for downtime.
      </p>

      <Separator className="my-6" />

      <h2 className="text-xl font-medium mb-2">User Content</h2>

      <p className="text-lg">
        You are responsible for any content you upload, post, email, transmit,
        or otherwise make available via the Services. You agree not to upload
        anything illegal or abusive. We have the right to remove any content at
        our discretion.
      </p>

      <Separator className="my-6" />
      <h2 className="text-xl font-medium mb-2">Payments</h2>

      <p className="text-lg">
        You are responsible for any fees associated with using our paid
        Services. We may change the fees with notice. Non-payment may result in
        suspension or termination of your account.
      </p>

      <Separator className="my-6" />

      <h2 className="text-xl font-medium mb-2">Contact Us</h2>

      <p className="text-lg">
        Please contact us at me@abilioazevedo.com.br if you have any questions
        about these Terms of Service.
      </p>
    </div>
  );
}
