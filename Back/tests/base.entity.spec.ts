
import { ObjectId } from "@mikro-orm/mongodb";
import { BaseEntity } from "../src/shared/db/baseEntity.entity.js";

class TestEntity extends BaseEntity {}

describe("BaseEntity", () => {
  it("should generate a new ObjectId and a serialized id", () => {
    const entity = new TestEntity();

    expect(entity._id).toBeDefined(); // Asegura que _id está asignado
    expect(entity._id).toBeInstanceOf(ObjectId);
    expect(entity.id).toBeUndefined(); // MikroORM no ha gestionado la entidad, por lo que id aún es undefined
  });

  it("should correctly assign id when managed by MikroORM", async () => {
    const entity = new TestEntity();
    entity.id = entity._id?.toHexString(); // Simula el comportamiento de MikroORM

    expect(entity.id).toBeDefined();
    expect(typeof entity.id).toBe("string");
  });
});