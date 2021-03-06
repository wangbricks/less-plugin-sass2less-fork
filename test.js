let less = require("less");
let sass2less = require("./lib/plugin");
let fs = require("fs");
let file;

// get a file
fs.readFile(
  "./examples/scss2lessExample/scss/a.scss",
  "utf-8",
  function (err, contents) {
    if (err) return console.log(err);
    file = contents;

    less
      .render(file, {
        plugins: [sass2less],
      })
      .then(
        function (output) {
          console.log(output.css);
        },
        function (error) {
          console.log(error);
        }
      );
  }
);
