import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, PolicyItem, PolicyList, PolicySection } from "@/components/legal/LegalPage";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy | ZEN AI Co." },
      {
        name: "description",
        content: "The refund and payment-dispute terms that apply to ZEN AI Co. Services.",
      },
    ],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      summary="This page presents the refund and payment-dispute rules stated in the ZEN AI Co. Terms & Conditions."
    >
      <PolicySection number={1} title="Payment Terms">
        <p>
          Users agree to all pricing and payment terms provided at the time of purchase or
          agreement.
        </p>
      </PolicySection>

      <PolicySection number={2} title="Refunds">
        <p>Unless explicitly stated otherwise:</p>
        <PolicyList>
          <PolicyItem>All payments are final</PolicyItem>
          <PolicyItem>No refunds will be issued</PolicyItem>
        </PolicyList>
      </PolicySection>

      <PolicySection number={3} title="Payment Disputes">
        <p>
          Payment disputes must be submitted within thirty (30) days of invoice date. Failure to do
          so may result in additional fees or legal action.
        </p>
      </PolicySection>

      <PolicySection number={4} title="Non-Payment">
        <p>ZEN reserves the right to suspend or terminate Services for:</p>
        <PolicyList>
          <PolicyItem>Non-payment</PolicyItem>
          <PolicyItem>Late payment</PolicyItem>
          <PolicyItem>Payment disputes not resolved in a timely manner</PolicyItem>
        </PolicyList>
      </PolicySection>

      <PolicySection number={5} title="Contact">
        <p>
          Questions about a payment or invoice can be submitted to{" "}
          <a
            className="font-semibold text-zen-emerald hover:underline"
            href="mailto:HUXLEY@ZENAI.BIZ"
          >
            HUXLEY@ZENAI.BIZ
          </a>
          .
        </p>
        <p>
          See the complete{" "}
          <a
            className="font-semibold text-zen-emerald hover:underline"
            href="/terms-and-conditions"
          >
            Terms &amp; Conditions
          </a>
          .
        </p>
      </PolicySection>
    </LegalPage>
  );
}
