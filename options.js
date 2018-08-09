let page = document.getElementById('buttonDiv');




document.getElementById("deleteAll").addEventListener('click', function(){
    chrome.storage.local.clear(function () {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    })
})

function setBackgroundColor(){
    let backgroundCanvas = document.getElementById('background');
    let headerCanvas = document.getElementById('header');
    let backContext = backgroundCanvas.getContext('2d');
    let footerCanvas = document.getElementById('footer_color');
    let footContext = footerCanvas.getContext('2d');
    let headContext = headerCanvas.getContext('2d');
    let footerImage = new Image(125,125);
    let backgroundImage = new Image(125,125);
    let headerImage = new Image(125,125);
    let borderCanvas = document.getElementById("border");
    let borderContext = borderCanvas.getContext('2d');
    let borderImage = new Image(125,125);
    backgroundImage.onload=()=>{
        backContext.drawImage(backgroundImage, 0,0,backgroundImage.width, backgroundImage.height); 
    }
    backgroundImage.src="./images/color_wheel.png";
    backgroundCanvas.addEventListener('click', (mouseEvent)=>{
        let imgData = backContext.getImageData(mouseEvent.offsetX, mouseEvent.offsetY, 1, 1);
        let rgba = imgData.data;
        document.getElementById('background_preview').setAttribute('style', 'background-color: rgba('+rgba+')');
    })

    headerImage.onload=()=>{
        headContext.drawImage(headerImage, 0 ,0,headerImage.width, headerImage.height);
    }
    headerImage.src="./images/color_wheel.png";
    headerCanvas.addEventListener('click', (mouseEvent)=>{
        let imgData = headContext.getImageData(mouseEvent.offsetX, mouseEvent.offsetY,1,1);
        let rgba = imgData.data;
        document.getElementById('header_preview').setAttribute('style', 'background-color: rgba(' + rgba + ')');
    })

    borderImage.onload=()=>{
        borderContext.drawImage(borderImage, 0,0,borderImage.width, borderImage.height);
    }
    borderImage.src="./images/color_wheel.png";
    borderCanvas.addEventListener('click', (mouseEvent)=>{
        let imgData = borderContext.getImageData(mouseEvent.offsetX, mouseEvent.offsetY,1,1);
        let rgba = imgData.data;
        document.getElementById('border_preview').setAttribute('style', 'background-color: rgba(' + rgba + ')');
    })

    footerImage.onload=()=>{
        footContext.drawImage(footerImage, 0,0,footerImage.width, footerImage.height);
    }
    footerImage.src="./images/color_wheel.png";
    footerCanvas.addEventListener('click', (mouseEvent)=>{
        let imgData = footContext.getImageData(mouseEvent.offsetX, mouseEvent.offsetY, 1, 1);
        let rgba = imgData.data;
        document.getElementById('footer_preview').setAttribute('style', 'background-color:rgba('+rgba+')');
    })
}
setBackgroundColor();

function saveOptions(){
    let save = document.getElementById('save_button');
    save.addEventListener('click', saveClick);
    
}
saveOptions();
var save = false
function saveClick(){
    if(save == false){
        let confirm = document.createElement('p');
        confirm.textContent = "Changes Saved"
        document.getElementById('save_button').appendChild(confirm);
        save = true;      
    }
    let back = document.getElementById('background_preview').style.backgroundColor;
    let head = document.getElementById('header_preview').style.backgroundColor;
    let border = document.getElementById('border_preview').style.backgroundColor;
    let footer = document.getElementById('footer_preview').style.backgroundColor;
    chrome.storage.local.set({'back_style':'background-color:'+back});
    chrome.storage.local.set({ 'head_style': 'color:' + head });
    chrome.storage.local.set({ 'border_style': 'border: solid ' + border});
    chrome.storage.local.set({ 'footer_style': 'background-color:' + footer});

}

function restoreClick(){

}

