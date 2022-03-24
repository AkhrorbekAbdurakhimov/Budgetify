import app from './app.mjs';
import config from './config/index.mjs';

app.listen(config.APP.PORT, () => {
  console.log(`${config.APP.ENV} server is running on port ${config.APP.PORT}`);
});
