import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, PolicyItem, PolicyList, PolicySection } from "@/components/legal/LegalPage";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | ZEN AI Co." },
      {
        name: "description",
        content:
          "How ZEN AI Co. collects, uses, protects, and manages information across its platforms, applications, and educational programs.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary='ZEN AI Co. ("ZEN", "we", "our", or "us") operates artificial intelligence platforms, applications, educational programs, and digital services, including but not limited to zenai.world and related properties (collectively, the "Services").'
    >
      <PolicySection number={1} title="Information We Collect">
        <p>We may collect the following categories of information:</p>
        <PolicyList>
          <PolicyItem>
            <strong>Personal Information:</strong> Name, email address, account credentials, and
            contact details
          </PolicyItem>
          <PolicyItem>
            <strong>Usage Data:</strong> Interactions with our platforms, applications, dashboards,
            and tools
          </PolicyItem>
          <PolicyItem>
            <strong>Technical Data:</strong> IP address, device type, browser type, operating
            system, and session logs
          </PolicyItem>
          <PolicyItem>
            <strong>AI Interaction Data:</strong> Inputs, prompts, outputs, and interactions with AI
            models and agents
          </PolicyItem>
          <PolicyItem>
            <strong>Educational Data:</strong> Progress, submissions, and performance within ZEN
            programs, including but not limited to the AI Pioneer Program and ZEN Vanguard Program
          </PolicyItem>
          <PolicyItem>
            <strong>Blockchain Data:</strong> Public wallet addresses and credential verification
            records (non-sensitive)
          </PolicyItem>
        </PolicyList>
      </PolicySection>

      <PolicySection number={2} title="How We Use Information">
        <p>We use collected information to:</p>
        <PolicyList>
          <PolicyItem>Provide, operate, and improve our Services</PolicyItem>
          <PolicyItem>
            Deliver AI-powered tools, automation systems, and educational programs
          </PolicyItem>
          <PolicyItem>Personalize user experiences and adaptive learning pathways</PolicyItem>
          <PolicyItem>Analyze performance, usage patterns, and system reliability</PolicyItem>
          <PolicyItem>Maintain security, prevent fraud, and ensure compliance</PolicyItem>
          <PolicyItem>
            Communicate updates, support responses, and service-related notifications
          </PolicyItem>
        </PolicyList>
      </PolicySection>

      <PolicySection number={3} title="Artificial Intelligence and Automation Systems">
        <p>
          ZEN Services utilize artificial intelligence models, including third-party APIs and
          proprietary systems.
        </p>
        <p>By using our Services, you acknowledge:</p>
        <PolicyList>
          <PolicyItem>
            AI outputs are generated dynamically and may not always be accurate or complete
          </PolicyItem>
          <PolicyItem>
            Inputs may be processed to improve system performance, reliability, and safety
          </PolicyItem>
          <PolicyItem>
            ZEN does not guarantee accuracy, completeness, or fitness of AI-generated outputs for
            any specific purpose
          </PolicyItem>
        </PolicyList>
      </PolicySection>

      <PolicySection number={4} title="Data Sharing">
        <p>We do not sell personal data.</p>
        <p>We may share data with:</p>
        <PolicyList>
          <PolicyItem>
            Service providers (hosting, infrastructure, analytics, and security providers)
          </PolicyItem>
          <PolicyItem>AI model providers and API partners</PolicyItem>
          <PolicyItem>Educational or institutional partners where applicable</PolicyItem>
          <PolicyItem>
            Legal authorities when required by law or to protect rights and safety
          </PolicyItem>
        </PolicyList>
      </PolicySection>

      <PolicySection number={5} title="Data Retention">
        <p>
          We retain data only as long as necessary to provide Services, comply with legal
          obligations, resolve disputes, and improve system performance.
        </p>
      </PolicySection>

      <PolicySection number={6} title="Security">
        <p>
          We implement reasonable administrative, technical, and organizational safeguards to
          protect user data. However, no system can be guaranteed to be completely secure.
        </p>
      </PolicySection>

      <PolicySection number={7} title="Your Rights">
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <PolicyList>
          <PolicyItem>Access your personal data</PolicyItem>
          <PolicyItem>Correct or update your data</PolicyItem>
          <PolicyItem>Request deletion of your data</PolicyItem>
          <PolicyItem>Request data portability</PolicyItem>
          <PolicyItem>Restrict or object to certain processing activities</PolicyItem>
        </PolicyList>
        <p>
          Requests can be submitted to{" "}
          <a
            className="font-semibold text-zen-emerald hover:underline"
            href="mailto:HUXLEY@ZENAI.BIZ"
          >
            HUXLEY@ZENAI.BIZ
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection number={8} title="Children’s Privacy">
        <p>
          ZEN offers educational programs designed for minors, including users under the age of 18.
          Participation in such programs may require parental, guardian, or institutional consent in
          accordance with applicable laws.
        </p>
      </PolicySection>

      <PolicySection number={9} title="Third-Party Services">
        <p>
          Our Services may contain links to third-party platforms or services. ZEN is not
          responsible for the privacy practices or content of third-party services.
        </p>
      </PolicySection>

      <PolicySection number={10} title="Changes to This Policy">
        <p>
          We may update this Privacy Policy at any time. Continued use of the Services after updates
          constitutes acceptance of the revised policy.
        </p>
      </PolicySection>

      <PolicySection number={11} title="Contact Information">
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
