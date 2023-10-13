import { Global, Inject, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';

import { WebSocketServer, WebSocket } from 'ws';

import serverConfig from '../../config/server.config';
import { SectorSubject } from './observer/Subject';
import { ScreenObserver } from './observer/Observer';
import { ScreenModule } from 'src/resources/screen/screen.module';
import { ScreenService } from 'src/resources/screen/screen.service';
import { SectorModule } from 'src/resources/sector/sector.module';
import { SectorService } from 'src/resources/sector/sector.service';

@Module({
  imports: [ConfigModule.forFeature(serverConfig), ScreenModule, SectorModule],
  providers: [],
  exports: [],
})
export class SocketConnectionModule {
  public socketServer: WebSocketServer;
  public sectors: SectorSubject[] = [];

  constructor(
    @Inject(serverConfig.KEY)
    private readonly serverConfiguration: ConfigType<typeof serverConfig>,
    @Inject(ScreenService)
    private readonly screenService: ScreenService,
    @Inject(SectorService)
    private readonly sectorService: SectorService,
  ) {
    this.initializeSocketConnection();
  }

  private async initializeSocketConnection() {
    const PORT = this.serverConfiguration.socket.port;
    this.socketServer = new WebSocketServer({ port: PORT, path: '/messaging' });
    this.socketServer.on('connection', this.makeConnection.bind(this));
    console.info(`Socket server connected on port ${PORT}...`);
  }

  private async makeConnection(ws: WebSocket) {
    ws.on('message', async (message) => {
      const data = JSON.parse(String(message));
      try {
        let screenFound = await this.screenService.findOne(data.screenId);
        if (!screenFound) {
          screenFound = await this.screenService.create({
            subscription: data.screenId,
            templeteId: '1',
            courseIntervalTime: 15,
            advertisingIntervalTime: 15,
            sector: await this.sectorService.findOne(1),
          });
        }
        const sectorFound = await this.sectorService.findOne(
          screenFound.sector.id,
        ); // TODO: Revisar si esto es necesario
        if (!sectorFound) {
          console.error('ERROR ON CONNECTION');
        }
        let sectorSubject = this.sectors.find(
          (sector) => sector.data.id === sectorFound.id,
        );
        if (!sectorSubject) {
          sectorSubject = new SectorSubject({
            data: sectorFound,
          });
          this.sectors.push(sectorSubject);
        }
        if (sectorSubject.contains(screenFound.id)) {
          sectorSubject.detach(screenFound.id);
        }
        const screenObserver = new ScreenObserver({
          data: screenFound,
          ws,
        });
        sectorSubject.attach(screenObserver);

        screenObserver.update({
          id: -1,
          action: 'START_CONNECTION',
          data: {
            sector: sectorFound,
            screen: screenFound,
          },
        });
      } catch (error) {
        console.error('SCREEN CONNECTION FAILED: ', error);
      }
    });
  }
}
