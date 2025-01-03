use calimero_sdk::borsh::{BorshDeserialize, BorshSerialize};
use calimero_sdk::serde::Serialize;
use calimero_sdk::{app, env};
use calimero_storage;

#[app::state]
#[derive(BorshDeserialize, BorshSerialize, Default)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct ShipmentTracker {
    shipments: Vec<Shipment>,
}

#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
#[borsh(crate = "calimero_sdk::borsh")]
#[serde(crate = "calimero_sdk::serde")]
pub struct Shipment {
    id: usize,
    product_name: String,
    product_description: String,
    location_origin: String,
    location_destination: String,
    status: String,
}

#[app::event]
#[derive(BorshSerialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub enum Event<'a> {
    ShipmentCreated {
        id: usize,
        product_name: &'a str,
        location_origin: &'a str,
        location_destination: &'a str,
    },
    ShipmentTracked {
        id: usize,
        current_status: &'a str,
    },
}

#[app::logic]
impl ShipmentTracker {
    #[app::init]
    pub fn init() -> Self {
        Self::default()
    }

    pub fn create_shipment(
        &mut self,
        product_name: String,
        product_description: String,
        location_origin: String,
        location_destination: String,
    ) -> &Shipment {
        env::log(&format!(
            "Creating shipment for product: {:?} from {:?} to {:?}",
            product_name, location_origin, location_destination
        ));

        app::emit!(Event::ShipmentCreated {
            id: self.shipments.len(),
            product_name: &product_name,
            location_origin: &location_origin,
            location_destination: &location_destination,
        });

        self.shipments.push(Shipment {
            id: self.shipments.len(),
            product_name,
            product_description,
            location_origin,
            location_destination,
            status: "Created".to_string(),
        });

        self.shipments.last().unwrap()
    }

    pub fn track_shipment(&self, id: usize) -> Option<&Shipment> {
        env::log(&format!("Tracking shipment with id: {:?}", id));

        let shipment = self.shipments.get(id)?;
        
        app::emit!(Event::ShipmentTracked {
            id,
            current_status: &shipment.status,
        });

        Some(shipment)
    }

    pub fn get_all_shipments(&self) -> &[Shipment] {
        env::log("Getting all shipments");
        &self.shipments
    }
}