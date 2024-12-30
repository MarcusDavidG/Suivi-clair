// This interface allows modification and retrieval of the contract.
#[starknet::interface]
pub trait ISuiviClair<TContractState> {
    /// Create shipment
    fn create_shipment(
        ref self: TContractState,
        product_name: ByteArray,
        product_description: ByteArray,
        location_origin: ByteArray,
        location_destination: ByteArray,
    );
    fn track_shipment(ref self: TContractState, shipment_id: felt252) -> Shipment;
}

#[derive(Drop, Serde, starknet::Store)]
pub struct Shipment {
    product_name: ByteArray,
    product_description: ByteArray,
    location_origin: ByteArray,
    location_destination: ByteArray,
}


#[starknet::contract]
mod SuiviClair {
    use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess, Map};
    use starknet::storage::StoragePathEntry;
    use super::Shipment;


    #[storage]
    struct Storage {
        product_name: ByteArray,
        product_description: ByteArray,
        location_origin: ByteArray,
        location_destination: ByteArray,
        shipments: Map<felt252, Shipment>,// Map shipment ID to shipment details
        shipment_id: felt252,
    }

    #[abi(embed_v0)]
    impl SuiviClairImpl of super::ISuiviClair<ContractState> {
        fn create_shipment(
            ref self: ContractState,
            product_name: ByteArray,
            product_description: ByteArray,
            location_origin: ByteArray,
            location_destination: ByteArray,
        ) {
            let shipment = Shipment {
                product_name, product_description, location_origin, location_destination,
            };
            // Store the shipment in the mapping.
            
            self.shipments.entry(self.shipment_id.read() + 1 ).write(shipment);
        }


        // Track a shipment by its ID.
        fn track_shipment(ref self: ContractState, shipment_id: felt252) ->  Shipment{
            // Retrieve the shipment from storage.
            let shipment: Shipment = self.shipments.entry(shipment_id).read();
            return shipment;
        }
    }
}