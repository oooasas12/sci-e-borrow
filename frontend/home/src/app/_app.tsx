import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store'; // ปรับเส้นทางให้ถูกต้อง
import Layout from '@/Layouts/default';

function MyApp({ Component, pageProps }: { Component: React.ComponentType; pageProps: any }) {
  return (
    <>
      <html>
        <body>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </PersistGate>
          </Provider>
        </body>
      </html>
    </>
  );
}

export default MyApp; 