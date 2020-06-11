import React from 'react';
import docs from '../../../../../README.md';

let ReactMarkdown = null;

class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      mdComponentReady: false,
    };
  }

  componentDidMount() {
    import(/* webpackChunkName: "rmd" */ 'react-markdown')
      .then(({ default: MDComponent }) => {
        ReactMarkdown = MDComponent;
        this.setState({
          mdComponentReady: true,
        });
      });
  }

  render() {
    return (
      <div className="home">
        { this.state.mdComponentReady ? (
          <ReactMarkdown className="markdown-body" source={docs} />
        ) : null }
      </div>
    );
  }
}

Home.propTypes = {};

Home.defaultProps = {};

export default Home;
