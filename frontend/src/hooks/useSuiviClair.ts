import { useCallback, useState } from 'react';
import { useContract } from '@starknet-react/core';
import { Contract, uint256, shortString } from 'starknet';
import { encryptData, decryptData, generateProof, ShipmentData, EncryptedShipment } from '../config/sdks';

const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as `0x${string}` || '0x0';

interface SuiviClairContract extends Contract {
  create_shipment: (args: { encrypted_data: string; proof: string }) => Promise<{ shipment_id: string }>;
  update_shipment_status: (args: { shipment_id: string; new_status: number; proof: string }) => Promise<void>;
  grant_access: (args: { shipment_id: string; party: string }) => Promise<void>;
  get_shipment: (args: { id: string }) => Promise<EncryptedShipment>;
  verify_proof: (args: { id: string; proof: string }) => Promise<{ valid: boolean }>;
}

export const useSuiviClair = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: [
      // Contract functions as defined in sdks.ts
    ],
  }) as { contract: SuiviClairContract | undefined };

  const createShipment = useCallback(async (shipmentData: ShipmentData) => {
    if (!contract) throw new Error('Contract not initialized');

    try {
      setLoading(true);
      setError(null);

      // Encrypt the shipment data
      const encryptedData = await encryptData(shipmentData);
      
      // Generate ZK proof
      const proof = await generateProof(shipmentData);

      // Call the contract
      const result = await contract.create_shipment({
        encrypted_data: encryptedData,
        proof
      });

      return result.shipment_id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create shipment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const updateShipmentStatus = useCallback(async (
    shipmentId: string,
    newStatus: number,
    shipmentData: ShipmentData
  ) => {
    if (!contract) throw new Error('Contract not initialized');

    try {
      setLoading(true);
      setError(null);

      // Generate new proof for status update
      const proof = await generateProof({
        ...shipmentData,
        timestamp: Date.now()
      });

      // Call the contract
      await contract.update_shipment_status({
        shipment_id: shipmentId,
        new_status: newStatus,
        proof
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update shipment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const grantAccess = useCallback(async (
    shipmentId: string,
    partyAddress: string
  ) => {
    if (!contract) throw new Error('Contract not initialized');

    try {
      setLoading(true);
      setError(null);

      await contract.grant_access({
        shipment_id: shipmentId,
        party: partyAddress
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to grant access');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const getShipment = useCallback(async (
    shipmentId: string
  ): Promise<{ shipment: EncryptedShipment; decryptedData: ShipmentData }> => {
    if (!contract) throw new Error('Contract not initialized');

    try {
      setLoading(true);
      setError(null);

      const encryptedShipment = await contract.get_shipment({
        id: shipmentId
      });
      
      const decryptedData = await decryptData(encryptedShipment.encrypted_data);

      return {
        shipment: encryptedShipment,
        decryptedData
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shipment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const verifyProof = useCallback(async (
    shipmentId: string,
    proof: string
  ): Promise<boolean> => {
    if (!contract) throw new Error('Contract not initialized');

    try {
      setLoading(true);
      setError(null);

      const result = await contract.verify_proof({
        id: shipmentId,
        proof
      });

      return result.valid;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify proof');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  return {
    loading,
    error,
    createShipment,
    updateShipmentStatus,
    grantAccess,
    getShipment,
    verifyProof
  };
};
