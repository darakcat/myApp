import { Redirect, Route } from 'react-router-dom';
import { IonApp,  IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { Storage } from '@ionic/storage';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import ShopList from './pages/ShopList';
import SalesDaily from './pages/SalesDaily';
import SalesDailyByStore from './pages/SalesDailyByStore';
import PrivateRoute from './components/PrivateRoute';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const store = new Storage();
store.create();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/login" component={Login} exact={true} />
        <PrivateRoute path="/home" component={Home} exact={true} />
        <PrivateRoute path="/shop" component={ShopList} exact={true} />
        <PrivateRoute path="/sales-daily" component={SalesDaily} exact={true} />
        <PrivateRoute path="/sales-daily-by-store" component={SalesDailyByStore} exact={true} />
        <PrivateRoute path="/" component={Home} exact={true} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
