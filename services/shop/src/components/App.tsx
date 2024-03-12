import { useState } from 'react';

import './App.scss';
import { Link, Outlet } from 'react-router-dom';


export const App = () => {
  const [count, setCount] = useState(0);

  const handleCount = () => setCount((prev) => prev + 1);

  return (
    <div>
      <h1>SHOP MODULE</h1>
      <Outlet/>
    </div>
  );
};
