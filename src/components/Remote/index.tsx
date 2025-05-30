'use client';

import { ParentType, useRemoteWindow } from '@/hooks/useRemoteWindow';

function Remote() {
  const { parentType } = useRemoteWindow();

  switch (parentType) {
    case ParentType.IFRAME: {
      return (
        <div className="remote-info">
          <p>
            This is a remote window which is included in an iframe on your main page. <span className="remote-info--em">You should not see this message.</span>
          </p>
        </div>
      );
    }

    case ParentType.POPUP: {
      return (
        <div className="remote-info">
          <p>
            This is your WiFi-printer&#39;s remote control page.
          </p>
          <p>
            {window.location.host}
          </p>
          <p>
            You can go back to your main app and start importing your images.
          </p>
          <p className="remote-info--em">
            In order for the import to work, this window needs to remain open!
          </p>
        </div>
      );
    }

    case ParentType.NONE:
    default: {
      return (
        <div className="remote-info">
          <p>
            This window is missing the reference to your main app.
          </p>
          <p className="remote-info--em">
            It must be opened from the settings page of your main app in order to work!
          </p>
        </div>
      );
    }
  }
}

export default Remote;
