'use strict';
/**
 * @license Rollup Plugin Absolute Module Fix v0.0.1
 * (c) 2017 Amin Paks <amin.pakseresht@hotmail.com>
 * License: MIT
 */
const MagicString = require('magic-string');

const importRegex = /(import|export)\s*((\{[^}]*\}|\*)(\s*as\s+\w+)?(\s+from)?\s*)?([`'"])(.*)\6/ig;

module.exports = function () {

    function fixImportee(id) {
        const parts = id.split(/[\/\\]/);
        const firstLetter = id.slice(0, 1);
        const last = parts.pop();

        if (firstLetter !== '.' && last === 'index') {
            return parts.join('/');
        }
    }

    const plugin = {
        name: 'absolute-module-fix',
        transform: function (code) {
            const magicString = new MagicString(code);

            let hasUpdate = false;
            let match;

            while ((match = importRegex.exec(code)) !== null) {
                const moduleId = match[7];
                const fix = fixImportee(moduleId);

                if (moduleId && fix) {
                    hasUpdate = true;

                    const start = match.index;
                    const end = start + match[0].length;
                    const replacement = code.substring(start, end).replace(moduleId, fix);

                    magicString.overwrite(start, end, replacement);
                }
            }

            if (hasUpdate) {
                const code = magicString.toString();
                const map = magicString.generateMap({ hires: true });

                return {
                    code,
                    map,
                }
            }
        }
    }

    return plugin;
}
