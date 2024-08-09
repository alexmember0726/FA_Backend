-- If Exists Table Drop
DROP TABLE IF EXISTS users CASCADE;

-- ================
--   TABLE [users]
-- ================
-- create users table
CREATE TABLE IF NOT EXISTS users (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITHOUT TIME ZONE
);

-- If Exists Table Drop
DROP TABLE IF EXISTS properties CASCADE;

-- ================
--   TABLE [properties]
-- ================
-- create properties table

CREATE TABLE IF NOT EXISTS properties (
    "id" SERIAL PRIMARY KEY,
    "userid" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "images" TEXT[] NOT NULL,
    "propertyType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "price" INT NOT NULL,
    "notes" TEXT NOT NULL,
    "lat" SERIAL NOT NULL,
    "additional_info" JSONB,
    "lotSize" : TEXT NOT NULL,
    "unit" : TEXT NOT NULL,
    "phoneNumber" : TEXT NOT NULL,
    "remodeled" : TEXT NOT NULL,
    "yearBuilt" : TEXT NOT NULL,
    "bedrooms" : TEXT NOT NULL,
    "bathrooms" : TEXT NOT NULL,
    "numberOfStories" : TEXT NOT NULL,
    "image_keys" : TEXT NOT NULL,
    "published" : TEXT NOT NULL,
    "customFields" : TEXT NOT NULL,
    "createdAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userid") REFERENCES users ("id")
);
