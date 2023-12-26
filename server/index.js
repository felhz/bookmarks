const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express({});
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/api', (req, res) => {
  console.log(req.query);
  res.json({ message: 'Hello from server!' });
});
app.post('/api/link', (req, res) => {
  const filesName = new Date().getTime();
  fs.writeFileSync(
    `${__dirname}/temp/${filesName}.json`,
    JSON.stringify(req.body.data)
  );
  res.json({ data: filesName });
});
app.get('/api/link/:id', (req, res) => {
  console.log(req.params);
  const data = fs.readFileSync(`${__dirname}/temp/${req.params.id}.json`, {
    encoding: 'utf-8',
  });
  res.json({ data: JSON.parse(data) });
});
app.get('/api/share/list', (req, res) => {
  console.log(req.params);
  let list = [];
  fs.readdirSync(`${__dirname}/temp`).forEach((item) => {
    list.push({
      id: item.split('.')[0],
      data: JSON.parse(
        fs.readFileSync(`${__dirname}/temp/${item}`, {
          encoding: 'utf-8',
        })
      ),
    });
  });
  res.json({ data: list });
});
app.listen(3000, () => {});
