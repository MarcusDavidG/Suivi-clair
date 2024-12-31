import { type Address } from 'viem'

export const BLOCKROUTE_ADDRESS = '0xa4e64aabcae48a5f4c45d84dd2493b9fb3f81d84' as const

export enum ShipmentStatus {
  Created,
  QualityChecked,
  InTransit,
  Delayed,
  Disputed,
  ResolvingDispute,
  Delivered,
  Rejected,
  Cancelled
}

export interface Location {
  latitude: string
  longitude: string
  name: string
  timestamp: bigint
  updatedBy: Address
}

export interface Shipment {
  id: bigint
  productName: string
  description: string
  manufacturer: Address
  supplier: Address
  carrier: Address
  receiver: Address
  origin: Location
  destination: Location
  estimatedDeliveryDate: bigint
  status: ShipmentStatus
}

export const BLOCKROUTE_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "productName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "supplier",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "carrier",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "latitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "longitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "updatedBy",
            "type": "address"
          }
        ],
        "internalType": "struct BlockRoute.Location",
        "name": "origin",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "latitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "longitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "updatedBy",
            "type": "address"
          }
        ],
        "internalType": "struct BlockRoute.Location",
        "name": "destination",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "estimatedDeliveryDate",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isTemperatureSensitive",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isHumiditySensitive",
        "type": "bool"
      },
      {
        "internalType": "bytes32",
        "name": "documentsHash",
        "type": "bytes32"
      }
    ],
    "name": "createShipment",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "shipmentId",
        "type": "uint256"
      }
    ],
    "name": "getShipment",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "productName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "manufacturer",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "supplier",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "carrier",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "latitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "longitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "updatedBy",
            "type": "address"
          }
        ],
        "internalType": "struct BlockRoute.Location",
        "name": "origin",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "latitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "longitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "updatedBy",
            "type": "address"
          }
        ],
        "internalType": "struct BlockRoute.Location",
        "name": "destination",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "estimatedDeliveryDate",
        "type": "uint256"
      },
      {
        "internalType": "enum BlockRoute.ShipmentStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalShipments",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "shipmentId",
        "type": "uint256"
      }
    ],
    "name": "getTransitHistory",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "latitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "longitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "updatedBy",
            "type": "address"
          }
        ],
        "internalType": "struct BlockRoute.Location[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "shipmentId",
        "type": "uint256"
      },
      {
        "internalType": "enum BlockRoute.ShipmentStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "notes",
        "type": "string"
      }
    ],
    "name": "updateShipmentStatus",
    "outputs": [],
    "state_mutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "shipmentId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "temperature",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "humidity",
        "type": "uint256"
      }
    ],
    "name": "updateTemperatureAndHumidity",
    "outputs": [],
    "state_mutability": "nonpayable",
    "type": "function"
  }
] as const;

export const SUIVICLAIR_ADDRESS = '0x05770edb03346b7d7d2db42c31b3046cb26dde222ee62f8152da75fb0b872473' as const;

export const SUIVICLAIR_ABI = [
  {
    "name": "SuiviClairImpl",
    "type": "impl",
    "interface_name": "suiviclair::ISuiviClair"
  },
  {
    "name": "core::byte_array::ByteArray",
    "type": "struct",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>"
      },
      {
        "name": "pending_word",
        "type": "core::felt252"
      },
      {
        "name": "pending_word_len",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "name": "suiviclair::Shipment",
    "type": "struct",
    "members": [
      {
        "name": "product_name",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "product_description",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "location_origin",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "location_destination",
        "type": "core::byte_array::ByteArray"
      }
    ]
  },
  {
    "name": "suiviclair::ISuiviClair",
    "type": "interface",
    "items": [
      {
        "name": "create_shipment",
        "type": "function",
        "inputs": [
          {
            "name": "product_name",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "product_description",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "location_origin",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "location_destination",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "track_shipment",
        "type": "function",
        "inputs": [
          {
            "name": "shipment_id",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "suiviclair::Shipment"
          }
        ],
        "state_mutability": "external"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "suiviclair::SuiviClair::Event",
    "type": "event",
    "variants": []
  }
] as const;
