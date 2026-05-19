/**
 * Delete Skill - Removes a skill directory
 */

import fs from 'node:fs';
import path from 'node:path';
import { requestWorkspaceSkillsRefresh } from '../../../lib/workspaceSkillRefresh.mjs';

export async function action(invocation = {}) {
    const mainAgent = invocation.mainAgent;
    const prompt = invocation.promptText;
    // Derive skills directory from startDir
    const startDir = mainAgent?.startDir;
    if (!startDir) {
        return 'Error: startDir not available';
    }

    const skillsDir = path.join(startDir, 'skills');

    // Parse skill name
    let skillName = null;
    if (typeof prompt === 'string' && prompt.trim()) {
        skillName = prompt.trim();
    } else if (prompt && typeof prompt === 'object') {
        skillName = prompt.skillName || prompt.name;
    }

    if (!skillName) {
        return 'Error: skillName is required. Usage: delete-skill <skillName>';
    }

    const skillDir = path.join(skillsDir, skillName);

    if (!fs.existsSync(skillDir)) {
        return `Error: Skill "${skillName}" not found at ${skillDir}`;
    }

    // List files that will be deleted
    let files = [];
    try {
        files = fs.readdirSync(skillDir);
    } catch (error) {
        return `Error reading skill directory: ${error.message}`;
    }

    try {
        fs.rmSync(skillDir, { recursive: true, force: true });
        requestWorkspaceSkillsRefresh(mainAgent, {
            operation: 'delete-skill',
            skillName,
            filePath: skillDir,
        });
        return `Deleted skill: ${skillName}\nRemoved ${files.length} file(s): ${files.join(', ')}\n\nRemember to reload skills after deletion.`;
    } catch (error) {
        return `Error deleting skill: ${error.message}`;
    }
}

export default action;
