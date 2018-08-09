let urlList = [];

document.addEventListener('DOMContentLoaded', function() {
    getAllUrlsAndRestore();
    document.getElementById('submit').addEventListener('click', addLink);
    document.getElementById('edit').addEventListener('click', goOptions);

});

function addLink(){
    chrome.tabs.query({currentWindow: true, active: true},(tabs)=>{
        //tabs is an array so only fetch first and only object
        var nickName = document.getElementById('nickName').value;
        var id = document.getElementsByTagName('button').length;
        var comment = document.getElementById('comment').value;
        var url = { url: tabs[0].url, nickName: nickName, comment:comment, id: id,};
        if(urlList.indexOf(url) === -1){
            addUrlToListAndSave(url);
            addUrlToDOM(url);
            createRemoveButton();
            createCommentButton();
        };
        document.getElementById('nickName').texContent = "";
        document.getElementById('comment').textContent = "";
    });
};

function getAllUrlsAndRestore() {
    chrome.storage.local.get({urlList:[]}, (data)=>{
        urlList = data.urlList;
        urlList.forEach((url)=>{
            addUrlToDOM(url);
            createRemoveButton();
            createCommentButton();
        })
        setUserColor();
    })
}

function addUrlToDOM(url){
    let parent = document.getElementById("userUrl");
    let nickName = document.getElementById("nickName").value;
    let shadow = document.createElement('div');
    let gridContain = document.createElement('div');
    let gridRow = document.createElement('div');
    let gridCol = document.createElement('div');
    let newLine = document.createElement('li');
    let newLink = document.createElement('a');
    let id = document.getElementsByTagName('li').length;
    let icon = document.createElement('img');
    let cutUrl = document.createElement('p');
    cutUrl.textContent = rootUrl(url);
    newLine.setAttribute('id', 'item'+id);
    if(url['nickName'] != null) {
        newLink.textContent = url['nickName']
    } else {
        newLink.textContent = nickName;
    }
    console.log("url", url)
    chrome.tabs.query({currentWindow:true, active:true},(tabs)=>{
        if(tabs[0].url == url.url){
            newLink.setAttribute('style','color: cadetblue');
            document.getElementById('submit').disabled=true;
            document.getElementById('comment').placeholder="Link Already Saved!"
        }
    })
    shadow.setAttribute('class','shadow');
    shadow.appendChild(newLine);
    cutUrl.setAttribute('class', 'root_url')
    newLink.setAttribute('href', url['url']);
    newLink.setAttribute('target', '_blank');
    newLine.setAttribute('class','listItems');
    gridContain.setAttribute('class', 'container');
    gridContain.setAttribute('id', 'grid-container'+id);
    gridRow.setAttribute('class', 'row');
    gridRow.setAttribute('id', 'grid-row'+id);
    gridCol.setAttribute('class', 'col-6');
    gridContain.appendChild(gridRow);
    gridRow.appendChild(gridCol);
    gridCol.appendChild(newLink);
    newLine.appendChild(gridContain)
    icon.setAttribute('src', rootUrl(url)+'/favicon.ico');
    icon.setAttribute('width','16');
    icon.setAttribute('class', 'icons');
    gridCol.appendChild(icon);
    newLine.appendChild(cutUrl);
    document.getElementById("userUrl").appendChild(shadow);      
}


function addUrlToListAndSave(url){
    if(urlList.indexOf(url) === -1){
        urlList.push(url);
        saveUrlList();
    }
}

function saveUrlList(callback){
    chrome.storage.local.set({urlList}, function(){
        if(typeof callback === 'function'){
            callback();
        }
    })
}
function createRemoveButton(){
    var remove = document.createElement('button');
    var id = document.getElementsByTagName('li').length;
    let gridCol = document.createElement('div');
    let gridRow = document.getElementById('grid-row'+(id-1));
    remove.setAttribute('id', id);
    remove.setAttribute('class', "removeButton")
    remove.textContent = "Remove";
    gridCol.setAttribute('class', 'col');
    gridCol.appendChild(remove);
    gridRow.appendChild(gridCol);
    document.getElementById(id).addEventListener('click', deleteOneFromDOM);
    document.getElementById("grid-container"+(id-1)).appendChild(gridRow);
    console.log(this.id);
}



function deleteOneFromDOM(){
    console.log(this);
    var target = this.id-1;
    chrome.storage.local.get({ 'urlList': []}, (data)=>{
        var urlList = data['urlList'];
        if(urlList[target] != null){
            var newList = urlList.filter((item)=>{
                return item !== urlList[target];
            })
            chrome.storage.local.set({'urlList':newList});
            document.getElementById(this.id).parentElement.parentElement.parentElement.parentElement.remove();
        }
    })
}
function createCommentButton() {
    var comment = document.createElement('button');
    var id = document.getElementsByTagName('li').length;
    let target = document.createElement('div');
    let targetChild = document.createElement('div');
    let gridRow = document.createElement('div');
    let gridCol1 = document.createElement('div');
    let gridCol2 = document.createElement('div');
    comment.setAttribute('class', 'showButton');
    comment.setAttribute('type','button');
    comment.setAttribute('data-toggle', 'collapse');
    comment.setAttribute('data-target', '#collapse'+id);
    comment.setAttribute('aria-expanded', 'false');
    comment.setAttribute('aria-controls', 'collapse'+id);
    // comment.setAttribute('id', "comment"+id);
    comment.textContent = "Note";
    target.setAttribute('class', 'collapse');
    target.setAttribute('id', 'collapse'+id);
    target.setAttribute('class','showNote');
    targetChild.setAttribute('class', 'card card-body');
    
    chrome.storage.local.get('urlList',(data)=>{
        let list = data['urlList'];
        if(list[id-1]['comment'] != ""){
            targetChild.textContent = list[id-1]['comment'];
        } else {
            targetChild.textContent = document.getElementById('comment').value;
        }
    })
    gridRow.setAttribute('class', 'row');
    gridCol1.setAttribute('class', 'col-6-2');
    gridCol2.setAttribute('class', 'col2');
    gridRow.appendChild(gridCol1);
    gridRow.appendChild(gridCol2);
    gridCol1.appendChild(target);
    target.appendChild(targetChild);
    gridCol2.appendChild(comment);
    document.getElementById('grid-container'+(id-1)).appendChild(gridRow);
}



function rootUrl(url){
    let cutUrl = url['url'];
    cutUrl = cutUrl.split([]);
    for(var i = 0; i < cutUrl.length;i++){
        if(cutUrl[i]=='m' && cutUrl[i+1]=='/'){
            cutUrl.length = i+1;
            console.log("this is cut", cutUrl)
        }
    }
    joinUrl = "";
    for(var j = 0; j < cutUrl.length;j++){
        joinUrl += cutUrl[j];
    }
    console.log("after Join", joinUrl);
    return joinUrl;
}

function goOptions(){
    chrome.tabs.create({
        url: "chrome-extension://pafkfkaghbbhkdaiphlaibflejbkdhge/options.html"
    })
}

function setUserColor(){
    chrome.storage.local.get('back_style', (data)=>{
        let backColor = data['back_style'];
        console.log(backColor)
        document.getElementById('cartWrap').setAttribute('style',backColor);
    })

    chrome.storage.local.get('head_style', (data)=>{
        let headerColor = data['head_style'];
        document.getElementById('header').setAttribute('style', headerColor);
    })
    chrome.storage.local.get('footer_style', (data)=>{
        let footerColor = data['footer_style'];
        document.getElementById('navbar-fixed-bottom').setAttribute('style',footerColor);
    })
}