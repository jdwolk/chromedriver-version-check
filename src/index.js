import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import mixpanel from 'mixpanel-browser';
import { MixpanelProvider, MixpanelConsumer } from 'react-mixpanel';
import * as serviceWorker from './serviceWorker';

const MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN;
if (MIXPANEL_TOKEN) { mixpanel.init(MIXPANEL_TOKEN); }

const MixpanelBS = ({ children }) => {
  if (!MIXPANEL_TOKEN) { return children; }

  const trackPageView = (mixpanel) => {
    mixpanel.track('Page loaded');
  };

  return (
    <MixpanelProvider mixpanel={mixpanel}>
      <>
        <MixpanelConsumer>
          { trackPageView }
        </MixpanelConsumer>
        {children}
      </>
    </MixpanelProvider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <MixpanelBS>
      <App />
    </MixpanelBS>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
