# Wayta Technical Architecture & High-Concurrency Strategy

## 1. Resilience & Offline-First Principles
In high-density environments like festivals, the network is the primary failure point.
- **Optimistic UI Updates:** Actions like 'Add to Cart' or 'Check-in' occur locally first.
- **Background Synchronization:** Use local storage (SQLite/Hive) to queue requests and retry with exponential backoff.
- **Data-Light Payloads:** Protobuf or highly minified JSON for API communication to minimize bytes over the wire.

## 2. Database Rigor & Race Condition Handling
To prevent double-booking or over-ordering in high-concurrency scenarios:

### Indexes
- `idx_venues_location`: GIST index for fast spatial queries.
- `idx_orders_user_created`: B-tree for fast spend history retrieval.
- `idx_tables_venue_status`: Filtered index for available VIP tables.

### Concurrency Strategy: VIP Table Booking
We utilize **Pessimistic Locking** at the database level to prevent double-booking:
```sql
BEGIN;
-- Select the table for update to lock the row
SELECT * FROM tables 
WHERE id = 'table_uuid' AND status = 'available' 
FOR UPDATE;

-- If rows returned, proceed with booking
INSERT INTO bookings (...) VALUES (...);
UPDATE tables SET status = 'reserved' WHERE id = 'table_uuid';
COMMIT;
```

## 3. South African Compliance (POPIA)
- **Data Locality:** AWS Cape Town region (af-south-1).
- **Consent Management:** Explicit opt-ins for location sharing and marketing.
- **Security:** AES-256 encryption at rest for PII.

## 4. Payment Gateway Integration Logic
Modular adapter pattern to switch between PayFast, Peach Payments, or Stitch based on transaction type or user preference.
