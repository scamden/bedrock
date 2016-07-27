module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'tap'],
    files: [
      '.app/index.js',
      '.app/**/*.spec.js'
    ],
    exclude: [
    ],
    preprocessors: {
      '.app/index.js': ['browserify'],
      '.app/**/*.spec.js': ['browserify']
    },
    port: 9876,
    colors: true,
    client: {
      captureConsole: false
    },

    browserify: {
      debug: true
    },

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,
    autoWatch: true,
    browsers: ['PhantomJS'],
    // browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  })
}
