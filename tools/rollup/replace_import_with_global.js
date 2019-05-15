'use strict';

const UndefinableMod = require('option-t/cjs/Undefinable');

const PLACEHOLDER_PREFIX = '\0placeholder_module:';

function replaceImportWithGlobal(map) {
    const table = new Map(Object.entries(map));
    const innerTable = new Map();

    // This implements PluginHooks
    return {
        name: 'replace_import_with_global',

        async resolveId(source, _importer) {
            const src = table.get(source);
            if (UndefinableMod.isUndefined(src)) {
                return null;
            }

            const key = PLACEHOLDER_PREFIX + source;
            innerTable.set(key, src);
            return {
                id: key,
                external: false,
                moduleSideEffects: true,
            };
        },

        async load(id) {
            const src = innerTable.get(id);
            if (UndefinableMod.isUndefined(src)) {
                return null;
            }

            return {
                code: src,
                map: undefined,
            };
        },
    };
}

function createDefaultExport(name) {
    return `export default ${name};`;
}

function createNamedExport(name, namespace) {
    return `export var ${name} = ${namespace}.${name};`;
}

function createModule(list) {
    return list.join('\n');
}

module.exports = Object.freeze({
    replaceImportWithGlobal,
    createDefaultExport,
    createNamedExport,
    createModule,
});
