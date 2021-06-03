
// render iframe
async function renderFrame(url) {
  
  if (document.querySelector('iframe')) {
    document.querySelector('iframe').remove();
  }
  
  // create a HTTP Request with CORS headers
  const resp = await axios.get(url, true);
  
  
  
  // inject html into temporary iframe
  // for HTML manipulation
  
  var tempFrame = document.createElement('iframe');
  document.body.appendChild(tempFrame);
  
  var tempDoc = tempFrame.contentDocument;
  tempDoc.documentElement.innerHTML = resp;
  
  
  // add base url to iframe to prevent breaking relative URLs
  
  var base = tempDoc.createElement('base');
  
  base.href = url;
  tempDoc.head.appendChild(base);
  
  
  // wrap the body in a div, to prevent selecting inspector elements
  
  var org_html = tempDoc.body.innerHTML;
  
  // note: "htmL" is not a typo. added on purpose to prevent targeting "html" classes appearing naturally in websites.
  var new_html = "<div class='htmL'>" + org_html + "</div>";
  
  tempDoc.body.innerHTML = new_html;
  
  // create a shadow root
  var shadow = tempDoc.body.attachShadow({mode: 'open'});
  
  // add scepter to iframe
  shadow.innerHTML = scepterHTML;
  
  
  
  // reload iframe  
  tempFrame.frameBorder = 0;
  tempFrame.allow = 'camera; gyroscope; microphone; autoplay; clipboard-write; encrypted-media; picture-in-picture; accelerometer';
  
  // redirect all <a> tags
  tempDoc.querySelectorAll('.htmL a').forEach((a) => {
    
    var newHref = new URL(a.href, url); 
    
    a.href = 'javascript: window.parent.history.pushState({}, "", "https://scepter.berryscript.com/?url='+ newHref +'");window.parent.renderFrame("'+ newHref +'")';
    
  })
  
  // run all <script> tags
  tempDoc.querySelectorAll('script').forEach(async (script) => {
    
    var code = '';
    
    // if script is external
    if (script.src) {
    
      // get src with base URL
      var absSrc = new URL(script.src, url);
      
      // create a HTTP Request with CORS headers
      code = await axios.get(absSrc, true);
      
    } else {
      
      code = script.innerHTML;
      
    }
    
    // I really did try to find an alternative... but...
    tempFrame.contentWindow.eval(code);
    
  })
  
  tempFrame.contentWindow.eval(reloadScript);
  
  tempFrame.contentWindow.eval(scepterScript);
  
};

