var assert = require('assert');
var Stream = require('stream');
var BufferedStream = require('../buffered-stream');

describe('A BufferedStream', function () {
  var stream = new BufferedStream;

  it('is an instance of Stream', function () {
    assert.ok(stream instanceof Stream);
  });

  it('is empty', function () {
    assert.ok(stream.empty);
  });

  it('is not full', function () {
    assert.ok(!stream.full);
  });

  it('is readable', function () {
    assert.ok(stream.readable);
  });

  it('is writable', function () {
    assert.ok(stream.writable);
  });

  it('is not ended', function () {
    assert.ok(!stream.ended);
  });

  it('does not have an encoding', function () {
    assert.ok(!stream.encoding);
  });

  describe('with a maxSize of 0', function () {
    var stream = new BufferedStream(0);

    it('is not full', function () {
      assert.ok(!stream.full);
    });
  });

  describe('after end() has been called', function () {
    var stream = new BufferedStream;
    stream.end();

    it('is ended', function () {
      assert.ok(stream.ended);
    });

    it('throws an error when written to', function () {
      assert.throws(function () {
        stream.write('hello');
      }, /not writable/);
    });

    it('throws an error when ended again', function () {
      assert.throws(function () {
        stream.end();
      }, /already ended/);
    });
  });

  describe('with string contents and no encoding', function () {
    it('emits buffers', function (callback) {
      var stream = new BufferedStream('hello');

      stream.on('data', function (chunk) {
        assert.ok(chunk instanceof Buffer);
        callback(null);
      });
    });
  });

  describe('with string contents and an encoding', function () {
    var chunk;
    beforeEach(function (callback) {
      var stream = new BufferedStream('hello');
      stream.setEncoding('base64');

      stream.on('data', function (c) {
        chunk = c;
        callback(null);
      });
    });

    it('emits strings', function () {
      assert.equal(typeof chunk, 'string');
    });

    it('uses the proper encoding', function () {
      assert.equal(chunk, new Buffer('hello').toString('base64'));
    });
  });

  describe('when write() is called with a string in base64 encoding', function () {
    it('uses the proper encoding', function (callback) {
      var content = 'hello';
      var stream = new BufferedStream;
      stream.write(new Buffer(content).toString('base64'), 'base64');
      stream.end();

      var buffer = '';

      stream.on('data', function (chunk) {
        buffer += chunk.toString();
      });

      stream.on('end', function () {
        assert.equal(buffer, content);
        callback(null);
      });
    });
  });

  describe('when sourced from a string', function () {
    testSourceType('Hello world', String);
  });

  describe('when sourced from a Buffer', function () {
    testSourceType('Hello world', Buffer);
  });

  describe('when sourced from a Stream', function () {
    testSourceType('Hello world', BufferedStream);
  });
});

function bufferSource(source, callback) {
  var stream = new BufferedStream(source);
  var buffer = '';

  stream.on('data', function (chunk) {
    buffer += chunk.toString();
  });

  stream.on('end', function () {
    callback(null, buffer);
  });

  if (typeof source.resume === 'function') {
    source.resume();
  }

  return stream;
}

function temporarilyPauseThenBufferSource(source, callback) {
  var stream = bufferSource(source, callback);
  stream.pause();

  setTimeout(function () {
    stream.resume();
  }, 1);
}

function testSourceType(content, sourceType) {
  var source;
  beforeEach(function () {
    source = new sourceType(content);

    if (typeof source.pause === 'function') {
      source.pause();
    }
  });

  it("emits that string's content", function (callback) {
    bufferSource(source, function (err, buffer) {
      if (err) {
        callback(err);
      } else {
        assert.equal(buffer, content);
        callback(null);
      }
    });
  });

  describe('and temporarily paused', function () {
    it("emits that string's content", function (callback) {
      temporarilyPauseThenBufferSource(source, function (err, buffer) {
        if (err) {
          callback(err);
        } else {
          assert.equal(buffer, content);
          callback(null);
        }
      });
    });
  });
}
