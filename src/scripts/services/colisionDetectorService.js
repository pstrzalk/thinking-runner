const actorColided = (actor, obstacles) => {
  return obstacles.some((obstacle) => {
    return (
      actor.position.x + actor.width >= obstacle.position.x &&
      actor.position.x <= obstacle.position.x + obstacle.width
    ) && (
      actor.position.y + actor.height >= obstacle.position.y &&
      actor.position.y <= obstacle.position.y + obstacle.height
    );
  });
};

const actorGrounded = (actor) => {
  return actor.position.y <= 0.001;
};


export { actorColided, actorGrounded };
