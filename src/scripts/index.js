import '../styles/index.scss';

import { Brain } from './brain';
import { World } from './world';
import { World3D } from './world_3d';

let world = new World();
let world_3d;
const viewerElement = document.querySelector('.viewer');

const handleModeChange = (mode) => {
  event.preventDefault();

  viewerElement.innerHTML = '';

  if (mode === 'train') {
    tf.setBackend('cpu');

    viewerElement.innerHTML = world.getHTML();
    world.init();
    world.render();
  } else if (mode === 'test') {
    const brain = world.bestBrain();
    if (brain) {
      world_3d = new World3D(brain);
      world_3d.render();
    } else {
      console.warn('No brain yet');
    }
  }
};

document.querySelector('.js-mode-train')
        .addEventListener('click', () => { handleModeChange('train'); }, false);

document.querySelector('.js-mode-test')
        .addEventListener('click', () => { handleModeChange('test'); }, false);
