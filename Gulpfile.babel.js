//npm modules
import pkg from './package.json';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import express from 'express';
import nunjucks from "nunjucks";
import globby from 'globby';
import fs from 'fs';
import lodash from 'lodash';
import browserSync from 'browser-sync';
import merge from 'merge-stream';
import moment from 'moment';
import fancyLog from 'fancy-log';
import del from 'del';

//load moudles
import loadMoudle from './system/loadModule';
import { target as paths } from './system/settings/paths'

const options = {
    pattern: path.join(paths.tasks, '**/tasks/*.js'),
    paths,
};

const plugins = gulpLoadPlugins({
    pattern: ['gulp-*', 'gulp.*', '@*/gulp{-,.}*'],
    scope: ['dependencies', 'devDependencies', 'peerDependencies'],
});

const $ = {
    ...plugins,
    relativePath : true,
    pkg,
    gulp,
    path,
    express,
    nunjucks,
    globby,
    fs,
    lodash,
    browserSync,
    merge,
    moment,
    fancyLog,
    del
};

loadMoudle( $, options );