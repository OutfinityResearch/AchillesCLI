# DS-035 – Skill: generate-docs (.AchillesSkills/gamp/generate-docs/generate-docs.js)

## Version
- current: v1.0
- timestamp: 1700000003035

## Scope & Intent
Publish HTML documentation from current specs, per `oskill.md`: convert URS/FS/NFS/DS to static HTML, keep styling light/diff-friendly, overwrite existing outputs, and report counts.

## Architecture
- Configures GampRSP with workspace root, calls generateHtmlDocs(), returns docs index path.

## Traceability
- URS: URS-003, URS-004, URS-005
- Requirements: FS-003, FS-007, FS-010

## File Impact
### File: .AchillesSkills/gamp/generate-docs/generate-docs.js
Timestamp: 1700000003035

#### Exports
- default skill action({ context })

#### Dependencies
- GampRSP
- node path

#### Description
Doc publishing skill to render URS/FS/NFS/DS into html_docs for offline viewing and sharing.

## Tests
- Indirectly covered when spec skills generate HTML (DS-023, DS-026); no dedicated suite.
