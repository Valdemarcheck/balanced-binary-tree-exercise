const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

function removeDuplicates(array) {
  return [...new Set(array)];
}

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    const preparedArray = removeDuplicates(array).sort((a, b) => a - b);
    this.root = this.#buildTree(preparedArray);
  }

  #buildTree(array) {
    if (array.length === 0) return null;
    if (array.length === 1) return new Node(array[0]);

    const mid = Math.floor(array.length / 2);
    const root = new Node(array[mid]);

    root.left = this.#buildTree(array.slice(0, mid));
    root.right = this.#buildTree(array.slice(mid + 1));

    return root;
  }

  #getNextNode(node, value) {
    return value < node.value ? node.left : node.right;
  }

  insert(value) {
    let currentNode = this.root;

    while (true) {
      if (value < currentNode.value) {
        if (currentNode.left) {
          currentNode = currentNode.left;
        } else {
          currentNode.left = new Node(value);
          break;
        }
      } else {
        if (currentNode.right) {
          currentNode = currentNode.right;
        } else {
          currentNode.right = new Node(value);
          break;
        }
      }
    }
  }

  //   delete(value) {
  //     let firstNode = null;
  //     let secondNode = null;
  //     let currentNode = this.root;
  //     while (nextNode.value !== value) {
  //       secondNode = currentNode;
  //       currentNode = this.#getNextNode(currentNode, value);
  //     }

  //     if (!currentNode.left && !currentNode.right) {
  //       if (value > secondNode.value) {
  //         secondNode.right = null;
  //       } else {
  //         secondNode.left = null;
  //       }
  //       return;
  //     }
  //     if (!nextNode.left || !nextNode.right) {
  //       console.log("Has one child");
  //       currentNode.nextNode = nextNode.nextNode;
  //       return;
  //     }
  //   }

  find(value) {
    let currentNode = this.root;

    while (true) {
      console.log(currentNode.value);
      if (currentNode.value === value) break;
      currentNode = this.#getNextNode(currentNode, value);
    }
    return currentNode;
  }
}

const tree = new Tree([1, 2, 3, 4]);
console.log(tree.find(3));
prettyPrint(tree.root);
