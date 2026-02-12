
const BASE_URL = "http://localhost:3000/api/BusBooking";

const verify = async () => {
    try {
        console.log("Starting verification...");

        // 1. Create User
        console.log("Creating User...");
        const userRes = await fetch(`${BASE_URL}/AddNewUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Test User",
                email: `test${Date.now()}@example.com`,
                password: "password123",
                phone: "1234567890",
                role: "USER"
            })
        });
        const user = await userRes.json();
        console.log("User Created:", user._id);

        // 2. Create Vendor
        console.log("Creating Vendor...");
        const vendorRes = await fetch(`${BASE_URL}/CreateVendor`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Test Vendor",
                email: "vendor@example.com",
                phone: "9876543210",
                address: "Vendor HQ"
            })
        });
        const vendor = await vendorRes.json();
        console.log("Vendor Created:", vendor._id);

        // 3. Create Locations
        console.log("Creating Locations...");
        const loc1Res = await fetch(`${BASE_URL}/PostBusLocation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ city: "City A", state: "State A", address: "Station A" })
        });
        const loc1 = await loc1Res.json();

        const loc2Res = await fetch(`${BASE_URL}/PostBusLocation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ city: "City B", state: "State B", address: "Station B" })
        });
        const loc2 = await loc2Res.json();
        console.log("Locations Created:", loc1._id, loc2._id);

        // 4. Create Schedule
        console.log("Creating Schedule...");
        const scheduleRes = await fetch(`${BASE_URL}/PostBusSchedule`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                busName: "Super Bus",
                vendorId: vendor._id,
                sourceLocation: loc1._id,
                destinationLocation: loc2._id,
                departureTime: new Date(),
                arrivalTime: new Date(Date.now() + 3600000),
                price: 50,
                scheduleDate: new Date()
            })
        });
        const schedule = await scheduleRes.json();
        console.log("Schedule Created:", schedule._id);

        // 5. Search Bus
        console.log("Searching Bus...");
        const searchRes = await fetch(`${BASE_URL}/searchBus?sourceId=${loc1._id}&destinationId=${loc2._id}&date=${new Date().toISOString()}`);
        const foundBuses = await searchRes.json();
        console.log("Buses Found:", foundBuses.length);

        // 6. Create Booking
        console.log("Creating Booking...");
        const bookingRes = await fetch(`${BASE_URL}/PostBusBooking`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user._id,
                scheduleId: schedule._id,
                seatNumbers: [1, 2],
                totalAmount: 100
            })
        });
        const booking = await bookingRes.json();
        console.log("Booking Created:", booking._id);

        console.log("Verification Complete!");
    } catch (error) {
        console.error("Verification failed:", error);
    }
};

verify();
