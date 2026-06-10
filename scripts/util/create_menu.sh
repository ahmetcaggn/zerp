#!/bin/bash

# ==========================================
# Input Validation & Configuration
# ==========================================
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <SHOP_ID> <BEARER_TOKEN>"
    echo "Example: $0 123e4567-e89b-12d3-a456-426614174000 123e4567-e89b-12d3-a456-426614174000 eyJhbGciOi..."
    exit 1
fi

SHOP_ID=$1
MENU_ID=$2
TOKEN=$3
API_URL="https://api.zeerp.tech"

echo "Starting menu processing..."
echo "-----------------------------------"

MENU_FILE="menu.json"

if [ ! -f "$MENU_FILE" ]; then
    echo "Error: $MENU_FILE not found in the current directory."
    exit 1
fi

# 2. Parse JSON and orchestrate API calls
# Loop through each category
jq -c '.menu.categories[]' "$MENU_FILE" | while read -r category; do
    CAT_NAME=$(echo "$category" | jq -r '.title')
    CAT_DESC=$(echo "$category" | jq -r '.description')

    echo "Processing Category: $CAT_NAME"

    # POST /sale/menu-categories
    CAT_PAYLOAD=$(jq -n \
        --arg name "$CAT_NAME" \
        --arg desc "$CAT_DESC" \
        --arg menu "$MENU_ID" \
        '{name: $name, description: $desc, menuId: $menu}')

    CAT_RESPONSE=$(curl -s -X POST "$API_URL/sale/menu-categories" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "$CAT_PAYLOAD")

    CATEGORY_ID=$(echo "$CAT_RESPONSE" | jq -r '.data.id')

    if [ "$CATEGORY_ID" == "null" ]; then
        echo "  [!] Failed to create category. Response: $CAT_RESPONSE"
        continue
    fi

    echo "  -> Category created (ID: $CATEGORY_ID)"

    # Loop through each item within the category
    echo "$category" | jq -c '.items[]' | while read -r item; do
        ITEM_NAME=$(echo "$item" | jq -r '.title')
        ITEM_DESC=$(echo "$item" | jq -r '.description')
        ITEM_PRICE=$(echo "$item" | jq -r '.price_try')
        ITEM_CALORIES=$(echo "$item" | jq -r '.calories_kcal')

        # Extract the integer value from the prep_time string (e.g., "2 mins" -> 2)
        ITEM_PREP=$(echo "$item" | jq -r '.prep_time' | grep -o -E '[0-9]+' | head -n 1)
        [ -z "$ITEM_PREP" ] && ITEM_PREP=0

        INGREDIENTS=$(echo "$item" | jq -c '.ingredients')
        ALLERGENS=$(echo "$item" | jq -c '.allergens')

        # POST /sale/products
        PROD_PAYLOAD=$(jq -n \
            --arg name "$ITEM_NAME" \
            --arg desc "$ITEM_DESC" \
            --arg shop "$SHOP_ID" \
            --argjson prep "$ITEM_PREP" \
            '{name: $name, description: $desc, shopId: $shop, preparationTime: $prep, active: true}')

        PROD_RESPONSE=$(curl -s -X POST "$API_URL/sale/products" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$PROD_PAYLOAD")

        PRODUCT_ID=$(echo "$PROD_RESPONSE" | jq -r '.data.id')

        if [ "$PRODUCT_ID" == "null" ]; then
            echo "    [!] Failed to create product for $ITEM_NAME. Response: $PROD_RESPONSE"
            continue
        fi

        echo "    -> Product created: $ITEM_NAME (ID: $PRODUCT_ID)"

        # POST /sale/menu-items
        MENU_ITEM_PAYLOAD=$(jq -n \
            --arg name "$ITEM_NAME" \
            --arg desc "$ITEM_DESC" \
            --argjson price "$ITEM_PRICE" \
            --argjson cal "$ITEM_CALORIES" \
            --argjson ing "$INGREDIENTS" \
            --argjson alg "$ALLERGENS" \
            --arg catId "$CATEGORY_ID" \
            --arg prodId "$PRODUCT_ID" \
            '{
                name: $name,
                description: $desc,
                price: $price,
                calories: $cal,
                ingredients: $ing,
                allergens: $alg,
                categoryId: $catId,
                productItems: [{productId: $prodId, quantity: 1}]
            }')

        MENU_ITEM_RESPONSE=$(curl -s -X POST "$API_URL/sale/menu-items" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$MENU_ITEM_PAYLOAD")

        MENU_ITEM_ID=$(echo "$MENU_ITEM_RESPONSE" | jq -r '.data.id')

        if [ "$MENU_ITEM_ID" == "null" ]; then
            echo "      [!] Failed to create Menu Item. Response: $MENU_ITEM_RESPONSE"
        else
            echo "      -> Menu Item linked and created (ID: $MENU_ITEM_ID)"
        fi
    done
done

echo "-----------------------------------"
echo "Menu ingestion complete."
