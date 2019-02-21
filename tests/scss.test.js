const path = require('path');
const fibers = require('fibers');
const expect = require('expect.js');
const CSS = require('./css.js');
const { fs, sass, mkdirp } = require('./promisify.js');

const importer = url => {
  if (url[0] === '~') {
    url = path.resolve('node_modules', url.substr(1));
  }

  return { file: url };
};

async function compileFixture(test) {
  test = test.toLowerCase().replace(/\s+/g, '-');

  let error;
  let dir = mkdirp('tests/fixtures');
  let fixture = `tests/fixtures/${test}.css`;

  let result = await sass.render({
    file: `tests/scss/fixtures/${test}.scss`,
    fiber: fibers,
    importer,
  });

  await dir;

  await fs.writeFile(fixture, result.css);

  return fixture;
}

describe('Component', function() {
  let selectors;

  before(async function () {
    let fixture = await compileFixture(this.currentTest.parent.title);

    selectors = CSS.from(fixture).getSelectors();
  });

  it('creates a class', function() {
    expect(selectors[0].value).to.be.ok();
    expect(selectors[0].value).to.be('.c1');
    expect(selectors[0].score).to.be('0,0,1,0');
  });

  it('creates multiple classes', function() {
    expect(selectors[1].value).to.be.ok();
    expect(selectors[1].value).to.be('.c1, .c2');
    expect(selectors[1].score).to.be('0,0,1,0');
  });
});

describe('Option', function() {
  let selectors;

  before(async function () {
    let fixture = await compileFixture(this.currentTest.parent.title);

    selectors = CSS.from(fixture).getSelectors();
  });

  it('appends an option class to a component', function() {
    expect(selectors[0].value).to.be.ok();
    expect(selectors[0].value).to.be('html .c1.\\--o1');
    expect(selectors[0].score).to.be('0,0,2,1');
  });

  it('appends multiple option classes to a component', function() {
    expect(selectors[1].value).to.be.ok();
    expect(selectors[1].value).to.be('html .c1.\\--o1, html .c1.\\--o2');
    expect(selectors[1].score).to.be('0,0,2,1');
  });

  it('appends an option class to multiple components', function() {
    expect(selectors[2].value).to.be.ok();
    expect(selectors[2].value).to.be('html .c1.\\--o1, html .c2.\\--o1');
    expect(selectors[2].score).to.be('0,0,2,1');
  });

  it('appends multiple option classes to multiple components', function() {
    expect(selectors[3].value).to.be.ok();
    expect(selectors[3].value).to.be('html .c1.\\--o1, html .c1.\\--o2, html .c2.\\--o1, html .c2.\\--o2');
    expect(selectors[3].score).to.be('0,0,2,1');
  });

  it('appends an option class to a tweak', function() {
    expect(selectors[4].value).to.be.ok();
    expect(selectors[4].value).to.be('html#app .\\+t1.\\--o1');
    expect(selectors[4].score).to.be('0,1,2,1');
  });

  it('appends an option class to a location', function() {
    expect(selectors[5].value).to.be.ok();
    expect(selectors[5].value).to.be('html .\\@l1.\\--o1');
    expect(selectors[5].score).to.be('0,0,2,1');
  });
});

describe('Part', function() {
  let selectors;

  before(async function () {
    let fixture = await compileFixture(this.currentTest.parent.title);

    selectors = CSS.from(fixture).getSelectors();
  });

  it('appends a part to the component', function() {
    expect(selectors[0].value).to.be.ok();
    expect(selectors[0].value).to.be('.c1\\.p1');
    expect(selectors[0].score).to.be('0,0,1,0');
  });

  it('appends multiple parts to the component', function() {
    expect(selectors[1].value).to.be.ok();
    expect(selectors[1].value).to.be('.c1\\.p1, .c1\\.p2');
    expect(selectors[1].score).to.be('0,0,1,0');
  });

  it('appends a part to multiple components', function() {
    expect(selectors[2].value).to.be.ok();
    expect(selectors[2].value).to.be('.c1\\.p1, .c2\\.p1');
    expect(selectors[2].score).to.be('0,0,1,0');
  });

  it('appends multiple parts to multiple components', function() {
    expect(selectors[3].value).to.be.ok();
    expect(selectors[3].value).to.be('.c1\\.p1, .c1\\.p2, .c2\\.p1, .c2\\.p2');
    expect(selectors[3].score).to.be('0,0,1,0');
  });

  it('appends a part to the tweak', function() {
    expect(selectors[4].value).to.be.ok();
    expect(selectors[4].value).to.be('#app .\\+t1\\.p1');
    expect(selectors[4].score).to.be('0,1,1,0');
  });
});

