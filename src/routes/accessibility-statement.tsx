import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, PolicyItem, PolicyList, PolicySection } from "@/components/legal/LegalPage";

export const Route = createFileRoute("/accessibility-statement")({
  head: () => ({
    meta: [
      { title: "Accessibility Statement | ZEN AI Co." },
      {
        name: "description",
        content:
          "How to request accessibility assistance or report a barrier when using ZEN AI Co. digital services.",
      },
    ],
  }),
  component: AccessibilityStatementPage,
});

function AccessibilityStatementPage() {
  return (
    <LegalPage
      title="Accessibility Statement"
      summary="ZEN AI Co. wants its digital services and educational experiences to be usable by as many people as possible."
    >
      <PolicySection number={1} title="Our Approach">
        <p>
          Accessibility is an ongoing part of how we review and improve our digital experiences as
          platforms, programs, content, and tools evolve.
        </p>
      </PolicySection>

      <PolicySection number={2} title="Request Assistance or Report a Barrier">
        <p>
          If you encounter an accessibility barrier or need help accessing ZEN content or a service,
          email{" "}
          <a
            className="font-semibold text-zen-emerald hover:underline"
            href="mailto:HUXLEY@ZENAI.BIZ"
          >
            HUXLEY@ZENAI.BIZ
          </a>
          .
        </p>
        <p>To help us review the request, include:</p>
        <PolicyList>
          <PolicyItem>The page, program, or service you were using</PolicyItem>
          <PolicyItem>A short description of the barrier or assistance needed</PolicyItem>
          <PolicyItem>
            Your browser, device, or preferred accessible format, when relevant
          </PolicyItem>
        </PolicyList>
      </PolicySection>

      <PolicySection number={3} title="Contact">
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
