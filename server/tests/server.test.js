const expect = require('expect');
const request = require('supertest');

const {app}= require('./../server');

describe('GET /properties', () => {
  it('should return all properties', (done) => {

    request(app)
      .get('/properties')
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(2);
      })
      .end(done);

  });
});

describe('GET /properties/id', () => {
  it('should return a property', (done) => {

    var id = 456;

    request(app)
      .get(`/properties/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(id);
      })
      .end(done);

  });
});

describe('POST /properties', () => {
  it('should save a property', (done) => {

    var data = 'qwe';

    request(app)
      .post('/properties')
      .send({data})
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBe('saved ok');
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
});

describe('PUT /properties', () => {
  it('should update a property', (done) => {

    var data = 'qwe';
    var id = 123;

    request(app)
      .put(`/properties/${id}`)
      .send({data})
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBe('updated ok');
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
});

describe('DELETE /properties/:id', () => {
  it('should remove a property', (done) => {
    //var hexId = todos[1]._id.toHexString();
    var hexId = 555;

    request(app)
      .delete(`/properties/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
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
