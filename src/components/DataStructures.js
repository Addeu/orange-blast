/**
 * @class creates stack construction
 */

class Stack{

  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    if(this.items.length === 0) {
      return "Empty!";
    }
    return this.items.pop();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}
