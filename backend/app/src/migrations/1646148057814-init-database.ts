import {MigrationInterface, QueryRunner} from "typeorm";

export class initDatabase1646148057814 implements MigrationInterface {
    name = 'initDatabase1646148057814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."channel_restriction_type_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "channel_restriction" ("id" SERIAL NOT NULL, "channelId" integer NOT NULL, "userId" integer NOT NULL, "type" "public"."channel_restriction_type_enum" NOT NULL, "endAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_06a4fd9709a10128743c0291adf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel_message" ("id" SERIAL NOT NULL, "channelId" integer NOT NULL, "userId" integer NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b01cf5d92374acdd654bcb61df7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "isPrivate" boolean NOT NULL, "password" character varying, "ownerId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel_member" ("id" SERIAL NOT NULL, "channelId" integer NOT NULL, "userId" integer NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a4a716289e5b0468f55f8e8d225" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_blockships" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "blockedId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9af22babb9d881653fbc5683116" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_friendships" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "friendId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_8a0a000188e86d9ebba9430493e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "login" character varying NOT NULL, "username" character varying NOT NULL, "imageUrl" character varying, "status" integer NOT NULL DEFAULT '0', "activity" character varying, "twoFactorAuthSecret" character varying, "isTwoFactorEnable" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth" ("user" SERIAL NOT NULL, "accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, CONSTRAINT "PK_14c734b4fb0193c99ee4f8934f9" PRIMARY KEY ("user"))`);
        await queryRunner.query(`CREATE TABLE "games" ("id" SERIAL NOT NULL, "map" character varying NOT NULL, "player1Id" integer NOT NULL, "player1Score" integer NOT NULL, "player2Id" integer NOT NULL, "player2Score" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "endAt" TIMESTAMP, CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "channel_restriction" ADD CONSTRAINT "FK_adce5a4968ada913da1bd306b82" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_restriction" ADD CONSTRAINT "FK_ed8963faeae1f85242ae688c546" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_message" ADD CONSTRAINT "FK_67e2cdb305529e00e7abfff8d77" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_message" ADD CONSTRAINT "FK_65c489515cdf007c57fe42e469c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_member" ADD CONSTRAINT "FK_01ae975cf03c76e7ebfb14f22f0" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_member" ADD CONSTRAINT "FK_245da03cfde01c653c492d83a0d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_blockships" ADD CONSTRAINT "FK_a2bb7ac4e737a05c4b81e450117" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_blockships" ADD CONSTRAINT "FK_213f31dd662c731c2f8a40decc1" FOREIGN KEY ("blockedId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_friendships" ADD CONSTRAINT "FK_43abeca81dc1d54610e069ad283" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_friendships" ADD CONSTRAINT "FK_f4c2f10fa25fb2c30d84f997a86" FOREIGN KEY ("friendId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_75fbf4e5d917a20839c96ccda03" FOREIGN KEY ("player1Id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_090ead4cf0688537043f35b569e" FOREIGN KEY ("player2Id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_090ead4cf0688537043f35b569e"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_75fbf4e5d917a20839c96ccda03"`);
        await queryRunner.query(`ALTER TABLE "user_friendships" DROP CONSTRAINT "FK_f4c2f10fa25fb2c30d84f997a86"`);
        await queryRunner.query(`ALTER TABLE "user_friendships" DROP CONSTRAINT "FK_43abeca81dc1d54610e069ad283"`);
        await queryRunner.query(`ALTER TABLE "user_blockships" DROP CONSTRAINT "FK_213f31dd662c731c2f8a40decc1"`);
        await queryRunner.query(`ALTER TABLE "user_blockships" DROP CONSTRAINT "FK_a2bb7ac4e737a05c4b81e450117"`);
        await queryRunner.query(`ALTER TABLE "channel_member" DROP CONSTRAINT "FK_245da03cfde01c653c492d83a0d"`);
        await queryRunner.query(`ALTER TABLE "channel_member" DROP CONSTRAINT "FK_01ae975cf03c76e7ebfb14f22f0"`);
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07"`);
        await queryRunner.query(`ALTER TABLE "channel_message" DROP CONSTRAINT "FK_65c489515cdf007c57fe42e469c"`);
        await queryRunner.query(`ALTER TABLE "channel_message" DROP CONSTRAINT "FK_67e2cdb305529e00e7abfff8d77"`);
        await queryRunner.query(`ALTER TABLE "channel_restriction" DROP CONSTRAINT "FK_ed8963faeae1f85242ae688c546"`);
        await queryRunner.query(`ALTER TABLE "channel_restriction" DROP CONSTRAINT "FK_adce5a4968ada913da1bd306b82"`);
        await queryRunner.query(`DROP TABLE "games"`);
        await queryRunner.query(`DROP TABLE "auth"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_friendships"`);
        await queryRunner.query(`DROP TABLE "user_blockships"`);
        await queryRunner.query(`DROP TABLE "channel_member"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`DROP TABLE "channel_message"`);
        await queryRunner.query(`DROP TABLE "channel_restriction"`);
        await queryRunner.query(`DROP TYPE "public"."channel_restriction_type_enum"`);
    }

}
