"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("./routes/auth"));
const photos_1 = __importDefault(require("./routes/photos"));
const comments_1 = __importDefault(require("./routes/comments"));
const errorHandler_1 = require("./middleware/errorHandler");
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use((0, morgan_1.default)('combined'));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/photos', photos_1.default);
app.use('/api/comments', comments_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
// Serve static files from client/dist
app.use(express_1.default.static(path_1.default.join(__dirname, '../../client/dist/be-nice-client/browser')));
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
