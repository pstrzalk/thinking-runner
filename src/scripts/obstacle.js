class Obstacle {
  constructor(x, y, height = 20) {
    this.position = { x: x, y: y };
    this.velocity = { x: -20, y: 0 };

    this.width = 20;
    this.height = height;

    this.gameElement = document.getElementById("game");
    this.createElement();
  };

  render() {
    this.element.style.left = `${this.position.x}px`;
    this.element.style.bottom = `${this.position.y}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.width = `${this.width}px`;
  };

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add('obstacle');
    this.gameElement.append(this.element);
  };

  removeElement() {
    this.gameElement.removeChild(this.element);
  };
};

export { Obstacle };
