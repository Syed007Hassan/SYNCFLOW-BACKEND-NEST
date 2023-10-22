import { MigrationInterface, QueryRunner } from "typeorm";

export class First1697997492941 implements MigrationInterface {
    name = 'First1697997492941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recruiter" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" integer NOT NULL, "role" character varying DEFAULT 'employer', "designation" character varying, "companyId" integer, CONSTRAINT "UQ_ec6610f232573009dfecae5bdf3" UNIQUE ("email"), CONSTRAINT "PK_e10c71ef86a9be2a6aead8eadfa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "companyName" character varying, "companyEmail" character varying, "companyWebsite" character varying, "companyAddress" character varying, "companyPhone" integer, CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "applicant" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying DEFAULT 'employee', CONSTRAINT "UQ_fbdc0939b42357f11221d81c489" UNIQUE ("email"), CONSTRAINT "PK_f4a6e907b8b17f293eb073fc5ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recruiter" ADD CONSTRAINT "FK_c55c06de5bcab4f6a2ebb8d1810" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recruiter" DROP CONSTRAINT "FK_c55c06de5bcab4f6a2ebb8d1810"`);
        await queryRunner.query(`DROP TABLE "applicant"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "recruiter"`);
    }

}
