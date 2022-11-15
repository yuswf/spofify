import '../styles/globals.css';
import '../styles/style.css';

import {Provider} from 'react-redux';
import store from '../stores';

function App({Component, pageProps}) {
    return <Provider store={store}>
        <Component {...pageProps} />
    </Provider>
}

export default App;
