import React from 'react';
import { ListController } from './../../crud/ui';
import ImageGrid from './../../components/ImageGrid';

function CountryList(props) {
  return (
    <ListController
      {...props}
      resource="countries"
      columns={[]}
      CustomIterator={ImageGrid}
    />
  );
}
export default CountryList;
