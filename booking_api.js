const express = require('express');
const app = express();
const PORT = 3000;
const LOCK_DURATION_MS = 60 * 1000; // 1 minute lock duration

app.use(express.json());

// --- In-Memory State Management ---

/**
 * Seat Status Key:
 * 'available' (default)
 * 'locked' (temporarily reserved)
 * 'booked' (permanently reserved)
 */
const seats = {
    // Using numeric IDs '1' through '5' to match the screenshots
    '1': { status: 'available', lockedBy: null, lockExpires: null },
    '2': { status: 'available', lockedBy: null, lockExpires: null },
    '3': { status: 'available', lockedBy: null, lockExpires: null },
    '4': { status: 'available', lockedBy: null, lockExpires: null },
    '5': { status: 'available', lockedBy: null, lockExpires: null },
};

// --- Helper Functions ---

/**
 * Helper function to check and clear expired locks.
 */
const refreshSeatStatus = (seatId) => {
    const seat = seats[seatId];
    if (seat && seat.status === 'locked' && seat.lockExpires < Date.now()) {
        console.log(`Lock expired for seat ${seatId}. Clearing lock.`);
        seat.status = 'available';
        seat.lockedBy = null;
        seat.lockExpires = null;
    }
};

/**
 * Middleware to check and refresh all seat locks before any request.
 */
app.use((req, res, next) => {
    Object.keys(seats).forEach(refreshSeatStatus);
    next();
});

// --- API Endpoints ---

// 1. GET /seats - View available and booked seats
app.get('/seats', (req, res) => {
    const seatStatus = {};
    for (const id in seats) {
        seatStatus[id] = {
            status: seats[id].status
        };
    }
    // Expected Status: 200 OK
    res.status(200).json(seatStatus);
});

// 2. POST /lock/:id - Temporarily lock a seat
// NOTE: We must simulate the 'userId' since it's not provided in the URL or Body based on the screenshot.
// In a real system, the userId would come from an authentication header or request body.
app.post('/lock/:seatId', (req, res) => {
    const seatId = req.params.seatId;
    const userId = 'SimulatedUser'; // Placeholder User ID for simple testing

    const seat = seats[seatId];
    if (!seat) {
        return res.status(404).json({ message: `Seat ${seatId} not found.` });
    }

    if (seat.status === 'booked') {
        return res.status(409).json({ message: `Seat ${seatId} is already permanently booked.` });
    }
    
    if (seat.status === 'locked') {
        if (seat.lockedBy === userId) {
             return res.status(200).json({ message: `Seat ${seatId} is already locked by you. Lock refreshed.` });
        }
        return res.status(409).json({ message: `Seat ${seatId} is already locked by another user.` });
    }

    // Success: Apply Lock
    seat.status = 'locked';
    seat.lockedBy = userId;
    seat.lockExpires = Date.now() + LOCK_DURATION_MS;

    // Expected Status: 200 OK
    res.status(200).json({ 
        message: `Seat ${seatId} locked successfully. Confirm within 1 minute.`
    });
});

// 3. POST /confirm/:id - Confirm the locked seat to permanent booking
app.post('/confirm/:seatId', (req, res) => {
    const seatId = req.params.seatId;
    const userId = 'SimulatedUser'; // Placeholder User ID must match the one used for locking

    const seat = seats[seatId];
    if (!seat) {
        return res.status(404).json({ message: `Seat ${seatId} not found.` });
    }

    // Check if the seat is locked by this user
    if (seat.status !== 'locked' || seat.lockedBy !== userId) {
        // Expected Status: 400 Bad Request
        return res.status(400).json({ 
            message: 'Seat is not locked and cannot be booked' 
        });
    }

    // Success: Confirm Booking
    seat.status = 'booked';
    seat.lockedBy = null;
    seat.lockExpires = null;
    
    // Expected Status: 200 OK (to match the screenshot)
    res.status(200).json({ 
        message: `Seat ${seatId} booked successfully!`
    });
});

// --- Server Startup ---

app.listen(PORT, () => {
    console.log(`\n🎉 Booking System API is running on http://localhost:${PORT}`);
    console.log('Endpoints:');
    console.log('GET /seats');
    console.log('POST /lock/:id');
    console.log('POST /confirm/:id\n');
});