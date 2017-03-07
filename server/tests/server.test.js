const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Property} = require('property-listing-models');

const properties = [{
  _id: new ObjectID(),
  listing_id: '123',
  description: 'first'
}, {
  _id: new ObjectID(),
  listing_id: '456',
  description: 'second'
}];

beforeEach((done) => {
  Property.remove({}).then(() => {
    return Property.insertMany(properties);
  }).then(() => done());

});

describe('GET /properties', () => {
  it('should return all properties', (done) => {

    request(app)
      .get('/properties')
      .expect(200)
      .expect((res) => {
        expect(res.body.properties.length).toBe(2);
        expect(res.body.properties[0].description).toBe('first');
      })
      .end(done);

  });
});

describe('GET /properties/id', () => {
  it('should return a property', (done) => {

    var id = properties[0]._id.toHexString();

    request(app)
      .get(`/properties/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.property._id).toEqual(id);
        expect(res.body.property.description).toEqual('first');
      })
      .end(done);

  });

  it('should return a 400 if id is invalid format', (done) => {

    var id = 123;

    request(app)
      .get(`/properties/${id}`)
      .expect(400)
      .end(done);

  });

  it('should return a 404 if id is not found', (done) => {

    var id = '58bdf86abbd45802cb111fb1';

    request(app)
      .get(`/properties/${id}`)
      .expect(404)
      .end(done);

  });

});

describe('POST /properties', () => {
  it('should save a property', (done) => {

    var descText = 'third';

    var data = {
      description: descText,
      num_floors: '2'
    };

    request(app)
      .post('/properties')
      .send(data)
      .expect(200)
      .expect((res) => {
        expect(res.body.description).toBe(descText);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Property.find().then((properties) => {
          expect(properties.length).toBe(3);
          expect(properties[2].description).toBe(descText);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('PUT /properties', () => {
  it('should update a property', (done) => {

    var property = {
      description: 'some dataz',
      listing_id: '789',
      outcode: 'LS6',
      foo: 'bar'
    };
    var id = properties[0]._id.toHexString();

    request(app)
      .put(`/properties/${id}`)
      .send(property)
      .expect(200)
      .expect((res) => {
        expect(res.body.property.description).toBe('some dataz');
        // not updatable via this endpoint
        expect(res.body.property.listing_id).toBe('123');
        expect(res.body.property.outcode).toBe('LS6');
        expect(res.body.property.foo).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('should return a 400 if id is invalid format', (done) => {

    var id = 123;

    request(app)
      .put(`/properties/${id}`)
      .expect(400)
      .end(done);

  });

  it('should return a 404 if id is not found', (done) => {

    var id = '58bdf86abbd45802cb111fb1';

    request(app)
      .put(`/properties/${id}`)
      .expect(404)
      .end(done);

  });

});

describe('DELETE /properties/:id', () => {
  it('should remove a property', (done) => {
    //var hexId = todos[1]._id.toHexString();
    var hexId = properties[1]._id.toHexString();;

    request(app)
      .delete(`/properties/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.property._id).toEqual(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Property.find().then((properties) => {
          expect(properties.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return a 400 if id is invalid format', (done) => {

    var id = 123;

    request(app)
      .delete(`/properties/${id}`)
      .expect(400)
      .end(done);

  });

  it('should return a 404 if id is not found', (done) => {

    var id = '58bdf86abbd45802cb111fb1';

    request(app)
      .delete(`/properties/${id}`)
      .expect(404)
      .end(done);

  });

});

describe('POST /properties/zoopla/import', () => {
  it('should update properties with zoopla data', (done) => {

    request(app)
      .post('/properties/zoopla/import')
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBe('updated everything from zoopla ok');
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
});
