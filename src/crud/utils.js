import get from 'lodash/get';
import { DEFAULT_CONFIG } from './constants';

export function getConfig(resource, config = {}) {
  return {
    ...DEFAULT_CONFIG,
    ...config,
    hasList: !!get(config, 'components.List', false),
    hasShow: !!get(config, 'components.Show', false),
    hasEdit: !!get(config, 'components.Edit', false),
    hasCreate: !!get(config, 'components.Create', false),
    hasDelete: get(config, 'hasDelete', true),
  };
}
