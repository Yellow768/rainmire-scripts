

var File = Java.type("java.io.File");
var Files = Java.type("java.nio.file.Files");
var Paths = Java.type("java.nio.file.Paths");
var CHARSET_UTF_8 = Java.type("java.nio.charset.StandardCharsets").UTF_8;

var JSON_FILEPATH = 'folderName/settings.json';
//In a server, this will locate at: %serverFolder%/folderName/settings.json
//In singleplayer, this will locate at: .minecraft/folderName/settings.json

var JSON_FILE = new File(JSON_FILEPATH);
if (!JSON_FILE.exists()) {
    mkPath(JSON_FILEPATH);
    writeToFile(JSON_FILEPATH, '{"foo":"bar"}'); //Write an empty JSON object to file by default (so that its valid JSON), because we dont want errors because of invalid json
    //You can see here I did '{"foo": "bar"}' also, but its for an example, else you would have put the '{}'
}

var jsonString = readFileAsString(JSON_FILEPATH);
var jsonObject = JSON.parse(jsonString);






function mkPath(path) { //This will create a path, if you provide a path with non-existend directories it will create them, very handy
    var expath = path.split("/");
    var curpath = "";
    for (var ex in expath) {
        var expt = expath[ex];
        curpath += (curpath == "" ? "" : "/") + expt;
        var pfile = new File(curpath);
        if (!pfile.exists()) {
            if (expt.match(/[\w]+\.[\w]+/) === null) { //is dir?
                pfile.mkdir();
            } else {
                pfile.createNewFile();
            }
        }
    }
}

function readDir(dirPath) {
    var res = [];
    var files = new File(dirPath).listFiles();
    for (var id in files) {
        if (file.isDirectory())
            res = res.concat(readDir(file.toString()));
        else
            res.push(Java.from(readFile(file.toString())).join("\n").replace(/\t/g, "  "));
    }
    return res;
}

function readFileAsString(filePath) {
    try {
        return Java.from(readFile(filePath)).join("\n").replace(/\t/g, "  ");

    } catch (exc) {
        return readFile(filePath).join("\n").replace(/\t/g, "  ");
    }
}


function readFile(filePath) {
    var path = Paths.get(filePath);
    try {
        var lines = Files.readAllLines(path, CHARSET_UTF_8);
        return lines;
    } catch (e) {
        return [];
    }
}

function writeToFile(filePath, text, offset, length) {
    var path = Paths.get(filePath);
    try {
        var writer = Files.newBufferedWriter(path, CHARSET_UTF_8);
        writer.write(text, offset || 0, length || text.length);
        writer.close();
        return true;
    } catch (exc) {
        return false
    }
}

