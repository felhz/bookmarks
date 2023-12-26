const Request = async (api, params = {}, method = 'GET') => {
  let init = {
    method,
  };
  if (method === 'POST') {
    init.body = JSON.stringify(params);
    init.headers = {};
    init.headers['Content-Type'] = 'application/json';
  } else {
    api += '?' + new URLSearchParams(params).toString();
  }
  const res = await fetch(`http://10.254.75.166:3000${api}`, init);
  return await res.json();
};

const Copy = (text) => {
  const type = 'text/plain';
  const blob = new Blob([text], { type });
  const data = [new ClipboardItem({ [type]: blob })];
  return navigator.clipboard.write(data);
};

export { Copy, Request };
