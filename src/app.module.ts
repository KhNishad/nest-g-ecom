import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';


@Module({
  imports: [UsersModule, ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true
  }), MongooseModule.forRoot(process.env.DB!, {
    connectionFactory: (connection) => {
      if (connection.readyState === 1) {
        console.log('✅ MongoDB Database Connected');
      }
      return connection;
    },
  }), AuthModule, CustomersModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
