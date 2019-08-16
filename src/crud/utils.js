import get from 'lodash/get';
import { DEFAULT_CONFIG } from './constants';

export function getConfig(resource, config = {}) {
  const base = get(config, 'basePath', DEFAULT_CONFIG.basePath);

  return {
    ...DEFAULT_CONFIG,
    ...config,
    basePath: `${base}${resource}`,
    hasList: !!get(config, 'components.List', false),
    hasShow: !!get(config, 'components.Show', false),
    hasEdit: !!get(config, 'components.Edit', false),
    hasCreate: !!get(config, 'components.Create', false),
    hasDelete: get(config, 'hasDelete', true),
  };
}
