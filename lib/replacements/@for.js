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

/**
 * for function is unique
 * **/
module.exports = {
  pattern:
    /@for\s([\w$]+)\sfrom\s([\w$]+)\s(through|to)\s(.*)\s\{((?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*)\}/gi,
  replacement: function (match, iterator, initial, through, to, body) {
    const operator = through === "through" ? "<=" : "<";
    // match #{ operation }
    let operation = /\#{(.+?)}/g.exec(body);
    const num = operation[1].split("*")[0];
    operation = operation[1].replace("$", "@");
    // start -> end  ||   end -> start
    const start = initial > to ? to : initial;
    const end = initial > to ? initial : to;
    // uniqueFor prefix
    const prefix = `${/(.+)\#/g.exec(body)[1]}${num}-`;
    return (
      `${prefix}for(${iterator}: ${start}) when (${iterator} ${operator} ${end}) {` +
      `
        @attr: ${operation};
      ` +
      `${body.replace(/\#{(.+?)}/g, "@{attr}")}` +
      `  ${prefix}for((${iterator} + 1));
      }
      ${prefix}for();`
    );
  },
  order: 0,
};
