import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { StrictMode, Suspense } from 'react';
import { router } from './router';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root not found');
}

const container = createRoot(root);

container.render(
  <StrictMode>
    <Suspense fallback={<div>loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
);
