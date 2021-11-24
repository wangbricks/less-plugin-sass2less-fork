#!/usr/bin / env node

const sass2less = require("../../lib");
const converter = new sass2less();
const readline = require("readline");
const fs = require("fs");
const path = require("path");
const util = {
  isFile: (fileName) => {
    return fs.lstatSync(fileName).isFile();
  },
  isDir: (fileName) => {
    return fs.lstatSync(fileName).isDirectory();
  },
};

let dir_path = "./";
let ext = "scss";

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const reName = (dir, ext, srcExt) => {
  const dir_path = path.resolve(dir);
  let fileList = null;
  try {
    fileList = fs.readdirSync(dir_path);
  } catch (e) {
    console.log("文件夹地址有误", e);
    return;
  }
  for (let i = 0; i < fileList.length; i++) {
    // 判断文件是scss、sass
    const filePath = path.join(dir, fileList[i]);

    if (util.isFile(filePath)) {
      const parsed = path.parse(filePath);
      // srcExt ，隔开
      const srcExtArr = srcExt.split(",");
      if (!srcExtArr.includes(parsed.ext.slice(1))) {
        if (parsed.ext.slice(1) === "less") {
          // 替换scss内容为less
          // 1、读取文件内容，scss2less
          let data = fs.readFileSync(filePath, "utf8");
          // 2、匹配所有的引入.scss改成.less
          data = data.replace(/\.scss/g, ".less");
          // 3、重写
          fs.writeFileSync(filePath, data, function (err) {
            if (err) return console.log("less替换scss", err);
          });
          console.log(`替换 less文案成功===>done`);
        }

        continue;
      }
      const newFileName = parsed.name + ext;
      try {
        // 1、重命名文件
        const newFilePath = path.join(parsed.dir, newFileName);
        fs.renameSync(filePath, newFilePath);
        // 2、读取文件内容，scss2less
        let data = fs.readFileSync(newFilePath, "utf8");
        // 3、匹配所有的引入.scss改成.less
        data = data.replace(/\.scss/g, ".less");
        const lessResult = converter.process(data, {
          fileInfo: { filename: "anything.scss" },
        });
        fs.writeFileSync(newFilePath, lessResult, function (err) {
          if (err) return console.log("scsstolessErr", err);
        });
        console.log(`${filePath} ========> ${newFilePath}===>done`);
      } catch (error) {
        throw error;
      }
    } else if (util.isDir(filePath)) {
      reName(filePath, ext, srcExt);
    }
  }
  console.log("done");
};

rl.question(`请输入文件夹地址: `, (res1) => {
  console.log(`文件夹地址是: ${res1}!`);
  dir_path = res1;
  rl.question(`需要修改的文件后缀: `, (srcExt) => {
    rl.question(`要将后缀名都改成什么: `, (res2) => {
      if (res2.startsWith(".")) {
        ext = res2;
      } else {
        ext = "." + res2;
      }
      rl.question(
        `是否把 ${dir_path} 下的全部文件的后缀都改成 ${ext} yes(y) or no(n) : `,
        (res3) => {
          if (res3 == "yes" || res3 == "y") {
            reName(dir_path, ext, srcExt);

            rl.close();
          } else if (res3 == "no" || res3 == "n") {
            console.log("exit");
            rl.close();
          }
        }
      );
    });
  });
});