// my attempt at running a script without eval()
var setInnerHTML = function(elm, html) {
  elm.innerHTML = html;
  Array.from(elm.querySelectorAll("script")).forEach(oldScript => {
    const newScript = tempDoc.createElement("script");
    Array.from(oldScript.attributes)
      .forEach(attr => newScript.setAttribute(attr.name, attr.value));
    newScript.appendChild(tempDoc.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

var axios = {
  'get': (url, cors) => {
    return new Promise((resolve, reject) => {
      try {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            resolve(this.responseText);
          }
        };

        cors = cors ? 'https://berrycors.herokuapp.com/' : '';

        xmlhttp.open('GET', (cors + url), true);
        xmlhttp.send();
      } catch(e) { reject(e) }
    });
  }
};

var scepterHTML = `
    <div class="overlay"></div>
    <div class="inspector">
      <div class="option class">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" fill="currentColor"></path></svg>
        <a>Classes and IDs</a>
      </div>
      <div class="option code" style="display:none">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" fill="currentColor"></path></svg>
        <a>Add new CSS</a>
      </div>
    </div>
    <div class="expanded--overlay"></div>
    <div class="popover">
      <div class="header">
        <div class="type">&lt;div&gt;</div>
        <svg class="close" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" fill="currentColor"></path></svg>
      </div>
      <div class="content">
        <div class="item">
          <div class="desc">Classes and IDs</div><div class="text classes" dir="auto">.actions #a</div>
        </div>
        <div class="title">Children</div>
        <div class="actions">
          <div class="action">
            <div class="desc">.action .actions--first .act .acti .act</div>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" class="icon"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z" fill="currentColor"></path></svg>
          </div>
        </div>
      </div>
    </div>
    <link rel="stylesheet" href="https://scepter.berryscript.com/scepter.css">`;

var reloadScript = `
function fireEvent(element, event) {
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent(event, true, true); // event type,bubbling,cancelable
  return !element.dispatchEvent(evt);
}
var links = document.getElementsByTagName("link");
var st = [];
for (var x = 0; x < links.length; x++)
  if (links[x].getAttribute("rel") == "stylesheet") {
    st.push(links[x]);
    links[x].wasAtt = links[x].getAttribute("href");
    links[x].setAttribute("href", "");
  }
setTimeout(function() {
  for (var x = 0; x < st.length; x++)
    st[x].setAttribute("href", st[x].wasAtt);
  setTimeout(function() {
    fireEvent(window, "load");
  }, 0);
}, 0);
`;

var scepterScript = `const elementsWrapper=document.querySelector(".htmL"),elements=elementsWrapper.querySelectorAll("*"),overlay=document.querySelector(".overlay"),expandedOverlay=document.querySelector(".expanded--overlay"),inspector=document.querySelector(".inspector"),classOption=inspector.querySelector(".option.class"),codeOption=inspector.querySelector(".option.code"),popover=document.querySelector(".popover"),popoverType=popover.querySelector(".type"),popoverClose=popover.querySelector(".close"),popoverContent=popover.querySelector(".content");elements.forEach(t=>{let s;function e(e){return s=window.setTimeout(()=>{selectElement(t)},350),!1}function o(){return clearTimeout(s),!1}t.addEventListener("mousedown",e),t.addEventListener("touchstart",e),t.addEventListener("mouseup",o),t.addEventListener("mouseout",o),t.addEventListener("touchend",o),t.addEventListener("touchleave",o),t.addEventListener("touchcancel",o),t.addEventListener("touchmove",o)});let selectQueue=[];function selectElement(i){if(!i.classList.contains("seElected")){selectQueue.unshift(i);let e=elementsWrapper.querySelectorAll(".seElected");e.forEach(e=>{e.classList.remove("seElected")}),selectQueue[0].classList.add("seElected"),overlay.classList.add("visible");var l=getPosRelToViewport(selectQueue[0]),i=selectQueue[0].clientHeight,i=l.top+i,l=l.left;inspector.style.top=i+"px",inspector.style.left=l+"px";let t=selectQueue[0].nodeName.toLowerCase(),s=Array.from(selectQueue[0].classList),o=selectQueue[0].id,n=t;0<s.length&&(n+="."+s.join(".")),o&&(n+="#"+o.split(" ").join("#")),classOption.children[1].innerText=n.replace(".seElected","")}}let clickOverride=overlay.addEventListener("click",()=>{let e=elementsWrapper.querySelectorAll(".seElected");e.forEach(e=>{e.classList.remove("seElected")}),overlay.classList.remove("visible"),selectQueue=[]});function repositionMenu(){var e,t;selectQueue[0]&&(t=getPosRelToViewport(selectQueue[0]),e=selectQueue[0].clientHeight,e=t.top+e,t=t.left,(e>window.innerHeight||e<0)&&console.log('Outside window'),inspector.style.top=e+"px",inspector.style.left=t+"px")}function getPosRelToViewport(e){var t=e.getBoundingClientRect();e.ownerDocument.defaultView;return{top:t.top,left:t.left}}function renderPopover(n){popoverType.innerText="<"+n.nodeName.toLowerCase()+">",popoverContent.innerHTML="";let e=Array.from(selectQueue[0].classList),t=selectQueue[0].id,s="";0<e.length&&(s+=" ."+e.join(" .")),t&&(s+=" #"+t.split(" ").join(" #")),s=s.replace(" .seElected",""),s&&" .seElected"!=s&&(popoverContent.innerHTML+='<div class="item"><div class="desc">Classes and IDs</div><div class="text">'+s+"</div></div>");let o=Array.from(selectQueue[0].children);if(0<o.length){let i='<div class="title">Children</div><div class="actions">';o.forEach(e=>{let t=e.nodeName.toLowerCase(),s=Array.from(e.classList),o=e.id,n=t;0<s.length&&(n+="."+s.join(".")),o&&(n+="#"+o.split(" ").join("#")),i+='<div class="action"><div class="desc">'+n+'</div><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" class="icon"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h4v-2H5V8h14v10h-4v2h4c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm-7 6l-4 4h3v6h2v-6h3l-4-4z" fill="currentColor"></path></svg></div>'}),popoverContent.innerHTML+=i+"</div>"}let i=selectQueue[0].parentElement;if(i&&i!=elementsWrapper){n='<div class="title">Parent</div><div class="actions">';let e=i.nodeName.toLowerCase(),t=Array.from(i.classList),s=i.id,o=e;0<t.length&&(o+="."+t.join(".")),s&&(o+="#"+s.split(" ").join("#")),n+='<div class="action parent"><div class="desc">'+o+'</div><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" class="icon"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h4v-2H5V8h14v10h-4v2h4c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm-7 6l-4 4h3v6h2v-6h3l-4-4z" fill="currentColor"></path></svg></div>',popoverContent.innerHTML+=n+"</div>"}let l=popoverContent.querySelectorAll(".action");l.forEach((t,s)=>{t.addEventListener("click",()=>{popover.classList.add("hidden");let e=elementsWrapper.querySelectorAll(".seElected");e.forEach(e=>{e.classList.remove("seElected")}),selectQueue=[],window.setTimeout(()=>{var e=t.classList.contains("parent")?i:o[s];selectElement(e),renderPopover(e),popover.classList.add("transitioning"),popover.classList.remove("hidden"),window.setTimeout(()=>{popover.classList.remove("transitioning")},250)},300)})})}window.addEventListener("resize",repositionMenu,!0),window.addEventListener("scroll",repositionMenu,!0),elements.forEach(e=>{e.addEventListener("contextmenu",e=>e.preventDefault())}),classOption.addEventListener("click",()=>{renderPopover(selectQueue[0]),inspector.classList.add("expanded")}),expandedOverlay.addEventListener("click",()=>{inspector.classList.add("transitioning"),inspector.classList.remove("expanded"),window.setTimeout(()=>{inspector.classList.remove("transitioning")},480)}),popoverClose.addEventListener("click",()=>{inspector.classList.add("transitioning"),inspector.classList.remove("expanded"),window.setTimeout(()=>{inspector.classList.remove("transitioning")},480)});`;

var url = new URL(window.location.href),
    requestedURL = url.searchParams.get('url');

if (requestedURL) {
  renderFrame(requestedURL);
} else {
  renderFrame('https://berryscript.com');
}
