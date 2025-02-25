import {app} from './app.js';
import {env} from './config_env/config.js';
// LISTEN SERVIDOR

app.listen(env.PORT, () => {
  console.log("Server running in http:\\localhost:" + env.PORT)
})