import '../styles/index.scss';
import { World } from './world';

tf.setBackend('cpu');

const world = new World();

world.run();
