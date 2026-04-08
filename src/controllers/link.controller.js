const crypto = require("crypto");
const { prisma } = require("../config/database");

// Generate a random 6-char short code
const generateCode = () => crypto.randomBytes(3).toString("hex");

// POST /api/links
const createLink = async (req, res) => {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(400).json({ success: false, message: "originalUrl is required" });
        }

        const shortCode = generateCode();

        const link = await prisma.link.create({
            data: {
                originalUrl,
                shortCode,
                userId: req.user.id,
            },
        });

        res.status(201).json({
            success: true,
            message: "Short link created",
            data: {
                id: link.id,
                originalUrl: link.originalUrl,
                shortCode: link.shortCode,
                shortUrl: `http://localhost:3000/${shortCode}`,
            },
        });
    } catch (error) {
        console.error("Create link error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /:code — redirect to original URL
const redirect = async (req, res) => {
    try {
        const { code } = req.params;

        const link = await prisma.link.update({
            where: { shortCode: code },
            data: { clicks: { increment: 1 } },
        });

        return res.redirect(link.originalUrl);
    } catch (error) {
        console.error("Redirect error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/links/my — get all links for the logged-in user
const getMyLinks = async (req, res) => {
    try {
        const links = await prisma.link.findMany({
            where: { userId: req.user.id },
            select: {
                id: true,
                originalUrl: true,
                shortCode: true,
                clicks: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        res.json({
            success: true,
            data: links.map(link => ({
                ...link,
                shortUrl: `http://localhost:3000/${link.shortCode}`,
            })),
        });
    } catch (error) {
        console.error("Get my links error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createLink, redirect, getMyLinks };