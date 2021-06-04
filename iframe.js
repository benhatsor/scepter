
// create a class for the scepter element
class ScepterElement extends HTMLElement {
  
  constructor() {
    
    // always call super first in constructor
    super();

    // create a shadow root
    let shadow = this.attachShadow({mode: 'open'});
    
    // add scepter HTML to shadow dom
    shadow.innerHTML = window.parent.scepterHTML;
    
    // apply external styles to the shadow dom
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', 'https://scepter.berryscript.com/scepter.css');

    // attach the created element to the shadow dom
    shadow.appendChild(linkElem);
    
    // reload page
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
    
    // init scepter
    window.parent.scepter.init(shadow);
    
  }
  
}



// render iframe
async function renderFrame(url) {
  
  // if an iframe already exists
  if (document.querySelector('iframe')) {
    
    // remove old iframe
    document.querySelector('iframe').remove();
    
    // push new url to history
    window.history.pushState({}, '', 'https://scepter.berryscript.com/?url='+ url);
    
  }
  
  // create a HTTP Request with CORS headers
  const resp = await axios.get(url, true);
  
  
  
  // inject html into temporary iframe
  // for HTML manipulation
  
  var tempFrame = document.createElement('iframe');
  tempFrame.frameBorder = 0;
  tempFrame.allow = 'camera; gyroscope; microphone; autoplay; clipboard-write; encrypted-media; picture-in-picture; accelerometer';
  
  document.body.appendChild(tempFrame);
  
  var tempDoc = tempFrame.contentDocument;
  tempDoc.documentElement.innerHTML = resp;
  
  
  // add base url to iframe to prevent breaking relative URLs
  
  var base = tempDoc.createElement('base');
  
  base.href = url;
  tempDoc.head.appendChild(base);
  
  
  // add scepter shadow boundary CSS to iframe
  let style = document.createElement('style');
  
  style.textContent = scepterOutlyingCSS;
  tempDoc.head.appendChild(style);
  
  
  // redirect all links
  tempDoc.querySelectorAll('a').forEach((a) => {
    
    // get href with base URL
    var newHref = new URL(a.href, url); 
    
    a.href = 'javascript: window.parent.renderFrame("'+ newHref +'")';
    
  })
  
  
  // run all scripts
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
  
  
  // add scepter to iframe
  
  // define the scepter element
  let customElementRegistry = tempFrame.contentWindow.customElements;
  customElements.define('scepter-element', ScepterElement);
  
  // add the scepter element to dom
  var scepterElem = tempDoc.createElement('scepter-element');
  tempDoc.body.appendChild(scepterElem);
  
}

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
}

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
    `;

var scepterOutlyingCSS = `
body *:not(scepter-element) {
  transition: .3s ease;
}

body *:not(scepter-element):active {
  transform: scale(0.94);
}

body .seElected *:active {
  transform: none;
}

body .seElected {
  position: relative;
  transform: scale(1.04);
  
  border-radius: 1% !important;
  box-shadow: 0 0 0 10px rgb(104 187 228 / 12%);
  background: rgba(104,187,228,0.12);
  
  transition: 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.2), 0s z-index;
  z-index: 999999999 !important;
}
`;

var url = new URL(window.location.href),
    requestedURL = url.searchParams.get('url');

if (requestedURL) {
  renderFrame(requestedURL);
} else {
  renderFrame('https://berryscript.com');
}
