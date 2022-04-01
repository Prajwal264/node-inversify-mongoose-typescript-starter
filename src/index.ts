import express, { Application } from 'express';

/**
 *
 *
 * @class Server
 */
class Server {
  /**
   *
   *
   * @private
   * @type {(string | number)}
   * @memberof Server
   */
  private port: string | number;

  /**
   *
   *
   * @private
   * @type {Application}
   * @memberof Server
   */
  private app: Application;

  /**
   *
   *
   * @memberof Server
   */
  public async init() {
    this.confgure();
    await this.setup();
    this.listen();
  }

  /**
   *
   *
   * @private
   * @memberof Server
   */
  private confgure() {
    this.configurePort();
  }

  /**
   *
   *
   * @private
   * @memberof Server
   */
  private configurePort() {
    this.port = process.env.PORT || 4000;
  }

  /**
   *
   *
   * @private
   * @memberof Server
   */
  private async setup() {
    this.createExpressApplication();
  }

  /**
   *
   *
   * @private
   * @memberof Server
   */
  private createExpressApplication() {
    this.app = express();
  }

  /**
   *
   *
   * @private
   * @memberof Server
   */
  private listen() {
    const { port } = this;
    this.app.listen(port, () => {
      console.log(`Server is running at ${port}`);
    });
  }
}

/**
 *
 *
 */
const bootstrap = async () => {
  const server = new Server();
  server.init();
};

bootstrap();
