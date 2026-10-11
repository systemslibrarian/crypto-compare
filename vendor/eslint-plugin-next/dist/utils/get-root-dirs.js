"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getRootDirs", {
    enumerable: true,
    get: function() {
        return getRootDirs;
    }
});
var _glob = require("glob");
var _fs = require("node:fs");
/**
 * Process a Next.js root directory glob.
 */ var processRootDir = function(rootDir) {
    var pattern = rootDir.replace(/\\/g, '/');
    var search = pattern.replace(/(^|\/)\*\*(?=\/?$)/, '$1**/*');
    return (0, _glob.globSync)(search, { follow: true, dot: /(?:^|\/)\!\(/.test(pattern) }).filter(function(dir) {
        try { return _fs.statSync(dir).isDirectory(); }
        catch (error) {
            if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return false;
            throw error;
        }
    }).map(function(dir) {
        if (pattern.startsWith('./') && !dir.startsWith('./')) dir = './' + dir;
        return pattern.endsWith('/') && !dir.endsWith('/') ? dir + '/' : dir;
    });
};
var getRootDirs = function(context) {
    var rootDirs = [
        context.cwd
    ];
    var nextSettings = context.settings.next || {};
    var rootDir = nextSettings.rootDir;
    if (typeof rootDir === 'string') {
        rootDirs = processRootDir(rootDir);
    } else if (Array.isArray(rootDir)) {
        rootDirs = rootDir.map(function(dir) {
            return typeof dir === 'string' ? processRootDir(dir) : [];
        }).flat();
    }
    return rootDirs;
};
