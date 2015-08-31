# kareem

Next-generation take on the [hooks](http://npmjs.org/package/hooks), meant to offer additional flexibility in allowing you to execute hooks whenever necessary, as opposed to simply wrapping a single function.

Named for the NBA's all-time leading scorer Kareem Abdul-Jabbar, known for his mastery of the [hook shot](http://en.wikipedia.org/wiki/Kareem_Abdul-Jabbar#Skyhook)

<img src="http://upload.wikimedia.org/wikipedia/commons/0/00/Kareem-Abdul-Jabbar_Lipofsky.jpg" width="220">

## pre hooks

#### It runs without any hooks specified

```javascript
    
    hooks.execPre('cook', null, function() {
      done();
    });
  
```

#### It runs basic serial pre hooks

```javascript
    
    var count = 0;

    hooks.pre('cook', function(done) {
      ++count;
      done();
    });

    hooks.execPre('cook', null, function() {
      assert.equal(1, count);
      done();
    });
  
```

#### It can run multipe pres

```javascript
    
    var count1 = 0;
    var count2 = 0;

    hooks.pre('cook', function(done) {
      ++count1;
      done();
    });

    hooks.pre('cook', function(done) {
      ++count2;
      done();
    });

    hooks.execPre('cook', null, function() {
      assert.equal(1, count1);
      assert.equal(1, count2);
      done();
    });
  
```

#### It can run fully synchronous pres

```javascript
    
    var count1 = 0;
    var count2 = 0;

    hooks.pre('cook', function() {
      ++count1;
    });

    hooks.pre('cook', function() {
      ++count2;
    });

    hooks.execPre('cook', null, function() {
      assert.equal(1, count1);
      assert.equal(1, count2);
      done();
    });
  
```

#### It properly attaches context to pre hooks

```javascript
    
    hooks.pre('cook', function(done) {
      this.bacon = 3;
      done();
    });

    hooks.pre('cook', function(done) {
      this.eggs = 4;
      done();
    });

    var obj = { bacon: 0, eggs: 0 };

    hooks.execPre('cook', obj, function() {
      assert.equal(3, obj.bacon);
      assert.equal(4, obj.eggs);
      done();
    });
  
```

#### It can execute parallel (async) pre hooks

```javascript
    
    hooks.pre('cook', true, function(next, done) {
      this.bacon = 3;
      next();
      setTimeout(function() {
        done();
      }, 5);
    });

    hooks.pre('cook', true, function(next, done) {
      next();
      var _this = this;
      setTimeout(function() {
        _this.eggs = 4;
        done();
      }, 10);
    });

    hooks.pre('cook', function(next) {
      this.waffles = false;
      next();
    });

    var obj = { bacon: 0, eggs: 0 };

    hooks.execPre('cook', obj, function() {
      assert.equal(3, obj.bacon);
      assert.equal(4, obj.eggs);
      assert.equal(false, obj.waffles);
      done();
    });
  
```

## post hooks

#### It runs without any hooks specified

```javascript
    
    hooks.execPost('cook', null, [1], function(error, eggs) {
      assert.ifError(error);
      assert.equal(1, eggs);
      done();
    });
  
```

#### It executes with parameters passed in

```javascript
    
    hooks.post('cook', function(eggs, bacon, callback) {
      assert.equal(1, eggs);
      assert.equal(2, bacon);
      callback();
    });

    hooks.execPost('cook', null, [1, 2], function(error, eggs, bacon) {
      assert.ifError(error);
      assert.equal(1, eggs);
      assert.equal(2, bacon);
      done();
    });
  
```

## wrap()

#### It wraps pre and post calls into one call

```javascript
    
    hooks.pre('cook', true, function(next, done) {
      this.bacon = 3;
      next();
      setTimeout(function() {
        done();
      }, 5);
    });

    hooks.pre('cook', true, function(next, done) {
      next();
      var _this = this;
      setTimeout(function() {
        _this.eggs = 4;
        done();
      }, 10);
    });

    hooks.pre('cook', function(next) {
      this.waffles = false;
      next();
    });

    hooks.post('cook', function(obj) {
      obj.tofu = 'no';
    });

    var obj = { bacon: 0, eggs: 0 };

    var args = [obj];
    args.push(function(error, result) {
      assert.ifError(error);
      assert.equal(3, obj.bacon);
      assert.equal(4, obj.eggs);
      assert.equal(false, obj.waffles);
      assert.equal('no', obj.tofu);

      assert.equal(obj, result);
      done();
    });

    hooks.wrap(
      'cook',
      function(o, callback) {
        assert.equal(3, obj.bacon);
        assert.equal(4, obj.eggs);
        assert.equal(false, obj.waffles);
        assert.equal(undefined, obj.tofu);
        callback(null, o);
      },
      obj,
      args);
  
```

