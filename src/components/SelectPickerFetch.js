import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import queryString from 'query-string';
import { Icon, SelectPicker, Alert } from 'rsuite';

const defaultParams = { limit: 10, page: 1 };

function SelectPickerFetch({
  resource,
  source,
  params = defaultParams,
  apiUrl = 'https://5d543b8b36ad770014ccd65a.mockapi.io/api/',
  fetchOnMount,
  ...other
}) {
  const [data, setData] = useState([]);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rawSearch, setSearch] = useState(null);
  const [searchText] = useDebounce(rawSearch, 350);

  async function loadData() {
    try {
      setLoading(true);
      const { filter, ...otherParams } = params;
      const query = queryString.stringify({
        search: searchText || undefined,
        ...defaultParams,
        ...otherParams,
        ...filter,
      });
      const url = `${apiUrl}${resource}?${query}`;
      const json = await (await fetch(url)).json();
      setData(json.data);
      setLoadedOnce(true);
    } catch (e) {
      Alert.error(e);
    } finally {
      setLoading(false);
    }
  }

  //init
  useEffect(
    () => {
      if (fetchOnMount) {
        loadData();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // on search
  useEffect(
    () => {
      if (searchText !== null) {
        loadData();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchText]
  );

  const onOpen = () => {
    if (data.length === 0) {
      loadData();
    }
  };
  const onSearch = value => setSearch(value);

  const renderMenu = menu => {
    if (loading || (!loadedOnce && data.length === 0)) {
      return (
        <p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
          <Icon icon="spinner" spin /> loading...
        </p>
      );
    }
    return menu;
  };

  return (
    <SelectPicker
      data={data}
      renderMenu={renderMenu}
      onOpen={onOpen}
      onSearch={onSearch}
      {...other}
    />
  );
}
export default SelectPickerFetch;
