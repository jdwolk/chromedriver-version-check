import React, { useEffect, useState } from 'react';
import { get } from 'axios';
import 'bulma/css/bulma.css';

const NOT_CHROME_TEXT = 'NOT CHROME'

const chromeVersion = (userAgentString) => {
  const matches = userAgentString.split('Chrome/');
  if (matches.length < 2) { return NOT_CHROME_TEXT; }

  const version = matches[1].split(' ')[0];
  return version;
}

const chromeDriverLatestReleaseUrl = (chromeDriverVersion) => {
  if (!chromeDriverVersion) { return ''; };
  return `https://chromedriver.storage.googleapis.com/index.html?path=${chromeDriverVersion}/`;
}

const queryChromeDriverVersion = async (chromeVersion) => {
  const url = `${process.env.REACT_APP_SERVER_URL}/api/chromedriver_version?chrome_version=${chromeVersion}`
  try {
    const { data: { chromedriver_version } } = await get(url, { crossDomain: true });
    return chromedriver_version;
  } catch {
    return NOT_CHROME_TEXT;
  }
};

const styles = {
  footer: {
    margin: 0,
    width: '100%',
    bottom: 0,
    position: 'fixed',
  },
  loadingSpinner: {
    width: '2em',
    height: '2em'
  },
  teeny: {
    fontSize: '.5em',
  }
};

function App() {
  const userAgent = navigator.userAgent;
  const chrome = chromeVersion(userAgent);

  const [chromeDriverVersion, setChromeDriverVersion] = useState();
  const chromeDriverDownloadUrl = chromeDriverLatestReleaseUrl(chromeDriverVersion)

  useEffect(() => {
    const thisIsStuipid = async () => {
      const result = await queryChromeDriverVersion(chrome);
      setChromeDriverVersion(result);
    };
    thisIsStuipid();
  }, []);

  return (
    <>
      <section className="section">
        <div className="container">
          <h2>You should be using ChromeDriver version:</h2>
          {
            chromeDriverVersion ?
              <h1 id="chromedriver-version" className="title">{chromeDriverVersion}</h1> :
              <img alt="loading..." src="/loading.gif" style={styles.loadingSpinner} />
          }
          <div className="columns">
            <div className="column">
              <p>
                <a href={chromeDriverDownloadUrl}>Download ChromeDriver</a>
              </p>

              <p>
                Chrome Version: {chrome}
              </p>

              <p>
                ChromeDriver version is derived using <a href="https://sites.google.com/a/chromium.org/chromedriver/downloads/version-selection">these instructions</a>
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="footer" style={styles.footer}>
        <div className="content has-text-centered">
          <p>
            <small>
              This site is in no way affiliated with Google, Google Chrome or ChromeDriver
            </small>
          </p>

          <p>
            <small style={styles.teeny}>
              (...I just got tired of manually creating the URL every time Chrome was updated)
            </small>
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
