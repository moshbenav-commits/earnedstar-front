"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderEmailTemplate = renderEmailTemplate;
const fs_1 = require("fs");
const path_1 = require("path");
const TEMPLATE_NAMES = ['review-request', 'review-reminder', 'response-notification'];
function emailsDir() {
    const candidates = [
        (0, path_1.join)(process.cwd(), 'emails'),
        (0, path_1.join)(__dirname, '..', '..', 'emails'),
        (0, path_1.join)(__dirname, '..', '..', '..', 'emails'),
    ];
    for (const dir of candidates) {
        if ((0, fs_1.existsSync)((0, path_1.join)(dir, 'review-request.html')))
            return dir;
    }
    return candidates[0];
}
function renderEmailTemplate(name, vars) {
    const filePath = (0, path_1.join)(emailsDir(), `${name}.html`);
    let html = (0, fs_1.readFileSync)(filePath, 'utf8');
    for (const [key, value] of Object.entries(vars)) {
        const token = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        html = html.replace(token, value == null ? '' : String(value));
    }
    return html;
}
//# sourceMappingURL=email-template.util.js.map