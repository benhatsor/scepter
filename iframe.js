const iframe = document.querySelector('.html');

// Update iframe
async function renderFrame(url) {
  
  // create a HTTP Request with CORS headers
  const resp = await axios.get(url, true);
  
  // inject html into iframe
  iframe.contentDocument.querySelector('html').innerHTML = resp;
  
  // add base url to iframe to prevent breaking relative URLs
  const base = iframe.contentDocument.createElement('base');
  base.href = url;
  
  iframe.contentDocument.querySelector('head').appendChild(base);
  
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
