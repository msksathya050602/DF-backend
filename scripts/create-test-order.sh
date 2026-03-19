#!/usr/bin/env bash
# Create one test order based on entities: Category (Hotel, Household), Customer, Branch,
# Product (Shirt, Pant, T-shirt), Service (Washing, Iron only, Wash & Iron), Pricing, Order.
# Requires: curl, jq. Backend must be running at http://localhost:5001
set -e
BASE="http://localhost:5001/v1"

echo "1. Login..."
LOGIN=$(curl -s -X POST "$BASE/login" -H "Content-Type: application/json" \
  -d '{"email":"msks.sathiya@gmail.com","password":"Sathiya@0506"}')
TOKEN=$(echo "$LOGIN" | jq -r '.accessToken')
if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "Login failed. Response: $LOGIN"
  exit 1
fi
AUTH="Authorization: Bearer $TOKEN"

UNIQUE_SUFFIX=$(date +%s)

echo "2. Ensure categories (entity: Hotel/HOTEL, Household/HOUSEHOLD)..."
CATEGORIES=$(curl -s -X GET "$BASE/categories" -H "$AUTH")
HOTEL_ID=$(echo "$CATEGORIES" | jq -r '.categories[] | select(.categoryCode=="HOTEL") | .id')
HOUSEHOLD_ID=$(echo "$CATEGORIES" | jq -r '.categories[] | select(.categoryCode=="HOUSEHOLD") | .id')
if [ -z "$HOTEL_ID" ] || [ "$HOTEL_ID" = "null" ]; then
  R=$(curl -s -X POST "$BASE/categories" -H "Content-Type: application/json" -H "$AUTH" \
    -d '{"categoryName":"Hotel","categoryCode":"HOTEL"}')
  HOTEL_ID=$(echo "$R" | jq -r '.category.id')
  echo "   Created Hotel (HOTEL) id=$HOTEL_ID"
else
  echo "   Using existing Hotel (HOTEL) id=$HOTEL_ID"
fi
if [ -z "$HOUSEHOLD_ID" ] || [ "$HOUSEHOLD_ID" = "null" ]; then
  R=$(curl -s -X POST "$BASE/categories" -H "Content-Type: application/json" -H "$AUTH" \
    -d '{"categoryName":"Household","categoryCode":"HOUSEHOLD"}')
  HOUSEHOLD_ID=$(echo "$R" | jq -r '.category.id')
  echo "   Created Household (HOUSEHOLD) id=$HOUSEHOLD_ID"
else
  echo "   Using existing Household (HOUSEHOLD) id=$HOUSEHOLD_ID"
fi

echo "3. Create customer..."
CUSTOMER=$(curl -s -X POST "$BASE/customers" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"firstName\":\"Test\",\"lastName\":\"User\",\"customerPhone\":\"9876543210\",\"customerEmail\":\"test.order+${UNIQUE_SUFFIX}@example.com\"}")
CUSTOMER_ID=$(echo "$CUSTOMER" | jq -r '.customer.id')
if [ "$CUSTOMER_ID" = "null" ] || [ -z "$CUSTOMER_ID" ]; then
  echo "Create customer failed. Response: $CUSTOMER"
  exit 1
fi
echo "   customerId: $CUSTOMER_ID"

echo "4. Create branch..."
BRANCH=$(curl -s -X POST "$BASE/branches" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"branchName\":\"Test Branch\",\"branchAddress\":\"456 Test St\",\"branchPhone\":\"0123456789\"}")
BRANCH_ID=$(echo "$BRANCH" | jq -r '.branch.id')
if [ "$BRANCH_ID" = "null" ] || [ -z "$BRANCH_ID" ]; then
  echo "Create branch failed. Response: $BRANCH"
  exit 1
fi
echo "   branchId: $BRANCH_ID"

echo "5. Create products (Shirt=Household, Pant=Hotel, T-shirt=Household)..."
SHIRT=$(curl -s -X POST "$BASE/products" -H "Content-Type: application/json" \
  -d "{\"categoryId\":\"$HOUSEHOLD_ID\",\"productName\":\"Shirt\",\"productCode\":\"SHIRT-TEST-${UNIQUE_SUFFIX}\"}")
SHIRT_ID=$(echo "$SHIRT" | jq -r '.product.id')
PANT=$(curl -s -X POST "$BASE/products" -H "Content-Type: application/json" \
  -d "{\"categoryId\":\"$HOTEL_ID\",\"productName\":\"Pant\",\"productCode\":\"PANT-TEST-${UNIQUE_SUFFIX}\"}")
PANT_ID=$(echo "$PANT" | jq -r '.product.id')
TSHIRT=$(curl -s -X POST "$BASE/products" -H "Content-Type: application/json" \
  -d "{\"categoryId\":\"$HOUSEHOLD_ID\",\"productName\":\"T-shirt\",\"productCode\":\"TSHIRT-TEST-${UNIQUE_SUFFIX}\"}")
