const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var app = express();

app.use(bodyParser.json());

const port = 3000;

app.get('/properties', (req, res) => {

  res.send([{
    data: 'some dummy data'
  },
  {
    data: 'more dummy data'
  }]);
});

app.get('/properties/:id', (req, res) => {
  res.send({
    id: req.params.id,
    data: 'some dummy data'
  });
});

app.post('/properties', (req, res) => {
  console.log(req.body);

  res.send({
    id: 1,
    data: 'saved ok'
  });

});

app.put('/properties/:id', (req, res) => {
  console.log(req.body);

  var body = _.pick(req.body, ['data']);

  console.log(body);

  res.send({
    id: 1,
    data: 'updated ok'
  });

});

app.delete('/properties/:id', (req, res) => {
  // get the id
  var id = req.params.id;

  // validate id is valid
  // if (!ObjectID.isValid(id)) {
  //   // 404 - empty
  //   return res.status(404).send();
  // }
  res.send({
    id,
    data: 'deleted ok'
  });

});

app.post('/properties/zoopla/import', (req, res) => {

  res.send({
    data: 'updated everything from zoopla ok'
  });

});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
