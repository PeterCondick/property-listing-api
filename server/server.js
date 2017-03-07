require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {Property} = require('property-listing-models');
const PropertyListingServices = require('property-listing-services');

var app = express();

app.use(bodyParser.json());

const port = 3000;

app.get('/properties', (req, res) => {

  Property.find().then((properties) => {
    res.send({
      properties
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/properties/:id', (req, res) => {
  var id = req.params.id;

  // validate id is valid
  if (!ObjectID.isValid(id)) {
    // 404 - empty
    return res.status(400).send();
  }

  Property.findById(id).then((property) => {
    if (property) {
      return res.send({property});
    }
    return res.status(404).send();

  }).catch((e) => {
    res.status(400).send();
  });

});

app.post('/properties', (req, res) => {
  //console.log(req.body);

  var body = _.pick(req.body, ['listing_id',
                              'property_report_url',
                              'description',
                              'first_published_date',
                              'num_floors',
                              'num_bedrooms',
                              'num_bathrooms',
                              'listing_status',
                              'status',
                              'property_type',
                              'price',
                              'latitude',
                              'longitude',
                              'displayable_address',
                              'outcode',
                              'country',
                              'image_url',
                              'thumbnail_url']);

  var property = new Property({
    listing_id: body.listing_id,
    property_report_url: body.property_report_url,
    description: body.description,
    first_published_date: body.first_published_date,
    num_floors: body.num_floors,
    num_bedrooms: body.num_bedrooms,
    num_bathrooms: body.num_bathrooms,
    listing_status: body.listing_status,
    status: body.status,
    property_type: body.property_type,
    price: body.price,
    latitude: body.latitude,
    longitude: body.longitude,
    displayable_address: body.displayable_address,
    outcode: body.outcode,
    country: body.country,
    image_url: body.image_url,
    thumbnail_url: body.thumbnail_url
  });

  property.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });

});

app.put('/properties/:id', (req, res) => {
  //console.log(req.body);
  var id = req.params.id;

  // validate id is valid
  if (!ObjectID.isValid(id)) {
    // 400 - empty
    return res.status(400).send();
  }

  var body = _.pick(req.body, ['property_report_url',
                              'description',
                              'first_published_date',
                              'num_floors',
                              'num_bedrooms',
                              'num_bathrooms',
                              'listing_status',
                              'status',
                              'property_type',
                              'price',
                              'latitude',
                              'longitude',
                              'displayable_address',
                              'outcode',
                              'country',
                              'image_url',
                              'thumbnail_url']);

  Property.findByIdAndUpdate(id, {$set: body}, {new: true}).then((property) => {
    if (!property) {
      return res.status(404).send();
    }
    res.send({property});

  }).catch((e) => {
    res.status(500).send();
  });

});

app.delete('/properties/:id', (req, res) => {
  // get the id
  var id = req.params.id;

  // validate id is valid
  if (!ObjectID.isValid(id)) {
    // 404 - empty
    return res.status(400).send();
  }

  Property.findByIdAndRemove(id).then((property) => {
    if (property) {
      return res.send({property});
    }
    return res.status(404).send();

  }).catch((e) => {
    res.status(500).send();
  });

});

app.post('/properties/zoopla/import', (req, res) => {

  console.log(PropertyListingServices);

  PropertyListingServices.importZooplaData().then(() => {
    res.send({
      data: 'updated everything from zoopla ok using promises'
    });
  }).catch((e) => {
    console.log('in catch ', e);
  });

});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
