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

class SerializableRadixListNode extends RadixListNode {
  constructor(value = null) {
    super(value);
  }

  // Convert the node to a plain object
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

  // Create a node from a plain object
  static fromJSON(json) {
    const node = new SerializableRadixListNode(json.value);
    node.isEndOfWord = json.isEndOfWord;
    for (let key in json.children) {
      node.children[key] = SerializableRadixListNode.fromJSON(json.children[key]);
    }
    return node;
  }
}
class SerializableRadixList extends RadixList {
  constructor() {
    super();
    this.root = new SerializableRadixListNode();
  }

  // Convert the Radix list to a JSON string
  serialize() {
    return JSON.stringify(this.root.toJSON());
  }

  // Create a Radix list from a JSON string
  static deserialize(jsonString) {
    const radixList = new SerializableRadixList();
    const rootNodeJSON = JSON.parse(jsonString);
    radixList.root = SerializableRadixListNode.fromJSON(rootNodeJSON);
    return radixList;
  }
}

// Example Usage
const list = new SerializableRadixList();
list.insert({ value: 'apple' });
list.insert({ value: 'app' });
list.insert({ value: 'banana' });

const serializedList = list.serialize();
console.log(`Serialized List: ${serializedList}`);

const deserializedList = SerializableRadixList.deserialize(serializedList);
console.log(`Total nodes in deserialized list: ${deserializedList.countNodes()}`);

module.exports = { RadixList, RadixListNode, SerializableRadixList, SerializableRadixListNode };