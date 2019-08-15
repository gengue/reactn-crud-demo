import {
  resourceReducers,
  fetchReducers,
  readReducers,
  createReducers,
  updateReducers,
  deleteReducers,
  filterReducers,
} from './reducers';

const resourceDispachers = resourceReducers();
const fetchDispachers = fetchReducers();
const readDispachers = readReducers();
const createDispachers = createReducers();
const updateDispachers = updateReducers();
const deleteDispachers = deleteReducers();
const filterDispachers = filterReducers();

export default {
  ...resourceDispachers,
  ...fetchDispachers,
  ...readDispachers,
  ...createDispachers,
  ...updateDispachers,
  ...deleteDispachers,
  ...filterDispachers,
};
