
// render iframe
async function renderFrame(url) {
  
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
  
  // add scepter to iframe
  tempDoc.body.innerHTML = scepterHTML + new_html;
  
  
  
  // create iframe and inspect it
  var iframe = document.createElement('iframe');
  
  iframe.src = '';
  iframe.frameborder = 0;
  iframe.allow = 'camera; gyroscope; microphone; autoplay; clipboard-write; encrypted-media; picture-in-picture; accelerometer';
  
  document.body.appendChild(iframe);
  
  iframe.contentDocument.documentElement.innerHTML = tempDoc.documentElement.innerHTML;
  
  //document.body.removeChild(tempFrame);
  
};

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
    <link rel="stylesheet" href="https://scepter.berryscript.com/scepter.css">
    <script src="https://scepter.berryscript.com/scepter.js"></script>`;

renderFrame('https://berryscript.com');