import { Vector3 } from "@caspertech/node-metaverse";

const vectorToXml = (
  vector: Vector3
): {
  X: number;
  Y: number;
  Z: number;
} => {
  const fake = {} as any;
  fake.ele = (key: string, value: unknown) => {
    fake[key] = value;
  };
  Vector3.getXML(fake, vector);
  delete fake.ele;
  return fake;
};

export default vectorToXml;
