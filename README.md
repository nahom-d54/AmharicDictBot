# Amharic Dictionary

Welcome to the Amharic Dictionary project! This project aims to create a comprehensive and user-friendly dictionary for the Amharic language.

## Features

- **Search Functionality**: Quickly find the meaning of Amharic words.

## Installation

To install and run the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/nahom-d54/AmharicDict.git
   ```
2. Navigate to the project directory:
   ```bash
   cd AmharicDict
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm start
   ```

## Docker

Run the bot and MongoDB together using Docker Compose.

1. Copy the example env and set your Telegram token:
   ```powershell
   Copy-Item .env.example .env
   notepad .env
   ```
2. Build and start in the background:
   ```powershell
   docker compose up -d --build
   ```
3. Check service health:
   ```powershell
   docker compose ps
   docker compose logs -f app
   ```
4. Stop:
   ```powershell
   docker compose down
   ```

Notes:
- App is available on http://localhost:3000/ (returns { status: "ok" }).
- MongoDB data is persisted in a Docker volume named `mongo-data`.
- Environment variables are read from `.env`. Compose sets `MONGODB_URI` to the internal `mongodb` service by default; you can override in `.env`.
- The container runs as a non-root user and includes healthchecks for both the app and MongoDB.


## Contributing

We welcome contributions from the community! To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch to your fork.
4. Create a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any questions or suggestions, please open an issue or contact us at [nahom@nahom.eu.org)](mailto:nahom@nahom.eu.org).

Thank you for using the Amharic Dictionary!
