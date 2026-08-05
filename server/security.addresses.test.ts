import { describe, expect, it } from "vitest";
import {
  deleteAddressForUser,
  updateAddressForUser,
  type AddressOwnershipRepository,
} from "./addressAuthorization";

class MemoryAddressRepository implements AddressOwnershipRepository {
  owners = new Map<number, number>([[20, 2]]);
  updates = new Map<number, Record<string, unknown>>();

  async updateOwned(userId: number, addressId: number, updates: Record<string, unknown>) {
    if (this.owners.get(addressId) !== userId) return false;
    this.updates.set(addressId, updates);
    return true;
  }

  async deleteOwned(userId: number, addressId: number) {
    if (this.owners.get(addressId) !== userId) return false;
    this.owners.delete(addressId);
    return true;
  }
}

describe("customer address ownership", () => {
  it("prevents User A from updating User B's address", async () => {
    const repository = new MemoryAddressRepository();
    await expect(
      updateAddressForUser(1, 20, { label: "stolen" }, repository),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(repository.updates.has(20)).toBe(false);
  });

  it("prevents User A from deleting User B's address", async () => {
    const repository = new MemoryAddressRepository();
    await expect(deleteAddressForUser(1, 20, repository)).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
    expect(repository.owners.get(20)).toBe(2);
  });

  it("allows the owner to update and delete their address", async () => {
    const repository = new MemoryAddressRepository();
    await expect(updateAddressForUser(2, 20, { label: "Home" }, repository)).resolves.toBeUndefined();
    await expect(deleteAddressForUser(2, 20, repository)).resolves.toBeUndefined();
    expect(repository.owners.has(20)).toBe(false);
  });
});
