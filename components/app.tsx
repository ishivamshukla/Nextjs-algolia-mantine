import React from 'react';
import PropTypes, { any } from 'prop-types';
import {
  RefinementList,
  SearchBox,
  Hits,
  Configure,
  Highlight,
  Pagination,
  InstantSearch,
  InstantSearchProps,
} from 'react-instantsearch-dom';
import { Card, Image, Text, Badge, Button, Group, useMantineTheme, Menu, MenuItem } from '@mantine/core';

const HitComponent = ({ hit }: any) => (
  <div>
    {hit.title} {hit.data_source}
  </div>
);

HitComponent.propTypes = {
  hit: PropTypes.object,
};


export default function App(props: any) {
  // static propTypes = {
  //   searchState: PropTypes.object,
  //   resultsState: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  //   onSearchStateChange: PropTypes.func,
  //   createURL: PropTypes.func,
  //   indexName: PropTypes.string,
  //   searchClient: PropTypes.object,
  // };
 

    return (
      <InstantSearch
        searchClient={props.searchClient}
        resultsState={props.resultsState}
        onSearchStateChange={props.onSearchStateChange}
        searchState={props.searchState}
        createURL={props.createURL}
        indexName={props.indexName}
        onSearchParameters={props.onSearchParameters}
        {...props}
      >
        <Configure hitsPerPage={32} />
        <header>
          <h1>React InstantSearch + Next.Js</h1>
          <SearchBox />
        </header>
        <main>
          <Menu
             control={<button type="button">Data Source</button>}
             controlRefProp="ref"
          >
           <MenuItem>
             <RefinementList attribute="data_source" />
           </MenuItem>
          </Menu >
          <Menu
             control={<button type="button">Geography</button>}
          >
            <MenuItem>
             <RefinementList attribute="geography" />
            </MenuItem> 
          </Menu>
          <Menu
             control={<button type="button">Topic</button>}
          >
           <MenuItem>
            <RefinementList attribute="topic" />
           </MenuItem>
          </Menu>
          <div >
            
            <Hits hitComponent={HitComponent} />
          </div>
        </main>
        <Pagination /> 
      </InstantSearch>
    );
}
