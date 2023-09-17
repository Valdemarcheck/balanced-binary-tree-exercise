class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(sortedArray) {
    this.root = this.#buildTree(sortedArray);
  }

  #buildTree() {}
}
