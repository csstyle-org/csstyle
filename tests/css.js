const specificity = require('specificity');
const fs = require('fs');
const path = require('path');

class CSS {
  constructor(file) {
    this.contents = fs.readFileSync(path.resolve(file)).toString();
  }

  static from(file) {
    return new CSS(file);
  }

  /**
   * grab a selector from a file and calculate its specificity
   */
  getSelector(index = 0) {
    let value = this.contents.match(/.*\{/g)[index].split('{')[0].trim();
    let score = specificity.calculate(value)[0].specificity;
    let content = this.contents.match(/{[^}]+/g)[index].replace('{', '').trim();

    return {
      value,
      score,
      content,
    };
  };

  getSelectors() {
    return this.contents.match(/.*\{/g).map((value, index) => {
      value = value.split('{')[0].trim();

      let score = specificity.calculate(value)[0].specificity;
      let content = this.contents.match(/{[^}]+/g)[index].replace('{', '').trim();

      return {
        value,
        score,
        content,
      };
    });
  };
};

module.exports = CSS;
