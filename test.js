'use strict';
var assert = require('assert');
var Md = require('markdown-it');
var implicitFigures = require('./');

describe('markdown-it-implicit-figures', function() {
  var md;
  beforeEach(function(){
    md = Md().use(implicitFigures);
  });

  it('should add <figure> when image is by itself in a paragraph', function () {
    var src = 'text with ![](img.png)\n\n![](fig.png)\n\nanother paragraph';
    var expected = '<p>text with <img src="img.png" alt=""></p>\n<figure><img src="fig.png" alt=""></figure>\n<p>another paragraph</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should add <figure> when image is by itself in a paragraph and preceded by a standalone link', function () {
    md = Md().use(implicitFigures, { dataType: true, figcaption: 'title' });
    var src = '[![](fig.png "Caption")](http://example.com)';
    var expected = '<figure data-type="image"><a href="http://example.com"><img src="fig.png" alt=""></a><figcaption>Caption</figcaption></figure>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should add data-type=image to figures when opts.dataType is set', function () {
    md = Md().use(implicitFigures, { dataType: true });
    var src = '![](fig.png)\n';
    var expected = '<figure data-type="image"><img src="fig.png" alt=""></figure>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should convert title text into a figcaption when opts.figcaption is set to "title"', function () {
    md = Md().use(implicitFigures, { figcaption: 'title' });
    var src = '![This is an alt](fig.png "This is a caption")';
    var expected = '<figure><img src="fig.png" alt="This is an alt"><figcaption>This is a caption</figcaption></figure>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should convert alt text into a figcaption when opts.figcaption is set', function () {
    md = Md().use(implicitFigures, { figcaption: true });
    var src = '![This is an alt](fig.png "This is a caption")';
    var expected = '<figure><img src="fig.png" alt="" title="This is a caption"><figcaption>This is an alt</figcaption></figure>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should convert alt text into a figcaption when opts.figcaption is set and keep it when keepAlt is set', function () {
    md = Md().use(implicitFigures, { figcaption: true, keepAlt: true });
    var src = '![This is an alt](fig.png "This is a caption")';
    var expected = '<figure><img src="fig.png" alt="This is an alt" title="This is a caption"><figcaption>This is an alt</figcaption></figure>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should convert title text for each image into a figcaption when opts.figcaption is set to "title"', function () {
    md = Md().use(implicitFigures, { figcaption: 'title' });
    var src = '![alt 1](fig.png "caption 1")\n\n![alt 2](fig2.png "caption 2")';
    var expected = '<figure><img src="fig.png" alt="alt 1"><figcaption>caption 1</figcaption></figure>\n<figure><img src="fig2.png" alt="alt 2"><figcaption>caption 2</figcaption></figure>\n'
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should convert alt text for each image into a figcaption when opts.figcaption is set', function () {
    md = Md().use(implicitFigures, { figcaption: true });
    var src = '![alt 1](fig.png "caption 1")\n\n![alt 2](fig2.png "caption 2")';
    var expected = '<figure><img src="fig.png" alt="" title="caption 1"><figcaption>alt 1</figcaption></figure>\n<figure><img src="fig2.png" alt="" title="caption 2"><figcaption>alt 2</figcaption></figure>\n'
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should convert alt text for each image into a figcaption when opts.figcaption is set and keepAlt is set', function () {
    md = Md().use(implicitFigures, { figcaption: true, keepAlt: true });
    var src = '![alt 1](fig.png "caption 1")\n\n![alt 2](fig2.png "caption 2")';
    var expected = '<figure><img src="fig.png" alt="alt 1" title="caption 1"><figcaption>alt 1</figcaption></figure>\n<figure><img src="fig2.png" alt="alt 2" title="caption 2"><figcaption>alt 2</figcaption></figure>\n'
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should add incremental tabindex to figures when opts.tabindex is set', function () {
    md = Md().use(implicitFigures, { tabindex: true });
    var src = '![](fig.png)\n\n![](fig2.png)';
    var expected = '<figure tabindex="1"><img src="fig.png" alt=""></figure>\n<figure tabindex="2"><img src="fig2.png" alt=""></figure>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should reset tabindex on each md.render()', function () {
    md = Md().use(implicitFigures, { tabindex: true });
    var src = '![](fig.png)\n\n![](fig2.png)';
    var expected = '<figure tabindex="1"><img src="fig.png" alt=""></figure>\n<figure tabindex="2"><img src="fig2.png" alt=""></figure>\n';
    var res = md.render(src);
    assert.equal(res, expected);
    // render again, should produce same if resetting
    res = md.render(src);
    assert.equal(res, expected);
  });

  it('should add loading lazy attribute to image when opts.lazyLoading is set', function () {
    md = Md().use(implicitFigures, { lazyLoading: true });
    var src = '![](fig.png)';
    var expected = '<figure><img src="fig.png" alt="" loading="lazy"></figure>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should not make figures of paragraphs with text and inline code', function () {
    var src = 'Text.\n\nAnd `code`.';
    var expected = '<p>Text.</p>\n<p>And <code>code</code>.</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should not make figures of paragraphs with links only', function () {
    var src = '[link](page.html)';
    var expected = '<p><a href="page.html">link</a></p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should linkify captions when figcaption is set to "title"', function () {
    md = Md({ linkify: true }).use(implicitFigures, { figcaption: 'title' });
    var src = '![](fig.png "www.google.com")';
    var expected = '<figure><img src="fig.png" alt=""><figcaption><a href="http://www.google.com">www.google.com</a></figcaption></figure>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });


  it('should linkify captions when figcaption is on', function () {
    md = Md({ linkify: true }).use(implicitFigures, { figcaption: true });
    var src = '![www.google.com](fig.png)';
    var expected = '<figure><img src="fig.png" alt=""><figcaption><a href="http://www.google.com">www.google.com</a></figcaption></figure>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should linkify captions when figcaption is on and keepAlt is set', function () {
    md = Md({ linkify: true }).use(implicitFigures, { figcaption: true, keepAlt: true });
    var src = '![www.google.com](fig.png)';
    var expected = '<figure><img src="fig.png" alt="www.google.com"><figcaption><a href="http://www.google.com">www.google.com</a></figcaption></figure>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should put the image inside a link to the image if it is not yet linked', function () {
    md = Md().use(implicitFigures, { link: true });
    var src = '![www.google.com](fig.png)';
    var expected = '<figure><a href="fig.png"><img src="fig.png" alt="www.google.com"></a></figure>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should not mess up figcaption when linking and figcaption is set to "title"', function () {
    md = Md().use(implicitFigures, { figcaption: 'title', link: true });
    var src = '![](fig.png "www.google.com")';
    var expected = '<figure><a href="fig.png"><img src="fig.png" alt=""></a><figcaption>www.google.com</figcaption></figure>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should not mess up figcaption when linking', function () {
    md = Md().use(implicitFigures, { figcaption: 'alt', link: true });
    var src = '![www.google.com](fig.png)';
    var expected = '<figure><a href="fig.png"><img src="fig.png" alt=""></a><figcaption>www.google.com</figcaption></figure>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });


  it('should not mess up figcaption when linking and keepAlt is set', function () {
    md = Md().use(implicitFigures, { figcaption: 'alt', link: true, keepAlt: true });
    var src = '![www.google.com](fig.png)';
    var expected = '<figure><a href="fig.png"><img src="fig.png" alt="www.google.com"></a><figcaption>www.google.com</figcaption></figure>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should leave the image inside a link (and not create an extra one) if it is already linked', function () {
    md = Md().use(implicitFigures, { link: true });
    var src = '[![www.google.com](fig.png)](link.html)';
    var expected = '<figure><a href="link.html"><img src="fig.png" alt="www.google.com"></a></figure>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should keep structured markup inside caption (even if not supported in "alt" attribute)', function () {
    md = Md().use(implicitFigures, { figcaption: 'title' });
    var src = '![](fig.png "Image from [source](to)")';
    var expected = '<figure><img src="fig.png" alt=""><figcaption>Image from <a href="to">source</a></figcaption></figure>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

});
