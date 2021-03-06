var should = require('should');

describe('cage', function ( ) {
  var cage = require('../lib/plugins/cannulaage')();
  var sandbox = require('../lib/sandbox')();

  it('set a pill to the current cannula age', function (done) {

    var app = {};
    var clientSettings = {};

    var data = {
      treatments: [{eventType: 'Site Change', created_at: (new Date(Date.now() - 24 * 60 * 60000)).toISOString()}]
    };

    var pluginBase = {
      updatePillText: function mockedUpdatePillText (plugin, updatedText, label, info) {
        updatedText.should.equal('24h');
        done();
      }
    };

    var sbx = sandbox.clientInit(app, clientSettings, Date.now(), pluginBase, data);
    cage.updateVisualisation(sbx);

  });


});