describe('Tweak', function() {
  let selectors;

  before(async function () {
    let fixture = await compileFixture(this.currentTest.parent.title);

    selectors = CSS.from(fixture).getSelectors();
  });

  it('creates a tweak class nested inside the root id', function() {
    expect(selectors[0].value).to.be.ok();
    expect(selectors[0].value).to.be('#app .\\+t1');
    expect(selectors[0].score).to.be('0,1,1,0');
  });

  it('creates multiple tweak classes nested inside the root id', function() {
    expect(selectors[1].value).to.be.ok();
    expect(selectors[1].value).to.be('#app .\\+t1, #app .\\+t2');
    expect(selectors[1].score).to.be('0,1,1,0');
  });

  it('can contain complex components', function() {
    expect(selectors[2].value).to.be.ok();
    expect(selectors[2].value).to.be('html#app .\\+t1 .c1\\.p1.\\--o1, html#app .\\+t1 .c2\\.p1.\\--o1');
    expect(selectors[2].score).to.be('0,1,3,1');
  });
});

describe('Location', function() {
  let selectors;

  before(async function () {
    let fixture = await compileFixture(this.currentTest.parent.title);

    selectors = CSS.from(fixture).getSelectors();
  });

  it('creates a location class nested inside the root id', function() {
    expect(selectors[0].value).to.be.ok();
    expect(selectors[0].value).to.be('.\\@l1');
    expect(selectors[0].score).to.be('0,0,1,0');
  });

  it('creates multiple location classes nested inside the root id', function() {
    expect(selectors[1].value).to.be.ok();
    expect(selectors[1].value).to.be('.\\@l1, .\\@l2');
    expect(selectors[1].score).to.be('0,0,1,0');
  });

  it('can contain complex components', function() {
    expect(selectors[2].value).to.be.ok();
    expect(selectors[2].value).to.be('html .\\@l1 .c1\\.p1.\\--o1, html .\\@l1 .c2\\.p1.\\--o1');
    expect(selectors[2].score).to.be('0,0,3,1');
  });
});

describe('Nesting', function() {
  let selectors;

  before(async function () {
    let fixture = await compileFixture(this.test.parent.title);

    selectors = CSS.from(fixture).getSelectors();
  });

  describe('Part > Part', function() {
    it('creates a single class with both part names', function() {
      expect(selectors[0].value).to.be.ok();
      expect(selectors[0].value).to.be('.c1\\.p1\\.ps1');
      expect(selectors[0].score).to.be('0,0,1,0');
    });

    describe('Part > Part > Option', function() {
      it('appends the option class to the part', function() {
        expect(selectors[1].value).to.be.ok();
        expect(selectors[1].value).to.be('html .c1\\.p1\\.ps1.\\--o1');
        expect(selectors[1].score).to.be('0,0,2,1');
      });
    });
  });

  describe('Option > Part', function() {
    it('appends the option class to the component, and appends full part class', function() {
      expect(selectors[2].value).to.be.ok();
      expect(selectors[2].value).to.be('html .c1.\\--o1 .c1\\.p1');
      expect(selectors[2].score).to.be('0,0,3,1');
    });

    describe('Part > Option > Part', function() {
      it('appends the option class to the upper part, and appends the full part class', function() {
        expect(selectors[3].value).to.be.ok();
        expect(selectors[3].value).to.be('html .c1\\.p1.\\--o1 .c1\\.p1\\.ps1');
        expect(selectors[3].score).to.be('0,0,3,1');
      });
    });
  });

  describe('Component > Component', function() {
    it('nests another component inside a component', function() {
      expect(selectors[4].value).to.be.ok();
      expect(selectors[4].value).to.be('.c1 .c2, .c1 .c3');
      expect(selectors[4].score).to.be('0,0,2,0');
    });

    describe('Component > Part > Component', function() {
      it('nests another component inside a part', function() {
        expect(selectors[5].value).to.be.ok();
        expect(selectors[5].value).to.be('.c1\\.p1 .c2');
        expect(selectors[5].score).to.be('0,0,2,0');
      });
    });
  });

  describe('Tweak > Component', function() {
    it('nests the tweak inside a component', function() {
      expect(selectors[6].value).to.be.ok();
      expect(selectors[6].value).to.be('#app .c1 .\\+t1');
      expect(selectors[6].score).to.be('0,1,2,0');
    });
  });

  describe('Location > Component', function() {
    it('nests the component inside the location', function() {
      expect(selectors[7].value).to.be.ok();
      expect(selectors[7].value).to.be('.\\@l1 .c1');
      expect(selectors[7].score).to.be('0,0,2,0');
    });
  });

  describe('Option + Option', function() {
    it('nests the option inside the sibling option', function() {
      expect(selectors[8].value).to.be.ok();
      expect(selectors[8].value).to.be('html .c1.\\--o1 + .c1.\\--o1');
      expect(selectors[8].score).to.be('0,0,4,1');
    });
  });
});

