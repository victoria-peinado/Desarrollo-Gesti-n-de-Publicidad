import {app} from './app.js';
import {env} from './config_env/config.js';
import { scheduleEvents } from './shared/scheduleFunction.js';
// LISTEN SERVIDOR

//Programa las renovaciones automaticas de ordenes el ultimo dia de cada mes.
scheduleEvents()

app.listen(env.PORT, () => {
  console.log("Server running in http:\\localhost:" + env.PORT)
})