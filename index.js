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

function getArrayMaxValue(array) {
  return array.sort((a, b) => a - b)[array.length - 1];
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
        const hasLeftLeaf = currentNode.left !== null;

        if (hasLeftLeaf) {
          currentNode = currentNode.left;
        } else {
          currentNode.left = new Node(value);
          break;
        }
      } else {
        const hasRightLeaf = currentNode.right !== null;

        if (hasRightLeaf) {
          currentNode = currentNode.right;
        } else {
          currentNode.right = new Node(value);
          break;
        }
      }
    }
  }

  #getAmountOfLeaves(node) {
    let amount = 0;
    if (node.left) amount++;
    if (node.right) amount++;
    return amount;
  }

  #deleteLeaflessNode({ value, parentNode }) {
    if (value < parentNode.value) {
      parentNode.left = null;
    } else {
      parentNode.right = null;
    }
  }

  #deleteNodeWithOneLeaf({ value, parentNode, currentNode }) {
    const childNode =
      value < currentNode.value ? currentNode.left : currentNode.right;
    if (currentNode.value < parentNode.value) {
      parentNode.left = childNode;
    } else {
      parentNode.right = childNode;
    }
  }

  #deleteNodeWithTwoLeafs({ value, queue, currentNode }) {
    let smallestRightNodeParent = currentNode;
    let smallestRightNode = currentNode.right;
    let smallestRightNodeWasFound = false;

    while (!smallestRightNodeWasFound) {
      if (smallestRightNode.left) {
        smallestRightNodeParent = smallestRightNode;
        smallestRightNode = smallestRightNode.left;
      } else {
        smallestRightNodeWasFound = true;
      }
    }

    const amountOfLeavesOnSmallestRightNode =
      this.#getAmountOfLeaves(smallestRightNode);

    if (amountOfLeavesOnSmallestRightNode === 0) {
      this.#deleteLeaflessNode({
        parentNode: smallestRightNodeParent,
        value,
      });
    } else {
      this.#deleteNodeWithOneLeaf({
        parentNode: smallestRightNodeParent,
        currentNode: smallestRightNode,
        value: value,
      });
    }
    currentNode.value = smallestRightNode.value;
  }

  delete(value) {
    let nodeWasDeleted = false;
    const queue = [];
    queue.push(this.root);

    while (!nodeWasDeleted) {
      const currentNode = queue[queue.length - 1];
      const doesNodeWithValueExist = currentNode !== null;

      if (!doesNodeWithValueExist) break;

      if (value < currentNode.value) {
        queue.push(currentNode.left);
      } else if (value > currentNode.value) {
        queue.push(currentNode.right);
      } else {
        const parentNode = queue[queue.length - 2];
        let amountOfLeaves = this.#getAmountOfLeaves(currentNode);

        switch (amountOfLeaves) {
          case 0:
            this.#deleteLeaflessNode({ value, parentNode });
            break;
          case 1:
            this.#deleteNodeWithOneLeaf({ value, parentNode, currentNode });
            break;
          default:
            this.#deleteNodeWithTwoLeafs({ value, queue, currentNode });
        }

        nodeWasDeleted = true;
      }
    }
  }

  find(value) {
    let currentNode = this.root;

    while (true) {
      console.log(currentNode.value);
      if (currentNode.value === value) break;
      currentNode = this.#getNextNode(currentNode, value);
    }
    return currentNode;
  }

  levelOrderIterative(callback = null) {
    const queue = [this.root];
    const values = [];
    const callbackProvided = callback !== null;

    while (queue.length > 0) {
      const firstQueueElement = queue[0];

      if (firstQueueElement.left) {
        queue.push(firstQueueElement.left);
      }
      if (firstQueueElement.right) {
        queue.push(firstQueueElement.right);
      }

      if (callbackProvided) {
        values.push(callback(firstQueueElement.value));
      } else {
        values.push(firstQueueElement.value);
      }
      queue.shift();
    }
    return values;
  }

  inorder({ cb = null, node }) {
    let resultArray = [];

    if (cb) {
      if (node.left) {
        resultArray = resultArray.concat(this.inorder({ cb, node: node.left }));
      }
      resultArray.push(cb(node.value));
      if (node.right) {
        resultArray = resultArray.concat(
          this.inorder({ cb, node: node.right })
        );
      }
    } else {
      if (node.left) {
        resultArray = resultArray.concat(this.inorder({ node: node.left }));
      }
      resultArray.push(node.value);
      if (node.right) {
        resultArray = resultArray.concat(this.inorder({ node: node.right }));
      }
    }
    return resultArray;
  }

  preorder({ cb = null, node }) {
    let resultArray = [];

    if (cb) {
      resultArray.push(cb(node.value));
      if (node.left) {
        resultArray = resultArray.concat(
          this.preorder({ cb, node: node.left })
        );
      }
      if (node.right) {
        resultArray = resultArray.concat(
          this.preorder({ cb, node: node.right })
        );
      }
    } else {
      resultArray.push(node.value);
      if (node.left) {
        resultArray = resultArray.concat(this.preorder({ node: node.left }));
      }
      if (node.right) {
        resultArray = resultArray.concat(this.preorder({ node: node.right }));
      }
    }
    return resultArray;
  }

  postorder({ cb = null, node }) {
    let resultArray = [];

    if (cb) {
      if (node.left) {
        resultArray = resultArray.concat(
          this.postorder({ cb, node: node.left })
        );
      }
      if (node.right) {
        resultArray = resultArray.concat(
          this.postorder({ cb, node: node.right })
        );
      }
      resultArray.push(cb(node.value));
    } else {
      if (node.left) {
        resultArray = resultArray.concat(this.postorder({ node: node.left }));
      }
      if (node.right) {
        resultArray = resultArray.concat(this.postorder({ node: node.right }));
      }
      resultArray.push(node.value);
    }
    return resultArray;
  }

  height(node = this.root) {
    if (this.#getAmountOfLeaves(node) === 0) {
      return 1;
    } else {
      const childrenHeights = [];
      if (node.left) {
        childrenHeights.push(1 + this.height(node.left));
      }
      if (node.right) {
        childrenHeights.push(1 + this.height(node.right));
      }
      return getArrayMaxValue(childrenHeights);
    }
  }
}

function debugSquare(value) {
  return value * value;
}

const tree = new Tree([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
prettyPrint(tree.root, "|");
console.log(tree.height());