describe('Nesting non-csstyle selectors', function() {
  let selectors;

  before(async function () {
    let fixture = await compileFixture(this.currentTest.parent.title);

    selectors = CSS.from(fixture).getSelectors();
  });

  it('allows the parent to be referenced in a component', function() {
    expect(selectors[0].value).to.be.ok();
    expect(selectors[0].value).to.be('.c1:hover');
    expect(selectors[0].score).to.be('0,0,2,0');
  });

  it('appends an option class to a component', function() {
    expect(selectors[1].value).to.be.ok();
    expect(selectors[1].value).to.be('.c1.\\--o1.class');
    expect(selectors[1].score).to.be('0,0,3,0');

    expect(selectors[2].value).to.be.ok();
    expect(selectors[2].value).to.be('.c1.\\--o1 .class');
    expect(selectors[2].score).to.be('0,0,3,0');
  });

  it('appends an option class to a part', function() {
    expect(selectors[3].value).to.be.ok();
    expect(selectors[3].value).to.be('.c1\\.p1.\\--o1.class');
    expect(selectors[3].score).to.be('0,0,3,0');
  });
});

describe('Customize Symbols', function() {
  let selectors;

  before(async function () {
    let fixture = await compileFixture(this.currentTest.parent.title);

    selectors = CSS.from(fixture).getSelectors();
  });

  it('allows a custom component symbol', function() {
    expect(selectors[0].value).to.be.ok();
    expect(selectors[0].value).to.be('.c-c1');
    expect(selectors[0].score).to.be('0,0,1,0');
  });

  it('allows a custom part symbol', function() {
    expect(selectors[1].value).to.be.ok();
    expect(selectors[1].value).to.be('.c-c1\\/p1');
    expect(selectors[1].score).to.be('0,0,1,0');
  });

  it('allows a custom option symbol', function() {
    expect(selectors[2].value).to.be.ok();
    expect(selectors[2].value).to.be('html .c-c1.\\~o1');
    expect(selectors[2].score).to.be('0,0,2,1');
  });

  it('allows a custom tweak symbol', function() {
    expect(selectors[3].value).to.be.ok();
    expect(selectors[3].value).to.contain('.\\!t1');
    expect(selectors[3].score).to.be('0,1,1,0');
  });

  it('allows a custom location symbol', function() {
    expect(selectors[4].value).to.be.ok();
    expect(selectors[4].value).to.be('.\\?l1');
    expect(selectors[4].score).to.be('0,0,1,0');
  });

  it('allows a custom root id', function() {
    expect(selectors[5].value).to.be.ok();
    expect(selectors[5].value).to.contain('#csstyle');
  });

  it('allows customizing symbols during runtime', function() {
    expect(selectors[6].value).to.be.ok();
    expect(selectors[6].value).to.be('.c-c1\\|p1');
    expect(selectors[6].score).to.be('0,0,1,0');
  });

  it('allows resetting to original symbols', function() {
    expect(selectors[7].value).to.be.ok();
    expect(selectors[7].value).to.be('.c-c1\\/p1');
    expect(selectors[7].score).to.be('0,0,1,0');
  });

  it('allows resetting to default symbols', function() {
    expect(selectors[8].value).to.be.ok();
    expect(selectors[8].value).to.be('.c1');
    expect(selectors[8].score).to.be('0,0,1,0');
  });
});

describe('Policy', function() {
  let selectors;

  before(async function () {
    let fixture = await compileFixture(this.currentTest.parent.title);

    selectors = CSS.from(fixture).getSelectors();
  });

  it('applies a policy to a component', function() {
    expect(selectors[0].content).to.be.ok();
    expect(selectors[0].content).to.be('left: 1;');

    expect(selectors[1].content).to.be.ok();
    expect(selectors[1].content).to.be('top: 0;');
  });

  it('applies a policy to multiple selectors', function() {
    expect(selectors[2].value).to.be.ok();
    expect(selectors[2].value).to.be('.c3\\.p1, .c3, .c2');
    expect(selectors[2].content).to.be.ok();
    expect(selectors[2].content).to.be('left: 1;');

    expect(selectors[3].value).to.be.ok();
    expect(selectors[3].value).to.be('.c2');
    expect(selectors[3].content).to.be.ok();
    expect(selectors[3].content).to.be('top: 0;');

    expect(selectors[4].value).to.be.ok();
    expect(selectors[4].value).to.be('.c3');
    expect(selectors[4].content).to.be.ok();
    expect(selectors[4].content).to.be('top: 0;');

    expect(selectors[5].value).to.be.ok();
    expect(selectors[5].value).to.be('.c3\\.p1');
    expect(selectors[5].content).to.be.ok();
    expect(selectors[5].content).to.be('top: 0;');
  });
});
