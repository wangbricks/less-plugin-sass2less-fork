/**
 * scss
 * @for $var from <start> through <end>
 * @for $var from <start> to <end>
 * start -> end  || end  -> start
 * through includes =
 * to without =
 * **/

/**
 * less
 * start ->  end
 * **/
module.exports = {
  pattern:
    /@for\s([\w$]+)\sfrom\s([\w$]+)\s(through|to)\s(.*)\s\{((?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*)\}/gi,
  replacement: function (match, iterator, initial, through, to, body) {
    const operator = through === "through" ? "<=" : "<";
    // match #{ operation }
    let operation = /\#{(.+?)}/g.exec(body);
    operation = operation[1].replace("$", "@");
    // start -> end  ||   end -> start
    const start = initial > to ? to : initial;
    const end = initial > to ? initial : to;
    return (
      `.for(${iterator}: ${start}) when (${iterator} ${operator} ${end}) {` +
      `
        @attr: ${operation};
      ` +
      `${body.replace(/\#{(.+?)}/g, "@{attr}")}` +
      `  .for((${iterator} + 1));
      }
      .for();`
    );
  },
  order: 0,
};
