module FileSplash.Styles{
    
    function applyStyles(){
        var styleSheet=document.createElement("link")
        styleSheet.setAttribute("rel", "stylesheet")
        styleSheet.setAttribute("type", "text/css")
        styleSheet.setAttribute("href", "http://www.michalpaszkiewicz.co.uk/filesplash/styles.css")
        
        document.body.appendChild(styleSheet);
    }
    
    applyStyles();
}