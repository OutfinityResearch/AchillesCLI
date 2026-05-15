/**
 * Read Skill - Reads a skill definition file
 *
 * Reads any registered skill definition.
 */

import fs from 'node:fs';
import path from 'node:path';

export async function action(invocation = {}) {
    const mainAgent = invocation.mainAgent;
    const prompt = invocation.promptText;
    // Parse skill name from prompt
    let skillName = null;
    if (typeof prompt === 'string') {
        try {
            const parsed = JSON.parse(prompt);
            skillName = parsed.skillName || parsed.name;
        } catch (e) {
            // Not JSON, treat as string
            skillName = prompt.trim();
        }
    } else if (prompt && typeof prompt === 'object') {
        skillName = prompt.skillName || prompt.name;
    }

    if (!skillName) {
        return 'Error: skillName is required. Usage: read-skill <skillName>';
    }

    // Use getSkillRecord to locate the skill
    const skillRecord = mainAgent?.getSkillRecord?.(skillName);

    if (!skillRecord) {
        // List available skills
        const userSkills = mainAgent?.getSkills?.().filter(s => !s.isInternal) || [];
        const available = userSkills.map(s => s.shortName || s.name).join(', ');
        return `Error: Skill "${skillName}" not found.\nAvailable skills: ${available || 'none'}`;
    }

    try {
        const content = fs.readFileSync(skillRecord.filePath, 'utf8');

        return `=== ${path.basename(skillRecord.filePath)} ===\nPath: ${skillRecord.filePath}\nType: ${skillRecord.type}\n\n${content}`;
    } catch (error) {
        return `Error reading skill file: ${error.message}`;
    }
}

export default action;
