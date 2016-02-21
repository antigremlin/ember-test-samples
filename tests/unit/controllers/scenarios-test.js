import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import DS from 'ember-data';

moduleFor('controller:scenarios', 'Unit | Controller | scenarios', {
  // Specify the other units that are required for this test.
  needs: ['model:foo']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});

test('record store', function(assert) {
  let adapter = DS.Adapter.extend({
    createRecord(store, type, snapshot) {
      let response = snapshot.record.toJSON();
      response.id = 1;
      return new Ember.RSVP.Promise((resolve) => {
        Ember.run(null, resolve, response);
      });
    }
  });
  this.register('adapter:application', adapter);
  this.inject.service('store');

  let record = {};
  Ember.run(() => {
    record = this.store.createRecord('foo');
    record.save();
  });
  assert.equal(record.get('isLoaded'), true, 'record loaded');
  assert.equal(record.get('id'), true, 'id');
});

test('record store error', function(assert) {
  let adapter = DS.Adapter.extend({
    createRecord() {
      let response = new DS.InvalidError([{message: "Error"}]);
      return new Ember.RSVP.Promise((resolve, reject) => {
        Ember.run(null, reject, response);
      });
    }
  });
  this.register('adapter:application', adapter);
  this.inject.service('store');

  let record = {}, error = {};
  Ember.run(() => {
    record = this.store.createRecord('foo');
    record.save().catch((e) => {
      error = e;
    });
  });

  assert.equal(record.get('isLoaded'), true);
});
