const iframe = document.querySelector('.html');

// Update iframe
async function renderFrame() {
  
  const resp = await axios.get('https://berryscript.com');
  
  iframe.contentDocument.querySelector('html').innerHTML = resp;
  
  scepter.init(iframe);
  
};

renderFrame();

var axios = {
  'get': (url, options) => {
    return new Promise((resolve, reject) => {
      try {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            resolve(this.responseText);
          }
        };

        cors = options ? 'https://berrycors.herokuapp.com/' : '';

        xmlhttp.open('GET', (cors + url), true);
        xmlhttp.send();
      } catch(e) { reject(e) }
    });
  }
};
