# Bank of Georgia integration pending

Card payments are intentionally disabled. Do not enable the create-order,
callback, or reconciliation paths until the merchant configuration and the
official request/response contract have been validated in a disposable or
sandbox environment.

Future non-secret requirements:

- Production Client ID
- Production Client Secret
- BOG public key
- Merchant and settlement-account configuration
- HTTPS callback URL
- HTTPS success URL
- HTTPS failure URL
- Enabled payment methods
- Official signed callback fixture
- Receipt reconciliation integration test

Never commit credential values or production callback payloads to the
repository.
