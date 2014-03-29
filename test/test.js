
var co = require('co');
var resolve = require('component-resolver');
var join = require('path').join;

var manifest = require('..');

function fixture(name) {
  return join(__dirname, 'fixtures', name);
}

describe('Component Manifest', function () {
  describe('blah', function () {
    var tree;
    var branches;
    var manifests;

    it('should resolve', co(function* () {
      tree = yield* resolve(fixture('blah'), {});
      branches = resolve.flatten(tree);
    }))

    it('should build the manifest', co(function* () {
      var fn = manifest({
        fields: ['styles', 'scripts']
      });

      manifests = yield branches.map(fn);
    }))

    it('should only have the fields specified in the correct order', function () {
      var fields = manifests[0].field;
      fields.scripts.should.have.length(1);
      fields.styles.should.have.length(1);
      var files = manifests[0].files;
      files.length.should.equal(2);
      files[0].path.should.equal('index.css');
      files[1].path.should.equal('index.js');
    })

    it('should have file.read()', function (done) {
      var css = manifests[0].files[0];
      css.read(function (err, string) {
        if (err) return done(err);
        css.string.should.equal(string);
        string.should.equal('body {\n  sexy: yes;\n}');
        done();
      })
    })
  })
})
