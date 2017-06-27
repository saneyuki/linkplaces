// import from https://github.com/karen-irc/karen/blob/27721039af844337264ad83adadc2c4bd3a1c568/tools/stylelint/stylelintrc_core.js
/*eslint-env commonjs */
/**
 * MIT License
 *
 * Copyright (c) 2016 Tetsuharu OHZEKI <saneyuki.snyk@gmail.com>
 * Copyright (c) 2016 Yusuke Suzuki <utatane.tea@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/*eslint quote-props: [2, "always"] */

'use strict';

module.exports = {
    'plugins': [],

    'extends': [],

    // http://stylelint.io/user-guide/rules/
    'rules': {
        // 'at-rule-blacklist': [],
        'at-rule-empty-line-before': ['always', {
            'except': ['blockless-after-same-name-blockless'], // Reverse the primary option for at-rules that are nested.
            'ignore': ['after-comment'], // Ignore at-rules that come after a comment.
        }],
        'at-rule-name-case': 'lower',
        'at-rule-name-newline-after': 'always-multi-line',
        'at-rule-name-space-after': 'always-single-line',
        'at-rule-no-unknown': [true, {
            'ignoreAtRules': [],
        }],
        'at-rule-no-vendor-prefix': true,
        'at-rule-semicolon-newline-after': 'always',
        'at-rule-semicolon-space-before': 'never',
        // 'at-rule-whitelist': [],
        // 'block-closing-brace-empty-line-before': 'always-multi-line'|'never',
        'block-closing-brace-newline-after': 'always',
        // 'block-closing-brace-newline-before': 'always'|'always-multi-line'|'never-multi-line',
        // 'block-closing-brace-space-after': 'always'|'always-single-line'|'never-single-line'|'always-multi-line'|'never-multi-line',
        // 'block-closing-brace-space-before': 'always'|'never'|'always-single-line'|'never-single-line'|'always-multi-line'|'never-multi-line',
        'block-no-empty': [true, {
            'severity': 'warning',
        }],
        'block-opening-brace-newline-after': 'always',
        // 'block-opening-brace-newline-before': 'always'|'always-single-line'|'never-single-line'|'always-multi-line'|'never-multi-line',
        // 'block-opening-brace-space-after': 'always'|'always-single-line'|'never-single-line'|'always-multi-line'|'never-multi-line',
        // 'block-opening-brace-space-before': 'always'|'always-single-line'|'never-single-line'|'always-multi-line'|'never-multi-line',
        'color-hex-case': 'lower',
        'color-hex-length': 'long',
        // 'color-named': 'always-where-possible'|'never',
        // 'color-no-hex': true,
        'color-no-invalid-hex': true,
        // 'comment-empty-line-before': 'always'|'never',
        'comment-no-empty': true,
        // 'comment-whitespace-inside': 'always'|'never',
        // 'comment-word-blacklist': string|[],
        // 'custom-media-pattern': string,
        // 'custom-property-empty-line-before': 'always'|'never',
        // 'custom-property-pattern': string,
        'declaration-bang-space-after': 'never',
        'declaration-bang-space-before': 'always',
        'declaration-block-no-duplicate-properties': true,
        'declaration-block-no-redundant-longhand-properties': true,
        'declaration-block-no-shorthand-property-overrides': true,
        // 'declaration-block-semicolon-newline-after': 'always'|'always-multi-line'|'never-multi-line',
        // 'declaration-block-semicolon-newline-before': 'always'|'always-multi-line'|'never-multi-line',
        'declaration-block-semicolon-space-after': 'always-single-line',
        'declaration-block-semicolon-space-before': 'never',
        'declaration-block-single-line-max-declarations': 1,
        'declaration-block-trailing-semicolon': 'always',
        // 'declaration-colon-newline-after': 'always'|'always-multi-line',
        'declaration-colon-space-after': 'always-single-line',
        'declaration-colon-space-before': 'never',
        // 'declaration-empty-line-before': 'always'|'never',
        'declaration-no-important': true,
        // 'declaration-property-unit-blacklist': {},
        // 'declaration-property-unit-whitelist': {},
        // 'declaration-property-value-blacklist': {},
        // 'declaration-property-value-whitelist': {},
        'font-family-name-quotes': 'always-unless-keyword',
        // 'font-family-no-duplicate-names': boolean,
        'font-weight-notation': 'named-where-possible',
        //'function-blacklist': [],
        'function-calc-no-unspaced-operator': true,
        'function-comma-newline-after': 'never-multi-line',
        'function-comma-newline-before': 'never-multi-line',
        'function-comma-space-after': 'always',
        'function-comma-space-before': 'never',
        'function-linear-gradient-no-nonstandard-direction': true,
        'function-max-empty-lines': 0,
        'function-name-case': 'lower',
        // 'function-parentheses-newline-inside': 'always'|'always-multi-line'|'never-multi-line',
        'function-parentheses-space-inside': 'never-single-line',
        // 'function-url-data-uris': 'always'|'never',
        // 'function-url-no-scheme-relative': true,
        'function-url-scheme-whitelist': ['https'],
        'function-url-quotes': ['always', {
            // except: ['empty'],
        }],
        //'function-whitelist': [],
        'function-whitespace-after': 'always',
        'indentation': 4,
        'keyframe-declaration-no-important': true,
        // 'length-zero-no-unit': true,
        'max-empty-lines': [2, {
            'ignore': ['comments']
        }],
        // 'max-line-length': int,
        'media-feature-colon-space-after': 'always',
        'media-feature-colon-space-before': 'never',
        'media-feature-name-case': 'lower',
        'media-feature-name-no-unknown': [true, {
            'ignoreMediaFeatureNames': [],
        }],
        'media-feature-name-no-vendor-prefix': true,
        // 'media-feature-name-blacklist'
        // 'media-feature-name-whitelist'
        'media-feature-parentheses-space-inside': 'never',
        'media-feature-range-operator-space-after': 'always',
        'media-feature-range-operator-space-before': 'always',
        // 'media-query-list-comma-newline-after': 'always'|'always-multi-line'|'never-multi-line',
        // 'media-query-list-comma-newline-before': 'always'|'always-multi-line'|'never-multi-line',
        // 'media-query-list-comma-space-after': 'always'|'never'|'always-single-line'|'never-single-line',
        // 'media-query-list-comma-space-before': 'always'|'never'|'always-single-line'|'never-single-line',
        'no-descending-specificity': true,
        'no-duplicate-selectors': true,
        'no-empty-source': true,
        // 'no-eol-whitespace': true,
        'no-extra-semicolons': true,
        'no-invalid-double-slash-comments': true,
        'no-missing-end-of-source-newline': true,
        'no-unknown-animations': true,
        // 'number-leading-zero': 'always'|'never',
        // 'number-max-precision': int,
        // 'number-no-trailing-zeros': true,
        // 'property-blacklist': string|[],
        'property-case': 'lower',
        'property-no-unknown': true,
        'property-no-vendor-prefix': true,
        // 'property-whitelist': string|[],
        'selector-attribute-brackets-space-inside': 'never',
        // 'selector-attribute-operator-blacklist': string|[],
        'selector-attribute-operator-space-after': 'never',
        'selector-attribute-operator-space-before': 'never',
        // 'selector-attribute-operator-whitelist': string|[],
        'selector-attribute-quotes': 'always',
        // 'selector-class-pattern': string,
        'selector-combinator-space-after': 'always',
        'selector-combinator-space-before': 'always',
        'selector-descendant-combinator-no-non-space': true,
        // 'selector-id-pattern': string,
        // 'selector-list-comma-newline-after': 'always'|'always-multi-line'|'never-multi-line',
        // 'selector-list-comma-newline-before': 'always'|'always-multi-line'|'never-multi-line',
        'selector-list-comma-space-after': 'always-single-line',
        'selector-list-comma-space-before': 'never-single-line',
        //'selector-max-class': 0,
        'selector-max-empty-lines': 0,
        // 'selector-max-compound-selectors': int,
        // 'selector-max-specificity': string,
        'selector-max-universal': 0,
        // 'selector-nested-pattern': string,
        // 'selector-no-attribute': true,
        // 'selector-no-combinator': true,
        // 'selector-no-id': true,
        // 'selector-no-qualifying-type': true,
        // 'selector-no-type': true,
        'selector-no-vendor-prefix': true,
        // 'selector-pseudo-class-blacklist': [],
        'selector-pseudo-class-case': 'lower',
        'selector-pseudo-class-no-unknown': true,
        // 'selector-pseudo-class-parentheses-space-inside': 'always'|'never',
        // 'selector-pseudo-class-whitelist': string|[],
        'selector-pseudo-element-case': 'lower',
        'selector-pseudo-element-colon-notation': 'double',
        'selector-pseudo-element-no-unknown': true,
        'selector-type-case': 'lower',
        'selector-type-no-unknown': [true, {
            'ignore': ['default-namespace', 'custom-elements'],
            'ignoreNamespaces': [],
            'ignoreTypes': [],
        }],
        'shorthand-property-no-redundant-values': [true, {
            'severity': 'warning',
        }],
        'string-no-newline': true,
        'string-quotes': 'single',
        'time-min-milliseconds': 100,
        // 'unit-blacklist': string|[],
        'unit-case': 'lower',
        'unit-no-unknown': true,
        // 'unit-whitelist': string|[],
        'value-keyword-case': 'lower',
        // 'value-list-comma-newline-after': 'always'|'always-multi-line'|'never-multi-line',
        // 'value-list-comma-newline-before': 'always'|'always-multi-line'|'never-multi-line',
        'value-list-comma-space-after': 'always-single-line',
        'value-list-comma-space-before': 'never-single-line',
        'value-list-max-empty-lines': 0,
        'value-no-vendor-prefix': true,
    },
};
