class Obstacle {
  constructor(x, y, height = 20) {
    this.position = { x: x, y: y };
    this.velocity = { x: -20, y: 0 };

    this.width = 20;
    this.height = height;

    this.gameElement = document.getElementById("game");
    this.element = document.createElement("div");
    this.element.classList.add('obstacle');
    this.gameElement.append(this.element);
  };

  render() {
    this.element.style.left = `${this.position.x}px`;
    this.element.style.bottom = `${this.position.y}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.width = `${this.width}px`;
  };

  dispose() {
    this.gameElement.removeChild(this.element);
  };

  update() {
    this.position.x += this.velocity.x;
  };
};

export { Obstacle };
