# Wayta | Order & Pay On-site - Development Blueprint

## 1. Tech Stack Recommendation
For a high-performance, low-latency mobile application operating in environments with potentially unstable connectivity (like festivals), I recommend the following stack:

*   **Mobile Framework:** **Flutter**. Its compiled performance is excellent for smooth animations, and it handles offline/low-connectivity states gracefully through local caching.
*   **Backend:** **Node.js (TypeScript)** with **NestJS**. This provides a robust, scalable architecture for real-time operations.
*   **Database:** **PostgreSQL** (via Supabase or AWS RDS) for relational integrity (orders, payments, users) + **Redis** for real-time order status and location caching.
*   **Real-time Communication:** **Socket.io** or **MQTT** for instant order updates and "Find my friends" live locations.
*   **Payments (South Africa):** 
    *   **Peach Payments** or **PayFast** for card and instant EFT processing.
    *   **Stitch (stitch.money)** for seamless API-based bank transfers in SA.
    *   **Apple/Google Pay** via the payment provider's SDK.
*   **Infrastructure:** **AWS (Cape Town Region)** to ensure the lowest possible latency for SA users.

---

## 2. Core Database Schema (Simplified)

### **Users**
- `id` (UUID)
- `name`, `email`, `phone`
- `budget_limit` (Decimal)
- `current_location` (Point/GeoJSON)

### **Venues**
- `id` (UUID)
- `name`, `type` (Club/Festival/Bar)
- `location` (Point)
- `is_active` (Boolean)

### **Products (Menu Items)**
- `id` (UUID)
- `venue_id` (FK)
- `name`, `price`, `category` (Drink/Food)
- `stock_status`

### **Orders**
- `id` (UUID)
- `user_id` (FK), `venue_id` (FK)
- `items` (JSONB)
- `total_amount` (Decimal)
- `status` (Received, Preparing, Ready, Collected)

### **Transactions**
- `id` (UUID)
- `order_id` (FK)
- `payment_gateway_ref` (String)
- `status` (Pending, Success, Failed)

---

## 3. User Flow (UX)
1.  **Discovery:** User opens Wayta -> Map/List view shows nearby clubs/festivals -> User selects "Madison Avenue".
2.  **Entrance:** User pays R100 cover charge via "Express Entry" -> Receives a dynamic QR code for the bouncer to scan.
3.  **Ordering:** User enters the venue -> Views digital menu -> Adds 2x Gin & Tonic to cart -> Checkout.
4.  **Payment & Budget Check:** App checks "Nightly Budget" -> Processes payment -> Order sent to bartender's tablet.
5.  **Social:** User taps "Friends" -> Sees "Sarah" is at the VIP Table 4 on the venue map.
6.  **Collection:** Push notification: "Order #42 is ready at the Main Bar!" -> User shows QR code -> Drinks collected.

---

## 4. MVP Roadmap (4 Sprints)

### **Sprint 1: Foundation & Discovery**
- Auth (Phone OTP).
- Venue/Event listing with geolocation.
- Basic Menu display (Static).

### **Sprint 2: Payments & Ticketing**
- Integration with Peach Payments/PayFast.
- Entrance ticket purchase & QR code generation.
- Backend logic for ticket validation.

### **Sprint 3: F&B Ordering & Live Status**
- Cart management & Checkout logic.
- Real-time order status updates via WebSockets.
- Bartender/Venue UI for order management.

### **Sprint 4: Social & Budgeting**
- "Find my Friends" via location sharing (Opt-in).
- Budget tracker dashboard & spending history.
- Performance optimization for low-signal environments.

---

## 5. Code Snippet - The Ordering Logic (Node.js/Express)

```javascript
// controllers/orderController.js
const processOrder = async (req, res) => {
    const { userId, venueId, items, totalAmount } = req.body;

    try {
        // 1. Fetch User & Budget
        const user = await db.User.findByPk(userId);
        
        // 2. Calculate Total Spent Tonight
        const todayStart = new Date().setHours(0,0,0,0);
        const spentTonight = await db.Order.sum('total_amount', {
            where: { userId, createdAt: { [Op.gte]: todayStart } }
        });

        // 3. Verify Budget Constraint
        if (user.budget_limit && (spentTonight + totalAmount > user.budget_limit)) {
            return res.status(403).json({ 
                error: "Budget Exceeded", 
                message: "This order exceeds your set nightly budget." 
            });
        }

        // 4. Create Order (Status: Received)
        const order = await db.Order.create({
            userId,
            venueId,
            items,
            total_amount: totalAmount,
            status: 'Received'
        });

        // 5. Deduct/Notify Payment Gateway (Pseudo-code)
        // const payment = await paymentGateway.charge(userId, totalAmount);

        res.status(201).json({ success: true, order });

    } catch (error) {
        res.status(500).json({ error: "Order failed", details: error.message });
    }
};
```
