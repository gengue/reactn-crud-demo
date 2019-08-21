import React, { useEffect, useState, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import queryString from 'query-string';
import { AutoComplete, message } from 'antd';

const defaultParams = { limit: 10, page: 1 };

function SelectPickerFetch({
  resource,
  source,
  params = defaultParams,
  apiUrl = 'https://5d543b8b36ad770014ccd65a.mockapi.io/api/',
  labelKey,
  valueKey,
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
      message.error(e);
    } finally {
      setLoading(false);
    }
  }

  //init
  useEffect(
    () => {
      if (data.length === 0) {
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

  const onSearch = value => setSearch(value);

  const dataset = useMemo(
    () => {
      return data.map(i => ({
        value: i[valueKey],
        text: i[labelKey],
        ...i,
      }));
    },
    [data, valueKey, labelKey]
  );

  return (
    <AutoComplete
      allowClear
      onSearch={onSearch}
      loading={loading || (!loadedOnce && data.length === 0)}
      style={{ width: 200 }}
      dataSource={dataset}
      defaultActiveFirstOption={false}
      {...other}
    />
  );
}
export default SelectPickerFetch;
