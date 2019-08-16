import crud from './crud';
import * as ui from './ui';
import * as constants from './constants';

class CRUDSettings {
  constructor() {
    this.settings = {
      dataProvider: null,
    };
  }

  get() {
    return this.settings;
  }

  set(config) {
    this.settings = { ...this.settings, ...config };
  }
}
// global config
const settings = new CRUDSettings();
window.mondaSettings = settings;

export { crud, ui, constants, settings };
export default {
  crud,
  settings,
};
