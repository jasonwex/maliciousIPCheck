class RadixListNode {
  constructor(value = null) {
    this.children = {};
    this.isEndOfWord = false;
    this.value = value;  // Store values for prefix compression
  }
}

class RadixList {
  constructor() {
    this.root = new RadixListNode();
  }

  insert(item) {
    let node = this.root;
    for (let char of item) {
      if (!node.children[char]) {
        node.children[char] = new RadixListNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  search(item) {
    let node = this._findNode(item);
    return node !== null && node.isEndOfWord;
  }

  delete(item) {
    this._delete(this.root, item, 0);
  }

  _findNode(item) {
    let node = this.root;
    for (let char of item) {
      if (!node.children[char]) {
        return null;
      }
      node = node.children[char];
    }
    return node;
  }

  _delete(node, item, index) {
    if (index === item.length) {
      if (!node.isEndOfWord) return false;
      node.isEndOfWord = false;
      return Object.keys(node.children).length === 0;
    }

    const char = item[index];
    if (!node.children[char]) return false;

    const shouldDeleteChild = this._delete(node.children[char], item, index + 1);

    if (shouldDeleteChild) {
      delete node.children[char];
      return Object.keys(node.children).length === 0;
    }

    return false;
  }
}

module.exports = RadixList;