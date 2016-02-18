module FileSplash.FrontEnd{
    
    export function showID(id: string){
        var item = document.getElementById(id)
        item.className = item.className.replace(/indubitebly-hidden/g, "");
    }
    
    export function hideID(id: string){
        var item = document.getElementById(id);
        if(item.className.indexOf("indubitebly-hidden") == -1){
            item.className = item.className + " indubitebly-hidden";
        }
    }
    
}