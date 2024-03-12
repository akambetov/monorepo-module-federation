import { useState } from 'react';

import './App.scss';
import { Link, Outlet } from 'react-router-dom';
import { adminUrls, shopUrls } from '@packages/shared';


export const App = () => {
  const [count, setCount] = useState(0);

  const handleCount = () => setCount((prev) => prev + 1);

  return (
    <div>
      <h1>PAGE</h1>
      <Link to={adminUrls.about} >About</Link>
      <br />
      <Link to={shopUrls.main}>Shop</Link>
      <Outlet/>
    </div>
  );
};
