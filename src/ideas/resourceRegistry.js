import { getGlobal, setGlobal } from 'reactn';

// default
export const getDefaultState = (name, options = {}) => ({
  list: {
    ids: [],
    params: {},
  },
  data: {},
  props: { name, options },
});

/*
 * global state reducer registry
 *
 * The resource registry enables add records with the default initialization of
 * a resource. This allows reactn load on-demand previus to the first initial 
 * global state using a stack. 
 */
class ResourceRegistry {
  constructor() {
    this.stack = [];
  }

  getStackedResources() {
    const response = this.stack.reduce((acc, i) => {
      return {
        ...acc,
        [i.name]: getDefaultState(i.name, i.options),
      };
    }, {});
    // clear stack before send
    this.stack = [];
    return response;
  }

  register(name, options = {}) {
    const { resources } = getGlobal();
    // if initial global state not initialized yet, save resource for later
    if (!resources) {
      this.stack.push({ name, options });
      return;
    }
    // check if the resource already exists
    if (name in resources) return;
    // otherwite initialize it
    setGlobal({
      resources: {
        ...resources,
        [name]: getDefaultState(name, options),
      },
    });
  }
}
export const resourceRegistry = new ResourceRegistry();
