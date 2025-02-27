import React from 'react';
import { Link, Navigate } from 'react-router';
import './index.scss';
import { useAddPlugin } from './useAddPlugin';
import SVG from '../SVG';

function AddPlugin() {
  // https://herrzatacke.github.io/gb-printer-web-plugins/
  // https://herrzatacke.github.io/gb-printer-web-plugins/svgize.js

  const {
    url,
    source,
    isTrusted,
    pluginExists,
    canAdd,
    addPlugin,
  } = useAddPlugin();

  if (!url) {
    return <Navigate to="/settings/plugins" replace />;
  }

  return (
    <div className="add-plugin">
      { isTrusted ? null : (
        <p className="add-plugin__message  add-plugin__message--warning-strong">
          <SVG className="add-plugin__warn" name="warn" />
          <span>
            The source of this plugin
          </span>
          <code className="add-plugin__source">
            { source }
          </code>
          <span>
            is not trusted!!
          </span>
        </p>
      ) }
      { pluginExists ? (
        <>
          <p className="add-plugin__message add-plugin__message--warning">
            <SVG className="add-plugin__warn" name="warn" />
            <span>
              The plugin
            </span>
            <code className="add-plugin__source">
              { url }
            </code>
            <span>
              is already installed
            </span>
          </p>
          <Link
            to="/settings/plugins"
            className="add-plugin__button add-plugin__button--goto"
          >
            Go to plugins
          </Link>
        </>
      ) : (
        <>
          <p className="add-plugin__message">
            <span>
              This will add
            </span>
            <code className="add-plugin__source">
              { url }
            </code>
            <span>
              to your plugins.
            </span>
          </p>
          <button
            disabled={!canAdd}
            className="add-plugin__button add-plugin__button--confirm"
            type="button"
            onClick={addPlugin}
          >
            Add
          </button>
        </>
      ) }
    </div>
  );
}

export default AddPlugin;
