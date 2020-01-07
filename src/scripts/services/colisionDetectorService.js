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

export { actorColided };
