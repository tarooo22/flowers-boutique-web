-- Add userId and delivery fields to orders table for authenticated customer orders

-- Add userId (nullable for guest orders)
ALTER TABLE orders ADD COLUMN userId INT NULL AFTER id;

-- Add delivery details
ALTER TABLE orders ADD COLUMN recipientName VARCHAR(255) AFTER notes;
ALTER TABLE orders ADD COLUMN recipientPhone VARCHAR(20) AFTER recipientName;
ALTER TABLE orders ADD COLUMN deliveryAddress TEXT AFTER recipientPhone;
ALTER TABLE orders ADD COLUMN latitude DECIMAL(10, 6) AFTER deliveryAddress;
ALTER TABLE orders ADD COLUMN longitude DECIMAL(10, 6) AFTER latitude;
ALTER TABLE orders ADD COLUMN placeId VARCHAR(255) AFTER longitude;
ALTER TABLE orders ADD COLUMN building VARCHAR(50) AFTER placeId;
ALTER TABLE orders ADD COLUMN entrance VARCHAR(50) AFTER building;
ALTER TABLE orders ADD COLUMN floor VARCHAR(50) AFTER entrance;
ALTER TABLE orders ADD COLUMN apartment VARCHAR(50) AFTER floor;
ALTER TABLE orders ADD COLUMN deliveryDate VARCHAR(20) AFTER apartment;
ALTER TABLE orders ADD COLUMN deliveryTime VARCHAR(20) AFTER deliveryDate;
ALTER TABLE orders ADD COLUMN giftMessage TEXT AFTER deliveryTime;
ALTER TABLE orders ADD COLUMN courierNotes TEXT AFTER giftMessage;

-- Add payment and delivery status tracking
ALTER TABLE orders MODIFY COLUMN orderChannel ENUM('whatsapp', 'messenger', 'phone', 'email', 'card') DEFAULT 'whatsapp';
ALTER TABLE orders ADD COLUMN paymentMethod ENUM('cash', 'card', 'bank_transfer', 'whatsapp', 'messenger') DEFAULT 'cash' AFTER orderChannel;
ALTER TABLE orders ADD COLUMN paymentStatus ENUM('pending', 'paid', 'failed', 'cancelled', 'refunded') DEFAULT 'pending' AFTER paymentMethod;
ALTER TABLE orders ADD COLUMN deliveryStatus ENUM('new', 'awaiting_confirmation', 'processing', 'preparing', 'courier', 'delivered', 'cancelled') DEFAULT 'new' AFTER paymentStatus;

-- Add BOG payment references
ALTER TABLE orders ADD COLUMN bogOrderId VARCHAR(255) AFTER deliveryStatus;
ALTER TABLE orders ADD COLUMN bogTransactionId VARCHAR(255) AFTER bogOrderId;
ALTER TABLE orders ADD COLUMN bogPaymentStatus VARCHAR(50) AFTER bogTransactionId;
ALTER TABLE orders ADD COLUMN bogCallbackReceived BOOLEAN DEFAULT FALSE AFTER bogPaymentStatus;
ALTER TABLE orders ADD COLUMN bogPaymentDate TIMESTAMP NULL AFTER bogCallbackReceived;

-- Create index on userId for efficient profile queries
CREATE INDEX idx_orders_userId ON orders(userId);

-- Create index on createdAt for sorting
CREATE INDEX idx_orders_createdAt ON orders(createdAt DESC);

-- Create composite index for user orders
CREATE INDEX idx_orders_userId_createdAt ON orders(userId, createdAt DESC);
