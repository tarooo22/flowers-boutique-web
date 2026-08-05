import { TRPCError } from "@trpc/server";
import { deleteCustomerAddress, updateCustomerAddress } from "./db";

export interface AddressOwnershipRepository {
  updateOwned(userId: number, addressId: number, updates: Record<string, unknown>): Promise<boolean>;
  deleteOwned(userId: number, addressId: number): Promise<boolean>;
}

const databaseAddressRepository: AddressOwnershipRepository = {
  updateOwned: updateCustomerAddress,
  deleteOwned: deleteCustomerAddress,
};

export async function updateAddressForUser(
  userId: number,
  addressId: number,
  updates: Record<string, unknown>,
  repository: AddressOwnershipRepository = databaseAddressRepository,
): Promise<void> {
  const updated = await repository.updateOwned(userId, addressId, updates);
  if (!updated) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Address not found" });
  }
}

export async function deleteAddressForUser(
  userId: number,
  addressId: number,
  repository: AddressOwnershipRepository = databaseAddressRepository,
): Promise<void> {
  const deleted = await repository.deleteOwned(userId, addressId);
  if (!deleted) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Address not found" });
  }
}
