var pkg = require("../package.json");

var banner = `
  /*******************************************************************************
  *
  *  ██╗      ███╗   ██╗      ██████╗       ██╗       ██████╗        ██████╗
  *  ██║      ████╗  ██║      ██╔══██╗      ██║      ██╔════╝       ██╔═══██╗
  *  ██║      ██╔██╗ ██║      ██║  ██║      ██║      ██║  ███╗      ██║   ██║
  *  ██║      ██║╚██╗██║      ██║  ██║      ██║      ██║   ██║      ██║   ██║
  *  ██║      ██║ ╚████║      ██████╔╝      ██║      ╚██████╔╝      ╚██████╔╝
  *  ╚═╝      ╚═╝  ╚═══╝      ╚═════╝       ╚═╝       ╚═════╝        ╚═════╝
  *
  * ${pkg.version}
  * ${pkg.homepage}
  * ${pkg.repository.url}
  * Bugs: ${pkg.bugs.url}
  * License: ${pkg.license}
  * Timestamp: ${new Date()}
  *******************************************************************************/
`;

module.exports = function(gulp, plugins, src, dest) {
  return function() {
    var stream = gulp
      .src(src)
      .pipe(plugins.header(banner))
      .pipe(gulp.dest(dest));
    return stream;
  };
};
