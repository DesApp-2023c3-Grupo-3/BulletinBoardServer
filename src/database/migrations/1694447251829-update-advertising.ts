import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAdvertising1694447251829 implements MigrationInterface {
  name = 'UpdateAdvertising1694447251829';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ImageScreen" DROP CONSTRAINT "FK_f60dfde284aa86c3922d66ff020"`,
    );
    await queryRunner.query(
      `CREATE TABLE "Advertising" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "imageTypeId" integer, "userId" integer, "sectorId" integer, "scheduleId" integer, CONSTRAINT "PK_2bcfc39a910f60618f47fabd427" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "AdvertisingScreen" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "imageId" integer, "screenId" integer, CONSTRAINT "PK_5169b16d20fe839cf0ad0926281" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "AdvertisingType" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "name" character varying(1024) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_d2feff1b369d450a04b636cb21b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Advertising" ADD CONSTRAINT "FK_0505dd9b71a14959152d58f941f" FOREIGN KEY ("imageTypeId") REFERENCES "ImageType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Advertising" ADD CONSTRAINT "FK_11b3988f2add47245cec97b5164" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Advertising" ADD CONSTRAINT "FK_fb5d24358f18707421fbfe4f4b9" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Advertising" ADD CONSTRAINT "FK_4abf5164f528c3101e98a73c09b" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "AdvertisingScreen" ADD CONSTRAINT "FK_7374d4693b109a1ed7ec75d5bbb" FOREIGN KEY ("imageId") REFERENCES "Advertising"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "AdvertisingScreen" ADD CONSTRAINT "FK_e0c4a1dba0cd873ca7e10cba7c8" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ImageScreen" ADD CONSTRAINT "FK_f60dfde284aa86c3922d66ff020" FOREIGN KEY ("imageId") REFERENCES "Advertising"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ImageScreen" DROP CONSTRAINT "FK_f60dfde284aa86c3922d66ff020"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AdvertisingScreen" DROP CONSTRAINT "FK_e0c4a1dba0cd873ca7e10cba7c8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "AdvertisingScreen" DROP CONSTRAINT "FK_7374d4693b109a1ed7ec75d5bbb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Advertising" DROP CONSTRAINT "FK_4abf5164f528c3101e98a73c09b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Advertising" DROP CONSTRAINT "FK_fb5d24358f18707421fbfe4f4b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Advertising" DROP CONSTRAINT "FK_11b3988f2add47245cec97b5164"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Advertising" DROP CONSTRAINT "FK_0505dd9b71a14959152d58f941f"`,
    );
    await queryRunner.query(`DROP TABLE "AdvertisingType"`);
    await queryRunner.query(`DROP TABLE "AdvertisingScreen"`);
    await queryRunner.query(`DROP TABLE "Advertising"`);
    await queryRunner.query(
      `ALTER TABLE "ImageScreen" ADD CONSTRAINT "FK_f60dfde284aa86c3922d66ff020" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}