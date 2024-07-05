//Radix List and Serializable radix list

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
    for (let char of item.value) {
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

  // I wanted to know how may IPs I was searching through
  countNodes() {
    return this._countNodesHelper(this.root);
  }

  _countNodesHelper(node) {
    let count = 1; // Count the current node
    for (let child in node.children) {
      count += this._countNodesHelper(node.children[child]);
    }
    return count;
  }

}
// --------------------------
// Making this list serializable because I want to see how much better caching might be
// these should extend the radix list/ node but I hit a wall trying to get that to work so I just moved on.
// // Example Usage
// const list = new SerializableRadixList();
// list.insert({ value: '198.162.1.1' });
// list.insert({ value: '198.162.1.2' });
// list.insert({ value: '198.162.1.3' });

// const serializedList = list.serialize();
// console.log(`Serialized List: ${serializedList}`);

// const deserializedList = SerializableRadixList.deserialize(serializedList);
// console.log(`Total nodes in deserialized list: ${deserializedList.countNodes()}`);

class SerializableRadixListNode {
  constructor(value = null) {
    this.children = {};
    this.isEndOfWord = false;
    this.value = value;
  }

  toJSON() {
    const children = {};
    for (let key in this.children) {
      children[key] = this.children[key].toJSON();
    }
    return {
      children,
      isEndOfWord: this.isEndOfWord,
      value: this.value
    };
  }

  static fromJSON(json) {
    const node = new SerializableRadixListNode(json.value);
    node.isEndOfWord = json.isEndOfWord;
    for (let key in json.children) {
      node.children[key] = SerializableRadixListNode.fromJSON(json.children[key]);
    }
    return node;
  }
}

class SerializableRadixList {
  constructor() {
    this.root = new SerializableRadixListNode();
  }

  insert(item) {
    let node = this.root;
    for (let char of item.value) {
      if (!node.children[char]) {
        node.children[char] = new SerializableRadixListNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  search(item) {
    let node = this._findNode(item);
    return node !== null && node.isEndOfWord;
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

  delete(item) {
    this._delete(this.root, item, 0);
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

  countNodes() {
    return this._countNodesHelper(this.root);
  }

  _countNodesHelper(node) {
    let count = 1; // Count the current node
    for (let child in node.children) {
      count += this._countNodesHelper(node.children[child]);
    }
    return count;
  }

  serialize() {
    return JSON.stringify(this.root.toJSON());
  }

  static deserialize(jsonString) {
    const radixList = new SerializableRadixList();
    const rootNodeJSON = JSON.parse(jsonString);
    radixList.root = SerializableRadixListNode.fromJSON(rootNodeJSON);
    return radixList;
  }
}


module.exports = { RadixList, RadixListNode, SerializableRadixList, SerializableRadixListNode };
