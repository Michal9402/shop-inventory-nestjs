import { Catalog } from "@prisma/client";

export class CatalogEntity implements Catalog {
  id: number;
  name: string;
}
