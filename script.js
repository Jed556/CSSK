var reader = new FileReader();

function readText(that) {
    if (that.files && that.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var output = e.target.result;
            output = output.split("\n").join("");
            document.getElementById('text').innerHTML = output;
        };//end onload()
        reader.readAsText(that.files[0]);
    }//end if html5 filelist support
    document.getElementById("text").classList.add("content");
}