# Suivi-Clair

A decentralized application built with Starknet smart contracts and React frontend.

## Project Structure

```
├── frontend/          # React + Vite frontend application with TailwindCSS
│   ├── src/          # React components and assets
│   └── ...           # Configuration files
└── smart_contracts/  # Starknet smart contracts using Cairo
    ├── src/         # Contract source files
    └── ...          # Contract tests and configuration
```

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or later)
- npm or yarn
- Rust (for Starknet development)

### Installing Starknet Foundry

1. Install Rust:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. Install Scarb:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/software-mansion/scarb/main/install.sh | sh
```

3. Install Starknet Foundry:
```bash
curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/scripts/install.sh | sh
```

## Getting Started

### Frontend Development

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

The frontend is built with:
- React + Vite for fast development
- TailwindCSS for styling
- Starknet.js for blockchain interactions (to be added)

### Smart Contract Development

1. Build contracts:
```bash
cd smart_contracts
scarb build
```

2. Run tests (requires Starknet Foundry):
```bash
snforge test
```

Smart Contracts are built with:
- Cairo language
- Starknet Foundry for testing and deployment
- Scarb for package management

## Development Workflow

1. Start the frontend development server
2. Make changes to the smart contracts
3. Test your changes with Starknet Foundry
4. Build and deploy contracts as needed
5. Update frontend to interact with new contract features

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
