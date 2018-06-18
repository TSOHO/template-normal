'use strict';

var through = require('through2');
var path = require('path');
var cheerio = require("cheerio")
var _ = require('underscore');

var defaults = {
  pc: 1200
}

function positionHack(options) {
  var opts = _.defaults((options || {}), defaults);

  var hackText = ['data-pc-size', 'data-m-size']
  var TPL = "<style><m>@media (min-width: " + opts.pc + "px) {<pc>}</style>"

  return through.obj(function(file, enc, cb) {
    if (file.isNull() || file.isDirectory()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError("position", 'Streaming not supported'));
      return cb();
    }

    var styleTpl = ".<styleName>{padding-top:<value>%;}"
    var styleStrPc = ""
    var styleStrM = ""

    const $ = cheerio.load(file.contents.toString())

    $(".loading-placeholder").each(function(i, o) {
      var $data = $(this).data()
      var msize = $data.mSize.split("x")
      var pcsize = $data.pcSize.split("x")
      var m = msize[1] / msize[0] * 100
      var pc = pcsize[1] / pcsize[0] * 100
      var classname = "p-"+Math.floor((Math.random()*1000000))

      styleStrPc += styleTpl.replace("<value>", pc.toFixed(6)).replace("<styleName>", classname)
      styleStrM += styleTpl.replace("<value>", m.toFixed(6)).replace("<styleName>", classname)

      $(this).addClass(classname)
    })

    $("head").append(TPL.replace("<m>", styleStrM).replace("<pc>", styleStrPc))

    file.contents = new Buffer($.html() || '')
    this.push(file)

    cb()
  })
}

module.exports = positionHack
