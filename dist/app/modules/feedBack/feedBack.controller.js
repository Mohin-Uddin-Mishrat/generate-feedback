"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedback_controllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../utils/catch_async"));
const manage_response_1 = __importDefault(require("../../utils/manage_response"));
const feedBack_service_1 = require("./feedBack.service");
const create_feedback = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield feedBack_service_1.feedback_services.create_feedback_into_db(req.body);
    (0, manage_response_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Feedback submitted and analysed successfully!",
        data: result,
    });
}));
const get_all_feedbacks = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        search: req.query.search,
    };
    const { feedbacks, total } = yield feedBack_service_1.feedback_services.get_all_feedbacks_from_db(query);
    (0, manage_response_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Feedbacks fetched successfully!",
        data: feedbacks,
        meta: { total },
    });
}));
const get_feedback_by_id = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield feedBack_service_1.feedback_services.get_feedback_by_id_from_db(req.params.id);
    (0, manage_response_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Feedback fetched successfully!",
        data: result,
    });
}));
const delete_feedback = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield feedBack_service_1.feedback_services.delete_feedback_from_db(req.params.id);
    (0, manage_response_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Feedback deleted successfully!",
        data: result,
    });
}));
exports.feedback_controllers = {
    create_feedback,
    get_all_feedbacks,
    get_feedback_by_id,
    delete_feedback,
};
