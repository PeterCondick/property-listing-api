require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {Property} = require('property-listing-models');
var {mongSetup} = require('property-listing-models');
const PropertyListingServices = require('property-listing-services');

var app = express();

console.log('in server mongSetup', mongSetup);
mongSetup.connectToDb();
console.log('connected ok');

app.use(bodyParser.json());

const port = 3000;

app.get('/properties', (req, res) => {

  let pageSizeStr = req.query.num;
  let startAtStr = req.query.first;

  let pageSize;
  let startAt;
  let paging = true;

  if (pageSizeStr && !isNaN(pageSizeStr)) {
    // convert to number
    pageSize = +pageSizeStr;
    //console.log('converted pageSize to ' + pageSize);
  } else {
    paging = false;
  }
  if (startAtStr && !isNaN(startAtStr)) {
    // convert to number
    startAt = +startAtStr;
    //console.log('converted startAt to ' + startAt);
  } else {
    paging = false;
  }
  // console.log(`pageSize ${pageSize} startAt ${startAt}`);
  // if (typeof pageSize === 'number') {
  //   console.log('pageSize is a number', pageSize);
  // } else {
  //   console.log('its not a number', pageSize);
  // }

  console.log(`paging ${paging}`);

  if (paging) {
    Property
          .find()
          .limit(pageSize)
          .skip(startAt)
          .sort({
            _id: 'asc'
          })
          .then((properties) => {
      res.send({
        properties
      });
    }, (e) => {
      res.status(400).send(e);
    });
  } else {
    Property.find().then((properties) => {
      res.send({
        properties
      });
    }, (e) => {
      res.status(400).send(e);
    });
  }
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

  //console.log(PropertyListingServices);
  console.log('in server post zoopla route');

  PropertyListingServices.importZooplaData().then((result) => {

    res.send({
      data: `updated everything from zoopla ok deleted ${result.numDeleted} and saved ${result.numSaved}`
    });
  }).catch((e) => {
    console.log('in catch ', e);
  });

});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
