import { isEqual } from "lodash";
import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "next/router";
import qs from "qs";
import algoliasearch from "algoliasearch/lite";
import { findResultsState } from "react-instantsearch-dom/server";
import App from "../components/app"
import Head from "../components/head"

const searchClient = algoliasearch(
  "BLEP8CUML9",
  "b0b60e2f8369b0619707b5454e4dee20"
);

const updateAfter = 700;

const createURL = (state: any) => `?${qs.stringify(state)}`;

const pathToSearchState = (path: string) =>
  path.includes("?") ? qs.parse(path.substring(path.indexOf("?") + 1)) : {};

const searchStateToURL = (searchState: any) =>
  searchState ? `${window.location.pathname}?${qs.stringify(searchState)}` : "";

const DEFAULT_PROPS = {
  searchClient,
  indexName: "instant_SEARCH",
};

class Page extends React.Component {
  debouncedSetState(debouncedSetState: any) {
    throw new Error("Method not implemented.");
  }
  static propTypes = {
    router: PropTypes.object.isRequired,
    resultsState: PropTypes.object,
    searchState: PropTypes.object,
  };

  state = {
    searchState: this.props.searchState,
    lastRouter: this.props.router,
  };

  static async getInitialProps({ asPath }) {
    const searchState = pathToSearchState(asPath);
    const resultsState = await findResultsState(App, {
      ...DEFAULT_PROPS,
      searchState,
    });

    return {
      resultsState,
      searchState,
    };
  }

  static getDerivedStateFromProps(props: { router: { asPath: string; }; }, state: { lastRouter: any; }) {
    if (!isEqual(state.lastRouter, props.router)) {
      return {
        searchState: pathToSearchState(props.router.asPath),
        lastRouter: props.router,
      };
    }

    return null;
  }

  onSearchStateChange = (searchState: any) => {
    clearTimeout(this.debouncedSetState);

    this.debouncedSetState = setTimeout(() => {
      const href = searchStateToURL(searchState);

      this.props.router.push(href, href, {
        shallow: true,
      });
    }, updateAfter);

    this.setState({ searchState });
  };

  render() {
    return (
      <div>
        <Head title="Home" />
        <App
          {...DEFAULT_PROPS}
          searchState={this.state.searchState}
          resultsState={this.props.resultsState}
          onSearchStateChange={this.onSearchStateChange}
          createURL={createURL}
        />
        
      </div>
    );
  }
}

export default withRouter(Page);

