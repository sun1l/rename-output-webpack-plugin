const fs = require('fs');
const path = require('path');


//rename output webpack plugin
class renameOutputPlugin {

    constructor(map) {
        this.map = map;
    }

    getModuleDirectory(modulePath, moduleName) {
        if (modulePath.indexOf('node_modules') < 0) {
            return false;
        }

        return modulePath.slice(0, modulePath.indexOf(moduleName)) + moduleName;
    }

    isFileExist(filepath) {
        return filepath ? fs.existsSync(path.resolve(filepath)) : false;
    }

    readFile(filepath) {
        return filepath ? fs.readFileSync(filepath, 'utf8') : false;
    }

    parseJson(content) {
        let parsedContent;

        try {
            parsedContent = JSON.parse(content);
        } catch (e) {
            parsedContent = false;
        }

        return parsedContent;
    }

    getChunkModules(chunk){
        let modules = [];

        chunk.forEachModule((module) => {
            let modulePath = this.getModuleDirectory(
                module.context,
                module.rawRequest
            );

            if (modulePath) {
                modulePath = modulePath + '/package.json';
            } else {
                return;
            }

            if (this.isFileExist(modulePath)) {
                let json = this.parseJson(this.readFile(modulePath));

                if (json) {
                    modules.push({
                        'name': json.name,
                        'version': json.version,
                        'path': module.context
                    });
                }
            }
        });

        return modules;
    }

    apply(compiler) {

        compiler.hooks.afterPlugins.tap('this-compilation', (compilation) => {

            compilation.hooks.afterPlugins.tap('optimize-chunks', (chunks) => {

                chunks.forEach((chunk) => {

                    Object.keys(this.map).forEach((outputName) => {

                        if (outputName === chunk.name) {

                            let newOutputName = this.map[outputName].replace(/\[.*?\]/g, (match) => {
                                let version = match;

                                if(match.indexOf('version') >= 0){
                                    let modules, selectedModule;
                                    modules = this.getChunkModules(chunk);

                                    if(match.indexOf('@') >= 0){
                                        let moduleName = match.substr(match.indexOf('@') + 1, match.length - 10);

                                        modules = modules.filter((module) => {
                                            return (module.name === moduleName);
                                        });
                                    }

                                    if(Array.isArray(modules) && modules.length){
                                        selectedModule = modules[0];
                                    }

                                    if(selectedModule.version){
                                        version = selectedModule.version;
                                    }
                                }

                                return version;
                            });
                            chunk.filenameTemplate = newOutputName;
                        }
                    });
                });
            });
        });
    }
}

module.exports = renameOutputPlugin;
