import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ErrorPage({ errs }) {
  const [displayErr, setDisplayErr] = useState({});

  const location = useLocation();
  const state = location.state;

  //errs should be an object with
  //err: the error, source: the component who passed the error
  //useLocation to get err object from useNavigate

  useEffect(() => {
    if (state) {
      setDisplayErr({ ...state });
      console.log(state)
    } else if (errs) setDisplayErr({ ...errs });
      else setDisplayErr({source: 'Global', err: 'unknown'})  
  }, [])

  return (
    <div className="errorDiv">
      <h1>How'd we end up here?</h1>
      <p>
        {displayErr.source} returned an error: {displayErr.err}
      </p>
    </div>
  );
}
