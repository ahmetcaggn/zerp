#!/bin/bash

# ==========================================
# Input Validation & Configuration
# ==========================================
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <SHOP_ID> <BEARER_TOKEN>"
    echo "Example: $0 123e4567-e89b-12d3-a456-426614174000 eyJhbGciOi..."
    exit 1
fi

SHOP_ID=$1
TOKEN=$2
API_URL="https://api.zeerp.tech"

# Default table settings
DEFAULT_CAPACITY=4
DEFAULT_FLOOR=1
DEFAULT_STATUS="AVAILABLE"

# Function to create a table
create_table() {
    local name=$1
    local desc=$2

    PAYLOAD=$(jq -n \
        --arg name "$name" \
        --arg desc "$desc" \
        --argjson cap "$DEFAULT_CAPACITY" \
        --argjson floor "$DEFAULT_FLOOR" \
        --arg status "$DEFAULT_STATUS" \
        --arg shopId "$SHOP_ID" \
        '{
            name: $name,
            description: $desc,
            capacity: $cap,
            floor: $floor,
            status: $status,
            shopId: $shopId
        }')

    RESPONSE=$(curl -s -X POST "$API_URL/sale/tables" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "$PAYLOAD")

    TABLE_ID=$(echo "$RESPONSE" | jq -r '.data.id')

    if [ "$TABLE_ID" == "null" ] || [ -z "$TABLE_ID" ]; then
        echo "  [!] Failed to create table $name. Response: $RESPONSE"
    else
        echo "  -> Table created: $name (ID: $TABLE_ID)"
    fi
}

# 3. Create I1 to I25 (Indoor Tables)
echo "Creating 25 'I' Tables..."
for i in {1..25}; do
    num=$(printf "%02d" $i)
    create_table "I$num" "Indoor Table $num"
done

echo "------------------------------------------------------------"

# 4. Create O1 to O20 (Outdoor Tables)
echo "Creating 20 'O' Tables..."
for i in {1..20}; do
    num=$(printf "%02d" $i)
    create_table "O$num" "Outdoor Table $num"
done

echo "------------------------------------------------------------"
echo "All 45 tables processed successfully."

