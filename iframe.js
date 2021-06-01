const iframe = document.querySelector('.html');

// Update iframe
async function renderFrame(url) {
  
  // create a HTTP Request with CORS headers
  const resp = await axios.get(url, true);
  
  const frameDoc = iframe.contentDocument,
        frameHead = frameDoc.querySelector('head');
  
  // inject html into iframe
  frameDoc.querySelector('html').innerHTML = resp;
  
  // add base url to iframe to prevent breaking relative URLs
  const base = frameDoc.createElement('base');
  base.href = url;
  
  frameHead.appendChild(base);
  
  // inspect the iframe
  scepter.init(iframe);
  
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

renderFrame('https://berryscript.com');
