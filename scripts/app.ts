/// <reference path="dropCanvas.ts" />

module FileSplash {

    export function onFileSplash(func: (name: string, text: string)=>void){
        DropCanvas.Instance.onStopFuncs.push(function(realFile: RealFile){
            func(realFile.name, realFile.text);
        });
    }
    
    export function clearOnFileSplashEvents(){
        DropCanvas.Instance.onStopFuncs = [];
    }

    if (typeof document != "undefined") { 
         
        document.body.ondrag = function (e) {
            //e.preventDefault();

            return false;
        } 

        document.body.ondrop = function (e) {
            e.preventDefault();

            DropCanvas.Instance.drop(e.clientX, e.clientY);

            var files = e.dataTransfer.files;

            var blah = e.dataTransfer.getData("utf8");

            var j = 0;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                var reader = new FileReader();

                reader.onload = function (e) {
                    var thisFile = files[j];

                    var fileText = (<FileReader>e.target).result;
                    
                    DropCanvas.Instance.realFiles.push(new RealFile(thisFile.name, fileText));
                    j++;
                }

                reader.readAsText(file);
            }

            return false;
        }

        document.body.ondragend = function (e) {
            e.preventDefault();

            DropCanvas.Instance.drop(e.clientX, e.clientY);

            return false;
        }

        var inCorrectFiles = false;

        document.body.ondragstart = function (e) {
            e.preventDefault();

            return false;
        }

        document.body.ondragenter = function (e) {
            e.preventDefault();

            return false;
        }

        document.body.ondragover = function (e) {
            e.preventDefault();

            DropCanvas.Instance.start();

            return false;
        }

        document.getElementById("drag-drop-canvas").ondragleave = function (e) {
            e.preventDefault();

            DropCanvas.Instance.stop();

            return false;
        }
    }
} 