TSHIRT_ID=$(echo "$TSHIRT" | jq -r '.product.id')
if [ "$SHIRT_ID" = "null" ] || [ -z "$SHIRT_ID" ] || [ "$PANT_ID" = "null" ] || [ -z "$PANT_ID" ] || [ "$TSHIRT_ID" = "null" ] || [ -z "$TSHIRT_ID" ]; then
  echo "Create products failed. Shirt=$SHIRT_ID Pant=$PANT_ID T-shirt=$TSHIRT_ID"
  exit 1
fi
echo "   Shirt=$SHIRT_ID, Pant=$PANT_ID, T-shirt=$TSHIRT_ID"

echo "6. Create services (Washing, Iron only, Wash & Iron)..."
SVC_WASH=$(curl -s -X POST "$BASE/services" -H "Content-Type: application/json" \
  -d "{\"serviceName\":\"Washing TEST-${UNIQUE_SUFFIX}\",\"serviceCode\":\"WASH-TEST-${UNIQUE_SUFFIX}\"}")
SVC_WASH_ID=$(echo "$SVC_WASH" | jq -r '.service.id')
SVC_IRON=$(curl -s -X POST "$BASE/services" -H "Content-Type: application/json" \
  -d "{\"serviceName\":\"Iron only TEST-${UNIQUE_SUFFIX}\",\"serviceCode\":\"IRON-TEST-${UNIQUE_SUFFIX}\"}")
SVC_IRON_ID=$(echo "$SVC_IRON" | jq -r '.service.id')
SVC_BOTH=$(curl -s -X POST "$BASE/services" -H "Content-Type: application/json" \
  -d "{\"serviceName\":\"Wash & Iron TEST-${UNIQUE_SUFFIX}\",\"serviceCode\":\"WASH-IRON-TEST-${UNIQUE_SUFFIX}\"}")
SVC_BOTH_ID=$(echo "$SVC_BOTH" | jq -r '.service.id')
if [ "$SVC_WASH_ID" = "null" ] || [ -z "$SVC_WASH_ID" ] || [ "$SVC_IRON_ID" = "null" ] || [ -z "$SVC_IRON_ID" ] || [ "$SVC_BOTH_ID" = "null" ] || [ -z "$SVC_BOTH_ID" ]; then
  echo "Create services failed. Washing: $SVC_WASH | Iron: $SVC_IRON | Both: $SVC_BOTH"
  exit 1
fi
echo "   Washing, Iron only, Wash & Iron"

echo "7. Create pricing (Shirt+Wash, Pant+Iron, T-shirt+Wash & Iron)..."
curl -s -X POST "$BASE/pricing" -H "Content-Type: application/json" \
  -d "{\"productId\":\"$SHIRT_ID\",\"serviceId\":\"$SVC_WASH_ID\",\"price\":40.00,\"currency\":\"INR\"}" > /dev/null
curl -s -X POST "$BASE/pricing" -H "Content-Type: application/json" \
  -d "{\"productId\":\"$PANT_ID\",\"serviceId\":\"$SVC_IRON_ID\",\"price\":30.00,\"currency\":\"INR\"}" > /dev/null
curl -s -X POST "$BASE/pricing" -H "Content-Type: application/json" \
  -d "{\"productId\":\"$TSHIRT_ID\",\"serviceId\":\"$SVC_BOTH_ID\",\"price\":50.00,\"currency\":\"INR\"}" > /dev/null
echo "   Done"

echo "8. Create test order (Order entity: customerId, branchId, items[])..."
ORDER_BODY=$(jq -n \
  --arg cid "$CUSTOMER_ID" \
  --arg bid "$BRANCH_ID" \
  --arg shirt "$SHIRT_ID" \
  --arg pant "$PANT_ID" \
  --arg tshirt "$TSHIRT_ID" \
  --arg wash "$SVC_WASH_ID" \
  --arg iron "$SVC_IRON_ID" \
  --arg both "$SVC_BOTH_ID" \
  '{customerId: $cid, branchId: $bid, items: [
    {productId: $shirt, serviceId: $wash, quantity: 1},
    {productId: $pant, serviceId: $iron, quantity: 1},
    {productId: $tshirt, serviceId: $both, quantity: 1}
  ], discountAmount: 0, taxAmount: 0}')
ORDER=$(curl -s -X POST "$BASE/orders" -H "Content-Type: application/json" -d "$ORDER_BODY")
ORDER_ID=$(echo "$ORDER" | jq -r '.order.id')
if [ "$ORDER_ID" = "null" ] || [ -z "$ORDER_ID" ]; then
  echo "Create order failed. Response: $ORDER"
  exit 1
fi

echo ""
echo "Test order created: $ORDER_ID"
echo "$ORDER" | jq '.'
