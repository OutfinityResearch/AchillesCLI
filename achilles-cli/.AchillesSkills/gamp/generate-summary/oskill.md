# generate-summary

Summarise the latest GAMP specifications (URS, FS, NFS, DS) without regenerating HTML docs.

## Summary
- Reads all specification documents and design files to extract identifiers, traceability, and file impacts.
- Generates `.specs/mock/spec-summary.html` so operators can review specs visually without touching the full docs site.
- Returns structured JSON so the CLI can echo the most important details inline.

## Instructions
- Group information by doc type, preserving IDs and titles exactly as written.
- In DS summaries, list every impacted file with its rationale (why/how/what) and the semantic expectations.
- Include up to 3 tests per DS in the summary, mirroring the sections in the DS document.
- Do not regenerate full HTML docs; keep the operation read-only aside from the summary output.
