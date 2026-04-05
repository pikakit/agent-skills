import * as fs from 'node:fs';
import * as path from 'node:path';

const specPath = path.join(__dirname, 'rules', 'engineering-spec.md');
let content = fs.readFileSync(specPath, 'utf8');

if (!content.includes('OpenTelemetry Observability')) {
  const injection = `## OpenTelemetry Observability (MANDATORY)

- **Render Telemetry**: EVERY time a Preview Server or Mermaid Editor server is launched, the Agent MUST emit an OpenTelemetry Span recording \`render_time_ms\` and memory footprint.
- **Template Compliance Events**: If an Agent attempts to generate or save a documentation file (e.g., README.md) that lacks the REQUIRED mandatory sections (e.g. Quick Start), it MUST trigger a \`TEMPLATE_COMPLIANCE_FAILURE\` OTel Event for audit logging before gracefully recovering.

---

`;
  
  content = content.replace('PikaKit v3.9.109', injection + 'PikaKit v3.9.109');
  fs.writeFileSync(specPath, content);
  console.log('Successfully injected OpenTelemetry into engineering-spec.md');
} else {
  console.log('OpenTelemetry already injected.');
}
