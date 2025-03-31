
export default async function handler(request, response) {
    
  const headers = request.headers;

  const url = headers['request-url'];
  delete headers['request-url'];
  
  
  const resp = await fetch(url, { headers });

  const data = await resp.text();
  
  
  response.status(resp.status).send(data);
  
}
