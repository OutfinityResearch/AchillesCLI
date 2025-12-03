# DS-002 – Specs Workspace Manager (GampRSP.mjs)

## Version
- current: v1.0
- timestamp: 2025-12-03T14:29:09Z

## Scope & Intent
Manage `.specs` workspace lifecycle: create URS/FS/NFS skeletons, DS directory, ignore list, mock/docs folders, traceability updates, and HTML generation.

## Architecture
- Ensures directory structure and default documents exist.
- Generates IDs and chapters for URS/FS/NFS; retires/updates entries.
- Creates DS files, test entries, file-impact blocks, and links requirements to DS.
- Produces HTML docs (URS/FS/NFS/DS index) for offline browsing.

## Traceability
- URS: URS-003, URS-004, URS-005, URS-009
- Requirement: FS-003, FS-004, FS-007, FS-010

## File Impact
### File: GampRSP.mjs
Timestamp: 1700000003002

#### Exports
- default singleton `GampRSP`

#### Dependencies
- node fs/path

#### Description
Provides CRUD over specification artifacts, DS path resolution, traceability updates, ignore list handling, cache persistence, and HTML doc generation used by CLI skills.

## Tests
- DS-023 (spec management)
- DS-021 (achilles-cli end-to-end)
