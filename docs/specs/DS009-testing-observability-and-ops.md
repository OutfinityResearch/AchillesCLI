---
id: DS009
title: Testing, Observability, and Operational Controls
status: active
owner: AchillesCLI Maintainers
summary: Defines test surfaces, logging behavior, metrics hooks, and operational runtime controls.
---

# DS009-testing-observability-and-ops

## Introduction
This DS defines verification and operational visibility surfaces for AchillesCLI, including test entry points and runtime observability modules.

## Core Content
Testing surfaces:
1. Repository tests are under `tests/`.
2. Package-local tests and scripts are under `achilles-cli/tests/` and `achilles-cli/scripts/`.
3. Test discovery utilities under `src/lib/testDiscovery/` define runnable test selection behavior.

Observability components:
1. `src/lib/Logger.mjs` provides runtime logging controls.
2. `src/lib/MetricsCollector.mjs` tracks runtime metrics/events where configured.
3. `src/lib/RequestContext.mjs` carries request-scoped runtime context.
4. `src/lib/errorHandling.mjs` and `src/lib/errorTypes.mjs` define structured error behavior.

Operational controls:
1. Debug mode enables deeper internal diagnostics.
2. Normal mode must keep outputs user-safe and concise.
3. Runtime command handlers (`/help`, `/debug`, `/tier`, `/model`, `/reload`, `/version`, `/status`) provide explicit operational control points.

Reliability invariants:
1. Runtime failures should surface explicit diagnostics without leaking sensitive internals in non-debug output.
2. Long-running or multi-step flows should emit progress feedback through UI/ActionReporter paths.
3. Test and generation helpers must not silently pass when preconditions are missing.

## Conclusion
Testing and observability contracts ensure AchillesCLI remains maintainable, diagnosable, and operationally predictable as the runtime evolves.
