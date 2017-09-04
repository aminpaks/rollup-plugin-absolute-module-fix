'use strict';
/**
 * @license Rollup Plugin Absolute Module Fix v0.0.2
 * (c) 2017 Amin Paks <amin.pakseresht@hotmail.com>
 * License: MIT
 */
var MagicString = require('magic-string');

var importRegex = /(import|export)\s*((\{[^}]*\}|\*)(\s*as\s+\w+)?(\s+from)?\s*)?([`'"])(.*)\6/ig;

module.exports = function () {

    function fixImportee(id) {
        var parts = id.split(/[\/\\]/);
        var firstLetter = id.slice(0, 1);
        var last = parts.pop();

        if (firstLetter !== '.' && last === 'index') {
            return parts.join('/');
        }
    }

    var plugin = {
        name: 'absolute-module-fix',
        transform: function (code) {
            var magicString = new MagicString(code);

            let hasUpdate = false;
            let match;

            while ((match = importRegex.exec(code)) !== null) {
                var moduleId = match[7];
                var fix = fixImportee(moduleId);

                if (moduleId && fix) {
                    hasUpdate = true;

                    var start = match.index;
                    var end = start + match[0].length;
                    var replacement = code.substring(start, end).replace(moduleId, fix);

                    magicString.overwrite(start, end, replacement);
                }
            }

            if (hasUpdate) {
                var code = magicString.toString();
                var map = magicString.generateMap({ hires: true });

                return {
                    code,
                    map,
                }
            }
        }
    }

    return plugin;
}
