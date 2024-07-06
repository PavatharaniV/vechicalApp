const Entry = require('../models/entry');
const User = require('../models/user');

const createEntry = async (req, res) => {
    const { vehicleNumber, userId } = req.body; // Assuming userId is passed from the request body

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newEntry = new Entry({
            vehicleNumber,
            user: userId
        });

        await newEntry.save();

        console.log(newEntry);

        res.status(201).json(newEntry);
    } catch (error) {
        console.error('Error creating entry:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

const getEntriesByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const entries = await Entry.find({ user: userId });

        if (!entries || entries.length === 0) {
            return res.status(404).json({ error: 'No entries found for this user' });
        }

        res.status(200).json(entries);
    } catch (error) {
        console.error('Error fetching entries:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

const exitEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const entry = await Entry.findById(id);
        
        if (!entry) {
            return res.status(404).send({ message: 'Entry not found' });
        }

        entry.exitAt = new Date();

        entry.duration = entry.exitAt - entry.createdAt;

        await entry.save();

        res.send(entry);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const entryCount = async (req, res) => {
    const { userId } = req.params;

    try {
        const totalEntries = await Entry.countDocuments({ user: userId });
        const exitedEntries = await Entry.countDocuments({ user: userId, exitAt: { $ne: null } });
        const nonExitedEntries = await Entry.countDocuments({ user: userId, exitAt: null });

        res.json({ totalEntries, exitedEntries, nonExitedEntries });
    } catch (err) {
        console.error('Error fetching entry counts:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
}

const checkEntry = async (req, res) => {
    const { vehicleNumber } = req.params;
    console.log(vehicleNumber);

    try {
        const existingEntry = await Entry.findOne({ vehicleNumber, exitAt: null });
        console.log(existingEntry);

        if (existingEntry) {
            return res.status(200).json(existingEntry);
        } else {
            return res.status(404).json({ message: 'Non-exited entry not found' });
        }
    } catch (error) {
        console.error('Error checking entry:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createEntry,
    getEntriesByUserId,
    exitEntry,
    entryCount,
    checkEntry
};
