/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
/*eslint-env node*/
/*eslint quote-props: [2, "always"] */
/* eslint-disable @typescript-eslint/no-require-imports */

'use strict';

const path = require('path');

const JS_EXTENSION = ['.mjs', '.js', '.jsx'];
const TS_EXTENSION = ['.ts', '.tsx', '.d.ts'];
const ALL_EXTENSION = [...TS_EXTENSION, ...JS_EXTENSION];

// ESLint Configuration Files enables to include comments.
// http://eslint.org/docs/configuring/#comments-in-configuration-files
module.exports = {
    'extends': [
        'eslint-config-abema/config/eslintrc_react_hooks.js',
        'eslint-config-abema/config/eslintrc_typescript.js',
        'eslint-config-abema/config/eslintrc_typescript_react.js',
    ],

    'parserOptions': {
        'sourceType': 'module',
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 2018,
        'project': path.resolve(__dirname, '../tsconfig.eslint.json'),
    },

    'env': {
        'browser': true,
        'webextensions': true,
    },

    'settings': {
        'import/resolver': {
            'node': {
                'extensions': ALL_EXTENSION,
            },
        },
    },


    'rules': {
    }
};