module.exports = function (config) {
  config.set({
    // files: config.files.test.unit,

    preprocessors: {
      '**/*.coffee': ['coffee']
    },

    frameworks: ['jasmine'],

    reporters: ['growl', 'progress', 'beep'],

    browsers: ['Chrome']
  });
};
