
// render iframe
async function renderFrame(url) {
  
  // if an iframe already exists
  if (document.querySelector('iframe')) {
    
    // remove old iframe
    document.querySelectorAll('iframe').forEach(iframe => { iframe.remove() });
    
  }
  
  // push new url to history
  window.history.pushState({}, '', (window.location.origin + '/?url=' + url));
  
  // show loading screen
  document.querySelector('.loading').classList = 'loading';
  document.querySelector('.loading-image').classList.remove('loaded');
  
  // set a loading timeout
  /*window.setTimeout(() => {
    
    /* What did it take?
    document.querySelector('.loading').classList.add('snap');
    /* Everything.
    document.querySelector('.loading .subtitle').innerText = 'Aw, snap! Timed out.';
    
  }, 30000);*/
  
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
  // note: this does not apply for CSS urls [eg. url('images/name.ext')]
  // ref: https://stackoverflow.com/questions/3812375/specifying-base-url-for-css
  
  var base = tempDoc.createElement('base');
  
  base.href = url;
  tempDoc.head.appendChild(base);
  
  
  // add scepter shadow boundary CSS to iframe
  let style = document.createElement('style');
  
  style.textContent = scepterOutlyingCSS;
  tempDoc.head.appendChild(style);
  
  
  // show site image in loading screen
  var loadingImage = document.querySelector('.loading-image');
  var ogImage = tempDoc.querySelector('meta[property="og:image"]');
  
  // if og image exists
  if (ogImage) {
    
    // get og image with base URL
    var ogImageUrl = new URL(ogImage.content, url);

    // show og image in loading screen
    loadingImage.src = ogImageUrl;
    loadingImage.onload = () => { loadingImage.classList.add('loaded') };
    
  }
  
  
  // redirect all links
  tempDoc.querySelectorAll('a[href]').forEach((a) => {
    
    // get href with base URL
    var newHref = new URL(a.href, url); 
    
    a.ontouchstart = () => { window.parent.renderFrame(newHref) };
    
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
    
    
    // filter scripts
    
    // allow framing
    if (code.includes('top!==self')) code = code.replace('top!==self','self!==self');
    if (code.includes('window.top')) code = code.replace('window.top','window');
    if (code.includes('window.parent')) code = code.replace('window.parent','window');
    
    // prevent changing domain
    if (code.includes('window.document.domain')) code = code.replace('window.document.domain','window.location.origin');
    
    // redirect on changing location of window
    /* if (code.includes('window.location.href=')) code = code.replace('window.location.href=','window.parent.renderFrame(');
    if (code.includes('window.location.href =')) code = code.replace('window.location.href =','window.parent.renderFrame('); */
    
    
    // discussion about replacing eval():
    // https://github.com/barhatsor/scepter/issues/2
    tempFrame.contentWindow.eval(code);
    
  })
  
  
  // add scepter to iframe
  tempFrame.contentWindow.eval(scepterClass);
  
  // add the scepter element to dom
  var scepterElem = tempDoc.createElement('scepter-element');
  tempDoc.body.appendChild(scepterElem);
  
}

var axios = {
  'get': (url, cors) => {
    return new Promise((resolve, reject) => {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          resolve(this.responseText);
        }
      };

      cors = cors ? 'https://sceptercors.herokuapp.com/' : '';

      xmlhttp.open('GET', (cors + url), true);

      try {
        xmlhttp.send();
      } catch(e) { reject(e) }
    });
  }
}

var scepterClass = `
// create a class for the scepter element
class ScepterElement extends HTMLElement {
  
  constructor() {
    
    // always call super first in constructor
    super();

    // get parent window
    let parentWindow = window.parent;

    // create a shadow root
    let shadow = this.attachShadow({mode: 'open'});
    
    // add scepter HTML to shadow dom
    shadow.innerHTML = parentWindow.scepterHTML;
    
    // apply external styles to the shadow dom
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '`+ window.location.origin +`/scepter.css');
    
    // hide loader when styles are loaded
    linkElem.onload = () => { parentWindow.document.querySelector('.loading').classList.add('hidden') };

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
    
    for (var x = 0; x < links.length; x++) {
    
      if (links[x].getAttribute('rel') == 'stylesheet') {
        
        st.push(links[x]);
        links[x].wasAtt = links[x].getAttribute('href');
        links[x].setAttribute('href', '');
        
      } else {
      
        // fetch fonts with CORS
        links[x].setAttribute('crossorigin', '');
        
      }
      
    }
    
    setTimeout(() => {
    
      for (var x = 0; x < st.length; x++) {
        
        st[x].setAttribute('href', st[x].wasAtt);
        
        // if could not fetch the resource normally, try a CORS fetch
        st[x].onerror = function() {
        
          st[x].setAttribute('crossorigin', '');
          st[x].setAttribute('href', '');
          
          setTimeout(() => {
            st[x].setAttribute('href', st[x].wasAtt);
          }, 0);
          
        };
        
      }
      
      setTimeout(() => {
        fireEvent(window, "load");
      }, 0);
      
    }, 0);
    
    
    // init scepter
    parentWindow.scepter.init(document.body, shadow);
    
  }
  
}

// define the scepter element
window.customElements.define('scepter-element', ScepterElement);
`;

var scepterHTML = `
    <div class="overlay"></div>
    <div class="inspector">
      <div class="option class">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" fill="currentColor"></path></svg>
        <a>Classes and IDs</a>
      </div>
      <div class="option console">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M15 7.29V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v4.29c0 .13.05.26.15.35l2.5 2.5c.2.2.51.2.71 0l2.5-2.5c.09-.09.14-.21.14-.35zM7.29 9H3c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h4.29c.13 0 .26-.05.35-.15l2.5-2.5c.2-.2.2-.51 0-.71l-2.5-2.5C7.55 9.05 7.43 9 7.29 9zM9 16.71V21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-4.29c0-.13-.05-.26-.15-.35l-2.5-2.5c-.2-.2-.51-.2-.71 0l-2.5 2.5c-.09.09-.14.21-.14.35zm7.35-7.56l-2.5 2.5c-.2.2-.2.51 0 .71l2.5 2.5c.09.09.22.15.35.15H21c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1h-4.29c-.14-.01-.26.04-.36.14z" fill="currentColor"></path></svg>
        <a>Console</a>
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
body, html {
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}
body .seElected {
  border-radius: 1px !important;
  box-shadow: 0 0 0 10px rgb(104 187 228 / 12%);
  background-color: rgba(104,187,228,0.12);
  
  transition: 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.2) !important;
}
`;

function pushUrl() {
  var url = new URL(window.location.href),
    requestedURL = url.searchParams.get('url');

  if (requestedURL) {
    renderFrame(requestedURL);
  } else {
    renderFrame('https://berryscript.com');
  }
}

// rerender iframe when pressed "back" button in browser
window.addEventListener('popstate', pushUrl);

// listen for errors
window.addEventListener('error', (message) => {
  
  document.querySelector('.loading').classList = 'snap';
  document.querySelector('.loading .subtitle').innerText = message;
  
})

// render iframe
pushUrl();
