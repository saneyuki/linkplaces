'use strict';

const MaybeMod = require('option-t/cjs/Maybe');

const GIT_REVISION = MaybeMod.mapOr(process.env.GIT_REVISION, 'unknown', String);
const BUILD_DATE = MaybeMod.mapOr(process.env.BUILD_DATE, 'unknown', String);
const USE_WEB_COMPONENT = MaybeMod.mapOr(process.env.USE_WEB_COMPONENT, 'false', String);

const RELEASE_CHANNEL = MaybeMod.mapOr(process.env.RELEASE_CHANNEL, 'production', String);
const LIB_NODE_ENV = (RELEASE_CHANNEL === 'production') ? 'production' : 'development';
const IS_PRODUCTION_MODE = (RELEASE_CHANNEL === 'production');

const ENABLE_SOURCE_MAP = !IS_PRODUCTION_MODE;

module.exports = Object.freeze({
    GIT_REVISION,
    BUILD_DATE,
    USE_WEB_COMPONENT,
    RELEASE_CHANNEL,
    LIB_NODE_ENV,
    IS_PRODUCTION_MODE,
    ENABLE_SOURCE_MAP,
});