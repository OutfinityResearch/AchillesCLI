---
id: DS008
title: Schemas and Skill Documentation Contracts
status: active
owner: AchillesCLI Maintainers
summary: Defines skill schema detection, validation rules, templates, and `.specs.md` integration.
---

# DS008-schemas-and-skill-doc-contract

## Introduction
This DS specifies how AchillesCLI interprets skill documents and sidecar specifications through schema utilities in `src/schemas/skillSchemas.mjs`.

## Core Content
Schema utility responsibilities:
1. Detect skill type from document structure and known section headers.
2. Validate required vs optional sections by skill family.
3. Provide canonical template structures for supported skill types.
4. Validate update operations that target specific sections.

Document contract:
1. Skill documents are markdown-based contract files.
2. Validation output must be explicit about missing/invalid sections.
3. Read and write paths must preserve document integrity and expected section order where applicable.

`.specs.md` sidecar contract:
1. Skills may include optional `.specs.md` files.
2. Sidecar specifications are loaded on demand and included in relevant generation/refinement/read flows.
3. Missing sidecar files are valid and must not break normal skill execution.

Operational invariants:
1. Schema rules must stay synchronized with built-in skill authoring and validation commands.
2. Template generation must produce schema-valid initial structures.
3. Contract changes to required sections must be reflected in both validation logic and documentation.

## Conclusion
Schema and skill-document utilities provide the contract boundary that keeps skill authoring predictable and machine-checkable across CLI workflows.
