/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-cli-multi-html-output',

  // Get some insights here on addons hooks: https://ember-cli.com/api/classes/Addon.html
  isDevelopingAddon() {
    return true;
  },

  included(app) {
    this._super.included.apply(this, arguments);
    this.env = app.env;
    this.options = app.options.multiIndex || {};
  },

  postBuild(results) {

    const shell   = this.project.require('shelljs'),
          targets = this.options.targets;

    // Backups the index.html into a template.
    shell.cp(results.directory + '/index.html', results.directory + '/index-template.html');

    // Generates the alternative index.html files.
    for(let target of targets) {

      const outputFile = `${results.directory}/${target.outputPath}`;

      // Duplicates the template into the outputFile.
      shell.cp(results.directory + '/index-template.html', outputFile);

      for(let macro of Object.keys(target.macros)) {

        let replacement = target.macros[macro];

        // If there is environment specific replacement?
        if(typeof replacement === "object") {

          if(replacement.hasOwnProperty(this.env)) {
            replacement = replacement[this.env];
          }

          else {
            replacement = replacement.default;
          }

        }

        // Performs the replacement.
        shell.sed('-i', macro, replacement, outputFile);
      }

    }

    // Deletes the backup.
    shell.rm(results.directory + '/index-template.html');

  }

};
