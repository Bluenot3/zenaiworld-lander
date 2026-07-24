import { createFileRoute } from "@tanstack/react-router";

import {
  LegalPage,
  PolicyItem,
  PolicyList,
  PolicySection,
  PolicySubheading,
} from "@/components/legal/LegalPage";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | ZEN AI Co." },
      {
        name: "description",
        content:
          "Terms governing access to and use of ZEN AI Co. services, platforms, applications, programs, and technologies.",
      },
    ],
  }),
  component: TermsAndConditionsPage,
});

function TermsAndConditionsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      summary="These Terms and Conditions (“Terms”) govern your access to and use of all services, platforms, applications, programs, and technologies operated by ZEN AI Co. (“ZEN”, “Company”, “we”, “our”, or “us”), including but not limited to zenai.world, associated applications, AI systems, educational programs, and automation services (collectively, the “Services”). By accessing or using the Services, you agree to be bound by these Terms."
    >
      <PolicySection number={1} title="User Responsibilities and Legal Compliance">
        <p>Clients, users, and participants (“Users”) agree to the following:</p>
        <PolicySubheading>Accurate Information</PolicySubheading>
        <p>
          Users must provide accurate, complete, and current information at all times. ZEN is not
          responsible for failures in service delivery resulting from inaccurate or incomplete
          information.
        </p>
        <PolicySubheading>Prohibited Conduct</PolicySubheading>
        <p>Users shall not:</p>
        <PolicyList>
          <PolicyItem>Attempt unauthorized access to systems, data, or infrastructure</PolicyItem>
          <PolicyItem>
            Interfere with or disrupt the integrity, performance, or availability of Services
          </PolicyItem>
          <PolicyItem>Introduce malware, malicious code, or harmful data</PolicyItem>
          <PolicyItem>Reverse engineer, replicate, or exploit any proprietary systems</PolicyItem>
          <PolicyItem>Use Services for illegal, fraudulent, or harmful activities</PolicyItem>
        </PolicyList>
        <p>Any violation may result in immediate suspension or termination.</p>
        <PolicySubheading>Legal and Regulatory Compliance</PolicySubheading>
        <p>
          Users are solely responsible for ensuring that their use of ZEN Services complies with all
          applicable laws, including but not limited to:
        </p>
        <PolicyList>
          <PolicyItem>Data protection and privacy laws</PolicyItem>
          <PolicyItem>Intellectual property laws</PolicyItem>
          <PolicyItem>Industry-specific regulations</PolicyItem>
          <PolicyItem>International, federal, and state laws</PolicyItem>
        </PolicyList>
      </PolicySection>

      <PolicySection number={2} title="Artificial Intelligence Systems Disclaimer">
        <p>ZEN provides AI-powered tools, agents, and systems.</p>
        <p>By using the Services, you acknowledge and agree:</p>
        <PolicyList>
          <PolicyItem>AI outputs may be inaccurate, incomplete, or unpredictable</PolicyItem>
          <PolicyItem>Outputs are generated dynamically and are not guaranteed</PolicyItem>
          <PolicyItem>
            ZEN does not provide professional, legal, financial, or medical advice
          </PolicyItem>
          <PolicyItem>
            You are solely responsible for reviewing and validating all outputs
          </PolicyItem>
        </PolicyList>
        <p>ZEN assumes no liability for decisions made based on AI-generated content.</p>
      </PolicySection>

      <PolicySection number={3} title="Intellectual Property">
        <PolicySubheading>ZEN Ownership</PolicySubheading>
        <p>
          All systems, models, frameworks, algorithms, designs, content, and technologies developed
          or used by ZEN remain the exclusive property of ZEN AI Co. or its licensors.
        </p>
        <p>This includes but is not limited to:</p>
        <PolicyList>
          <PolicyItem>AI systems and agent frameworks</PolicyItem>
          <PolicyItem>Automation architectures</PolicyItem>
          <PolicyItem>Educational content and curriculum</PolicyItem>
          <PolicyItem>Platform infrastructure and dashboards</PolicyItem>
        </PolicyList>
        <PolicySubheading>Limited License</PolicySubheading>
        <p>
          Users are granted a limited, non-exclusive, non-transferable, revocable license to use the
          Services strictly within the scope intended.
        </p>
        <PolicySubheading>User Content</PolicySubheading>
        <p>
          Users retain ownership of content they create but grant ZEN a worldwide, non-exclusive
          license to use, process, store, and display such content for the purpose of operating and
          improving the Services.
        </p>
      </PolicySection>

      <PolicySection number={4} title="Data Privacy and Security">
        <p>
          ZEN implements advanced security measures, including encryption, secure infrastructure,
          and, where applicable, blockchain-based verification systems.
        </p>
        <p>By using the Services, you consent to:</p>
        <PolicyList>
          <PolicyItem>Collection and processing of data necessary for operation</PolicyItem>
          <PolicyItem>Use of AI systems and third-party providers to process inputs</PolicyItem>
          <PolicyItem>Storage and analysis of usage data for system improvement</PolicyItem>
        </PolicyList>
        <p>
          ZEN does not guarantee absolute security and shall not be liable for breaches beyond
          reasonable control.
        </p>
      </PolicySection>

      <PolicySection number={5} title="Educational Programs and Outcomes">
        <p>ZEN offers programs including but not limited to:</p>
        <PolicyList>
          <PolicyItem>AI Pioneer Program</PolicyItem>
          <PolicyItem>ZEN Vanguard Program</PolicyItem>
          <PolicyItem>AI literacy, automation, and technical training systems</PolicyItem>
        </PolicyList>
        <p>Participation in any program:</p>
        <PolicyList>
          <PolicyItem>
            Does not guarantee employment, income, or certification recognition
          </PolicyItem>
          <PolicyItem>Does not guarantee specific results or outcomes</PolicyItem>
          <PolicyItem>Is provided for educational and informational purposes only</PolicyItem>
        </PolicyList>
      </PolicySection>

      <PolicySection number={6} title="Payment and Financial Terms">
        <PolicySubheading>Payment Obligations</PolicySubheading>
        <p>
          Users agree to all pricing and payment terms provided at the time of purchase or
          agreement.
        </p>
        <PolicySubheading>Non-Payment</PolicySubheading>
        <p>ZEN reserves the right to suspend or terminate Services for:</p>
        <PolicyList>
          <PolicyItem>Non-payment</PolicyItem>
          <PolicyItem>Late payment</PolicyItem>
          <PolicyItem>Payment disputes not resolved in a timely manner</PolicyItem>
        </PolicyList>
        <PolicySubheading>Dispute Window</PolicySubheading>
        <p>
          Payment disputes must be submitted within thirty (30) days of invoice date. Failure to do
          so may result in additional fees or legal action.
        </p>
        <PolicySubheading>Refund Policy</PolicySubheading>
        <p>Unless explicitly stated otherwise:</p>
        <PolicyList>
          <PolicyItem>All payments are final</PolicyItem>
          <PolicyItem>No refunds will be issued</PolicyItem>
        </PolicyList>
      </PolicySection>

      <PolicySection number={7} title="Limitation of Liability">
        <p>To the maximum extent permitted by law:</p>
        <p>ZEN AI Co. shall not be liable for any:</p>
        <PolicyList>
          <PolicyItem>Indirect, incidental, or consequential damages</PolicyItem>
          <PolicyItem>Loss of profits, revenue, or business opportunities</PolicyItem>
          <PolicyItem>Loss or corruption of data</PolicyItem>
          <PolicyItem>System downtime or interruptions</PolicyItem>
          <PolicyItem>Decisions made based on AI outputs</PolicyItem>
        </PolicyList>
        <p>All Services are provided “as-is” and “as available” without warranties of any kind.</p>
      </PolicySection>

      <PolicySection number={8} title="Indemnification">
        <p>
          Users agree to indemnify, defend, and hold harmless ZEN AI Co., its affiliates, partners,
          and personnel from any claims, damages, losses, liabilities, or expenses arising from:
        </p>
        <PolicyList>
          <PolicyItem>Violation of these Terms</PolicyItem>
          <PolicyItem>Misuse of Services</PolicyItem>
          <PolicyItem>Violation of applicable laws or regulations</PolicyItem>
          <PolicyItem>Use of AI-generated outputs</PolicyItem>
        </PolicyList>
      </PolicySection>

      <PolicySection number={9} title="Service Availability and Modifications">
        <p>ZEN reserves the right to:</p>
        <PolicyList>
          <PolicyItem>Modify, suspend, or discontinue any part of the Services</PolicyItem>
          <PolicyItem>Update features, pricing, or functionality</PolicyItem>
          <PolicyItem>Introduce or remove components at any time</PolicyItem>
        </PolicyList>
        <p>ZEN is not liable for any disruption or loss resulting from such changes.</p>
      </PolicySection>

      <PolicySection number={10} title="Termination">
        <p>ZEN may suspend or terminate access immediately, without notice, for:</p>
        <PolicyList>
          <PolicyItem>Violation of these Terms</PolicyItem>
          <PolicyItem>Security risks</PolicyItem>
          <PolicyItem>Abuse or misuse of the platform</PolicyItem>
        </PolicyList>
        <p>Termination does not relieve Users of outstanding financial obligations.</p>
      </PolicySection>

      <PolicySection number={11} title="Governing Law and Jurisdiction">
        <p>These Terms shall be governed by the laws of the Commonwealth of Pennsylvania.</p>
        <p>
          All disputes shall be resolved exclusively in the courts located in York County,
          Pennsylvania.
        </p>
      </PolicySection>

      <PolicySection number={12} title="Amendments to Terms">
        <p>ZEN reserves the right to modify these Terms at any time.</p>
        <p>
          Continued use of the Services after updates constitutes acceptance of the revised Terms.
        </p>
      </PolicySection>

      <PolicySection number={13} title="Contact Information">
        <p>ZEN AI Co.</p>
        <p>
          Email:{" "}
          <a
            className="font-semibold text-zen-emerald hover:underline"
            href="mailto:HUXLEY@ZENAI.BIZ"
          >
            HUXLEY@ZENAI.BIZ
          </a>
          <br />
          Website:{" "}
          <a className="font-semibold text-zen-emerald hover:underline" href="/">
            https://www.zenai.world
          </a>
        </p>
      </PolicySection>
    </LegalPage>
  );
}
